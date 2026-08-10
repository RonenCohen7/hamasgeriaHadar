import axios from "axios";
import { appConfig } from "../utils/app-config";
import { EventModel } from "../models/event-model";

class EventService {

    //Get Event Count
    public async getEventCount(): Promise<number> {
        const response = await axios.get<number>(`${appConfig.baseUrl}event-count`);
        return response.data;
    }


    //Get Upcoming event
    public async getUpcomingEvents(): Promise<EventModel[]> {
        const response = await axios.get<EventModel[]>(appConfig.eventsUpcomingUrl)
        return response.data;
    }




    //Get All Event
    public async getAllEvents(): Promise<EventModel[]> {
        const response = await axios.get<EventModel[]>(appConfig.eventsUrl);
        return response.data;
    }



    //Get One Event
    public async getOneEvent(idEvent: number): Promise<EventModel> {
        const response = await axios.get<EventModel>(`${appConfig.eventsUrl}/${idEvent}`);
        return response.data;
    }


    //Update event
    public async updateEvent(event: EventModel, image?: File): Promise<EventModel> {
        const formData = new FormData()

        formData.append("eventName", event.eventName);
        formData.append("eventDescription", event.eventDescription ?? "");
        formData.append("eventStart", event.eventStart);
        formData.append("eventEnd", event.eventEnd);
        formData.append("eventLocation", event.eventLocation ?? "");
        formData.append("maximumGuests", String(event.maximumGuests ?? ""));
        formData.append("exceptedGuests", String(event.expectedGuests ?? ""));
        formData.append("ticketPrice", String(event.ticketPrice ?? 0));
        formData.append("eventStatus", event.eventStatus);

        if (image) {
            formData.append("image", image)
        }

        const response = await axios.put<EventModel>(`${appConfig.eventsUrl}/${event.idEvent}`, formData);
        return response.data;
    }



    //Add event
    public async addEvent(event: EventModel, image?: File): Promise<EventModel> {
        const formData = new FormData();

        formData.append("eventName", event.eventName);
        formData.append("eventDescription", event.eventDescription ?? "");
        formData.append("eventStart", event.eventStart);
        formData.append("eventEnd", event.eventEnd);
        formData.append("eventLocation", event.eventLocation ?? "");
        formData.append("maximumGuests", String(event.maximumGuests ?? ""));
        formData.append("expectedGuests", String(event.expectedGuests ?? ""));
        formData.append("ticketPrice", String(event.ticketPrice ?? 0));
        formData.append("eventStatus", event.eventStatus);

        if (image) {
            formData.append("image", image)
        }

        const response = await axios.post<EventModel>(appConfig.eventsUrl, formData);

        return response.data;

    }


    //Delete event
    public async deleteEvent(idEvent: number): Promise<void> {
        await axios.delete(`${appConfig.eventsUrl}/${idEvent}`);
    }
}

export const eventService = new EventService();