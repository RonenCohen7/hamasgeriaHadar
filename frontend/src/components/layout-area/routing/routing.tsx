import { Route, Routes } from "react-router-dom";

import { Home } from "../../pages-area/home/home";
import { About } from "../../pages-area/about/about";
import { ProductList } from "../../product-area/product-list/product-list";
import { ProductDetails } from "../../product-area/product-details/product-details";
import { EditProduct } from "../../product-area/edit-product/edit-product";
import { AddProduct } from "../../product-area/add-product/add-product";
import { SupplierList } from "../../suppliers-area/supplier-list/supplier-list";
import { AddSupplier } from "../../suppliers-area/add-supplier/add-supplier";
import { SupplierDetails } from "../../suppliers-area/supplier-details/supplier-details";
import { EditSupplier } from "../../suppliers-area/edit-supplier/edit-supplier";
import { SupplierOrderList } from "../../suppliers-area/supplier-order-list/supplier-order-list";
import { AddSupplierOrder } from "../../suppliers-area/add-supplier-order/add-supplier-order";
import { SupplierOrderDetails } from "../../suppliers-area/supplier-order-details/supplier-order-details";
import { AddSale } from "../../sales-area/add-sale/add-sale";
import { InventoryMonitor } from "../../inventory-area/inventory-monitor/inventory-monitor";
import { InventoryCount } from "../../sales-area/inventory-count/inventory-count";
import { ContactUs } from "../../pages-area/contact-us/contact-us";
import { Login } from "../../user-area/login/login";
import { Register } from "../../user-area/register/register";

import { AuthGuard } from "../../user-area/auth-guard/auth-guard";

export function Routing() {
    return (
        <Routes>
            <Route path="/" element={<AuthGuard><Home /></AuthGuard>} />
            

            <Route path="login" element={<Login/>}/>
            <Route path="register" element={<Register />}/>

            <Route path="/about" element={<About />} />
            <Route path="/contact-us" element={<ContactUs/>} />


            <Route path="/products" element={<AuthGuard><ProductList/></AuthGuard>} />

            <Route path="/products/:id" element={<AuthGuard><ProductDetails/></AuthGuard>} />

            <Route path="/products/edit/:id" element={<AuthGuard><EditProduct/></AuthGuard>} />

            <Route path="/product/new" element={<AuthGuard><AddProduct/></AuthGuard>} />


            <Route path="/suppliers" element={<AuthGuard><SupplierList/></AuthGuard>}/>

            <Route path="/supplier/add" element={<AuthGuard><AddSupplier/></AuthGuard>}/>

            <Route path="/suppliers/:id" element={<AuthGuard><SupplierDetails/></AuthGuard>}/>

            <Route path="/suppliers/edit/:id" element={<AuthGuard><EditSupplier/></AuthGuard>}/>

            <Route path="/supplier-orders" element={<AuthGuard><SupplierOrderList/></AuthGuard>}/>
            
            
            <Route path="/supplier-orders/add" element={<AuthGuard><AddSupplierOrder/></AuthGuard>}/>

            <Route path="/supplier-orders/:id" element={<AuthGuard><SupplierOrderDetails/></AuthGuard>}/>

            <Route path="/inventory-live" element={<AuthGuard><InventoryMonitor/></AuthGuard>}/>


            <Route path="/sales/new" element={<AuthGuard><AddSale/></AuthGuard>}/>
            <Route path="/inventory-count" element={<AuthGuard><InventoryCount /></AuthGuard>}/>



            <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
    );
}
