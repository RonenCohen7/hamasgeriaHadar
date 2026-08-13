import { useNavigate } from "react-router-dom";
import { useTitle } from "../../utils/UseTitle";
import "./customer-register.css";

import type { CustomerRegisterDto } from "../../models/customer-model";

import { notificationService } from "../../service/notificationService";
import { customerService } from "../../service/customerService";

import { useForm } from "react-hook-form";

import registerImag from "../../../assets/images/registerImage.jpg";
import { FaHome } from "react-icons/fa";


type CustomerRegisterForm = CustomerRegisterDto & {
    confirmPassword: string;
};


export function CustomerRegister() {

    useTitle("Customer - Register");

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm<CustomerRegisterForm>();

    const password = watch("password");


    async function send(form: CustomerRegisterForm) {

        try {

            const customer: CustomerRegisterDto = {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                password: form.password,
                dateOfBirth: form.dateOfBirth
            };

            const auth =
                await customerService.registerCustomer(customer);

            notificationService.success(
                `Welcome ${auth.customer.firstName}`
            );

            navigate(
                `/vip-cards/customer/${auth.customer.idCustomer}`
            );

        } catch (err: any) {

            notificationService.error(
                err.response?.data?.message ??
                "Register Failed"
            );
        }
    }


    return (
        <section className="customer-register-page">

            {/* IMAGE SIDE */}

            <div className="customer-register-hero">

                <img
                    src={registerImag}
                    alt="Hadar Pub"
                />

                <div className="customer-register-hero-overlay">

                    <span className="customer-register-content">
                        HADAR PUB
                    </span>

                    <h2>
                        Join the experience
                    </h2>

                    <p>
                        Create your customer account and discover
                        VIP benefits, special events and exclusive offers.
                    </p>

                </div>

            </div>


            {/* REGISTER SIDE */}

            <div className="customer-register-panel">

                <div className="customer-register-card">

                    <div className="customer-register-header">

                        <span className="customer-register-badge">
                            New Customer
                        </span>

                        <h1>
                            Create Account
                        </h1>

                        <p>
                            Join Hadar Pub and start enjoying
                            customer and VIP benefits.
                        </p>

                    </div>


                    <form
                        className="customer-register-form"
                        onSubmit={handleSubmit(send)}
                    >

                        {/* First Name */}

                        <div className="customer-register-field">

                            <label>
                                First Name
                            </label>

                            <input
                                type="text"
                                placeholder="First Name"
                                {...register("firstName", {
                                    required: "First Name is required",

                                    minLength: {
                                        value: 2,
                                        message:
                                            "First Name must contain at least 2 characters"
                                    },

                                    maxLength: {
                                        value: 30,
                                        message:
                                            "First Name max length is 30 characters"
                                    }
                                })}
                            />

                            {errors.firstName && (
                                <span className="error">
                                    {errors.firstName.message}
                                </span>
                            )}

                        </div>


                        {/* Last Name */}

                        <div className="customer-register-field">

                            <label>
                                Last Name
                            </label>

                            <input
                                type="text"
                                placeholder="Last Name"
                                {...register("lastName", {
                                    required: "Last Name is required",

                                    minLength: {
                                        value: 2,
                                        message:
                                            "Last Name must contain at least 2 characters"
                                    },

                                    maxLength: {
                                        value: 30,
                                        message:
                                            "Last Name max length is 30 characters"
                                    }
                                })}
                            />

                            {errors.lastName && (
                                <span className="error">
                                    {errors.lastName.message}
                                </span>
                            )}

                        </div>


                        {/* Email */}

                        <div className="customer-register-field">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="Email"
                                {...register("email", {
                                    required: "Email is required",

                                    pattern: {
                                        value:
                                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message:
                                            "Please enter a valid email"
                                    }
                                })}
                            />

                            {errors.email && (
                                <span className="error">
                                    {errors.email.message}
                                </span>
                            )}

                        </div>


                        {/* Phone */}

                        <div className="customer-register-field">

                            <label>
                                Phone
                            </label>

                            <input
                                type="text"
                                placeholder="0501234567"
                                {...register("phone", {
                                    required: "Phone is required",

                                    pattern: {
                                        value: /^0\d{8,9}$/,
                                        message:
                                            "Please enter a valid phone number"
                                    }
                                })}
                            />

                            {errors.phone && (
                                <span className="error">
                                    {errors.phone.message}
                                </span>
                            )}

                        </div>


                        {/* Birth Date */}

                        <div className="customer-register-field">

                            <label>
                                Date of Birth
                            </label>

                            <input
                                type="date"
                                max={
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }
                                {...register("dateOfBirth", {
                                    required:
                                        "Date of Birth is required"
                                })}
                            />

                            {errors.dateOfBirth && (
                                <span className="error">
                                    {errors.dateOfBirth.message}
                                </span>
                            )}

                        </div>


                        {/* Password */}

                        <div className="customer-register-field">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Create Password"
                                {...register("password", {
                                    required:
                                        "Password is required",

                                    minLength: {
                                        value: 4,
                                        message:
                                            "Password must contain at least 4 characters"
                                    }
                                })}
                            />

                            {errors.password && (
                                <span className="error">
                                    {errors.password.message}
                                </span>
                            )}

                        </div>


                        {/* Confirm Password */}

                        <div className="customer-register-field">

                            <label>
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                placeholder="Repeat Password"
                                {...register("confirmPassword", {
                                    required:
                                        "Please confirm your password",

                                    validate: value =>
                                        value === password ||
                                        "Passwords do not match"
                                })}
                            />

                            {errors.confirmPassword && (
                                <span className="error">
                                    {errors.confirmPassword.message}
                                </span>
                            )}

                        </div>


                        {/* Register */}

                        <button
                            type="submit"
                            className="customer-register-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>

                    </form>


                    <div className="customer-register-footer">

                        <span>
                            Already have an account?
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/customer-login")
                            }
                        >
                            Customer Login
                        </button>

                    </div>
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        <FaHome size={15} color="red" />
                    </button>

                </div>

            </div>

        </section>
    );
}