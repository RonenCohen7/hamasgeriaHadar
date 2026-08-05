export enum  VipCardTransactionType {
    Load = "load",
    Payment = "payment",
    Refund = "refund",
    Adjustment = "adjustment"
}

export class VipCardTransactionModel{
    idVipTransaction!: number;
    idVipCard!: number;
    idSale!: number | null;
    createdBy!: number;
    transactionType!: VipCardTransactionType;
    amount!: number;
    balanceBefore!: number;
    balanceAfter!:number;
    notes!: string | null;
    createdAt!: string
}

export class AddVipCardTransactionDto {
    idVipCard!: number;
    idSale?: number | null;
    transactionType!: VipCardTransactionType;
    amount!: number;
    notes?: string | null;
}

export class RechargeVipCardDto {
    amount!: number;
    notes?: string | null;
}