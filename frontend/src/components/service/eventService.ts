import axios from "axios";
import { appConfig } from "../utils/app-config";
import { EventModel } from "../models/event-model";

class EventService {

    //Get Event Count
    public async getEventCount():Promise<number>{
        const response = await axios.get<number>(`${appConfig.baseUrl}event-count`);
        return response.data;
    }


    //Get Upcoming event
    public async getUpcomingEvents():Promise<EventModel[]>{
        const response = await axios.get<EventModel[]>(appConfig.eventsUrl)
        return response.data;
    }
}

export const eventService = new EventService();