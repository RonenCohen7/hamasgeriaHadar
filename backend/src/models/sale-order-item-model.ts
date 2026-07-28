export interface SaleOrderItemModel {
    idSalesItem: number;
    idSale: number;
    idProduct: number;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    createdAt: Date;
}


export interface AddSaleOrderItemDto {
    idProduct: number;
    quantity: number;
    unitPrice: number;
}


export interface UpdateSalesOrderItemDto {
    quantity?: number;
    unitPrice?: number;
}

export interface SaleOrderItemDetailsModel extends SaleOrderItemModel {
    productName: string;
    catalogNumber: string;
}