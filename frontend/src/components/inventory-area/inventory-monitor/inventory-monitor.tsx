import { useEffect, useState } from "react";
import "./inventory-monitor.css";
import { useTitle } from "../../utils/UseTitle";
import { inventoryService } from "../../service/inventoryService";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/inventory-store";
import { clearUpdatedProduct, setInventory } from "../../redux/inventory-slice";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";


export function InventoryMonitor() {

    const { t, i18n } = useTranslation();

    const isHebrew = i18n.language === "he";

    useTitle(t("inventoryMonitor.pageTitle"));

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
        (sum, item) =>
            sum + Number(item.productStock),
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

            timers.forEach(timer =>
                clearTimeout(timer)
            );

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

        return () =>
            window.clearTimeout(timer);

    }, [selectedProductId, inventory.length]);


    return (

        <div
            className="InventoryMonitor"
            dir={isHebrew ? "rtl" : "ltr"}
        >

            <header className="inventory-header">

                <div>

                    <span className="inventory-eyebrow">
                        {t("inventoryMonitor.eyebrow")}
                    </span>

                    <h1>
                        {t("inventoryMonitor.title")}
                    </h1>

                    <p>
                        {t("inventoryMonitor.description")}
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
                            {isConnected
                                ? t("inventoryMonitor.live")
                                : t("inventoryMonitor.offline")}
                        </strong>

                        <span>

                            {t("inventoryMonitor.lastUpdate")}

                            <br />

                            {lastUpdate.toLocaleDateString(
                                isHebrew ? "he-IL" : "en-GB"
                            )}

                            {" • "}

                            {lastUpdate.toLocaleTimeString(
                                isHebrew ? "he-IL" : "en-GB"
                            )}

                        </span>

                    </div>

                </div>

            </header>


            <section className="inventory-stats">


                <article className="inventory-stat-card">

                    <span>
                        {t("inventoryMonitor.totalProducts")}
                    </span>

                    <strong>
                        {totalProducts}
                    </strong>

                    <small>
                        {t("inventoryMonitor.activeInventoryItems")}
                    </small>

                </article>


                <article className="inventory-stat-card">

                    <span>
                        {t("inventoryMonitor.totalStock")}
                    </span>

                    <strong>
                        {totalStock.toFixed(0)}
                    </strong>

                    <small>
                        {t("inventoryMonitor.unitsInStock")}
                    </small>

                </article>


                <article
                    className={
                        lowStock > 0
                            ? "inventory-stat-card warning"
                            : "inventory-stat-card"
                    }
                >

                    <span>
                        {t("inventoryMonitor.lowStock")}
                    </span>

                    <strong>
                        {lowStock}
                    </strong>

                    <small>
                        {t("inventoryMonitor.requiresAttention")}
                    </small>

                </article>


                <article className="inventory-stat-card live">

                    <span>
                        {t("inventoryMonitor.connection")}
                    </span>

                    <strong>
                        {isConnected
                            ? t("inventoryMonitor.connected")
                            : t("inventoryMonitor.offlineUpper")}
                    </strong>

                    <small>
                        {t("inventoryMonitor.realTimeUpdates")}
                    </small>

                </article>

            </section>


            <table>

                <thead>
                    <tr>
                        <th>{t("inventoryMonitor.product")}</th>
                        <th>{t("inventoryMonitor.stock")}</th>
                        <th>{t("inventoryMonitor.minimum")}</th>
                        <th>{t("inventoryMonitor.supplier")}</th>
                    </tr>
                </thead>


                <tbody>

                    {inventory.map(item => (

                        <tr
                            id={`product-${item.idProduct}`}
                            key={item.idProduct}
                            className={
                                [
                                    updatedProductIds.includes(item.idProduct)
                                        ? "inventory-updated"
                                        : "",

                                    selectedProductId === item.idProduct
                                        ? "inventory-selected"
                                        : ""
                                ]
                                    .filter(Boolean)
                                    .join(" ")
                            }
                        >

                            <td>
                                {item.productName}
                            </td>

                            <td>
                                {Number(item.productStock).toFixed(0)}
                            </td>

                            <td>
                                {Number(item.minimumStock).toFixed(0)}
                            </td>

                            <td>
                                {item.supplierName ??
                                    t("inventoryMonitor.noSupplier")}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );
}