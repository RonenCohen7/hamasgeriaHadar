import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import type { RootState } from "../../redux/inventory-store";
import "./customer-dashboard.css";
import { useEffect, useState } from "react";
import { EventModel } from "../../models/event-model";
import { useTitle } from "../../utils/UseTitle";
import { eventService } from "../../service/eventService";

export function CustomerDashboard() {

    useTitle("Events")
    const navigate = useNavigate()


    const [events, setEvents] = useState<EventModel[]>([]);

    const customer = useSelector(
        (state: RootState) => state.customerAuth.customer
    );

    if (!customer) {
        return <Navigate to="/customer-login" replace />;
    }



    useEffect(()=>{
        eventService
            .getUpcomingEvents()
            .then(setEvents)
            .catch(console.error);
            

    },[]);




    return (
        <section className="customer-dashboard">

            <header className="customer-dashboard-header">

                <div>
                    <span className="dashboard-welcome">
                        Customer Portal
                    </span>

                    <h1>
                        Welcome {customer.firstName} 👋
                    </h1>

                    <p>
                        Discover offers, events and experiences at Hadar Pub.
                    </p>
                </div>

                <span
                    className={
                        customer.hasVipCard
                            ? "dashboard-vip-status vip"
                            : "dashboard-vip-status no-vip"
                    }
                >
                    {customer.hasVipCard
                        ? "⭐ VIP Member"
                        : "Guest Customer"}
                </span>

            </header>


            <section className="dashboard-section">

                <div className="dashboard-section-header">
                    <div>
                        <span>FOR YOU</span>
                        <h2>Special Offers</h2>
                    </div>
                </div>

                <div className="dashboard-offers-grid">
                        

                    <article className="dashboard-offer-card">
                        <span className="dashboard-offer-icon">
                            🍺
                        </span>

                        <h3>Happy Hour</h3>

                        <p>
                            Special prices on selected beers
                            and cocktails.
                        </p>
                    </article>


                    <article className="dashboard-offer-card">
                        <span className="dashboard-offer-icon">
                            🥃
                        </span>

                        <h3>VIP Tasting</h3>

                        <p>
                            Exclusive tasting evenings for
                            VIP members.
                        </p>
                    </article>


                    <article className="dashboard-offer-card">
                        <span className="dashboard-offer-icon">
                            🎂
                        </span>

                        <h3>Birthday Experience</h3>

                        <p>
                            Celebrate your birthday with a
                            reserved table and a special treat.
                        </p>
                    </article>

                </div>

            </section>


            <section className="dashboard-section">

                <div className="dashboard-section-header">
                    <div>
                        <span>WHAT'S NEXT</span>
                        <h2>Upcoming Events</h2>
                    </div>
                </div>

                <div className="dashboard-events-grid">
                    {events.map(event => {
                        const eventDate = new Date(event.eventStart);
                    return (
                        <article
                            key={event.idEvent}
                            className="dashboard-event-card"
                        >
                            <div className="dashboard-event-date">
                                <strong>
                                    {eventDate.getDate()}
                                </strong>

                                <span>
                                    {eventDate.toLocaleString("en-US",{month:"short"}).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h3>{event.eventName}</h3>

                                <p>{event.eventDescription}</p>

                                <small>
                                    {eventDate.toLocaleString()}
                                </small>

                                {event.eventLocation && (
                                    <p>
                                        📍 {event.eventLocation}
                                    </p>
                                )}
                                <strong>
                                    {Number(event.ticketPrice) > 0 ? `₪${event.ticketPrice}` : "Free Entry"} 
                                </strong>
                            </div>

                        </article>
                    )
                    })}

                    <article className="dashboard-event-card">

                        <div className="dashboard-event-date">
                            <strong>18</strong>
                            <span>AUG</span>
                        </div>

                        <div>
                            <h3>Whisky Tasting Night</h3>

                            <p>
                                Premium whisky tasting with
                                food pairing.
                            </p>
                        </div>

                    </article>


                    <article className="dashboard-event-card">

                        <div className="dashboard-event-date">
                            <strong>25</strong>
                            <span>AUG</span>
                        </div>

                        <div>
                            <h3>Live Music Evening</h3>

                            <p>
                                Cocktails, food and live music
                                at Hadar Pub.
                            </p>
                        </div>

                    </article>

                </div>

            </section>


            <section className="dashboard-section">

                <div className="dashboard-section-header">
                    <div>
                        <span>DISCOVER</span>
                        <h2>Pub Experiences</h2>
                    </div>
                </div>

                <div className="dashboard-activities-grid">

                    <article className="dashboard-activity-card">
                        <img
                            src="/src/assets/images/pubDrinks.jpg"
                            alt="Hadar Pub cocktails"
                        />

                        <div className="dashboard-activity-overlay">
                            <h3>Cocktail Experience</h3>

                            <p>
                                Discover signature cocktails
                                from our bar.
                            </p>
                        </div>
                    </article>


                    <article className="dashboard-activity-card">
                        <img
                            src="/src/assets/images/vip-chef.jpg"
                            alt="Hadar Pub chef"
                        />

                        <div className="dashboard-activity-overlay">
                            <h3>Chef Specials</h3>

                            <p>
                                Discover special dishes from
                                our kitchen.
                            </p>
                        </div>
                    </article>

                </div>

            </section>

        </section>
    );
}