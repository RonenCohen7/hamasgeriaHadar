import { useNavigate } from "react-router-dom";
import { useTitle } from "../../utils/UseTitle";
import "./add-experience.css";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ExperienceModel } from "../../models/experience-mode";
import { experienceService } from "../../service/experienceService";
import { notificationService } from "../../service/notificationService";
import { store } from "../../redux/inventory-store";
import { useTranslation } from "react-i18next";



export function AddExperience() {
    const { t, i18n } = useTranslation();
    const isHebrew = i18n.language === "he";

    useTitle(t("addExperience.pageTitle"));


    const user = store.getState().auth.user;
    const isAdmin = user?.role == "admin";


    const navigate = useNavigate();

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

            const serverData = err.response?.data;

            const message = typeof serverData == "string"
                ? serverData
                : serverData?.message ??
                err.message ??
                "Failed to add experience"

            notificationService.error(message)
        }

    }



    return (
        <div className="AddExperience" dir={isHebrew ? "rtl" : "ltr"}>

            <h1>{t("addExperience.title")}</h1>

            <form
                className="add-experience-form"
                onSubmit={handleSubmit(send)}
            >

               <label>{t("addExperience.type")}</label>
                <select
                    {...register("experienceType", { required: true })}
                >
                    <option value="chef">
                       {t("addExperience.types.chef")}
                    </option>

                    <option value="cocktail">
                       {t("addExperience.types.cocktail")}
                    </option>
                </select>

               <label>{t("addExperience.experienceTitle")}</label>
                <input
                    type="text"
                    {...register("title", { required: t("addExperience.validation.titleRequired")})}
                />
                {errors.title && (
                    <span className="error">
                        {errors.title.message}
                    </span>
                )}


               <label>{t("addExperience.description")}</label>
                <textarea
                    rows={6}
                    {...register("description")}
                />

               <label>{t("addExperience.price")}</label>
                <input
                    type="number"
                    step="0.01"
                    {...register("price", { required: true, valueAsNumber: true })}
                />

                <label>{t("addExperience.displayOrder")}</label>
                <input
                    type="number"
                    min="0"
                    {...register("displayOrder", { valueAsNumber: true })}
                />

               <label>{t("addExperience.active")}</label>
                <input
                    type="checkbox"
                    {...register("isActive")}
                />

               <label>{t("addExperience.image")}</label>
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
                            {t("addExperience.save")}
                        </button>

                    )}

                    {isAdmin && (
                        <button
                            typeof="button"
                            className="button-back"
                            onClick={() => navigate(-1)}
                        >
                            {t("addExperience.cancel")}
                        </button>
                    )}

                </div>

            </form>



        </div>
    );
}
