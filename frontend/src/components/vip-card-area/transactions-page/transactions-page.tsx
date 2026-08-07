import { useNavigate, useParams } from "react-router-dom";
import { useTitle } from "../../utils/UseTitle";
import "./transactions-page.css";
import { useEffect, useState } from "react";
import { VipCardTransactionModel } from "../../models/vip-card-transactions";
import { vipCardService } from "../../service/vipCardService";


export function TransactionsPage() {


    useTitle("Transaction Page")


    const { idVipCard } = useParams();
    const navigate = useNavigate();

    const [type, setType] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [page, setPage] = useState(1);
    const limit = 20;
    const [sortBy, setSortBy] = useState("createdAt")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");



    const [transactions, setTransaction] = useState<VipCardTransactionModel[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const cardId = Number(idVipCard)
        if (!Number.isSafeInteger(cardId) || cardId <= 0) {
            setIsLoading(false);
            return;
        }

        vipCardService
            .getAllTransactionByCard(
                cardId,
                from || undefined,
                to || undefined,
                type || undefined,
                page,
                limit,
                sortBy,
                sortOrder
            )
            .then(setTransaction)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [idVipCard, from, to, type, page, sortBy, sortOrder]);

    if (isLoading) {
        return <p>Loading transactions...</p>
    }

    return (
        <section className="transactions-page-wrapper">

            <header className="transactions-page-header">
                <div>
                    <h1>VIP card Transactions</h1>
                    <p>Full transactions history</p>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                </div>
            </header>

            <div className="transactions-summary">

                <div className="summery-card">
                    <span>Total Transactions</span>
                    <span>{transactions.length}</span>
                </div>

                <div className="summery-card">
                    <strong>
                        ₪{
                            transactions
                                .filter(t => t.transactionType === "load")
                                .reduce((sum, t) => sum + Number(t.amount), 0).toFixed(2)
                        }
                    </strong>
                </div>

                <div className="summary-card">
                    <span>Total Payment</span>
                    <strong>
                        ₪{
                            transactions.filter(t => t.transactionType === "payment")
                                .reduce((sum, t) => sum + Number(t.amount), 0).toFixed(2)
                        }
                    </strong>

                </div>

            </div>

            <div className="transactions-filters">

                <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                >
                    <option value="">All Types</option>
                    <option value="load">Load</option>
                    <option value="payment">Payment</option>
                    <option value="refund">Refund</option>
                </select>

                <input
                    type="date"
                    value={from}
                    onChange={e => setFrom(e.target.value)}
                />

                <input
                    type="date"
                    value={to}
                    onChange={e => setTo(e.target.value)}
                />

                <select
                    value={sortBy}
                    onChange={e => {
                        setSortBy(e.target.value)
                        setPage(1)
                    }}>
                    <option value="createdAt">Date</option>
                    <option value="amount">Amount</option>
                    <option value="transactionType">Type</option>
                    <option value="balanceBefore">Balance Before</option>
                    <option value="balanceAfter">Balance After</option>

                </select>
                <select
                    value={sortOrder}
                    onChange={e => {
                        setSortOrder(e.target.value as "asc" | "desc")
                        setPage(1)
                    }}>
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>

                </select>

                <button
                    type="button"
                    onClick={() => {
                        setType("");
                        setFrom("");
                        setTo("");
                        setPage(1);
                    }}
                >
                    Clear
                </button>
            </div>
            {
                transactions.length === 0 ? (
                    <p>No transaction found.</p>
                ) : (
                    <div className="transactions-table-wrapper">
                        <table className="transactions-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Notes</th>
                                    <th>Amount</th>
                                    <th>Before</th>
                                    <th>After</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(transaction => (
                                    <tr key={transaction.idVipTransaction}>
                                        <td>
                                            {new Date(transaction.createdAt).toLocaleString("en-GB")}
                                        </td>
                                        <td>
                                            {transaction.transactionType}
                                        </td>
                                        <td>
                                            {transaction.notes || "No notes"}
                                        </td>
                                        <td className={`transaction-table-amount ${transaction.transactionType}`}
                                        >
                                            {transaction.transactionType === "payment" ? "-" : "+"}
                                            ₪{Number(transaction.amount).toFixed(2)}
                                        </td>
                                        <td>
                                            ₪{Number(transaction.balanceBefore).toFixed(2)}
                                        </td>
                                        <td>
                                            ₪{Number(transaction.balanceAfter).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="transactions-pagination">
                            <button
                                type="button"
                                disabled={page === 1}
                                onClick={() => setPage(current => current - 1)}
                            >
                                ˿ Previous
                            </button>

                            <span>
                                Page {page}
                            </span>

                            <button
                                type="button"
                                disabled={transactions.length < limit}
                                onClick={() => setPage(current => current + 1)}
                            >
                                Next ⁺
                            </button>
                        </div>
                    </div>
                )
            }

        </section >
    );
}
