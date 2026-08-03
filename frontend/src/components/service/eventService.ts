import axios from "axios";
import { appConfig } from "../utils/app-config";

class EventService {

    //Get Event Count
    public async getEventCount():Promise<number>{
        const response = await axios.get<number>(`${appConfig.baseUrl}event-count`);
        return response.data;
    }
}

export const eventService = new EventService();