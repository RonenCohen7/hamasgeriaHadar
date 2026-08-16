import { useEffect, useState } from "react";
import "./experience-list.css";
import type { ExperienceModel } from "../../models/experience-mode";

import { useTitle } from "../../utils/UseTitle";
import { experienceService } from "../../service/experienceService";
import { useNavigate, useParams } from "react-router-dom";
import { store } from "../../redux/inventory-store";

export function ExperienceList() {

    useTitle("Experiences")


    const user = store.getState().auth.user;
    const isAdmin = user?.role === "admin";


    const navigate = useNavigate();

    const { type } = useParams()

    const [experiences, setExperiences] = useState<ExperienceModel[]>([]);

    useEffect(() => {

        const promise = type

            ? experienceService.getExperiencesByType(type)
            : experienceService.getAllExperiences()

        promise
            .then(setExperiences)
            .catch(console.error)
    }, [type]);





    return (
        <div className="experience-dashboard-grid">
            {isAdmin && (
                <button onClick={() => navigate("/experiences/add")}
                    className="add-experience-btn">
                    + Add Experience
                </button>

            )}

            {experiences.map(experience => (
                <article
                    key={experience.idExperience}
                    className="experience-dashboard-card"
                    onClick={() => navigate(`/experience/${experience.idExperience}`)}
                >
                    {experience.imageUrl && (
                        <img
                            src={experience.imageUrl}
                            alt={experience.title}
                        />
                    )}
                    <div className="experience-dashboard-overlay">

                        <span className="experience-badge">
                            {experience.experienceType}
                        </span>
                        <h2>
                            {experience.title}
                        </h2>
                        {experience.description && (
                            <p>
                                {experience.description}
                            </p>
                        )}
                        <strong>
                            ₪{Number(experience.price).toFixed(2)}
                        </strong>
                    </div>



                </article>

            ))}
        </div>
    );
}
