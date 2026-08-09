export class CustomerModel {
    idCustomer!: number;
    firstName!: string;
    lastName!: string;
    phone!: string | null;
    email!: string | null;
    dateOfBirth!: string | null;
    isActive!: boolean;
    createdAt!: Date;
    updatedAt!: Date;
    hasVipCard!: boolean;
}

export class AddCustomerDto {
    firstName!: string;
    lastName!: string;
    phone?: string | null;
    email?: string | null;
    dateOfBirth?: string | null;
    hasVipCard!: boolean | null;
}

export class UpdateCustomerDto {
    firstName?: string;
    lastName?: string;
    phone?: string | null;
    email?: string | null;
    dateOfBirth?: string | null;
    isActive?: boolean;
    hasVipCard!: boolean |null;
}


export class CustomerRegisterDto {
    firstName!: string;
    lastName!: string;

    email!:string;
    password!: string;

    phone!: string
}


export class CustomerLoginDto{
    email!: string;
    password!: string;
}

export class SafeCustomerModel {
    idCustomer!: number;
    idAccount!: number;

    firstName!: string;
    lastName!: string;

    email!: string;
    phone!: string;

    isActive!: boolean;

    createdAt!:Date;
}


export class CustomerAuthResponseModel {
    token!: string;
    customer!: SafeCustomerModel;
}