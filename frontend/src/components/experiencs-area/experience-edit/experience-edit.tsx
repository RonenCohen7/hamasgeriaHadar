import { useNavigate, useParams } from "react-router-dom";
import { useTitle } from "../../utils/UseTitle";
import "./experience-edit.css";
import React, { useEffect, useState } from "react";
import { ExperienceModel } from "../../models/experience-mode";
import { useForm } from "react-hook-form";
import { experienceService } from "../../service/experienceService";

import { notificationService } from "../../service/notificationService";

export function ExperienceEdit() {


    useTitle("Edit-Experience")
    const navigate = useNavigate();
    const { id } = useParams();

    const [experience, setExperience] = useState<ExperienceModel>();

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { register, handleSubmit, reset } = useForm<ExperienceModel>();


    useEffect(() => {
        if (!id) return;

        experienceService
            .getOneExperience(Number(id))
            .then(exp => {
                setExperience(exp)

                reset(exp)
            })
            .catch(console.error)

    }, [id, reset]);


    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>

    ) {
        const file = event.target.files?.[0];

        if (!file) return;

        setPreviewUrl(URL.createObjectURL(file));
    }

    async function send(formData: ExperienceModel) {
        try {

            formData.idExperience = Number(id)

            const files = formData as unknown as FileList;

            if (files?.length > 0) {
                formData.image = files[0];
            }
            else {
                delete formData.image;
            }

            await experienceService.updateExperience(formData)
            notificationService.success("Experience update successfully")

        } catch (err: any) {
            console.log(err);
            notificationService.error("Failed to Update")

        }
        if (!experience) return <div> Loading...</div>
    }


    return (
        <div className="experience-edit-page">

            <h1>Edit Experience</h1>

            <form
                className="experience-edit-form"
                onSubmit={handleSubmit(send)}

            >
                <label>Type</label>
                <select
                    {...register("experienceType")}
                >
                    <option value="Chef">
                        Chef
                    </option>
                    <option value="cocktail">
                        Cocktail
                    </option>
                </select>

                <label>Title</label>
                <input
                    type="text"
                    {...register("title")}
                />

                <label>Description</label>
                <textarea
                    rows={6}
                    {...register("description")}
                />



                <label>Price</label>
                <input
                    type="number"
                    step="0.01"
                    {...register("price")}

                />

                <label>Display Order</label>
                <input
                    type="number"
                    {...register("displayOrder", { valueAsNumber: true })}
                />

                <label>Active</label>
                <input
                    type="checkbox"
                    {...register("isActive")}

                />

                <label>Image</label>
                {previewUrl && (
                    <div className="experience-edit-preview">
                        <img
                            src={previewUrl}
                            alt={experience?.title}
                        />
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    {...register("image", { onChange: handleImageChange })}
                />

                <div className="experience-edit-action">

                    <button type="submit">
                        Save
                    </button>

                    <button type="button" onClick={()=> navigate(-1)}>
                        Cancel
                    </button>
                </div>

            </form>

            <p>ExperienceEdit Component</p>

        </div>
    );
}
