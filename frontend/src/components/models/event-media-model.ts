

export type EventMediaType = 
    "image" | "video";


export interface EventMediaModel {

    idMedia: number;

    idEvent: number;

    fileName: string;

    mediaType: EventMediaType;

    title: string | null;

    description: string | null;

    isCover: boolean;

    displayOrder: number;

    createAt: string;

    mediaUrl: string;

}


export interface AddEventMediaModel{

    title? :string;
    
    description?: string;

    isCover?: boolean;

    displayOrder?:number;

    file: File;

}


export interface UpdateEventMediaModel {
    title?: string | null;

    description?: string | null;

    displayOrder?: number;

    isCover?: boolean;
}