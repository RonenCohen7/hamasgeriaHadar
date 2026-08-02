import { OkPacketParams } from "mysql2";
import { ResourceNotFoundError } from "../models/client-errors";
import { AddSaleOrderDto, SaleOrderModel } from "../models/sale-order-model";
import { dal } from "../utils/dal";
import { getIo } from "../utils/socket";



class SaleOrderService {

    //Get all Sales()
    public async getAllSales(): Promise<SaleOrderModel[]> {

        const sql = `
            SELECT 
                so.id_sale As idSale,
                so.sale_number As saleNumber,
                so.id_event AS idEvent,
                so.created_by AS createdBy,
                so.customer_name AS customerName,
                so.sale_date AS saleDate,
                so.sale_status AS saleStatus,
                so.payment_method AS paymentMethod,
                so.subtotal AS subtotal,
                so.discount_amount AS discountAmount,
                so.total_amount AS totalAmount,
                so.notes AS notes,
                so.created_at AS createdAt,
                so.updated_at AS updatedAt,

                e.event_name AS eventName,
                CONCAT(u.first_name, ' ', u.last_name) AS createdByName

            FROM sales_orders AS so

            LEFT JOIN events AS e
                ON so.id_event = e.id_event

            JOIN users AS u
                ON so.created_by = u.id_user

            ORDER BY so.sale_date DESC
        `;
        const sales = await dal.execute(sql) as SaleOrderModel[];

        return sales;
    }


    //Get one Sale
    public async getOneSale(id: number): Promise<SaleOrderModel> {
        const sql = `
                        SELECT
                so.id_sale AS idSale,
                so.sale_number AS saleNumber,
                so.id_event AS idEvent,
                so.created_by AS createdBy,
                so.customer_name AS customerName,
                so.sale_date AS saleDate,
                so.sale_status AS saleStatus,
                so.payment_method AS paymentMethod,
                so.subtotal AS subtotal,
                so.discount_amount AS discountAmount,
                so.total_amount AS totalAmount,
                so.notes AS notes,
                so.created_at AS createdAt,
                so.updated_at AS updatedAt,

                e.event_name AS eventName,
                CONCAT(u.first_name, ' ', u.last_name) AS createdByName

            FROM sales_orders AS so

            LEFT JOIN events AS e
                ON so.id_event = e.id_event

            JOIN users AS u
                ON so.created_by = u.id_user

            WHERE so.id_sale = ?
        `;
        const sales = await dal.execute(sql, [id]) as SaleOrderModel[];
        const sale = sales[0];
        if (!sale) {
            throw new ResourceNotFoundError(id);
        }
        return sale;

    }

    //Add sale
    public async addSale(sale: AddSaleOrderDto): Promise<SaleOrderModel> {
        const createdBy = 2;
        const saleNumber = `SALE-${Date.now()}`
        const saleStatus = "paid";

        const subTotal = sale.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        const discountAmount = sale.discountAmount ?? 0;




        const totalAmount = Math.max(subTotal - discountAmount, 0);

        const sql = `
            INSERT INTO sales_orders (
                sale_number,
                id_event,
                created_by,
                customer_name,
                sale_status,
                payment_method,
                subtotal,
                discount_amount,
                total_amount,
                notes
            )
                VALUES(?,?,?,?,?,?,?,?,?,?)
        `;

        const value = [
            saleNumber,
            sale.idEvent ?? null,
            createdBy,
            sale.customerName ?? null,
            saleStatus,
            sale.paymentMethod ?? null,
            subTotal,
            discountAmount,
            totalAmount,
            sale.notes ?? null
        ];

        const info = await dal.execute(sql, value) as OkPacketParams;

        const idSale = info.insertId!;

        for (const item of sale.items) {

            const stockSql = `
                SELECT product_stock As productStock
                FROM products
                WHERE id_product = ?
            `

            const products = await dal.execute(stockSql,[item.idProduct]) as {productStock:number}[];

            const product = products[0]
            if(!product){
                throw new ResourceNotFoundError(item.idProduct);
            }

            const stockBefore = Number(product.productStock);
            if(stockBefore < item.quantity) {
                throw new Error (`Not enough stock for product ${item.idProduct}`);
            }

            const stockAfter = stockBefore  - item.quantity;


            const itemSql = `
                INSERT INTO sales_order_items(
                    id_sale,
                    id_product,
                    quantity,
                    unit_price
                )
                VALUES(?,?,?,?)
            `;
            const itemValues = [
                idSale,
                item.idProduct,
                item.quantity,
                item.unitPrice
            ];

            await dal.execute(itemSql, itemValues);

            const updateStockSql = `
                UPDATE products
                SET product_stock = ?
                WHERE id_product = ? 
            `;

            const stockInfo = await dal.execute(updateStockSql, [stockAfter, item.idProduct]) as OkPacketParams;
            if (stockInfo.affectedRows === 0){
                throw new Error (`Not enough stock for product ${item.idProduct}`);
            }


            const movementSql = `
                INSERT INTO inventory_movements (
                    id_product,
                    id_event,
                    created_by,
                    movement_type,
                    quantity,
                    stock_before,
                    stock_after,
                    reference_type,
                    reference_id,
                    notes
                )
                VALUES(?,?,?,?,?,?,?,?,?,?)

            `;
            await dal.execute(movementSql, [
                item.idProduct,
                sale.idEvent ?? null,
                createdBy,
                "sale",
                item.quantity,
                stockBefore,
                stockAfter,
                "sale",
                idSale,
                sale.notes?? null
            ])

            getIo().emit("inventory-update", {
                idProduct: item.idProduct,
                idSale,
                idEvent: sale.idEvent ?? null,
                quantitySold: item.quantity,
                stockBefore,
                stockAfter,
                movementType: "sale"
            })
        }
        return await this.getOneSale(idSale);
    }
}

export const saleOrderService = new SaleOrderService();