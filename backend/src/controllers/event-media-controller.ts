

import express, { Request, Response, NextFunction } from "express"
import { eventMediaService } from "../services/event-media-service";
import { AddEventMediaDto, UploadEventMediaDto } from "../models/event-media-model";
import { UploadedFile } from "express-fileupload";
import { eventInventoryService } from "../services/event-inventory-service";

class EventMediaController {

    public readonly router = express.Router();


    public constructor() {

        this.router.get("/api/events/:idEvent/media", this.getMediaByEvent)

        this.router.post("/api/events/:idEvent/media", this.addMedia);

        this.router.patch("/api/events/:idEvent/media/:idMedia/cover", this.setCover);

        this.router.delete("/api/events/media/:idMedia", this.deleteMedia);

        this.router.patch("/api/events/:idEvent/media/:idMedia", this.updateMedia);


    }


    //Get Media by Event Id
    private async getMediaByEvent(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const idEvent = Number(request.params.idEvent);

            if (!Number.isInteger(idEvent) || idEvent <= 0) {
                response.status(400).json({
                    message: "Id must be a positive number"
                })
                return
            }
            const media =
                await eventMediaService.getMediaByEventId(idEvent);
            response.json(media);

        } catch (err: any) {
            next(err)
        }
    }


    //Add Media
    private async addMedia(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const idEvent = Number(request.params.idEvent);

            if (!Number.isInteger(idEvent) || idEvent <= 0) {
                response.status(400).json({
                    message: "Id Must Be A positive number"
                })
                return;
            }
            const media: AddEventMediaDto = {
                idEvent,

                title:
                    request.body.title ?? null,

                description:
                    request.body.description ?? null,

                isCover:
                    request.body.isCover === "true" ||
                    request.body.isCover === true,

                displayOrder:
                    request.body.displayOrder ?? 0,
            }

            if (request.files?.file) {
                media.file =
                    request.files.file as UploadedFile;
            }

            const addMedia =
                await eventMediaService.addMedia(media)

            response.status(201).json(addMedia)

        } catch (err) {
            next(err);
        }
    }

    //Set Cover
    private async setCover(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const idEvent = Number(request.params.idEvent)

            const idMedia = Number(request.params.idMedia)

            if (!Number.isInteger(idEvent) || idEvent <= 0 ||
                !Number.isInteger(idMedia) || idMedia <= 0) {
                response.status(400).json({
                    message: "Invalid event or media id"
                })
                return;
            }


            const media = await eventMediaService
                .setCover(
                    idEvent,
                    idMedia
                )
            response.json(media)


        } catch (err) {
            next(err)
        }



    }


    // Update event media

    // Update media metadata
    private async updateMedia(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {

            const idEvent =
                Number(request.params.idEvent);

            const idMedia =
                Number(request.params.idMedia);


            if (
                !Number.isInteger(idEvent) ||
                idEvent <= 0 ||
                !Number.isInteger(idMedia) ||
                idMedia <= 0
            ) {

                response.status(400).json({
                    message:
                        "Event id and media id must be positive numbers"
                });

                return;
            }


            const media: UploadEventMediaDto = {

                idEvent,
                idMedia,

                title:
                    request.body.title ??
                    null,

                description:
                    request.body.description ??
                    null,

                displayOrder:
                    request.body.displayOrder !== undefined
                        ? Number(request.body.displayOrder)
                        : undefined,

                isCover:
                    request.body.isCover !== undefined
                        ? request.body.isCover === true ||
                        request.body.isCover === "true"
                        : undefined
            };


            const updatedMedia =
                await eventMediaService.updateMedia(
                    idEvent,
                    idMedia,
                    media
                );


            response.json(
                updatedMedia
            );

        } catch (err) {

            next(err);
        }
    }









    //Delete media
    private async deleteMedia(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {


            const idMedia = Number(request.params.idMedia);

            if (!Number.isInteger(idMedia) || idMedia <= 0) {
                response.status(400).json({
                    message: "Id Must Be a positive number"
                })
                return;
            }
            await eventMediaService.deleteMedia(idMedia);

            response.sendStatus(204);

        } catch (err) {
            next(err)
        }
    }
}

export const eventMediaController = new EventMediaController();
