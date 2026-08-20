import { CreatePaymentRequest, PaymentResult, PaymentResultStatus, RefundPaymentRequest } from "../models/payment-model";
import { appConfig } from "../utils/app-config";


class PaymentService {

    //Get Provider
    public getProvider(): string{
        return appConfig.paymentProvider ?? "none";
    }

    public isConfigured(): boolean {
        return !! (
            appConfig.paymentApiUrl && 
            appConfig.paymentApiKey
        );
    }



    //Create Payment
    public async createPayment(request:CreatePaymentRequest):Promise<PaymentResult>{

        const result = new PaymentResult();

        result.status = PaymentResultStatus.Pending;
        result.paymentReference = null;
        result.externalDocumentId = null;
        result.externalDocumentNumber = null;
        result.message = ` Payment provider ${this.getProvider()} is not implement`;

        return result;
        
    }


    //Refound Payment
    public async refundPayment(request: RefundPaymentRequest):Promise<PaymentResult>{

        void request;

        const result = new PaymentResult();

        result.status = PaymentResultStatus.Pending;
        result.paymentReference = null;
        result.externalDocumentId = null;
        result.externalDocumentNumber = null;
        result.message = `Refound provider ${this.getProvider()} is not implemented`;

        return result;

    }

}

export const paymentService = new PaymentService();