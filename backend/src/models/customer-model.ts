export class CustomerModel {
    idCustomer!: number;
    idAccount!: number;

    firstName!: string;
    lastName!: string;
    phone!: string | null;
    email!: string;

    dateOfBirth!: Date | null;

    isActive!: boolean;
    hasVipCard!: boolean;
    tier!: string | null;

    createdAt!: Date;
    updatedAt!: Date;
}

export class AddCustomerDto {
    firstName!: string;
    lastName!: string;

    phone?: string;
    email!: string;

    password!: string;

    dateOfBirth?: Date;
}

export class UpdateCustomerDto {
    firstName?: string;
    lastName?: string;
    phone?: string | null;
    email?: string | null;
    dateOfBirth?: string | null;
    isActive?: boolean;

}


export class CustomerRegisterDto {
    firstName!: string;
    lastName!: string;

    email!: string;
    password!: string;

    hasVipCard!: boolean;
    tier!: string| null;

    phone!: string;
    dateOfBirth?: string | null;
}


export class CustomerLoginDto {
    email!: string;
    password!: string;
}

export class SafeCustomerModel {
    idCustomer!: number;
    idAccount!: number;

    firstName!: string;
    lastName!: string;
    tier!: string | null;
    email!: string;
    phone!: string;
    hasVipCard!: boolean;
    isActive!: boolean;

    createdAt!: Date;
}


export class CustomerAuthResponseModel {
    token!: string;
    customer!: SafeCustomerModel;
}