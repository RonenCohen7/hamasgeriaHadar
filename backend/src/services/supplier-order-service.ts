import { OkPacketParams } from "mysql2";
import { ResourceNotFoundError } from "../models/client-errors";
import { AddSupplierOrderDto, SupplierOrderModel } from "../models/supplier-order-model";
import { dal } from "../utils/dal";
import { ProductModel } from "../models/product-model";
import { sanitizeText } from "../utils/sanitize";

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
                so.expected_delivery_date AS expectedDeliveryDate,
                so.received_date AS receivedDate,
                so.order_status AS orderStatus,
                so.total_cost AS totalCost,
                so.notes,
                so.created_at As createdAt,
                so.updated_at As updatedAt,
                s.supplier_name As supplierName,
                CONCAT(u.first_name, ' ', u.last_name) AS createdByName
            FROM supplier_orders As so
            JOIN suppliers s
            ON so.id_supplier = s.id_supplier
            JOIN users AS u
            ON so.created_by = u.id_user
            WHERE EXISTS (
                SELECT 1 
                FROM supplier_order_items as soi
                WHERE soi.id_order = so.id_order
                )

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
                CONCAT(u.first_name, ' ', u.last_name) AS createdByName
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
    public async addSupplierOrder(order: AddSupplierOrderDto): Promise<SupplierOrderModel> {
      
        const orderNumber = `PO-${Date.now()}`;
        const createBy = 2;
        const orderStatus = "draft";
        const totalCost = order.items.reduce(
            (sum, item) =>
                sum + item.quantityOrdered * item.unitCost,
            0
        );

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

        const values: (string | number | boolean | Date | null)[] = [
            orderNumber,
            order.idSupplier,
            createBy,
            order.expectedDeliveryDate ?? null,
            orderStatus,
            totalCost,
            order.notes ?? null
        ];

        const info =
            await dal.execute(sql, values) as OkPacketParams;

        const idOrder = info.insertId!;

        for (const item of order.items) {
            const itemSql = `
                INSERT INTO supplier_order_items(
                    id_order,
                    id_product,
                    quantity_ordered,
                    quantity_received,
                    unit_cost
                )
                VALUES(?,?,?,?,?);
            `;
            const itemValues = [
                idOrder,
                item.idProduct,
                item.quantityOrdered,
                0,
                item.unitCost
            ];
            await dal.execute(itemSql, itemValues);
        }
        return await this.getOneSupplierOrder(idOrder);
    }


    // Update supplier order:
    public async updateSupplierOrder(order: SupplierOrderModel): Promise<SupplierOrderModel> {

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

        const info = await dal.execute(sql, values) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(order.idOrder);
        }

        return order;
    }



    //Get Products by Supplier Id
    public async getProductsBySupplier(supplierId: number): Promise<ProductModel[]> {
        const sql = `
          SELECT
            p.id_product AS idProduct,
            p.product_name AS productName,
            p.catalog_number AS catalogNumber,
            p.product_cost AS productCost,
            p.product_price AS productPrice,
            p.product_stock AS productStock,
            p.minimum_stock AS minimumStock,
            p.unit_type AS unitType,
            p.is_active AS isActive,

            ps.supplier_catalog_number AS supplierCatalogNumber,
            ps.supplier_cost AS supplierCost,
            ps.is_preferred_supplier AS isPreferredSupplier

        FROM product_suppliers AS ps

        JOIN products AS p
            ON ps.id_product = p.id_product

        WHERE ps.id_supplier = ?
          AND p.is_active = 1

        ORDER BY p.product_name
        `;
        const products = await dal.execute(sql, [supplierId]) as ProductModel[];

        return products;

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