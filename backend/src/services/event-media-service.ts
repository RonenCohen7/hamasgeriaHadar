import { OkPacketParams } from "mysql2";
import { AddEventMediaDto, EventMediaModelDto, UploadEventMediaDto } from "../models/event-media-model";
import { dal } from "../utils/dal";




class EventMediaService {

    //Get All Media By id Event
    public async getMediaByEventId(idEvent: number): Promise<EventMediaModelDto[]> {

        const sql = `
            SELECT 
                id_media AS idMedia,
                id_event AS idEvent,
                file_name As fileName,
                media_type AS mediaType,
                title,
                description,
                is_cover AS isCover,
                display_order AS displayOrder,
                created_at AS createdAt
            FROM event_media
            WHERE id_event = ?
            ORDER BY 
                is_cover DESC,
                display_order ASC,
                id_media ASC
        `;

        const media =
            await dal.execute(
                sql,
                [idEvent]
            ) as EventMediaModelDto[];

        return media.map(item => ({
            ...item,

            isCover:
                Boolean(item.isCover),

            mediaUrl:
                this.getMediaUrl(item)
        }))
    }




    //Get One Media
    public async getOneMedia(idMedia: number): Promise<EventMediaModelDto | null> {

        const sql = `
            SELECT
                id_media AS idMedia,
                id_event AS idEvent,
                file_name AS fileName,
                media_type AS mediaType,
                title,
                description,
                is_cover AS isCover,
                display_order AS displayOrder,
                created_at  AS createdAt
            FROM event_media
            WHERE id_media = ? 
        `

        const media =
            await dal.execute(
                sql,
                [idMedia]
            ) as EventMediaModelDto[];

        if (media.length === 0) {
            return null;
        }

        const item = media[0];

        return {
            ...item,

            isCover:
                Boolean(item.isCover),

            mediaUrl:
                this.getMediaUrl(item)
        }

    }

    //Add media
    public async addMedia(media: AddEventMediaDto): Promise<EventMediaModelDto> {

        if (!media.file) {
            throw new Error(
                "Media file is required"
            )
        }

        //detect media type
        const mediaType =
            media.file.mimetype.startsWith("video/")
                ? "video"
                : "image";

        //Generate file name
        const extension =
            media.file.name.substring(media.file.name.lastIndexOf("."))

        const fileName =
            `${crypto.randomUUID()}${extension}`


        //Choose storage folder
        const folder =
            mediaType === "video"
                ? "storage/videos"
                : "storage/events"

        const fullPath =
            `${folder}/${fileName}`



        //Save physical file
        await media.file.mv(fullPath)



        //if new media os cove remove previous cover
        if (media.isCover) {
            await this.clearEventCover(media.idEvent);
        }


        //insert DB record
        const sql = `
            INSERT INTO event_media(
                id_event,
                file_name,
                media_type,
                title,
                description,
                is_cover,
                display_order
            )
            VALUES(?,?,?,?,?,?,?)
        `;

        const info =
            await dal.execute(
                sql,
                [
                    media.idEvent,
                    fileName,
                    mediaType,
                    media.title ?? null,
                    media.description ?? null,
                    media.isCover ? 1 : 0,
                    media.displayOrder ?? 0
                ]
            ) as OkPacketParams;



        //Return created media
        const createdMedia =
            await this.getOneMedia(
                Number(info.insertId)
            );

        if (!createdMedia) {
            throw new Error(
                "Failed to create event media"
            )
        }

        return createdMedia;
    }

    //Set media As Cover
    public async setCover(idEvent: number, idMedia: number): Promise<EventMediaModelDto> {

        const media =
            await this.getOneMedia(idMedia);

        if (!media) {
            throw new Error(
                "Media not Found"
            )
        }

        if (media.idEvent !== idEvent) {
            throw new Error(
                "Media dose not belong to this event"
            )
        }

        if(media.mediaType !== "image"){
            throw new Error(" Only an image can be used as event cover")
        }

        //Remove old cover
        await this.clearEventCover(
            idEvent
        );

        //Set new Cover
        const sql = `
            UPDATE event_media
            SET is_cover = 1
            WHERE id_media = ?
                AND id_event = ?
        `;

        await dal.execute(
            sql,
            [
                idMedia,
                idEvent
            ]
        );

        const updateMedia = 
            await this.getOneMedia(idMedia)

        if(!updateMedia){
            throw new Error("Failed to set event cover")
        }

        return updateMedia;
        
    }

    //Clear event cover
    private async clearEventCover(idEvent: number): Promise<void> {

        const sql = `
            UPDATE event_media
            SET is_cover = 0
            WHERE id_event = ?
        `;

        await dal.execute(sql, [idEvent]);
    }



    //update event media

    public async updateMedia(
    idEvent: number,
    idMedia: number,
    media: UploadEventMediaDto): Promise<EventMediaModelDto> {

    const existingMedia =
        await this.getOneMedia(idMedia);

    if (!existingMedia) {
        throw new Error("Media not found");
    }

    if (existingMedia.idEvent !== idEvent) {
        throw new Error(
            "Media does not belong to this event"
        );
    }

    const sql = `
        UPDATE event_media
        SET
            title = ?,
            description = ?,
            display_order = ?
        WHERE id_media = ?
        AND id_event = ?
    `;

    await dal.execute(
        sql,
        [
            media.title ?? null,
            media.description ?? null,
            media.displayOrder ?? 0,
            idMedia,
            idEvent
        ]
    );

    const updatedMedia =
        await this.getOneMedia(idMedia);

    if (!updatedMedia) {
        throw new Error(
            "Failed to update media"
        );
    }

    return updatedMedia;
}








    //Delete media
    public async deleteMedia(idMedia: number): Promise<void> {

        const media = await this.getOneMedia(idMedia)

        if (!media) {
            throw new Error(
                "Media not found"
            )
        }


        //delete DB record
        const sql = `
            DELETE FROM event_media
            WHERE id_media = ?
        `;

        const info =
            await dal.execute(
                sql,
                [idMedia]
            ) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new Error(
                "Media not found")
        }

        //Delete physical file
        const folder = 
            media.mediaType === "video"
            ? "storage/videos"
            : "storage/events"

        const fullpath = 
            `${folder}/${media.fileName}`

        try{

            const fs=
                await import(
                    "node:fs/promises"
                )

            await fs.unlink(
                fullpath
            )
        }
        catch(err:any){
            
            if(err.code !== "ENOENT"){
                console.error(
                    "Failed deleting media file", err)
            }
        }


    }

    // Build public media url
    private getMediaUrl(media:EventMediaModelDto):string{
        
        if(media.mediaType === "video"){
            return `/api/videos/${media.fileName}`;
        }
        return `/api/events/media/${media.fileName}`
    }


}


export const eventMediaService = new EventMediaService();