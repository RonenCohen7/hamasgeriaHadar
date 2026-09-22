import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import "./admin-orders.css";

import { SaleOrderModel } from "../../models/sale-order-model";
import { saleOrderService } from "../../service/sale-order-service";
import { dialogService } from "../../service/dialogService";


type OrderFilter = "all" | "open" | "closed";


export function AdminOrders() {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const [sales, setSales] = useState<SaleOrderModel[]>([]);

    const [statusFilter, setStatusFilter] =
        useState<OrderFilter>("all");

    const [searchText, setSearchText] = useState("");

    const [dateFilter, setDateFilter] = useState("");


    useEffect(() => {

        saleOrderService
            .getAllSales()
            .then(setSales)
            .catch(console.error);

    }, []);


    const confirmPayment = async (
        idSale: number
    ): Promise<void> => {

        const confirmed = await dialogService.confirm(
            t("adminOrders.confirmPaymentTitle"),
            t("adminOrders.confirmPaymentText"),
            t("adminOrders.confirmPayment"),
            t("payment.cancel")
        );

        if (!confirmed) return;

        try {

            const updatedSale =
                await saleOrderService.confirmBitPayment(idSale);

            setSales(currentSales =>
                currentSales.map(sale =>
                    sale.idSale === updatedSale.idSale
                        ? updatedSale
                        : sale
                )
            );

            await dialogService.success(
                t("adminOrders.paymentConfirmedTitle"),
                t("adminOrders.paymentConfirmedText")
            );

        }
        catch (err) {

            console.error(
                "Failed to confirm payment:",
                err
            );

        }
    };


    const filteredSales = sales.filter(sale => {

        // open + payment_reported are considered active/open orders.
        const isOpen =
            sale.saleStatus === "open" ||
            sale.saleStatus === "payment_reported";


        // Status filter.
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "open" && isOpen) ||
            (statusFilter === "closed" && !isOpen);


        // Search by order number / sale id / customer name.
        const search =
            searchText.trim().toLowerCase();

        const matchesSearch =
            !search ||
            String(sale.idSale)
                .toLowerCase()
                .includes(search) ||
            (sale.saleNumber ?? "")
                .toLowerCase()
                .includes(search) ||
            (sale.customerName ?? "")
                .toLowerCase()
                .includes(search);


        // Date filter.
        let matchesDate = true;

        if (dateFilter && sale.createdAt) {

            const saleDate =
                new Date(sale.createdAt);

            const year =
                saleDate.getFullYear();

            const month =
                String(
                    saleDate.getMonth() + 1
                ).padStart(2, "0");

            const day =
                String(
                    saleDate.getDate()
                ).padStart(2, "0");

            const localDate =
                `${year}-${month}-${day}`;

            matchesDate =
                localDate === dateFilter;
        }


        return (
            matchesStatus &&
            matchesSearch &&
            matchesDate
        );
    });


    const clearFilters = (): void => {

        setStatusFilter("all");
        setSearchText("");
        setDateFilter("");

    };


    const hasFilters =
        statusFilter !== "all" ||
        searchText.trim() !== "" ||
        dateFilter !== "";


    return (

        <div className="AdminOrders">

            <h1>
                {t("adminOrders.title")}
            </h1>


            {/* Filters */}

            <div className="admin-orders-filters">

                <input
                    type="search"
                    className="admin-orders-search"
                    placeholder={
                        t("adminOrders.searchPlaceholder")
                    }
                    value={searchText}
                    onChange={event =>
                        setSearchText(
                            event.target.value
                        )
                    }
                />


                <select
                    className="admin-orders-status-filter"
                    value={statusFilter}
                    onChange={event =>
                        setStatusFilter(
                            event.target.value as OrderFilter
                        )
                    }
                >

                    <option value="all">
                        {t("adminOrders.filterAll")}
                    </option>

                    <option value="open">
                        {t("adminOrders.filterOpen")}
                    </option>

                    <option value="closed">
                        {t("adminOrders.filterClosed")}
                    </option>

                </select>


                <input
                    type="date"
                    className="admin-orders-date-filter"
                    value={dateFilter}
                    onChange={event =>
                        setDateFilter(
                            event.target.value
                        )
                    }
                />


                {hasFilters && (

                    <button
                        type="button"
                        className="clear-filters-button"
                        onClick={clearFilters}
                    >
                        {t("adminOrders.clearFilters")}
                    </button>

                )}

            </div>


            {/* Results count */}

            <div className="admin-orders-results">

                {t("adminOrders.results")}:
                {" "}
                <strong>
                    {filteredSales.length}
                </strong>

            </div>


            {/* Orders */}

            <div className="admin-orders-list">

                {filteredSales.length === 0 && (

                    <div className="admin-orders-empty">
                        {t("adminOrders.noResults")}
                    </div>

                )}


                {filteredSales.map(sale => (

                    <div
                        className="admin-order"
                        key={sale.idSale}
                        onClick={() =>
                            navigate(
                                `/admin/orders/${sale.idSale}`
                            )
                        }
                    >

                        <div className="admin-order-header">

                            <strong>

                                {t(
                                    "adminOrders.orderNumber"
                                )}
                                :
                                {" "}

                                {sale.saleNumber ?? "-"}

                            </strong>
                            <div className="admin-order-id">
                                ID: {sale.idSale}
                            </div>


                            <span
                                className={
                                    `admin-order-status ${sale.saleStatus}`
                                }
                            >
                                {t(
                                    `saleStatus.${sale.saleStatus}`
                                )}
                            </span>

                        </div>


                        <div className="admin-order-details">

                            <p>

                                <strong>
                                    {t("adminOrders.event")}:
                                </strong>

                                {" "}

                                {sale.eventName ?? "-"}

                            </p>


                            <p>

                                <strong>
                                    {t("adminOrders.customer")}:
                                </strong>

                                {" "}

                                {sale.customerName ?? "-"}

                            </p>


                            <p>

                                <strong>
                                    {t(
                                        "adminOrders.paymentMethod"
                                    )}
                                    :
                                </strong>

                                {" "}

                                {sale.paymentMethod
                                    ? t(
                                        `paymentMethod.${sale.paymentMethod}`
                                    )
                                    : "-"
                                }

                            </p>


                            <p>

                                <strong>
                                    {t("adminOrders.total")}:
                                </strong>

                                {" "}

                                {Number(
                                    sale.totalAmount
                                ).toLocaleString()} ₪

                            </p>


                            <p>

                                <strong>
                                    {t("adminOrders.date")}:
                                </strong>

                                {" "}

                                {sale.createdAt
                                    ? new Date(
                                        sale.createdAt
                                    ).toLocaleString(
                                        "he-IL"
                                    )
                                    : "-"
                                }

                            </p>

                        </div>


                        {sale.saleStatus ===
                            "payment_reported" && (

                                <button
                                    type="button"
                                    className="confirm-payment-button"
                                    onClick={event => {

                                        // Prevent opening order details.
                                        event.stopPropagation();

                                        confirmPayment(
                                            sale.idSale
                                        );
                                    }}
                                >
                                    {t(
                                        "adminOrders.confirmPayment"
                                    )}
                                </button>

                            )}

                    </div>

                ))}

            </div>

        </div>
    );
}