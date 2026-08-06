import { useState } from "react";
import "./add-card.css";
import { notificationService } from "../../service/notificationService";
import { vipCardService } from "../../service/vipCardService";






    interface AddCardProps{
        idCustomer: number;
        customerName: string;
        onSuccess?: () => void;
    }

export function AddCard(props: AddCardProps) {

    const [externalCard, setExternalCard] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    async function createCard(){
        try{

            setIsSaving(true);

            const vipCard = await vipCardService.createCard(
                props.idCustomer,
                externalCard? cardNumber : null
            )

            console.log(vipCard);
            notificationService.success(`Vip Card ${vipCard.cardNumber} Created Successfully`);
            props.onSuccess?.()

        }catch(err:any){
            notificationService.error(err)
        }

        finally{
            setIsSaving(false);
        }
    }




    return (
        <div className="AddCard">

			<h2>Create VIP Card</h2>

            <p>Customer:
                <strong>{props.customerName}</strong>
            </p>
            <label>
                <input type="checkbox" checked={externalCard} onChange={ e=> setExternalCard(e.target.checked)}/>
                External Card
            </label>

            <br></br>

            <input type="text" placeholder="Card Number" disabled={!externalCard} value={cardNumber}
             onChange={e=> setCardNumber(e.target.value)}/>

             <br></br>

             <button onClick={createCard} disabled={isSaving}>{isSaving ? "Creating" : "Create Card"}</button>

        </div>
    );
}
