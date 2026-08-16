import express, { Request, Response, NextFunction } from "express"
import { experienceService } from "../services/experience-service";
import { ExperienceModel } from "../models/experience-model";
import { UploadedFile } from "express-fileupload";
import { verify } from "jsonwebtoken";
import { allowRoles } from "../middleware/role-middleware";
import { verifyToken } from "../middleware/verify-token";


class ExperienceController {


    public readonly router = express.Router();


    public constructor() {

        this.router.get("/api/experiences", this.getAllExperiences);

        this.router.get("/api/experiences/:id", this.getOneExperience);

        this.router.post("/api/experiences",verifyToken, allowRoles("admin"), this.addExperience);

        this.router.put("/api/experiences/:id", verifyToken,allowRoles("admin"), this.updateExperience);

        this.router.delete("/api/experiences/:id", verifyToken, allowRoles("admin"), this.deleteExperience);

        this.router.get("/api/experiences/type/:type", this.getExperiencesByType);


    }


    //Get All Experiences
    private async getAllExperiences(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {

            const experiences = await experienceService.getAllExperiences();

            console.log(experiences);

            response.json(experiences);

        } catch (err: any) {
            next(err)
        }

    }

    //Get One
    private async getOneExperience(request:Request, response:Response, next:NextFunction):Promise<void>{
        try{

            const id = Number(request.params.id);
            
            const experience = await experienceService.getOneExperience(id);

            response.json(experience);

        }catch(err){
            next(err)
        }
    }

    //Add experience
    private async addExperience(request:Request, response:Response, next:NextFunction):Promise<void>{
        try{

            const experience = request.body as ExperienceModel;

            const price = Number(request.body.price)

            experience.displayOrder = request.body.displayOrder ?? 0;

            experience.isActive = request.body.isActive == "true" || request.body.isActive == true;

            experience.image = request.files?.image as UploadedFile;

            const addExperience = await experienceService.addExperience(experience);

            response.status(200).json(addExperience);

        }catch(err){
            next(err)
        }
    }


    //Update
    private async updateExperience(request:Request, response:Response, next:NextFunction):Promise<void>{
        try{

            const id = Number(request.params.id);

            const experience = request.body as ExperienceModel;

            experience.idExperience = id;

            experience.image = request.files?.image as UploadedFile;

            const updateExperience = await experienceService.updateExperience(experience)


            response.json(updateExperience);

        }catch(err){
            next(err)
        }
    }


    //DELETE
    private async deleteExperience(request:Request, response:Response, next:NextFunction): Promise<void>
    {
        try{

           const id = Number(request.params.id);

           await experienceService.deleteExperience(id);

           response.sendStatus(204)
        } catch(err){
                next(err)
            }
    }


    //Get Experiences by type
    private async getExperiencesByType(request:Request, response:Response, next:NextFunction):Promise<void>{
        try{

            const type = String(request.params.type);
            const experiences = await experienceService.getExperiencesByType(type)
            response.json(experiences);

        }catch(err){
            next(err)
        }
    }

}


export const experienceController = new ExperienceController();

