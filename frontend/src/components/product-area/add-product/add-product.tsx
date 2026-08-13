import { useEffect, useState } from "react";
import "./add-product.css";
import { ProductCategoryModel } from "../../models/category-model";
import { useTitle } from "../../utils/UseTitle";
import { productCategoryService } from "../../service/productCategoryService";
import { useForm } from "react-hook-form";
import { ProductModel } from "../../models/product-model";


import { useNavigate } from "react-router-dom";
import { productService } from "../../service/productService";
import { notificationService } from "../../service/notificationService";
import { SupplierModel } from "../../models/supplier-model";
import { supplierService } from "../../service/supplierService";
import { UnitType } from "../../models/enum";



export function AddProduct() {

    useTitle("Add new Product")

    const [categories, setCategories] =
        useState<ProductCategoryModel[]>([]);

    const { register, handleSubmit, formState: { errors } } = useForm<ProductModel>({ defaultValues: { isFeatured: false, displayOrder: 0 } });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);



    const navigate = useNavigate();


    useEffect(() => {
        supplierService.getAllSuppliers()
            .then(suppliersFromApi => setSuppliers(suppliersFromApi))
            .catch(err => {
                console.log(err);
                notificationService.error("Failed to load suppliers");

            })
    }, []);


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


    async function send(formData: ProductModel) {
        try {

            const imageFiles = formData.image as unknown as FileList;

            if (imageFiles?.length > 0) {
                formData.image = imageFiles[0];
            }
            else {
                delete formData.image;
            }

            const addedProduct = await productService.addProduct(formData);
            notificationService.success("Product added successfully.");
            navigate(`/products/${addedProduct.idProduct}`);

        } catch (err: any) {
            console.log("Add product error:", err);
            console.log("Backend response:", err.response?.data);

            const serverData = err.response?.data;
            const message = typeof serverData === "string" ? serverData : serverData?.message ?? err.message ?? "Failed to add product";

            notificationService.error(message);
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

                <label>Supplier</label>
                <select defaultValue="" {...register("idSupplier", { required: "Supplier is Required", valueAsNumber: true })}>
                    <option value="" disabled>Select Supplier</option>
                    {suppliers.map(supplier => (<option key={supplier.idSupplier} value={supplier.idSupplier}>{supplier.supplierName}</option>))}
                    {errors.idSupplier && <span className="error">{errors.idSupplier.message}</span>}
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

                    <div className="extra-fields-row">
                        <div className="featured-group"></div>

                        <div className="display-order-group">
                            <label>Display Order</label>
                            <input type="number" />
                        </div>

                        <div className="image-field">
                            <label>Image</label>
                            <input type="file" />
                        </div>
                    </div>
                   
                </div>
            </form>

        </div>
    );
}