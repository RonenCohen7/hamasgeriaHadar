

export class CustomerModel{
    idCustomer!: number;
    firstName!: string;
    lastName!:string;
    phone!: string | null;
    email!: string | null;
    dateOfBirth!:string | null;
    isActive!: boolean;
    createdAt!: string;
    updatedAt!: string;
    hasVipCard!: boolean;
}

export class AddCustomerDto{
    firstName!: string;
    lastName!: string;
    phone?:  string | null;
    email?: string | null;
    dateOfBirth?: string | null;
}


export class updateCustomerDto {
    firstName?:string;
    lastName?: string;
    phone?:string | null;
    email?:string | null;
    dateOfBirth?:string | null;
    isActive?: boolean;
}

export class CustomerLoginDto {
    email!: string;
    password!: string;
}

export class CustomerRegisterDto {
    firstName!:string;
    lastName!: string;
    email!:string;
    password!:string;
    phone!: string;
}


export class CustomerAuthResponseModel {
    token!: string;
    customer!:{
        idCustomer: number;
        idAccount: number;
        firstName: string;
        lastName: string;
        email:string;
        phone:string;
        isActive:boolean;
        createdAt:Date;
    }
}
