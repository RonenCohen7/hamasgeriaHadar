
import "./public-home.css"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "../../utils/UseTitle";
import { eventService } from "../../service/eventService";
import { EventModel } from "../../models/event-model";
import pubDrinks from "../../../assets/images/pubDrinks.jpg";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n/i18n";


export function PublicHome() {

    const { t } = useTranslation();
    const isHebrew = i18n.language === "he";

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
        };
        updateParallax();

        window.addEventListener("scroll", updateParallax);

        return () => {
            window.removeEventListener("scroll", updateParallax);
        };

    }, []);


    // useEffect(() => {

    //     const observer = new IntersectionObserver(
    //         entries => {

    //             entries.forEach(entry => {

    //                 if (entry.isIntersecting) {
    //                     entry.target.classList.add("show");
    //                 }

    //             });

    //         },
    //         {
    //             threshold: 0.2
    //         }
    //     );

    //     const images =
    //         document.querySelectorAll(".reveal-image");

    //     images.forEach(image =>
    //         observer.observe(image)
    //     );

    //     return () => {
    //         images.forEach(image =>
    //             observer.unobserve(image)
    //         );
    //     };

    // }, []);



    return (
        <main className="PublicHome" dir={isHebrew ? "rtl" : "ltr"}>

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
                        {t("publicHome.hero.badge")}
                    </span>

                    <h1>
                        {t("publicHome.hero.hamasgeria")}
                    </h1>

                    <p>
                        {t("publicHome.hero.description")}
                    </p>

                    <div className="public-hero-actions">

                        <button
                            className="primary-btn"
                            onClick={() =>
                                navigate("/customer-register")
                            }
                        >
                            {t("publicHome.hero.joinNow")}
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() =>
                                navigate("/customer-login")
                            }
                        >
                            {t("publicHome.hero.customerLogin")}
                        </button>

                        <button
                            className="employee-btn"
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            {t("publicHome.hero.employeeLogin")}
                        </button>

                    </div>

                </div>

            </section>


            <section className="public-section">

                <div className="public-section-header">

                    {/* <span>WHAT'S NEXT</span> */}

                    <h2>
                        <span>{t("publicHome.events.next")}</span>
                    </h2>

                    <p>
                        {t("publicHome.events.description")}
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

                                    <span
                                        className={`event-status event-status-${event.eventStatus}`}
                                    >
                                        {t(`events.status.${event.eventStatus}`)}
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
                                            {t("publicHome.events.defaultLocation")}
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
                                                {t("events.regularPrice")}
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
                                                    {t("events.vipPrice")} ⭐
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
                                            {t("publicHome.events.soldOut")}
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
                                            {t("publicHome.events.loginToOrder")}
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

                    <div className="benefit-icon" onClick={() => navigate(`/customer-login`)}>
                        ⭐
                    </div>

                    <h3>
                        {t("publicHome.benefits.vip.title")}
                    </h3>

                    <p>
                        {t("publicHome.benefits.vip.description")}
                    </p>

                </div>


                <div className="benefit-card" >

                    <div className="benefit-icon" onClick={() => navigate(`/customer-login`)}>
                        🎟️
                    </div>

                    <h3>
                        {t("publicHome.benefits.events.title")}
                    </h3>

                    <p>
                        {t("publicHome.benefits.events.description")}
                    </p>

                </div>


                <div className="benefit-card">

                    <div className="benefit-icon" onClick={() => navigate(`/customer-login`)}>
                        🍺
                    </div>

                    <h3>
                        {t("publicHome.benefits.experience.title")}
                    </h3>

                    <p>
                        {t("publicHome.benefits.experience.description")}
                    </p>

                </div>

            </section>


            <section className="public-cta">

                <div>

                    <span>
                        <span>{t("publicHome.cta.badge")}</span>
                    </span>

                    <h2>
                        {t("publicHome.cta.title")}
                    </h2>

                    <p>
                        {t("publicHome.cta.description")}
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate("/customer-register")
                    }
                >
                    {t("publicHome.cta.createAccount")}
                </button>

            </section>

        </main>
    );
}