
import { PaymentMethod } from "./enum";

export class AddSaleOrderItemModel {
    idProduct!:number;
    quantity!:number;
    unitPrice!:number;
}

export class AddSaleOrderModel {
    idEvent?: number | null;
    customerName?: string | null;
    paymentMethod?: PaymentMethod;
    discountAmount?: number;
    notes?: string;
    items!: AddSaleOrderItemModel[];
}


export class SaleOrderModel {
    idSale!:number;
    saleNumber!: string;
    idEvent!:number | null;
    createdBy!: number;
    customerName!:string | null;
    saleDate!: Date;
    saleStatus!: string;
    paymentMethod!: PaymentMethod;
    subtotal!:number;
    discountAmount!:number;
    totalAmount!: number;
    notes!:string;
    createdAt!:Date;
    updatedAt!:Date;

    eventName?: string| null;
    createdByName?: string;

}