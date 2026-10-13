export class EventModel {
    idEvent!: number;
    eventName!: string;
    eventDescription!: string | null;


    image!: string | null;
    coverImage!: string | null;
    coverImageUrl!: string | null;

    eventStart!: string;
    eventEnd!: string;
    doorsOpen!: string | null;
    eventLocation!: string | null;

    maximumGuests!: number | null;
    expectedGuests!: number | null;
    actualGuests!: number | null;
    comfortChairs?: number;

    ticketPrice!: number;
    vipPrice!: number | null;
    eventStatus!: string;

    createdBy!: number;
    createdAt!: string;
    updatedAt!: string;

    isDelete!: number | null;
}

export interface PurchaseEventTicketsModel {
    idEvent: number;
    idCustomer: number;
    quantity: number;
    comfortChairs?: number;
    idVipCard?: number | null;
}
