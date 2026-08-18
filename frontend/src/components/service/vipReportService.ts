import axios from "axios";
import { appConfig } from "../utils/app-config";
import * as XLSX from "xlsx";


export interface VipPurchasesReport {

    transactionDate: string;

    productId: number;

    productName: string;

    quantity: string;

    unitPrice: string;

    lineTotal: string;

    paymentMethod: string;

    vipCardNumber: string;

    cardHolderName: string;

    cardHolderEmail: string;

    cardHolderPhone: string;

}


class VipReportService {


    // Get Report All purchase card vip
    public async getVipPurchases(): Promise<VipPurchasesReport[]> {

        const response = await axios.get<VipPurchasesReport[]>(
            `${appConfig.baseUrl}reports/vip-purchases`
        );

        return response.data;

    }


    public async getVipPurchasesToExcel(data:VipPurchasesReport[]) {

        

        const rows = data.map(item => ({

            date: new Date(
                item.transactionDate
            ).toLocaleString("he-IL"),

            idProduct: item.productId,

            productName: item.productName,

            quantity: Number(item.quantity),

            unitPrice: Number(item.unitPrice),

            total: Number(item.lineTotal),

            vipCardNumber: item.vipCardNumber,

            firstName: item.cardHolderName,

            email: item.cardHolderEmail,

            phone: item.cardHolderPhone

        }));


        const worksheet =
            XLSX.utils.json_to_sheet(rows);


        worksheet["!cols"] = [

            { wch: 22 },

            { wch: 12 },

            { wch: 25 },

            { wch: 10 },

            { wch: 14 },

            { wch: 14 },

            { wch: 22 },

            { wch: 20 },

            { wch: 30 },

            { wch: 18 }

        ];


        const workbook =
            XLSX.utils.book_new();


        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "VIP Purchases"
        );


        XLSX.writeFile(
            workbook,
            "VIP-purchases.xlsx"
        );

    }

}


export const vipReportService =
    new VipReportService();