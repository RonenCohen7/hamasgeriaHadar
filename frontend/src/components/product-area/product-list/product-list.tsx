
import "./product-list.css";


import { FaBoxOpen, FaPlus, FaSearch } from "react-icons/fa";


export function ProductList() {
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
                <button type="button" className="add-product-button">
                    <FaPlus />
                    <span>Add product</span>
                </button>
            </header>
            <div className="products-toolbar">
                <div className="products-search">
                    <FaSearch />
                    <input type="search" placeholder="Search products..."/>
                </div>
                <div className="products-count">
                    <FaBoxOpen />
                    <div>
                        <strong>10</strong>
                        <span>Total products</span>
                    </div>
                </div>
            </div>
            <div className="products-content">
                <div className="products-placeholder">Product card will appear here</div>
                <div>

                </div>
            </div>
        </section>
    );
}
