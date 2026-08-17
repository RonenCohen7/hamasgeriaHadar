import { useNavigate } from "react-router-dom";
import { useTitle } from "../../utils/UseTitle";
import "./events-list.css";
import { useEffect, useState } from "react";
import { EventModel } from "../../models/event-model";
import { eventService } from "../../service/eventService";
import { notificationService } from "../../service/notificationService";
import { dialogService } from "../../service/dialogService";
import { useTranslation } from "react-i18next";

export function EventsList() {

    const { t } = useTranslation();

    useTitle("Event-List");

    const navigate = useNavigate();

    const [events, setEvents] = useState<EventModel[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        eventService
            .getAllEvents()
            .then(eventFromApi => {
                setEvents(eventFromApi);
            })
            .catch(err => {
                notificationService.error(err);
            });

    }, []);


    const filterEvents = events.filter(event =>
        event.eventName
            .toLowerCase()
            .includes(search.toLowerCase())
    );


    const plannedEvents =
        events.filter(e => e.eventStatus === "planned").length;

    const activeEvents =
        events.filter(e => e.eventStatus === "active").length;

    const completedEvents =
        events.filter(e => e.eventStatus === "completed").length;

    const totalExpectedGuests =
        events.reduce(
            (sum, event) => sum + (event.expectedGuests ?? 0),
            0
        );




    async function deleteEvent(idEvent: number) {
        const confirm = await dialogService.confirm(
            t("events.deleteTitle"),
            t("events.deleteMessage"),
            t("events.deleteConfirm"),
            t("events.cancel")
        );

        if (!confirm) {
            return;
        };

        try {
            await eventService.deleteEvent(idEvent);

            setEvents(currentEvents =>
                currentEvents.filter(
                    event => event.idEvent !== idEvent
                ))
            notificationService.success(
                t("events.deleteSuccess")
            )
        } catch (err) {
            console.error(err)
            notificationService.error(
                t("events.deleteError")
            )
        }

    }



    return (

        <section className="EventsList">

            <header className="events-list-header">

                <div>
                    <span>{t("events.management")}</span>

                    <h1>{t("events.title")}</h1>

                    <p>{t("events.description")}</p>
                </div>

                <button
                    type="button"
                    className="add-event-button"
                    onClick={() => navigate("/events/add")}
                >
                    + {t("events.addEvent")}
                </button>

            </header>


            <section className="events-stats">

                <article className="event-stat-card">
                    <span>📆</span>
                    <h2>{events.length}</h2>
                    <p>{t("events.totalEvents")}</p>
                </article>


                <article className="event-stat-card">
                    <span>🟢</span>
                    <h2>{activeEvents}</h2>
                    <p>{t("events.active")}</p>
                </article>


                <article className="event-stat-card">
                    <span>✴️</span>
                    <h2>{plannedEvents}</h2>
                    <p>{t("events.planned")}</p>
                </article>


                <article className="event-stat-card">
                    <span>✅</span>
                    <h2>{completedEvents}</h2>
                    <p>{t("events.completed")}</p>
                </article>


                <article className="event-stat-card">
                    <span>👥</span>
                    <h2>{totalExpectedGuests}</h2>
                    <p>{t("events.expectedGuests")}</p>
                </article>

            </section>


            <div className="events-search">

                <input
                    type="text"
                    placeholder={t("events.searchPlaceholder")}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

            </div>


            <div className="events-grid">

                {filterEvents.map(event => (

                    <article
                        key={event.idEvent}
                        className="event-card"
                    >

                        <div className="event-card-header">
                            {event.coverImageUrl && (
                                <div className="event-card-image">
                                    <img
                                        src={event.coverImageUrl}
                                        alt={event.eventName}
                                    />
                                </div>
                            )}
                            <span
                                className={t(`events.status.${event.eventStatus}`)}
                            >
                                {t("events.planned")}
                            </span>

                        </div>


                        <h2>{event.eventName}</h2>

                        <p>
                            {t("events.detailsForm")}
                        </p>


                        <div className="event-details">

                            <span>
                                📆{" "}
                                {new Date(
                                    event.eventStart
                                ).toLocaleString()}
                            </span>

                            <span>
                                📍 {event.eventLocation}
                            </span>

                            <span>
                                👥 {event.expectedGuests ?? 0}
                                {" / "}
                                {event.maximumGuests ?? 0}
                            </span>

                            <span>
                                💰 ₪{event.ticketPrice}
                            </span>
                            <span>
                                💰 {t("events.regularPrice")}: ₪{Number(event.ticketPrice).toFixed(2)}
                            </span>
                            {event.vipPrice != null && (
                                <span className="event-vip-price">
                                    ⭐ {t("events.vipPrice")}: ₪{Number(event.vipPrice).toFixed(2)}
                                </span>
                            )}

                        </div>


                        <div className="event-actions">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/events/details/${event.idEvent}`
                                    )
                                }
                            >
                                👁 {t("events.detailsForm")}
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/events/edit/${event.idEvent}`
                                    )
                                }
                            >
                                ✏️ {t("events.editForm")}
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/events/media/${event.idEvent}`
                                    )
                                }
                            >
                                🖼 {t("events.media")}
                            </button>


                            <button
                                type="button"
                                onClick={() => deleteEvent(event.idEvent)}
                            >
                                🗑 {t("events.delete")}
                            </button>

                        </div>

                    </article>

                ))}

            </div>

        </section>
    );
}