
import { useNavigate } from "react-router-dom";
import type { CustomerModel } from "../../models/customer-model";
import "./customer-card.css";

import {
    FaBirthdayCake,
    FaCarSide,
    FaEdit,
    FaEnvelope,
    FaPhone,
    FaStar,
    FaTrash
} from "react-icons/fa";
import { FaShop } from "react-icons/fa6";




type CustomerCardProps = {
    customer: CustomerModel;
    onDelete: (id: number) => void;
};

export function CustomerCard({ customer, onDelete }: CustomerCardProps) {

    const navigate = useNavigate();

    const birthDate = customer.dateOfBirth
        ? new Date(customer.dateOfBirth).toLocaleDateString("en-GB")
        : "No birth date";



    const formattedPhone = customer.phone ? customer.phone.replace(/\D/g, "").replace(/^(\d{3})(\d{7})$/, "$1-$2") : "No- phone";

    return (
        <article className="CustomerCard">

            <header className="customer-header">
               
                <div className="customer-title">
                    <h3>
                        {customer.firstName || "Unnamed"}{" "}
                        {customer.lastName || "Customer"}
                    </h3>

                    {Boolean(customer.hasVipCard ) && (
                        <span className="vip-label">
                            <FaStar />
                            VIP Customer
                        </span>
                    )}
                </div>

                <span
                    className={
                        customer.isActive
                            ? "customer-status active"
                            : "customer-status inactive"
                    }
                >
                    {customer.isActive ? "Active" : "Inactive"}
                </span>

            </header>

            <div className="customer-details">

                <div className="customer-detail-row">
                    <span className="detail-icon">
                        <FaPhone />
                    </span>

                    <span>{formattedPhone}</span>
                </div>

                <div className="customer-detail-row">
                    <span className="detail-icon">
                        <FaEnvelope />
                    </span>

                    <span title={customer.email ?? ""}>
                        {customer.email || "No email"}
                    </span>
                </div>

                <div className="customer-detail-row">
                    <span className="detail-icon">
                        <FaBirthdayCake />
                    </span>

                    <span>{birthDate}</span>
                </div>

            </div>

            <footer className="customer-actions">

                <button
                    type="button"
                    className={customer.hasVipCard ? "customer-vip-button" : "customer-vip-button no-vip"}
                    onClick={() =>
                        navigate(`/vip-cards/customer/${customer.idCustomer}`)
                    }
                >
                    <FaStar />
                    <span>{customer.hasVipCard ? "VIP" : "Create VIP"}</span>
                </button>

                <button type="button"

                    className="customer-edit-button"
                    onClick={() => { navigate(`/customers/edit/${customer.idCustomer}`) }}
                >
                    <FaEdit />
                    <span>Edit</span>
                </button>
                   <button type="button"

                    className="customer-edit-button"
                    onClick={() => { navigate(`/customer-orders/${customer.idCustomer}`)}}
                >
                    <FaShop />
                    <span>Orders</span>
                </button>

                <button
                    type="button"
                    className="customer-delete-button"
                    onClick={() => onDelete(customer.idCustomer)}
                    title="Delete customer"
                    aria-label="Delete customer"
                >
                    <FaTrash />
                </button>

            </footer>

        </article>
    );
}