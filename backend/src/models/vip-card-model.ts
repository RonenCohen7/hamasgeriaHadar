export enum VipCardStatus {
    Active = "active",
    Blocked = "blocked",
    Expired = "expired",
    Cancelled = "cancelled"
}


export class VipCardModel {
    idVipCard!: number;
    cardNumber!: string;
    idCustomer!: number;
    balance!: number;
    issuedAt!:Date;
    expiresAt!:Date;
    cardStatus!: VipCardStatus;
    createdAt!: Date;
    updatedAt!: Date;
}


export class AddVipCardDto{
    idCustomer!: number;
    balance?: number;
    expiresAt?: Date | null;
}

export class VipCardDetailsModel extends VipCardModel {
    customerName!: string;
    customerPhone!: string | null;
    customerEmail!: string| null;
}