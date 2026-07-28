import { EventStatus } from "./enum";

export interface EventModel {
    idEvent: number;
    eventName: string;
    eventDescription: string| null;
    eventStart: Date;
    eventEnd: Date;
    eventLocation: string | null;
    maximumGuests: number | null;
    expectedGuests:number | null; 
    actualGuests: number | null;
    ticketPrice: number;
    eventStatus: EventStatus;
    createdBy: number;
    createdAt : Date;
    updatedAt: Date;
}


export interface AddEventDto {
    eventName: string;
    eventDescription: string | null;
    eventStart: Date;
    eventEnd: Date;
    eventLocation?: string;
    maximumGuests?: number;
    expectedGuests?: number;
    ticketPrice?:number;
}


export interface UpdateEventDto {
    eventName?: string;
    eventDescription?: string;
    eventStart?: string;
    eventEnd?: string;
    eventLocation?: string;
    maximumGuests?: number;
    expectedGuests?: number;
    ticketPrice?: number;
    eventStatus?: EventStatus;
}

export interface EventSummaryModel extends EventModel {
    totalSalesOrders: number;
    totalRevenue: number;
    totalItemSold: number
}