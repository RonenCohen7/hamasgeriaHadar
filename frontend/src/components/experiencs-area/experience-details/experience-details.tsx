import { useNavigate, useParams } from "react-router-dom";
import "./experience-details.css";
import { useEffect, useState } from "react";
import { ExperienceModel } from "../../models/experience-mode";
import { experienceService } from "../../service/experienceService";
import { useTitle } from "../../utils/UseTitle";
import { notificationService } from "../../service/notificationService";
import { store } from "../../redux/inventory-store";

export function ExperienceDetails() {

    useTitle("Experience Detail")

    const { id } = useParams();
    const navigate = useNavigate();

    const user = store.getState().auth.user;
    const isAdmin = user?.role == "admin";

    const [experience, setExperience] = useState<ExperienceModel>();

    const [isEditing, setIsEditing] = useState(false);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [editExperience, setEditExperience] = useState<ExperienceModel>();

    useEffect(() => {
        experienceService
            .getOneExperience(Number(id))
            .then(data => {
                setExperience(data);
                setEditExperience(data);
            })
            .catch(console.error)

    }, [id]);

    if (!experience) return <div>Loading...</div>


    async function save() {

        if (!editExperience) return;
        console.log("SAVE EXPERIENCE:", editExperience);

        try {
            const updatedExperience = await experienceService.updateExperience(editExperience)

            setExperience(updatedExperience);
            setEditExperience(updatedExperience);

            setIsEditing(false)

            notificationService.success("Experience update successfully")

        } catch (err: any) {

            console.error(err);
        }
    }

    return (
        <div className="experience-details">

            <div className="experience-content">

                <div className="experience-info">

                    <span className="experience-type">
                        {experience.experienceType}
                    </span>

                    {isEditing ? (
                        <input type="text"
                            value={editExperience?.title || ""}
                            onChange={e =>
                                setEditExperience({
                                    ...editExperience!,
                                    title: e.target.value
                                })
                            }
                        />
                    ) : (
                        <h1>{experience.title}</h1>
                    )}

                    {isEditing ? (
                        <textarea
                            value={editExperience?.description || ""}
                            onChange={e =>
                                setEditExperience({
                                    ...editExperience!,
                                    description: e.target.value
                                })
                            }
                        />
                    ) : (
                        <p>{experience.description}</p>
                    )}

                    {isEditing ? (
                        <input
                            type="number"
                            value={editExperience?.price || 0}
                            onChange={e =>
                                setEditExperience({
                                    ...editExperience!,
                                    price: Number(e.target.value)
                                })
                            }
                        />
                    ) : (
                        <h2>{experience.price}</h2>

                    )}

                </div>
                <div className="experience-image-box">

                    <div className="experience-info">

                        <div className="experience-image-box">

                            <img
                                src={previewUrl ? previewUrl : String(experience.imageUrl)}
                                alt={experience.title}
                                className="experience-image"
                            />
                        </div>
                    </div>
                </div>
                {isEditing && isAdmin && (
                    <div className="experience-file-row">
                        <input
                            className="experience-file-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {

                                const file = e.target.files?.[0];

                                if (!file) return;

                                setEditExperience({
                                    ...editExperience!,
                                    image: file
                                });
                                setPreviewUrl(URL.createObjectURL(file))
                            }}
                        />
                    </div>
                )}

                <div className="experience-actions">

                    <button
                        type="button"
                        className="button-back"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>

                    {isAdmin && !isEditing && (
                        <button
                            className="edit-btn"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </button>
                    )}

                    {isEditing && isAdmin && (
                        <button
                            className="save-btn"
                            onClick={save}
                        >
                            Save
                        </button>
                    )}

                </div>
            </div>
        </div>
    )
}
