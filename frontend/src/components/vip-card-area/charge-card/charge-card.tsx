import { useNavigate, useParams } from "react-router-dom";
import { useTitle } from "../../utils/UseTitle";
import "./charge-card.css";
import { useState } from "react";
import { notificationService } from "../../service/notificationService";
import { dialogService } from "../../service/dialogService";
import { vipCardService } from "../../service/vipCardService";


export function ChargeCard() {

    useTitle("Charge VIP Card");
    const { idVipCard } = useParams();
    const navigate = useNavigate();

    const [amount, setAmount] = useState("");
    const [notes, setNotes] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    async function charge() {

        const cardId = Number(idVipCard);
        const chargeAmount = Number(amount);


        if (!Number.isInteger(cardId) || cardId <= 0) {
            notificationService.error("Invalid VIP Card id")
            return;
        }

        if (Number.isNaN(chargeAmount) || chargeAmount <= 0) {
            notificationService.error(
                "Amount must be greater then zero"
            )
            return;
        }
        const ok = await dialogService.confirm(
            "Charge VIP Card",
            `Charge ₪${chargeAmount.toFixed(2)} from this VIP Card?`,
            "Charge",
            "Cancel"
        );

        if (!ok) return;
        try {

            setIsSaving(true);
            const card = await vipCardService.chargeCard(
                cardId,
                chargeAmount,
                notes.trim() || ""
            );
            notificationService.success("VIP Card charge successfully");
            navigate(`/vip-cards/customer/${card.idCustomer}`)

        } catch (err) {
            console.error(err)
            notificationService.error("Failed to charge card")
        }
        finally {
            setIsSaving(false);
        }
    }

    return (
        <section className="ChargeCard">

            <h1>Charge VIP Card</h1>

            <div className="charge-form">

                <div className="charge-group">

                    <label htmlFor="amount">
                        Amount
                    </label>

                    <input
                        id="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={event => setAmount(event.target.value)}
                    />
                </div>

                <div className="charge-group">

                    <label htmlFor="Notes">
                        Notes
                    </label>

                    <textarea
                        id="notes"
                        value={notes}
                        placeholder="Add payment note"
                        onChange={event => setNotes(event.target.value)}
                    />
                </div>

                <div className="charge-actions">

                    <button
                        type="button"
                        className="charge-cancel-button"
                        onClick={() => navigate(-1)}
                    >
                        ⬅ Back
                    </button>


                    <button
                        type="button"
                        className="charge-button"
                        onClick={charge}
                        disabled={isSaving}
                    >
                        {isSaving ? "Charging" : "Charge Card"}

                    </button>

                </div>

            </div>

        </section>
    );
}
