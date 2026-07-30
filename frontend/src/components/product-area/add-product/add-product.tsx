import { useEffect, useState } from "react";
import "./add-product.css";
import { ProductCategoryModel } from "../../models/category-model";
import { useTitle } from "../../utils/UseTitle";
import { productCategoryService } from "../../service/productCategoryService";
import { useForm } from "react-hook-form";
import { ProductModel } from "../../models/product-model";

import { UnitType } from "../../models/enum";
import { useNavigate } from "react-router-dom";
import { productService } from "../../service/productService";
import { notificationService } from "../../service/notificationService";

export function AddProduct() {

    useTitle("Add new Product")

    const [categories, setCategories] =
        useState<ProductCategoryModel[]>([]);

    const { register , handleSubmit } = useForm<ProductModel>();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

   
    const navigate = useNavigate();

    useEffect(() => {
        productCategoryService
            .getAllCategories()
            .then(categories => setCategories(categories))
            .catch(err => console.log(err));
    }, []);


    function handleImageChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];

        if (!file) return;

        setPreviewUrl(URL.createObjectURL(file));
    }


    async function send(formData:ProductModel){
        try{

            const imageFiles = formData.image as unknown as FileList;

            if(imageFiles?.length >0){
                formData.image = imageFiles[0];
            }
            else {
                delete formData.image;
            }

            const addedProduct = await productService.addProduct(formData);
            notificationService.success("Product added successfully.");
            navigate(`/products/${addedProduct.idProduct}`);

        }catch(err:any){
            notificationService.error(err.message);
            
        }
    }

    return (
        <div className="AddProduct">

            <h1>Add Product</h1>

            <form className="add-form" onSubmit={handleSubmit(send)}>
                <label>Category</label>
                <select
                    defaultValue=""
                    {...register("idCategory", {
                        required: true,
                        valueAsNumber: true
                    })}
                >
                    <option value="" disabled>
                        Select Category
                    </option>

                    {categories.map(category => (
                        <option
                            key={category.idCategory}
                            value={category.idCategory}
                        >
                            {category.categoryName}
                        </option>
                    ))}
                </select>
                <label>Product Name</label>
                <input type="text" {...register("productName", { required: true })} />

                <label>Catalog Number</label>
                <input type="text" {...register("catalogNumber", { required: true })} />

                <label>Cost</label>
                <input type="number" step="0.01" {...register("productCost", { required: true })} />

                <label>Price</label>
                <input type="number" step="0.01" {...register("productPrice", { required: true })} />

                <label>Stock</label>
                <input type="number" step="0.01" {...register("productStock", { required: true })} />

                <label>Minimum Stock</label>
                <input type="number" step="0.01" {...register("minimumStock", { required: true })} />

                <label>Unit</label>
                <select defaultValue="" {...register("unitType", { required: true })}>
                    <option value="" disabled>Select Unit</option>
                    {Object.values(UnitType).map(unit => (<option key={unit} value={unit}>{unit}</option>))}
                </select>

                <label>Image</label>
                {previewUrl && (<div className="image-preview">
                    <img src={previewUrl} alt="product preview" />
                </div>)}

                <input type="file" accept="image/*" {...register("image",{onChange: handleImageChange})}/>

                <div className="form-button">
                    <button type="submit">Save</button>
                    <button type="button" onClick={()=> navigate("/products")}>Cancel</button>
                </div>

            </form>

        </div>
    );
}