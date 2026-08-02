import { ToastContainer } from "react-toastify";
import { Copyrights } from "../copyrights/copyrights";
import { Header } from "../header/header";
import { Menu } from "../menu/menu";
import { Routing } from "../routing/routing";
import "./layout.css";
import { useEffect } from "react";
import { socketService } from "../../service/socket-service";
import { useDispatch } from "react-redux";
import { updateInventoryProduct } from "../../redux/inventory-slice";

export function Layout() {

    const dispatch = useDispatch();
    useEffect(()=>{

        const handleInventoryUpdated = (data: {
            idProduct:number;
            stockAfter: number;
        }): void => {
            console.log("inventory-updated received:", data);

            dispatch(updateInventoryProduct({
                idProduct:Number(data.idProduct),
                stockAfter:Number(data.stockAfter)
            }))
        };
        socketService.onInventoryUpdated(handleInventoryUpdated);

        return()=>{
            socketService.offInventoryUpdated(handleInventoryUpdated);
        }

    },[dispatch]);



    return (
        <div className="layout">

            <header>
                <Header />
            </header>
            <nav>
                <Menu />
            </nav>
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
