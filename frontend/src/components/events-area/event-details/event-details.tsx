import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./event-details.css";

import { EventModel } from "../../models/event-model";
import { eventService } from "../../service/eventService";
import { notificationService } from "../../service/notificationService";
import { useTitle } from "../../utils/UseTitle";

export function EventDetails() {

    useTitle("Event Details");

    const navigate = useNavigate();

    const { idEvent } = useParams();
    const eventId = Number(idEvent);

    const [event, setEvent] = useState<EventModel | null>(null);


    useEffect(() => {

        if (!Number.isInteger(eventId) || eventId <= 0) {

            notificationService.error("Event not found");

            navigate("/customer-dashboard");

            return;
        }

        eventService
            .getOneEvent(eventId)
            .then(eventFromApi => {

                setEvent(eventFromApi);

            })
            .catch(err => {

                console.error(err);

                notificationService.error(
                    "Failed to load event"
                );

                navigate("/customer-dashboard");
            });

    }, [eventId, navigate]);


    if (!event) {
        return (
            <section className="EventDetails">

                <div className="event-details-loading">
                    Loading event...
                </div>

            </section>
        );
    }


    const eventDate =
        new Date(event.eventStart);


    const formattedDate =
        eventDate.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    const formattedTime =
        eventDate.toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    const availablePlaces =
        event.maximumGuests != null
            ? Math.max(
                event.maximumGuests -
                (event.expectedGuests ?? 0),
                0
            )
            : null;


    function orderTickets() {

        navigate(
            `/events/order/${eventId}`
        );
    }


    return (

        <section className="EventDetails">

            <div className="event-details-shell">


                {/* =========================
                    IMAGE SIDE
                ========================= */}

                <div className="event-details-visual">

                    <button
                        type="button"
                        className="event-details-back"
                        onClick={() =>
                            navigate("/customer-dashboard")
                        }
                    >
                        ← Back
                    </button>


                    {event.coverImageUrl ? (

                        <img
                            src={event.coverImageUrl}
                            alt={event.eventName}
                            className="event-details-cover"
                        />

                    ) : (

                        <div className="event-details-no-image">

                            <span>🎭</span>

                            <p>
                                Event image unavailable
                            </p>

                        </div>

                    )}

                </div>


                {/* =========================
                    DETAILS SIDE
                ========================= */}

                <div className="event-details-panel">

                    <div className="event-details-card">


                        <span className="event-details-eyebrow">
                            Hadar Pub Event
                        </span>


                        <h1>
                            {event.eventName}
                        </h1>


                        {event.eventDescription && (

                            <p className="event-details-description">
                                {event.eventDescription}
                            </p>

                        )}


                        {/* EVENT INFO */}

                        <div className="event-details-info">


                            <div className="event-info-row">

                                <span className="event-info-icon">
                                    📅
                                </span>

                                <div>

                                    <small>
                                        Date
                                    </small>

                                    <strong>
                                        {formattedDate}
                                    </strong>

                                </div>

                            </div>


                            <div className="event-info-row">

                                <span className="event-info-icon">
                                    🕒
                                </span>

                                <div>

                                    <small>
                                        Time
                                    </small>

                                    <strong>
                                        {formattedTime}
                                    </strong>

                                </div>

                            </div>


                            {event.eventLocation && (

                                <div className="event-info-row">

                                    <span className="event-info-icon">
                                        📍
                                    </span>

                                    <div>

                                        <small>
                                            Location
                                        </small>

                                        <strong>
                                            {event.eventLocation}
                                        </strong>

                                    </div>

                                </div>

                            )}


                            {availablePlaces !== null && (

                                <div className="event-info-row">

                                    <span className="event-info-icon">
                                        👥
                                    </span>

                                    <div>

                                        <small>
                                            Available Places
                                        </small>

                                        <strong>
                                            {availablePlaces}
                                        </strong>

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* PRICES */}

                        <div className="event-details-prices">


                            <div className="event-price-box regular">

                                <span>
                                    Regular Price
                                </span>

                                <strong>

                                    {Number(event.ticketPrice) > 0
                                        ? `₪${Number(
                                            event.ticketPrice
                                        ).toFixed(2)}`
                                        : "Free Entry"}

                                </strong>

                            </div>


                            {event.vipPrice != null && (

                                <div className="event-price-box vip">

                                    <span>
                                        ⭐ VIP Price
                                    </span>

                                    <strong>
                                        ₪{Number(
                                            event.vipPrice
                                        ).toFixed(2)}
                                    </strong>

                                </div>

                            )}

                        </div>


                        {/* ORDER */}

                        <button
                            type="button"
                            className="event-order-button"
                            onClick={orderTickets}
                            disabled={availablePlaces === 0}
                        >

                            {availablePlaces === 0
                                ? "Sold Out"
                                : "🎟 Order Tickets"}

                        </button>


                        <small className="event-order-note">

                            Select tickets and continue
                            to secure payment.

                        </small>


                    </div>

                </div>


            </div>

        </section>
    );
}