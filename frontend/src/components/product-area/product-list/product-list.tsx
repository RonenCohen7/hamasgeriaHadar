import { useEffect, useState } from "react";
import "./product-list.css";


import { FaBoxOpen, FaPlus, FaSearch } from "react-icons/fa";
import { productService } from "../../service/productService";
import { ProductModel } from "../../models/product-model";
import { ProductCard } from "../product-card/product-card";
import { useTitle } from "../../utils/UseTitle";
import { useNavigate } from "react-router-dom";

import { socketService } from "../../service/socket-service";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/inventory-store";
import { useTranslation } from "react-i18next";


export function ProductList() {

    const { t, i18n } = useTranslation();

    const isHebrew = i18n.language === "he";

    const [products, setProducts] = useState<ProductModel[]>([]);

    const [updateProductId, setUpdateProductId] = useState<number | null>(null);

    const user = useSelector((state: RootState) => state.auth.user);

    const isAdmin = user?.role === "admin";

    useTitle(t("products.pageTitle"));

    const navigate = useNavigate();

    const [search, setSearch] = useState<string>("");

    useEffect(() => {

        productService
            .getAllProducts()
            .then(productFromApi => {

                setProducts(productFromApi);

            })
            .catch(error => {

                console.log(error);

            })

        const handleInventoryUpdated = (data: {
            idProduct: number;
            stockAfter: number;
        }): void => {

            setProducts(currentProducts =>
                currentProducts.map(product =>
                    product.idProduct === data.idProduct
                        ? {
                            ...product,
                            productStock: String(data.stockAfter)
                        }
                        : product
                )
            );

            setUpdateProductId(data.idProduct);

            window.setTimeout(() => {

                setUpdateProductId(currentId =>
                    currentId === data.idProduct
                        ? null
                        : currentId
                )

            }, 1500);
        }

        socketService.onInventoryUpdated(handleInventoryUpdated);

        return () => {

            socketService.offInventoryUpdated(handleInventoryUpdated)

        }

    }, []);

    console.log(products);


    const filterProducts = products.filter(product =>
        product.productName
            .toLowerCase()
            .includes(search.toLowerCase())
    )


    return (

        <section
            className="products-page"
            dir={isHebrew ? "rtl" : "ltr"}
        >

            <header className="products-header">

                <div>

                    <span className="products-eyebrow">
                        {t("products.inventory")}
                    </span>

                    <h1>
                        {t("products.title")}
                    </h1>

                    <p>
                        {t("products.description")}
                    </p>

                </div>


                {isAdmin && (

                    <button
                        type="button"
                        className="add-product-button"
                        onClick={() =>
                            navigate("/product/new")
                        }
                    >

                        <FaPlus />

                        <span>
                            {t("products.addProduct")}
                        </span>

                    </button>

                )}

            </header>


            <div className="products-toolbar">

                <div className="products-search">

                    <FaSearch />

                    <input
                        type="search"
                        placeholder={t("products.searchPlaceholder")}
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                <div className="products-count">

                    <FaBoxOpen />

                    <div>

                        <strong>
                            {filterProducts.length} / {products.length}
                        </strong>

                        <span>
                            {t("products.totalProducts")}
                        </span>

                    </div>

                </div>

            </div>


            <div className="products-content">

                {filterProducts.map(product => (

                    <ProductCard
                        key={product.idProduct}
                        product={product}
                    />

                ))}

            </div>

        </section>

    );
}