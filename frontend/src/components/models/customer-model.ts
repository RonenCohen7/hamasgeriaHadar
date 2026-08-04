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