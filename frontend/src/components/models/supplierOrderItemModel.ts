export interface SupplierOrderItemModel {
    idOrderItem: number;

    idOrder: number;

    idProduct: number;

    quantityOrdered: number;
    quantityReceived: number;

    unitCost: number;
    lineTotal: number;

    createdAt: string;

    productName?:string;
    catalogNumber?: string;
}

export interface AddSupplierOrderItemModel {
    idProduct: number;
    quantityOrdered: number;
    unitCost: number;
}