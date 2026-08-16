import { OkPacketParams } from "mysql2";
import { ExperienceModel } from "../models/experience-model";
import { dal } from "../utils/dal";
import { appConfig } from "../utils/app-config";
import { ResourceNotFoundError } from "../models/client-errors";

import { sanitizeText } from "../utils/sanitize";
import { fileSaver } from "uploaded-file-saver";


class ExperienceService {

    // Get all Experiences
    public async getAllExperiences(): Promise<ExperienceModel[]> {

        const sql = `
            SELECT 
                id_experience AS idExperience,
                experience_type AS experienceType,
                title,
                description,
                image_name AS imageName,
                price,
                is_active AS isActive,
                display_order AS displayOrder,
                created_at AS createAt,
                updated_at AS updatedAt,

            CASE
                WHEN image_name IS NOT NULL
                THEN CONCAT(?, image_name)
                ELSE NULL
            END AS imageUrl

            FROM experiences
            WHERE is_active = 1
            ORDER BY display_order, title
        `;

        const experiences = await dal.execute(sql, [appConfig.baseExperienceImageUrl]) as ExperienceModel[];

        return experiences;
    }




    //Get One Experience
    public async getOneExperience(id: number): Promise<ExperienceModel> {
        const sql = `
            SELECT 
                id_experience AS idExperience,
                experience_type AS experienceType,
                title,
                description,
                image_name AS imageName,
                price,
                is_active AS isActive,
                display_order AS displayOrder,
                created_at AS createdAt,
                updated_at AS updatedAt,

                CASE
                    WHEN image_name IS NOT NULL
                    THEN CONCAT(?, image_name)
                    ELSE NULL
                END AS imageUrl
            
            FROM experiences
            WHERE id_experience = ?

        `;

        const experiences = await dal.execute(sql, [appConfig.baseExperienceImageUrl, id]) as ExperienceModel[];

        const experience = experiences[0]

        if (!experience) {
            throw new ResourceNotFoundError(id);
        }

        return experience;
    }

    //Add Experience

    public async addExperience(experience: ExperienceModel): Promise<ExperienceModel> {

        experience.title = sanitizeText(experience.title)

        if (experience.description) {
            experience.description = sanitizeText(experience.description)
        }

        const displayOrder = experience.displayOrder == null ? 0 : Number(experience.displayOrder);

        const price = experience.price == null ? 0 : Number(experience.price);

        const isActive = experience.isActive == undefined ? true : !!experience.isActive;

        //save image
        if (experience.image) {
            experience.imageName = await fileSaver.add(experience.image, appConfig.experienceImages)
        }
        else {
            experience.imageName = null;
        }


        const sql = `
            INSERT INTO experiences (
                experience_type,
                title,
                description,
                image_name,
                price,
                is_active,
                display_order
            )VALUES(?,?,?,?,?,?,?)
        `;

        const values: (string | number | boolean | Date | null)[] = [

            experience.experienceType,
            experience.title,
            experience.description ?? null,
            experience.imageName ?? null,
            experience.price,
            experience.isActive,
            experience.displayOrder
        ];


        const info = await dal.execute(sql, values) as OkPacketParams
        const idExperience = Number(info.insertId!);

        return await this.getOneExperience(idExperience);


    }


    //Update experience
    public async updateExperience(experience: ExperienceModel): Promise<ExperienceModel> {

        const existingExperience = await this.getOneExperience(experience.idExperience);

        experience.title = sanitizeText(experience.title);

        if (experience.description) {
            experience.description = sanitizeText(experience.description)
        }

        const price = experience.price == null ? existingExperience.price : Number(experience.price);

        const displayOrder = experience.displayOrder == null ? existingExperience.displayOrder : Number(experience.displayOrder);

        const isActive = experience.isActive == null ? existingExperience.isActive : !!experience.isActive;

        //Image
        if (experience.image) {

            //delete old image
            if (existingExperience.imageName) {
                await fileSaver.delete(existingExperience.imageName, appConfig.experienceImages)
            }

            //save new image
            experience.imageName = await fileSaver.add(experience.image, appConfig.experienceImages)
        }
        else {
            //keep exists image
            experience.imageName = existingExperience.imageName
        }

        const sql = `
            UPDATE experiences 

            SET
                experience_type = ?,
                title = ?,
                description = ?,
                image_name = ?,
                price = ?,
                is_active = ?,
                display_order = ?
            WHERE id_experience = ?

        `;

        const values = [
            experience.experienceType,
            experience.title,
            experience.description ?? null,
            experience.imageName ?? null,
            price,
            isActive,
            displayOrder,
            experience.idExperience
        ];

        const info = await dal.execute(sql, values) as OkPacketParams;

        if (info.affectedRows == 0) {
            throw new ResourceNotFoundError(experience.idExperience)
        }

        return await this.getOneExperience(experience.idExperience);

    }



    //Delete experience
    public async deleteExperience(id: number): Promise<void> {

        await this.getOneExperience(id);

        //Soft delete
        const sql = `
            UPDATE experiences
            SET is_active = 0
            WHERE id_experience = ?
        `;

        const info = await dal.execute(sql, [id]) as OkPacketParams;

        if (info.affectedRows == 0) {
            throw new ResourceNotFoundError(id);
        }
    }


    //Get Experience by type
    public async getExperiencesByType(type: string): Promise<ExperienceModel[]> {
        const sql = `
                   SELECT
                        id_experience AS idExperience,
                        experience_type AS experienceType,
                        title,
                        description,
                        image_name AS imageName,
                        price,
                        is_active AS isActive,
                        display_order AS displayOrder,
                        created_at AS createdAt,
                        updated_at AS updatedAt,

                        CASE
                            WHEN image_name IS NOT NULL
                            THEN CONCAT(?, image_name)
                            ELSE NULL
                        END AS imageUrl

                    FROM experiences
                    WHERE experience_type = ?
                    AND is_active = 1

                    ORDER BY display_order, title
    `;

        return await  dal.execute(sql, [appConfig.baseExperienceImageUrl, type]) as ExperienceModel[];


    }

}

export const experienceService = new ExperienceService();