import axios from "axios";
import { SafeUserModel, UpdateUserDto,  type RegisterUserDto } from "../models/user-model";
import { appConfig } from "../utils/app-config";



class UserService {

  


    //get All user
    public async getAllUser():Promise<SafeUserModel[]>{
        const response = await axios.get<SafeUserModel[]>(`${appConfig.usersUrl}`)
        return response.data
    }

    //Get One User
    public async getOneUser(id:number):Promise<SafeUserModel>{
        const response = await axios.get<SafeUserModel>(`${appConfig.usersUrl}${id}`)
        return response.data;
    }


    //Update user
    public async updateUser(id:number, user:UpdateUserDto):Promise<SafeUserModel>{
        const response = await axios.put<SafeUserModel>(`${appConfig.usersUrl}${id}`,user)
        return response.data;
    }


    //Delete user
    public async deleteUser(id:Number):Promise<void>{
        await axios.delete(`${appConfig.usersUrl}${id}`) 
    }

}

export const userService = new UserService();