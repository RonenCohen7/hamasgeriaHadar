
import "./customer-crud.css";
import { NavLink, Outlet } from "react-router-dom";



export function CustomerCrud() {



    return (

        <div className="CustomerCrud">
            <h2>Customer Management</h2>
            <nav>
                <NavLink to="/customers">Customers List</NavLink>
                <span> | </span>

                <NavLink to="/customers/add">Add Customer</NavLink>
                <span> | </span>

                <NavLink to="/customers/search">Search</NavLink>

                <span>|</span>

                <NavLink to="/customers/vip-report">VIP Report</NavLink>
            </nav>
            <hr />
            <Outlet />

        </div>

    );
}
