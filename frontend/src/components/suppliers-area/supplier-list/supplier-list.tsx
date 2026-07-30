import { useEffect, useState } from "react";
import { useTitle } from "../../utils/UseTitle";
import "./supplier-list.css";
import { SupplierModel } from "../../models/supplier-model";
import { useNavigate } from "react-router-dom";
import { supplierService } from "../../service/supplierService";
import { FaPlus, FaSearch , FaTruck} from "react-icons/fa";
import { SupplierCard } from "../supplier-card/supplier-card";

export function SupplierList() {


    useTitle("Suppliers")

    const [supplier, setSupplier] = useState<SupplierModel[]>([]);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    useEffect(()=>{
        supplierService.getAllSuppliers()
        .then(setSupplier)
        .catch(console.log);
        
    },[]);

    const filteredSuppliers = supplier.filter(supplier => supplier.supplierName.toLowerCase().includes(search.toLowerCase()));



    return (
        <section className="suppliers-page">
            <header className="suppliers-header">
                <div>
                    <span className="suppliers-eyebrow">
                        Suppliers
                    </span>
                    <h1>Suppliers</h1>
                    <p>Manage all suppliers of the pub</p>
                </div>
                <button type="button" className="add-supplier-button" onClick={()=>{
                    navigate("/supplier/new")
                }}>
                    <FaPlus />
                    <span>Add Supplier</span>
                </button>
            </header>
            <div className="suppliers-toolbar">
                <div className="suppliers-search">
                    <FaSearch/>
                    <input type="search" placeholder="Search suppliers..." value={search} onChange={(e)=> setSearch(e.target.value)}/>
                </div>
                <div className="suppliers-count">
                    <FaTruck/>
                    <div>
                        <strong>
                            {filteredSuppliers.length}
                        </strong>
                        <span>
                            Total suppliers
                        </span>
                    </div>

                </div>

            </div>

            <div className="suppliers-content">
                {filteredSuppliers.map(supplier => (<SupplierCard key={supplier.idSupplier} supplier={supplier}/>))}

            </div>
        </section>
    );
}
