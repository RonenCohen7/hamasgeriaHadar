export enum PaymentResultStatus {
    Pending = "pending",
    Approved = "approved",
    Failed = "failed",
    Cancelled = "cancelled",
    Refunded = "refunded"
}


export class PaymentResult {
    status!: PaymentResultStatus;

    paymentReference!:string | null;

    externalDocumentId!: string | null;

    externalDocumentNumber!: string | null;

    message!: string | null;
}


export class CreatePaymentRequest {

    saleId!: number;

    amount!: number;

    customerId!: number | null;
    
    vipCardId!: number | null;

    description!: string;
}


export class RefundPaymentRequest {
    saleId!: number;

    amount!: number;

    reason!: string;
}

export enum PaymentProvider {
    None = "none",
    Caspit = "caspit",
    Tranzila = "tranzila",
    Pelecard = "pelecard",
    Meshulam = "meshulam"
}


export interface IPaymentProvider {
    createPayment(request: CreatePaymentRequest): Promise<PaymentResult>

    refoundPayment(request: RefundPaymentRequest):Promise<PaymentResult>
}