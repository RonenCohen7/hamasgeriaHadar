import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./admin-order-details.css";

import { SaleOrderModel } from "../../models/sale-order-model";
import { saleOrderService } from "../../service/sale-order-service";
import { dialogService } from "../../service/dialogService";


export function AdminOrderDetails() {

    const { t } = useTranslation();

    const navigate = useNavigate();

    const { id } = useParams();

    const [sale, setSale] = useState<SaleOrderModel | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);


    useEffect(() => {

        const idSale = Number(id);

        if (!Number.isInteger(idSale) || idSale <= 0) {
            navigate("/admin/orders");
            return;
        }

        saleOrderService
            .getOneSale(idSale)
            .then(setSale)
            .catch(err => {

                console.error(
                    "Failed to load sale:",
                    err
                );

                navigate("/admin/orders");

            })
            .finally(() => {
                setIsLoading(false);
            });

    }, [id, navigate]);


    if (isLoading) {

        return (
            <div className="AdminOrderDetails">

                <p>
                    {t("adminOrderDetails.loading")}
                </p>

            </div>
        );
    }


    if (!sale) {
        return null;
    }


    async function changeStatus(newStatus: string) {

        if (!sale || newStatus === sale.saleStatus) return;

        const confirmed = await dialogService.confirm(
            t("adminOrderDetails.changeStatusTitle"),
            t("adminOrderDetails.changeStatusText")
        )
        if (!confirmed) return;

        try {
            setIsUpdatingStatus(true)

            const updateSale = await saleOrderService.updateSaleStatus(
                sale.idSale,
                newStatus
            )

            setSale(updateSale)

            await dialogService.success(
                t("adminOrderDetails.statusUpdatedTitle"),
                t("adminOrderDetails.statusUpdatedText")

            )
        } catch (err: any) {
            console.error(err)
            await dialogService.error(
                t("adminOrderDetails.statusUpdateErrorTitle"),
                err.response?.data?.message ??
                t("adminOrderDetails.statusUpdateErrorText")
            )
        } finally {
            setIsUpdatingStatus(false);
        }

    }

    return (

        <div className="AdminOrderDetails">


            {/* Back */}

            <button
                type="button"
                className="back-button"
                onClick={() =>
                    navigate("/admin/orders")
                }
            >
                ← {t("adminOrderDetails.back")}
            </button>


            <h1>
                {t("adminOrderDetails.title")}
            </h1>


            <div className="order-details-card">


                {/* Header */}

                <div className="order-details-header">

                    <h2>

                        {t(
                            "adminOrderDetails.orderNumber"
                        )}
                        :
                        {" "}

                        {sale.saleNumber ||
                            sale.idSale}

                    </h2>


                    <span
                        className={
                            `order-details-status ${sale.saleStatus}`
                        }
                    >
                        {t(
                            `saleStatus.${sale.saleStatus}`
                        )}
                    </span>

                </div>


                {/* Details */}

                <div className="order-details-grid">


                    {/* Customer */}

                    <div>

                        <span className="detail-label">
                            {t(
                                "adminOrderDetails.customer"
                            )}
                        </span>

                        <strong>
                            {sale.customerName || "-"}
                        </strong>

                    </div>


                    {/* Event */}

                    <div>

                        <span className="detail-label">
                            {t(
                                "adminOrderDetails.event"
                            )}
                        </span>

                        <strong>
                            {sale.eventName || "-"}
                        </strong>

                    </div>


                    {/* Ticket quantity */}

                    <div>

                        <span className="detail-label">
                            {t(
                                "adminOrderDetails.ticketQuantity"
                            )}
                        </span>

                        <strong>
                            {sale.ticketQuantity ?? "-"}
                        </strong>

                    </div>


                    {/* Ticket price */}

                    <div>

                        <span className="detail-label">
                            {t(
                                "adminOrderDetails.ticketPrice"
                            )}
                        </span>

                        <strong>

                            {sale.ticketUnitPrice != null
                                ? `${Number(
                                    sale.ticketUnitPrice
                                ).toLocaleString("he-IL")} ₪`
                                : "-"
                            }

                        </strong>

                    </div>


                    {/* Payment method */}

                    <div>

                        <span className="detail-label">
                            {t(
                                "adminOrderDetails.paymentMethod"
                            )}
                        </span>

                        <strong>

                            {sale.paymentMethod
                                ? t(
                                    `paymentMethod.${sale.paymentMethod}`
                                )
                                : "-"
                            }

                        </strong>

                    </div>


                    {/* Total */}

                    <div>

                        <span className="detail-label">
                            {t(
                                "adminOrderDetails.total"
                            )}
                        </span>

                        <strong>

                            {Number(
                                sale.totalAmount
                            ).toLocaleString(
                                "he-IL"
                            )} ₪

                        </strong>

                    </div>


                    {/* Date */}

                    <div>

                        <span className="detail-label">
                            {t(
                                "adminOrderDetails.date"
                            )}
                        </span>

                        <strong>

                            {sale.createdAt
                                ? new Date(
                                    sale.createdAt
                                ).toLocaleString(
                                    "he-IL"
                                )
                                : "-"
                            }

                        </strong>

                    </div>


                    {/* Status */}

                    <div>

                        <span className="detail-label">
                            {t("adminOrderDetails.status")}
                        </span>

                        {sale.saleStatus === "payment_reported" ? (

                            <strong>
                                {t(`saleStatus.${sale.saleStatus}`)}
                            </strong>

                        ) : (

                            <select
                                className="order-status-select"
                                value={sale.saleStatus}
                                disabled={isUpdatingStatus}
                                onChange={event =>
                                    changeStatus(event.target.value)
                                }
                            >

                                <option value="open">
                                    {t("saleStatus.open")}
                                </option>

                                {sale.saleStatus === "paid" && (
                                    <option value="paid">
                                        {t("saleStatus.paid")}
                                    </option>
                                )}

                                <option value="cancelled">
                                    {t("saleStatus.cancelled")}
                                </option>

                                <option value="refunded">
                                    {t("saleStatus.refunded")}
                                </option>

                            </select>

                        )}

                    </div>


                </div>


                {/* Payment reported */}

                {sale.saleStatus ===
                    "payment_reported" && (

                        <div className="order-details-actions">

                            <button
                                type="button"
                                className="confirm-payment-button"
                                onClick={() =>
                                    navigate(
                                        "/admin/orders"
                                    )
                                }
                            >
                                {t(
                                    "adminOrderDetails.returnToConfirm"
                                )}
                            </button>

                        </div>

                    )}

            </div>

        </div>
    );
}
