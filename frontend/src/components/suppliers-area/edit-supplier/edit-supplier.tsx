import { useNavigate, useParams } from "react-router-dom";
import { useTitle } from "../../utils/UseTitle";
import "./edit-supplier.css";
import { SupplierModel } from "../../models/supplier-model";
import { useEffect } from "react";
import { supplierService } from "../../service/supplierService";
import { notificationService } from "../../service/notificationService";
import { useForm } from "react-hook-form";

export function EditSupplier() {

    useTitle("Edit Supplier");


    const { id } = useParams();

    const navigate = useNavigate();

    const { register, handleSubmit, reset, formState } = useForm<SupplierModel>();


    useEffect(() => {
        if(!id) return;

        supplierService.getOneSupplier(Number(id))
            .then(supplierFromApi =>{
                console.log("Supplier loaded", supplierFromApi);

                reset({
                    idSupplier: supplierFromApi.idSupplier,
                    supplierName: supplierFromApi.supplierName,
                    supplierEmail: supplierFromApi.supplierEmail,
                    supplierMobile: supplierFromApi.supplierMobile,
                    supplierAddress: supplierFromApi.supplierAddress,
                    isActive: supplierFromApi.isActive
                })
                
            })
            .catch(err => {
                console.log(err);
                notificationService.error("Failed to load supplier. ");
            })
    }, [id, reset]);

    async function send(supplier: SupplierModel) {
        try{

            supplier.idSupplier = Number(id);
            await supplierService.updateSupplier(supplier);
            notificationService.success("Supplier Update Successfully");
            navigate(`/suppliers/${supplier.idSupplier}`)

        }catch(err:any){
            console.log(err);
            notificationService.error("Failed to update supplier. ");
            
        }

    }

    return (
        <div className="EditSupplier">
            <form onSubmit={handleSubmit(send)}>
                <div className="form-group">

                    <label>Supplier Name</label>
                    <input type="text" {...register("supplierName", { required: true })} />

                    <span className="error">
                        {formState.errors.supplierName?.message}
                    </span>
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="text" {...register("supplierEmail", { required: true })} />
                    <span className="error">
                        {formState.errors.supplierEmail?.message}
                    </span>
                </div>
                <div className="form-group">
                    <label>Mobile</label>
                    <input type="text" {...register("supplierMobile", { required: true })} />
                    <span className="error">
                        {formState.errors.supplierMobile?.message}
                    </span>
                </div>
                <div className="form-group">
                    <label>Address</label>
                    <input type="text" {...register("supplierAddress", { required: true })} />
                    <span className="error">
                        {formState.errors.supplierAddress?.message}
                    </span>
                </div>
                <div className="form-group checkbox-group">
                    <label>
                        <input type="checkbox" {...register("isActive")} />Active
                    </label>
                </div>
                <div className="buttons">
                    <button type="submit">
                        Save
                    </button>
                    <button type="button" onClick={() => {
                        navigate(`/suppliers/${id}`)
                    }}>Cancel</button>
                </div>

            </form>

        </div>
    );
}
