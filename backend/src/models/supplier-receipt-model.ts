export type SupplierReceiptStatus =
    | "draft"
    | "confirmed"
    | "cancelled";


export class SupplierReceiptModel {

    idReceipt!: number;
    idOrder!: number;
    receivedBy!: number;

    receiptStatus!: SupplierReceiptStatus;

    receivedAt!: Date;
    confirmedAt!: Date | null;

    notes!: string | null;

    createdAt!: Date;
    updatedAt!: Date;
}


export class SupplierReceiptItemModel {

    idReceiptItem!: number;
    idReceipt!: number;

    idOrderItem!: number;
    idProduct!: number;

    quantityReceived!: number;
    quantityDamaged!: number;

    notes!: string | null;

    createdAt!: Date;

    productName?: string;
    catalogNumber?: string;
    productImage?: string;
}


export class AddSupplierReceiptDto {

    idOrder!: number;
    notes?: string | null;

    items!: AddSupplierReceiptItemDto[];
}


export class AddSupplierReceiptItemDto {

    idOrderItem!: number;
    idProduct!: number;

    quantityReceived!: number;
    quantityDamaged!: number;

    notes?: string | null;
}