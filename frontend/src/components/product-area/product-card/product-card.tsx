import { useNavigate } from "react-router-dom";
import type { ProductModel } from "../../models/product-model";
import "./product-card.css";

interface ProductCardProps {
    product: ProductModel;
}



export function ProductCard({ product }: ProductCardProps) {
    const navigate = useNavigate();
    
    function showDetails(){
        navigate(`/products/${product.idProduct}`);
    }


    return (
        <div className="product-card" onClick={showDetails}>

			<div className="product-image">
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.productName} />

                ): (<span>No image...</span>)}
            </div>
            <h3>{product.productName}</h3>
            <p>{product.productPrice}</p>
            <span>Stock:
                <strong>{product.productStock}</strong>
            </span>
            <span>
                Minimum:
                <strong>{product.minimumStock}</strong>
            </span>
            

        </div>
    );
}
