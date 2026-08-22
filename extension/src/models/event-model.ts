export interface EventModel {
    idEvent: number;
    eventName: string;
    eventNumber: string;
    eventDescription:string | null;

    coverImage: string | null;
    coverImageUrl: string | null;

    eventStart: string;
    eventEnd: string;

    eventLocation: string;

    maximumGuests:number | null;
    expectedGuests: number | null;
    actualGuests: number | null;

    ticketPrice: number;
    vipPrice: number | null;

    eventStatus: number | null;

    createdBy: number;
    createdAt: string;
    updatedAt: string;
}