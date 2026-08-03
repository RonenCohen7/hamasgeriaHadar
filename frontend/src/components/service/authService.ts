import axios from "axios";
import { AuthResponseModel, RegisterUserDto, type LoginUserDto } from "../models/user-model";
import { appConfig } from "../utils/app-config";
import { store } from "../redux/inventory-store";
import { login, logout } from "../redux/auth-slice";



class AuthService {

    //Login
    public async login(credentials:LoginUserDto):Promise<AuthResponseModel>{
        const response = await axios.post<AuthResponseModel>(appConfig.loginUrl,credentials)
        store.dispatch(login(response.data))
        return response.data;
    }

      //Register
    public async register(user:RegisterUserDto):Promise<AuthResponseModel>{
        const response = await axios.post<AuthResponseModel>(appConfig.registerUrl,user)
        
        return response.data;
    }

    //Logout
    public logout():void {
        store.dispatch(logout());
    }





}

export const authService = new AuthService();