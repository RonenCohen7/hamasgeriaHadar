import "./vip-benefits.css";
import chefImage from "../../../assets/images/vip-chef.jpg"
import { useTitle } from "../../utils/UseTitle";
import { useNavigate } from "react-router-dom";


interface VipBenefitsProps {
    idCustomer: number;
}
export function VipBenefits( {idCustomer}: VipBenefitsProps) {
    useTitle("Benefit VIP");
    const navigate = useNavigate();



    return (
        <section className="CustomerVipBenefits">

            <div className="vip-benefits-image">
                <img
                    src={chefImage} alt="hadar pub Chef"
                />

            </div>

            <div className="vip-benefits-content">
                <h1>Become a VIP Member</h1>
                <p>
                    Join the hadar Pub VIP CLub and enjoy exclusive benefits
                </p>

                <ul>
                    <li>🥃 First recharge - complimentary shot</li>
                    <li>🍽️ 10% discount on every meal</li>
                    <li>🎂 Reserved birthday table</li>
                    <li>🍷 Invitations to special events</li>
                    <li>⭐ Priority service</li>
                </ul>

                <button type="button"
                className="vip-create-button"
                onClick={()=> navigate(`/vip-cards/create/customer/${idCustomer}`)}>
                    ⭐ Create My VIP Card
                </button>
                
                <button
                    type="button"
                    className="vip-benefits-back"
                    onClick={() => navigate(-1)}>
                    Back
                </button>

            </div>




        </section>
    );
}
