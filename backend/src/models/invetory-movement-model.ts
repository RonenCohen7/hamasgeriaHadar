import { InventoryMovementType, InventoryReferenceType } from "./enum";

export class InventoryMovementModel {
    idMovement!: number;
    idProduct!: number;
    idEvent!: number | null;
    createdBy!: number;
    movementType!: InventoryMovementType;
    quantity!: number;
    stockBefore!: number | null;
    stockAfter!: number | null;
    referenceType!: InventoryReferenceType;
    referenceId!: number | null;
    notes!: string | null;
    movementDate!: Date;
}


export class AddInventoryMovementDto {
    idProduct!: number;
    idEvent!: number;
    movementType!: InventoryMovementType;
    quantity!: number;
    referenceType!: InventoryReferenceType;
    referenceId!: number | null;
    notes?: string;
}

export class InventoryMovementDetailsModel extends InventoryMovementModel{
    productName!: string;
    eventName!: string;
    createdByName!: string;

}