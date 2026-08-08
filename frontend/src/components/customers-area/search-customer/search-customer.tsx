import { useState, type FormEvent } from "react";

import "./search-customer.css";

import type { CustomerModel } from "../../models/customer-model";
import { useTitle } from "../../utils/UseTitle";
import { customerService } from "../../service/customerService";
import { notificationService } from "../../service/notificationService";
import { CustomerCard } from "../customer-card/customer-card";
import { dialogService } from "../../service/dialogService";

export function SearchCustomer() {

    const [customers, setCustomers] = useState<CustomerModel[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [text, setText] = useState("");

    useTitle("Search Customer");

    async function search(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const cleanText = text.trim();

        if (!cleanText) {
            setCustomers([]);
            setHasSearched(false);
            return;
        }

        try {
            setIsSearching(true);

            const result =
                await customerService.getSearchCustomer(cleanText);

            setCustomers(result);
            setHasSearched(true);

        } catch (err: any) {
            console.error(err);

            notificationService.error(
                "Failed to search customers"
            );

        } finally {
            setIsSearching(false);
        }
    }

    async function deleteCustomer(id: number) {
        const ok  =  await dialogService.confirm(
            "Delete customer",
            "Are you sure you want to delete this customer?",
            "Delete",
            "Cancel"
        );

        if (!ok) return;

        try {
            await customerService.deleteCustomer(id);

            setCustomers(currentCustomers =>
                currentCustomers.filter(
                    customer => customer.idCustomer !== id
                )
            );

            notificationService.success(
                "Customer deleted successfully"
            );

        } catch (err: any) {
            console.error(err);

            notificationService.error(
                "Failed to delete customer"
            );
        }
    }

    function clearSearch() {
        setText("");
        setCustomers([]);
        setHasSearched(false);
    }

    return (
        <div className="SearchCustomer">

            <div className="search-customer-header">
                <h2>Search Customer</h2>

                <p>
                    Search by name, phone or email
                </p>
            </div>

            <form
                className="search-box"
                onSubmit={search}
            >
                <input
                    type="search"
                    placeholder="Search customer by name, phone or email..."
                    value={text}
                    onChange={event =>
                        setText(event.target.value)
                    }
                    autoFocus
                />

                <button
                    type="submit"
                    className="search-btn"
                    disabled={isSearching}
                >
                    🔍 {isSearching ? "Searching..." : "Search"}
                </button>

                <button
                    type="button"
                    className="clear-btn"
                    onClick={clearSearch}
                    disabled={!text && !hasSearched}
                >
                    Clear
                </button>
            </form>

            {hasSearched && customers.length === 0 && (
                <div className="search-empty-state">
                    No customers found.
                </div>
            )}

            {customers.length > 0 && (
                <>
                    <div className="search-results-title">
                        <h3>Results</h3>

                        <span>
                            {customers.length} customers found
                        </span>
                    </div>

                    <div className="search-customer-grid">
                        {customers.map(customer => (
                            <CustomerCard
                                key={customer.idCustomer}
                                customer={customer}
                                onDelete={deleteCustomer}
                            />
                        ))}
                    </div>
                </>
            )}

        </div>
    );
}