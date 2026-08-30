
export interface TicketModel {
    idTicket: number;
    isSale:number;
    idEvent:number;
    idCustomer: number | null;

    ticketNumber: string;
    qrToken: string;
    qrCodeDataUrl?: string;

    
    ticketStatus: "valid" | "checked_in" | "cancelled" | "refunded";
    ticketSource: "website" | "phone" | "walk_in" | "other"

    checkedInAt: string | null;

    customerFirstName: string | null;
    customerLastName: string | null;
    customerPhone : string | null;
    customerEmail: string | null;

    eventName: string;
    eventStart: string;
    eventLocation: string | null;

    saleStatus: string;
    ticketQuantity: number | null;
    ticketUnitPrice: number | null;
}


