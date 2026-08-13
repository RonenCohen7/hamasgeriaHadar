import "./customer-login.css";
import { FaHome } from "react-icons/fa";
import { useState } from "react";
import { useTitle } from "../../utils/UseTitle";
import { useNavigate } from "react-router-dom";

import { customerService } from "../../service/customerService";
import { dialogService } from "../../service/dialogService";

import pubDrink from "../../../assets/images/pubDrinks.jpg";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/auth-slice";


export function CustomerLogin() {

    useTitle("Login");

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const login = async () => {

        if (!email.trim()) {

            await dialogService.error(
                "Email Required",
                "Please enter your email"
            );

            return;
        }


        if (!email.includes("@")) {

            await dialogService.error(
                "Invalid Email",
                "Please enter a valid email address"
            );

            return;
        }


        if (!password.trim()) {

            await dialogService.error(
                "Password Required",
                "Please enter your password"
            );

            return;
        }


        try {

            await customerService.loginCustomer({
                email,
                password
            });
            dispatch(logout());


            navigate("/customer-dashboard");

        }
        catch (err) {

            console.error(err);


            await dialogService.error(
                "Login Failed",
                "Email or password is incorrect"
            );
        }
    };


    return (

        <section className="customer-login-page">


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
                            Customer Portal
                        </span>

                        <h1>
                            Welcome Back
                        </h1>

                        <p>
                            Login to view your VIP card,
                            balance, transactions and
                            customer benefits
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
                                Email
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
                                placeholder="Enter your password"
                            />

                        </div>


                        <button
                            type="submit"
                            className="login-button"
                        >
                            Login
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
                            Forgot Password?
                        </button>

                    </div>


                    <div className="customer-login-footer">

                        New Customer?{" "}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/customer-register"
                                )
                            }
                        >
                            Create Account
                        </button>

                    </div>


                    <div className="employee-access">

                        Are you employee?

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Employee Login
                        </button>

                    </div>
                    <button
                            type="button"
                            onClick={()=>navigate("/")}
                        >
                        <FaHome size={15} color="red" />
                        
                    </button>


                </div>

            </div>


        </section>
    );
}