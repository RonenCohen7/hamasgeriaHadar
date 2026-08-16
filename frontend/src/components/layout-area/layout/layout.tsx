import { ToastContainer } from "react-toastify";
import { Copyrights } from "../copyrights/copyrights";
import { Header } from "../header/header";
import { Menu } from "../menu/menu";
import { Routing } from "../routing/routing";
import "./layout.css";
import { useEffect } from "react";
import { socketService } from "../../service/socket-service";
import { useDispatch, useSelector } from "react-redux";
import { updateInventoryProduct } from "../../redux/inventory-slice";
import type { RootState } from "../../redux/inventory-store";

export function Layout() {

    const employeeUser = useSelector((state: RootState) => state.auth.user)

    const customerUser = useSelector((state: RootState) => state.customerAuth.customer);


    const isLoggedIn = !!employeeUser || !!customerUser;

    const dispatch = useDispatch();



    useEffect(() => {

        const handleInventoryUpdated = (data: {
            idProduct: number;
            stockAfter: number;
        }): void => {
            console.log("inventory-updated received:", data);

            dispatch(updateInventoryProduct({
                idProduct: Number(data.idProduct),
                stockAfter: Number(data.stockAfter)
            }))
        };
        socketService.onInventoryUpdated(handleInventoryUpdated);

        return () => {
            socketService.offInventoryUpdated(handleInventoryUpdated);
        }

    }, [dispatch]);

    console.log("employeeUser:", employeeUser);
    console.log("customerUser:", customerUser);
    console.log("isLoggedIn:", isLoggedIn);

    console.log(
        "layout class:",
        isLoggedIn ? "layout" : "layout no-menu"
    );

    return (
        <div className={isLoggedIn ? "layout": "layout no-menu"}>

            <header>
                <Header />
            </header>

            {isLoggedIn && (
                <nav>
                    <Menu />
                </nav>

            )}

            <main>
                <Routing />
            </main>
            <footer>
                <Copyrights />
            </footer>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
                theme="colored"
            />
        </div>
    );
}
