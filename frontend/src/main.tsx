import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { Layout } from "./components/layout-area/layout/layout";
import { store } from "./components/redux/inventory-store";
import { updateInventoryProduct } from "./components/redux/inventory-slice";
import { socketService } from "./components/service/socket-service";
import { notificationService } from "./components/service/notificationService";

socketService.connect();
socketService.onInventoryUpdated(data => {
    const stateBeforeUpdate = store.getState();

    const product = stateBeforeUpdate.inventory.items.find(
        item => item.idProduct === Number(data.idProduct)
    );

    const previousStock = Number(product?.productStock ?? 0);
    const stockAfter = Number(data.stockAfter);
    const minimumStock = Number(product?.minimumStock ?? 0);

    store.dispatch(
        updateInventoryProduct({
            idProduct: Number(data.idProduct),
            stockAfter
        })
    );

    console.log("Low stock check:", {
        product: product?.productName,
        previousStock,
        stockAfter,
        minimumStock
    });

    if (
        product &&
        previousStock > minimumStock &&
        stockAfter <= minimumStock
    ) {
        notificationService.error(
            `⚠️ ${product.productName} reached minimum stock. ` +
            `Current: ${stockAfter} | Minimum: ${minimumStock}`
        );
    }
});






createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        </Provider>
    </StrictMode>
);