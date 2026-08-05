import { useDispatch } from "react-redux";
import { useTitle } from "../../utils/UseTitle";
import "./add-customer.css";
import { useNavigate } from "react-router-dom";

import { AddCustomerDto, CustomerModel } from "../../models/customer-model";
import { notificationService } from "../../service/notificationService";
import { customerService } from "../../service/customerService";
import { addCustomerToStore } from "../../redux/customer-slice";
import { useForm } from "react-hook-form";

export function AddCustomer() {

    useTitle("Add Customers");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { isSubmitting } } = useForm<AddCustomerDto>();


    async function submit(customer: AddCustomerDto) {
        try {
            
            customer.phone = customer.phone ?customer.phone.replace(/\D/g,"") : null;

            const addCustomer: CustomerModel = await customerService.addCustomer(customer);

            dispatch(addCustomerToStore(addCustomer))
            notificationService.success("Customer added successfully");
            navigate("/customers");

        } catch (err: any) {
            console.error("Add customer error:", err);
            console.error("Server response:", err.response?.data);

            notificationService.error("Failed to Add customer");

        }
    }

    return (
        <div className="AddCustomer">

            <h2>Add Customer</h2>

            <form onSubmit={handleSubmit(submit)}>

                <div className="customer-field">

                    <label>First Name</label>
                    <input type="text" {...register("firstName", { required: true })} />

                    <label>Last Name</label>
                    <input type="text" {...register("lastName", { required: true })} />

                    <label>Phone</label>
                    <input type="tel" placeholder="0526240604" maxLength={10}
                    {...register("phone", {pattern: { value:/^05\d{8}/, message: "Enter a valid mobile number"}} )} />

                    <label>Email</label>
                    <input type="email" {...register("email", { required: true })} />

                    <label>Date of Birth</label>
                    <input type="date"{...register("dateOfBirth", { required: true })} />

                    <div className="customer-actions">

                        <button type="button"
                            onClick={() => navigate("/customers")}>
                            Cancel
                        </button>

                        <button type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save Customer"}

                        </button>


                    </div>

                </div>

            </form>

        </div>
    );
}
