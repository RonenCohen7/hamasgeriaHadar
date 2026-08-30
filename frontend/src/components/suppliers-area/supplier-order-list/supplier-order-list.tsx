import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./supplier-order-list.css";

import { useTitle } from "../../utils/UseTitle";

import { supplierOrderService } from "../../service/supplierOrderService";
import { notificationService } from "../../service/notificationService";

import type { SupplierOrderModel } from "../../models/supplierOrderModel";


export function SupplierOrderList() {

    const { t, i18n } = useTranslation();

    useTitle(
        t("supplierOrders.list.pageTitle")
    );

    const navigate = useNavigate();

    const [orders, setOrders] =
        useState<SupplierOrderModel[]>([]);


    useEffect(() => {

        supplierOrderService
            .getAllSupplierOrders()
            .then(setOrders)
            .catch(err => {

                console.log(err);

                notificationService.error(
                    t(
                        "supplierOrders.list.errors.loadOrders"
                    )
                );

            });

    }, [t]);


    function formatDate(
        date: string | Date
    ): string {

        return new Date(date).toLocaleDateString(
            i18n.language === "he"
                ? "he-IL"
                : "en-US"
        );

    }


    function getStatusTranslation(
        status: string
    ): string {

        const normalizedStatus =
            status
                .toLowerCase()
                .replaceAll("-", "_")
                .replaceAll(" ", "_");


        return t(
            `supplierOrders.status.${normalizedStatus}`,
            {
                defaultValue: status
            }
        );

    }


    function getStatusClass(status: string) {
        switch (status.toLowerCase()) {
            case "draft":
                return "status-draft";
            case "ordered":
                return "status-ordered";
            case "partially_received":
                return "status-partially-received"
            case "received":
                return "status-received"

            default:
                return 'status-default';
        }
    }


    return (

        <div className="SupplierOrderList">

            <div className="supplier-orders-header">

                <div>

                    <span className="supplier-orders-eyebrow">

                        {t(
                            "supplierOrders.list.eyebrow"
                        )}

                    </span>

                    <h1>

                        {t(
                            "supplierOrders.list.title"
                        )}

                    </h1>

                    <p>

                        {t(
                            "supplierOrders.list.description"
                        )}

                    </p>

                </div>


                <button
                    type="button"
                    className="add-order-button"
                    onClick={() =>
                        navigate(
                            "/supplier-orders/add"
                        )
                    }
                >

                    +{" "}
                    {t(
                        "supplierOrders.list.newOrder"
                    )}

                </button>

            </div>

            <div className="order-status-legend">

                <div className="legend-item">
                    <span className="legend-dot legend-draft"></span>
                    <span>{t("supplierOrders.legend.draft")}</span>
                </div>

                <div className="legend-item">
                    <span className="legend-dot legend-ordered"></span>
                    <span>{t("supplierOrders.legend.ordered")}</span>
                </div>

                <div className="legend-item">
                    <span className="legend-dot legend-partial"></span>
                    <span>{t("supplierOrders.legend.partial")}</span>
                </div>

                <div className="legend-item">
                    <span className="legend-dot legend-received"></span>
                    <span>{t("supplierOrders.legend.received")}</span>
                </div>

            </div>


            <div className="supplier-orders-table-wrapper">

                <table className="supplier-orders-table">

                    <thead>

                        <tr>

                            <th>
                                {t(
                                    "supplierOrders.list.order"
                                )}
                            </th>

                            <th>
                                {t(
                                    "supplierOrders.list.supplier"
                                )}
                            </th>

                            <th>
                                {t(
                                    "supplierOrders.list.date"
                                )}
                            </th>

                            <th>
                                {t(
                                    "supplierOrders.list.status"
                                )}
                            </th>

                            <th>
                                {t(
                                    "supplierOrders.list.total"
                                )}
                            </th>

                            <th>
                                {t(
                                    "supplierOrders.list.actions"
                                )}
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {orders.length > 0 ? (

                            orders.map(order => (

                                <tr
                                    key={
                                        order.idOrder
                                    }
                                >

                                    <td className="supplier-order-number">

                                        {
                                            order.orderNumber
                                        }

                                    </td>


                                    <td>

                                        {
                                            order.supplierName
                                        }

                                    </td>


                                    <td>

                                        {formatDate(
                                            order.orderDate
                                        )}

                                    </td>


                                    <td>

                                        <span className={`order-status ${getStatusClass(order.orderStatus)}`}>

                                            {getStatusTranslation(order.orderStatus)}
                                        </span>

                                    </td>


                                    <td>

                                        ₪
                                        {Number(
                                            order.totalCost
                                        ).toFixed(2)}

                                    </td>


                                    <td>

                                        <button
                                            type="button"
                                            className="supplier-order-details-button"
                                            onClick={() =>
                                                navigate(
                                                    `/supplier-orders/${order.idOrder}`
                                                )
                                            }
                                        >

                                            {t(
                                                "supplierOrders.list.details"
                                            )}

                                        </button>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    className="supplier-orders-empty"
                                    colSpan={6}
                                >

                                    {t(
                                        "supplierOrders.list.noOrders"
                                    )}

                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );
}