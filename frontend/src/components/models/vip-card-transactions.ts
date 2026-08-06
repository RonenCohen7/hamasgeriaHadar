export type VipCardTransactionType =
    | "load"
    | "payment"
    | "refund"
    | "adjustment";


export class VipCardTransactionModel {
    idVipTransaction!: number;

    idVipCard!: number;

    idSale!: number | null;

    createdBy!: number;

    transactionType!: VipCardTransactionType;

    amount!: number;

    balanceBefore!: number;

    balanceAfter!: number;

    notes!: string | null;

    createdAt!: string;

}