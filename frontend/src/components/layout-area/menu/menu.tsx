import { NavLink } from "react-router-dom";
import "./menu.css";
import { FaHome, FaBoxOpen, FaInfoCircle, FaEnvelope, FaTruck } from "react-icons/fa";
import { useEffect, useState } from "react";



export function Menu() {

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




    return (

        <>
            <div className="beer-logo" style={positions[index]}>

                🍺
            </div>
            <div className="menu">


                <NavLink to="/" className="menu-link" data-tooltip="Home" aria-label="Home"><FaHome /></NavLink>
                <NavLink to="/products" className="menu-link" data-tooltip="Products"><FaBoxOpen /></NavLink>
                <NavLink to="/suppliers" className="menu-link" data-tooltip="suppliers"><FaTruck/></NavLink>
                <NavLink to="/about" className="menu-link" data-tooltip="About"><FaInfoCircle /></NavLink>
                <NavLink to="/contact-us" className="menu-link" data-tooltip="Contact Us"><FaEnvelope /></NavLink>


            </div>

        </>




    );
}
