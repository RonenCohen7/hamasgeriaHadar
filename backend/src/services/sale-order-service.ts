import { OkPacketParams } from "mysql2";
import { ResourceNotFoundError } from "../models/client-errors";
import { AddSaleOrderDto, PurchaseEventTicketsDto, SaleOrderModel } from "../models/sale-order-model";
import { dal } from "../utils/dal";
import { getIo } from "../utils/socket";
import { sanitizeText } from "../utils/sanitize";
import { EventStatus, PaymentMethod, SaleStatus } from "../models/enum";
import { vipCardService } from "./vip-card-service";
import crypto from "crypto";
import { makeService } from "./make-service";

class SaleOrderService {

    //Get all Sales()
    public async getAllSales(): Promise<SaleOrderModel[]> {

        const sql = `
            SELECT 
                so.id_sale As idSale,
                so.sale_number As saleNumber,
                so.id_event AS idEvent,
                so.created_by AS createdBy,
                
                COALESCE(
                NULLIF(so.customer_name, ''),
                CONCAT(c.first_name, ' ', c.last_name)
                        ) AS customerName,

                so.sale_date AS saleDate,
                so.sale_status AS saleStatus,
                
                so.payment_method AS paymentMethod,
                so.payment_reference AS paymentReference,
                so.external_document_id AS externalDocumentId,
                so.external_document_number AS externalDocumentNumber,

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
            
            LEFT JOIN customers AS c
                ON so.id_customer = c.id_customer
            
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
                so.id_customer AS idCustomer,
                so.id_vip_card AS idVipCard,
                so.ticket_quantity AS ticketQuantity,
                so.ticket_unit_price AS ticketUnitPrice,
                so.id_event AS idEvent,
                so.created_by AS createdBy,
            
                COALESCE(
                    NULLIF(so.customer_name, ''),
                    CONCAT(c.first_name, ' ', c.last_name)
                    ) AS customerName,

                so.sale_date AS saleDate,
                so.sale_status AS saleStatus,
                
                so.payment_method AS paymentMethod,
                so.payment_reference AS paymentReference,
                so.external_document_id AS externalDocumentId,
                so.external_document_number AS externalDocumentNumber,

                
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

            LEFT JOIN customers AS c
                ON so.id_customer = c.id_customer

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
        if (sale.customerName) {
            sale.customerName = sanitizeText(sale.customerName);
        }

        if (sale.notes) {
            sale.notes = sanitizeText(sale.notes);
        }

        if (!sale.items || sale.items.length === 0) {
            throw new Error("Sale must contain at least one item");
        }

        if (!sale.paymentMethod) {
            throw new Error("Payment method is required");
        }

        const createdBy = 2;
        const saleNumber = `SALE-${Date.now()}`
        const saleStatus = "paid"

        const subTotal = sale.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

        const discountAmount = sale.discountAmount ?? 0;

        const totalAmount = Math.max(subTotal - discountAmount, 0);


        //valid all product stock
        const stockData: {
            idProduct: number;
            stockBefore: number;
            stockAfter: number;
        }[] = [];

        for (const item of sale.items) {
            const stockSql = `
                SELECT
                    product_stock As productStock
                FROM products
                WHERE id_product = ?
            `;
            const products = await dal.execute(stockSql, [item.idProduct]) as { productStock: number }[];

            const product = products[0];

            if (!product) {
                throw new ResourceNotFoundError(item.idProduct);
            }

            const stockBefore = Number(product.productStock)

            if (stockBefore < item.quantity) {
                throw new Error(`Not enough stock for product ${item.idProduct}`);
            }

            stockData.push({
                idProduct: item.idProduct,
                stockBefore,
                stockAfter: stockBefore - item.quantity
            });
        }

        // Create Sale 
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
            sale.paymentMethod,
            subTotal,
            discountAmount,
            totalAmount,
            sale.notes ?? null
        ];

        const info = await dal.execute(sql, value) as OkPacketParams;

        const idSale = info.insertId!;


        //Add item + Update stock
        for (const item of sale.items) {

            const stock = stockData.find(data => data.idProduct === item.idProduct);

            if (!stock) {
                throw new Error(`Stock data missing for product ${item.idProduct}`);
            }

            //Sale item
            const sql = `
            INSERT INTO sales_order_items(
                id_sale,
                id_product,
                quantity,
                unit_price
            )VALUES (?,?,?,?)
            `;

            await dal.execute(sql, [idSale, item.idProduct, item.quantity, item.unitPrice]);

            //Update Stock;
            const updateSql = `
            UPDATE products
            SET product_stock =?
            WHERE id_product =?
        `;

            const stockInfo = await dal.execute(updateSql, [stock.stockAfter, item.idProduct]) as OkPacketParams;

            if (stockInfo.affectedRows === 0) {
                throw new Error(`Failed updating stock for product ${item.idProduct}`)
            }


            //Inventory movement
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
                stock.stockBefore,
                stock.stockAfter,
                "sale",
                idSale,
                sale.notes ?? null
            ])

            //Socket update
            getIo().emit("inventory-update", {
                idProduct: item.idProduct,
                idSale,
                idEvent: sale.idEvent ?? null,
                quantitySold: item.quantity,
                stockBefore: stock.stockBefore,
                stockAfter: stock.stockAfter,
                movementType: "sale"
            })
        }



        if (sale.paymentMethod === PaymentMethod.VIPCard && sale.idVipCard) {
            await vipCardService.chargeBalance(
                sale.idVipCard,
                totalAmount,
                `Quick sale ${saleNumber}`
            )
        }


        return await this.getOneSale(idSale);
    }



    //Sale tickets
    public async PurchaseEventTickets(order: PurchaseEventTicketsDto): Promise<SaleOrderModel> {

        if (!Number.isInteger(order.idEvent) || order.idEvent <= 0) {
            throw new Error("Invalid event id")
        }

        if (!Number.isInteger(order.idCustomer) || order.idCustomer <= 0) {
            throw new Error("Invalid customer id")
        }

        if (!Number.isInteger(order.quantity) || order.quantity <= 0) {
            throw new Error("Ticket quantity must be  greater then zero")
        }



        const eventSql = `
            SELECT
                id_event AS idEvent,
                event_name AS eventName,
                maximum_Guests As maximumGuests,
                expected_Guests As expectedGuests,
                ticket_price AS ticketPrice,
                vip_price AS vipPrice,
                event_status AS eventStatus
            FROM events
            WHERE id_event = ? 
            AND is_deleted = 0
        `;

        const events = await dal.execute(eventSql, [order.idEvent]) as {
            idEvent: number;
            eventName: string;
            maximumGuests: number | null;
            expectedGuests: number | null;
            ticketPrice: number;
            vipPrice: number;
            event_status: string;

        }[];

        const event = events[0];

        if (!event) {
            throw new ResourceNotFoundError(order.idEvent);
        }

        if (event.event_status === EventStatus.Cancelled) {
            throw new Error("This Event has been cancelled")
        }

        const maximumGuests = Number(event.maximumGuests ?? 0);

        const expectedGuests = Number(event.expectedGuests ?? 0);

        const availablePlaces = maximumGuests - expectedGuests;

        if (order.quantity > availablePlaces) {
            throw new Error(`Only ${availablePlaces} places are available for this event`)
        }



        //check price and vip price
        const regularPrice = Number(event.ticketPrice);

        const vipPrice =
            event.vipPrice !== null
                ? Number(event.vipPrice)
                : regularPrice;

        let ticketUnitPrice = regularPrice;

        if (order.idVipCard != null) {

            const vipCard = await vipCardService.getCardById(order.idVipCard);

            if (vipCard.cardStatus !== "active") {
                throw new Error("VIP card is not active")
            }

            if (vipCard.idCustomer !== order.idCustomer) {
                throw new Error("VIP card does not belong to this customer")
            }

            ticketUnitPrice = vipPrice;

        }

        const totalAmount = ticketUnitPrice * order.quantity;

        //create sale 

        const saleNumber = `EVENT-${Date.now()}`
        const createdBy = 2; //number id of Hadar levi manager


        const saleSql = `
            INSERT INTO sales_orders (
                sale_number,
                id_event,
                id_customer,
                id_vip_card,
                ticket_quantity,
                ticket_unit_price,
                created_by,
                sale_status,
                payment_method,
                subtotal,
                discount_amount,
                total_amount,
                notes
            )
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
        `;

        const saleValues = [
            saleNumber,
            order.idEvent,
            order.idCustomer,
            order.idVipCard ?? null,
            order.quantity,
            ticketUnitPrice,
            createdBy,
            "open",
            order.paymentMethod ?? null,
            totalAmount,
            0,
            totalAmount,
            `EVENT ticket order - ${event.eventName}`
        ];

        const info = await dal.execute(saleSql, saleValues) as OkPacketParams;
        const idSale = info.insertId!;

        console.log("INSERT INFO:", info);
        console.log("NEW SALE ID:", idSale);

        return await this.getOneSale(idSale)

    }

    // Report Bit payment - waiting for admin confirmation
    public async reportPayment(idSale: number): Promise<SaleOrderModel> {

        const sale = await this.getOneSale(idSale);

        if (sale.saleStatus !== "open") {
            throw new Error("Sale is not open");
        }

        const sql = `
        UPDATE sales_orders
        SET
            sale_status = ?,
            payment_method = ?
        WHERE id_sale = ?
    `;

        await dal.execute(sql, [
            "payment_reported",
            PaymentMethod.Bit,
            idSale
        ]);

        return await this.getOneSale(idSale);
    }


    //Complete Pay Sale
    public async completePayment(idSale: number, paymentMethod: string, idVipCard: number | null): Promise<SaleOrderModel> {

        const sale = await this.getOneSale(idSale)

        if (!sale) {
            throw new ResourceNotFoundError(idSale);
        }


        //Prevent double payment
        if (sale.saleStatus == "paid") {
            return sale
        }

        if (paymentMethod === PaymentMethod.Bit && sale.saleStatus !== "payment_reported") {
            throw new Error("Bit payment has not been reported yet")
        }



        console.log("=== COMPLETE VIP PAYMENT ===");
        console.log("paymentMethod:", paymentMethod);
        console.log("idVipCard:", idVipCard);
        console.log("total:", sale.totalAmount);


        //Check if pay with VIP Card
        if (paymentMethod == "vip_card" && idVipCard) {

            console.log(">>> CHARGE BALANCE RUNNING");

            await vipCardService.chargeBalance(idVipCard, Number(sale.totalAmount),
                `Event Ticket #${sale.idSale}`)
        }

