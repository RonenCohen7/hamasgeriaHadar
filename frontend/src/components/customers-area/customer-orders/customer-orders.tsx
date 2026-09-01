import { useTranslation } from "react-i18next";
import "./customer-orders.css";
import { useTitle } from "../../utils/UseTitle";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/inventory-store";
import { useEffect, useState } from "react";

import { ticketService } from "../../service/ticketService";
import { Navigate, useParams } from "react-router-dom";
import type { TicketModel } from "../../models/ticket-model";
import { CustomerModel } from "../../models/customer-model";
import { customerService } from "../../service/customerService";

export function CustomerOrders() {

    const { customerId } = useParams<{ customerId: string }>();


    const { i18n } = useTranslation();

    const isHebrew = i18n.language === "he";


    const [selectedCustomer, setSelectedCustomer] = useState<CustomerModel | null>(null);

    const customer = useSelector((state: RootState) => state.customerAuth.customer);

    const routeCustomerId = customerId ? Number(customerId) : undefined;

    const effectiveCustomerId = routeCustomerId ?? customer?.idCustomer;

    const isManagerView = Boolean(routeCustomerId);




    useEffect(() => {

        if (!isManagerView || !effectiveCustomerId) {
            return;
        }

        async function loadCustomers() {
            try {
                const result =
                    await customerService.getOneCustomer(Number(effectiveCustomerId))

                setSelectedCustomer(result);

            } catch (err) {
                console.error(
                    "Failed to load customer details", err
                );
            }
        }

        loadCustomers();
    }, [isManagerView, effectiveCustomerId]);


    useTitle(
        isManagerView
            ? (isHebrew ? "הזמנות הלקוח" : "Customer Orders")
            : (isHebrew ? "ההזמנות שלי" : "My Orders")
    )

    console.log("Logged customer:", customer);
    console.log("Customer ID:", customer?.idCustomer);

    const [tickets, setTickets] = useState<TicketModel[]>([]);

    const [, setIsLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        if (!effectiveCustomerId) {
            return;
        }

        const idCustomer = effectiveCustomerId;

        async function loadTickets() {

            try {

                setIsLoading(true);

                setError("");

                const result =
                    await ticketService.getCustomerTickets(
                        idCustomer
                    );

                setTickets(result);

            } catch (err) {

                console.log(

                    "Failed to loading customer tickets",
                    err
                );

                setError(
                    isHebrew ? "לא ניתן לטעון את ההזמנות " : "Could not load your orders. "
                )
            } finally {
                setIsLoading(false);
            }
        }
        loadTickets();

    }, [effectiveCustomerId, isHebrew]);


    if (!effectiveCustomerId) {
        return (
            <Navigate
                to="/customer-login"
                replace
            />
        )
    }

    return (
        <section className="customer-orders" dir={isHebrew ? "rtl" : "ltr"}>


            <header className="customer-order-header">

                <span className="customer-order-eyebrow">

                    {isHebrew
                        ? "האזור האישי"
                        : "Customer Area"}
                </span>

                <h1>
                    {isManagerView
                        ? (
                            <>
                                {isHebrew
                                    ? "הזמנות הלקוח"
                                    : "Customer Orders"}

                                {selectedCustomer && (
                                    <>
                                        {" — "}
                                        {selectedCustomer.firstName}{" "}
                                        {selectedCustomer.lastName}
                                    </>
                                )}
                            </>
                        )
                        : (
                            isHebrew
                                ? "ההזמנות שלי"
                                : "My Orders"
                        )}
                </h1>

                <p>
                    {isManagerView
                        ? (
                            isHebrew
                                ? "כל הכרטיסים וההזמנות של הלקוח"
                                : "All tickets and orders for this customer."
                        )
                        : (
                            isHebrew
                                ? "כאן ניתן לראות את כל הכרטיסים שהזמנת לאירועים"
                                : "View all the tickets you ordered for upcoming events."
                        )}
                </p>

            </header>


            <div className="customer-orders-grid">

                {tickets.map(ticket => (

                    <article
                        key={ticket.idTicket}
                        className="customer-order-card"
                    >

                        <div className="customer-order-header">

                            <div>
                                <span className="customer-order-label">
                                    {isHebrew ? "אירוע" : "Event"}
                                </span>

                                <h2>
                                    {ticket.eventName}
                                </h2>
                            </div>

                            <span
                                className={`customer-order-status customer-order-status-${ticket.ticketStatus}`}
                            >
                                {ticket.ticketStatus}
                            </span>

                        </div>

                        <div className="customer-order-details">

                            <div>
                                <span>
                                    {isHebrew ? "מספר כרטיס" : "Ticket Number"}
                                </span>

                                <strong>
                                    {ticket.ticketNumber}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    {isHebrew ? "תאריך האירוע" : "Event Date"}
                                </span>

                                <strong>
                                    {new Date(ticket.eventStart).toLocaleString(
                                        isHebrew ? "he-IL" : "en-GB"
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    {isHebrew ? "מיקום" : "Location"}
                                </span>

                                <strong>
                                    {ticket.eventLocation ?? "-"}
                                </strong>
                            </div>

                        </div>

                        <div className="customer-order-ticket">

                            {ticket.ticketStatus === "valid" && ticket.qrCodeDataUrl ? (

                                <>
                                    <div className="customer-order-qr-header">

                                        <span>
                                            {isHebrew ? "כרטיס כניסה" : "Entrance Ticket"}
                                        </span>

                                        <strong>
                                            {isHebrew
                                                ? "הצג את הקוד בכניסה"
                                                : "Show this code at the entrance"}
                                        </strong>

                                    </div>

                                    <div className="customer-order-qr">

                                        <img
                                            src={ticket.qrCodeDataUrl}
                                            alt={`QR ${ticket.ticketNumber}`}
                                        />

                                    </div>
                                </>

                            ) : (

                                <div className="customer-order-qr-disabled">

                                    {ticket.ticketStatus === "checked_in"
                                        ? (isHebrew
                                            ? "✓ הכרטיס כבר נוצל"
                                            : "✓ Ticket already used")

                                        : ticket.ticketStatus === "refunded"
                                            ? (isHebrew
                                                ? "הכרטיס זוכה ואינו תקף לכניסה"
                                                : "Ticket refunded and no longer valid")

                                            : ticket.ticketStatus === "cancelled"
                                                ? (isHebrew
                                                    ? "הכרטיס בוטל ואינו תקף לכניסה"
                                                    : "Ticket cancelled and no longer valid")

                                                : (isHebrew
                                                    ? "QR אינו זמין"
                                                    : "QR unavailable")
                                    }

                                </div>

                            )}

                        </div>




                    </article>

                ))}

            </div>




            {error && (
                <div className="customer-orders-empty">

                    <div>
                        🎟️
                    </div>

                    <h2>

                        {isHebrew
                            ? "עדיין אין הזמנות "
                            : "No Orders yet"
                        }

                    </h2>


                    <p>

                        {isHebrew
                            ? "כשתזמין כרטיס לאירוע הוא יופיע כאן"
                            : "your Event tickets will appear here after purchase"}
                    </p>

                </div>
            )}


        </section>
    );
}
