

export class ExperienceModel {

    idExperience!:number;

    experienceType!: string;

    title!: string;

    description!: string | null;

 
    imageName!: string | null;
    imageUrl!: string | null;
    image?: File;

    price!: number;

    isActive!: boolean;
    displayOrder!:string;

    createdAt!: string;
    updatedAt!: string;
}