import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaBeer, FaWineBottle, FaCoffee, FaUtensils, FaCookieBite, FaBoxOpen, FaThLarge, FaGlassWhiskey, FaCocktail, FaMoneyBillWave, FaCreditCard, FaMobileAlt } from "react-icons/fa";

import "./quick-sale.css";

import type { AppDispatch, RootState } from "../../redux/inventory-store";
import type { ProductModel } from "../../models/product-model";
import type { AddSaleOrderModel } from "../../models/sale-order-model";

import { PaymentMethod } from "../../models/enum";
import { setInventory } from "../../redux/inventory-slice";

import { productService } from "../../service/productService";
import { saleOrderService } from "../../service/sale-order-service";
import { notificationService } from "../../service/notificationService";
import { ProductCategoryModel } from "../../models/category-model";
import { productCategoryService } from "../../service/productCategoryService";
import { IoWater } from "react-icons/io5";
import { LuCupSoda } from "react-icons/lu";
import { dialogService } from "../../service/dialogService";
import { VipCardModel } from "../../models/vip-card-model";
import { vipCardService } from "../../service/vipCardService";

interface QuickSaleItem {
    product: ProductModel;
    quantity: number;
}

export function QuickSale() {

    const dispatch = useDispatch<AppDispatch>();



    const liveInventory = useSelector(
        (state: RootState) => state.inventory.items
    );

    const [products, setProducts] = useState<ProductModel[]>([]);
    const [orderItems, setOrderItems] = useState<QuickSaleItem[]>([]);
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number>(0);
    const [categories, setCategories] = useState<ProductCategoryModel[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Cash);
    const [receivedAmount, setReceivedAmount] = useState("");

    const [selectedVipCard, setSelectedVipCard] = useState<VipCardModel | null>(null);
    const [vipCardNumber, setVipCardNumber] = useState("")

    const [phoneLast4, setPhoneLast4] = useState("");
    const [vipVerified, setVipVerified] = useState(false);

    const isVipPayment = paymentMethod === PaymentMethod.VIPCard;
    const filteredProducts = products.filter(product => {

        const categoryMatch = selectedCategory === 0 || Number(product.idCategory) === selectedCategory;

        const textMatch = product.productName.toLowerCase().includes(searchText.toLowerCase());



        return categoryMatch && textMatch;
    }

    );

    const totalAmount = orderItems.reduce(
        (sum, item) =>
            sum +
            Number(item.product.productPrice) *
            item.quantity,
        0
    );

    const receivedNumber = Number(receivedAmount) || 0

    const changeAmount = paymentMethod === PaymentMethod.Cash ? Math.max(receivedNumber - totalAmount, 0) : 0;

    useEffect(() => {
        productCategoryService
            .getAllCategories()
            .then(setCategories)
            .catch(console.error);

        productService
            .getAllProducts()
            .then(productsFromApi => {
                setProducts(productsFromApi);

                dispatch(
                    setInventory(
                        productsFromApi.map(product => ({
                            idProduct: Number(product.idProduct),
                            productName: product.productName,
                            productStock: Number(product.productStock),
                            minimumStock: Number(product.minimumStock),
                            imageName: product.imageName ?? null,
                            supplierId: product.idSupplier ?? null,
                            supplierName:
                                product.supplierName ?? null
                        }))
                    )
                );
            })
            .catch(error => {
                console.error(error);

                notificationService.error(
                    "Failed to load products"
                );
            });
    }, [dispatch]);

    useEffect(() => {
        if (liveInventory.length === 0) return;

        setProducts(currentProducts =>
            currentProducts.map(product => {
                const liveProduct = liveInventory.find(
                    inventoryProduct =>
                        Number(inventoryProduct.idProduct) ===
                        Number(product.idProduct)
                );

                if (!liveProduct) return product;

                return {
                    ...product,
                    productStock: String(
                        liveProduct.productStock
                    )
                };
            })
        );

        setOrderItems(currentItems =>
            currentItems
                .map(item => {
                    const liveProduct = liveInventory.find(
                        inventoryProduct =>
                            Number(
                                inventoryProduct.idProduct
                            ) ===
                            Number(item.product.idProduct)
                    );

                    if (!liveProduct) return item;

                    const currentStock = Number(
                        liveProduct.productStock
                    );

                    return {
                        ...item,
                        product: {
                            ...item.product,
                            productStock: String(currentStock)
                        },
                        quantity: Math.min(
                            item.quantity,
                            currentStock
                        )
                    };
                })
                .filter(item => item.quantity > 0)
        );
    }, [liveInventory]);



    async function verifyVipCard() {
        if (!selectedVipCard) return;

        if (!/^\d{4}$/.test(phoneLast4)) {
            notificationService.error(
                "Please enter the last 4 digits of the phone number"
            )
            return;
        }
        try {
            const verified = await vipCardService.verifyCardPhone(selectedVipCard.idVipCard, phoneLast4);

            if (!verified) {
                notificationService.error("Phone verification failed");
                return;
            }
            

            setVipVerified(true);
            notificationService.success("Customer verified");

        } catch (err) {

        }
    }



    //open payment
    function openPayment() {
        if (orderItems.length === 0) return;

        setPaymentMethod(PaymentMethod.Cash)
        setReceivedAmount(totalAmount.toFixed(2));
        setIsPaymentOpen(true)
    }


    function addProductToOrder(product: ProductModel) {
        const stock = Number(product.productStock);

        if (stock <= 0) {
            notificationService.error(
                `${product.productName} is out of stock`
            );
            return;
        }

        setOrderItems(currentItems => {
            const existingItem = currentItems.find(
                item =>
                    item.product.idProduct ===
                    product.idProduct
            );

            if (existingItem) {
                if (existingItem.quantity >= stock) {
                    notificationService.error(
                        `Maximum stock reached for ${product.productName}`
                    );

                    return currentItems;
                }

                return currentItems.map(item =>
                    item.product.idProduct ===
                        product.idProduct
                        ? {
                            ...item,
                            product,
                            quantity: item.quantity + 1
                        }
                        : item
                );
            }

            return [
                ...currentItems,
                {
                    product,
                    quantity: 1
                }
            ];
        });
    }

    function increaseQuantity(idProduct: number) {
        setOrderItems(currentItems =>
            currentItems.map(item => {
                if (item.product.idProduct !== idProduct) {
                    return item;
                }

                const stock = Number(
                    item.product.productStock
                );

                if (item.quantity >= stock) {
                    notificationService.error(
                        `Maximum stock reached for ${item.product.productName}`
                    );

                    return item;
                }

                return {
                    ...item,
                    quantity: item.quantity + 1
                };
            })
        );
    }

    function decreaseQuantity(idProduct: number) {
        setOrderItems(currentItems =>
            currentItems
                .map(item =>
                    item.product.idProduct === idProduct
                        ? {
                            ...item,
                            quantity: item.quantity - 1
                        }
                        : item
                )
                .filter(item => item.quantity > 0)
        );
    }



    async function searchVipCard() {
        if (!vipCardNumber.trim()) {
            notificationService.error("Please enter VIP card number")
            return;
        }
        try {
            const card = await vipCardService.getCardByCardNumber(vipCardNumber.trim())

            setSelectedVipCard(card);
            setVipVerified(false);
            setPhoneLast4("")
            notificationService.success("VIP Card found")

        } catch (err: any) {
            console.error(err);
            setSelectedVipCard(null);
            notificationService.error("VIP Card not found");
        }

    }




    async function completeSale() {

        if(paymentMethod === PaymentMethod.VIPCard && !vipVerified){
            notificationService.error(
                "Please verify the customer first"
            )
            return;
        }


        if (orderItems.length === 0 || isSubmitting) {
            return;
        }

        if (paymentMethod === PaymentMethod.Cash && receivedNumber < totalAmount) {
            notificationService.error("Received amount is lower then total");
            return;
        }

        if (paymentMethod === PaymentMethod.VIPCard && !selectedVipCard) {
            notificationService.error("Please select a VIP Card")
            return;
        }

        if (paymentMethod === PaymentMethod.VIPCard && selectedVipCard && Number(selectedVipCard.balance) < totalAmount) {
            notificationService.error("Insufficient VIP Card balance")
            return;
        }

        const sale: AddSaleOrderModel = {
            customerName: "Quick Sale",
            paymentMethod,
            idVipCard: selectedVipCard?.idVipCard ?? null,
            discountAmount: 0,
            notes: "Quick sale POS",

            items: orderItems.map(item => ({
                idProduct: item.product.idProduct,
                quantity: item.quantity,
                unitPrice: Number(
                    item.product.productPrice
                )
            }))
        };

        try {
            setIsSubmitting(true);

            await saleOrderService.addSale(sale);

            setOrderItems([]);
            setIsPaymentOpen(false);
            setReceivedAmount("");

            notificationService.success(
                "Sale completed successfully"
            );
        } catch (error: any) {
            notificationService.error(
                error.response?.data?.message ??
                error.message ??
                "Failed to complete sale"
            );
        } finally {
            setIsSubmitting(false);
        }
    }


    function getCategoryIcon(categoryName: string) {
        if (!categoryName) return <FaThLarge />

        const name = categoryName.toLowerCase();

        if (name.includes("beer"))
            return <FaBeer />;

        if (name.includes("wine"))
            return <FaWineBottle />;

        if (name.includes("coffee"))
            return <FaCoffee />;

        if (name.includes("cocktail"))
            return <FaCocktail />;

        if (name.includes("spirit"))
            return <FaGlassWhiskey />;

        if (name.includes("kitchen"))
            return <FaUtensils />;

        if (name.includes("snack"))
            return <FaCookieBite />;

        if (name.includes("water"))
            return <IoWater />;

        if (name.includes("soft"))
            return <LuCupSoda />;

        if (name.includes("supplies"))
            return <FaBoxOpen />;

        return <FaThLarge />;
    }

    function getCategoryClass(categoryName: string | null): string {

        if (!categoryName) {
            return "other"
        }

        const name = categoryName.toLowerCase();

        if (name.includes("beer")) return "beer";

        if (name.includes("wine")) return "wine";

        if (name.includes("cocktail")) return "cocktail";

        if (name.includes("coffee")) return "coffee";

        if (name.includes("water")) return "water";

        if (name.includes("soft")) return "soft";

        if (name.includes("spirit")) return "spirit";

        if (name.includes("snack")) return "snack";

        if (name.includes("kitchen")) return "kitchen";

        if (name.includes("supplies")) return "supplies";

        return "";
    }


    async function cancelOrder() {
        if (orderItems.length === 0) return;

        const ok = await dialogService.confirm(
            "Cancel order",
            "Are you sure you want to cancel this order?",
            "Keep order",
            "Cancel order"
        )


        if (ok) return;

        setOrderItems([]);

        notificationService.success("Current order canceled");
    }



    return (
        <div className="QuickSale">
            <section className="quick-sale-left">
                <div className="quick-sale-toolbar">
                    <input
                        type="search"
                        placeholder="Search product..."
                        value={searchText}
                        onChange={event =>
                            setSearchText(event.target.value)
                        }
                    />
                </div>

                <div className="quick-sale-categories">

                    <button
                        type="button"
                        className={`quick-sale-category-button-all
                           ${selectedCategory === 0 ? "active" : ""}
                            `
                        }
                        onClick={() => setSelectedCategory(0)}
                    >
                        <FaThLarge />
                        <span>All</span>
                    </button>

                    {categories.map(category => (
                        <button
                            type="button"
                            key={category.idCategory}
                            className={`quick-sale-category-button
                                ${getCategoryClass(category.categoryName)}
                                ${selectedCategory === category.idCategory ? "active" : ""}`
                            }
                            onClick={() =>
                                setSelectedCategory(
                                    category.idCategory
                                )
                            }
                        >
                            {getCategoryIcon(
                                category.categoryName
                            )}

                            <span>
                                {category.categoryName}
                            </span>
                        </button>
                    ))}

                </div>
                <div className="quick-sale-products-grid">
                    {filteredProducts.map(product => {
                        const stock = Number(
                            product.productStock
                        );

                        return (
                            <button
                                type="button"
                                key={product.idProduct}
                                className="quick-sale-product-card"
                                onClick={() =>
                                    addProductToOrder(product)
                                }
                                disabled={stock <= 0}
                            >
                                <div className="quick-sale-stock">
                                    {stock.toFixed(0)}
                                </div>
                                <div
                                    className={`quick-sale-category-strip ${getCategoryClass(product.categoryName)}`}
                                />
                                <div className="quick-sale-product-image">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.productName}
                                        />
                                    ) : (
                                        <div className="quick-sale-no-image">
                                            No image
                                        </div>
                                    )}
                                </div>

                                <span className="quick-sale-product-name">
                                    {product.productName}
                                </span>

                                <strong className="quick-sale-product-price">
                                    ₪
                                    {Number(
                                        product.productPrice
                                    ).toFixed(2)}
                                </strong>
                            </button>
                        );
                    })}

                    {filteredProducts.length === 0 && (
                        <div className="quick-sale-no-results">
                            No matching products
                        </div>
                    )}
                </div>
            </section>

            <aside className="quick-sale-right">
                <h2>Current Order</h2>

                {orderItems.length === 0 ? (
                    <div className="quick-sale-empty-order">
                        <span>🛒</span>
                        <strong>No items yet</strong>
                        <p>Click a product to add it</p>
                    </div>
                ) : (
                    <>
                        <div className="quick-sale-order-items">
                            {orderItems.map(item => {
                                const unitPrice = Number(
                                    item.product.productPrice
                                );

                                const lineTotal =
                                    unitPrice * item.quantity;

                                return (
                                    <div
                                        key={
                                            item.product.idProduct
                                        }
                                        className="quick-sale-order-row"
                                    >
                                        <div className="quick-sale-order-info">
                                            <strong>
                                                {
                                                    item.product
                                                        .productName
                                                }
                                            </strong>

                                            <span>
                                                ₪
                                                {unitPrice.toFixed(
                                                    2
                                                )}
                                            </span>
                                        </div>

                                        <div className="quick-sale-quantity">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    decreaseQuantity(
                                                        item.product
                                                            .idProduct
                                                    )
                                                }
                                            >
                                                −
                                            </button>

                                            <strong>
                                                {item.quantity}
                                            </strong>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    increaseQuantity(
                                                        item.product
                                                            .idProduct
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>

                                        <strong className="quick-sale-line-total">
                                            ₪
                                            {lineTotal.toFixed(
                                                2
                                            )}
                                        </strong>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="quick-sale-summary">
                            <span>Total</span>

                            <strong>
                                ₪{totalAmount.toFixed(2)}
                            </strong>
                        </div>

                        <div className="quick-sale-order-actions">
                            <button
                                type="button"
                                className="quick-sale-cancel-button"
                                onClick={cancelOrder}
                                disabled={isSubmitting}
                            >
                                Cancel Order
                            </button>

                            <button
                                type="button"
                                className="quick-sale-complete-button"
                                onClick={openPayment}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "Processing..."
                                    : "Complete Sale"}
                            </button>
                        </div>
                    </>
                )}
            </aside>
            {isPaymentOpen && (
                <div className="quick-sale-payment-overlay"
                    onClick={() => {
                        if (!isSubmitting) {
                            setIsPaymentOpen(false)
                        }
                    }}
                >
                    <div className="quick-sale-payment-modal"
                        onClick={event => event.stopPropagation()}
                    >
                        <div className="quick-sale-payment-header">
                            <div>
                                <span>PAYMENT</span>
                                <h2>Complete Sale</h2>
                            </div>
                            <button type="button"
                                className="quick-sale-payment-close"
                                onClick={() => setIsPaymentOpen(false)}
                                disabled={isSubmitting}>X</button>
                        </div>

                        <div className="quick-sale-payment-total">
                            <span>Total</span>
                            <strong>₪{totalAmount.toFixed(2)}</strong>
                        </div>

                        <div className="quick-sale-payment-section">
                            <label>Payment Method</label>

                            {!isVipPayment ? (

                                <div className="quick-sale-payment-methods">

                                    <button type="button"
                                        className="vip-card"
                                        onClick={() => setPaymentMethod(PaymentMethod.VIPCard)}>
                                        <FaCreditCard />
                                        VIP Card
                                    </button>


                                    <button type="button" className={
                                        paymentMethod === PaymentMethod.Cash ? "active" : ""}
                                        onClick={() => setPaymentMethod(PaymentMethod.Cash)}><FaMoneyBillWave />
                                        Cash
                                    </button>

                                    <button type="button" className={
                                        paymentMethod === PaymentMethod.CreditCard ? "active" : ""
                                    }
                                        onClick={() => { setPaymentMethod(PaymentMethod.CreditCard) }}><FaCreditCard /> Credit Card
                                    </button>

                                    <button type="button" className={
                                        paymentMethod === PaymentMethod.Bit ? "active" : ""
                                    }
                                        onClick={() => { setPaymentMethod(PaymentMethod.Bit) }}><FaMobileAlt /> Bit
                                    </button>

                                    <button type="button" className={
                                        paymentMethod === PaymentMethod.PayBox ? "active" : ""
                                    }
                                        onClick={() => { setPaymentMethod(PaymentMethod.PayBox) }}><FaMobileAlt /> PayBox
                                    </button>

                                </div>
                            ) : (
                                <button
                                    type="button"
                                    className="quick-sale-change-payment"
                                    onClick={() => {
                                        setPaymentMethod(PaymentMethod.Cash);
                                        setSelectedVipCard(null);
                                        setVipCardNumber("");
                                    }}
                                >
                                    Change Payment Method
                                </button>
                            )}




                            {paymentMethod === PaymentMethod.VIPCard && (
                                <div className="quick-sale-vip-search">
                                    <label>VIP Card Number</label>
                                    <input
                                        type="text"
                                        placeholder="ENTER VIP Card Number"
                                        value={vipCardNumber}
                                        onChange={e => setVipCardNumber(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={searchVipCard}>
                                        Search
                                    </button>
                                </div>
                            )}
                        </div>
                        {selectedVipCard && (
                            <div className="quick-sale-vip-info">

                                {selectedVipCard && !vipVerified && (
                                    <div className="quick-sale-vip-verify">
                                        <label>
                                            Enter last 4 digits of customer's phone
                                        </label>

                                        <input
                                            type="text"
                                            maxLength={4}
                                            value={phoneLast4}
                                            onChange={e => setPhoneLast4(e.target.value)}
                                        />

                                        <button
                                            type="button"
                                            onClick={verifyVipCard}
                                        >
                                            Verify
                                        </button>
                                    </div>
                                )}

                                <div>
                                    <span>Customer</span>
                                    <strong>
                                        {selectedVipCard.firstName} {selectedVipCard.lastName}
                                    </strong>
                                </div>

                                <div>
                                    <span>Card Number</span>
                                    <strong>{selectedVipCard.cardNumber}</strong>
                                </div>

                                <div>
                                    <span>Balance</span>
                                    <strong>
                                        ₪{Number(selectedVipCard.balance).toFixed(2)}
                                    </strong>
                                </div>
                            </div>
                        )}

                        {paymentMethod === PaymentMethod.Cash && (
                            <div className="quick-sale-payment-cash">
                                <label htmlFor="receivedAmount">
                                    Received Amount
                                </label>
                                <input
                                    id="receivedAmount"
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={receivedAmount}
                                    onChange={event => setReceivedAmount(event.target.value)}
                                    placeholder="0.00"
                                    autoFocus
                                />
                                <div className="quick-sale-change-row">
                                    <span>Change</span>
                                    <strong>
                                        ₪{changeAmount.toFixed(2)}
                                    </strong>
                                </div>
                            </div>
                        )}
                        <div className="quick-sale-payment-actions">
                            <button type="button" className="quick-sale-payment-cancel"
                                onClick={() => { setIsPaymentOpen(false) }}
                                disabled={isSubmitting}>
                                Cancel
                            </button>

                            <button type="button" className="quick-sale-payment-confirm"
                                onClick={completeSale}
                                disabled={isSubmitting || (
                                    paymentMethod === PaymentMethod.Cash &&
                                    Number(receivedAmount) < totalAmount)
                                }
                            >
                                {isSubmitting ? "Processing" : "Confirm"}
                            </button>
                        </div>


                    </div>


                </div>
            )}
        </div>
    );
}