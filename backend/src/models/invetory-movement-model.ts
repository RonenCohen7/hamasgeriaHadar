import { InventoryMovementType, InventoryReferenceType } from "./enum";

export interface InventoryMovementModel {
    idMovement: number;
    idProduct: number;
    idEvent: number | null;
    createdBy: number;
    movementType: InventoryMovementType;
    quantity: number;
    stockBefore: number | null;
    stockAfter: number | null;
    referenceType: InventoryReferenceType;
    referenceId: number | null;
    notes: string | null;
    movementDate: Date;
}


export interface AddInventoryMovementDto {
    idProducts: number;
    idEvent?: number;
    movementType: InventoryMovementType;
    quantity: number;
    referenceType: InventoryReferenceType;
    referenceId: number | null;
    notes?: string;
}

export interface InventoryMovementDetailsModel extends InventoryMovementModel{
    productName: string;
    eventName: string;
    createdByName: string;

}