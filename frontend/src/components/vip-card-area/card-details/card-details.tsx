import { useNavigate, useParams } from "react-router-dom";
import "./card-details.css";
import { useEffect, useState } from "react";
import { VipCardModel } from "../../models/vip-card-model";
import { notificationService } from "../../service/notificationService";
import { vipCardService } from "../../service/vipCardService";

import { CardTransactions } from "../card-transactions/card-transactions";

import { useSelector } from "react-redux";
import type { RootState } from "../../redux/inventory-store";
import { VipBenefits } from "../vip-benefits/vip-benefits";


export function CardDetails() {

    const navigate = useNavigate();
    const { idCustomer } = useParams();

    const [vipCard, setVipCard] = useState<VipCardModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loggedCustomer = useSelector((stat: RootState) => stat.customerAuth.customer);


    useEffect(() => {
        const customerId = Number(idCustomer);

        if (!Number.isInteger(customerId) || customerId <= 0) {
            notificationService.error("Invalid customer id");
            setIsLoading(false)
            return;
        }

        vipCardService
            .getCardByCustomerId(customerId)
            .then(card => {
                console.log("VIP card loaded:", card);
                setVipCard(card);
            })
            .catch(err => {
                console.error("Failed loading VIP card:", err);
                setVipCard(null);
            })
            .finally(() => setIsLoading(false));

    }, [idCustomer]);


    if (isLoading) {
        return <p>Loading VIP card ...</p>
    }

    if (!vipCard) {

        return <VipBenefits idCustomer={Number(idCustomer)} />

    }

    return (
        <section className="CardDetails">
            <div className="vip-page-layout">

                <article className="vip-details-card">

                    <header className="vip-details-header">

                        <div className="vip-details-title">
                            <h1>VIP Card Details</h1>
                        </div>

                        <span className={`vip-status ${vipCard.cardStatus}`}>
                            {vipCard.cardStatus}
                        </span>

                    </header>

                    <h2 className="vip-customer-name">
                        {vipCard.firstName} {vipCard.lastName}
                    </h2>

                    <p className="vip-card-number">
                        {vipCard.cardNumber}
                    </p>

                    <div className="vip-balance-box">

                        <span className="vip-balance-label">
                            Balance
                        </span>

                        <div className="vip-balance-value">
                            ₪{Number(vipCard.balance).toFixed(2)}
                        </div>

                    </div>

                    <div className="vip-details-grid">

                        <div className="vip-detail-item">
                            <span>Tier</span>
                            <strong>{vipCard.tier}</strong>
                        </div>

                        <div className="vip-detail-item">
                            <span>External Card</span>
                            <strong>{vipCard.externalCard ? "Yes" : "No"}</strong>
                        </div>

                        <div className="vip-detail-item">
                            <span>Issued At</span>
                            <strong>
                                {new Date(vipCard.issuedAt).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </strong>
                        </div>

                        <div className="vip-detail-item">
                            <span>Expires At</span>
                            <strong>{new Date(vipCard.expiresAt).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            })}</strong>
                        </div>

                    </div>

                    <div className="vip-details-actions">

                        <button type="button" className="vip-recharge-button" onClick={() => navigate(`/vip-cards/${vipCard.idVipCard}/recharge`)} >
                            Recharge
                        </button>
                        <button
                            type="button"
                            className="vip-back-button"
                            onClick={() => navigate(-1)}
                        >
                            ← Back
                        </button>
                        {!loggedCustomer && (<button type="button"
                            className="vip-edit-button"
                            onClick={() => navigate(`/vip-cards/${vipCard.idVipCard}/edit`)}>
                            Edit
                        </button>
                        )}
                    </div>

                </article>

                <aside className="vip-transactions-panel">
                    <div className="vip-transactions-header">
                        <div>
                            <h2>Recent Transactions</h2>
                            <p>Latest VIP card activity</p>
                        </div>
                        <button type="button" onClick={() => navigate(`/vip-cards/${vipCard.idVipCard}/transactions`)}
                        >
                            All Transactions
                        </button>
                    </div>

                    <CardTransactions idVipCard={vipCard.idVipCard} />

                </aside>

            </div>


        </section>
    );
}
