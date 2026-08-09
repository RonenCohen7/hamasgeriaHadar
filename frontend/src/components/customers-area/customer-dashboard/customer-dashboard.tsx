import { useSelector } from "react-redux";
import type { RootState } from "../../redux/inventory-store";
import "./customer-dashboard.css";

import { Navigate } from "react-router-dom";


export function CustomerDashboard() {

    const customer = useSelector((state: RootState) => state.customerAuth.customer);

    if(!customer){
        return <Navigate to="/customer-login" replace/>
    }

    return;

}
