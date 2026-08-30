import React, { useEffect, useState } from "react";
import "./edit-product.css";
import { productService } from "../../service/productService";
import { useTitle } from "../../utils/UseTitle";
import { useNavigate, useParams } from "react-router-dom";
import { ProductModel } from "../../models/product-model";
import { useForm } from "react-hook-form";

import { notificationService } from "../../service/notificationService";
import { ProductCategoryModel } from "../../models/category-model";

import { productCategoryService } from "../../service/productCategoryService";

import { useTranslation } from "react-i18next";
import { UnitType } from "../../models/enum";



export function EditProduct() {

    const { t, i18n } = useTranslation();

    const isHebrew = i18n.language === "he";

    useTitle(t("editProduct.pageTitle"));


    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState<ProductModel | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [categories, setCategories] = useState<ProductCategoryModel[]>([]);

    const [selectedImage, setSelectedImage] = useState<File | null>(null);



    const { register, handleSubmit, reset } = useForm<ProductModel>()


    useEffect(() => {
        if (!id) return;

        productCategoryService
            .getAllCategories()
            .then(setCategories)
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

        setSelectedImage(file);

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

            if (selectedImage) {
                formData.image = selectedImage;
            }
            else {
                delete formData.image
            }



            console.log(formData);

            await productService.updateProduct(formData)

            notificationService.success(
                t("editProduct.updateSuccess")
            )

            navigate(`/products/${formData.idProduct}`)

        } catch (err: any) {

            notificationService.error(err.message);

        }
    }


    return (

        <div
            className="EditProduct" dir={isHebrew ? "rtl" : "ltr"}
        >

            <h1>
                {t("editProduct.title")}
            </h1>

            {product && (

                <form
                    className="edit-form"
                    onSubmit={handleSubmit(send)}
                >

                    <label>
                        {t("editProduct.productName")}
                    </label>

                    <input
                        type="text"
                        {...register("productName")}
                    />


                    <label>
                        {t("editProduct.supplier")}
                    </label>

                    <input
                        type="text"
                        value={product.supplierName ?? ""}
                        readOnly
                        className="readonly-field"
                    />


                    <label>
                        {t("editProduct.category")}
                    </label>

                    <select
                        defaultValue=""
                        {...register("idCategory", {
                            required: true,
                            valueAsNumber: true
                        })}
                    >

                        <option
                            value=""
                            disabled
                        >
                            {t("editProduct.selectCategory")}
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


                    <label>
                        {t("editProduct.cost")}
                    </label>

                    <input
                        type="number"
                        step="0.01"
                        {...register("productCost")}
                    />


                    <label>
                        {t("editProduct.price")}
                    </label>

                    <input
                        type="number"
                        step="0.01"
                        {...register("productPrice")}
                    />


                    <label>
                        {t("editProduct.stock")}
                    </label>

                    <input
                        type="number"
                        step="0.01"
                        {...register("productStock")}
                    />


                    <label>
                        {t("editProduct.minimumStock")}
                    </label>

                    <input
                        type="number"
                        step="0.01"
                        {...register("minimumStock")}
                    />


                    <label>
                        {t("editProduct.unit")}
                    </label>

                    <select
                        {...register("unitType")}
                    >

                        {(Object.values(UnitType) as string[]).map(unit => (

                            <option
                                key={unit}
                                value={unit}
                            >
                                {unit}
                            </option>

                        ))}

                    </select>


                    <div className="extra-fields-row">

                        <div className="extra-field">

                            <label>
                                {t("editProduct.featured")}
                            </label>

                            <label className="switch">

                                <input
                                    type="checkbox"
                                    {...register("isFeatured")}
                                />

                                <span className="slider"></span>

                            </label>

                        </div>


                        <div className="display-order-group">

                            <label>
                                {t("editProduct.displayOrder")}
                            </label>

                            <input
                                type="number"
                                min="0"
                                {...register("displayOrder", {
                                    valueAsNumber: true
                                })}
                            />

                        </div>

                    </div>


                    <label>
                        {t("editProduct.image")}
                    </label>

                    {previewUrl && (

                        <div className="image-preview">

                            <img
                                src={previewUrl}
                                alt={product.productName}
                            />

                        </div>

                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />


                    <div className="form-button">

                        <button
                            type="submit"
                        >
                            {t("editProduct.save")}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                        >
                            {t("editProduct.cancel")}
                        </button>

                        <button
                            type="button"
                            onClick={backToProducts}
                        >
                            {t("editProduct.backToProducts")} ⬅
                        </button>

                    </div>

                </form>

            )}


        </div>
    );
}