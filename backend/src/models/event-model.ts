import { UploadedFile } from "express-fileupload";
import { EventStatus } from "./enum";

export class EventModel {
    idEvent!: number;
    eventName!: string;
    eventDescription!: string | null;


    coverImage!: string | null;
    coverImageUrl!: string | null;


    eventStart!: Date;
    eventEnd!: Date;

    eventLocation!: string | null;
    maximumGuests!: number | null;
    
    expectedGuests!: number | null;
    actualGuests!: number | null;
    
    ticketPrice!: number;
    vipPrice!:number | null
    eventStatus!: EventStatus;
    createdBy!: number;
    createdAt!: Date;
    updatedAt!: Date;
}


export class AddEventDto {
    idEvent!: number;
    eventName!: string;
    eventDescription!: string | null;

    coverImage?: string | null;
    coverImageUrl?: string | null;

    image?: UploadedFile;
    createdBy?: number;
    eventStart!: Date;
    eventEnd!: Date;
    eventLocation?: string;
    eventStatus?: string;
    actualGuests?: number | null;
    maximumGuests?: number;
    expectedGuests?: number;
    ticketPrice?: number;
    vipPrice!:number | null
}


export class UpdateEventDto {
    idEvent!: number;
    eventName?: string;
    
    eventDescription?: string | null;
    actualGuests?: number | null;
    eventStatus?: string;

    coverImage?: string | null;
    coverImageUrl?: string | null;

    image?: UploadedFile;

    eventStart?: string;
    eventEnd?: string;
    eventLocation?: string;

    maximumGuests?: number;
    expectedGuests?: number;
    
    ticketPrice?: number;
    vipPrice!:number | null

}

export class EventSummaryModel extends EventModel {
    totalSalesOrders!: number;
    totalRevenue!: number;
    totalItemSold!: number
}