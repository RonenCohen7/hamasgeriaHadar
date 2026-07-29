export class SaleOrderItemModel {
    idSalesItem!: number;
    idSale!: number;
    idProduct!: number;
    quantity!: number;
    unitPrice!: number;
    lineTotal!: number;
    createdAt!: Date;
}


export class AddSaleOrderItemDto {
    idProduct!: number;
    quantity!: number;
    unitPrice!: number;
}


export class UpdateSalesOrderItemDto {
    quantity?: number;
    unitPrice?: number;
}

export class SaleOrderItemDetailsModel extends SaleOrderItemModel {
    productName!: string;
    catalogNumber!: string;
}