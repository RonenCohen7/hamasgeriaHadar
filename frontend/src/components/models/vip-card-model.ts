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

    cardNumber!: number;

    idCustomer!: Number;

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

    datOfBirth!: string | null

    isActive!:boolean;
}