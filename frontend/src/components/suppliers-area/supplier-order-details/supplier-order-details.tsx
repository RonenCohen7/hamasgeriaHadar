import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaClipboardList,
    FaMoneyBillWave,
    FaStore,
    FaUser
} from "react-icons/fa";

import "./supplier-order-details.css";

import { useTitle } from "../../utils/UseTitle";
import type { SupplierOrderModel } from "../../models/supplierOrderModel";
import type { SupplierOrderItemModel } from "../../models/supplierOrderItemModel";

import { supplierOrderService } from "../../service/supplierOrderService";
import { notificationService } from "../../service/notificationService";
import { dialogService } from "../../service/dialogService";
import { appConfig } from "../../utils/app-config";
import { supplierReceiptService } from "../../service/supplierReceiptService";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n/i18n";



export function SupplierOrderDetails() {
    const { t } = useTranslation();
    const isRtl = i18n.language == "he";

    useTitle("Supplier Order Details");


    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState<SupplierOrderModel | null>(null);

    const [items, setItems] = useState<SupplierOrderItemModel[]>([]);

    const [editingItem, setEditingItems] = useState<SupplierOrderItemModel | null>(null);

    const [editQuantityValue, setEditQuantityValue] = useState<number>(0);

    const [receiveQuantity, setReceiveQuantity] = useState<Record<number, number>>({})

    const [damagedQuantity, setDamagedQuantity] = useState<Record<number, number>>({});


    useEffect(() => {

        if (!id) return;

        supplierOrderService
            .getOrderItems(Number(id))
            .then(itemsFromApi => {
                setItems(itemsFromApi);
            })
            .catch(err => {

                console.log(err);

                notificationService.error(
                    "Failed to load order products."
                );
            });


        supplierOrderService
            .getOneSupplierOrder(Number(id))
            .then(orderFromApi => {
                setOrder(orderFromApi);
            })
            .catch(err => {

                console.log(err);

                notificationService.error(
                    "Failed to load supplier order."
                );
            });

    }, [id]);


    function editQuantity(item: SupplierOrderItemModel) {

        setEditingItems(item);
        setEditQuantityValue(item.quantityOrdered);
    }


    async function saveQuantity() {

        if (!editingItem) return;

        try {

            const updatedOrderItem: SupplierOrderItemModel = {
                ...editingItem,
                quantityOrdered: editQuantityValue
            };

            const result =
                await supplierOrderService.updateOrderItem(
                    updatedOrderItem
                );

            setItems(currentItems =>
                currentItems.map(item =>
                    item.idOrderItem === result.idOrderItem
                        ? result
                        : item
                )
            );

            setEditingItems(null);

            notificationService.success(
                "Quantity updated successfully"
            );

        }
        catch (err: any) {

            console.log(err);

            notificationService.error(
                "Failed to update quantity"
            );
        }
    }


    async function deleteItemFromOrder(
        idOrderItem: number
    ) {

        const ok = await dialogService.confirm(
            "Delete Product",
            "Are you sure you want to delete this order from",
            "Delete",
            "Cancel"
        );

        if (!ok) return;

        try {

            await supplierOrderService.deleteItemFromOrder(
                idOrderItem
            );

            const remainingItems =
                items.filter(
                    item => item.idOrderItem !== idOrderItem
                );

            if (remainingItems.length === 0) {

                notificationService.success(
                    "Order deleted successfully"
                );

                navigate("/supplier-orders");

                return;
            }

            setItems(remainingItems);

            const updatedOrder =
                await supplierOrderService
                    .getOneSupplierOrder(Number(id));

            setOrder(updatedOrder);

            notificationService.success(
                "Product removed successfully"
            );

        }
        catch (err: any) {

            console.log(err);

            notificationService.error(
                "Failed to delete item from order"
            );
        }
    }


    async function advanceOrderStatus() {

        if (!order) return;

        const nextStatus =
            order.orderStatus === "draft"
                ? "ordered"
                : order.orderStatus === "ordered"
                    ? "partially_received"
                    : order.orderStatus === "partially_received"
                        ? "received"
                        : null;

        if (!nextStatus) return;

        try {

            const updatedOrder: SupplierOrderModel = {
                ...order,
                orderStatus: nextStatus
            };

            const result =
                await supplierOrderService
                    .updateSupplierOrder(updatedOrder);

            setOrder(result);

            notificationService.success(
                "Order status updated"
            );

        }
        catch (err: any) {

            console.log(err);

            notificationService.error(
                "Failed to update order status"
            );
        }
    }


    if (!order) {

        return (
            <div className="supplier-order-loading">
                Loading order...
            </div>
        );
    }


    async function confirmDelivery() {

        try {

            if (!order) return;

            const receiptItems = items
                .map(item => {
                    const quantityReceived = Number(receiveQuantity[item.idOrderItem] ?? 0);

                    const quantityDamaged = Number(damagedQuantity[item.idOrderItem] ?? 0);

                    return {
                        idOrderItem: item.idOrderItem,
                        idProduct: item.idProduct,
                        quantityReceived,
                        quantityDamaged,
                        notes: null
                    };
                })
                .filter(item =>
                    item.quantityReceived > 0 ||
                    item.quantityDamaged > 0
                )


            //Nothing enter
            if (receiptItems.length == 0) {
                dialogService.error("Please Enter received or damaged quantity", "ℹ️")
                return;
            }


            //validate quantity
            for (const receiptItem of receiptItems) {

                const orderItem = items.find(
                    item =>
                        item.idOrderItem == receiptItem.idOrderItem
                );

                if (!orderItem) {
                    dialogService.error(
                        "Order items was not found", "⛔️"
                    )
                    return;
                }

                const remaining = Number(orderItem.remainingQuantity ?? 0);

                const quantityReceived = Number(receiptItem.quantityReceived);

                const quantityDamaged = Number(receiptItem.quantityDamaged);

                if (receiptItem.quantityReceived < 0 || receiptItem.quantityDamaged < 0) {
                    dialogService.error("Quantity Cannot be a negative. ", "⛔️");
                    return;
                }

                if (quantityDamaged > quantityReceived) {
                    dialogService.error(
                        `${orderItem.productName}`, "Damage quantity cannot exceed received quantity"
                    );
                    return;
                }

                const quantityAccepted = quantityReceived - quantityDamaged

                if (quantityAccepted > remaining) {
                    dialogService.error(
                        `${orderItem.productName}`, `Accepted quantity cannot exceed remaining quantity (${remaining}) `
                    )
                    return;
                }


                const payload = {
                    idOrder: order.idOrder,
                    notes: null,
                    items: receiptItems
                };

                console.log("Supplier receipt payload",
                    payload
                );


                const createReceipt =
                    await supplierReceiptService.createReceipt(payload)

                console.log("Create Receipt",
                    createReceipt

                );

                if (!createReceipt?.idReceipt) {
                    throw new Error("Receipt was created without idReceipt")
                }


                const confirmReceipt =
                    await supplierReceiptService.confirmReceipt(createReceipt.idReceipt);

                console.log("Confirmed Receipt", confirmReceipt);

                const [updateOrder, updateItems] = await Promise.all([
                    supplierOrderService.getOneSupplierOrder(order.idOrder),
                    supplierOrderService.getOrderItems(order.idOrder)
                ]);

                setOrder(updateOrder)
                setItems(updateItems)



                setReceiveQuantity({});
                setDamagedQuantity({});

                dialogService.success(
                    "Delivery received successfully", "🍺"
                )

            }
        } catch (err: any) {
            console.log(err, "Confirm delivery error");

            const message =
                err?.response?.data?.message ||
                err?.message || "Failed to receive delivery"

            dialogService.error(
                message, "⛔️"
            )
        }





    }

    return (

        <section className={`supplier-order-details ${isRtl ? "rtl" : "ltr"}`}
            dir={isRtl ? "rtl" : "ltr"}
        >


            {/* ================= HEADER ================= */}

            <header className="supplier-order-details-header">

                <div className="supplier-order-header-content">

                    <span className="supplier-order-eyebrow">
                        {t("supplierOrderDetails.purchaseOrder")}
                    </span>

                    <h1>{order.orderNumber}</h1>

                    <p>
                        {t("supplierOrderDetails.description")}
                    </p>

                </div>


                <div className="supplier-order-header-actions">

                    <div className="header-buttons">
                        <button
                            className="edit-order-button"
                            onClick={() => navigate(`/supplier-orders/${id}/edit`)}
                        >
                            Edit Order
                        </button>


                        <button
                            type="button"
                            className="supplier-order-back-button"
                            onClick={() =>
                                navigate("/supplier-orders")
                            }
                        >
                            <FaArrowLeft />
                            <span>Back</span>
                        </button>




                        {order.orderStatus === "draft" && (

                            <button
                                type="button"
                                className="advance-status-button"
                                onClick={advanceOrderStatus}
                            >
                                {t("supplierOrderDetails.sendOrder")}
                            </button>

                        )}


                        {order.orderStatus === "received" && (

                            <button
                                type="button"
                                className="advance-status-button"
                                disabled
                            >
                                {t("supplierOrderDetails.complete")}
                            </button>

                        )}

                    </div>

                </div>

            </header>


            {/* ================= SPLIT VIEW ================= */}

            <div className="supplier-order-workspace">


                {/* =============== LEFT SIDE =============== */}

                <div className="supplier-order-left-panel">

                    <article className="supplier-order-details-card">


                        {/* Supplier */}

                        <div className="supplier-order-detail-row">

                            <div className="supplier-order-detail-icon">
                                <FaStore />
                            </div>

                            <div>
                                <span>Supplier</span>
                                <strong>{order.supplierName}</strong>
                            </div>

                        </div>


                        {/* Order Date */}

                        <div className="supplier-order-detail-row">

                            <div className="supplier-order-detail-icon">
                                <FaCalendarAlt />
                            </div>

                            <div>

                                <span>{t("supplierOrderDetails.orderDate")}</span>

                                <strong>
                                    {new Date(order.orderDate)
                                        .toLocaleDateString("he-IL")}
                                </strong>

                            </div>

                        </div>


                        {/* Expected Delivery */}

                        <div className="supplier-order-detail-row">

                            <div className="supplier-order-detail-icon">
                                <FaCalendarAlt />
                            </div>

                            <div>

                                <span>Expected Delivery</span>

                                <strong>

                                    {order.expectedDeliveryDate
                                        ? new Date(
                                            order.expectedDeliveryDate
                                        ).toLocaleDateString("he-IL")
                                        : t("supplierOrderDetails.notSpecified")}

                                </strong>

                            </div>

                        </div>


                        {/* Status */}

                        <div className="supplier-order-detail-row">

                            <div className="supplier-order-detail-icon">
                                <FaClipboardList />
                            </div>

                            <div>

                                <span>Status</span>

                                <strong
                                    className={
                                        `supplier-order-status ${order.orderStatus}`
                                    }
                                >
                                    {order.orderStatus}
                                </strong>

                            </div>

                        </div>


                        {/* Total Cost */}

                        <div className="supplier-order-detail-row">

                            <div className="supplier-order-detail-icon">
                                <FaMoneyBillWave />
                            </div>

                            <div>

                                <span>{t("supplierOrderDetails.totalCost")}</span>

                                <strong>
                                    ₪{Number(order.totalCost).toFixed(2)}
                                </strong>

                            </div>

                        </div>


                        {/* Created By */}

                        <div className="supplier-order-detail-row">

                            <div className="supplier-order-detail-icon">
                                <FaUser />
                            </div>

                            <div>

                                <span>Created By</span>

                                <strong>
                                    {order.createdByName ?? t("supplierOrderDetails.unknown")}
                                </strong>

                            </div>

                        </div>


                        {/* Notes */}

                        <div className="supplier-order-notes">

                            <span>{t("supplierOrderDetails.notes")}</span>

                            <p>
                                {order.notes || "No notes"}
                            </p>

                        </div>


                        {/* Products */}

                        <div className="supplier-order-products">

                            <div className="supplier-order-products-header">

                                <h2>
                                    Products in this order
                                </h2>

                                <span>
                                    {items.length} product
                                    {items.length !== 1 ? "s" : ""}
                                </span>

                            </div>


                            <div className="supplier-order-table-wrapper">

                                <table className="supplier-order-product-table">

                                    <thead>

                                        <tr>

                                            <th>Product</th>
                                            <th>Ordered</th>
                                            <th>Received</th>
                                            <th>Remaining</th>
                                            <th>Unit Cost</th>
                                            <th>Total</th>
                                            <th>Edit</th>
                                            <th>Delete</th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {items.map(item => (

                                            <tr key={item.idOrderItem}>

                                                <td className="product-name">
                                                    {item.productName}
                                                </td>

                                                <td className="numeric-cell">
                                                    {Number(
                                                        item.quantityOrdered
                                                    )}
                                                </td>

                                                <td className="numeric-cell">
                                                    {Number(
                                                        item.quantityReceived
                                                    )}
                                                </td>

                                                <td className="numeric-cell">
                                                    {Number(
                                                        item.remainingQuantity ?? 0
                                                    )}
                                                </td>

                                                <td className="numeric-cell">

                                                    ₪{Number(
                                                        item.unitCost
                                                    ).toFixed(2)}

                                                </td>

                                                <td className="numeric-cell line-total">

                                                    ₪{Number(
                                                        item.lineTotal
                                                    ).toFixed(2)}

                                                </td>


                                                <td>

                                                    <button
                                                        type="button"
                                                        className="edit-btn"
                                                        onClick={() =>
                                                            editQuantity(item)
                                                        }
                                                    >
                                                        ✍🏻 Edit
                                                    </button>

                                                </td>


                                                <td>

                                                    <button
                                                        type="button"
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            deleteItemFromOrder(
                                                                item.idOrderItem
                                                            )
                                                        }
                                                    >
                                                        🗑️ Delete
                                                    </button>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </article>

                </div>


                {/* =============== RIGHT SIDE =============== */}

                <aside className="supplier-order-receive-panel">

                    <h2>
                        {t("supplierOrderDetails.receiveDelivery")}
                    </h2>

                    <p>
                        {t("supplierOrderDetails.order")}: {order.orderNumber}
                    </p>


                    {items
                        .filter(item => (item.remainingQuantity ?? 0) > 0)
                        .map(item => (
                            <div key={item.idOrderItem}
                                className="receive-delivery-item">

                                {item.productImageUrl && (
                                    <img
                                        src={`${appConfig.baseUrl}products/images/${item.productImageUrl}`}
                                        alt={item.productName ?? "product"}
                                        className="receive-delivery-product-image"
                                    />
                                )}

                                <h3>{item.productName}</h3>

                                <div className="receive-delivery-stat">

                                    <span>
                                        {t("supplierOrderDetails.ordered")}: {Number(item.quantityOrdered)}
                                    </span>
                                    <span>
                                        {t("supplierOrderDetails.received")}: {Number(item.quantityReceived)}
                                    </span>
                                    <span>
                                        {t("supplierOrderDetails.remaining")}: {Number(item.remainingQuantity ?? 0)}
                                    </span>

                                    <label>
                                        {t("supplierOrderDetails.quantityReceived")}
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        max={Number(item.remainingQuantity ?? 0)}
                                        value={receiveQuantity[item.idOrderItem] ?? 0}
                                        onChange={event => setReceiveQuantity(current => ({
                                            ...current,
                                            [item.idOrderItem]: Number(event.target.value)
                                        }))}


                                    />

                                    <label>
                                        {t("supplierOrderDetails.quantityDamaged")}
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        max={receiveQuantity[item.idOrderItem] ?? 0}
                                        value={damagedQuantity[item.idOrderItem] ?? 0}
                                        onChange={event =>
                                            setDamagedQuantity(current => ({
                                                ...current,
                                                [item.idOrderItem]: Number(event.target.value)
                                            }))
                                        }

                                    />
                                </div>

                            </div>
                        ))}

                    {items.every(
                        items => Number(items.remainingQuantity ?? 0) == 0
                    ) && (
                            <p>
                                {t("supplierOrderDetails.allProductsReceived")}
                            </p>

                        )}

                    {items.some(
                        items => Number(items.remainingQuantity ?? 0) > 0
                    ) && (

                            <button
                                type="button"
                                className="modal-save-button"
                                onClick={confirmDelivery}
                            >
                                {t("supplierOrderDetails.confirmDelivery")}
                            </button>
                        )}

                </aside>

            </div>


            {/* ================= EDIT QUANTITY MODAL ================= */}

            {editingItem && (

                <div className="edit-quantity-modal">

                    <div className="edit-quantity-modal-content">

                        <h2>Edit Quantity</h2>

                        <p>
                            {editingItem.productName}
                        </p>

                        <input
                            type="number"
                            min="1"
                            value={editQuantityValue}
                            onChange={event =>
                                setEditQuantityValue(
                                    Number(event.target.value)
                                )
                            }
                        />


                        <div className="edit-quantity-modal-actions">

                            <button
                                type="button"
                                className="modal-cancel-button"
                                onClick={() =>
                                    setEditingItems(null)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="modal-save-button"
                                onClick={saveQuantity}
                            >
                                Save
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </section>
    );
}