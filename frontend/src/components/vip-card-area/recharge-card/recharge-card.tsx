import { useNavigate, useParams } from "react-router-dom";
import "./recharge-card.css";
import { useTitle } from "../../utils/UseTitle";
import { useState } from "react";
import { notificationService } from "../../service/notificationService";
import { vipCardService } from "../../service/vipCardService";
import { dialogService } from "../../service/dialogService";

import { useLocation } from "react-router-dom";




export function RechargeCard() {
    useTitle("Recharge");

    const { idVipCard } = useParams();
    const navigate = useNavigate();

    const [amount, setAmount] = useState("")
    const [notes, setNotes] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const location  = useLocation();
    

    async function recharge() {
        const cardId = Number(idVipCard);
        const rechargeAmount = Number(amount);

        if (!Number.isInteger(cardId) || cardId <= 0) {
            notificationService.error("Invalid VIP card id");
            return;
        }

        if (Number.isNaN(rechargeAmount) || rechargeAmount <= 0) {
            notificationService.error("Amount must be a greater then zero");
            return;
        }

        const ok = await dialogService.confirm(
            "Recharge VIP Card",
            `Recharge  ₪${rechargeAmount.toFixed(2)} to this VIP Card`,
            "Recharge",
            "Cancel"
        )

        if (!ok) {
            return
        }


        try {
            setIsSaving(true);

            const card = await vipCardService.rechargeCard(
                cardId,
                rechargeAmount,
                notes.trim() || ""
            );

            notificationService.success("VIP card recharged successfully")

            const returnTo = location.state?.returnTo ?? 
            `/vip-cards/customer/${card.idCustomer}`

            navigate(returnTo);

            // navigate("/quick-sale");

        } catch (err: any) {
            notificationService.error(err)
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <section className="RechargeCard">

            <h1>Recharge VIP Card</h1>

            <div className="recharge-form">

                <div className="recharge-group">
                    <label htmlFor="amount">Amount</label>

                    <input
                        id="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="Enter  + Number Only "
                        value={amount}
                        onChange={event => setAmount(event.target.value)}
                    />
                </div>

                <div className="recharge-group">
                    <label htmlFor="notes">Notes</label>

                    <textarea
                        id="notes"
                        value={notes}
                        placeholder="Add some memo..."
                        onChange={event => setNotes(event.target.value)}
                    />
                </div>

                <div className="recharge-actions">

                    <button
                        type="button"
                        className="recharge-cancel-button"
                        onClick={() => navigate(-1)}
                    >
                        ⬅ Back
                    </button>


                    <button
                        type="button"
                        className="recharge-button"
                        onClick={recharge}
                        disabled={isSaving}
                    >
                        {isSaving ? "Recharging..." : "Recharge Card"}
                    </button>
                </div>

            </div>

     

        </section>
    )

}
