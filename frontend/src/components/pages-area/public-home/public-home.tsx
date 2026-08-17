
import "./public-home.css"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "../../utils/UseTitle";
import { eventService } from "../../service/eventService";
import { EventModel } from "../../models/event-model";
import pubDrinks from "../../../assets/images/pubDrinks.jpg";


export function PublicHome() {

    useTitle("HAMASGERIA");

    const navigate = useNavigate();

    const [events, setEvents] = useState<EventModel[]>([]);

    useEffect(() => {

        eventService
            .getAllEvents()
            .then(data => {

                const upcomingEvents = data
                    .filter(event =>
                        event.eventStatus !== "cancelled"
                    )
                // .slice(0, 3);

                setEvents(upcomingEvents);
            })
            .catch(console.error);

    }, []);

    useEffect(() => {

        const updateParallax = () => {

            document
                .querySelectorAll<HTMLElement>(".parallax-image")
                .forEach(img => {

                    const parent = img.parentElement;

                    if (!parent) return;

                    const rect = parent.getBoundingClientRect();

                    const center =
                        window.innerHeight / 2 -
                        (rect.top + rect.height / 2);

                    const offset = center * 0.06;

                    img.style.transform =
                        `translate3d(0, ${offset}px, 0) scale(1.12)`;
                });
        }});

useEffect(() => {

    const observer = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }

            });

        },
        {
            threshold: 0.2
        }
    );

    const images =
        document.querySelectorAll(".reveal-image");

    images.forEach(image =>
        observer.observe(image)
    );

    return () => {
        images.forEach(image =>
            observer.unobserve(image)
        );
    };

}, []);

    return (
        <main className="PublicHome">

            <section
                className="public-hero"
                style={{
                    backgroundImage: `
        linear-gradient(
            90deg,
            rgba(0,0,0,0.75) 0%,
            rgba(0,0,0,0.45) 45%,
            rgba(0,0,0,0.05) 100%
        ),
        url(${pubDrinks})
    `
                }}
            >

                <div className="public-hero-content">

                    <span className="public-hero-badge">
                        Hadar Pub Experience
                    </span>

                    <h1>
                        HAMASGERIA
                    </h1>

                    <p>
                        Food, drinks, live events and VIP experiences.
                        Join our customer club and enjoy exclusive benefits.
                    </p>

                    <div className="public-hero-actions">

                        <button
                            className="primary-btn"
                            onClick={() =>
                                navigate("/customer-register")
                            }
                        >
                            Join Now
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() =>
                                navigate("/customer-login")
                            }
                        >
                            Customer Login
                        </button>

                        <button
                            className="employee-btn"
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Employee Login
                        </button>

                    </div>

                </div>

            </section>


            <section className="public-section">

                <div className="public-section-header">

                    <span>WHAT'S NEXT</span>

                    <h2>
                        Upcoming Events
                    </h2>

                    <p>
                        Discover upcoming events at Hadar Pub.
                    </p>

                </div>


                <div className="public-events-grid">

                    {events.map(event => {

                        const availablePlaces =
                            event.maximumGuests != null
                                ? Math.max(
                                    event.maximumGuests -
                                    (event.expectedGuests ?? 0),
                                    0
                                )
                                : null;

                        return (

                            <article
                                className="public-event-card"
                                key={event.idEvent}
                            >

                                <div className="public-event-image">

                                    <img className="parallax-image"
                                        src={event.coverImageUrl ? String(event.coverImageUrl) : "/placeholder-event.jpg"}
                                        alt={event.eventName}
                                    />

                                    <span className="event-status">
                                        {event.eventStatus}
                                    </span>

                                </div>


                                <div className="public-event-content">

                                    <h3>
                                        {event.eventName}
                                    </h3>

                                    <p className="event-description">
                                        {event.eventDescription}
                                    </p>


                                    <div className="event-meta">

                                        <span>
                                            📅{" "}
                                            {new Date(
                                                event.eventStart
                                            ).toLocaleString("en-GB")}
                                        </span>

                                        <span>
                                            📍{" "}
                                            {event.eventLocation ??
                                                "Hadar Pub"}
                                        </span>

                                        {event.maximumGuests != null && (

                                            <span>
                                                👥{" "}
                                                {event.expectedGuests ?? 0}
                                                {" / "}
                                                {event.maximumGuests}
                                            </span>

                                        )}

                                    </div>


                                    <div className="event-price-area">

                                        <div>

                                            <span className="price-label">
                                                Regular
                                            </span>

                                            <strong>
                                                ₪
                                                {Number(
                                                    event.ticketPrice
                                                ).toFixed(2)}
                                            </strong>

                                        </div>


                                        {event.vipPrice != null && (

                                            <div className="vip-price">

                                                <span className="price-label">
                                                    ⭐ VIP
                                                </span>

                                                <strong>
                                                    ₪
                                                    {Number(
                                                        event.vipPrice
                                                    ).toFixed(2)}
                                                </strong>

                                            </div>

                                        )}

                                    </div>


                                    {availablePlaces !== null &&
                                        availablePlaces === 0 ? (

                                        <button
                                            className="sold-out-btn"
                                            disabled
                                        >
                                            Sold Out
                                        </button>

                                    ) : (

                                        <button
                                            className="order-btn"
                                            onClick={() =>
                                                navigate(
                                                    "/customer-login"
                                                )
                                            }
                                        >
                                            Login To Order
                                        </button>

                                    )}

                                </div>

                            </article>

                        );

                    })}

                </div>

            </section>


            <section className="public-benefits">

                <div className="benefit-card">

                    <div className="benefit-icon" onClick={()=> navigate(`/customer-login`)}>
                        ⭐
                    </div>

                    <h3>
                        VIP Membership
                    </h3>

                    <p>
                        Enjoy VIP event prices, exclusive offers
                        and special customer benefits.
                    </p>

                </div>


                <div className="benefit-card" >

                    <div className="benefit-icon" onClick={()=> navigate(`/customer-login`)}>
                        🎟️
                    </div>

                    <h3>
                        Live Events
                    </h3>

                    <p>
                        Discover parties, tasting nights,
                        live music and special pub events.
                    </p>

                </div>


                <div className="benefit-card">

                    <div className="benefit-icon" onClick={()=> navigate(`/customer-login`)}>
                        🍺
                    </div>

                    <h3>
                        Pub Experience
                    </h3>

                    <p>
                        Great drinks, food and experiences
                        at Hadar Pub.
                    </p>

                </div>

            </section>


            <section className="public-cta">

                <div>

                    <span>
                        JOIN THE COMMUNITY
                    </span>

                    <h2>
                        Become a Hadar Pub customer
                    </h2>

                    <p>
                        Register today to order event tickets,
                        access VIP benefits and manage your account.
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate("/customer-register")
                    }
                >
                    Create Account
                </button>

            </section>

        </main>
    );
}