import "./customer-login.css";
import { FaHome } from "react-icons/fa";
import { useState } from "react";
import { useTitle } from "../../utils/UseTitle";
import { useNavigate, useSearchParams } from "react-router-dom";

import { customerService } from "../../service/customerService";
import { dialogService } from "../../service/dialogService";

import pubDrink from "../../../assets/images/pubDrinks.jpg";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/auth-slice";
import { useTranslation } from "react-i18next";

export function CustomerLogin() {


    const [searchParams] = useSearchParams();

    const eventId = searchParams.get("eventId");

    console.log("Event ID from extension: ", eventId);





    const { t, i18n } = useTranslation();
    const isHebrew = i18n.language === "he";

    useTitle(t("customerLogin.pageTitle"));




    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const login = async () => {

        if (!email.trim()) {

            await dialogService.error(
                t("customerLogin.errors.emailRequiredTitle"),
                t("customerLogin.errors.emailRequiredMessage")
            );

            return;
        }


        if (!email.includes("@")) {

            await dialogService.error(
                t("customerLogin.errors.invalidEmailTitle"),
                t("customerLogin.errors.invalidEmailMessage")
            );

            return;
        }


        if (!password.trim()) {

            await dialogService.error(
                t("customerLogin.errors.passwordRequiredTitle"),
                t("customerLogin.errors.passwordRequiredMessage")
            );

            return;
        }


        try {

            await customerService.loginCustomer({
                email,
                password
            });
            dispatch(logout());
            
            if (eventId) {
                navigate(`/events/details/${eventId}`)
            } else {
                navigate("/customer-dashboard");
            }




        }
        catch (err) {

            console.error(err);


            await dialogService.error(
                t("customerLogin.errors.loginFailedTitle"),
                t("customerLogin.errors.loginFailedMessage")
            );
        }
    };


    return (

        <section className="customer-login-page" dir={isHebrew ? "rtl" : "ltr"}>


            <div className="customer-login-hero">

                <img
                    src={pubDrink}
                    alt="Hadar Pub cocktails"
                />

                <div className="customer-login-hero-overlay" />

            </div>


            <div className="customer-login-panel">


                <div className="customer-login-card">


                    <div className="customer-login-header">

                        <span className="customer-login-badge">
                            {t("customerLogin.badge")}
                        </span>

                        <h1>
                            {t("customerLogin.welcomeBack")}
                        </h1>

                        <p>
                            {t("customerLogin.description")}
                        </p>

                    </div>


                    <form
                        onSubmit={e => {

                            e.preventDefault();

                            login();
                        }}
                    >


                        <div className="customer-login-field">

                            <label>
                                {t("customerLogin.email")}
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={e =>
                                    setEmail(e.target.value)
                                }
                            />

                        </div>


                        <div className="customer-login-field">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={e =>
                                    setPassword(e.target.value)
                                }
                                placeholder={t("customerLogin.passwordPlaceholder")}
                            />

                        </div>


                        <button
                            type="submit"
                            className="login-button"
                        >
                            {t("customerLogin.login")}
                        </button>

                    </form>


                    <div className="forgot-password">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/customer-forgot-password"
                                )
                            }
                        >
                            {t("customerLogin.createAccount")}
                        </button>

                    </div>


                    <div className="customer-login-footer">

                        {t("customerLogin.employeeQuestion")}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/customer-register"
                                )
                            }
                        >
                            {t("customerLogin.employeeLogin")}
                        </button>

                    </div>


                    <div className="employee-access">

                        {t("customerLogin.employeeQuestion")}

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            {t("customerLogin.employeeLogin")}
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