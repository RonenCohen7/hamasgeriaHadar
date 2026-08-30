import { useTranslation } from "react-i18next";
import "./customer-orders.css";
import { useTitle } from "../../utils/UseTitle";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/inventory-store";
import { useEffect, useState } from "react";

import { ticketService } from "../../service/ticketService";
import { Navigate } from "react-router-dom";
import type { TicketModel } from "../../models/ticket-model";

export function CustomerOrders() {


    const { t, i18n } = useTranslation();

    const isHebrew = i18n.language === "he";

    useTitle(isHebrew ? "ההזמנות שלי" : "My Orders");

    const customer = useSelector((state: RootState) => state.customerAuth.customer);

    console.log("Logged customer:", customer);
    console.log("Customer ID:", customer?.idCustomer);

    const [tickets, setTickets] = useState<TicketModel[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        async function loadTickets() {

            if (!customer?.idCustomer) {

                return;
            }

            try {

                setIsLoading(true);

                setError("");

                const result =
                    await ticketService.getCustomerTickets(
                        customer.idCustomer
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

    }, [customer?.idCustomer, isHebrew]);


    if (!customer) {
        return (
            <Navigate
                to="/customer-login"
                replace
            />
        );
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
                    {isHebrew
                        ? "ההזמנות שלי"
                        : "My Orders"}
                </h1>

                <p>
                    {isHebrew
                        ? "כאן ניתן לראות את כל הכרטיסים שהזמנת לאירועים"
                        : "View all the tickets you ordered for upcoming events. "}
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
