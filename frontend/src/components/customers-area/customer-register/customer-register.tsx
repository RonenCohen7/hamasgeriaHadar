import { useNavigate } from "react-router-dom";
import { useTitle } from "../../utils/UseTitle";
import "./customer-register.css";

import type { CustomerRegisterDto } from "../../models/customer-model";

import { notificationService } from "../../service/notificationService";
import { customerService } from "../../service/customerService";

import { useForm } from "react-hook-form";

import registerImag from "../../../assets/images/registerImage.jpg";
import { FaHome } from "react-icons/fa";
import { useTranslation } from "react-i18next";

type CustomerRegisterForm = CustomerRegisterDto & {
    confirmPassword: string;
};


export function CustomerRegister() {

    const { t, i18n } = useTranslation();

    const isHebrew = i18n.language === "he";

    useTitle(t("customerRegister.pageTitle"));


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
        <section className="customer-register-page" dir={isHebrew ? "rtl" : "ltr"}>

            {/* IMAGE SIDE */}

            <div className="customer-register-hero">

                <img
                    src={registerImag}
                    alt={t("customerRegister.heroAlt")}
                />

                <div className="customer-register-hero-overlay">

                    <span className="customer-register-content">
                        {t("customerRegister.heroBadge")}
                    </span>

                    <h2>
                        {t("customerRegister.heroTitle")}
                    </h2>

                    <p>
                        {t("customerRegister.heroDescription")}
                    </p>

                </div>

            </div>


            {/* REGISTER SIDE */}

            <div className="customer-register-panel">

                <div className="customer-register-card">

                    <div className="customer-register-header">

                        <span className="customer-register-badge">
                            {t("customerRegister.newCustomer")}
                        </span>

                        <h1>
                            {t("customerRegister.createAccount")}
                        </h1>

                        <p>
                            {t("customerRegister.headerDescription")}
                        </p>

                    </div>


                    <form
                        className="customer-register-form"
                        onSubmit={handleSubmit(send)}
                    >

                        {/* First Name */}

                        <div className="customer-register-field">

                            <label>
                                {t("customerRegister.firstName")}
                            </label>

                            <input
                                type="text"
                                placeholder={t("customerRegister.firstName")}
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
                                {t("customerRegister.lastName")}
                            </label>

                            <input
                                type="text"
                                placeholder={t("customerRegister.lastName")}
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
                                {t("customerRegister.email")}
                            </label>

                            <input
                                type="email"
                                placeholder={t("customerRegister.email")}
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
                                {t("customerRegister.phone")}
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
                                {t("customerRegister.dateOfBirth")}
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
                                {t("customerRegister.password")}
                            </label>

                            <input
                                type="password"
                                placeholder={t("customerRegister.createPassword")}
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
                                {t("customerRegister.confirmPassword")}
                            </label>

                            <input
                                type="password"
                                placeholder={t("customerRegister.repeatPassword")}
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
                                ? t("customerRegister.creatingAccount")
                                : t("customerRegister.createAccount")}
                        </button>

                    </form>


                    <div className="customer-register-footer">

                        <span>
                            {t("customerRegister.alreadyHaveAccount")}
                        </span>

                        <button
                            type="button"

                            onClick={() =>
                                navigate("/customer-login")
                            }
                        >
                            {t("customerRegister.customerLogin")}
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