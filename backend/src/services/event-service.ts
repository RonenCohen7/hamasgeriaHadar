import { OkPacketParams } from "mysql2";
import { ResourceNotFoundError } from "../models/client-errors";
import { EventModel } from "../models/event-model";
import { dal } from "../utils/dal";

class EventService {
    //Get All Events
    public async getAllEvents(): Promise<EventModel[]> {
        const sql = `
            SELECT
                e.id_event AS idEvent,
                e.event_name As eventName,
                e.event_description As eventDescription,
                e.event_start AS eventStart,
                e.event_end As eventEnd,
                e.event_location AS eventLocation,
                e.maximum_guests AS maximumGuests,
                e.expected_guests AS expectedGuests,
                e.actual_guests AS actualGuests,
                e.ticket_price AS ticketPrice,
                e.event_status AS eventStatus,
                e.created_by AS createdBy,
                e.created_at AS createdAt,
                e.updated_at AS updatedAt,
                u.full_name AS createdByName
            FROM events AS e
            JOIN users AS u
                ON e.created_by = u.id_user
            ORDER BY e.event_start DESC
        `;
        const events = await dal.execute(sql) as EventModel[];
        return events;

    }

    //Get One Event
    public async getOneEvent(id: number): Promise<EventModel> {
        const sql = `
            SELECT 
                e.id_event AS idEvent,
                e.event_name AS eventName,
                e.event_description AS eventDescription,
                e.event_start AS eventStart,
                e.event_end AS eventEnd,
                e.event_location AS eventLocation,
                e.maximum_guests AS maximumGuests,
                e.expected_guests AS expectedGuests,
                e.actual_guests AS actualGuests,
                e.ticket_price AS ticketPrice,
                e.event_status AS eventStatus,
                e.created_by AS createdBy,
                e.created_at AS createdAt,
                e.updated_at AS updatedAt,
                u.full_name AS createdByName
            FROM events AS e
            JOIN users AS u
                ON e.created_by = u.id_user
            WHERE e.id_event = ?
        `;
        const values = [id];

        const events = await dal.execute(sql,values) as EventModel[];
        const event = events[0];
        if(!event){
            throw new ResourceNotFoundError(id);
        }
        return event;
    }

    //Add new Event
    public async addEvent(event:EventModel):Promise<EventModel>{
        
        const sql = `
            INSERT INTO events (
                event_name,
                event_description,
                event_start,
                event_end,
                event_location,
                maximum_guests,
                expected_guests,
                actual_guests,
                ticket_price,
                event_status,
                created_by
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
        const values = [
            event.eventName,
            event.eventDescription,
            event.eventStart,
            event.eventEnd,
            event.eventLocation,
            event.maximumGuests,
            event.expectedGuests,
            event.actualGuests,
            event.ticketPrice,
            event.eventStatus,
            event.createdBy
        ];
        const info = await dal.execute(sql,values) as OkPacketParams;
        event.idEvent = info.insertId!
        
        return event   
    }
      // Update event:
    public async updateEvent(event: EventModel): Promise<EventModel> {

        const sql = `
            UPDATE events
            SET
                event_name = ?,
                event_description = ?,
                event_start = ?,
                event_end = ?,
                event_location = ?,
                maximum_guests = ?,
                expected_guests = ?,
                actual_guests = ?,
                ticket_price = ?,
                event_status = ?
            WHERE id_event = ?
        `;

        const values = [
            event.eventName,
            event.eventDescription,
            event.eventStart,
            event.eventEnd,
            event.eventLocation,
            event.maximumGuests,
            event.expectedGuests,
            event.actualGuests,
            event.ticketPrice,
            event.eventStatus,
            event.idEvent
        ];

        const info =
            await dal.execute(sql, values) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(event.idEvent);
        }

        return event;
    }


    // Delete event:
    public async deleteEvent(id: number): Promise<void> {

        const sql = `
            DELETE FROM events
            WHERE id_event = ?
        `;

        const values = [id];

        const info =
            await dal.execute(sql, values) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(id);
        }
    }

}


export const eventService = new EventService();
