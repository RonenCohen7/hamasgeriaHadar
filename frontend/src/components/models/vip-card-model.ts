export type VipTir =
    | "bronze"
    | "silver"
    | "gold"



export type VipCardStatus =
    | "active"
    | "blocked"
    | "expired"
    | "cancelled"

export class VipCardModel {
    idVipCard!: number;

    cardNumber!: string;

    idCustomer!: number;

    tier!: VipTir;

    externalCard!: boolean;

    balance!: number;

    issuedAt!:string;

    expiresAt!: string;

    cardStatus!: VipCardStatus;

    createdAt!: string;

    updatedAt!: string;

    firstName!: string;

    lastName!: string;

    phone!: string | null;

    email!: string | null;

    dateOfBirth!: string | null

    isActive!:boolean;
}