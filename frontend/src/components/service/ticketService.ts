
import axios from "axios";
import type { TicketModel } from "../models/ticket-model";
import { appConfig } from "../utils/app-config";


class TicketService {
    //Get Customer tickets
    public async getCustomerTickets(idCustomer: number):Promise<TicketModel[]>{

        const response = await axios.get<TicketModel[]>(
            `${appConfig.customersUrl}/${idCustomer}/tickets`
        )
        return response.data;
        
    }



    // Get ticket by QR token
    public async getTicketByQrToken(qrToken: string):Promise<TicketModel>{
        const response = await axios.get<TicketModel>(
            `${appConfig.ticketsUrl}/qr/${qrToken}`
        )
        return response.data;
    }


    //Check in ticket
    public async checkInTicket(qrToken: string, checkedInBy: number):Promise<TicketModel>{
        const response = await axios.patch<TicketModel>(
            `${appConfig.ticketsUrl}/qr/${qrToken}/check-in`,
             {
                checkedInBy
            }
        )
        return response.data;
    }



}

export const ticketService = new TicketService();