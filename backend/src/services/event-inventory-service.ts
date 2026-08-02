import { OkPacketParams } from "mysql2";
import { ResourceNotFoundError } from "../models/client-errors";
import { EventInventoryModel } from "../models/event-inventory-model";
import { dal } from "../utils/dal";


class EventInventoryService {


    // Get all event inventory records:
    public async getAllEventInventory(): Promise<EventInventoryModel[]> {

        const sql = `
            SELECT
                ei.id_event_inventory AS idEventInventory,
                ei.id_event AS idEvent,
                ei.id_product AS idProduct,
                ei.quantity_allocated AS quantityAllocated,
                ei.quantity_sold AS quantitySold,
                ei.quantity_returned AS quantityReturned,
                ei.created_at AS createdAt,
                ei.updated_at AS updatedAt,
                e.event_name AS eventName,
                ei.damaged_quantity AS damagedQuantity,
                p.product_name AS productName
            FROM event_inventory AS ei
            JOIN events AS e
                ON ei.id_event = e.id_event
            JOIN products AS p
                ON ei.id_product = p.id_product
            ORDER BY e.event_start DESC, p.product_name
        `;

        const inventory =
            await dal.execute(sql) as EventInventoryModel[];

        return inventory;
    }


    // Get one event inventory record:
    public async getOneEventInventory(
        id: number
    ): Promise<EventInventoryModel> {

        const sql = `
            SELECT
                ei.id_event_inventory AS idEventInventory,
                ei.id_event AS idEvent,
                ei.id_product AS idProduct,
                ei.quantity_allocated AS quantityAllocated,
                ei.quantity_sold AS quantitySold,
                ei.quantity_returned AS quantityReturned,
                ei.created_at AS createdAt,
                ei.updated_at AS updatedAt,
                ei.damaged_quantity AS damagedQuantity,
                e.event_name AS eventName,
                p.product_name AS productName
            FROM event_inventory AS ei
            JOIN events AS e
                ON ei.id_event = e.id_event
            JOIN products AS p
                ON ei.id_product = p.id_product
            WHERE ei.id_event_inventory = ?
        `;

        const values = [id];

        const inventory =
            await dal.execute(sql, values) as EventInventoryModel[];

        const inventoryItem = inventory[0];

        if (!inventoryItem) {
            throw new ResourceNotFoundError(id);
        }

        return inventoryItem;
    }


    // Get all inventory records by event:
    public async getInventoryByEvent(
        eventId: number
    ): Promise<EventInventoryModel[]> {

        const sql = `
            SELECT
                ei.id_event_inventory AS idEventInventory,
                ei.id_event AS idEvent,
                ei.id_product AS idProduct,
                ei.quantity_allocated AS quantityAllocated,
                ei.quantity_sold AS quantitySold,
                ei.quantity_returned AS quantityReturned,
                ei.created_at AS createdAt,
                ei.updated_at AS updatedAt,
                ei.damaged_quantity AS damagedQuantity,
                e.event_name AS eventName,
                p.product_name AS productName
            FROM event_inventory AS ei
            JOIN events AS e
                ON ei.id_event = e.id_event
            JOIN products AS p
                ON ei.id_product = p.id_product
            WHERE ei.id_event = ?
            ORDER BY p.product_name
        `;

        const values = [eventId];

        const inventory =
            await dal.execute(sql, values) as EventInventoryModel[];

        return inventory;
    }


    // Add new event inventory record:
    public async addEventInventory(
        inventoryItem: EventInventoryModel
    ): Promise<EventInventoryModel> {

        const sql = `
            INSERT INTO event_inventory(
                id_event,
                id_product,
                quantity_allocated,
                quantity_sold,
                quantity_returned,
                damaged_quantity
            )
            VALUES (?, ?, ?, ?, ?,?)
        `;

        const values = [
            inventoryItem.idEvent,
            inventoryItem.idProduct,
            inventoryItem.quantityAllocated,
            inventoryItem.quantitySold,
            inventoryItem.quantityReturned,
            inventoryItem.damagedQuantity ?? 0
        ];

        const info =
            await dal.execute(sql, values) as OkPacketParams;

        inventoryItem.idEventInventory = info.insertId!;

        return inventoryItem;
    }


    // Update event inventory record:
    public async updateEventInventory(
        inventoryItem: EventInventoryModel
    ): Promise<EventInventoryModel> {

        const sql = `
            UPDATE event_inventory
            SET
                id_event = ?,
                id_product = ?,
                quantity_allocated = ?,
                quantity_sold = ?,
                quantity_returned = ?,
                damaged_quantity = ?,
            WHERE id_event_inventory = ?
        `;

        const values = [
            inventoryItem.idEvent,
            inventoryItem.idProduct,
            inventoryItem.quantityAllocated,
            inventoryItem.quantitySold,
            inventoryItem.quantityReturned,
            inventoryItem.idEventInventory
            
        ];

        const info =
            await dal.execute(sql, values) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(
                inventoryItem.idEventInventory
            );
        }

        return inventoryItem;
    }


    // Delete event inventory record:
    public async deleteEventInventory(id: number): Promise<void> {

        const sql = `
            DELETE FROM event_inventory
            WHERE id_event_inventory = ?
        `;

        const values = [id];

        const info =
            await dal.execute(sql, values) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(id);
        }
    }

}


export const eventInventoryService = new EventInventoryService();