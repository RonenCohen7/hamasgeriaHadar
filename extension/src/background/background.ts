import { API_BASE_URL } from "../config/api-config";
import { EventModel } from "../models/event-model";


const ALARM_NAME = "check-new-events";
const STORAGE_KEY = "knownEventIds"


console.log("Hadar Pub service worker loaded");




async function checkForNewEvents(): Promise<void> {
    try {

        const response = await fetch(
            `${API_BASE_URL}/api/events/upcoming`
        )

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }

        const events: EventModel[] = await response.json();

        const currentIds = events.map(event => event.idEvent);

        const stored = await chrome.storage.local.get(STORAGE_KEY);

        const knownIds = (stored[STORAGE_KEY] ?? []) as number[];


        //First run - save existing events without notification
        if (knownIds.length == 0) {
            await chrome.storage.local.set({
                [STORAGE_KEY]: currentIds
            })

            console.log("Initial events saved", currentIds);

            return;
        }


        const newEvents = events.filter(
            event => !knownIds.includes(event.idEvent)
        )

        if (newEvents.length > 0) {

            console.log("NEW EVENTS FOUND", newEvents);

            for (const event of newEvents) {


                await chrome.notifications.create(
                    `event- ${event.idEvent}`,
                    {
                        type: "basic",

                        iconUrl: chrome.runtime.getURL(
                            "dist/icons/icon128.png"
                        ),

                        title: "🍺 Hadar Pub - New Event 🎭",

                        message: `${event.eventName} - ₪ ${event.ticketPrice}`,

                        priority: 2
                    }
                )
            }

        }

        await chrome.storage.local.set({
            [STORAGE_KEY]: currentIds
        });

    } catch (error) {
        console.log("Filed checking new events", error);

    }
}

chrome.runtime.onInstalled.addListener(() => {

    console.log(
        "Hadar Pub extension installed"
    );

    chrome.alarms.create(ALARM_NAME, {
        periodInMinutes: 1
    })
    void checkForNewEvents()
});

chrome.runtime.onStartup.addListener(() => {
    void checkForNewEvents()
})

chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name == ALARM_NAME) {
        void checkForNewEvents();
    }
})

