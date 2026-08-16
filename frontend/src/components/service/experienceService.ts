import axios from "axios";
import { ExperienceModel } from "../models/experience-mode";
import { appConfig } from "../utils/app-config";



class ExperienceService {

    //Get All experiences
    public async getAllExperiences(): Promise<ExperienceModel[]> {
        
        const response = await axios<ExperienceModel[]>(`${appConfig.experiencesUrl}`)

        return response.data;
    }





    //Get one experience
    public async getOneExperience(id: number):Promise<ExperienceModel>{
        
        const response = await axios.get<ExperienceModel>(`${appConfig.experiencesUrl}/${id}`)

        return response.data;
    }


    // add experience 
    public async addExperience(experience:ExperienceModel):Promise<ExperienceModel>{
        const formData = new FormData();

        formData.append("experienceType", experience.experienceType);
        formData.append("title", experience.title);
        formData.append("description", experience.description ?? "" );
        formData.append("price", String(experience.price));
        formData.append("isActive", String(experience.isActive ?? true));
        formData.append("displayOrder", String(experience.displayOrder ?? 0));

        if(experience.image instanceof File){
            formData.append("image", experience.image)
        }

        const response = await axios.post<ExperienceModel>(
            appConfig.experiencesUrl, formData
        )
        return response.data;
    }


    //update experience
    public async updateExperience(experience:ExperienceModel):Promise<ExperienceModel>{
        const formData = new FormData();

        formData.append("experienceType", experience.experienceType);
        formData.append("title", experience.title);
        formData.append("description", experience.description ?? "");
        formData.append("price", String(experience.price));
        formData.append("isActive", String(experience.isActive ?? true));
        formData.append("displayOrder", String(experience.displayOrder ?? 0));

        if(experience.image instanceof File){
            formData.append("image", experience.image)
        }

        const response = await axios.put<ExperienceModel>(`${appConfig.experiencesUrl}/${experience.idExperience}`, formData)

        return response.data;
    }



    //delete experience
    public async deleteExperience(id:number):Promise<void>{
        await axios.delete(`${appConfig.experiencesUrl}/${id}`)
    }



    //get experience by type
    public async getExperiencesByType(type:string):Promise<ExperienceModel[]>{

        const response = await axios.get<ExperienceModel[]>(`${appConfig.experiencesUrl}/type/${type}`)

        return response.data;

    }
}


export const  experienceService = new ExperienceService();