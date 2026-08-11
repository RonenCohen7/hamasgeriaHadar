import { OkPacketParams } from "mysql2";
import { ResourceNotFoundError } from "../models/client-errors";
import { AddEventDto, EventModel, UpdateEventDto } from "../models/event-model";
import { dal } from "../utils/dal";
import { sanitizeText } from "../utils/sanitize";
import { appConfig } from "../utils/app-config";
import { imageService } from "./image-service";
import { EventStatus } from "../models/enum";

class EventService {
    //Get All Events
    public async getAllEvents(): Promise<EventModel[]> {
        const sql = `
            SELECT
                e.id_event AS idEvent,
                e.event_name As eventName,
                e.event_description As eventDescription,
                e.cover_image AS coverImage,

                CASE
                    WHEN e.cover_image IS NOT NULL
                    THEN CONCAT(?,e.cover_image)
                    ELSE NULL
                END AS coverImageUrl,

                e.event_start AS eventStart,
                e.event_end As eventEnd,
                e.event_location AS eventLocation,
                e.maximum_guests AS maximumGuests,
                e.expected_guests AS expectedGuests,
                e.actual_guests AS actualGuests,
                e.ticket_price AS ticketPrice,
                e.vip_price AS vipPrice,
                e.event_status AS eventStatus,
                e.created_by AS createdBy,
                e.created_at AS createdAt,
                e.updated_at AS updatedAt,
                CONCAT(u.first_name, ' ', u.last_name) AS createdByName
            FROM events AS e
            JOIN users AS u
                ON e.created_by = u.id_user
            WHERE e.is_deleted = 0
            ORDER BY e.event_start DESC
        `;
        const events = await dal.execute(sql,
            [appConfig.baseEventImageUrl]
        ) as EventModel[];
        return events;

    }

    //Get One Event
    public async getOneEvent(id: number): Promise<EventModel> {


        const sql = `
            SELECT 
                e.id_event AS idEvent,
                e.event_name AS eventName,
                e.event_description AS eventDescription,
                e.cover_image AS coverImage,

                CASE
                    WHEN e.cover_image IS NOT NULL
                    THEN CONCAT(?, e.cover_image)
                    ELSE NULL
                END AS coverImageUrl,

                e.event_start AS eventStart,
                e.event_end AS eventEnd,
                e.event_location AS eventLocation,
                e.maximum_guests AS maximumGuests,
                e.expected_guests AS expectedGuests,
                e.actual_guests AS actualGuests,
                e.ticket_price AS ticketPrice,
                e.vip_price As vipPrice,
                e.event_status AS eventStatus,
                e.created_by AS createdBy,
                e.created_at AS createdAt,
                e.updated_at AS updatedAt,
                CONCAT(u.first_name, ' ', u.last_name) AS createdByName
            FROM events AS e
            JOIN users AS u
                ON e.created_by = u.id_user
            WHERE e.id_event = ?
        `;
        const values = [appConfig.baseEventImageUrl, id];

        const events = await dal.execute(sql, values) as EventModel[];
        const event = events[0];
        if (!event) {
            throw new ResourceNotFoundError(id);
        }
        return event;
    }

    //Add new Event
    public async addEvent(event: AddEventDto): Promise<AddEventDto> {
        event.eventName = sanitizeText(event.eventName);
        event.eventDescription = sanitizeText(event.eventDescription);
        event.eventLocation = sanitizeText(event.eventLocation);

        if (event.image) {
            event.coverImage = await imageService.saveEventImage({
                originalname: event.image.name,
                buffer: event.image.data
            });

        }

        const sql = `   
            INSERT INTO events (
                event_name,
                event_description,
                cover_image,
                event_start,
                event_end,
                event_location,
                maximum_guests,
                expected_guests,
                actual_guests,
                ticket_price,
                vip_price,
                event_status,
                created_by
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)
        `
        const values = [
            event.eventName,
            event.eventDescription ?? null,
            event.coverImage ?? null,
            event.eventStart,
            event.eventEnd ?? null,
            event.eventLocation ?? null,
            event.maximumGuests ?? null,
            event.expectedGuests ?? null,
            event.actualGuests ?? null,
            event.ticketPrice ?? 0,
            event.vipPrice ?? null,
            event.eventStatus ?? "planned",
            event.createdBy ?? 1
        ];
        const info = await dal.execute(sql, values) as OkPacketParams;
        event.idEvent = info.insertId!

        return event
    }
    // Update event:
    public async updateEvent(event: UpdateEventDto): Promise<EventModel> {

        const existingEvent = await this.getOneEvent(event.idEvent);

        event.eventName = sanitizeText(event.eventName);
        event.eventDescription = sanitizeText(event.eventDescription);
        event.eventLocation = sanitizeText(event.eventLocation);

        let coverImage = existingEvent.coverImage;

        if (event.image) {
            coverImage = await imageService.saveEventImage({
                originalname: event.image.name,
                buffer: event.image.data
            });
        }

        const sql = `
        UPDATE events
        SET
            event_name = ?,
            event_description = ?,
            cover_image = ?,
            event_start = ?,
            event_end = ?,
            event_location = ?,
            maximum_guests = ?,
            expected_guests = ?,
            ticket_price = ?,
            vip_price =?,
            event_status = ?
        WHERE id_event = ?
        AND id_delete = 0
    `;

        const values = [
            event.eventName ?? null,
            event.eventDescription ?? null,
            coverImage,
            event.eventStart ?? null,
            event.eventEnd ?? null,
            event.eventLocation ?? null,
            event.maximumGuests ?? null,
            event.expectedGuests ?? null,
            event.ticketPrice ?? 0,
            event.vipPrice ?? null,
            event.eventStatus ?? "planned",
            event.idEvent
        ];

        const info = await dal.execute(sql, values) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(event.idEvent!);
        }

        return await this.getOneEvent(event.idEvent!);
    }



    //Get upcoming active events for customers
    public async getUpcomingEvents(): Promise<EventModel[]> {
        const sql = `
            SELECT
                id_event AS idEvent,
                event_name AS eventName,
                event_description AS eventDescription,

                cover_image AS coverImage,

                CASE
                    WHEN cover_image IS NOT NULL
                    THEN CONCAT(?, cover_image)
                    ELSE NULL
                END AS coverImageUrl,

                event_start AS eventStart,
                event_end AS eventEnd,
                event_location AS eventLocation,
                maximum_guests AS maximumGuests,
                expected_guests AS expectedGuests,
                actual_guests AS actualGuests,
                ticket_price AS ticketPrice,
                vip_price As vipPrice,
                event_status AS eventStatus,
                created_by AS createdBy,
                created_at AS createdAt,
                updated_at AS updatedAt

            FROM events

            WHERE event_start >= NOW()
            AND event_status <> 'cancelled'
            AND is_deleted = 0

            ORDER BY event_start
        `;
        const events = await dal.execute(sql, [appConfig.baseEventImageUrl]) as EventModel[];

        return events;
    }




    // Delete event:
    public async deleteEvent(id: number): Promise<void> {

        const sql = `
            UPDATE events
            SET is_deleted = 1
            WHERE id_event = ?
            AND is_deleted = 0
        `;

        const values = [id];

        const info =
            await dal.execute(sql, values) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(id);
        }
    }




    //Get event Count
    public async getEventCount(): Promise<number> {
        const sql = `
            SELECT COUNT (*) AS count
            FROM events
        `;
        const result = await dal.execute(sql) as { count: number }[];
        return Number(result[0].count);
    }

}


export const eventService = new EventService();
