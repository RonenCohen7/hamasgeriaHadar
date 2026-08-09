
import "./customer-login.css";
import { customerService } from "../../service/customerService";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/inventory-store";
import { useState } from "react";
import { useTitle } from "../../utils/UseTitle";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import pubDrink from "../../../assets/images/pubDrinks.jpg";




export function CustomerLogin() {

    useTitle("Login");
    const navigate = useNavigate();

    const customer = useSelector((state: RootState) => state.customerAuth.customer)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { handleSubmit } = useForm()


    const login = async () => {
        await customerService.loginCustomer({
            email,
            password
        })
        navigate("/customer-dashboard")
    }





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

                        <h1>Welcome Back</h1>

                        <p>
                            Login to view your VIP card, balance,
                            transactions and customer benefits
                        </p>

                    </div>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        login();
                    }}>

                        <div className="customer-login-field">

                            <label>Email</label>

                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />

                        </div>

                        <div className="customer-login-field">

                            <label>Password</label>

                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
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

                    <div className="customer-login-footer">

                        New Customer?{" "}

                        <button
                            type="button"
                            onClick={() => navigate("/customer-register")}
                        >
                            Create Account
                        </button>

                    </div>

                    <div className="employee-access">

                        Are you employee?

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                        >
                            Employee Login
                        </button>

                    </div>

                </div>

            </div>

        </section>
    );
}
