import { PaymentProvider, PaymentResultStatus } from "../models/payment-model";
import { SaleOrderModel } from "../models/sale-order-model";
import { appConfig } from "../utils/app-config";
import { dal } from "../utils/dal";

class MakeService {

    public async sendNewOrder(sale: SaleOrderModel):Promise<void>{
        
        if(!appConfig.makeNewOrderWebhookUrl) return;


        const customers = await dal.execute(
            `
                SELECT
                    first_name AS firstName,
                    last_name As lastName,
                    email,
                    phone
                From customers
                WHERE id_customer = ?
            `,
            [sale.idCustomer]
        ) as {
            firstName: string,
            lastName:string,
            email:string,
            phone:string |null
        }[];

        const customer = customers[0]

        const response = await fetch(
            appConfig.makeNewOrderWebhookUrl,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    orderId: sale.idSale,
                    date: sale.createdAt,
                    customer: customer 
                        ? `${customer.firstName} ${customer.lastName}`
                        : "",
                    email: customer?.email ?? "",
                    phon: customer?.phone ?? "",
                    items: sale.eventName 
                        ? `${sale.eventName} X ${sale.ticketQuantity ?? 1}`
                        : "",
                    amount: sale.totalAmount,
                    paymentMethod: sale.paymentMethod ?? "",
                    paymentStatus: sale.saleStatus
                    })
            }
        );

        if(!response.ok) {
            throw new Error(`Make webhook failed: ${response.status}`)
        }
    }
}

export const makeService = new MakeService();