        const sql = `
            UPDATE sales_orders
            SET
                sale_status = ?,
                payment_method = ?,
                id_vip_card = ?
            WHERE id_sale = ?
        `;

        await dal.execute(sql, [
            "paid",
            paymentMethod,
            idVipCard,
            idSale
        ])


        //if this sale belong to an event,
        //update expected guests by purchased ticket quantity

        if (sale.idEvent && sale.ticketQuantity) {

            const updateEventSql = `
                UPDATE events
                SET expected_guests = COALESCE(expected_guests,0) + ?
                WHERE id_event = ?
                    AND is_deleted = 0
            `;


            const updateInfo = await dal.execute(updateEventSql, [
                sale.ticketQuantity,
                sale.idEvent
            ]) as OkPacketParams;

            console.log("EVENT UPDATE INFO:", updateInfo);

            console.log(`EVENT GUESTS UPDATE: event=${sale.idEvent}, +${sale.ticketQuantity}`);

        }

        //Create tickets after payments
        if (sale.idEvent && sale.ticketQuantity) {

            //prevent duplicate ticket
            const existingTicketsSql = `
                SELECT COUNT(*) AS count
                FROM tickets
                WHERE id_sale =?
            `;
            const existingTickets = await dal.execute(existingTicketsSql, [idSale]) as { count: number }[];

            const existingCount = Number(existingTickets[0].count);

            if (existingCount == 0) {
                for (let i = 0; i < sale.ticketQuantity; i++) {
                    const ticketNumber =
                        `TKT-${idSale}-${i + 1}-${Date.now()}`;

                    const qrToken =
                        crypto.randomBytes(32).toString("hex");

                    const ticketSql = `
                        INSERT INTO tickets (
                            id_sale,
                            id_event,
                            id_customer,
                            ticket_number,
                            qr_token,
                            ticket_status,
                            ticket_source
                        )
                        VALUES (?,?,?,?,?,?,?)
                    `;

                    await dal.execute(ticketSql, [
                        idSale,
                        sale.idEvent,
                        sale.idCustomer ?? null,
                        ticketNumber,
                        qrToken,
                        "valid",
                        "website"
                    ])
                }
            }

        }

