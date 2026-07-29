import { PaymentMethod, SaleStatus } from "./enum";
import { AddSaleOrderItemDto } from "./sale-order-item-model";

export class SaleOrderModel {
    idSale!: number;
    saleNumber!: string;
    idEvent!: number | null;
    createdBy!: number;
    customerName!: string | null;
    saleDate!: Date;
    saleStatus!: SaleStatus;
    paymentMethod!: PaymentMethod | null;
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
    customerName?: string;
    paymentMethod?: PaymentMethod;
    discountAmount?: number;
    notes?: string;
    items!: AddSaleOrderItemDto[];
}

export class UpdateSaleOrderDto {
    idEvent?: number | null;
    customerName?: string |  null;
    salesStatus?: SaleStatus;
    paymentMethod!: PaymentMethod | null;
    discountAmount?:number;
    notes?: string | null;
}

export class SaleOrderDetailsModel extends SaleOrderModel {
    eventName!: string | null;
    createdByName!: string;
}