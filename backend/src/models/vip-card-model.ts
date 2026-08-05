export type VipTier = "bronze" | "silver" | "gold";

export type VipCardStatus =
    | "active"
    | "blocked"
    | "expired"
    | "cancelled";

export class VipCardModel {
    idVipCard!: number;
    cardNumber!: string;
    idCustomer!: number;
    tier!: VipTier;
    externalCard!: boolean;
    balance!: number;
    issuedAt!: string;
    expiresAt!: string | null;
    cardStatus!: VipCardStatus;
    createdAt!: string;
    updatedAt!: string;
    firstName!: string;
    lastName!: string;
    phone!: string | null;
    email!: string | null;
    dateOfBirth!: string | null;
    isActive!: boolean;
}

export type CreateVipCardDto = {
    idCustomer: number;
    cardNumber?: string | null;
};

export type UpdateVipCardDto = {
    tier?: VipTier;
    expiresAt?: string | null;
    cardStatus?:VipCardStatus;
    
};

export type RechargeVipCardDto = {
    amount:number;
}