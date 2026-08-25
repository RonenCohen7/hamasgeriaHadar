import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    FaPlus,
    FaSearch,
    FaTruck
} from "react-icons/fa";

import "./supplier-list.css";

import { useTitle } from "../../utils/UseTitle";

import type { SupplierModel } from "../../models/supplier-model";

import { supplierService } from "../../service/supplierService";

import { SupplierCard } from "../supplier-card/supplier-card";


export function SupplierList() {

    const { t } = useTranslation();

    useTitle(
        t("suppliers.pageTitle")
    );

    const navigate = useNavigate();


    const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);

    const [search, setSearch] = useState("");


    // =========================
    // Load suppliers
    // =========================

    useEffect(() => {

        supplierService
            .getAllSuppliers()
            .then(setSuppliers)
            .catch(err => {

                console.log(err);

            });

    }, []);


    // =========================
    // Filter suppliers
    // =========================

    const filteredSuppliers =
        suppliers.filter(supplier =>

            supplier.supplierName
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )

        );


    // =========================
    // JSX
    // =========================

    return (

        <section className="suppliers-page">

            {/* Header */}
            <header className="suppliers-header">

                <div className="suppliers-header-content">

                    <span className="suppliers-eyebrow">

                        {t(
                            "suppliers.eyebrow"
                        )}

                    </span>


                    <h1>

                        {t(
                            "suppliers.title"
                        )}

                    </h1>


                    <p>

                        {t(
                            "suppliers.description"
                        )}

                    </p>

                </div>


                <button
                    type="button"
                    className="add-supplier-button"
                    onClick={() =>
                        navigate(
                            "/supplier/add"
                        )
                    }
                >

                    <FaPlus />

                    <span>

                        {t(
                            "suppliers.addSupplier"
                        )}

                    </span>

                </button>

            </header>


            {/* Toolbar */}
            <div className="suppliers-toolbar">

                {/* Search */}
                <div className="suppliers-search">

                    <FaSearch />

                    <input
                        type="search"
                        placeholder={t(
                            "suppliers.searchPlaceholder"
                        )}
                        value={search}
                        onChange={event =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>


                {/* Counter */}
                <div className="suppliers-count">

                    <FaTruck />

                    <div>

                        <strong>

                            {
                                filteredSuppliers.length
                            }

                        </strong>

                        <span>

                            {t(
                                "suppliers.totalSuppliers"
                            )}

                        </span>

                    </div>

                </div>

            </div>


            {/* Suppliers */}
            <div className="suppliers-content">

                {filteredSuppliers.length > 0 ? (

                    filteredSuppliers.map(
                        supplier => (

                            <SupplierCard
                                key={
                                    supplier.idSupplier
                                }
                                supplier={
                                    supplier
                                }
                            />

                        )
                    )

                ) : (

                    <div className="suppliers-empty">

                        <FaSearch />

                        <p>

                            {t(
                                "suppliers.noSuppliersFound"
                            )}

                        </p>

                    </div>

                )}

            </div>

        </section>

    );
}