import axios from "axios";
import { AuthResponseModel, RegisterUserDto, type LoginUserDto } from "../models/user-model";
import { appConfig } from "../utils/app-config";
import { store } from "../redux/inventory-store";
import { login, logout } from "../redux/auth-slice";



class AuthService {

    //Login
    public async login(credentials:LoginUserDto):Promise<AuthResponseModel>{
        const response = await axios.post<AuthResponseModel>(appConfig.loginUrl,credentials,
            {
                withCredentials: true
            }

        )
        store.dispatch(login(response.data))
        return response.data;
    }

      //Register
    public async register(user:RegisterUserDto):Promise<AuthResponseModel>{
        const response = await axios.post<AuthResponseModel>(appConfig.registerUrl,user)
        
        return response.data;
    }

    //Forgot Password - Step 1
    public async requestPasswordResetCode(email: string): Promise<void> {
        await axios.post(appConfig.usersUrl + "forgot-password/request-code", { email });
    }

    //Forgot Password - Step 2
    public async verifyPasswordResetCode(email: string, code: string): Promise<string> {
        const response = await axios.post<{ resetToken: string }>(
            appConfig.usersUrl + "forgot-password/verify-code", { email, code }
        );
        return response.data.resetToken;
    }

    //Forgot Password - Step 3
    public async resetPassword(resetToken: string, newPassword: string): Promise<void> {
        await axios.patch(appConfig.usersUrl + "forgot-password/reset", { resetToken, newPassword });
    }

    //Logout
    public logout():void {
        store.dispatch(logout());
    }





}

export const authService = new AuthService();