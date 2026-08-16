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
import { QuickSale } from "../../sales-area/quick-sale/quick-sale";
import { CustomerCrud } from "../../customers-area/customer-crud/customer-crud";
import { CustomerList } from "../../customers-area/customer-list/customer-list";
import { AddCustomer } from "../../customers-area/add-customer/add-customer";
import { EditCustomer } from "../../customers-area/edit-customer/edit-customer";
import { SearchCustomer } from "../../customers-area/search-customer/search-customer";
import { CardDetails } from "../../vip-card-area/card-details/card-details";
import { RechargeCard } from "../../vip-card-area/recharge-card/recharge-card";
import { TransactionsPage } from "../../vip-card-area/transactions-page/transactions-page";
import { EditCard } from "../../vip-card-area/edit-card/edit-card";

import { CustomerDashboard } from "../../customers-area/customer-dashboard/customer-dashboard";
import { CustomerProtectedRoute } from "../../utils/customerProtectedRouter";
import { AddCard } from "../../vip-card-area/add-card/add-card";
import { CustomerRegister } from "../../customers-area/customer-register/customer-register";
import { EventsList } from "../../events-area/events-list/events-list";
import { AddEvent } from "../../events-area/add-event/add-event";
import { EditEvent } from "../../events-area/edit-event/edit-event";
import { EventMedia } from "../../events-area/event-media/event-media";
import { EventDetails } from "../../events-area/event-details/event-details";
import { ForgotPassword } from "../../customers-area/forgot-password/forgot-password";
import { CustomerLogin } from "../../customers-area/customer-login/customer-login";
import { EventOrder } from "../../events-area/event-order/event-order";
import { PublicHome } from "../../pages-area/public-home/public-home";
import { ExperienceList } from "../../experiencs-area/experience-list/experience-list";
import { ExperienceDetails } from "../../experiencs-area/experience-details/experience-details";
import { ExperienceEdit } from "../../experiencs-area/experience-edit/experience-edit";
import { AddExperience } from "../../experiencs-area/add-experience/add-experience";



export function Routing() {
    return (
        <Routes>
            <Route path="/" element={<PublicHome />} />

            <Route path="/customer-login" element={<CustomerLogin />} />

            <Route path="/customer-forgot-password" element={<ForgotPassword/>}/>

            <Route path="/customer-register" element={<CustomerRegister />} />

            <Route path="/customer-dashboard" element={<CustomerProtectedRoute><CustomerDashboard /></CustomerProtectedRoute>} />

            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            <Route path="/about" element={<About />} />
            <Route path="/contact-us" element={<ContactUs />} />


            <Route path="/products" element={<AuthGuard><ProductList /></AuthGuard>} />

            <Route path="/products/:id" element={<AuthGuard><ProductDetails /></AuthGuard>} />

            <Route path="/products/edit/:id" element={<AuthGuard><EditProduct /></AuthGuard>} />

            <Route path="/product/new" element={<AuthGuard><AddProduct /></AuthGuard>} />



            <Route path="/suppliers" element={<AuthGuard><SupplierList /></AuthGuard>} />

            <Route path="/supplier/add" element={<AuthGuard><AddSupplier /></AuthGuard>} />

            <Route path="/suppliers/:id" element={<AuthGuard><SupplierDetails /></AuthGuard>} />

            <Route path="/suppliers/edit/:id" element={<AuthGuard><EditSupplier /></AuthGuard>} />

            <Route path="/supplier-orders" element={<AuthGuard><SupplierOrderList /></AuthGuard>} />

            <Route path="/supplier-orders/add" element={<AuthGuard><AddSupplierOrder /></AuthGuard>} />

            <Route path="/supplier-orders/:id" element={<AuthGuard><SupplierOrderDetails /></AuthGuard>} />



            <Route path="/inventory-live" element={<AuthGuard><InventoryMonitor /></AuthGuard>} />


            <Route path="/sales/new" element={<AuthGuard><AddSale /></AuthGuard>} />

            <Route path="/quick-sale" element={<AuthGuard><QuickSale /></AuthGuard>} />

            <Route path="/inventory-count" element={<AuthGuard><InventoryCount /></AuthGuard>} />

            <Route path="/events/order/:idEvent" element={<EventOrder/>}/>


            {/* <Route path="/events/payment/:idSale" element={<EventPayment/>}/> */}
        

            <Route path="/customers" element={<AuthGuard><CustomerCrud /></AuthGuard>}>

                <Route index element={<CustomerList />} />

                <Route path="list" element={<CustomerList />} />

                <Route path="add" element={<AddCustomer />} />

                <Route path="edit/:id" element={<EditCustomer />} />

                <Route path="search" element={<SearchCustomer />} />

            </Route>


            <Route path="/vip-cards/customer/:idCustomer" element={<CardDetails />} />

            <Route path="/vip-cards/create/customer/:idCustomer" element={<AddCard />} />

            <Route path="/vip-cards/:idVipCard/recharge" element={<RechargeCard />} />

            <Route path="/vip-cards/:idVipCard/transactions" element={<TransactionsPage />} />

            <Route path="/vip-cards/:idVipCard/edit" element={<EditCard />} />

            <Route path="/events" element={<EventsList />} />

            <Route path="/events/add" element={<AddEvent />} />

            <Route path="/events/edit/:idEvent" element={<EditEvent />} />

            <Route path="/events/details/:idEvent" element={<EventDetails />} />

            <Route path="/events/media/:idEvent" element={<EventMedia />} />


            <Route path="/experiences/" element={<ExperienceList/>}/>
            <Route path="/experiences/:type" element={<ExperienceList/>}/>

            <Route path="/experience/:id" element={<ExperienceDetails/>}/>

            <Route path="/experiences/edit/:id" element={<ExperienceEdit/>}/>

            <Route path="/experiences/add" element={<AddExperience/>}/>





            <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
    );
}
