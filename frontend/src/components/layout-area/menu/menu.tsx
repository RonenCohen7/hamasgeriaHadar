import { NavLink } from "react-router-dom";
import "./menu.css";
import { FaHome, FaBoxOpen, FaInfoCircle, FaEnvelope, FaTruck, FaFileInvoice, FaWarehouse, FaClipboardCheck, FaSalesforce } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FaSackDollar } from "react-icons/fa6";
import type { RootState } from "../../redux/inventory-store";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { authService } from "../../service/authService";
import { customerService } from "../../service/customerService";


export function Menu() {
    const customer = useSelector((state: RootState) => state.customerAuth.customer);
    const user = useSelector((state: RootState) => state.auth.user);

    const role = user?.role;
    const isAdmin = role == "admin";
    const isManager = role == "manager";
    const isEmployee = role == "employee";

    const isCustomer = !!customer;
    const isUser = !!user;


    const positions = [
        { top: 20, left: 20 },
        { top: 90, left: 25 },
        { top: 370, left: 18 },
        { top: 250, left: 30 },
        { top: 630, left: 22 }
    ];

    const [index, setIndex] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex(i => (i + 1) % positions.length);
        }, 4000);
        return () => clearInterval(timer)
    }, []);


    console.log("Current user:", user);
    const navigate = useNavigate();

    function logout() {
        authService.logout();
        navigate("/login");
    }

    function logoutCustomer() {
        customerService.logoutCustomer()
        navigate("/customer-login");

    }


    return (

        <>
            <div className="beer-logo" style={positions[index]}>
                🍺
            </div>

            <div className="menu">

                {user && (
                    <div className="user-session">

                        <div className="logged-user">
                            <span className="user-avatar">👤</span>

                            <div className="user-details">
                                <strong>
                                    {user.firstName} {user.lastName}
                                </strong>

                                <small>{role}</small>
                            </div>
                        </div>

                        <button
                            className="logout-button"
                            onClick={logout}
                        >
                            🚪 Logout
                        </button>

                    </div>
                )}

                {/* ================= CUSTOMER ================= */}

                {customer && (
                    <>
                        <div className="user-session">
                            <div className="logged-user">
                                <span className="user-avatar">👤</span>
                                <div className="user-details">
                                    <strong>
                                        {customer.firstName} {customer.lastName}
                                    </strong>
                                    <small>Customer</small>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="logout-button"
                                onClick={logoutCustomer}>
                                🚪 Logout
                            </button>
                        </div>
                        <NavLink to="/customer-dashboard" className="menu-link" data-tooltip="Dashboard">🏠</NavLink>

                        <NavLink
                            to={`/vip-cards/customer/${customer.idCustomer}`}
                            className="menu-link"
                            data-tooltip="My VIP Card"
                        >
                            💳
                        </NavLink>
                        
                        {customer?.hasVipCard && (<NavLink
                            to="/transactions"
                            className="menu-link"
                            data-tooltip="My Transactions"
                        >
                            📋
                        </NavLink>)}


                    </>
                )}

                {/* ================= EMPLOYEE / ADMIN ================= */}

                {user && (
                    <>
                        <NavLink to="/" className="menu-link">
                            <FaHome />
                        </NavLink>

                        {(role === "admin" || role === "manager") && (
                            <NavLink
                                to="/inventory-live"
                                className="menu-link"
                                data-tooltip ="Inventory-Live"
                            >
                                <FaWarehouse />
                            </NavLink>
                        )}

                        <NavLink to="/sales/new" className="menu-link" data-tooltip ="Create Sale">
                            <FaSackDollar />
                        </NavLink>

                        <NavLink to="/quick-sale" className="menu-link" data-tooltip ="Quick Sale">
                            <FaSalesforce />
                        </NavLink>

                        <NavLink to="/products" className="menu-link" data-tooltip ="Products">
                            <FaBoxOpen />
                        </NavLink>

                        <NavLink to="/inventory-count" className="menu-link" data-tooltip ="Inventory Count">
                            <FaClipboardCheck />
                        </NavLink>

                        {(role === "admin" || role === "manager") && (
                            <>
                                <NavLink
                                    to="/suppliers"
                                    className="menu-link"
                                    data-tooltip ="Suppliers"
                                >
                                    <FaTruck />
                                </NavLink>

                                <NavLink
                                    to="/supplier-orders"
                                    className="menu-link"
                                    data-tooltip ="Suppliers Orders"
                                >
                                    <FaFileInvoice />
                                </NavLink>

                                <NavLink
                                    to="/customers"
                                    className="menu-link"
                                    data-tooltip ="Customers"
                                >
                                    👥
                                </NavLink>
                            </>
                        )}

                        <NavLink to="/about" className="menu-link" data-tooltip ="About">
                            <FaInfoCircle />
                        </NavLink>

                        <NavLink to="/contact-us" className="menu-link" data-tooltip ="Contact Us">
                            <FaEnvelope />
                        </NavLink>
                    </>
                )}

            </div>
        </>




    );
}
