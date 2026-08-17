import { NavLink } from "react-router-dom";
import "./menu.css";
import { FaHome, FaBoxOpen, FaInfoCircle, FaEnvelope, FaTruck, FaFileInvoice, FaWarehouse, FaClipboardCheck, FaSalesforce } from "react-icons/fa";
import { useEffect, useState } from "react";

import type { RootState } from "../../redux/inventory-store";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { authService } from "../../service/authService";
import { customerService } from "../../service/customerService";
import { useTranslation } from "react-i18next";


export function Menu() {

    const  { t } = useTranslation();

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
        navigate("/");
    }

    function logoutCustomer() {
        customerService.logoutCustomer()
        navigate("/");

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
                            🚪 {t("menu.logout")}
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
                                    <small>{t("menu.customer")}</small>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="logout-button"
                                onClick={logoutCustomer}>
                                🚪 {t("menu.logout")}
                            </button>
                        </div>

                        <NavLink to="/customer-dashboard" 
                        className="menu-link" 
                        data-tooltip={t("menu.dashboard")}>

                         🎭
                         </NavLink>

                        <NavLink
                            to={`/vip-cards/customer/${customer.idCustomer}`}
                            className="menu-link"
                            data-tooltip={t("menu.dashboard")}
                        >
                            💳
                        </NavLink>

                        {customer?.hasVipCard && (<NavLink
                            to={`/vip-cards/${customer.idCustomer}/transactions`}
                            className="menu-link"
                            data-tooltip={t("menu.myTransactions")}
                            
                        >
                            📋
                        </NavLink>)}


                    </>
                )}

                {/* ================= EMPLOYEE / ADMIN ================= */}

                {user && (
                    <>
                        <NavLink to="/" className="menu-link" data-tooltip ={t("menu.home")}>
                            <FaHome />
                        </NavLink>

                        {(role === "admin" || role === "manager") && (
                            <NavLink
                                to="/inventory-live"
                                className="menu-link"
                                data-tooltip={t("menu.inventoryLive")}
                            >
                                <FaWarehouse />
                            </NavLink>
                        )}




                        {(role === "admin" || role === "manager") && (
                            <NavLink
                                to="/events"
                                className="menu-link"
                                data-tooltip={t("menu.events")}
                            >
                                🎭
                            </NavLink>
                        )}
                             {(role === "admin" || role === "manager") && (
                            <NavLink
                                to="/experiences"
                                className="menu-link"
                                data-tooltip={t("menu.experiences")}
                            >
                                🧪
                            </NavLink>
                        )}




                        {/* <NavLink to="/sales/new" className="menu-link" data-tooltip="Create Sale">
                            <FaSackDollar />
                        </NavLink> */}

                        <NavLink to="/quick-sale" className="menu-link" data-tooltip={t("menu.quickSale")}>
                            <FaSalesforce />
                        </NavLink>

                        <NavLink to="/products" className="menu-link" data-tooltip={t("menu.products")}>
                            <FaBoxOpen />
                        </NavLink>

                        <NavLink to="/inventory-count" className="menu-link" data-tooltip={t("menu.inventoryCount")}>
                            <FaClipboardCheck />
                        </NavLink>

                        {(role === "admin" || role === "manager") && (
                            <>
                                <NavLink
                                    to="/suppliers"
                                    className="menu-link"
                                    data-tooltip={t("menu.suppliers")}
                                >
                                    <FaTruck />
                                </NavLink>

                                <NavLink
                                    to="/supplier-orders"
                                    className="menu-link"
                                    data-tooltip={t("menu.supplierOrders")}
                                >
                                    <FaFileInvoice />
                                </NavLink>

                                <NavLink
                                    to="/customers"
                                    className="menu-link"
                                    data-tooltip={t("menu.customers")}
                                >
                                    👥
                                </NavLink>
                            </>
                        )}

                        <NavLink to="/about" className="menu-link" data-tooltip={t("menu.about")}>
                            <FaInfoCircle />
                        </NavLink>

                        <NavLink to="/contact-us" className="menu-link" data-tooltip={t("menu.contactUs")}>
                            <FaEnvelope />
                        </NavLink>
                    </>
                )}

            </div>
        </>




    );
}
