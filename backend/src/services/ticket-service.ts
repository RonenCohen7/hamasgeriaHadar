import { OkPacketParams } from "mysql2";
import { ResourceNotFoundError } from "../models/client-errors";
import { TicketModel } from "../models/ticket-model";
import { dal } from "../utils/dal";
import QRCode from "qrcode";
import { AttendanceModel } from "../models/attendance-model";

class TicketService {

    //Get Customer Ticket
    public async getCustomerTickets(idCustomer: number):Promise<TicketModel[]>{

        const sql = `
            SELECT
                t.id_ticket AS IdTicket,
                t.id_sale AS idSale,
                t.id_event AS idEvent,
                t.id_customer AS idCustomer,

                t.ticket_number AS ticketNumber,
                t.qr_token AS qrToken,
                t.ticket_status AS ticketStatus,
                t.ticket_source AS ticketSource,
                t.checked_in_at AS checkedInAt,

                e.event_name AS eventName,
                e.event_start AS eventStart,
                e.event_location AS eventLocation,

                so.sale_status AS saleStatus,
                so.ticket_quantity AS ticketQuantity,
                so.ticket_unit_price AS ticketUnitPrice

            FROM tickets as t

            JOIN sales_orders AS so 
                ON t.id_sale = so.id_sale

            JOIN events AS e
                ON t.id_event = e.id_event

            WHERE t.id_customer = ?

            ORDER BY e.event_start DESC, t.id_ticket ASC
        `;

        const tickets = await dal.execute(sql, [idCustomer]) as TicketModel[];

        for (const ticket of tickets){
            ticket.qrCodeDataUrl = await QRCode.toDataURL(ticket.qrToken);
        }

        return tickets;
    }



    //Get ticket By Qr Token
    public async getTicketByToken(qrToken:string):Promise<TicketModel | null>{

        const sql = `
            SELECT 
                t.id_ticket AS idTicket,
                t.id_sale AS idSale,
                t.id_event AS idEvent,
                t.id_customer AS idCustomer,

                t.ticket_number AS ticketNumber,
                t.qr_token AS qrToken,
                t.ticket_status AS ticketStatus,
                t.ticket_source AS ticketSource,
                t.checked_in_at AS checkedInAt,

                c.first_name AS customerFirstName,
                c.last_name AS customerLastName,
                c.phone AS customerPhone,
                c.email AS customerEmail,

                e.event_name AS eventName,
                e.event_start AS eventStart,
                e.event_location AS eventLocation,

                so.sale_status AS saleStatus,
                so.ticket_quantity AS ticketQuantity,
                so.ticket_unit_price AS ticketUnitPrice

            FROM tickets AS t

            JOIN sales_orders AS so
                ON t.id_sale = so.id_sale

            JOIN events AS e
                ON t.id_event = e.id_event

            LEFT JOIN customers AS c
                ON t.id_customer = c.id_customer
            
            WHERE t.qr_token = ? 
            LIMIT 1
        `;

        const tickets = await dal.execute(sql,[qrToken]) as TicketModel[];

        return tickets[0] ?? null;
    }




    //Check if QrToken reed
    public async checkInTicket(qrToken: string, checkedInBy:number):Promise<TicketModel | null>{

        //Check if card event exists
        const ticket = await this.getTicketByToken(qrToken);

        if(!ticket) {
            throw new Error ("Ticket not found");
        }

        if(ticket.ticketStatus == "checked_in") {
            throw new Error("Ticket already checked in");
        }

        if(ticket.ticketStatus !== "valid"){
            throw new Error(`Ticket is ${ticket.ticketStatus}`);
        }

        if(ticket.saleStatus !== "paid") {
            throw new Error("Ticket sale is not paid")
        }


        const sql = `
            UPDATE tickets
            SET
                ticket_status = 'checked_in',
                checked_in_at = NOW(),
                checked_in_by = ?
            WHERE qr_token = ?
            AND ticket_status = 'valid'
        `;

        const values = [
            checkedInBy,
            qrToken
        ]

        const result = await dal.execute(sql,values) as OkPacketParams;

        if(result.affectedRows !==1){
            throw new Error("Ticket already checked in")
        }

        await dal.execute(
            `
                UPDATE events
                SET actual_guests = COALESCE(actual_guests, 0) + 1
                WHERE id_event = ?
            `,
            [ticket.idEvent]
        )

        return await this.getTicketByToken(qrToken);
    }




    //Get Event attendance report
    public async getEventAttendance(idEvent: number):Promise<AttendanceModel[]>{

        const sql = `
            SELECT
                t.id_ticket AS idTicket,
                t.id_event AS idEvent,
                t.id_customer AS idCustomer,

                t.ticket_number AS ticketNumber,
                t.ticket_source AS ticketSource,

                t.checked_in_at AS checkedInAt,
                t.checked_in_by AS checkedInBy,

                c.first_name AS customerFirstName,
                c.last_name AS customerLastName,
                c.phone AS customerPhone,
                c.email AS customerEmail,

                u.first_name AS employeeFirstName,
                u.last_name AS employeeLastName
            
            FROM tickets AS t

            LEFT JOIN customers AS c
                ON t.id_customer = c.id_customer

            LEFT JOIN users AS u
                ON t.checked_in_by = u.id_user

            WHERE t.id_event = ?
            AND t.ticket_status = 'checked_in'

            ORDER BY t.checked_in_at ASC
        `;

        return await dal.execute(sql,[idEvent]) as AttendanceModel[];
    }
}

export const ticketService = new TicketService();