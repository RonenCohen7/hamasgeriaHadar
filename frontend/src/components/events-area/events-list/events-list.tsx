import { useNavigate } from "react-router-dom";
import { useTitle } from "../../utils/UseTitle";
import "./events-list.css";
import { useEffect, useState } from "react";
import { EventModel } from "../../models/event-model";
import { eventService } from "../../service/eventService";
import { notificationService } from "../../service/notificationService";

export function EventsList() {

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


    return (

        <section className="EventsList">

            <header className="events-list-header">

                <div>
                    <span>EVENT MANAGEMENT</span>

                    <h1>Events</h1>

                    <p>
                        Manage all pub events in one place.
                    </p>
                </div>

                <button
                    type="button"
                    className="add-event-button"
                    onClick={() => navigate("/events/add")}
                >
                    + Add Event
                </button>

            </header>


            <section className="events-stats">

                <article className="event-stat-card">
                    <span>📆</span>
                    <h2>{events.length}</h2>
                    <p>Total Events</p>
                </article>


                <article className="event-stat-card">
                    <span>🟢</span>
                    <h2>{activeEvents}</h2>
                    <p>Active</p>
                </article>


                <article className="event-stat-card">
                    <span>✴️</span>
                    <h2>{plannedEvents}</h2>
                    <p>Planned</p>
                </article>


                <article className="event-stat-card">
                    <span>✅</span>
                    <h2>{completedEvents}</h2>
                    <p>Completed</p>
                </article>


                <article className="event-stat-card">
                    <span>👥</span>
                    <h2>{totalExpectedGuests}</h2>
                    <p>Expected Guests</p>
                </article>

            </section>


            <div className="events-search">

                <input
                    type="text"
                    placeholder="Search event..."
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
                                className={`status ${event.eventStatus}`}
                            >
                                {event.eventStatus}
                            </span>

                        </div>


                        <h2>{event.eventName}</h2>

                        <p>
                            {event.eventDescription}
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
                                💰 Regular: ₪{Number(event.ticketPrice).toFixed(2)}
                            </span>
                            {event.vipPrice != null && (
                                <span className="event-vip-price">
                                    ⭐ VIP: ₪{Number(event.vipPrice).toFixed(2)}
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
                                👁 Details
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/events/edit/${event.idEvent}`
                                    )
                                }
                            >
                                ✏️ Edit
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/events/media/${event.idEvent}`
                                    )
                                }
                            >
                                🖼 Media
                            </button>


                            <button
                                type="button"
                            >
                                🗑 Delete
                            </button>

                        </div>

                    </article>

                ))}

            </div>

        </section>
    );
}