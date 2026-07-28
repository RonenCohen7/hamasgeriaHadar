import express, { NextFunction, Request, Response } from "express"
import { eventInventoryService } from "../services/event-inventory-service";
import { EventInventoryModel } from "../models/event-inventory-model";


class EventInventoryController {

    public readonly router = express.Router();


    public constructor() {

        this.router.get("/api/events/inventory", this.getAllEventInventory);

        this.router.get("/api/events/:eventId/inventory", this.getInventoryByEvent);

        this.router.get("/api/events/inventory/:id", this.getOneEventInventory);

        this.router.post("/api/events/inventory", this.addEventInventory);

        this.router.put("/api/events/inventory/:id", this.updateEventInventory);

        this.router.delete("/api/events/inventory/:id", this.deleteEventInventory);

    }

    // GET /api/events/inventory
    private async getAllEventInventory(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const inventory = await eventInventoryService.getAllEventInventory();
            response.json(inventory);

        } catch (error) {
            next(error)
        }
    }

    // GET /api/events/inventory/:id
    private async getOneEventInventory(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const id = Number(request.params.id);

            const inventoryItem = await eventInventoryService.getOneEventInventory(id);
            response.json(inventoryItem);

        } catch (error) {
            next(error)
        }
    }


    //Get /api/event-inventory/event/:eventId
    private async getInventoryByEvent(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const eventId = Number(request.params.eventId);

            const inventory = await eventInventoryService.getInventoryByEvent(eventId);

            response.json(inventory);
        }
        catch (error) {
            next(error)
        }
    }


    // POST /api/event-inventory
    private async addEventInventory(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {

            const inventoryItem: EventInventoryModel = request.body;

            const addInventoryItem = await eventInventoryService.addEventInventory(inventoryItem);

            response.status(201).json(addInventoryItem);
        }
        catch (error) {
            next(error)
        }
    }



    //PUT /api/event-inventory/:id
    private async updateEventInventory(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {
            const id = Number(request.params.id);

            const inventoryItem: EventInventoryModel = request.body;

            inventoryItem.idEventInventory = id;

            const updateInventoryItem = await eventInventoryService.updateEventInventory(inventoryItem);

            response.json(updateInventoryItem);

        } catch (error) {
            next(error)
        }

    }



    //DELETE /api/event-inventory/:id
    private async deleteEventInventory(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {

            const id = Number(request.params.id);

            await eventInventoryService.deleteEventInventory(id);

            response.sendStatus(204);

        } catch (error) {
            next(error)
        }

    }

}

export const eventInventoryController = new EventInventoryController();