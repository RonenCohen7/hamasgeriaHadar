import { CreatePaymentRequest, IPaymentProvider, PaymentResult, PaymentResultStatus, RefundPaymentRequest } from "../models/payment-model";


export class NoPaymentProvider implements IPaymentProvider {

    public async createPayment(request: CreatePaymentRequest): Promise<PaymentResult> {
        
        void request;

        const result = new PaymentResult();

        result.status = PaymentResultStatus.Pending;
        result.paymentReference = null;
        result.externalDocumentId = null;
        result.externalDocumentNumber = null;
        result.message = "No Payment provider configured"

        return result;
    }

    public async refoundPayment(request: RefundPaymentRequest): Promise<PaymentResult> {
        
        void request;

        const result = new PaymentResult();

        result.status = PaymentResultStatus.Pending;
        result.paymentReference = null;
        result.externalDocumentId = null;
        result.externalDocumentNumber = null;
        result.message = "No payment provider configured";

        return result;
    }
}