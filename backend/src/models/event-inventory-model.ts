export class EventInventoryModel {
    idEventInventory!: number;
    idEvent!: number;
    idProduct!: number;

    quantityAllocated!: number;
    quantitySold!: number;
    quantityReturned!: number;
    damagedQuantity!: number;

    createdAt!: Date;
    updatedAt!: Date;
}

export class AddEventInventoryDto {
    idProduct!: number;
    quantityAllocated!: number;
}

export class UpdateEventInventoryDto {
    quantitySold?: number;
    quantityReturned?: number;
    damagedQuantity?: number;
}

export class EventInventoryDetailsModel
    extends EventInventoryModel {

    eventName!: string;
    productName!: string;
    catalogNumber!: string;
    remainingQuantity!: number;
}