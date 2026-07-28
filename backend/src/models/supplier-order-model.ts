import { SupplierOrderStatus } from "./enum";

export interface SupplierOrderModel {
    idOrder: number;
    orderNumber: string;

    idSupplier: number;
    createBy: number;

    orderDate: Date;
    expectedDate: Date;
    receivedDate: Date;

    orderStatus: SupplierOrderStatus;

    totalCost: number;
    notes: any;

    createdAt: Date;
    updatedAt: Date;

    supplierName?: string;
    createdByName?: string;

}


export interface AddSupplierOrderDto {
    orderNumber: string;
    idSupplier: number;
    expectedDeliveryDate?: Date | null;
    notes?: string;
    items: AddSupplierOrderDto[];
}

export interface UpdateSupplierOrderDto {
    expectedDeliveryDate?: string | null;
    receivedDate?: string | null;
    orderStatus?: SupplierOrderStatus;
    notes?: string | null;
}

export interface SupplierOrderDetailsModel extends SupplierOrderModel {
    supplierName: string;
    createdByName: string;
}