import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";

import "./edit-supplier-order.css";

import { useTitle } from "../../utils/UseTitle";

import type { AddSupplierOrderModel } from "../../models/supplierOrderModel";
import type { SupplierModel } from "../../models/supplier-model";
import type { ProductModel } from "../../models/product-model";

import { supplierService } from "../../service/supplierService";
import { productService } from "../../service/productService";
import { supplierOrderService } from "../../service/supplierOrderService";
import { notificationService } from "../../service/notificationService";


interface SupplierOrderDetailsForEdit {
    idSupplier: number;
    expectedDeliveryDate: string | Date | null;
    notes?: string | null;

    items?: Array<{
        idProduct: number;
        quantityOrdered: number;
        unitCost: number;
    }>;
}


export function EditSupplierOrder() {

    const { t } = useTranslation();

    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();

    const orderId = Number(id);

    useTitle(t("supplierOrders.edit.title"));


    const { register, control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<AddSupplierOrderModel>({
        defaultValues: {
            idSupplier: 0,
            expectedDeliveryDate: null,
            notes: "",
            items: []
        }
    });


    const { fields, append, remove } = useFieldArray({ control, name: "items" });


    const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);

    const [products, setProducts] = useState<ProductModel[]>([]);

    const [loading, setLoading] = useState(true);


    const selectedSupplierId = watch("idSupplier");

    const selectedItems = watch("items");


    // =========================
    // Load suppliers
    // =========================

    useEffect(() => {

        supplierService
            .getAllSuppliers()
            .then(setSuppliers)
            .catch(err => {

                console.log(err);

                notificationService.error(
                    t(
                        "supplierOrders.edit.errors.loadSuppliers"
                    )
                );

            });

    }, [t]);


    // =========================
    // Load existing order
    // =========================

    useEffect(() => {

        if (!id || !Number.isInteger(orderId) || orderId <= 0) {

            notificationService.error(
                t(
                    "supplierOrders.edit.errors.loadOrder"
                )
            );

            navigate("/supplier-orders");

            return;
        }


        async function loadOrder() {

            try {

                setLoading(true);


                const response =
                    await supplierOrderService
                        .getOneSupplierOrder(orderId);


                const order =
                    response as unknown as SupplierOrderDetailsForEdit;


                reset({

                    idSupplier:
                        Number(order.idSupplier),

                    expectedDeliveryDate:
                        order.expectedDeliveryDate
                            ? String(
                                order.expectedDeliveryDate
                            ).slice(0, 10)
                            : null,

                    notes:
                        order.notes ?? "",

                    items:
                        order.items?.map(item => ({

                            idProduct:
                                Number(
                                    item.idProduct
                                ),

                            quantityOrdered:
                                Number(
                                    item.quantityOrdered
                                ),

                            unitCost:
                                Number(
                                    item.unitCost
                                )

                        })) ?? []

                });

            }
            catch (err) {

                console.log(err);

                notificationService.error(
                    t(
                        "supplierOrders.edit.errors.loadOrder"
                    )
                );

            }
            finally {

                setLoading(false);

            }

        }


        loadOrder();

    }, [
        id,
        orderId,
        reset,
        navigate,
        t
    ]);


    // =========================
    // Load supplier products
    // =========================

    useEffect(() => {

        const supplierId = Number(selectedSupplierId);


        if (!Number.isInteger(supplierId) || supplierId <= 0) {

            setProducts([]);

            return;
        }


        productService
            .getProductsBySupplier(
                supplierId
            )
            .then(setProducts)
            .catch(err => {

                console.log(err);

                notificationService.error(
                    t(
                        "supplierOrders.edit.errors.loadProducts"
                    )
                );

            });

    }, [
        selectedSupplierId,
        t
    ]);


    // =========================
    // Remove product
    // =========================

    function removeProduct(index: number): void {

        remove(index);
    }


    // =========================
    // Submit
    // =========================

    async function send(order: AddSupplierOrderModel): Promise<void> {

        try {

            if (
                !order.items ||
                order.items.length === 0
            ) {

                notificationService.error(
                    t(
                        "supplierOrders.edit.errors.noProducts"
                    )
                );

                return;
            }


            const productIds =
                order.items.map(
                    item =>
                        Number(item.idProduct)
                );


            const hasDuplicateProducts = new Set(productIds).size !== productIds.length;


            if (hasDuplicateProducts) {

                notificationService.error(
                    t(
                        "supplierOrders.edit.errors.duplicateProducts"
                    )
                );

                return;
            }



            console.log("ORDER ID:", orderId);

            console.log("ORDER TO UPDATE:", order);


            notificationService.success(
                t(
                    "supplierOrders.edit.success"
                )
            );

        }
        catch (err) {

            console.log(err);

            notificationService.error(
                t(
                    "supplierOrders.edit.errors.update"
                )
            );

        }

    }


    // =========================
    // Loading
    // =========================

    if (loading) {

        return (

            <div className="EditSupplierOrder">

                <div className="edit-order-loading">

                    {t(
                        "supplierOrders.edit.loading"
                    )}

                </div>

            </div>

        );

    }


    // =========================
    // JSX
    // =========================

    return (

        <div className="EditSupplierOrder">

            <form
                className="edit-order-form"
                onSubmit={
                    handleSubmit(send)
                }
            >

                <div className="edit-order-header">

                    <div>

                        <span className="edit-order-eyebrow">

                            {t(
                                "supplierOrders.edit.eyebrow"
                            )}

                        </span>


                        <h2 className="edit-order-title">

                            {t(
                                "supplierOrders.edit.title"
                            )}

                        </h2>


                        <p className="edit-order-subtitle">

                            {t(
                                "supplierOrders.edit.subtitle"
                            )}

                        </p>

                    </div>


                    <button
                        type="button"
                        className="edit-order-back-button"
                        onClick={() =>
                            navigate(
                                `/supplier-orders/${orderId}`
                            )
                        }
                    >

                        ←{" "}
                        {t(
                            "supplierOrders.edit.back"
                        )}

                    </button>

                </div>


                <section className="edit-order-section">

                    <h3 className="edit-order-section-title">

                        {t(
                            "supplierOrders.edit.orderDetails"
                        )}

                    </h3>


                    <div className="edit-order-field">

                        <label className="edit-order-label">

                            {t(
                                "supplierOrders.edit.supplier"
                            )}

                        </label>


                        <select
                            className="edit-order-input"
                            {...register(
                                "idSupplier",
                                {
                                    required:
                                        t(
                                            "supplierOrders.edit.validation.supplierRequired"
                                        ),

                                    valueAsNumber:
                                        true,

                                    min: {
                                        value: 1,

                                        message:
                                            t(
                                                "supplierOrders.edit.validation.supplierRequired"
                                            )
                                    }
                                }
                            )}
                        >

                            <option
                                value={0}
                                disabled
                            >

                                {t(
                                    "supplierOrders.edit.selectSupplier"
                                )}

                            </option>


                            {suppliers.map(
                                supplier => (

                                    <option
                                        key={
                                            supplier.idSupplier
                                        }
                                        value={
                                            supplier.idSupplier
                                        }
                                    >

                                        {
                                            supplier.supplierName
                                        }

                                    </option>

                                )
                            )}

                        </select>


                        {errors.idSupplier && (

                            <span className="edit-order-error">

                                {
                                    errors
                                        .idSupplier
                                        .message
                                }

                            </span>

                        )}

                    </div>


                    <div className="edit-order-field">

                        <label className="edit-order-label">

                            {t(
                                "supplierOrders.edit.expectedDeliveryDate"
                            )}

                        </label>


                        <input
                            className="edit-order-input"
                            type="date"
                            {...register(
                                "expectedDeliveryDate"
                            )}
                        />

                    </div>


                    <div className="edit-order-field">

                        <label className="edit-order-label">

                            {t(
                                "supplierOrders.edit.notes"
                            )}

                        </label>


                        <textarea
                            className="edit-order-textarea"
                            rows={4}
                            placeholder={
                                t(
                                    "supplierOrders.edit.notesPlaceholder"
                                )
                            }
                            {...register(
                                "notes"
                            )}
                        />

                    </div>

                </section>


                <section className="edit-order-section">

                    <div className="edit-order-products-header">

                        <h3 className="edit-order-section-title">

                            {t(
                                "supplierOrders.edit.products"
                            )}

                        </h3>


                        <button
                            type="button"
                            className="edit-order-add-product-button"
                            disabled={
                                !selectedSupplierId
                            }
                            onClick={() =>
                                append({
                                    idProduct: 0,
                                    quantityOrdered: 1,
                                    unitCost: 0
                                })
                            }
                        >

                            +{" "}
                            {t(
                                "supplierOrders.edit.addProduct"
                            )}

                        </button>

                    </div>


                    <div className="edit-order-items">

                        {fields.map(
                            (
                                field,
                                index
                            ) => {

                                return (

                                    <div
                                        key={
                                            field.id
                                        }
                                        className="edit-order-row"
                                    >

                                        <div className="edit-order-row-field">

                                            <label className="edit-order-row-label">

                                                {t(
                                                    "supplierOrders.edit.product"
                                                )}

                                            </label>


                                            <select
                                                className="edit-order-input"
                                                {...register(
                                                    `items.${index}.idProduct`,
                                                    {
                                                        valueAsNumber:
                                                            true,

                                                        min: {
                                                            value: 1,

                                                            message:
                                                                t(
                                                                    "supplierOrders.edit.validation.productRequired"
                                                                )
                                                        },

                                                        onChange:
                                                            event => {

                                                                const productId =
                                                                    Number(
                                                                        event
                                                                            .target
                                                                            .value
                                                                    );


                                                                const selectedProduct =
                                                                    products.find(
                                                                        product =>
                                                                            product.idProduct ===
                                                                            productId
                                                                    );


                                                                if (
                                                                    selectedProduct
                                                                ) {

                                                                    setValue(
                                                                        `items.${index}.unitCost`,
                                                                        Number(
                                                                            selectedProduct
                                                                                .supplierCost ??
                                                                            0
                                                                        )
                                                                    );

                                                                }

                                                            }
                                                    }
                                                )}
                                            >

                                                <option
                                                    value={0}
                                                    disabled
                                                >

                                                    {t(
                                                        "supplierOrders.edit.selectProduct"
                                                    )}

                                                </option>


                                                {products.map(
                                                    product => {

                                                        const alreadySelected =
                                                            selectedItems?.some(
                                                                (
                                                                    item,
                                                                    itemIndex
                                                                ) =>
                                                                    itemIndex !==
                                                                    index &&
                                                                    Number(
                                                                        item.idProduct
                                                                    ) ===
                                                                    product.idProduct
                                                            );


                                                        return (

                                                            <option
                                                                key={
                                                                    product.idProduct
                                                                }
                                                                value={
                                                                    product.idProduct
                                                                }
                                                                disabled={
                                                                    alreadySelected
                                                                }
                                                            >

                                                                {
                                                                    product.productName
                                                                }

                                                                {
                                                                    product.supplierCatalogNumber
                                                                        ? ` - ${product.supplierCatalogNumber}`
                                                                        : ""
                                                                }

                                                            </option>

                                                        );

                                                    }
                                                )}

                                            </select>

                                        </div>


                                        <div className="edit-order-row-field">

                                            <label className="edit-order-row-label">

                                                {t(
                                                    "supplierOrders.edit.quantity"
                                                )}

                                            </label>


                                            <input
                                                className="edit-order-input"
                                                type="number"
                                                min={1}
                                                {...register(
                                                    `items.${index}.quantityOrdered`,
                                                    {
                                                        valueAsNumber:
                                                            true,

                                                        min: 1
                                                    }
                                                )}
                                            />

                                        </div>


                                        <div className="edit-order-row-field">

                                            <label className="edit-order-row-label">

                                                {t(
                                                    "supplierOrders.edit.unitCost"
                                                )}

                                            </label>


                                            <input
                                                className="edit-order-input"
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                {...register(
                                                    `items.${index}.unitCost`,
                                                    {
                                                        valueAsNumber:
                                                            true,

                                                        min: 0
                                                    }
                                                )}
                                            />

                                        </div>


                                        <button
                                            type="button"
                                            className="edit-order-remove-button"
                                            onClick={() =>
                                                removeProduct(
                                                    index
                                                )
                                            }
                                        >

                                            🗑{" "}

                                            {t(
                                                "supplierOrders.edit.remove"
                                            )}

                                        </button>

                                    </div>

                                );

                            }
                        )}

                    </div>

                </section>


                <div className="edit-order-actions">

                    <button
                        type="button"
                        className="edit-order-cancel-button"
                        onClick={() =>
                            navigate(
                                `/supplier-orders/${orderId}`
                            )
                        }
                    >

                        {t(
                            "supplierOrders.edit.cancel"
                        )}

                    </button>


                    <button
                        type="submit"
                        className="edit-order-save-button"
                    >

                        {t(
                            "supplierOrders.edit.save"
                        )}

                    </button>

                </div>

            </form>

        </div>

    );

}