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
import { useTranslation } from "react-i18next";



export function AddProduct() {

    const { t, i18n } = useTranslation();

    const isHebrew = i18n.language === "he";

    useTitle(t("addProduct.pageTitle"))

    const [categories, setCategories] =
        useState<ProductCategoryModel[]>([]);

    const { register, handleSubmit, formState: { errors } } = useForm<ProductModel>({
        defaultValues: {
            isFeatured: false,
            displayOrder: 0
        }
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);



    const navigate = useNavigate();


    useEffect(() => {

        supplierService
            .getAllSuppliers()
            .then(suppliersFromApi =>
                setSuppliers(suppliersFromApi)
            )
            .catch(err => {

                console.log(err);

                notificationService.error(
                    t("addProduct.loadSuppliersError")
                );

            })

    }, [t]);


    useEffect(() => {

        productCategoryService
            .getAllCategories()
            .then(categories =>
                setCategories(categories)
            )
            .catch(err =>
                console.log(err)
            );

    }, []);


    function handleImageChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {

        const file = event.target.files?.[0];

        if (!file) return;

        setPreviewUrl(
            URL.createObjectURL(file)
        );

    }


    async function send(formData: ProductModel) {

        try {

            const imageFiles =
                formData.image as unknown as FileList;

            if (imageFiles?.length > 0) {

                formData.image = imageFiles[0];

            }
            else {

                delete formData.image;

            }

            const addedProduct =
                await productService.addProduct(formData);

            notificationService.success(
                t("addProduct.success")
            );

            navigate(
                `/products/${addedProduct.idProduct}`
            );

        } catch (err: any) {

            console.log(
                "Add product error:",
                err
            );

            console.log(
                "Backend response:",
                err.response?.data
            );

            const serverData =
                err.response?.data;

            const message =
                typeof serverData === "string"
                    ? serverData
                    : serverData?.message ??
                    err.message ??
                    t("addProduct.error");

            notificationService.error(message);

        }

    }


    return (

        <div
            className="AddProduct"
            dir={isHebrew ? "rtl" : "ltr"}
        >

            <h1>
                {t("addProduct.title")}
            </h1>

            <form
                className="add-form"
                onSubmit={handleSubmit(send)}
            >

                <label>
                    {t("addProduct.category")}
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
                        {t("addProduct.selectCategory")}
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
                    {t("addProduct.supplier")}
                </label>

                <select
                    defaultValue=""
                    {...register("idSupplier", {
                        required: t("addProduct.validation.supplierRequired"),
                        valueAsNumber: true
                    })}
                >

                    <option
                        value=""
                        disabled
                    >
                        {t("addProduct.selectSupplier")}
                    </option>

                    {suppliers.map(supplier => (

                        <option
                            key={supplier.idSupplier}
                            value={supplier.idSupplier}
                        >
                            {supplier.supplierName}
                        </option>

                    ))}

                    {errors.idSupplier && (

                        <span className="error">
                            {errors.idSupplier.message}
                        </span>

                    )}

                </select>


                <label>
                    {t("addProduct.productName")}
                </label>

                <input
                    type="text"
                    {...register("productName", {
                        required: true
                    })}
                />


                <label>
                    {t("addProduct.catalogNumber")}
                </label>

                <input
                    type="text"
                    {...register("catalogNumber", {
                        required: true
                    })}
                />


                <label>
                    {t("addProduct.cost")}
                </label>

                <input
                    type="number"
                    step="0.01"
                    {...register("productCost", {
                        required: true
                    })}
                />


                <label>
                    {t("addProduct.price")}
                </label>

                <input
                    type="number"
                    step="0.01"
                    {...register("productPrice", {
                        required: true
                    })}
                />


                <label>
                    {t("addProduct.stock")}
                </label>

                <input
                    type="number"
                    step="0.01"
                    {...register("productStock", {
                        required: true
                    })}
                />


                <label>
                    {t("addProduct.minimumStock")}
                </label>

                <input
                    type="number"
                    step="0.01"
                    {...register("minimumStock", {
                        required: true
                    })}
                />


                <label>
                    {t("addProduct.unit")}
                </label>

                <select
                    defaultValue=""
                    {...register("unitType", {
                        required: true
                    })}
                >

                    <option
                        value=""
                        disabled
                    >
                        {t("addProduct.selectUnit")}
                    </option>

                    {Object.values(UnitType).map(unit => (

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
                            {t("addProduct.featured")}
                        </label>

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

                            <label>
                                {t("addProduct.displayOrder")}
                            </label>

                            <input
                                type="number"
                            />

                        </div>


                        <div className="image-field">

                            <label>
                                {t("addProduct.image")}
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                {...register("image", {
                                    onChange: handleImageChange
                                })}
                            />

                            {previewUrl && (
                                <div className="add-product-image-preview">
                                    <img
                                        src={previewUrl}
                                        alt={t("addProduct.image")}
                                        />
                                </div>
                            )}

                        </div>

                    </div>

                </div>
                
                <button
                    type="submit"
                    className="add-product-submit-button"
                    >
                        {t("addProduct.save")}
                    </button>

            </form>

        </div>
    );
}