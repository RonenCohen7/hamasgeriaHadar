export class SupplierOrderItemModel {
    idOrderItem!: number;
    idOrder!: number;
    idProduct!: number;
    quantityOrdered!: number;
    quantityReceived!: number;
    unitCost!: number;
    lineTotal!: number;
    createdAt!: Date;
    productName?: string;
    catalogNumber?: string;
}


export class AddSupplierOrderItemDto {
    idProduct!: number;
    quantityOrdered!: number;
    unitConst!: number;
}

export class UpdateSupplierOrderItemDto {
    idProduct?: number;
    quantityReceived?: number;
    unitCost?: number;
}

export class SupplierOrderDetailModel extends SupplierOrderItemModel {
    productName!: string;
    catalogNumber!: string;
}