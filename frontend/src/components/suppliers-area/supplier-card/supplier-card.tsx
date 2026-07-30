import { useNavigate } from "react-router-dom";

import "./supplier-card.css";
import type { SupplierModel } from "../../models/supplier-model";


type SupplierCardProps = {
    supplier:SupplierModel;
}


export function SupplierCard(props: SupplierCardProps) {
    
   
    const navigate = useNavigate();



    return (
        <article className="supplier-card" onClick={()=>{
            navigate(`/suppliers/${props.supplier.idSupplier}`)
        }}>

        <h3>{props.supplier.supplierName}</h3>

        <p>
            💌 {props.supplier.supplierEmail}
        </p>

        <p>
            📱 {props.supplier.supplierMobile}
        </p>
        <p>
            📍{props.supplier.supplierAddress}
        </p>



        </article>
    );
}
