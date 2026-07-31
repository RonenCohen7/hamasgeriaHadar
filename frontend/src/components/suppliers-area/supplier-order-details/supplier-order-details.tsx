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

export function SupplierOrderDetails() {
    console.log("SupplierOrderDetails loaded");
    useTitle("Supplier Order Details");

    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState<SupplierOrderModel | null>(null);

    useEffect(() => {

        if (!id) return;

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

            </article>

        </section>
    );
}