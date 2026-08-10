import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import "./edit-event.css";

import { EventModel } from "../../models/event-model";
import { eventService } from "../../service/eventService";
import { notificationService } from "../../service/notificationService";
import { useTitle } from "../../utils/UseTitle";

export function EditEvent() {
    useTitle("Edit Event");

    const { idEvent } = useParams();
    const navigate = useNavigate();
    const eventId = Number(idEvent);


    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<EventModel>();
    const [event, setEvent] = useState<EventModel | null>(null);

    const [preview, setPreview] = useState<string | null>(null);



    useEffect(() => {

        if (!Number.isInteger(eventId) || eventId <= 0) {
            navigate("/events");
            return;
        }

        eventService
            .getOneEvent(eventId)
            .then(event => {
                setEvent(event)

                setPreview(event.coverImageUrl);

                reset({
                    ...event,

                    eventStart: event.eventStart
                        ? String(event.eventStart).slice(0, 16)
                        : "",

                    eventEnd: event.eventEnd
                        ? String(event.eventEnd).slice(0, 16)
                        : ""
                });
            })
            .catch(err => {
                console.error(err);
                notificationService.error(
                    "Failed to load event"
                );

                navigate("/events");
            });

    }, [eventId, reset]);


    useEffect(() => {
        return () => {
            if (preview?.startsWith("blob:")) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [preview]);

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        setPreview(currentPreview => {
            if (currentPreview?.startsWith("blob:")) {
                URL.revokeObjectURL(currentPreview)
            }
            return URL.createObjectURL(file)
        })
    }

    async function submit(event: EventModel) {

        try {

            event.idEvent = eventId;

            const imageFiles = event.image as unknown as FileList;

            let imageFile: File | undefined;

            if (imageFiles?.length > 0) {
                imageFile = imageFiles[0];

            }
            console.log("IMAGE FILE:", imageFile);
            console.log("EVENT TO UPDATE:", event);
            console.log("VIP PRICE:", event.vipPrice);
            console.log("IMAGE FILE:", imageFile);
            await eventService.updateEvent(
                event,
                imageFile
            );

            notificationService.success("Event update successfully");

            navigate("/events")


        } catch (err: any) {

            console.error("Update event error:", err);

            console.error("Server response:", err.response?.data);

            notificationService.error("Failed to update event");
        }
    }


    return (
        <section className="EditEvent">

            <div className="edit-event-page-header">
                <div>
                    <span className="edit-event-eyebrow">
                        Event Management
                    </span>

                    <h2>Edit Event</h2>
                </div>

                <button
                    type="button"
                    className="edit-event-back-button"
                    onClick={() => navigate("/events")}
                >
                    Back to Events
                </button>
            </div>


            <form
                className="edit-event-form"
                onSubmit={handleSubmit(submit)}
            >

                <div className="edit-event-field event-name">
                    <label>Event Name</label>

                    <input
                        type="text"
                        {...register("eventName", {
                            required: true
                        })}
                    />
                </div>


                <div className="edit-event-field description">
                    <label>Description</label>

                    <textarea
                        {...register("eventDescription")}
                    />
                </div>


                <div className="edit-event-field">
                    <label>Start</label>

                    <input
                        type="datetime-local"
                        {...register("eventStart", {
                            required: true
                        })}
                    />
                </div>


                <div className="edit-event-field">
                    <label>End</label>

                    <input
                        type="datetime-local"
                        {...register("eventEnd")}
                    />
                </div>


                <div className="edit-event-field">
                    <label>Location</label>

                    <input
                        type="text"
                        {...register("eventLocation")}
                    />
                </div>


                <div className="edit-event-field">
                    <label>Status</label>

                    <select
                        {...register("eventStatus")}
                    >
                        <option value="planned">
                            Planned
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="completed">
                            Completed
                        </option>

                        <option value="cancelled">
                            Cancelled
                        </option>
                    </select>
                </div>


                <div className="edit-event-field">
                    <label>Maximum Guests</label>

                    <input
                        type="number"
                        min="0"
                        {...register("maximumGuests", {
                            valueAsNumber: true
                        })}
                    />
                </div>


                <div className="edit-event-field">
                    <label>Expected Guests</label>

                    <input
                        type="number"
                        min="0"
                        {...register("expectedGuests", {
                            valueAsNumber: true
                        })}
                    />
                </div>


                <div className="edit-event-field">
                    <label>Ticket Price</label>

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        {...register("ticketPrice", {
                            valueAsNumber: true
                        })}
                    />
                </div>

                <div className="edit-event-field">
                    <label>VIP Price</label>

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        {...register("vipPrice", {
                            valueAsNumber: true
                        })}
                    />
                </div>


                <div className="edit-event-image-section">

                    <div className="edit-event-preview-box">

                        {preview ? (
                            <img
                                src={preview}
                                alt="Event Preview"
                                className="edit-event-current-image"
                            />
                        ) : (
                            <div className="edit-event-empty-image">
                                <span className="edit-event-empty-icon">
                                    🎭
                                </span>

                                <span>
                                    No event image
                                </span>
                            </div>
                        )}

                    </div>


                    <div className="edit-event-image-upload">

                        <span className="edit-event-image-title">
                            Cover Image
                        </span>

                        <input
                            type="file"
                            accept="image/*"
                            {...register("image", {
                                onChange: handleImageChange
                            })}

                        />

                        <small>
                            Select a new image only if you want
                            to replace the current cover.
                        </small>

                    </div>

                </div>


                <div className="edit-event-actions">

                    <button
                        type="button"
                        className="edit-event-cancel"
                        onClick={() => navigate("/events")}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="edit-event-save"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                </div>

            </form>

        </section>
    );
}