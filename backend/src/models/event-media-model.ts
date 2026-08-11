import { UploadedFile } from "express-fileupload";

export type EventMediaType =
    "image" | "video"

export class EventMediaModelDto {

    idMedia!:number;

    idEvent!: number;

    fileName!:string;

    mediaType!: EventMediaType;

    title!: string | null

    description?: string | null;

    isCover!: boolean;

    displayOrder!: number;

    createdAt!: string | null;


    file?: UploadedFile;

    mediaUrl?:string;

}


export interface AddEventMediaDto {
    idEvent: number;

    mediaType?: EventMediaType;

    title?: string | null;

    description: string | null;

    isCover? :boolean;

    displayOrder?: number;

    file?: UploadedFile;
}


export interface UploadEventMediaDto {

    idMedia: number;

    idEvent: number;

    mediaType?: EventMediaType;

    title?: string | null;

    description?: string | null;

    isCover?: boolean;

    displayOrder?: number;

    file?: UploadedFile;
}