import { useNavigate } from "react-router-dom";
import type { ProductModel } from "../../models/product-model";
import "./product-card.css";
import { useTranslation } from "react-i18next";

interface ProductCardProps {
    product: ProductModel;
}

export function ProductCard({ product }: ProductCardProps) {

    const { t } = useTranslation();

    const navigate = useNavigate();

    function showDetails() {
        navigate(`/products/${product.idProduct}`);
    }

    return (

        <div
            className="product-card"
            onClick={showDetails}
        >

            <div className="product-image">

                {product.imageUrl ? (

                    <img
                        src={product.imageUrl}
                        alt={product.productName}
                    />

                ) : (

                    <span>
                        {t("products.noImage")}
                    </span>

                )}

            </div>

            <h3>
                {product.productName}
            </h3>

            <p>
                  {Number(product.productPrice).toFixed(0)}
            </p>

            <span>

                {t("products.stock")}

                <strong>
                        {Number(product.productStock).toFixed(0)}
                </strong>

            </span>

            <span>

                {t("products.minimum")}

                <strong>
                      {Number(product.minimumStock).toFixed(0)}
                </strong>

            </span>

        </div>

    );
}