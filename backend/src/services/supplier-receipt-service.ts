import { OkPacketParams } from "mysql2";

import { dal } from "../utils/dal";
import { AddSupplierReceiptDto, SupplierReceiptModel } from "../models/supplier-receipt-model";

class SupplierReceiptService {

    //Create new supplier receipt as draft
    public async createReceipt(receipt: AddSupplierReceiptDto): Promise<SupplierReceiptModel> {

        const receivedBy = 2

        const sql = `
            INSERT INTO supplier_receipts (
                id_order,
                received_by,
                receipt_status,
                notes
            )
            VALUES(?,?,'draft',?)

        `;

        const values = [
            receipt.idOrder,
            receivedBy,
            receipt.notes ?? null
        ];

        const info = await dal.execute(sql, values) as OkPacketParams;

        const idReceipt = info.insertId!;

        //save receipt
        for (const item of receipt.items) {
            const itemSql = `
                INSERT INTO supplier_receipt_items (
                    id_receipt,
                    id_order_item,
                    id_product,
                    quantity_received,
                    quantity_damaged,
                    notes
                )
                VALUES(?,?,?,?,?,?)
            `;

            const itemValues = [
                idReceipt,
                item.idOrderItem,
                item.idProduct,
                item.quantityReceived,
                item.quantityDamaged,
                item.notes ?? null
            ];

            await dal.execute(itemSql, itemValues);
        }
        return await this.getReceiptById(idReceipt);

    }


    //Get Receipt
    public async getReceiptById(idReceipt: number): Promise<SupplierReceiptModel> {

        const sql = `
            SELECT 
                sr.id_receipt AS idReceipt,
                sr.id_order AS idOrder,
                sr.received_by AS receivedBy,
                sr.receipt_status AS receiptStatus,
                sr.received_at AS receivedAt,
                sr.notes,
                sr.created_at AS createdAt,
                sr.updated_at AS updatedAt
            FROM supplier_receipts AS sr
            WHERE sr.id_receipt = ?
        `;

        const receipt = await dal.execute(sql, [idReceipt]) as SupplierReceiptModel[];

        return receipt[0];
    }




    //Confirm Receipt
    public async confirmReceipt(idReceipt: number): Promise<SupplierReceiptModel> {

        await dal.transaction(async (connection) => {

            //1 get receipt and lock it
            const [receiptRows]: any = await connection.query(`
                SELECT 
                    id_receipt,
                    id_order,
                    receipt_status
                FROM supplier_receipts
                WHERE id_receipt = ?
                FOR UPDATE
                `, [idReceipt]);

            const receipt = receiptRows[0];

            if (!receipt) {
                throw new Error("Receipt not found")
            }

            if(receipt.receipt_status !== 'draft'){
                throw new Error("Receipt already confirmed or cancelled")
            }

            //2 Get receipt items:
            const [itemsRows]: any = await connection.query(`
                SELECT
                    id_order_item,
                    id_product,
                    quantity_received,
                    quantity_damaged
                FROM supplier_receipt_items
                WHERE id_receipt = ?

                `, [idReceipt]);


            // 3 Update each product;
            for (const item of itemsRows) {
                const quantityAccepted =
                    Number(item.quantity_received) - Number(item.quantity_damaged);

                if (quantityAccepted < 0) {
                    throw new Error("Damaged quantity cannot exceed received quantity");
                }


                const [orderItemRows]: any = await connection.query(`

                    SELECT
                        quantity_ordered,
                        quantity_received
                    FROM supplier_order_items
                    WHERE id_order_item = ?
                    FOR UPDATE
                    `,[item.id_order_item]);

                    const orderItem = orderItemRows[0];

                    if(!orderItem){
                        throw new Error("Supplier order item not found");
                    }

                    const remaining = Number(orderItem.quantity_ordered) - Number(orderItem.quantity_received);

                    if(quantityAccepted > remaining){
                        throw new Error(`Received quantity exceeds remaining ordered quantity. Remaining: ${remaining}`)
                    }



                //Add only good product to stock
                await connection.query(`

                UPDATE products
                SET product_stock = product_stock + ? 
                WHERE id_product = ?

                `, [quantityAccepted, item.id_product]);


                //Update cumulative received quantity
                await connection.query(`
                        UPDATE supplier_order_items
                        SET quantity_received = quantity_received + ?
                        WHERE id_order_item = ?
                    `,[quantityAccepted, item.id_order_item])
            }

            //4 confirm receipt
            await connection.query(`
                UPDATE supplier_receipts
                SET
                    receipt_status = 'confirmed',
                    confirmed_at = NOW()
                WHERE id_receipt = ?
                `,[idReceipt])



            //5 order status
            const [remainingRows]: any = await connection.query(`

                    SELECT COUNT(*) AS remaining
                    FROM supplier_order_items
                    WHERE id_order = ? 
                        AND quantity_received < quantity_ordered
                `,[receipt.id_order]);

            const newOrderStatus = remainingRows[0].remaining == 0 ? "received" : "partially_received";

            await connection.query(`
                    UPDATE supplier_orders
                    SET
                        order_status = ?,
                        received_date = CASE 
                            WHEN ? = 'received' THEN NOW()
                            ELSE received_date
                        END
                    WHERE id_order = ?
                `,[newOrderStatus, newOrderStatus,receipt.id_order]);

        })
        return await this.getReceiptById(idReceipt);
    }

}


export const supplierReceiptService = new SupplierReceiptService();