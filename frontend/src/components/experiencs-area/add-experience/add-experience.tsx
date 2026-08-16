import { useNavigate, useParams } from "react-router-dom";
import { useTitle } from "../../utils/UseTitle";
import "./add-experience.css";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ExperienceModel } from "../../models/experience-mode";
import { experienceService } from "../../service/experienceService";
import { notificationService } from "../../service/notificationService";
import { store } from "../../redux/inventory-store";




export function AddExperience() {


    useTitle("Add Experience");


    const user = store.getState().auth.user;
    const isAdmin = user?.role == "admin";


    const navigate = useNavigate();

    const { id } = useParams();

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<ExperienceModel>({
        defaultValues: { experienceType: "chef", isActive: true, displayOrder: String(0) }
    })

    function handleSubmitChange(event: React.ChangeEvent<HTMLInputElement>) {

        const file = event.target.files?.[0];

        if (!file) return;

        setPreviewUrl(URL.createObjectURL(file))

    }


    async function send(FormData: ExperienceModel) {

        const imageFile = FormData.image as unknown as FileList;

        try {


            if (imageFile?.length > 0) {
                FormData.image = imageFile[0];
            }
            else {
                delete FormData.image
            }


            const addExperience = await experienceService.addExperience(FormData)
            notificationService.success("Experience added successfully")

            navigate(`/experience/${addExperience.idExperience}`)



        } catch (err: any) {
            console.error(err)

            const serverDate = err.response?.data;

            const message = typeof serverDate == "string"
                ? serverDate
                : serverDate?.message ??
                err.message ??
                "Failed to add experience"

            notificationService.error(message)
        }

    }



    return (
        <div className="AddExperience">

            <h1>Add Experience</h1>

            <form
                className="add-experience-form"
                onSubmit={handleSubmit(send)}
            >

                <label>Type</label>
                <select
                    {...register("experienceType", { required: true })}
                >
                    <option value="chef">
                        Chef
                    </option>

                    <option value="cocktail">
                        Cocktail
                    </option>
                </select>

                <label>Title</label>
                <input
                    type="text"
                    {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                    <span className="error">
                        {errors.title.message}
                    </span>
                )}


                <label>Description</label>
                <textarea
                    rows={6}
                    {...register("description")}
                />

                <label>Price</label>
                <input
                    type="number"
                    step="0.01"
                    {...register("price", { required: true, valueAsNumber: true })}
                />

                <label>Display Order</label>
                <input
                    type="number"
                    min="0"
                    {...register("displayOrder", { valueAsNumber: true })}
                />

                <label>Active</label>
                <input
                    type="checkbox"
                    {...register("isActive")}
                />

                <label>Image</label>
                <input
                    type="file"
                    accept="image/*"
                    {...register("image", { onChange: handleSubmitChange })}
                />

                {previewUrl && (
                    <div className="experience-preview">

                        <img
                            src={previewUrl}
                            alt="Experience Preview"
                        />
                    </div>
                )}

                <div className="add-experience-actions">
                    {isAdmin && (
                        <button
                            type="submit"
                            className="save-btn"
                        >
                            Save
                        </button>

                    )}

                    {isAdmin && (
                        <button
                            typeof="button"
                            className="button-back"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                    )}

                </div>

            </form>



        </div>
    );
}
