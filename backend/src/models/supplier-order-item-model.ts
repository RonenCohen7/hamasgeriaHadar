export class SupplierOrderItemModel {
    idOrderItem!: number;
    idOrder!: number;
    idProduct!: number;

    quantityOrdered!: number;
    quantityReceived!: number;

    remainingQuantity?: number;

    unitCost!: number;
    lineTotal!: number;

    createdAt!: Date;
    productName?: string;
    catalogNumber?: string;

    productImage?: string;
    productImageUrl?: string | null;
}

export class AddSupplierOrderItemDto {
    idProduct!: number;
    quantityOrdered!: number;
    unitCost!: number;
}

export class UpdateSupplierOrderItemDto {
    idProduct?: number;
    quantityReceived?: number;
    unitCost?: number;
}