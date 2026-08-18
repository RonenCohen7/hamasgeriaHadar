import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import type { RootState } from "../../redux/inventory-store";
import "./customer-dashboard.css";
import { useEffect, useState } from "react";
import { EventModel } from "../../models/event-model";
import { useTitle } from "../../utils/UseTitle";
import { eventService } from "../../service/eventService";
import { useTranslation } from "react-i18next";

export function CustomerDashboard() {

    const { t, i18n } = useTranslation();

    const isHebrew = i18n.language === "he";

    useTitle(t("customerDashboard.pageTitle"))

    const navigate = useNavigate()


    const [events, setEvents] = useState<EventModel[]>([]);

    const customer = useSelector(
        (state: RootState) => state.customerAuth.customer
    );

    if (!customer) {
        return <Navigate to="/customer-login" replace />;
    }



    useEffect(() => {

        eventService
            .getUpcomingEvents()
            .then(result => {

                console.log("UPCOMING EVENTS FROM SERVER:", result);

                setEvents(result);
            })
            .catch(console.error);


    }, []);




    return (

        <section
            className="customer-dashboard"
            dir={isHebrew ? "rtl" : "ltr"}
        >

            <header className="customer-dashboard-header">

                <div>

                    <span className="dashboard-welcome">
                        {t("customerDashboard.portal")}
                    </span>

                    <h1>
                        {t("customerDashboard.welcome")} {customer.firstName} 👋
                    </h1>

                    <p>
                        {t("customerDashboard.description")}
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
                        ? t("customerDashboard.vipMember")
                        : t("customerDashboard.guestCustomer")}
                </span>

            </header>


            <section className="dashboard-section">

                <div className="dashboard-section-header">

                    <div>

                        <span>
                            {t("customerDashboard.offers.eyebrow")}
                        </span>

                        <h2>
                            {t("customerDashboard.offers.title")}
                        </h2>

                    </div>

                </div>


                <div className="dashboard-offers-grid">


                    <article className="dashboard-offer-card">

                        <span className="dashboard-offer-icon">
                            🍺
                        </span>

                        <h3>
                            {t("customerDashboard.offers.happyHour.title")}
                        </h3>

                        <p>
                            {t("customerDashboard.offers.happyHour.description")}
                        </p>

                    </article>


                    <article className="dashboard-offer-card">

                        <span className="dashboard-offer-icon">
                            🥃
                        </span>

                        <h3>
                            {t("customerDashboard.offers.vipTasting.title")}
                        </h3>

                        <p>
                            {t("customerDashboard.offers.vipTasting.description")}
                        </p>

                    </article>


                    <article className="dashboard-offer-card">

                        <span className="dashboard-offer-icon">
                            🎂
                        </span>

                        <h3>
                            {t("customerDashboard.offers.birthday.title")}
                        </h3>

                        <p>
                            {t("customerDashboard.offers.birthday.description")}
                        </p>

                    </article>

                </div>

            </section>


            <section className="dashboard-section">

                <div className="dashboard-section-header">

                    <div>

                        <span>
                            {t("customerDashboard.events.eyebrow")}
                        </span>

                        <h2>
                            {t("customerDashboard.events.title")}
                        </h2>

                    </div>

                </div>


                <div className="dashboard-events-grid">

                    {events.map(event => {

                        const eventDate = new Date(event.eventStart);

                        const eventTime = eventDate.toLocaleTimeString(
                            isHebrew ? "he-IL" : "en-US",
                            {
                                hour: "2-digit",
                                minute: "2-digit"
                            }
                        );


                        return (

                            <article
                                onClick={() =>
                                    navigate(
                                        `/events/details/${event.idEvent}`
                                    )
                                }
                                key={event.idEvent}
                                className="dashboard-event-card"
                            >

                                {event.coverImageUrl && (

                                    <img
                                        src={event.coverImageUrl}
                                        alt={event.eventName}
                                        className="customer-event-cover"
                                    />

                                )}


                                <div className="dashboard-event-date">

                                    <strong>
                                        {eventDate.getDate()}
                                    </strong>

                                    <span>
                                        {eventDate
                                            .toLocaleString(
                                                isHebrew
                                                    ? "he-IL"
                                                    : "en-US",
                                                {
                                                    month: "short"
                                                }
                                            )
                                            .toUpperCase()}
                                    </span>

                                </div>


                                <div className="dashboard-event-content">

                                    <div className="dashboard-event-main">

                                        <h3>
                                            {event.eventName}
                                        </h3>


                                        {event.eventDescription && (

                                            <p className="dashboard-event-description">
                                                {event.eventDescription}
                                            </p>

                                        )}


                                        <div className="dashboard-event-meta">

                                            <span>
                                                🕒 {eventTime}
                                            </span>


                                            {event.eventLocation && (

                                                <span>
                                                    📍 {event.eventLocation}
                                                </span>

                                            )}

                                        </div>

                                    </div>


                                    <div className="dashboard-event-price">

                                        {Number(event.ticketPrice) > 0
                                            ? `₪${Number(event.ticketPrice).toFixed(2)}`
                                            : t("customerDashboard.events.freeEntry")}

                                    </div>


                                    <div>

                                        {event.vipPrice != null && (

                                            <span className="vip-price">
                                                ⭐️ VIP ₪{Number(event.vipPrice).toFixed(2)}
                                            </span>

                                        )}

                                    </div>

                                </div>

                            </article>

                        );

                    })}


                    <article className="dashboard-event-card">

                        <div className="dashboard-event-date">

                            <strong>
                                18
                            </strong>

                            <span>
                                {t("customerDashboard.events.aug")}
                            </span>

                        </div>


                        <div>

                            <h3>
                                {t("customerDashboard.events.whisky.title")}
                            </h3>

                            <p>
                                {t("customerDashboard.events.whisky.description")}
                            </p>

                        </div>

                    </article>


                    <article className="dashboard-event-card">

                        <div className="dashboard-event-date">

                            <strong>
                                25
                            </strong>

                            <span>
                                {t("customerDashboard.events.aug")}
                            </span>

                        </div>


                        <div>

                            <h3>
                                {t("customerDashboard.events.liveMusic.title")}
                            </h3>

                            <p>
                                {t("customerDashboard.events.liveMusic.description")}
                            </p>

                        </div>

                    </article>

                </div>

            </section>


            <section className="dashboard-section">

                <div className="dashboard-section-header">

                    <div>

                        <span>
                            {t("customerDashboard.experiences.eyebrow")}
                        </span>

                        <h2>
                            {t("customerDashboard.experiences.title")}
                        </h2>

                    </div>

                </div>


                <div className="dashboard-activities-grid">


                    <article
                        className="dashboard-activity-card"
                        onClick={() =>
                            navigate("/experiences/cocktail")
                        }
                    >

                        <img
                            src="/src/assets/images/pubDrinks.jpg"
                            alt={t("customerDashboard.experiences.cocktail.alt")}
                        />


                        <div className="dashboard-activity-overlay">

                            <h3>
                                {t("customerDashboard.experiences.cocktail.title")}
                            </h3>

                            <p>
                                {t("customerDashboard.experiences.cocktail.description")}
                            </p>

                        </div>

                    </article>


                    <article
                        className="dashboard-activity-card"
                        onClick={() =>
                            navigate("/experiences/chef")
                        }
                    >

                        <img
                            src="/src/assets/images/vip-chef.jpg"
                            alt={t("customerDashboard.experiences.chef.alt")}
                        />


                        <div className="dashboard-activity-overlay">

                            <h3>
                                {t("customerDashboard.experiences.chef.title")}
                            </h3>

                            <p>
                                {t("customerDashboard.experiences.chef.description")}
                            </p>

                        </div>

                    </article>

                </div>

            </section>

        </section>

    );
}