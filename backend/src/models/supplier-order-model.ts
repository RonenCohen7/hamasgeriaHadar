import { SupplierOrderStatus } from "./enum";
import { AddSupplierOrderItemDto } from "./supplier-order-item-model";


export class SupplierOrderModel {
    idOrder!: number;
    orderNumber!: string;

    idSupplier!: number;
    createdBy!: number;

    orderDate!: Date;
    expectedDeliveryDate!: Date | null;
    receivedDate!: Date | null;

    orderStatus!: SupplierOrderStatus;

    totalCost!: number;
    notes: any;

    createdAt!: Date;
    updatedAt!: Date;

    supplierName?: string;
    createdByName?: string;

}


export class AddSupplierOrderDto {
    idSupplier!: number;
    expectedDeliveryDate?: Date | null;
    notes?: string | null;
    items!: AddSupplierOrderItemDto[];
}

export class UpdateSupplierOrderDto {
    expectedDeliveryDate?: string | null;
    receivedDate?: string | null;
    orderStatus?: SupplierOrderStatus;
    notes?: string | null;
}

