import {
    FaBoxOpen,
    FaCalendarAlt,
    FaChartLine,
    FaTruck
} from "react-icons/fa";

import "./home.css";
import { useTitle } from "../../utils/UseTitle";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/inventory-store";
import { useEffect, useMemo, useState } from "react";
import { inventoryService } from "../../service/inventoryService";
import { setInventory } from "../../redux/inventory-slice";
import { supplierService } from "../../service/supplierService";
import { eventService } from "../../service/eventService";


export function Home() {

    useTitle("Home");
    const navigate = useNavigate();

    const dispatch = useDispatch()

    const inventory = useSelector((state: RootState) => state.inventory.items);

    const totalProducts = inventory.length;

    const totalStock = inventory.reduce((sum, product) => sum + Number(product.productStock), 0);

    const [supplierCount, setSupplierCount] = useState(0);
    const [eventCount, setEventCount] = useState<number>(0);

    const lowStockProducts = useMemo(() => {
        return inventory
            .filter(product => Number(product.productStock) <= Number(product.minimumStock))
            .sort((a, b) => Number(a.productStock) - Number(b.productStock))
    }, [inventory]);

    const stockOverviewProducts = useMemo(() => {
        return [...inventory]
            .sort((a, b) => {
                const distanceA =
                    Number(a.productStock) -
                    Number(a.minimumStock);

                const distanceB =
                    Number(b.productStock) -
                    Number(b.minimumStock);

                return distanceA - distanceB;
            })
            .slice(0, 5);
    }, [inventory]);


    useEffect(() => {
        supplierService
            .getSupplierCount()
            .then(count => setSupplierCount(count))
            .catch(error => console.log("Failed to loading supplier count", error));

    }, []);



    useEffect(() => {
        if (inventory.length > 0) return;
        inventoryService
            .getLiveInventory()
            .then(data => dispatch(setInventory(data)))
            .catch(error => console.log("Failed to  loading home inventory", error));

    }, [dispatch, inventory.length]);

    useEffect(() => {
        eventService
            .getEventCount()
            .then(count => setEventCount(count))
            .catch(error => console.log("Failed to load events", error));
    }, []);


    function showProducts() {
        navigate("/products");
    }

    function showSuppliers() {
        navigate("/suppliers")
    }

    function showEvents() {
        navigate("/events")
    }

    return (
        <section className="home-page">

            <div className="home-heading">
                <div>
                    <h1>
                        HAMASGERIYA
                    </h1>

                    <p>
                        Track products, suppliers, events and sales
                        from one management dashboard.
                    </p>

                    <p>
                        {lowStockProducts.length > 0
                            ? `⚠ ${lowStockProducts.length} products require attention`
                            : "✅ All products are above minimum stock"}
                    </p>
                </div>

                <div className="home-date">
                    Today
                    <strong>
                        {new Date().toLocaleDateString("en-GB")}
                    </strong>
                </div>
            </div>

            <div className="stats-grid">

                <article className="stat-card">
                    <div className="stat-icon">
                        <FaBoxOpen />
                    </div>

                    <div>
                        <span>Total Products</span>
                        <strong onClick={showProducts}>{totalProducts}</strong>
                        <small>Available in inventory</small>
                    </div>
                </article>

                <article className="stat-card">
                    <div className="stat-icon">
                        <FaTruck />
                    </div>

                    <div>
                        <span onClick={showSuppliers}>Suppliers</span>
                        <strong>{supplierCount}</strong>
                        <small>Active business partners</small>
                    </div>
                </article>

                <article className="stat-card">
                    <div className="stat-icon">
                        <FaCalendarAlt />
                    </div>

                    <div>
                        <span onClick={showEvents}>Events</span>
                        <strong>{eventCount}</strong>
                        <small>Registered pub events</small>
                    </div>
                </article>

                <article className="stat-card">
                    <div className="stat-icon">
                        <FaChartLine />
                    </div>

                    <div>
                        <span>Total Stock</span>
                        <strong>{totalStock}</strong>
                        <small>Connected to the management API</small>
                    </div>
                </article>

            </div>

            <div className="home-content-grid">

                <article className="dashboard-panel">
                    <div className="panel-heading">
                        <div>
                            <span>Inventory</span>
                            <h2>Stock overview</h2>
                        </div>

                        <button type="button" onClick={showProducts}>
                            View products
                        </button>
                    </div>


                    <div className="stock-list">

                        {stockOverviewProducts.map(product => {
                            const stock = Number(product.productStock);
                            const minimum = Number(product.minimumStock);
                            const isLow = stock <= minimum;

                            return (
                                <div
                                    key={product.idProduct}
                                    className={
                                        isLow
                                            ? "stock-row low"
                                            : "stock-row"
                                    }
                                >
                                    <div>
                                        <strong>{product.productName}</strong>

                                        <span>
                                            Minimum: {minimum.toFixed(0)}
                                        </span>
                                    </div>

                                    <div
                                        className={
                                            isLow
                                                ? "stock-value danger"
                                                : "stock-value"
                                        }
                                    >
                                        {stock.toFixed(0)} units
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                </article>

                <article className="dashboard-panel activity-panel">
                    <div className="panel-heading">
                        <div>
                            <span>Activity</span>
                            <h2>System status</h2>
                        </div>
                    </div>

                    <div className="activity-item">
                        <span className="activity-dot" />
                        <div>
                            <strong>Backend API</strong>
                            <small>Running on port 4000</small>
                        </div>
                    </div>

                    <div className="activity-item">
                        <span className="activity-dot" />
                        <div>
                            <strong>MySQL database</strong>
                            <small>Docker container is healthy</small>
                        </div>
                    </div>

                    <div className="activity-item">
                        <span className="activity-dot" />
                        <div>
                            <strong>Frontend</strong>
                            <small>React development server is active</small>
                        </div>
                    </div>
                </article>

            </div>

        </section>
    );
}