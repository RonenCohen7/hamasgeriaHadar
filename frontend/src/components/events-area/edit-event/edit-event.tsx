import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import "./edit-event.css";

import { EventModel } from "../../models/event-model";
import { eventService } from "../../service/eventService";
import { notificationService } from "../../service/notificationService";
import { useTitle } from "../../utils/UseTitle";
import { useTranslation } from "react-i18next";


export function EditEvent() {

    const { t } = useTranslation();
    useTitle("Edit Event");

    const { idEvent } = useParams();
    const navigate = useNavigate();
    const eventId = Number(idEvent);


    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<EventModel>();
    

    const [preview, setPreview] = useState<string | null>(null);



    useEffect(() => {

        if (!Number.isInteger(eventId) || eventId <= 0) {
            navigate("/events");
            return;
        }

        eventService
            .getOneEvent(eventId)
            .then(event => {
               

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
                    t("events.edit.loadError")
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

            notificationService.success(t("events.edit.updateSuccess"));

            navigate("/events")


        } catch (err: any) {

            console.error("Update event error:", err);

            console.error("Server response:", err.response?.data);

            notificationService.error(t("events.edit.updateError"));
        }
    }


    return (
        <section className="EditEvent">

            <div className="edit-event-page-header">
                <div>
                    <span className="edit-event-eyebrow">
                        {t("events.edit.management")}
                    </span>

                    <h2>{t("events.edit.title")}</h2>
                </div>

                <button
                    type="button"
                    className="edit-event-back-button"
                    onClick={() => navigate("/events")}
                >
                    {t("events.edit.backToEvents")}
                </button>
            </div>


            <form
                className="edit-event-form"
                onSubmit={handleSubmit(submit)}
            >

                <div className="edit-event-field event-name">
                    <label>{t("events.add.eventName")}</label>

                    <input
                        type="text"
                        {...register("eventName", {
                            required: true
                        })}
                    />
                </div>


                <div className="edit-event-field description">
                    <label>{t("events.add.eventDescription")}</label>

                    <textarea
                        {...register("eventDescription")}
                    />
                </div>


                <div className="edit-event-field">
                    <label>{t("events.add.start")}</label>

                    <input
                        type="datetime-local"
                        {...register("eventStart", {
                            required: true
                        })}
                    />
                </div>


                <div className="edit-event-field">
                    <label>{t("events.add.end")}</label>

                    <input
                        type="datetime-local"
                        {...register("eventEnd")}
                    />
                </div>


                <div className="edit-event-field">
                    <label>{t("events.add.location")}</label>

                    <input
                        type="text"
                        {...register("eventLocation")}
                    />
                </div>


                <div className="edit-event-field">
                    <label>{t("events.add.status")}</label>

                    <select
                        {...register("eventStatus")}
                    >
                        <option value="planned">
                            {t("events.status.planned")}
                        </option>

                        <option value="active">
                            {t("events.status.active")}
                        </option>

                        <option value="completed">
                            {t("events.status.completed")}
                        </option>

                        <option value="cancelled">
                            {t("events.status.cancelled")}
                        </option>
                    </select>
                </div>


                <div className="edit-event-field">
                    <label>{t("events.add.maximumGuests")}</label>

                    <input
                        type="number"
                        min="0"
                        {...register("maximumGuests", {
                            valueAsNumber: true
                        })}
                    />
                </div>


                <div className="edit-event-field">
                    <label>{t("events.add.expectedGuests")}</label>

                    <input
                        type="number"
                        min="0"
                        {...register("expectedGuests", {
                            valueAsNumber: true
                        })}
                    />
                </div>


                <div className="edit-event-field">
                    <label>{t("events.add.ticketPrice")}</label>

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
                    <label>{t("events.vipPrice")}</label>

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
                                    {t("events.edit.noEventImage")}
                                </span>
                            </div>
                        )}

                    </div>


                    <div className="edit-event-image-upload">

                        <span className="edit-event-image-title">
                            {t("events.edit.coverImage")}
                        </span>

                        <input
                            type="file"
                            accept="image/*"
                            {...register("image", {
                                onChange: handleImageChange
                            })}

                        />

                        <small>
                            {t("events.edit.replaceImageHint")}
                        </small>

                    </div>

                </div>


                <div className="edit-event-actions">

                    <button
                        type="button"
                        className="edit-event-cancel"
                        onClick={() => navigate("/events")}
                    >
                        {t("events.edit.cancel")}
                    </button>

                    <button
                        type="submit"
                        className="edit-event-save"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? t("events.edit.saving")
                            : t("events.edit.saveChanges")}
                    </button>

                </div>

            </form>

        </section>
    );
}