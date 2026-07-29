import { SupplierOrderStatus } from "./enum";

export class SupplierOrderModel {
    idOrder!: number;
    orderNumber!: string;

    idSupplier!: number;
    createdBy!: number;

    orderDate!: Date;
    expectedDeliveryDate!: Date;
    receivedDate!: Date;

    orderStatus!: SupplierOrderStatus;

    totalCost!: number;
    notes: any;

    createdAt!: Date;
    updatedAt!: Date;

    supplierName?: string;
    createdByName?: string;

}


export class AddSupplierOrderDto {
    orderNumber!: string;
    idSupplier!: number;
    expectedDeliveryDate?: Date | null;
    notes?: string;
    items!: AddSupplierOrderDto[];
}

export class UpdateSupplierOrderDto {
    expectedDeliveryDate?: string | null;
    receivedDate?: string | null;
    orderStatus?: SupplierOrderStatus;
    notes?: string | null;
}

export class SupplierOrderDetailsModel extends SupplierOrderModel {
    supplierName!: string;
    createdByName!: string;
}