import { useEffect, useState } from "react";
import { useTitle } from "../../utils/UseTitle";
import "./vip-report.css";
import { vipReportService, type VipPurchasesReport } from "../../service/vipReportService";
import { dialogService } from "../../service/dialogService";


export function VipReport() {

    useTitle("Vip-Report");

    const [fromDate, setFromDate] = useState<string>("");

    const [toDate, setToDate] = useState<string>("");

    const [reports, setReports] = useState<VipPurchasesReport[]>([]);

    const [loading, setLoading] = useState<boolean>(true);


    const filteredReports = reports.filter(item => {

        const transactionDate = new Date(item.transactionDate);

        if (fromDate) {

            const startDate = new Date(`${fromDate}T00:00:00`);

            if (transactionDate < startDate) {
                return false;
            }

        }

        if (toDate) {

            const endDate = new Date(`${toDate}T23:59:59`);

            if (transactionDate > endDate) {
                return false;
            }

        }

        return true;

    });


    useEffect(() => {

        vipReportService
            .getVipPurchases()
            .then(data => {

                setReports(data);

            })
            .catch(err => {

                console.error(err);

                dialogService.error(
                    "⛔️",
                    "Failed to Load VIP Report"
                );

            })
            .finally(() => {

                setLoading(false);

            });

    }, []);


    async function exportExcel() {

        try {

            await vipReportService.getVipPurchasesToExcel(
                filteredReports
            );

            dialogService.success(
                "📊",
                "Report Created"
            );

        }
        catch (err: any) {

            console.error(err);

            dialogService.error(
                "😞",
                "Failed to export report to excel"
            );

        }

    }


    if (loading) {

        return (

            <div className="VipReport">

                <p className="vip-report-loading">
                    Loading Report
                </p>

            </div>

        );

    }


    return (

        <div className="VipReport">

            <header className="vip-report-header">

                <div>

                    <span className="vip-report-eyebrow">
                        VIP CARDS
                    </span>

                    <h1>
                        VIP Purchases Report
                    </h1>

                    <p>
                        Purchases paid with VIP Card
                    </p>

                </div>


                <button
                    type="button"
                    className="vip-export-button"
                    onClick={exportExcel}
                >
                    📊 Export Excel
                </button>

            </header>


            <div className="vip-report-filter">

                <div className="vip-report-filter">

                    <label>
                        From Date
                    </label>

                    <input
                        type="date"
                        value={fromDate}
                        onChange={e =>
                            setFromDate(e.target.value)
                        }
                    />

                </div>


                <div className="vip-report-filter">

                    <label>
                        To Date
                    </label>

                    <input
                        type="date"
                        value={toDate}
                        onChange={e =>
                            setToDate(e.target.value)
                        }
                    />

                </div>


                <button
                    type="button"
                    className="vip-clear-filter"
                    onClick={() => {

                        setFromDate("");

                        setToDate("");

                    }}
                >
                    Clear
                </button>

            </div>


            <div className="vip-report-summery">

                <div>

                    <span>
                        Transaction
                    </span>

                    <strong>
                        {filteredReports.length}
                    </strong>

                </div>


                <div>

                    <span>
                        Total Amount
                    </span>

                    <strong>
                        ₪ {
                            filteredReports
                                .reduce(
                                    (sum, item) =>
                                        sum + Number(item.lineTotal),
                                    0
                                )
                                .toFixed(2)
                        }
                    </strong>

                </div>


                <div className="vip-report-table-wrapper">

                    <table className="vip-report-table">

                        <thead>

                            <tr>

                                <th>Date</th>

                                <th>Product Id</th>

                                <th>Product</th>

                                <th>Quantity</th>

                                <th>Unit Price</th>

                                <th>Total</th>

                                <th>VIP Card</th>

                                <th>Customer</th>

                                <th>Email</th>

                                <th>Phone</th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredReports.map(
                                (item, index) => (

                                    <tr
                                        key={`${item.vipCardNumber}-${item.productId}-${index}`}
                                    >

                                        <td>
                                            {
                                                new Date(
                                                    item.transactionDate
                                                ).toDateString()
                                            }
                                        </td>


                                        <td>
                                            {item.productId}
                                        </td>


                                        <td className="product-name">
                                            {item.productName}
                                        </td>


                                        <td>
                                            {
                                                Number(
                                                    item.quantity
                                                ).toFixed(0)
                                            }
                                        </td>


                                        <td>
                                            ₪
                                            {
                                                Number(
                                                    item.unitPrice
                                                ).toFixed(2)
                                            }
                                        </td>


                                        <td className="report-total">
                                            ₪
                                            {
                                                Number(
                                                    item.lineTotal
                                                ).toFixed(2)
                                            }
                                        </td>


                                        <td className="vip-card-number">
                                            {item.vipCardNumber}
                                        </td>


                                        <td>
                                            {item.cardHolderName}
                                        </td>


                                        <td>
                                            {item.cardHolderEmail}
                                        </td>


                                        <td>
                                            {item.cardHolderPhone}
                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>


                    {filteredReports.length === 0 && (

                        <div className="vip-report-empty">

                            <span>
                                🗒️
                            </span>

                            <strong>
                                No VIP purchases found
                            </strong>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );
}