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