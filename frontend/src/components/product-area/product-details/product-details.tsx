import { useNavigate, useParams } from "react-router-dom";
import "./product-details.css";
import { useTitle } from "../../utils/UseTitle";
import { useEffect, useState } from "react";
import { ProductModel } from "../../models/product-model";
import { productService } from "../../service/productService";
import { notificationService } from "../../service/notificationService";

export function ProductDetails() {

    useTitle("Details")

    const { id } = useParams()
    const [product, setProduct] = useState<ProductModel | null>(null);
    const navigate = useNavigate()


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

    async function deleteCurrentProduct(){
        if(!product) return;
        const ok = window.confirm(`Delete "${product.productName}`);
        if(!ok) return;
        try{
            await productService.deleteProduct(product.idProduct);
            notificationService.success("Product deleted successfully")
            navigate("/products");
        }catch(err:any){
            notificationService.error(err.message);
            
        }
    }


    return (
        <div className="ProductDetails">

            <section className="product-details">
                <div className="product-header">
                    <div className="details-image">
                        {product?.imageUrl ? (
                            <img src={product.imageUrl} alt={product.imageName ?? ""} />
                        ) : (<span>No Image</span>)}
                    </div>
                    <div className="details-info">
                        <h1>{product?.productName}</h1>
                        <div className="info-row">
                            <span>Price</span>
                            <strong>₪{product?.productPrice}</strong>
                        </div>
                        <div className="info-row">
                            <span>Stock</span>
                            <strong>{product?.productStock}</strong>
                        </div>
                        <div className="info-row">
                            <span>Minimum Stock</span>
                            <strong>{product?.minimumStock}</strong>
                        </div>
                         <div className="info-row">
                            <span>Catalog Number</span>
                            <strong>{product?.catalogNumber}</strong>
                        </div>
                        <div className="info-row">
                            <span>Cost</span>
                            <strong>₪{product?.productCost}</strong>
                        </div>
                       
                        <br></br>

                        <div className="product-action">
                            <button className="btn-action" onClick={editProduct}>Edit ✍🏻</button>
                            <button className="btn-action">Inventory 📦</button>
                            <button className="btn-action">Supplier 🚚</button>
                            <button className="btn-action" btn-delete onClick={deleteCurrentProduct}>Delete 🗑️</button>


                        </div>
                        <br></br>
                        <button className="btn-back-to-products" onClick={showProducts}>Back to products ⬅</button>

                    </div>
                </div>

            </section>

        </div>
    );
}
