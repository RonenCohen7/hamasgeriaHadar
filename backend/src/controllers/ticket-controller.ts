import express, { Request, Response, NextFunction } from "express"
import { ticketService } from "../services/ticket-service";


class TicketController {


    public readonly router = express.Router();


    public constructor() {

        this.router.get("/api/customers/:id/tickets", this.getCustomerTickets);

        this.router.get("/api/tickets/qr/:qrToken", this.getTicketByQrToken);

        this.router.patch("/api/tickets/qr/:qrToken/check-in", this.checkInTicket);

        this.router.get("/api/events/:id/attendance", this.getEventAttendance);

    }


    //Get ticket by customer
    private async getCustomerTickets(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const idCustomer = Number(request.params.id);

            if (!Number.isInteger(idCustomer) || idCustomer <= 0) {
                response.status(400).json({
                    message: "Customer Id Must be a positive number"
                })
                return;
            }

            const tickets =
                await ticketService.getCustomerTickets(idCustomer);

            response.json(tickets)

        } catch (err) {
            next(err)
        }
    }



    // Get ticket by Qr Token
    private async getTicketByQrToken(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const qrToken = String(request.params.qrToken);

            if (!qrToken) {
                response.status(400).json({
                    message: "QR token is required"
                })
                return;
            }
            const ticket = await ticketService.getTicketByToken(qrToken);
            if (!ticket) {
                response.status(404).json({
                    message: "Ticket not found"
                })
                return;
            }
            response.json(ticket)



        } catch (err) {
            next(err)
        }
    }



    //Check in ticket
    private async checkInTicket(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const qrToken = String(request.params.qrToken);

            const checkedInBy = Number(request.body.checkedInBy);

            if (!qrToken) {
                response.status(400).json({
                    message: "Qr token is required"
                })
                return;
            }

            if (!Number.isInteger(checkedInBy) || checkedInBy <= 0) {
                response.status(400).json({
                    message: "checkedInBy must be a positive numbers"
                })
                return;
            }
            const ticket = await ticketService.checkInTicket(
                qrToken,
                checkedInBy
            )
            response.json(ticket);


        } catch (err: any) {

            if (err.message === "Ticket already checked in") {
                response.status(409).json({
                    message: err.message
                });
                return;
            }
            next(err)
        }
    }





    //Get Event attendance report
    private async getEventAttendance(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            console.log("GET EVENT ATTENDANCE ROUTE HIT");

            const eventId = Number(request.params.id);

            if (!Number.isInteger(eventId) || eventId <= 0) {
                response.status(400).json({
                    message: "Event Id Must Be a positive Number. "
                });
                return
            }

            const attendance = await ticketService.getEventAttendance(eventId);

            response.json(attendance);


        } catch (err: any) {
            next(err)
        }
    }
}
export const ticketController = new TicketController();