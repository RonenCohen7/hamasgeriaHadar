import { PaymentMethod } from "./enum";


// ==========================================
// Sale Order
// ==========================================

export class SaleOrderModel {

    idSale!: number;
    saleNumber!: string;

    idCustomer!: number | null;
    idVipCard!: number | null;
    idEvent!: number | null;

    createdBy!: number;

    customerName!: string | null;

    saleDate!: Date;
    saleStatus!: string;

    paymentMethod!: PaymentMethod;

    subtotal!: number;
    discountAmount!: number;
    totalAmount!: number;

    notes!: string | null;

    createdAt!: Date;
    updatedAt!: Date;

    eventName?: string | null;
    createdByName?: string;

    // Event ticket order
    ticketQuantity?: number | null;
    ticketUnitPrice?: number | null;
}


// ==========================================
// Add Sale
// ==========================================

export class AddSaleOrderModel {

    idCustomer?: number | null;
    idVipCard?: number | null;

    customerName?: string | null;

    paymentMethod!: PaymentMethod;

    discountAmount?: number;

    notes?: string | null;

    items!: AddSaleOrderItemModel[];
}


// ==========================================
// Add Sale Item
// ==========================================

export class AddSaleOrderItemModel {

    idProduct!: number;

    quantity!: number;

    unitPrice!: number;
}