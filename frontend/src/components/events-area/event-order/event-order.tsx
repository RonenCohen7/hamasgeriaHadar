import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTitle } from "../../utils/UseTitle";
import "./event-order.css";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/inventory-store";
import { useEffect, useState } from "react";
import { EventModel } from "../../models/event-model";
import { notificationService } from "../../service/notificationService";
import { eventService } from "../../service/eventService";
import { saleOrderService } from "../../service/sale-order-service";
import { SaleOrderModel } from "../../models/sale-order-model";

import { dialogService } from "../../service/dialogService";

import { PaymentMethod } from "../../models/enum";
import type { VipCardModel } from "../../models/vip-card-model";
import { PaymentModal } from "../../payment-area/payment-model/payment-model";
import { appConfig } from "../../utils/app-config";
import { useTranslation } from "react-i18next";


export function EventOrder() {

    useTitle("Event Order")
    const { t } = useTranslation();
    const navigate = useNavigate()

    const location = useLocation();

    const { idEvent } = useParams()
    const eventId = Number(idEvent);

    const customer = useSelector((state: RootState) => state.customerAuth.customer);

    const [event, setEvent] = useState<EventModel | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [comfortChairFlags, setComfortChairFlags] = useState<boolean[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    const [sale, setSale] = useState<SaleOrderModel | null>(null);

    const returnedSaleId = location.state?.idSale;




    useEffect(() => {


        if (!Number.isInteger(eventId) || eventId <= 0) {
            notificationService.error("Invalid event")
            navigate("/customer-dashboard");
            return;
        }

        eventService
            .getOneEvent(eventId)
            .then(setEvent)
            .catch(err => {
                console.log(err);
                notificationService.error("Failed to load event")
                navigate("/customer-dashboard")
            })

            .finally(() => setIsLoading(false))

    }, [eventId, navigate]);


    useEffect(() => {

        if (!returnedSaleId) return;

        saleOrderService
            .getOneSale(returnedSaleId)
            .then(existingSale => {
                setSale(existingSale)
                setIsPaymentOpen(true)
            })
            .catch(console.error)


    }, [returnedSaleId]);

    if (isLoading) {
        return <p>Loading event</p>
    }

    if (!event) {
        return null
    }

    if (!customer) {
        navigate("/customer-login")
        return null
    }

    const availablePlaces = appConfig.showEventCapacity && event.maximumGuests != null ? Math.max(
        event.maximumGuests - (event.expectedGuests ?? 0), 0) : null

    const unitPrice = Number(event.ticketPrice);

    const total = unitPrice * quantity;

    const ticketIndexes = Array.from({ length: Math.max(quantity, 0) }, (_, index) => index);

    const comfortChairs = ticketIndexes.filter(index => comfortChairFlags[index]).length;

    function toggleComfortChair(index: number, checked: boolean) {
        setComfortChairFlags(flags => {
            const nextFlags = [...flags];
            nextFlags[index] = checked;
            return nextFlags;
        });
    }



    async function continueToPayment() {

        if (!event || !customer) {
            notificationService.error(
                "Event or Customer data is missing"
            )
            return;
        }

        if (quantity <= 0) {
            notificationService.error("Please select al least one ticket");
            return;
        }

        if (
            availablePlaces != null &&
            quantity > availablePlaces
        ) {
            notificationService.error(
                `Only ${availablePlaces} ticket available`
            )
            return;
        }

        try {

            const createdSale =
                await saleOrderService.purchaseEventTickets({
                    idEvent: event.idEvent,
                    idCustomer: customer.idCustomer,
                    quantity,
                    comfortChairs,
                    idVipCard: null
                });

            setSale(createdSale);

            setIsPaymentOpen(true);

            console.log(
                "EVENT TICKET SALE:",
                createdSale
            );

            notificationService.success(
                "Order order created successfully"
            );

        }
        catch (error: any) {

            console.error(error);
            error.response?.data?.message ??
                error.message ??
                await dialogService.error(
                    "😞", "Failed to create ticket order"
                );
        }

    }

    async function confirmPayment(
        paymentMethod: PaymentMethod,
        vipCard: VipCardModel | null
    ) {


        const updateSale = await saleOrderService.completePayment(
            sale!.idSale,
            paymentMethod,
            vipCard?.idVipCard ?? null
        );
        console.log(
            "PAYMENT COMPLETE:",
            updateSale
        );

        await dialogService.success("✴️", "PAYMENT COMPLETE")

        setIsPaymentOpen(false);

        setIsPaymentOpen(false);
        navigate("/customer-dashboard")

    }


    return (
        <section className="EventTicketOrder">

            <div className="ticket-order-card">


                <button
                    type="button"
                    onClick={() => navigate(-1)}
                >
                    ⬅ Back
                </button>

                <h1>{event.eventName}</h1>

                <p>
                    {new Date(event.eventStart).toLocaleString("en-GB")}
                </p>

                <div className="ticket-order-price">

                    <span>Ticket Price</span>

                    <strong>
                        ₪ {unitPrice.toFixed(2)}
                    </strong>

                    <div className="ticket-order-field">

                        <label>
                            Number of Ticket
                        </label>

                        <input
                            type="number"
                            min="1"
                            max={availablePlaces ?? undefined}
                            value={quantity}
                            onChange={e => (
                                setQuantity(Number(e.target.value))
                            )}
                        />
                    </div>
                    {availablePlaces !== null && (
                        <p>
                            Available places: {availablePlaces}
                        </p>
                    )}

                    {ticketIndexes.length > 0 && (
                        <div className="ticket-comfort-chairs">
                            <span>♿ {t("eventOrder.comfortChairTitle")}</span>
                            <small>{t("eventOrder.comfortChairHint")}</small>

                            {ticketIndexes.map(index => (
                                <label key={index} className="ticket-comfort-chair-row">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(comfortChairFlags[index])}
                                        onChange={e => toggleComfortChair(index, e.target.checked)}
                                    />
                                    {t("eventOrder.ticketNumber", { number: index + 1 })}
                                </label>
                            ))}
                        </div>
                    )}

                    <div className="ticket-order-total">

                        <span>Total</span>

                        <strong>
                            ₪ {total.toFixed(2)}
                        </strong>

                    </div>

                    <button
                        type="button"
                        onClick={continueToPayment}
                        disabled={availablePlaces === 0}
                    >
                        Continue to payment

                    </button>

                </div>

            </div>
            {isPaymentOpen && sale && (
                <PaymentModal
                    saleId={sale.idSale}
                    totalAmount={Number(sale.totalAmount)}
                    isSubmitting={false}
                    onClose={() => setIsPaymentOpen(false)}
                    onConfirm={confirmPayment}
                />
            )}
        </section>
    );
}
