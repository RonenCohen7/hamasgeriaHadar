import express, { Request, Response, NextFunction } from "express";
import { eventService } from "../services/event-service";
import { EventModel } from "../models/event-model";


class EventController {

    public readonly router = express.Router();


    public constructor() {
        this.router.get("/api/events", this.getAllEvents);
        this.router.get("/api/events/:id", this.getOneEvent);
        
        this.router.post("/api/events", this.addEvent);
        this.router.put("/api/events/:id", this.updateEvent);

        this.router.delete("/api/events/:id", this.deleteEvent);


    }

    //Get all event = /api/events
    private async getAllEvents(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const events = await eventService.getAllEvents();
            response.json(events)

        } catch (err: any) {
            next(err)
        }
    }

    //Get Event by Id
    private async getOneEvent(request:Request, response:Response, next: NextFunction):Promise<void>{
        try{
            const id = Number(request.params.id);

            if(!Number.isInteger(id) || id <=0){
                response.status(400).json({ 
                    message: "Event must be a positive number"
                });
                return;
            }

            const event = await eventService.getOneEvent(id);

            response.json(event);

        }catch(err:any){
            next(err);
        }
    }

    //Add new event 
    private async addEvent(request:Request, response:Response, next:NextFunction):Promise<void>{
        try{
            const event: EventModel = request.body;

            const addEvent = await eventService.addEvent(event);

            response.status(201).json(addEvent);

        }catch(err:any){
            next(err)
        }
    }


    //Update Event
    private async updateEvent(request:Request, response:Response, next:NextFunction):Promise<void>{
        try{
            const id = Number(request.params.id);

            if(!Number.isInteger(id) || id <= 0){
                response.status(400).json({ message: "Event must be a positive number"});
            return    
            }
            const event:EventModel = request.body;

            event.idEvent = id;

            const updateEvent = await eventService.updateEvent(event);
            response.json(updateEvent);
            
        }catch(err:any){
            next(err)
        }
    }

    //DELETE event
    private async deleteEvent(request:Request, response:Response, next:NextFunction):Promise<void>{
        try{

            const id = Number(request.params.id);
            if(!Number.isInteger(id)|| id <=0){
                response.status(400).json({ message: "Event id must be a positive number"})
                return;
            }
            await eventService.deleteEvent(id);
            response.sendStatus(204);

        }catch(err: any){
            next(err)
        }
    }

}

export const eventController = new EventController();