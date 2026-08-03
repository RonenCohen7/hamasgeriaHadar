import type React from "react";
import type { RootState } from "../../redux/inventory-store";
import "./auth-guard.css";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";



interface AuthGuardProps {
    children:ReactNode
}

export function AuthGuard({children}: AuthGuardProps) {

    const token = useSelector(
        (state:RootState) => state.auth.token
    );
    if(!token){
        return <Navigate to="/login" replace/>
    }

    return <>{children}</>;
}


