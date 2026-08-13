export class EventModel {
    idEvent!: number;
    eventName!: string;
    eventDescription!: string | null;


    image!: string | null;
    coverImage!: string | null;
    coverImageUrl!: string | null;

    eventStart!: string;
    eventEnd!: string;
    eventLocation!: string | null;

    maximumGuests!: number | null;
    expectedGuests!: number | null;
    actualGuests!: number | null;

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
    idVipCard?: number | null;
}
