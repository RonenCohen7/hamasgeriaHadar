import express, {
    NextFunction,
    Request,
    Response
} from "express";

import { LoginUserDto, RegisterUserDto, UpdatedUserDto } from "../models/user-model";
import { userService } from "../services/users-service";
import { authLimiter } from "../middleware/rate-limit-middleware";
import { verify } from "jsonwebtoken";
import { allowRoles } from "../middleware/role-middleware";
import { verifyToken } from "../middleware/verify-token";




class UserController {

    public readonly router = express.Router();


    public constructor() {

        this.router.post("/api/users/register", this.registerUser);
        this.router.post("/api/users/login", this.login);


        this.router.get("/api/users",verifyToken, allowRoles("admin"), this.getAllUsers);
        this.router.get("/api/users/:id",verifyToken, allowRoles("admin"), this.getOneUser);

        this.router.put("/api/users/:id", verifyToken,allowRoles("admin"), this.updateUser);
        this.router.delete("/api/users/:id",verifyToken, allowRoles("admin"), this.deleteUser);
    }

    //Register
    private async registerUser(
        request: Request, response: Response, next: NextFunction): Promise<void> {

        try {

            const user: RegisterUserDto = request.body;

            const addedUser =
                await userService.registerUser(user);

            response.status(201).json(addedUser);
        }
        catch (error: any) {
            next(error);
        }
    }


    //Login
    private async login(request:Request, response:Response, next:NextFunction):Promise<void>{
        try{

            const credentials:LoginUserDto = request.body;
            const auth = await userService.login(credentials);
            response.json(auth);
            
        }catch(err){
            next(err)
        }
    }



    //Get All Users
    private async getAllUsers(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const users = await userService.getAllUsers();

            response.json(users);

        } catch (err: any) {
            next(err)
        }
    }



    //Get One User
    private async getOneUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(request.params.id);

            const user = await userService.getOneUser(id);

            response.json(user);
        } catch (err: any) {
            next(err)
        }
    }


    //Update User
    private async updateUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const id = Number(request.params.id);
            if (!Number.isInteger(id) || id <= 0) {
                response.status(400).json({ message: "User id must be a positive number. " });
                return
            };

            const user: UpdatedUserDto = request.body;

            const updatedUser = await userService.updateUser(id, user)

            response.json(updatedUser)

        } catch (err: any) {
            next(err)
        }
    }



    //DELETE user
    private async deleteUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(request.params.id);

            await userService.deleteUser(id);

            response.sendStatus(204);
            
        } catch (err: any) {
            next(err)
        }
    }

}


export const userController = new UserController();