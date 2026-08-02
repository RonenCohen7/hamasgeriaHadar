import { useNavigate } from "react-router-dom";
import { useTitle } from "../../utils/UseTitle";
import "./add-sale.css";
import { useEffect, useState } from "react";
import { ProductModel } from "../../models/product-model";
import { productService } from "../../service/productService";
import { AddSaleOrderItemModel, AddSaleOrderModel } from "../../models/sale-order-model";
import { notificationService } from "../../service/notificationService";
import { saleOrderService } from "../../service/sale-order-service";

export function AddSale() {


    useTitle("Sale")
    const navigate = useNavigate();

    const [products, setProducts] = useState<ProductModel[]>([]);
    const [selectedProductID, setSelectedProductId] = useState<number>(0);

    const [quantity, setQuantity] = useState<number>(1);
    const [unitPrice, setUnitPrice] = useState<number>(0);

    const [items, setItems] = useState<AddSaleOrderItemModel[]>([]);

    const [isSaving, setIsSaving] = useState(false);

    const lineTotal = quantity * unitPrice;

    const subTotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const [discount, setDiscount] = useState(0);

    const discountAmount = subTotal * (discount / 100);
    const total = subTotal - discountAmount

    useEffect(() => {
        productService.getAllProducts()
            .then(products => setProducts(products))
            .catch(err => console.log(err))
    }, []);



    function addItems(): void {
        if (selectedProductID === 0) return;

        const newItem: AddSaleOrderItemModel = {
            idProduct: selectedProductID,
            quantity,
            unitPrice
        }
        setItems([...items, newItem]);
        setSelectedProductId(0)
        setQuantity(1)
        setUnitPrice(0)
    }

    function removeItem(index: number): void {
        setItems(currentItems => currentItems.filter((_, i) => i !== index));
    }


    async function saveSale(): Promise<void> {
        try {
            if (items.length === 0) {
                notificationService.error("Pleas Add a least one product to the sale")
                return
            }
            if (discount < 0 || discount > 100) {
                notificationService.error("Discount must be between 0 to 100")
                return
            }
            setIsSaving(true);
            const sale: AddSaleOrderModel = {
                idEvent: null,
                discountAmount,
                notes: "Sale created from POS",
                items
            }
            const addSale = await saleOrderService.addSale(sale);
            notificationService.success(`Sale ${addSale.saleNumber} Saved successfully`);
            setItems([]);
            setSelectedProductId(0);
            setQuantity(1);
            setUnitPrice(0);
            setDiscount(0);

        } catch (err: any) {
            console.error("Save sale error: ", err);
            console.error("Backend response:", err.response?.data);
            const serverData = err.response?.data;

            const message = typeof serverData === "string" ? serverData : serverData?.message ?? err.message ?? "Failed to save sale"
            notificationService.error(message)

        }
        finally{
            setIsSaving(false);
        }
    }

    return (
        <div className="AddSale">

            <h2>New Sale</h2>

            <select
                className="sale-header"
                value={selectedProductID}
                onChange={e => {
                    const id = Number(e.target.value);
                    setSelectedProductId(id);

                    const product = products.find(p => p.idProduct === id);
                    if (product) {
                        setUnitPrice(Number(product.productPrice));
                    }
                }}
            >
                <option value={0}>Select Product</option>

                {products.map(product => (
                    <option
                        key={product.idProduct}
                        value={product.idProduct}
                    >
                        {product.productName}
                    </option>
                ))}
            </select>

            <div className="form-field">
                <label>Quantity</label>

                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                />
            </div>

            <div className="form-field">
                <label>Unit Price</label>

                <input
                    type="number"
                    step="0.01"
                    value={unitPrice}
                    onChange={e => setUnitPrice(Number(e.target.value))}
                />
            </div>

            <div className="form-field">
                <label>Total</label>

                <input
                    type="number"
                    value={lineTotal}
                    readOnly
                />
            </div>

            <button
                type="button"
                className="add-item-button"
                onClick={addItems}
            >
                Add Item
            </button>

            <table className="sale-table">

                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {items.map((items, index) => {

                        const product = products.find(
                            p => p.idProduct === items.idProduct
                        );

                        return (
                            <tr key={index}>

                                <td>{product?.productName}</td>

                                <td>{items.quantity}</td>

                                <td>{items.unitPrice}</td>

                                <td>{items.quantity * items.unitPrice}</td>

                                <td>

                                    <button
                                        type="button"
                                        className="remove-item-button"
                                        onClick={() => removeItem(index)}
                                    >
                                        🗑️
                                    </button>

                                </td>

                            </tr>
                        );

                    })}

                    <tr>
                        <td colSpan={5}>

                            <div className="sale-summary">

                                <h3>
                                    Subtotal: ₪{subTotal.toFixed(2)}
                                </h3>

                                <label>Discount (%)</label>

                                <input
                                    type="number"
                                    value={discount}
                                    onChange={e => setDiscount(Number(e.target.value))}
                                />

                                <h2>
                                    Total: ₪{total.toFixed(2)}
                                </h2>



                            </div>
                            <button type="button" className="save-sale-button" onClick={saveSale} disabled={isSaving || items.length === 0}
                            >
                                {isSaving ? "Saving Sale..." : "Complete Sale"}
                            </button>


                        </td>
                    </tr>

                </tbody>

            </table>

        </div>

    );
}
