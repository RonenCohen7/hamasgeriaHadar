import { UserRole } from "./enum";

export interface UserModel {
    idUser: number;
    fullName:string;
    email:string;
    passwordHash:string;
    role:UserRole;
    isActive:boolean;
    createdAt:Date;
    updatedAt:Date;
}


export interface RegisterUserDto {
    fullName: string;
    email:string;
    password: string;
    role:UserRole;
}

export interface LoginUserDto {
    email:string;
    password: string;
}

export interface UpdatedUserDto {
    fullName?:string;
    email?: string;
    password?:string;
    role?: UserRole;
    isActive?: boolean;
}


export interface SafeUserModel {
    idUser: number,
    fullName:string;
    email:string;
    role:UserRole;
    isActive: boolean;
    createdAt:Date;
}


export interface AuthResponseModel {
    token: string;
    user : SafeUserModel;
}