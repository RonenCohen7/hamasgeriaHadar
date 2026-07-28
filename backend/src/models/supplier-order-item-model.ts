export interface SupplierOrderItemModel {
    idOrderItem: number;
    idOrder: number;
    idProduct: number;
    quantityOrdered: number;
    quantityReceived: number;
    unitCost: number;
    lineTotal: number;
    createdAt: Date;
    productName?: string;
    catalogNumber?: string;
}


export interface AddSupplierOrderItemDto {
    idProduct: number;
    quantityOrdered: number;
    unitConst: number;
}

export interface UpdateSupplierOrderItemDto {
    idProduct?: number;
    quantityReceived?: number;
    unitCost?: number;
}

export interface SupplierOrderDetailModel extends SupplierOrderItemModel {
    productName: string;
    catalogNumber: string;
}