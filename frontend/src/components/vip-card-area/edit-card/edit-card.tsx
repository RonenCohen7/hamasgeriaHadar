import { useNavigate, useParams } from "react-router-dom";
import type { VipCardModel } from "../../models/vip-card-model";
import { useTitle } from "../../utils/UseTitle";
import "./edit-card.css";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { notificationService } from "../../service/notificationService";
import { vipCardService } from "../../service/vipCardService";




type EditVipCardForm = {
    tier: VipCardModel["tier"];
    expiresAt: string;
    cardStatus: VipCardModel["cardStatus"];
}

export function EditCard() {
    useTitle("Edit VIP Card")

    const navigate = useNavigate();
    const { idVipCard } = useParams();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EditVipCardForm>();


    useEffect(() => {
        const cardId = Number(idVipCard);

        if (!Number.isInteger(cardId) || cardId <= 0) {
            notificationService.error("Invalid VIP card id");
            return;
        }

        vipCardService
            .getCardById(cardId)
            .then(card => {
                reset({
                    tier: card.tier,
                    cardStatus: card.cardStatus,
                    expiresAt: card.expiresAt ? card.expiresAt.split("T")[0] : ""
                })
            })
            .catch(err => {
                console.error(err)
                notificationService.error("Failed to load VIP card")
            })
    }, [idVipCard, reset]);

    async function send(form: EditVipCardForm) {
        const cardId = Number(idVipCard);

        if (!Number.isInteger(cardId) || cardId <= 0) {
            notificationService.error("Invalid VIP Card id")
            return;
        }
        try {

            const updateCard = await vipCardService.updateVipCard(cardId, {
                tier: form.tier,
                expiresAt: form.expiresAt,
                cardStatus: form.cardStatus
            })
            notificationService.success("VIP card update successfully");
            navigate(`/vip-cards/customer/${updateCard.idCustomer}`)

        } catch (err: any) {
            console.error(err);
            notificationService.error(err.response?.data?.message ?? "Failed to update card")
        }

    }

    return (
        <section className="EditCard">
            <form className="edit-card-form" onSubmit={handleSubmit(send)}>

                <h1>Edit VIP Card</h1>

                <div className="edit-card-group">

                    <label>Tier</label>

                    <select
                        {...register("tier", {
                            required: "Tier is required"
                        })}>
                        <option value="bronze">Bronze</option>
                        <option value="silver">Silver</option>
                        <option value="gold">Gold</option>
                    </select>
                    {errors.tier && (<span className="error">
                        {errors.tier.message}
                    </span>)}
                </div>

                <div className="edit-card-group">

                    <label>Expiration Date</label>

                    <input type="date"
                        {...register("expiresAt", { required: "Expiration date is required" })}
                    />
                    {errors.expiresAt && (
                        <span className="error">
                            {errors.expiresAt.message}
                        </span>
                    )}
                </div>

                <div className="edit-card-group">

                    <label>Status</label>

                    <select {...register("cardStatus", { required: "Card Status is required" })}>

                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                        <option value="expired">Expired</option>
                        <option value="canceled">Cancelled</option>

                    </select>



                </div>


                <div className="edit-card-actions">
                    <button
                        type="button"
                        className="edit-card-cancel"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>

                    <button
                        type="submit"
                        className="edit-card-save"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save Change"}
                    </button>

                </div>
            </form>

        </section>
    );
}
