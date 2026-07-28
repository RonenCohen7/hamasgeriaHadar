import { OkPacketParams } from "mysql2";
import {
    RegisterUserDto,
    SafeUserModel,
    UpdatedUserDto,
    UserModel
} from "../models/user-model";

import { dal } from "../utils/dal";
import { UpdateEventDto } from "../models/event-model";
import { ResourceNotFoundError } from "../models/client-errors";


class UserService {
    //Register
    public async registerUser(user: RegisterUserDto): Promise<SafeUserModel> {

        const sql = `
            INSERT INTO users(
                full_name,
                email,
                password_hash,
                role,
                is_active
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            user.fullName,
            user.email,
            user.password,
            user.role,
            true
        ];

        const info =
            await dal.execute(sql, values) as OkPacketParams;

        const addedUser: SafeUserModel = {
            idUser: info.insertId!,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isActive: true,
            createdAt: new Date()
        };

        return addedUser;
    }


    //Get All Users
    public async getAllUsers():Promise<UserModel[]>{
        const sql = `
            SELECT 
               *
            FROM users
            
        `;

        const users = await dal.execute(sql) as UserModel[];

        return users
    }


    //Get User By Id
    public async getOneUser(id:number):Promise<UserModel>{
        const sql = `
            SELECT *
            FROM users
            WHERE id_user = ?
        `;
        const values = [id];

        const users = await dal.execute(sql,values) as UserModel[];

        const user = users[0];

        return user;
    }


    public async updateUser(id:number, user:UpdatedUserDto):Promise<SafeUserModel>{
        const  currentUser = await this.getOneUser(id);

        const sql = `
            UPDATE users
            SET
                full_name = ?,
                email = ?,
                role = ?,
                is_active = ?
            WHERE id_user = ?
        `;
        const values = [
            user.fullName ?? currentUser.fullName,
            user.email ?? currentUser.email,
            user.role ?? currentUser.role,
            user.isActive ?? currentUser.isActive,
            id

        ];
        const info = await dal.execute(sql,values) as OkPacketParams;
        if(info.affectedRows === 0){
            throw new ResourceNotFoundError(id);
        }

        const updateUser = await this.getOneUser(id);

        return updateUser;
    }



    //DELETE user
    public async deleteUser(id:number):Promise<void>{
        const sql = `
            DELETE FROM users
            WHERE id_user = ?
        `;
        const values = [id];

        const info = await dal.execute(sql, values) as OkPacketParams;
        if(info.affectedRows === 0){
            throw new ResourceNotFoundError(id);
        }
    }

}


export const userService = new UserService();