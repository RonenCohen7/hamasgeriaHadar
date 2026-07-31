import { useNavigate } from "react-router-dom";
import { useTitle } from "../../utils/UseTitle";
import "./add-supplier.css";
import { SupplierModel } from "../../models/supplier-model";
import { useForm,  type SubmitHandler } from "react-hook-form";
import { notificationService } from "../../service/notificationService";
import { supplierService } from "../../service/supplierService";

export function AddSupplier() {

    useTitle("Add Supplier");

    const navigate = useNavigate();
    const { register, handleSubmit, formState } = useForm<SupplierModel>();

    const send: SubmitHandler<SupplierModel> = async (supplier) => {
        try{

            const addSupplier =  await supplierService.addSupplier(supplier);

            notificationService.success("Supplier added successfully");

            navigate(`/suppliers/${addSupplier.idSupplier}`);

        }catch(err:any){
            console.log(err);
            
            notificationService.error("Failed to Add Supplier");
            
        }

    }

    return (
        <div className="AddSupplier">
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
                        navigate(`/suppliers`)
                    }}>Cancel</button>
                </div>

            </form>

        </div>
    );
}
