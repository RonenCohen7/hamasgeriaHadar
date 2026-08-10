import { useNavigate } from "react-router-dom";
import { useTitle } from "../../utils/UseTitle";
import "./add-event.css";
import { useState } from "react";
import { notificationService } from "../../service/notificationService";
import { eventService } from "../../service/eventService";
import { EventModel } from "../../models/event-model";





export function AddEvent() {
    useTitle("Add Event")
    const navigate = useNavigate();


    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventStart, setEventStart] = useState("");
    const [eventEnd, setEvntEnd] = useState("");
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
                    <span>Event MANAGEMENT</span>

                    <h1>Add Event</h1>

                    <p>Create a new event for Hadar Pub</p>
                </div>
            </header>


            <div className="add-event-layout">
                {/*FORM*/}

                <div className="add-event-form"></div>
                <div className="form-group"></div>

                <label>Event Name</label>

                <input
                    type="text"
                    value={eventName}
                    placeholder="Example: Whisky Tasting Night"
                    onChange={e => setEventName(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    value={eventDescription}
                    placeholder="Event Description"
                    onChange={e => setEventDescription(e.target.value)}
                />
            </div>

            <div className="form-row">

                <div className="form-group">

                    <label>Start</label>

                    <input
                        type="datetime-local"
                        value={eventStart}
                        onChange={e => setEventStart(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>End</label>
                    <input
                        type="datetime-local"
                        value={eventEnd}
                        onChange={e => setEvntEnd(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Location</label>
                    <input
                        type="text"
                        value={eventLocation}
                        placeholder="Hadar Pub"
                        onChange={e => setEventLocation(e.target.value)}
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Maximum Guests</label>
                        <input
                            type="number"
                            min="0"
                            value={maximumGuests}
                            onChange={e => setMaximumGuests(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Excepted Guests</label>
                        <input
                            type="number"
                            min="0"
                            value={exceptedGuests}
                            onChange={e => setExceptedGuests(e.target.value)}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Ticket Price</label>
                            <input
                                type="number"
                                min="0"
                                value={ticketPrice}
                                onChange={e => setTicketPrice(e.target.value)}
                            />
                        </div>

                        <div className="from-group">
                            <label>Status</label>
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
                        <label>Cover Image</label>
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
                            onClick={() => navigate(".events")}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="save-button"
                            disabled={isSaving}
                            onClick={addEvent}
                        >
                            {isSaving ? "Saving" : "Create Event"}

                        </button>
                    </div>
                </div>

                {/*========Preview========*/}
                <aside className="event-cover-preview">
                    <h3>Event Cover</h3>
                    {preview ? (
                        <img
                            src={preview} 
                            alt="Event Preview"
                            />
                    ):(
                        <div className="empty-cover">
                            🎭
                            <span>
                                Select an event image
                            </span>
                        </div>   
                    )}

                </aside>
            </div>

        </section>
    );
}
