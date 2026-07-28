export interface EventInventoryModel {
    idEventInventory: number;
    idEvent: number;
    idProduct: number;
    openingQuantity: number;
    quantitySold: number;
    quantityReturned: number;
    damagedQuantity: number;
    quantityAllocated: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface AddEventInventoryDto {
    idProduct: number;
    openingQuantity: number;
}

export interface UpdateEventInventoryDto {
    // openingQuantity?: number;
    soldQuantity?: number;
    // damagedQuantity?: number;
    quantityReturned?: number;
}

export interface EventInventoryDetailsModel
    extends EventInventoryModel {
    eventName: string;
    productName: string;
    catalogNumber: string;
    remainingQuantity: number;
}