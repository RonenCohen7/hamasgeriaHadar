import { ToastContainer } from "react-toastify";
import { Copyrights } from "../copyrights/copyrights";
import { Header } from "../header/header";
import { Menu } from "../menu/menu";
import { Routing } from "../routing/routing";
import "./layout.css";

export function Layout() {

    

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
