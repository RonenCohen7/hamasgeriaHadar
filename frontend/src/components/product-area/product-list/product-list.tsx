
import { useEffect, useState } from "react";
import "./product-list.css";


import { FaBoxOpen, FaPlus, FaSearch } from "react-icons/fa";
import { productService } from "../../service/productService";
import { ProductModel } from "../../models/product-model";
import { ProductCard } from "../product-card/product-card";
import { useTitle } from "../../utils/UseTitle";
import { useNavigate } from "react-router-dom";
import { current } from "@reduxjs/toolkit";
import { socketService } from "../../service/socket-service";



export function ProductList() {

    const [products, setProducts] = useState<ProductModel[]>([]);
    const [updateProductId, setUpdateProductId] = useState<number | null>(null);


    useTitle("products");

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
        }):void => {
            setProducts(currentProducts => 
                currentProducts.map(product => 
                    product.idProduct === data.idProduct ? {...product, productStock:String(data.stockAfter)}: product
                )
            );
            setUpdateProductId(data.idProduct);
            window.setTimeout(()=>{
                setUpdateProductId(currentId => currentId === data.idProduct ? null : currentId)
            },1500);
        }
        socketService.onInventoryUpdated(handleInventoryUpdated);

        return()=>{
            socketService.offInventoryUpdated(handleInventoryUpdated)
        }

    }, []);
    console.log(products);


    const filterProducts = products.filter(product => product.productName.toLowerCase().includes(search.toLowerCase()))

    return (
        <section className="products-page">
            <header className="products-header">
                <div>
                    <span className="products-eyebrow">
                        Inventory
                    </span>
                    <h1>Products</h1>
                    <p>Manage the products, price and stock levels of Hadar pub. </p>
                </div>
                <button type="button" className="add-product-button" onClick={() => navigate("/product/new")}>
                    <FaPlus />
                    <span>Add product</span>
                </button>
            </header>
            <div className="products-toolbar">
                <div className="products-search">
                    <FaSearch />
                    <input type="search" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="products-count">
                    <FaBoxOpen />
                    <div>
                        <strong>{filterProducts.length} / {products.length}</strong>
                        <span>Total products</span>
                    </div>
                </div>
            </div>

            <div className="products-content">
                {filterProducts.map(product => (<ProductCard key={product.idProduct} product={product} />))}
            </div>

        </section>
    );
}
