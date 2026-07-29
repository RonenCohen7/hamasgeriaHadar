import { Route, Routes } from "react-router-dom";
import "./routing.css";
import { Home } from "../../pages-area/home/home";
import { About } from "../../pages-area/about/about";
import { ProductList } from "../../product-area/product-list/product-list";

export function Routing() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList/>} />
            <Route path="/about" element={<About />} />
            <Route path="/contact-us" element={<h2>Contact Us</h2>} />
            <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
    );
}
