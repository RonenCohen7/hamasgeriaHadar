import "./event-media.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { EventMediaModel } from "../../models/event-media-model";

import { eventMediaService } from "../../service/eventMediaService";
import { notificationService } from "../../service/notificationService";

import { appConfig } from "../../utils/app-config";
import { useTitle } from "../../utils/UseTitle";


export function EventMedia() {

    useTitle("Event Media");


    const navigate = useNavigate();

    const { idEvent } = useParams();

    const eventId = Number(idEvent);


    // =========================================
    // MEDIA
    // =========================================

    const [media, setMedia] =
        useState<EventMediaModel[]>([]);

    const [isLoading, setIsLoading] =
        useState(true);


    // =========================================
    // UPLOAD FORM
    // =========================================

    const [file, setFile] =
        useState<File | null>(null);

    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [isCover, setIsCover] =
        useState(false);

    const [isUploading, setIsUploading] =
        useState(false);


    // =========================================
    // LOAD MEDIA
    // =========================================

    useEffect(() => {

        if (
            !Number.isInteger(eventId) ||
            eventId <= 0
        ) {

            notificationService.error(
                "Event not found"
            );

            navigate("/events");

            return;
        }


        async function loadMedia() {

            try {

                setIsLoading(true);


                const result =
                    await eventMediaService
                        .getMediaByEventId(eventId);


                setMedia(result);

            } catch (err) {

                console.error(
                    "Failed to load event media:",
                    err
                );

                notificationService.error(
                    "Failed to load event media"
                );

            } finally {

                setIsLoading(false);
            }
        }


        loadMedia();

    }, [eventId, navigate]);


    // =========================================
    // UPLOAD MEDIA
    // =========================================

    async function uploadMedia() {

        if (!file) {

            notificationService.error(
                "Please select a photo or video"
            );

            return;
        }


        try {

            setIsUploading(true);


            const addedMedia =
                await eventMediaService.addMedia(
                    eventId,
                    {
                        file,
                        title,
                        description,

                        // automatic order
                        displayOrder:
                            media.length + 1,

                        isCover
                    }
                );


            // If new media became cover,
            // remove cover state from previous images.
            setMedia(current => {

                const updated =
                    isCover
                        ? current.map(item => ({
                            ...item,
                            isCover: false
                        }))
                        : current;


                return [
                    ...updated,
                    addedMedia
                ];
            });


            // Reset form
            setFile(null);
            setTitle("");
            setDescription("");
            setIsCover(false);


            notificationService.success(
                "Media uploaded successfully"
            );

        } catch (err) {

            console.error(
                "Upload Media ERROR:",
                err
            );


            notificationService.error(
                "Failed to upload media"
            );

        } finally {

            setIsUploading(false);
        }
    }


    // =========================================
    // LOADING
    // =========================================

    if (isLoading) {

        return (
            <section className="EventMedia">

                <div className="event-media-loading">
                    Loading event media...
                </div>

            </section>
        );
    }


    // =========================================
    // VIEW
    // =========================================

    return (

        <section className="EventMedia">


            {/* =================================
                HEADER
            ================================= */}

            <div className="event-media-header">

                <div>

                    <span>
                        EVENT MANAGEMENT
                    </span>

                    <h1>
                        Event Media
                    </h1>

                    <p>
                        Manage event photos,
                        videos and the main cover image.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        navigate("/events")
                    }
                >
                    ← Back to Events
                </button>

            </div>



            {/* =================================
                UPLOAD
            ================================= */}

            <div className="event-media-upload">


                <div className="upload-header">

                    <div>

                        <h2>
                            📸 Add Event Media
                        </h2>

                        <p>
                            Upload a photo or video
                            for this event.
                        </p>

                    </div>

                </div>



                <div className="upload-field upload-file-field">

                    <label>
                        Photo or Video
                    </label>


                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={event =>
                            setFile(
                                event.target.files?.[0]
                                ?? null
                            )
                        }
                    />


                    <small>
                        Supported:
                        JPG, PNG, WEBP and MP4
                    </small>

                </div>



                <div className="upload-field">

                    <label>
                        Title
                    </label>


                    <input
                        type="text"
                        placeholder="Example: Winter Opening"
                        value={title}
                        onChange={event =>
                            setTitle(
                                event.target.value
                            )
                        }
                    />

                </div>



                <div className="upload-field upload-description">

                    <label>
                        Description
                    </label>


                    <textarea
                        placeholder="Short description of this photo or video..."
                        value={description}
                        onChange={event =>
                            setDescription(
                                event.target.value
                            )
                        }
                    />

                </div>



                <label className="cover-option">

                    <input
                        type="checkbox"
                        checked={isCover}
                        onChange={event =>
                            setIsCover(
                                event.target.checked
                            )
                        }
                    />


                    <div>

                        <strong>
                            ⭐ Use as event cover
                        </strong>

                        <small>
                            The selected image will become
                            the main image of the event.
                        </small>

                    </div>

                </label>



                <button
                    type="button"
                    className="upload-media-button"
                    onClick={uploadMedia}
                    disabled={
                        !file ||
                        isUploading
                    }
                >

                    {isUploading
                        ? "Uploading..."
                        : "⬆ Upload Media"}

                </button>


            </div>



            {/* =================================
                GALLERY HEADER
            ================================= */}

            <div className="event-media-gallery-header">

                <div>

                    <span>
                        EVENT GALLERY
                    </span>

                    <h2>
                        Uploaded Media
                    </h2>

                </div>


                <strong>
                    {media.length}
                    {" "}
                    {media.length === 1
                        ? "item"
                        : "items"}
                </strong>

            </div>



            {/* =================================
                EMPTY
            ================================= */}

            {media.length === 0 ? (

                <div className="event-media-empty">

                    <span>
                        🖼️
                    </span>

                    <h2>
                        No Media Yet
                    </h2>

                    <p>
                        Upload the first photo
                        or video for this event.
                    </p>

                </div>

            ) : (

                /* =================================
                    MEDIA GRID
                ================================= */

                <div className="event-media-grid">

                    {media.map(item => (

                        <article
                            key={item.idMedia}
                            className="event-media-card"
                        >


                            {/* PREVIEW */}

                            <div className="event-media-preview">


                                {item.mediaType === "image" ? (

                                    <img
                                        src={
                                            `${appConfig.baseMediaUrl}${item.mediaUrl}`
                                        }
                                        alt={
                                            item.title ??
                                            "Event media"
                                        }
                                    />

                                ) : (

                                    <video
                                        src={
                                            `${appConfig.baseMediaUrl}${item.mediaUrl}`
                                        }
                                        controls
                                    />

                                )}



                                {item.isCover && (

                                    <span className="event-media-cover-badge">

                                        ⭐ Cover

                                    </span>

                                )}


                                <span className="event-media-type-badge">

                                    {item.mediaType === "image"
                                        ? "📷 Photo"
                                        : "🎬 Video"}

                                </span>


                            </div>



                            {/* INFO */}

                            <div className="event-media-info">


                                <h3>

                                    {item.title ||
                                        "Untitled Media"}

                                </h3>


                                {item.description && (

                                    <p>
                                        {item.description}
                                    </p>

                                )}


                                <small>

                                    Gallery position:{" "}
                                    {item.displayOrder}

                                </small>


                            </div>


                        </article>

                    ))}

                </div>

            )}


        </section>
    );
}