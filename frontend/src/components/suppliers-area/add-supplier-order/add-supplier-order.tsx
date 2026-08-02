import { useNavigate } from "react-router-dom";
import { useTitle } from "../../utils/UseTitle";
import "./add-supplier-order.css";

import {
    useFieldArray,
    useForm
} from "react-hook-form";

import type { AddSupplierOrderModel } from "../../models/supplierOrderModel";
import { useEffect, useState } from "react";
import { SupplierModel } from "../../models/supplier-model";
import { supplierService } from "../../service/supplierService";
import { notificationService } from "../../service/notificationService";
import { ProductModel } from "../../models/product-model";
import { productService } from "../../service/productService";
import { supplierOrderService } from "../../service/supplierOrderService";

export function AddSupplierOrder() {

    useTitle("Add Supplier Order.");

    const navigate = useNavigate();

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<AddSupplierOrderModel>({
        defaultValues: {
            idSupplier: 0,
            expectedDeliveryDate: null,
            notes: "",
            items: []
        }
    });

    const {
        fields,
        append,
        remove,
        replace
    } = useFieldArray({
        control,
        name: "items"
    });

    const [suppliers, setSuppliers] =
        useState<SupplierModel[]>([]);

    const [products, setProducts] =
        useState<ProductModel[]>([]);

    // הספק שנבחר
    const selectedSupplierId = watch("idSupplier");

    // כל שורות המוצרים בטופס
    // זה מאפשר לנו לדעת אילו מוצרים כבר נבחרו
    const selectedItems = watch("items");

    useEffect(() => {

        // כאשר מחליפים ספק מוחקים את המוצרים הקודמים
        replace([]);

        if (!selectedSupplierId) {
            setProducts([]);
            return;
        }

        productService
            .getProductsBySupplier(
                Number(selectedSupplierId)
            )
            .then(productsFromApi => {
                setProducts(productsFromApi);
            })
            .catch(err => {
                console.log(err);

                notificationService.error(
                    "Failed to load supplier products"
                );
            });

    }, [selectedSupplierId, replace]);

    useEffect(() => {

        supplierService
            .getAllSuppliers()
            .then(suppliersFromApi => {
                setSuppliers(suppliersFromApi);
            })
            .catch(err => {
                console.log(err);

                notificationService.error(
                    "Failed to load suppliers"
                );
            });

    }, []);

    async function send(order: AddSupplierOrderModel) {

        try {

            if (order.items.length === 0) {
                notificationService.error(
                    "Please add at least one product"
                );
                return;
            }

            // הגנה נוספת במקרה שנשלחה כפילות
            const productIds = order.items.map(
                item => item.idProduct
            );

            const hasDuplicateProducts =
                new Set(productIds).size !== productIds.length;

            if (hasDuplicateProducts) {
                notificationService.error(
                    "The same product cannot be added more than once."
                );
                return;
            }

            await supplierOrderService.addSupplierOrder(order);

            notificationService.success(
                "New order created successfully"
            );

            navigate("/supplier-orders");

        } catch (err: any) {
            console.log(err);

            notificationService.error(
                "Failed to add supplier order."
            );
        }
    }

    return (
        <div className="AddSupplierOrder">

            <form onSubmit={handleSubmit(send)}>

                <h2>New Supplier Order</h2>

                <label>Supplier</label>
                <select
                    defaultValue=""{...register("idSupplier", {required: "Supplier is required",valueAsNumber: true,min: {value: 1,message: "Please select a supplier."}})}
                >
                    <option value={0} disabled>
                        Select Supplier
                    </option>

                    {suppliers.map(supplier => (
                        <option
                            key={supplier.idSupplier}
                            value={supplier.idSupplier}
                        >
                            {supplier.supplierName}
                        </option>
                    ))}
                </select>

                {errors.idSupplier && (
                    <span className="error">
                        {errors.idSupplier.message}
                    </span>
                )}

                <label>Expected Delivery Date</label>
                <input type="date" {...register("expectedDeliveryDate")}/>

                <label>Note</label>
                <textarea rows={4}{...register("notes")} />

                <hr />

                <h3>Products</h3>

                <button
                    type="button" disabled={!selectedSupplierId}
                    onClick={() => {
                            append({idProduct: 0,quantityOrdered: 1,unitCost: 0 });
                    }}
                >
                    + Add product
                </button>

                {fields.map((field, index) => (

                    <div key={field.id} className="order-row"
                    >
                        <select defaultValue="" {...register( `items.${index}.idProduct`,{ valueAsNumber: true, min: { value: 1,message: "Please select a product" },

                                    onChange: event => {

                                        const selectedProduct = products.find(product => product.idProduct === Number(event.target.value));

                                        if (selectedProduct) {
                                            setValue(`items.${index}.unitCost`, Number(selectedProduct.supplierCost));
                                        }
                                    }
                                }
                            )}
                        >
                            <option value="" disabled>
                                Select Product
                            </option>

                            {products.map(product => {
                                const isSelectedInAnotherRow =
                                    selectedItems?.some(
                                        (
                                            selectedItem,
                                            selectedItemIndex
                                        ) =>
                                            selectedItemIndex !== index && Number(selectedItem.idProduct) === product.idProduct);

                                return (
                                    <option key={product.idProduct} value={product.idProduct} disabled={isSelectedInAnotherRow}
                                    >
                                        {product.productName}

                                        {product.supplierCatalogNumber ? ` - ${product.supplierCatalogNumber}` : ""}
                                    </option>
                                );
                            })}

                        </select>

                        <input type="number" placeholder="Qty"{...register(`items.${index}.quantityOrdered`, { valueAsNumber: true, min: 1 })} />

                        <input
                            type="number"
                            step="0.01"
                            placeholder="Unit Cost"{...register(`items.${index}.unitCost`, { valueAsNumber: true, min: 0 })} />

                        <button type="button" onClick={() => remove(index)}>
                            X
                        </button>

                    </div>
                ))}

                <div className="form-actions">

                    <button type="submit">
                        Save
                    </button>

                    <button
                        type="button" onClick={() => navigate("/supplier-orders")} >
                        Cancel
                    </button>

                </div>

            </form>

        </div>
    );
}