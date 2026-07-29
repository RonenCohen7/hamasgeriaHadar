import { OkPacketParams } from "mysql2";
import { ResourceNotFoundError } from "../models/client-errors";
import { SupplierOrderModel } from "../models/supplier-order-model";
import { dal } from "../utils/dal";

class SupplierOrderService {
    //Get All supplier orders;
    public async getAllSupplierOrders(): Promise<SupplierOrderModel[]> {
        const sql = `
            SELECT 
                so.id_order AS idOrder,
                so.order_number AS orderNumber,
                so.id_supplier AS idSupplier,
                so.created_by AS createdBy,
                so.order_date AS orderDate,
                so.expected_delivery_date AS exceptedDeliveryDate,
                so.received_date AS receivedDate,
                so.order_status AS orderStatus,
                so.total_cost AS totalCost,
                so.notes,
                so.created_at As createdAt,
                so.updated_at As updatedAt,
                s.supplier_name As supplierName,
                u.full_name As createdByName
            FROM supplier_orders As so
            JOIN suppliers s
            ON so.id_supplier = s.id_supplier
            JOIN users AS u
            ON so.created_by = u.id_user
            ORDER BY so.order_date DESC
        `;
        const order = await dal.execute(sql) as SupplierOrderModel[];

        return order;
    }


    //Get One supplier order

    public async getOneSupplierOrder(
        id: number
    ): Promise<SupplierOrderModel> {

        const sql = `
            SELECT
                so.id_order AS idOrder,
                so.order_number AS orderNumber,
                so.id_supplier AS idSupplier,
                so.created_by AS createdBy,
                so.order_date AS orderDate,
                so.expected_delivery_date AS expectedDeliveryDate,
                so.received_date AS receivedDate,
                so.order_status AS orderStatus,
                so.total_cost AS totalCost,
                so.notes,
                so.created_at AS createdAt,
                so.updated_at AS updatedAt,
                s.supplier_name AS supplierName,
                u.full_name AS createdByName
            FROM supplier_orders AS so
            JOIN suppliers AS s
                ON so.id_supplier = s.id_supplier
            JOIN users AS u
                ON so.created_by = u.id_user
            WHERE so.id_order = ?
        `;

        const values = [id];

        const orders =
            await dal.execute(sql, values) as SupplierOrderModel[];

        const order = orders[0];

        if (!order) {
            throw new ResourceNotFoundError(id);
        }

        return order;
    }


    // Add new supplier order:
    public async addSupplierOrder(
        order: SupplierOrderModel
    ): Promise<SupplierOrderModel> {

        const sql = `
            INSERT INTO supplier_orders(
                order_number,
                id_supplier,
                created_by,
                expected_delivery_date,
                order_status,
                total_cost,
                notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            order.orderNumber,
            order.idSupplier,
            order.createdBy,
            order.expectedDeliveryDate,
            order.orderStatus,
            order.totalCost,
            order.notes
        ];

        const info =
            await dal.execute(sql, values) as OkPacketParams;

        order.idOrder = info.insertId!;

        return order;
    }


    // Update supplier order:
    public async updateSupplierOrder(
        order: SupplierOrderModel
    ): Promise<SupplierOrderModel> {

        const sql = `
            UPDATE supplier_orders
            SET
                order_number = ?,
                id_supplier = ?,
                expected_delivery_date = ?,
                received_date = ?,
                order_status = ?,
                total_cost = ?,
                notes = ?
            WHERE id_order = ?
        `;

        const values = [
            order.orderNumber,
            order.idSupplier,
            order.expectedDeliveryDate,
            order.receivedDate,
            order.orderStatus,
            order.totalCost,
            order.notes,
            order.idOrder
        ];

        const info =
            await dal.execute(sql, values) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(order.idOrder);
        }

        return order;
    }


    // Delete supplier order:
    public async deleteSupplierOrder(id: number): Promise<void> {

        const sql = `
            DELETE FROM supplier_orders
            WHERE id_order = ?
        `;

        const values = [id];

        const info =
            await dal.execute(sql, values) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(id);
        }
    }
}


export const supplierOrderService = new SupplierOrderService();