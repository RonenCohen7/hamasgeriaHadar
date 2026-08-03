import { useEffect, useState } from "react";
import { useTitle } from "../../utils/UseTitle";
import "./inventory-count.css";
import { ProductModel } from "../../models/product-model";
import { productService } from "../../service/productService";
import { current } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { notificationService } from "../../service/notificationService";
import { inventoryService } from "../../service/inventoryService";
import { setInventory } from "../../redux/inventory-slice";

export function InventoryCount() {

    useTitle("Inventory Count")

    const dispatch = useDispatch()

    const [isSaving, setIsSaving] = useState<boolean>(false);

    const [products, setProducts] = useState<ProductModel[]>([]);

    const [countedStock, setCountedStock] = useState<Record<number, number>>({});

    useEffect(() => {
        productService
            .getAllProducts()
            .then(productFromApi => {
                setProducts(productFromApi);
                const initialStock: Record<number, number> = {}

                productFromApi.forEach(product => {
                    initialStock[product.idProduct] = Number(product.productStock);
                });
                setCountedStock(initialStock);
            })
            .catch(error => {
                console.error(
                    "Failed loading inventory count:",
                    error
                );
            });
    }, []);



    async function saveAllChanges(): Promise<void> {
        const changedProducts = products.filter(product => {
            const currentStock = Number(product.productStock)
            const counted = countedStock[product.idProduct] ?? currentStock;
            return counted !== currentStock
        })
        if (changedProducts.length === 0) {
            notificationService.error("No inventory changes to save")
            return;
        }
        const approved = window.confirm(`Save inventory changes for ${changedProducts.length} products?`)
        if (!approved) return;
        try {

            setIsSaving(true)
            await Promise.all(changedProducts.map(async product => {
                const fullProduct = await productService.getOneProduct(product.idProduct);

                fullProduct.productStock = String(countedStock[product.idProduct]);

                await productService.updateProduct(fullProduct)
            }))

            const updatedInventory = await inventoryService.getLiveInventory();
            dispatch(setInventory(updatedInventory));

            setProducts(currentProducts =>
                currentProducts.map(product => ({
                    ...product,
                    productStock: String(
                        countedStock[product.idProduct] ??
                        Number(product.productStock)
                    )
                }))
            );
            notificationService.success(`${changedProducts.length} products updated successfully`)

        } catch (err) {

        }
    }

    function changeCountedStock(
        idProduct: number,
        value: number
    ): void {

        setCountedStock(current => ({
            ...current,
            [idProduct]: value
        }));
    }


    return (
        <section className="InventoryCount">
            <header className="inventory-count-header">
                <div>
                    <span>INventory Control</span>
                    <h1>Stock Count</h1>
                    <p>
                        Enter the physical quantity counted for each product
                    </p>
                </div>
            </header>
            <div className="inventory-count-table-wrapper">
                <table className="inventory-count-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Current Stock</th>
                            <th>Counted Stock</th>
                            <th>Difference</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => {
                            const currentStock = Number(product.productStock);
                            const counted = countedStock[product.idProduct] ?? currentStock;
                            const difference = counted - currentStock;
                            return (
                                <tr key={product.idProduct}>
                                    <td>{product.productName}</td>
                                    <td>{currentStock}</td>
                                    <td>
                                        <input type="number" min="0" step="0.01" onChange={
                                            event => changeCountedStock(product.idProduct, Number(event.target.value))
                                        } />
                                    </td>
                                    <dt>
                                        {difference > 0 ? "+" : ""}
                                        {difference.toFixed(3)}
                                    </dt>
                                    <td>
                                        {currentStock <= Number(product.minimumStock) ? "Low Stock" : "Ok"}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

            </div>
            <div>
                <button 
                    type="button"
                    className="inventory-count-save-button" 
                    onClick={saveAllChanges}
                    disabled={isSaving}
                    >
                    {isSaving ? "Saving Change" : "Save All Changes"}
                </button>
            </div>

        </section>
    );
}
