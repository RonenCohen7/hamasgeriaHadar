import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./event-details.css";

import { EventModel } from "../../models/event-model";
import type { EventMediaModel } from "../../models/event-media-model";

import { eventService } from "../../service/eventService";
import { eventMediaService } from "../../service/eventMediaService";
import { notificationService } from "../../service/notificationService";

import { useTitle } from "../../utils/UseTitle";
import { appConfig } from "../../utils/app-config";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n/i18n";

export function EventDetails() {

    const local = i18n.language == "he" ? "he-IL" : "en-US";



    const { t } = useTranslation();


    useTitle(t("events.details.title"));

    const navigate = useNavigate();

    const { idEvent } = useParams();

    const eventId = Number(idEvent);


    const [event, setEvent] =
        useState<EventModel | null>(null);

    const [media, setMedia] =
        useState<EventMediaModel[]>([]);

    const [isLoading, setIsLoading] =
        useState(true);



    // =========================================
    // LOAD EVENT
    // =========================================

    useEffect(() => {

        if (
            !Number.isInteger(eventId) ||
            eventId <= 0
        ) {

            notificationService.error(
                t("events.details.eventNotFound")
            );

            navigate("/customer-dashboard");

            return;
        }


        async function loadEvent() {

            try {

                setIsLoading(true);

                const eventFromApi =
                    await eventService
                        .getOneEvent(eventId);

                setEvent(eventFromApi);




            } catch (err) {

                console.error(
                    "Failed to load event:",
                    err
                );

                notificationService.error(
                    t("events.details.eventNotFound")
                );

                navigate("/customer-dashboard");

            } finally {

                setIsLoading(false);
            }
        }


        loadEvent();

    }, [eventId, navigate]);



    // =========================================
    // LOAD EVENT MEDIA
    // =========================================

    useEffect(() => {

        if (
            !Number.isInteger(eventId) ||
            eventId <= 0
        ) {
            return;
        }


        async function loadMedia() {

            try {

                const result =
                    await eventMediaService
                        .getMediaByEventId(eventId);

                setMedia(result);

            } catch (err) {

                console.error(
                    "Failed to load event media:",
                    err
                );
            }
        }


        loadMedia();

    }, [eventId]);



    // =========================================
    // LOADING
    // =========================================

    if (isLoading || !event) {

        return (
            <section className="EventDetails">

                <div className="event-details-loading">
                    {t("events.details.loading")}
                </div>

            </section>
        );
    }



    // =========================================
    // DATE / TIME
    // =========================================

    const eventDate =
        new Date(event.eventStart);


    const formattedDate =
        eventDate.toLocaleDateString(
            local,
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    const formattedTime =
        eventDate.toLocaleTimeString(
            local,
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );



    // =========================================
    // AVAILABLE PLACES
    // =========================================

    const availablePlaces =
        event.maximumGuests != null
            ? Math.max(
                event.maximumGuests -
                (event.expectedGuests ?? 0),
                0
            )
            : null;



    // =========================================
    // ORDER
    // =========================================

    function orderTickets() {

        navigate(
            `/events/order/${eventId}`
        );
    }



    // =========================================
    // VIEW
    // =========================================

    return (

        <section className="EventDetails">


            {/* =================================
                MAIN EVENT CARD
            ================================= */}

            <div className="event-details-shell">


                {/* IMAGE */}

                <div className="event-details-visual">


                    <button
                        type="button"
                        className="event-details-back"
                        onClick={() => navigate(-1)}
                    >
                        ← {t("events.details.back")}
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
                                {t("events.details.imageUnavailable")}
                            </p>

                        </div>

                    )}

                </div>



                {/* DETAILS */}

                <div className="event-details-panel">

                    <div className="event-details-card">


                        <span className="event-details-eyebrow">
                            {t("events.details.event")}
                        </span>


                        <h1>
                            {event.eventName}
                        </h1>


                        {event.eventDescription && (

                            <p className="event-details-description">
                                {event.eventDescription}
                            </p>

                        )}



                        {/* INFO */}

                        <div className="event-details-info">


                            <div className="event-info-row">

                                <span className="event-info-icon">
                                    📅
                                </span>

                                <div>

                                    <small>
                                        <small>{t("events.details.date")}</small>
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
                                        {t("events.details.time")}
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
                                            <small>{t("events.details.location")}</small>
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
                                            <small>{t("events.details.availablePlaces")}</small>
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
                                    {t("events.details.regularPrice")}
                                </span>

                                <strong>

                                    {Number(event.ticketPrice) > 0
                                        ? `₪${Number(
                                            event.ticketPrice
                                        ).toFixed(2)}`
                                        : t("events.details.freeEntry")}

                                </strong>

                            </div>



                            {event.vipPrice != null && (

                                <div className="event-price-box vip">

                                    <span>
                                        ⭐ {t("events.details.vipPrice")}
                                    </span>

                                    <strong>
                                        ₪{Number(
                                            event.vipPrice
                                        ).toFixed(2)}
                                    </strong>

                                </div>

                            )}

                        </div>


                    </div>

                </div>


            </div>



            {/* =================================
                EVENT GALLERY
            ================================= */}

            {media.length > 0 && (

                <section className="event-details-gallery">


                    <div className="event-details-gallery-header">

                        <div>

                            <span>
                                {t("events.details.gallery")}
                            </span>

                            <h2>
                                {t("events.details.photosVideos")}
                            </h2>

                        </div>

                        <small>
                            {media.length}{" "}
                            {media.length === 1
                                ? t("events.details.item")
                                : t("events.details.items")}
                        </small>

                    </div>



                    <div className="event-details-gallery-grid">

                        {media.map(item => (

                            <article
                                key={item.idMedia}
                                className="event-details-gallery-item"
                            >

                                <div className="event-details-gallery-preview">


                                    {item.mediaType === "image" ? (

                                        <img
                                            src={
                                                `${appConfig.baseMediaUrl}${item.mediaUrl}`
                                            }
                                            alt={
                                                item.title ??
                                                event.eventName
                                            }
                                        />

                                    ) : (

                                        <video
                                            src={
                                                `${appConfig.baseMediaUrl}${item.mediaUrl}`
                                            }
                                            controls
                                            preload="metadata"
                                        />

                                    )}


                                    {item.isCover && (

                                        <span className="event-gallery-cover">
                                            ⭐ {t("events.details.cover")}
                                        </span>

                                    )}


                                    <span className="event-gallery-type">

                                        {item.mediaType === "image"
                                            ? "📷"
                                            : "▶"}

                                    </span>


                                </div>



                                {(item.title || item.description) && (

                                    <div className="event-details-gallery-content">


                                        {item.title && (
                                            <h3>
                                                {item.title}
                                            </h3>
                                        )}


                                        {item.description && (
                                            <p>
                                                {item.description}
                                            </p>
                                        )}


                                    </div>

                                )}


                            </article>

                        ))}

                    </div>


                </section>

            )}



            {/* =================================
                ORDER
            ================================= */}

            <div className="event-gallery-order">


                <div className="event-gallery-order-text">

                    <strong>
                        {t("events.details.readyToJoin")}
                    </strong>

                    <span>
                        {t("events.details.chooseTickets")}
                    </span>

                </div>



                <button
                    type="button"
                    className="event-order-button"
                    onClick={orderTickets}
                    disabled={availablePlaces === 0}
                >

                    {availablePlaces === 0
                        ? t("events.details.soldOut")
                        : `🎟 ${t("events.details.orderTickets")}`}

                </button>


                <small>
                    {t("events.details.securePlace")}
                </small>


            </div>


        </section>
    );
}