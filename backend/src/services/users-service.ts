import { OkPacketParams } from "mysql2";
import { AuthResponseModel, LoginUserDto, RegisterUserDto, SafeUserModel, UpdatedUserDto, UserModel } from "../models/user-model";

import { dal } from "../utils/dal";

import { ResourceNotFoundError } from "../models/client-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sanitizeText } from "../utils/sanitize";

class UserService {

    //Register
    public async registerUser(user: RegisterUserDto): Promise<SafeUserModel> {
        user.firstName = sanitizeText(user.firstName);
        user.lastName = sanitizeText(user.lastName);
        user.email = sanitizeText(user.email).toLowerCase();

        const hashedPassword = await bcrypt.hash(user.password, 12);

        //Add data to account table
        const accountSql = `
            INSERT INTO accounts (
            email,
            password,
            account_type,
            is_active
            )
            VALUES(?,?,?,?)
        `;

        const accountInfo = await dal.execute(accountSql,[
            user.email,
            hashedPassword,
            "employee",
            true
        ]) as OkPacketParams;
        const idAccount = Number(accountInfo.insertId);

        //Add data to Users table
        const sql = `
            INSERT INTO users(
                first_name,
                last_name,
                email,
                password,
                role,
                is_active,
                id_account
            )
            VALUES (?, ?, ?, ?, ?,?,?)
        `;

        const values = [
            user.firstName,
            user.lastName,
            user.email,
            hashedPassword,
            user.role,
            true,
            idAccount
        ];

        const info =
            await dal.execute(sql, values) as OkPacketParams;

        const addedUser: SafeUserModel = {
            idUser: info.insertId!,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isActive: true,
            idAccount,
            createdAt: new Date()
        };

        return addedUser;
    }


    //Login
    public async login(credentials: LoginUserDto): Promise<AuthResponseModel> {
        credentials.email = sanitizeText(credentials.email).toLowerCase();
        const sql = `
            SELECT 
                id_user As idUser,
                first_name As firstName,
                last_name As lastName,
                email,
                password,
                role,
                is_active As isActive,
                id_account,
                created_at As createdAt,
                updated_at As updateAt
            FROM users
            WHERE email = ?
        `
        const users = await dal.execute(sql, [credentials.email]) as UserModel[];
        const user = users[0];
        if (!user) {
            throw new Error("Invalid email or password");
        }
        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) {
            throw new Error("Invalid Email Or Password")
        }
        const safeUser: SafeUserModel = {
            idUser: user.idUser,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            idAccount: user.idAccount,
            createdAt: user.createdAt
        };
        const token = jwt.sign(
            {
                idUser: user.idUser,
                role: user.role
            },
            process.env.JWT_SECRET!, { expiresIn: "8h" }
        )
        return {
            token,
            user: safeUser
        }
    }



    //Get All Users
    public async getAllUsers(): Promise<UserModel[]> {
        const sql = `
            SELECT 
               *
            FROM users
            
        `;

        const users = await dal.execute(sql) as UserModel[];

        return users
    }


    //Get User By Id
    public async getOneUser(id: number): Promise<UserModel> {
        const sql = `
            SELECT *
            FROM users
            WHERE id_user = ?
        `;
        const values = [id];

        const users = await dal.execute(sql, values) as UserModel[];

        const user = users[0];

        return user;
    }


    public async updateUser(id: number, user: UpdatedUserDto): Promise<SafeUserModel> {
        const currentUser = await this.getOneUser(id);
        if (user.firstName !== undefined) {
            user.firstName = sanitizeText(user.firstName);
        }

        if (user.lastName !== undefined) {
            user.lastName = sanitizeText(user.lastName);
        }

        if (user.email !== undefined) {
            user.email = sanitizeText(
                user.email
            ).toLowerCase();
        }

        const sql = `
            UPDATE users
            SET
                first_name = ?,
                last_name =?,
                email = ?,
                role = ?,
                is_active = ?
            WHERE id_user = ?
        `;
        const values = [
            user.firstName ?? currentUser.firstName,
            user.lastName ?? currentUser.lastName,
            user.email ?? currentUser.email,
            user.role ?? currentUser.role,
            user.isActive ?? currentUser.isActive,
            id

        ];
        const info = await dal.execute(sql, values) as OkPacketParams;
        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(id);
        }

        const updateUser = await this.getOneUser(id);

        return updateUser;
    }



    //DELETE user
    public async deleteUser(id: number): Promise<void> {
        const sql = `
            DELETE FROM users
            WHERE id_user = ?
        `;
        const values = [id];

        const info = await dal.execute(sql, values) as OkPacketParams;
        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(id);
        }
    }

}


export const userService = new UserService();