import { OkPacketParams } from "mysql2";
import { ResourceNotFoundError } from "../models/client-errors";
import { SupplierOrderItemModel } from "../models/supplier-order-item-model";
import { dal } from "../utils/dal";

class SupplierOrderItemService {
    //Get All supplier order items
    public async getAllSupplierOrderItems(): Promise<SupplierOrderItemModel[]> {
        const sql = `
            SELECT 
                 soi.id_order_item AS idOrderItem,
                soi.id_order AS idOrder,
                soi.id_product AS idProduct,
                soi.quantity_ordered AS quantityOrdered,
                soi.quantity_received AS quantityReceived,
                (soi.quantity_ordered - soi.quantity_received) AS remainingQuantity,
                soi.unit_cost AS unitCost,
                soi.line_total AS lineTotal,
                soi.created_at AS createdAt,
                p.product_name AS productName,
                p.catalog_number AS catalogNumber,
                p.image_name AS productImageUrl
            FROM supplier_order_items AS soi
            JOIN products AS p
                ON soi.id_product = p.id_product
            ORDER BY soi.id_order_item
        `;

        const orderItems =
            await dal.execute(sql) as SupplierOrderItemModel[];

        return orderItems;
    }


    //Get One supplier order item
    public async getOneSupplierOrderItem(id: number): Promise<SupplierOrderItemModel> {

        const sql = `
        SELECT
            soi.id_order_item AS idOrderItem,
            soi.id_order AS idOrder,
            soi.id_product AS idProduct,
            soi.quantity_ordered AS quantityOrdered,
            soi.quantity_received AS quantityReceived,
            (soi.quantity_ordered - soi.quantity_received) AS remainingQuantity,
            soi.unit_cost AS unitCost,
            soi.line_total AS lineTotal,
            soi.created_at AS createdAt,
            p.product_name AS productName,
            p.catalog_number AS catalogNumber,
            p.image_name AS productImageUrl
        FROM supplier_order_items AS soi
        JOIN products AS p
            ON soi.id_product = p.id_product
        WHERE soi.id_order_item = ?
    `;

        const orderItems = await dal.execute(sql, [id]) as SupplierOrderItemModel[];

        const orderItem = orderItems[0];

        if (!orderItem) {
            throw new ResourceNotFoundError(id);
        }

        return orderItem;
    }

    //Get All items by supplier order
    public async getItemsByOrder(orderId: number): Promise<SupplierOrderItemModel[]> {
        const sql = `
            SELECT 
                soi.id_order_item AS idOrderItem,
                soi.id_order AS idOrder,
                soi.id_product AS idProduct,
                soi.quantity_ordered AS quantityOrdered,
                soi.quantity_received AS quantityReceived,
                 (soi.quantity_ordered - soi.quantity_received) AS remainingQuantity,
                soi.unit_cost AS unitCost,
                soi.line_total AS lineTotal,
                soi.created_at AS createdAt,
                p.product_name AS productName,
                p.catalog_number AS catalogNumber,
                p.image_name AS productImageUrl
            FROM supplier_order_items AS soi
            JOIN products AS p
                ON soi.id_product = p.id_product
            WHERE soi.id_order = ?
            ORDER BY p.product_name
        `;

        const values = [orderId];

        const orderItems =
            await dal.execute(sql, values) as SupplierOrderItemModel[];

        return orderItems;
    }

    // Add new supplier order item:
    public async addSupplierOrderItem(orderItem: SupplierOrderItemModel): Promise<SupplierOrderItemModel> {

        const sql = `
            INSERT INTO supplier_order_items(
                id_order,
                id_product,
                quantity_ordered,
                quantity_received,
                unit_cost
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            orderItem.idOrder,
            orderItem.idProduct,
            orderItem.quantityOrdered,
            orderItem.quantityReceived,
            orderItem.unitCost
        ];

        const info = await dal.execute(sql, values) as OkPacketParams;

        orderItem.idOrderItem = info.insertId!;

        return orderItem;
    }


    // Update supplier order item:
    public async updateSupplierOrderItem(orderItem: SupplierOrderItemModel): Promise<SupplierOrderItemModel> {

        const sql = `
            UPDATE supplier_order_items
            SET
                quantity_ordered = ?,
                quantity_received = ?,
                unit_cost = ?
            WHERE id_order_item = ?
        `;

        const values = [
            orderItem.quantityOrdered,
            orderItem.quantityReceived,
            orderItem.unitCost,
            orderItem.idOrderItem
        ];

        const info = await dal.execute(sql, values) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(
                orderItem.idOrderItem
            );
        }

        return await this.getOneSupplierOrderItem(orderItem.idOrderItem);
    }


    // Delete supplier order item:
    public async deleteSupplierOrderItem(id: number): Promise<void> {

        const item = await this.getOneSupplierOrderItem(id);
        console.log("Order ID", item.idOrder);


        const sql = `
            DELETE FROM supplier_order_items
            WHERE id_order_item = ?
        `;

        const values = [id];

        const info = await dal.execute(sql, values) as OkPacketParams;
        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(id);
        }
        await this.recalculateOrderTotal(item.idOrder);

        const items = await this.getItemsByOrder(item.idOrder);
        if (items.length === 0) {
            await dal.execute(`DELETE FROM supplier_orders WHERE id_order = ?`, [item.idOrder]);
        }

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(id);
        }


    }


    //Calculate total order
    private async recalculateOrderTotal(idOrder: number): Promise<void> {
        const sql = `
        UPDATE supplier_orders
        SET total_cost = (
            SELECT IFNULL(SUM(line_total),0)
            FROM supplier_order_items
            WHERE id_order = ?
        )
        WHERE id_order =?
        `;

        await dal.execute(sql, [idOrder, idOrder]);
    }
}


export const supplierOrderItemService = new SupplierOrderItemService();    
