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




export function ProductDetails() {

    useTitle("Details")

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
            notificationService.error("No supplier assigned to this product");
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
            "Delete product",
            "Are you sure you want to delete this product",
            "Delete",
            "Cancel"
        );
        if (!ok) return;
        try {
            await productService.deleteProduct(product.idProduct);
            notificationService.success("Product deleted successfully")
            navigate("/products");
        } catch (err: any) {
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
                        <div className="product-actions">
                            {isAdmin && (
                                <>
                                    <button
                                        className="btn-action" onClick={editProduct}>Edit ✍🏻
                                    </button>

                                    <button
                                        className="btn-action"onClick={deleteCurrentProduct}>Delete 🗑️
                                    </button>
                                </>
                            )}

                            <button
                                className="btn-action" onClick={showInventory}>Inventory 📦
                            </button>

                            <button
                                className="btn-action" onClick={showSupplier} >Supplier 🚚
                            </button>
                        </div>

                        
                        <br></br>
                        <button className="btn-back-to-products" onClick={showProducts}>Back to products ⬅</button>

                    </div>
                </div>

            </section>

        </div>
    );
}
