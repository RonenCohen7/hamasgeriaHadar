import { useEffect, useState } from "react";
import "./add-card.css";
import { notificationService } from "../../service/notificationService";
import { vipCardService } from "../../service/vipCardService";
import { useNavigate, useParams } from "react-router-dom";
import { customerService } from "../../service/customerService";
import { CustomerModel } from "../../models/customer-model";








export function AddCard() {

    const {idCustomer} = useParams();
    const [externalCard, setExternalCard] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [customer, setCustomer] = useState<CustomerModel | null>(null);
    const navigate = useNavigate();

    const customerId = Number(idCustomer);

    useEffect(()=>{
        if(!Number.isInteger(customerId) || customerId <= 0){
            return;
        }

        customerService
            .getOneCustomer(customerId)
            .then(setCustomer)
            .catch(console.error)
    },[idCustomer]);

    async function createCard() {
        try {

            setIsSaving(true);

            const vipCard = await vipCardService.createCard(
                customerId,
                externalCard ? cardNumber : null
            )

            console.log(vipCard);
            notificationService.success(`Vip Card ${vipCard.cardNumber} Created Successfully`);
            

        } catch (err: any) {
            notificationService.error(err)
        }

        finally {
            setIsSaving(false);
        }
    }




    return (
        <div className="add-card-form">

            <h2>Create VIP Card</h2>

            <p>Customer:
                <strong>
                    {" "}
                    {customer ? `{customer?.firstName} ${customer?.lastName}`
                    : "Loading..."}
                    </strong>
            </p>
            <div className="add-card-checkbox">
                <label>
                    <input type="checkbox" checked={externalCard} onChange={e => setExternalCard(e.target.checked)} />
                    External Card
                </label>
            </div>


            <div className="add-card-field">
                <input type="text" placeholder="Card Number" disabled={!externalCard} value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)} />

            </div>


           

            <button className="add-card-button" onClick={createCard} disabled={isSaving}>{isSaving ? "Creating" : "Create Card"}</button>

            <button className="back-card-button" type="button" onClick={()=>navigate(-1)}>Back</button>

        </div>
    );
}