        const completedSale = await this.getOneSale(idSale)

        try {
            await makeService.sendNewOrder(completedSale)
        } catch (err) {
            console.log("Failed to send paid order to Make", err)
        }

        return completedSale
    }

        //Update Sale Status
    public async updateSaleStatus(
        idSale: number,
        newStatus: SaleStatus
    ): Promise<SaleOrderModel> {

        await dal.transaction(async (connection) => {

            // Get sale and lock it during the transaction.
            const [saleRows]: any = await connection.query(`
                SELECT
                    id_sale,
                    id_event,
                    sale_status,
                    ticket_quantity
                FROM sales_orders
                WHERE id_sale = ?
                FOR UPDATE
            `, [idSale]);

            const sale = saleRows[0];

            if (!sale) {
                throw new ResourceNotFoundError(idSale);
            }

            const currentStatus = sale.sale_status as SaleStatus;

            // Bit payment must be confirmed through completePayment.
            if (
                currentStatus === SaleStatus.PaymentReported &&
                newStatus === SaleStatus.Paid
            ) {
                throw new Error(
                    "Bit payment must be confirmed through the payment confirmation flow"
                );
            }

            // Do not manually move an unpaid sale to paid.
            if (
                currentStatus === SaleStatus.Open &&
                newStatus === SaleStatus.Paid
            ) {
                throw new Error(
                    "Payment must be completed through the payment flow"
                );
            }

            // Cancelled and refunded sales are final.
            // Restoring them requires a dedicated restore flow
            // because tickets and expected_guests were already updated.
            if (
                currentStatus === SaleStatus.Cancelled ||
                currentStatus === SaleStatus.Refunded
            ) {
                // Same status - nothing to change.
                if (currentStatus === newStatus) {
                    return;
                }

                throw new Error(
                    "Cancelled or refunded sale cannot be reopened"
                );
            }

            const allowedStatuses: SaleStatus[] = [
                SaleStatus.Open,
                SaleStatus.Cancelled,
                SaleStatus.Refunded
            ];

            if (!allowedStatuses.includes(newStatus)) {
                throw new Error("Invalid sale status");
            }

            const wasPaid =
                currentStatus === SaleStatus.Paid;

            const isCancellation =
                newStatus === SaleStatus.Cancelled ||
                newStatus === SaleStatus.Refunded;

            // A paid event order is being cancelled/refunded.
            if (
                wasPaid &&
                isCancellation &&
                sale.id_event &&
                sale.ticket_quantity
            ) {

                const ticketStatus =
                    newStatus === SaleStatus.Refunded
                        ? "refunded"
                        : "cancelled";

                // Cancel/refund all active tickets belonging to this sale.
                await connection.query(`
                    UPDATE tickets
                    SET ticket_status = ?
                    WHERE id_sale = ?
                      AND ticket_status IN ('valid', 'checked_in')
                `, [
                    ticketStatus,
                    idSale
                ]);

                // Remove guests that were added when payment was completed.
                await connection.query(`
                    UPDATE events
                    SET expected_guests =
                        GREATEST(
                            COALESCE(expected_guests, 0) - ?,
                            0
                        )
                    WHERE id_event = ?
                      AND is_deleted = 0
                `, [
                    sale.ticket_quantity,
                    sale.id_event
                ]);
            }

            // Update sale status.
            await connection.query(`
                UPDATE sales_orders
                SET sale_status = ?
                WHERE id_sale = ?
            `, [
                newStatus,
                idSale
            ]);
        });

        return await this.getOneSale(idSale);
    }
 

}

export const saleOrderService = new SaleOrderService();