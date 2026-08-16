import { UploadedFile } from "express-fileupload";


export type ExperienceType = "chef" | "cocktail";

export class ExperienceModel {
    idExperience!:  number;

    experienceType!: ExperienceType;

    title!: string;

    description!: string | null;

    imageName!: string | null;
    imageUrl!: string | null;
    image?: UploadedFile;

    price!: number;

    isActive!: boolean;
    displayOrder!: string;

    createdAt!: string;
    updatedAt!: string;


}