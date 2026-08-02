import { useEffect, useState } from "react";
import "./inventory-monitor.css";
import { useTitle } from "../../utils/UseTitle";
import { inventoryService } from "../../service/inventoryService";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/inventory-store";
import { clearUpdatedProduct, setInventory } from "../../redux/inventory-slice";
import { useSearchParams } from "react-router-dom";


export function InventoryMonitor() {

    useTitle("Live Inventory");
    const dispatch = useDispatch();

    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const selectedProductId = Number(searchParams.get("productId"));



    const inventory = useSelector(
        (state: RootState) => state.inventory.items
    );
    const lastUpdateFromRedux = useSelector(
        (state: RootState) => state.inventory.lastUpdate
    );

    const updatedProductIds = useSelector(
        (state: RootState) => state.inventory.updatedProductIds
    );

    const totalProducts = inventory.length;

    const totalStock = inventory.reduce(
        (sum, item) => sum + Number(item.productStock),
        0
    );

    const lowStock = inventory.filter(
        item =>
            Number(item.productStock) <=
            Number(item.minimumStock)
    ).length;

    useEffect(() => {
        inventoryService
            .getLiveInventory()
            .then(data => {
                dispatch(setInventory(data));
                setLastUpdate(new Date());
                setIsConnected(true);
            })
            .catch(error => {
                console.error(error);
                setIsConnected(false);
            });
    }, []);

    useEffect(() => {
        if (updatedProductIds.length === 0) return;

        const timers = updatedProductIds.map(id =>
            window.setTimeout(() => {
                dispatch(clearUpdatedProduct(id));
            }, 1500)
        );

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [updatedProductIds, dispatch]);


  useEffect(() => {
    if (!selectedProductId || inventory.length === 0) return;

    const timer = window.setTimeout(() => {
        const row = document.getElementById(
            `product-${selectedProductId}`
        );

        row?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, 100);

    return () => window.clearTimeout(timer);

}, [selectedProductId, inventory.length]);

    return (
        <div className="InventoryMonitor">

            <header className="inventory-header">

                <div>
                    <span className="inventory-eyebrow">
                        Real-Time Inventory
                    </span>

                    <h1>Live Inventory</h1>

                    <p>
                        Current product quantity and supplier information
                    </p>
                </div>

                <div className="inventory-live-status">

                    <span
                        className={
                            isConnected
                                ? "status-dot connected"
                                : "status-dot disconnected"
                        }
                    />

                    <div>
                        <strong>
                            {isConnected ? "Live" : "Offline"}
                        </strong>

                        <span>
                            Last update
                            <br />
                            {lastUpdate.toLocaleDateString("en-GB")}
                            {" • "}
                            {lastUpdate.toLocaleTimeString("en-GB")}
                        </span>
                    </div>

                </div>

            </header>

            <section className="inventory-stats">

                <article className="inventory-stat-card">
                    <span>Total Products</span>
                    <strong>{totalProducts}</strong>
                    <small>Active inventory items</small>
                </article>

                <article className="inventory-stat-card">
                    <span>Total Stock</span>
                    <strong>{totalStock.toFixed(0)}</strong>
                    <small>Units currently in stock</small>
                </article>

                <article
                    className={
                        lowStock > 0
                            ? "inventory-stat-card warning"
                            : "inventory-stat-card"
                    }
                >
                    <span>Low Stock</span>
                    <strong>{lowStock}</strong>
                    <small>Products requiring attention</small>
                </article>

                <article className="inventory-stat-card live">
                    <span>Connection</span>

                    <strong>
                        {isConnected ? "CONNECTED" : "OFFLINE"}
                    </strong>

                    <small>
                        Real-time inventory updates
                    </small>
                </article>

            </section>

            <table>

                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Stock</th>
                        <th>Minimum</th>
                        <th>Supplier</th>
                    </tr>
                </thead>

                <tbody>
                    {inventory.map(item => (
                        <tr
                            key={item.idProduct}
                            className={
                                [
                                updatedProductIds.includes(item.idProduct)
                                    ? "inventory-updated"
                                    : "",
                                selectedProductId === item.idProduct ? "inventory-selected": ""
                            ]
                            .filter(Boolean).join(" ")
                             }
                        >
                            <td>{item.productName}</td>
                            <td>{Number(item.productStock).toFixed(3)}</td>
                            <td>{Number(item.minimumStock).toFixed(3)}</td>
                            <td>{item.supplierName ?? "No supplier"}</td>
                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    );
}