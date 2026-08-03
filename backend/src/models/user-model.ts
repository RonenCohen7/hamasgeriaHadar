import { UserRole } from "./enum";

export class UserModel {
    idUser!: number;
    firstName!: string;
    lastName!: string;
    email!: string;
    password!: string;
    role!: UserRole;
    isActive!: boolean;
    createdAt!: Date;
    updatedAt!: Date;
}

export class RegisterUserDto {
    firstName!: string;
    lastName!: string;
    email!: string;
    password!: string;
    role!: UserRole;
}

export class LoginUserDto {
    email!: string;
    password!: string;
}

export class UpdatedUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    isActive?: boolean;
}

export class SafeUserModel {
    idUser!: number;
    firstName!: string;
    lastName!: string;
    email!: string;
    role!: UserRole;
    isActive!: boolean;
    createdAt!: Date;
}

export class AuthResponseModel {
    token!: string;
    user!: SafeUserModel;
}