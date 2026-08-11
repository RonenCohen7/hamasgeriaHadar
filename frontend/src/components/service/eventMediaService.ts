import axios from "axios";
import type { AddEventMediaModel, EventMediaModel, UpdateEventMediaModel } from "../models/event-media-model";
import { appConfig } from "../utils/app-config";

class EventMediaService {


    //Get All media by event
    public async getMediaByEventId(idEvent: number): Promise<EventMediaModel[]> {

        const response = await axios.get<EventMediaModel[]>(`${appConfig.eventsUrl}/${idEvent}/media`)

        return response.data;

    }


    //Add media
    public async addMedia(idEvent: number, media: AddEventMediaModel): Promise<EventMediaModel> {

        const formData = new FormData();

        formData.append("file", media.file);

        if (media.title !== undefined) {
            formData.append("title", media.title);
        }

        if (media.description !== undefined) {
            formData.append("description", media.description);
        }

        if (media.isCover !== undefined) {
            formData.append("isCover", String(media.isCover));
        }

        if (media.displayOrder !== undefined) {
            formData.append("displayOrder", String(media.displayOrder))
        }

        const response =
            await axios.post<EventMediaModel>(`${appConfig.eventsUrl}/${idEvent}/media`, formData);

        return response.data;

    }


    //Update event media
    public async updateEventMedia(idEvent: number, idMedia: number, media: UpdateEventMediaModel): Promise<EventMediaModel> {

        const response = await axios.patch<EventMediaModel>(`${appConfig.eventsUrl}/${idEvent}/media/${idMedia}`, media);

        return response.data;

    }


    //Set media cover
    public async setCover(idEvent: number, idMedia: number): Promise<EventMediaModel> {
        const response = await axios.patch<EventMediaModel>(`${appConfig.eventsUrl}/${idEvent}/media/${idMedia}cover`);

        return response.data;
    }

    //Delete event
    public async deleteEvent(idMedia: number): Promise<void> {
        await axios.delete(`${appConfig.eventsUrl}/${idMedia}`)
    }

}


export const eventMediaService = new EventMediaService()