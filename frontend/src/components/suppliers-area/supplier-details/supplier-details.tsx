import { useNavigate, useParams } from "react-router-dom";
import { useTitle } from "../../utils/UseTitle";
import "./supplier-details.css";
import { useEffect, useState } from "react";
import { SupplierModel } from "../../models/supplier-model";
import { supplierService } from "../../service/supplierService";
import { notificationService } from "../../service/notificationService";
import { FaArrowLeft, FaEdit, FaEnvelope, FaMapMarkedAlt, FaPhone, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/inventory-store";
import { dialogService } from "../../service/dialogService";

export function SupplierDetails() {

    useTitle("Details")

    const { id } = useParams()
    const [supplier, setSupplier] = useState<SupplierModel | null>(null);
    const user = useSelector((state: RootState) => state.auth.user)
    const isAdmin = user?.role === "admin";

    const navigate = useNavigate();

    useEffect(() => {
        supplierService.getOneSupplier(Number(id))
            .then(supplierFromApi => {
                setSupplier(supplierFromApi)
            })
            .catch(error => {
                console.log(error);
                notificationService.error("Failed to load supplier. ");

            });
    }, [id]);

    async function deleteSupplier() {
        if (!supplier) return;
        const ok = await dialogService.confirm(
            "Delete supplier",
            `Are you sure you want to delete "${supplier.idSupplier}" ?`,
            "Delete",
            "Cancel"
        );

        if (!ok) return;

        try {
            await supplierService.deleteSupplier(Number(supplier.idSupplier))

            notificationService.success("Supplier delete successfully");

            navigate("/suppliers");

        } catch (err: any) {
            console.log(err);
            notificationService.error("Failed to delete supplier");

        }
    }

    return (
        <section className="suppliers-details-page">
            <header className="suppliers-details-header">
                <div>
                    <span className="supplier-details-eyebrow">
                        Supplier
                    </span>
                    <h1>
                        {supplier?.supplierName}
                    </h1>
                    <p>
                        Supplier contact and business information
                    </p>
                </div>
                <button type="button" className="back-button" onClick={() => {
                    navigate("/suppliers")
                }}
                >
                    <FaArrowLeft />
                    <span>Back</span>
                </button>
            </header>


            <article className="supplier-details-card">

                <div className="supplier-details-row">

                    <div className="supplier-details-icon">
                        <FaEnvelope />
                    </div>

                    <div>
                        <span>Email</span>

                        <strong>
                            {supplier?.supplierEmail}
                        </strong>
                    </div>

                </div>

                <div className="supplier-details-row">

                    <div className="supplier-details-icon">
                        <FaPhone />
                    </div>

                    <div>
                        <span>Mobile</span>

                        <strong>
                            {supplier?.supplierMobile}
                        </strong>
                    </div>

                </div>

                <div className="supplier-details-row">

                    <div className="supplier-details-icon">
                        <FaMapMarkedAlt />
                    </div>

                    <div>
                        <span>Address</span>

                        <strong>
                            {supplier?.supplierAddress}
                        </strong>
                    </div>

                </div>

                <div className="supplier-details-row">

                    <div>
                        <span>Status</span>

                        <strong
                            className={
                                supplier?.isActive
                                    ? "supplier-active"
                                    : "supplier-inactive"
                            }
                        >
                            {supplier?.isActive ? "Active" : "Inactive"}
                        </strong>
                    </div>

                </div>
                {isAdmin && (

                    <div className="supplier-details-actions">

                        <button
                            type="button"
                            className="edit-supplier-button"
                            onClick={() =>
                                navigate(
                                    `/suppliers/edit/${supplier?.idSupplier}`
                                )
                            }
                        >
                            <FaEdit />
                            <span>Edit</span>
                        </button>

                        <button
                            type="button"
                            className="delete-supplier-button"
                            onClick={deleteSupplier}
                        >
                            <FaTrash />
                            <span>Delete</span>
                        </button>

                    </div>
                )}


            </article>

        </section>
    );
}
