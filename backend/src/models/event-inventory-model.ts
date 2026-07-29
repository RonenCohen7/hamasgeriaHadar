export class EventInventoryModel {
    idEventInventory!: number;
    idEvent!: number;
    idProduct!: number;
    openingQuantity!: number;
    quantitySold!: number;
    quantityReturned!: number;
    damagedQuantity!: number;
    quantityAllocated!: number;
    createdAt!: Date;
    updatedAt!: Date;
}

export class AddEventInventoryDto {
    idProduct!: number;
    openingQuantity!: number;
}

export class UpdateEventInventoryDto {
    // openingQuantity?: number;
    soldQuantity?: number;
    // damagedQuantity?: number;
    quantityReturned?: number;
}

export class EventInventoryDetailsModel
    extends EventInventoryModel {
    eventName!: string;
    productName!: string;
    catalogNumber!: string;
    remainingQuantity!: number;
}