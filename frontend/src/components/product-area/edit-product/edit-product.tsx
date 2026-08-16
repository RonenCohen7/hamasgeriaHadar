import React, { useEffect, useState } from "react";
import "./edit-product.css";
import { productService } from "../../service/productService";
import { useTitle } from "../../utils/UseTitle";
import { useNavigate, useParams } from "react-router-dom";
import { ProductModel } from "../../models/product-model";
import { useForm } from "react-hook-form";

import { notificationService } from "../../service/notificationService";
import { ProductCategoryModel } from "../../models/category-model";
import { SupplierModel } from "../../models/supplier-model";
import { productCategoryService } from "../../service/productCategoryService";
import { supplierService } from "../../service/supplierService";
import { UnitType } from "../../models/enum";



export function EditProduct() {
    useTitle("Edit Product");


    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState<ProductModel | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [categories, setCategories] = useState<ProductCategoryModel[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);



    const { register, handleSubmit, reset } = useForm<ProductModel>()


    useEffect(() => {
        if (!id) return;

        productCategoryService
            .getAllCategories()
            .then(setCategories)
            .catch(console.error)


        supplierService
            .getAllSuppliers()
            .then(setSuppliers)
            .catch(console.error)

        productService
            .getOneProduct(Number(id))
            .then(product => {
                setProduct(product)
                reset(product);
                setPreviewUrl(product.imageUrl);
            })
            .catch(err => console.log(err));

    }, [id, reset]);


    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        setPreviewUrl(currentPreviewUrl => {
            if (currentPreviewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(currentPreviewUrl);
            }

            return URL.createObjectURL(file);
        });
    }

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith("blob")) {
                URL.revokeObjectURL(previewUrl);
            }
        }
    }, [previewUrl]);

    function backToProducts() {
        navigate("/products")
    }

    async function send(formData: ProductModel) {
        try {

            formData.idProduct = Number(id);
            formData.isActive = product!.isActive;
            formData.imageName = product!.imageName;

            const imageFiles = formData.image as unknown as FileList;

            if (imageFiles?.length > 0) {
                formData.image = imageFiles[0];
            }
            else {
                delete formData.image;
            }

           

            console.log(formData);
            await productService.updateProduct(formData)
            
            notificationService.success("Product Update successfully")
            
            navigate(`/products/${formData.idProduct}`)
        } catch (err: any) {
            notificationService.error(err.message);

        }
    }


    return (
        <div className="EditProduct">

            <h1>Edit Product</h1>

            {product && (
                <form className="edit-form" onSubmit={handleSubmit(send)}>

                    <label>Product Name</label>
                    <input type="text" {...register("productName")} />


                    <label>Supplier</label>
                    <input
                        type="text"
                        value={product.supplierName ?? ""}
                        readOnly
                        className="readonly-field"
                        />

                    
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


                        <label>Cost</label>
                        <input type="number" step="0.01" {...register("productCost")} />

                        <label>Price</label>
                        <input type="number" step="0.01" {...register("productPrice")} />

                        <label>Stock</label>
                        <input type="number" step="0.01" {...register("productStock")} />

                        <label>Minimum Stock</label>
                        <input type="number" step="0.01" {...register("minimumStock")} />

                        <label>Unit</label>
                        <select {...register("unitType")}>
                            {Object.values(UnitType).map(unit => (
                                <option key={unit} value={unit}>
                                    {unit}
                                </option>
                            ))}
                        </select>

                        <div className="extra-fields-row">

                            <div className="extra-field">

                                <label>Featured</label>

                                <label className="switch">
                                    <input 
                                        type="checkbox"
                                        {...register("isFeatured")}
                                    />
                                    <span className="slider"></span>

                                </label>
                            </div>
                            <div className="display-order-group">
                                <label>Display Order</label>
                                <input
                                    type="number"
                                    min="0"
                                    {...register("displayOrder", {valueAsNumber: true})}
                                    />

                            </div>

                        </div>

                        <label>Image</label>
                        {previewUrl && (
                            <div className="image-preview">
                                <img
                                    src={previewUrl}
                                    alt={product.productName}
                                />
                            </div>
                        )}
                        <input type="file" accept="image/*" {...register("image", { onChange: handleImageChange })} />

                        <div className="form-button">
                            <button type="submit">Save</button>
                            <button type="button" onClick={()=> navigate(-1)}>Cancel</button>
                            <button type="button" onClick={backToProducts}>Back to products ⬅</button>
                        </div>
                </form>
            )}


        </div>
    );
}
