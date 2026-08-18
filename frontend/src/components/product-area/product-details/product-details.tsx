import { useNavigate, useParams } from "react-router-dom";
import "./product-details.css";
import { useTitle } from "../../utils/UseTitle";
import { useEffect, useState } from "react";
import { ProductModel } from "../../models/product-model";
import { productService } from "../../service/productService";
import { notificationService } from "../../service/notificationService";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/inventory-store";
import { dialogService } from "../../service/dialogService";
import { useTranslation } from "react-i18next";




export function ProductDetails() {

    const { t, i18n } = useTranslation();

    const isHebrew = i18n.language === "he";

    useTitle(t("productDetails.pageTitle"))

    const { id } = useParams()

    const [product, setProduct] = useState<ProductModel | null>(null);

    const navigate = useNavigate()

    const user = useSelector((state: RootState) => state.auth.user)

    const isAdmin = user?.role === "admin";

    useEffect(() => {

        if (!id) return;


        productService
            .getOneProduct(Number(id))
            .then(product => setProduct(product))
            .catch(error => console.log(error)
            )

    }, [id]);


    function showProducts() {

        navigate("/products");

    }

    function editProduct() {

        navigate(`/products/edit/${product?.idProduct}`);

    }

    function showSupplier() {

        if (!product?.idSupplier) {

            notificationService.error(
                t("productDetails.noSupplier")
            );

            return
        }

        navigate(`/suppliers/${product.idSupplier}`);

    }

    function showInventory() {

        if (!product) return;

        navigate(`/inventory-live?productId=${product.idProduct}`);

    }

    async function deleteCurrentProduct() {

        if (!product) return;

        const ok = await dialogService.confirm(
            t("productDetails.deleteDialog.title"),
            t("productDetails.deleteDialog.message"),
            t("productDetails.deleteDialog.delete"),
            t("productDetails.deleteDialog.cancel")
        );

        if (!ok) return;

        try {

            await productService.deleteProduct(product.idProduct);

            notificationService.success(
                t("productDetails.deleteSuccess")
            )

            navigate("/products");

        } catch (err: any) {

            notificationService.error(err.message);

        }
    }


    return (

        <div
            className="ProductDetails"
            dir={isHebrew ? "rtl" : "ltr"}
        >

            <section className="product-details">

                <div className="product-header">

                    <div className="details-image">

                        {product?.imageUrl ? (

                            <img
                                src={product.imageUrl}
                                alt={product.imageName ?? ""}
                            />

                        ) : (

                            <span>
                                {t("productDetails.noImage")}
                            </span>

                        )}

                    </div>

                    <div className="details-info">

                        <h1>
                            {product?.productName}
                        </h1>

                        <div className="info-row">

                            <span>
                                {t("productDetails.price")}
                            </span>

                            <strong>
                                ₪{Number(product?.productPrice ?? 0).toFixed(0)}
                            </strong>

                        </div>

                        <div className="info-row">

                            <span>
                                {t("productDetails.stock")}
                            </span>

                            <strong>
                                {Number(product?.productStock ?? 0).toFixed(0)}
                            </strong>

                        </div>

                        <div className="info-row">

                            <span>
                                {t("productDetails.minimumStock")}
                            </span>

                            <strong>
                                {Number(product?.minimumStock ?? 0).toFixed(0)}
                            </strong>

                        </div>

                        <div className="info-row">

                            <span>
                                {t("productDetails.catalogNumber")}
                            </span>

                            <strong>
                                {product?.catalogNumber}
                            </strong>

                        </div>

                        <div className="info-row">

                            <span>
                                {t("productDetails.cost")}
                            </span>

                            <strong>
                                ₪{Number(product?.productCost ?? 0).toFixed(0)}
                            </strong>

                        </div>

                        <div className="product-actions">

                            {isAdmin && (

                                <>

                                    <button
                                        className="btn-action"
                                        onClick={editProduct}
                                    >
                                        {t("productDetails.edit")} ✍🏻
                                    </button>

                                    <button
                                        className="btn-action"
                                        onClick={deleteCurrentProduct}
                                    >
                                        {t("productDetails.delete")} 🗑️
                                    </button>

                                </>

                            )}

                            <button
                                className="btn-action"
                                onClick={showInventory}
                            >
                                {t("productDetails.inventory")} 📦
                            </button>

                            <button
                                className="btn-action"
                                onClick={showSupplier}
                            >
                                {t("productDetails.supplier")} 🚚
                            </button>

                        </div>


                        <br></br>

                        <button
                            className="btn-back-to-products"
                            onClick={showProducts}
                        >
                            {t("productDetails.backToProducts")} ⬅
                        </button>

                    </div>

                </div>

            </section>

        </div>
    );
}