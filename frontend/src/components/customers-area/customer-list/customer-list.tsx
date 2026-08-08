import { useEffect } from "react";
import "./customer-list.css";
import { customerService } from "../../service/customerService";
import { CustomerCard } from "../customer-card/customer-card";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/inventory-store";
import { removeCustomerFromStore, setCustomers } from "../../redux/customer-slice";
import { notificationService } from "../../service/notificationService";
import { dialogService } from "../../service/dialogService";




export function CustomerList() {
    const dispatch = useDispatch<AppDispatch>();

    const customers = useSelector((state: RootState) => state.customers.items);

    const DeleteCustomer = async(id:number) => {
        const ok = await dialogService.confirm(
            "Delete Customer",
            "Are you sure you want to delete this customer?",
            "Delete",
            "Cancel"
        )





        if(!ok) return;
        try {

            await customerService.deleteCustomer(id);

            dispatch(removeCustomerFromStore(id));
            notificationService.success("Customer Delete Successfully");

        }catch(err:any){
            console.log(err);
            notificationService.error("Failed to delete customer")
            
        }
    }

    useEffect(() => {
        customerService
            .getAllCustomers()
            .then(customers => dispatch(setCustomers(customers)))
            .catch(console.error);
    }, [dispatch]);

    return (
        <div className="CustomerList">

            <h2>Customers</h2>
            <div className="customer-list-grid">
                {customers.map(customer => (
                    <CustomerCard
                        key={customer.idCustomer}
                        customer={customer}
                        onDelete={DeleteCustomer}
                    />
                ))}
            </div>


        </div>
    );
}