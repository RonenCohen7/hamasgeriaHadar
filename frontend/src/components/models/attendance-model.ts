export interface AttendanceModel {

    idTicket: number;
    idEvent: number;
    idCustomer: number | null;

    ticketNumber: string;
    ticketSource: string;

    checkedInAt: string;
    checkedInBy: number | null;

    customerFirstName: string | null;
    customerLastName: string | null;
    customerPhone: string |null;
    customerEmail:string |null;


    employeeFirstName: string | null;
    employeeLastName: string | null;




}