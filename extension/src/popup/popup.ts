

import { API_BASE_URL } from "../config/api-config";
import type { EventModel } from "../models/event-model";
import pubDrinksImage from "../assets/pubDrinks.jpg"
import i18n, { i18nReady } from "../i18n/i18n";
import { changeLanguage } from "i18next";
import { log } from "node:console";

const statusElement = document.getElementById("status");
const eventsContainer = document.getElementById("event-container");
const appTitle = document.getElementById("app-title");
const eventsTitle = document.getElementById("events-title");

const langHeButton = document.getElementById("lang-he");
const langEnButton = document.getElementById("lang-en");




let currentEvents: EventModel[] = [];



const headerImage = document.getElementById("pub-header-image") as HTMLImageElement | null;

if (headerImage) {
    headerImage.src = pubDrinksImage;
}


function renderEvents(events: EventModel[]): void {
    if (!eventsContainer) return;

    eventsContainer.innerHTML = "";

    if (events.length == 0) {
        eventsContainer.textContent = i18n.t("events.noEvents")
        return;
    }

    events.forEach((event) => {
        const card = document.createElement("article");
        card.className = "event-card";

        if (event.coverImageUrl) {
            const image = document.createElement("img");

            image.src = event.coverImageUrl;
            image.alt = event.eventName;
            image.className = "event-image";

            card.appendChild(image)
        }

        const details = document.createElement("div");
        details.className = "event-details"


        const title = document.createElement("h3");
        title.textContent = event.eventName;

        const date = document.createElement("p");
        date.textContent = new Date(event.eventStart).toLocaleDateString("he-IL");

        const location = document.createElement("p");

        const eventLocation = event.eventLocation == "Hadar Pub" ? "Hamasgeria" : event.eventLocation;

        location.textContent = eventLocation
            ? `${i18n.t("events.location")}: ${eventLocation}`
            : i18n.t("events.noLocation");

        const price = document.createElement("p");
        price.textContent = `${i18n.t("events.regularPrice")} :₪ ${event.ticketPrice}`

        const orderButton = document.createElement("button");
        orderButton.type = "button";
        orderButton.className = "event-order-button";
        orderButton.textContent = i18n.t("order.tickets");

        orderButton.dataset.eventId = event.idEvent.toString();
        orderButton.addEventListener("click", () => {
            const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
            chrome.tabs.create({
                url: `${frontendUrl}/customer-login?eventId=${event.idEvent}`
            })

        })

        details.append(title, date, location, price, orderButton);
        eventsContainer.appendChild(card)

        card.appendChild(details);
    })
}

async function loadUpcomingEvents(): Promise<void> {
    try {

        const response = await fetch(`${API_BASE_URL}/api/events/upcoming`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const events: EventModel[] = await response.json();

        currentEvents = events;

        console.log("Upcoming events", events);

        if (statusElement) {
            statusElement.textContent = i18n.t("events.found", { count: events.length });
        }

        renderEvents(events);

    }
    catch (error) {
        console.log("Failed to load events", error);

        if (statusElement) {
            statusElement.textContent = i18n.t("events.loadError");
        }

    }


    async function changeLanguage(language: "he" | "en"): Promise<void> {

        await i18n.changeLanguage(language);

        document.documentElement.lang = language;
        document.documentElement.dir = language == "he" ? "rtl" : "ltr";

        langEnButton?.classList.toggle("active", language == "he");
        langHeButton?.classList.toggle("active", language == "en");



        if (appTitle) {
            appTitle.textContent = i18n.t("app.title");
        }

        if (eventsTitle) {
            eventsTitle.textContent = i18n.t("events.upcoming");
        }

        if (statusElement) {
            statusElement.textContent = i18n.t("events.found", {
                count: currentEvents.length
            })
        }


        renderEvents(currentEvents);
    }

    langHeButton?.addEventListener("click", () => {
        void changeLanguage("he")
    })

    langEnButton?.addEventListener("click", () => {
        void changeLanguage("en");
    })




}
async function initPopup(): Promise<void> {
    await i18nReady;

    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language == "he" ? "rtl" : "ltr";

    if (appTitle) {
        appTitle.textContent = i18n.t("app.title");
    }

    if (eventsTitle) {
        eventsTitle.textContent = i18n.t("events.upcoming");
    }

    await loadUpcomingEvents();
}


void initPopup();





