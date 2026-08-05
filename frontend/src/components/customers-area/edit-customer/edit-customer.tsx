import { useEffect } from "react";
import type { CustomerModel } from "../../models/customer-model";
import "./edit-customer.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/inventory-store";
import { useForm } from "react-hook-form";
import { customerService } from "../../service/customerService";
import { notificationService } from "../../service/notificationService";
import { updateCustomersInStore } from "../../redux/customer-slice";

export function EditCustomer() {


    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CustomerModel>();

    const navigate = useNavigate();

    const dispatch = useDispatch<AppDispatch>()

    const { id } = useParams();



    useEffect(() => {
        const customerId = Number(id);

        if (!Number.isInteger(customerId) || customerId <= 0) {
            navigate("/customers");
            return;
        }

        customerService
            .getOneCustomer(customerId)
            .then(customer => {
                reset({
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    phone: customer.phone ?? "",
                    email: customer.email ?? "",
                    dateOfBirth: customer.dateOfBirth
                        ? String(customer.dateOfBirth).slice(0, 10)
                        : "",
                    isActive: Boolean(customer.isActive)
                });
            })
            .catch(err => {
                console.error(err);
                notificationService.error("Failed to load customer");
                navigate("/customers");
            });

    }, [id, navigate, reset]);


    async function submit(customer: CustomerModel) {
        try {

            const customerId = Number(id);

            const updateCustomer: CustomerModel = await customerService.updateCustomer(customerId, customer)

            dispatch(updateCustomersInStore(updateCustomer));

            notificationService.success("Customer update successfully");
            navigate("/customers");


        } catch (err: any) {
            console.log(err);
            notificationService.error("Failed to Update customer");

        }
    }

    return (
        <div className="EditCustomer">

            <h2>Edit Customer</h2>

            <form onSubmit={handleSubmit(submit)}>

                <div className="edit-customer-field">
                    <label>First Name</label>
                    <input
                        type="text"
                        {...register("firstName")}
                    />
                    <span>{errors.firstName?.message}</span>
                </div>

                <div className="edit-customer-field">
                    <label>Last Name</label>
                    <input
                        type="text"
                        {...register("lastName")}
                    />
                    <span>{errors.lastName?.message}</span>
                </div>

                <div className="edit-customer-field">
                    <label>Phone</label>
                    <input
                        type="text"
                        {...register("phone")}
                    />
                    <span>{errors.phone?.message}</span>
                </div>

                <div className="edit-customer-field">
                    <label>Email</label>
                    <input
                        type="email"
                        {...register("email")}
                    />
                    <span>{errors.email?.message}</span>
                </div>

                <div className="edit-customer-field full-width">
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        {...register("dateOfBirth")}
                    />
                    <span>{errors.dateOfBirth?.message}</span>
                </div>

                <label className="active-field">
                    <input
                        type="checkbox"
                        {...register("isActive")}
                    />
                    <span>Active Customer</span>
                </label>

                <div className="edit-customer-actions">
                    <button
                        type="button"
                        onClick={() => navigate("/customers")}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>

            </form>

        </div>
    );
}
