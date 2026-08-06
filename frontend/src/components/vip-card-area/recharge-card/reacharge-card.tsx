import { useNavigate, useParams } from "react-router-dom";
import "./recharge-card.css";
import { useTitle } from "../../utils/UseTitle";
import { useState } from "react";
import { notificationService } from "../../service/notificationService";
import { vipCardService } from "../../service/vipCardService";






export function RechargeCard() {
    useTitle("Recharge");

    const { idVipCard } = useParams();
    const navigate = useNavigate();

    const [amount, setAmount] = useState("")
    const [notes, setNotes] = useState("");
    const [isSaving, setIsSaving] = useState(false);


    async function recharge() {
        const cardId = Number(idVipCard);
        const rechargeAmount = Number(amount);

        if (!Number.isInteger(cardId) || cardId <= 0) {
            notificationService.error("Invalid VIP card id");
            return;
        }

        if (!Number.isInteger(rechargeAmount) || rechargeAmount <= 0) {
            notificationService.error("Amount must be a greater then zero");
            return;
        }

        try {
            setIsSaving(true);

            const card = await vipCardService.rechargeCard(
                cardId,
                rechargeAmount,
                notes.trim() || ""
            );

            notificationService.success("VIP card recharged successfully")

            navigate(`/vip-cards/customer/${card.idCustomer}`);

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
                        onClick={()=> navigate(-1)}
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
