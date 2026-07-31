import type { AddSupplierOrderItemModel } from "./supplierOrderItemModel";

export type SupplierOrderStatus =
    | "draft"
    | "ordered"
    | "partially_received"
    | "received"
    | "cancelled";

export interface SupplierOrderModel {
    idOrder: number;
    orderNumber: string;

    idSupplier: number;
    createdBy: number;

    orderDate: string;
    expectedDeliveryDate: string;
    receivedDate: string

    orderStatus: SupplierOrderStatus;

    totalCost: number;
    notes: string;

    createdAt: string;
    updatedAt: string;

    supplierName?: string;
    createdByName?: string;
}


export interface AddSupplierOrderModel {
    idSupplier: number;
    expectedDeliveryDate: string | null;
    notes: string;
    items: AddSupplierOrderItemModel[];

}