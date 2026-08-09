import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/inventory-store";


type Props = {
    children: React.ReactNode;
};

export function CustomerProtectedRoute({ children }: Props) {

    const customer = useSelector(
        (state: RootState) => state.customerAuth.customer
    );

    if (!customer) {
        return <Navigate to="/customer-login" replace />;
    }

    return <>{children}</>;
}