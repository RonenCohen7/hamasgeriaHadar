import { useNavigate } from "react-router-dom";
import { useTitle } from "../../utils/UseTitle";
import "./add-event.css";
import { useState } from "react";
import { notificationService } from "../../service/notificationService";
import { eventService } from "../../service/eventService";
import { EventModel } from "../../models/event-model";
import { useTranslation } from "react-i18next";




export function AddEvent() {
    const { t } = useTranslation();
    useTitle("Add Event")
    const navigate = useNavigate();


    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventStart, setEventStart] = useState("");
    const [eventEnd, setEventEnd] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [maximumGuests, setMaximumGuests] = useState("");
    const [exceptedGuests, setExceptedGuests] = useState("");
    const [ticketPrice, setTicketPrice] = useState("");
    const [eventStatus, setEventStatus] = useState("planned");

    const [image, setImage] = useState<File | undefined>();
    const [preview, setPreview] = useState<string | null>(null);

    const [isSaving, setIsSaving] = useState(false);




    function selectImage(file?: File) {

        setImage(file)

        if (!file) {
            setPreview(null);
            return;
        }
        setPreview(URL.createObjectURL(file))
    }



    async function addEvent() {
        if (!eventName.trim()) {
            notificationService.error("Event Name is required");
            return
        }

        if (!eventStart) {
            notificationService.error("Event start date is required");
            return;
        }

        try {
            setIsSaving(true)

            const event = new EventModel();
            event.eventName = eventName.trim();
            event.eventDescription = eventDescription.trim();

            event.eventStart = eventStart;
            event.eventEnd = eventEnd;

            event.eventLocation = eventLocation?.trim() || null;

            event.maximumGuests = maximumGuests ? Number(maximumGuests) : null;

            event.expectedGuests = exceptedGuests ? Number(exceptedGuests) : null;

            event.ticketPrice = ticketPrice ? Number(ticketPrice) : 0;

            event.eventStatus = eventStatus;


            await eventService.addEvent(event, image);

            notificationService.success("Event Add successfully")

            navigate("/events");

        } catch (err: any) {
            notificationService.error("Failed to Added event")
        }

        finally {
            setIsSaving(false);
        }
    }


    return (
        <section className="AddEvent">

            <header className="add-event-header">

                <div>
                    <span>{t("events.add.management")}</span>

                    <h1>{t("events.add.title")}</h1>

                    <p>{t("events.add.description")}</p>
                </div>
            </header>


            <div className="add-event-layout">
                {/*FORM*/}

                <div className="add-event-form"></div>
                <div className="form-group"></div>

                <label>{t("events.add.eventName")}</label>

                <input
                    type="text"
                    value={eventName}
                    placeholder={t("events.add.eventNamePlaceholder")}
                    onChange={e => setEventName(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>{t("events.add.description")}</label>
                <textarea
                    value={eventDescription}
                    placeholder={t("events.add.eventDescriptionPlaceholder")}
                    onChange={e => setEventDescription(e.target.value)}
                />
            </div>

            <div className="form-row">

                <div className="form-group">

                    <label>{t("events.add.start")}</label>

                    <input
                        type="datetime-local"
                        value={eventStart}
                        onChange={e => setEventStart(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>{t("events.add.end")}</label>
                    <input
                        type="datetime-local"
                        value={eventEnd}
                        onChange={e => setEventEnd(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>{t("events.add.location")}</label>
                    <input
                        type="text"
                        value={eventLocation}
                        placeholder={t("events.add.locationPlaceholder")}
                        onChange={e => setEventLocation(e.target.value)}
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>{t("events.add.maximumGuests")}</label>
                        <input
                            type="number"
                            min="0"
                            value={maximumGuests}
                            onChange={e => setMaximumGuests(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>{t("events.add.expectedGuests")}</label>
                        <input
                            type="number"
                            min="0"
                            value={exceptedGuests}
                            onChange={e => setExceptedGuests(e.target.value)}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>{t("events.add.ticketPrice")}</label>
                            <input
                                type="number"
                                min="0"
                                value={ticketPrice}
                                onChange={e => setTicketPrice(e.target.value)}
                            />
                        </div>

                        <div className="from-group">
                            <label>{t("events.add.status")}</label>
                            <select
                                value={eventStatus}
                                onChange={e => setEventStatus(e.target.value)}>

                                <option value="planned">Planned</option>
                                <option value="active">Active</option>
                                <option value="complete">Complete</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/*==================IMAGE=====================*/}
                    <div className="form-group">
                        <label>{t("events.add.coverImage")}</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => selectImage(e.target.files?.[0])}
                        />
                    </div>
                    <div className="add-event-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => navigate("/events")}
                        >
                            {t("events.add.cancel")}
                        </button>

                        <button
                            type="button"
                            className="save-button"
                            disabled={isSaving}
                            onClick={addEvent}
                        >
                            {isSaving
                                ? t("events.add.saving")
                                : t("events.add.createEvent")}

                        </button>
                    </div>
                </div>

                {/*========Preview========*/}
                <aside className="event-cover-preview">
                    <h3>{t("events.add.eventCover")}</h3>
                    {preview ? (
                        <img
                            src={preview}
                            alt="Event Preview"
                        />
                    ) : (
                        <div className="empty-cover">
                            🎭
                            <span>
                                {t("events.add.selectImage")}
                            </span>
                        </div>
                    )}

                </aside>
            </div>

        </section>
    );
}
