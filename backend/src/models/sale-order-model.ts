import { PaymentMethod, SaleStatus } from "./enum";
import { AddSaleOrderItemDto } from "./sale-order-item-model";

export class SaleOrderModel {
    idSale!: number;
    saleNumber!: string;

    idEvent!: number | null;
    idCustomer!: number | null;
    idVipCard!: number | null;

    ticketQuantity!: number | null;
    ticketUnitPrice!: number | null;


    createdBy!: number;
    customerName!: string | null;
    saleDate!: Date;
    saleStatus!: SaleStatus;

    paymentMethod!: PaymentMethod | null;
    paymentReference!: string | null;
    externalDocumentId!: string | null;
    externalDocumentNumber!: string | null;


    subtotal!: number;
    discountAmount!: number;
    totalAmount!: number;
    notes!: string | null;
    createdAt!: Date;
    updatedAt!: Date;



}

export class AddSaleOrderDto {
    saleNumber!: string;
    idEvent?: number | null;
    idCustomer?: number | null;
    idVipCard?: number | null;

    ticketQuantity?: number | null;
    ticketUnitPrice?: number | null;

    customerName?: string;

    paymentMethod?: PaymentMethod;

    discountAmount?: number;
    notes?: string;
    items!: AddSaleOrderItemDto[];
}

export class UpdateSaleOrderDto {
    idEvent?: number | null;
    customerName?: string | null;
    saleStatus?: SaleStatus;

    paymentMethod!: PaymentMethod | null;
 
    
    discountAmount?: number;
    notes?: string | null;
}

export class PurchaseEventTicketsDto {
    idEvent!: number;
    idCustomer!: number;
    eventName!: string | null
    quantity!: number;

    paymentMethod!: PaymentMethod;
    idVipCard!: number | null;

}


export class SaleOrderDetailsModel extends SaleOrderModel {
    eventName!: string | null;
    createdByName!: string;
}