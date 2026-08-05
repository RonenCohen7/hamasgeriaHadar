import { NavLink } from "react-router-dom";
import "./menu.css";
import { FaHome, FaBoxOpen, FaInfoCircle, FaEnvelope, FaTruck, FaFileInvoice, FaWarehouse, FaClipboardCheck, FaSalesforce } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FaSackDollar } from "react-icons/fa6";
import type { RootState } from "../../redux/inventory-store";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { authService } from "../../service/authService";


export function Menu() {

    const user = useSelector((state: RootState) => state.auth.user);
    const role = user?.role;

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

                                <small>{user.role}</small>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="logout-button"
                            onClick={logout}
                        >
                            🚪 Logout
                        </button>

                    </div>
                )}


                <NavLink to="/" className="menu-link" data-tooltip="Home" aria-label="Home"><FaHome /></NavLink>

                {user ? (<NavLink to="/customers" className="menu-link" data-tooltip="Customers" aria-label="Customers"> 👥

                </NavLink>) : (<NavLink to="login" className="menu-link" data-tooltip="Login">🔐</NavLink>)}

                {role !== "employee" && (<NavLink to="/inventory-live" className="menu-link" data-tooltip="Live Inventory"><FaWarehouse /></NavLink>)}

                <NavLink to="/sales/new" className="menu-link" data-tooltip="Create New Sale"><FaSackDollar></FaSackDollar></NavLink>

                <NavLink to="/quick-sale" className="menu-link" data-tooltip="Quick Sale"><FaSalesforce></FaSalesforce></NavLink>

                <NavLink to="/products" className="menu-link" data-tooltip="Products"><FaBoxOpen /></NavLink>

                <NavLink to="/inventory-count" className="menu-link" data-tooltip="Stock Count"><FaClipboardCheck></FaClipboardCheck></NavLink>



                {role !== "employee" && (<NavLink to="/suppliers" className="menu-link" data-tooltip="suppliers"><FaTruck /></NavLink>)}

                {role !== "employee" && (<NavLink to="/supplier-orders" className="menu-link" data-tooltip="Supplier Orders"><FaFileInvoice></FaFileInvoice></NavLink>)}

                

                {role !== "employee" && (<NavLink to="/about" className="menu-link" data-tooltip="About"><FaInfoCircle /></NavLink>)}

                <NavLink to="/contact-us" className="menu-link" data-tooltip="Contact Us"><FaEnvelope /></NavLink>
            </div>

        </>




    );
}
