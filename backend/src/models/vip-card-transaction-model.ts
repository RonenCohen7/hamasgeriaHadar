export enum  VipCardTransactionType {
    Load = "load",
    Payment = "payment",
    Refund = "refound",
    Adjustment = "adjustment"
}

export class VipCardTransactionModel{
    idVipTransaction!: number;
    idVipCard!: number;
    idSale!: number;
    createdBy!: number;
    transactionType!: VipCardTransactionType;
    amount!: number;
    balanceBefore!: number;
    balanceAfter!:number;
    notes!: string | null;
    createdAt!: Date
}


export class AddVipCardTransactionDto{
    idVipCard!: number;
    idSale?: Number | null;
    transaction!: number;
    notes?: string | null;
}