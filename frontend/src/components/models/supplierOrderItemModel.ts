export interface SupplierOrderItemModel {
    idOrderItem: number;
    idOrder: number;

    idProduct: number;

    quantityOrdered: number;
    quantityReceived: number;

    remainingQuantity?: number;
    
    unitCost: number;
    lineTotal: number;

    createdAt: string;

    productName?:string;
    catalogNumber?: string;
    productImage?: string;
    productImageUrl?: string | null;
}

export interface AddSupplierOrderItemModel {
    idProduct: number;
    quantityOrdered: number;
    unitCost: number;
}