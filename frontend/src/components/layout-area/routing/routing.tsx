import { Route, Routes } from "react-router-dom";
import "./routing.css";
import { Home } from "../../pages-area/home/home";
import { About } from "../../pages-area/about/about";
import { ProductList } from "../../product-area/product-list/product-list";
import { ProductDetails } from "../../product-area/product-details/product-details";
import { EditProduct } from "../../product-area/edit-product/edit-product";
import { AddProduct } from "../../product-area/add-product/add-product";



export function Routing() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList/>} />
            <Route path="/about" element={<About />} />
            <Route path="/contact-us" element={<h2>Contact Us</h2>} />
            <Route path="*" element={<h2>Page Not Found</h2>} />
            <Route path="/products/:id" element={<ProductDetails />}/>
            <Route path="/products/edit/:id" element ={<EditProduct />}/>
            <Route path="/product/new" element={<AddProduct/>}/>
        </Routes>
    );
}
