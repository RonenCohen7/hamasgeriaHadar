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
import { supplierOrderService } from "../../service/supplierOrderService";
import { notificationService } from "../../service/notificationService";
import type { SupplierOrderItemModel } from "../../models/supplierOrderItemModel";


export function SupplierOrderDetails() {
    console.log("SupplierOrderDetails loaded");
    useTitle("Supplier Order Details");

    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState<SupplierOrderModel | null>(null);
    const [items, setItems] = useState<SupplierOrderItemModel[]>([]);

    const [editingItem, setEditingItems] = useState<SupplierOrderItemModel | null>(null);
    const [editQuantityValue, setEditQuantityValue] = useState<number>(0);



    function editQuantity(item: SupplierOrderItemModel) {
        setEditingItems(item)
        setEditQuantityValue(item.quantityOrdered)
    }

    async function saveQuantity() {
        if (!editingItem) return;
        try {
            const updateItem: SupplierOrderItemModel = { ...editingItem, quantityOrdered: editQuantityValue };
            const updatedItem = await supplierOrderService.updateOrderItem(updateItem);
            setItems(currentItems => currentItems.map(item => item.idOrderItem === updatedItem.idOrderItem ? updateItem : item));
            setEditingItems(null);
            notificationService.success("Quantity updated");

        } catch (err: any) {
            console.log(err);
            notificationService.error("Failed to update quantity");

        }
    }


    async function deleteItemFromOrder(idOrderItem: number) {

        const answer = window.confirm("Are you sure you want to delete this product from order? ");
        if (!answer) return;

        try {

            await supplierOrderService.deleteItemFromOrder(idOrderItem);

            const remainingItems = items.filter(item => item.idOrderItem !== idOrderItem);

            if (remainingItems.length === 0) {
                notificationService.success("Order Delete successfully");
                navigate("/supplier-orders");
                return;
            }

            setItems(remainingItems);

            const updateOrder = await supplierOrderService.getOneSupplierOrder(Number(id));
            setOrder(updateOrder);
            notificationService.success("Products removed successfully");


        } catch (err: any) {
            console.log(err);
            notificationService.error("Failed to delete item from order. ");

        }
    }

    useEffect(() => {
        if (!id) return;
        supplierOrderService
            .getOrderItems(Number(id))
            .then(itemsFromApi => {
                setItems(itemsFromApi)
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

    if (!order) {
        return (
            <div className="supplier-order-loading">
                Loading order...
            </div>
        );
    }

    async function advanceOrderStatus() {
        if (!order) return;

        const nextStatus = order.orderStatus === "draft" ? "ordered" : order.orderStatus === "ordered" ? "partially_received" : order.orderStatus ? "received"  : null;
        if(!nextStatus) return;

        try{
            const updateOrder : SupplierOrderModel = {
                ...order, orderStatus:nextStatus
            };

            const result = await supplierOrderService.updateSupplierOrder(updateOrder);
            setOrder(result);

        }catch(err:any){
            console.log(err);
            notificationService.error("Failed to update order status");
        }

    }


    return (

        <section className="supplier-order-details-page">

            <header className="supplier-order-details-header">

                <div>
                    <span className="supplier-order-eyebrow">
                        Purchase Order
                    </span>

                    <h1>{order.orderNumber}</h1>

                    <p>
                        Supplier order information and delivery status
                    </p>
                </div>

                <button
                    type="button"
                    className="supplier-order-back-button"
                    onClick={() => navigate("/supplier-orders")}
                >
                    <FaArrowLeft />
                    <span>Back</span>
                </button>
                <button type="button"
                        className="advance-status-button"
                        onClick={advanceOrderStatus}
                        disabled={order.orderStatus === "received"}
                    >
                        {order.orderStatus === "draft" && "Send Order"}
                        {order.orderStatus === "ordered" && "Start Receiving"}
                        {order.orderStatus === "partially_received" && " Complete Receiving"}
                        {order.orderStatus === "received" && "Complete"}
                </button>

            </header>

            <article className="supplier-order-details-card">

                <div className="supplier-order-detail-row">
                    <div className="supplier-order-detail-icon">
                        <FaStore />
                    </div>

                    <div>
                        <span>Supplier</span>
                        <strong>{order.supplierName}</strong>
                    </div>
                </div>

                <div className="supplier-order-detail-row">
                    <div className="supplier-order-detail-icon">
                        <FaCalendarAlt />
                    </div>

                    <div>
                        <span>Order Date</span>
                        <strong>
                            {new Date(order.orderDate)
                                .toLocaleDateString("he-IL")}
                        </strong>
                    </div>
                </div>

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
                                : "Not specified"}
                        </strong>
                    </div>
                </div>

                <div className="supplier-order-detail-row">
                    <div className="supplier-order-detail-icon">
                        <FaClipboardList />
                    </div>

                    <div>
                        <span>Status</span>

                        <strong className="supplier-order-status">
                            {order.orderStatus}
                        </strong>
                    </div>
                </div>

                <div className="supplier-order-detail-row">
                    <div className="supplier-order-detail-icon">
                        <FaMoneyBillWave />
                    </div>

                    <div>
                        <span>Total Cost</span>
                        <strong>
                            ₪{Number(order.totalCost).toFixed(2)}
                        </strong>
                    </div>
                </div>

                <div className="supplier-order-detail-row">
                    <div className="supplier-order-detail-icon">
                        <FaUser />
                    </div>

                    <div>
                        <span>Created By</span>
                        <strong>
                            {order.createdByName ?? "Unknown"}
                        </strong>
                    </div>
                </div>

                <div className="supplier-order-notes">
                    <span>Notes</span>

                    <p>
                        {order.notes || "No notes"}
                    </p>
                </div>
                <div className="supplier-order-products">
                    <h2>Products in this order:</h2>
                    <table className="supplier-order-product-table">
                        <thead>
                            <tr>

                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price Unit Cost</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (<tr key={item.idOrderItem}>
                                <td>{item.productName}</td>
                                <td>{item.quantityOrdered}</td>
                                <td>₪{Number(item.unitCost).toFixed(2)}</td>
                                <td>₪{Number(item.lineTotal).toFixed(2)}</td>
                                <td><button className="edit-btn" onClick={() => editQuantity(item)}>✍🏻 Edit</button></td>
                                <td><button className="delete-btn" onClick={() => { deleteItemFromOrder(item.idOrderItem) }}>🗑️ Delete</button></td>
                            </tr>))}
                        </tbody>
                    </table>
                </div>

            </article>
            {editingItem && (
                <div className="edit-quantity-modal">
                    <div className="edit-quantity-modal-content">
                        <h2>Edit Quantity</h2>
                        <p>{editingItem?.productName}</p>
                        <input type="number" min="1" value={editQuantityValue} onChange={event => setEditQuantityValue(Number(event.target.value))} />
                        <div>
                            <button type="button" className="edit-quantity-modal-content" onClick={() => { setEditingItems(null) }}>Cancel</button>
                            <button type="button" className="edit-quantity-modal-content" onClick={saveQuantity}>Save</button>
                        </div>

                    </div>
                </div>
            )}

        </section>
    );
}