import { AddVipCardTransactionDto, VipCardTransactionModel } from "../models/vip-card-transaction-model";
import { dal } from "../utils/dal";


class VipCardTransactionService {


    //Add Transaction
    public async addTransaction(dto: AddVipCardTransactionDto, createdBy: number): Promise<VipCardTransactionModel> {


        const sql = `
            INSERT INTO vip_card_transactions(
                id_vip_card,
                id_sale,
                created_by,
                transaction_type,
                amount,
                balance_before,
                balance_after,
                notes
            )
            VALUES (?,?,?,?,?,?,?,?)
        `;


        const result = await dal.execute(sql, [
            dto.idVipCard,
            dto.idSale ?? null,
            createdBy,
            dto.transactionType,
            dto.amount,
            dto.balanceBefore,
            dto.balanceAfter,
            dto.notes ?? null
        ]) as { insertId: number };


        return await this.getTransactionById(result.insertId);
    }


    //Get Transaction By Id transaction
    public async getTransactionById(idVipTransaction: number): Promise<VipCardTransactionModel> {
        const sql = `
            SELECT
                id_vip_transaction AS idVipTransaction,
                id_vip_card AS idVipCard,
                id_sale AS idSale,
                created_by AS createdBy,
                created_at AS createdAt,
                transaction_type AS transactionType,
                amount,
                balance_before AS balanceBefore,
                balance_after AS balanceAfter,
                notes
            FROM vip_card_transactions
            WHERE id_vip_transaction = ? 
            LIMIT 1
        `;

        const transactions = await dal.execute(sql, [idVipTransaction]) as VipCardTransactionModel[];
        return transactions[0];
    }



    //Get Transaction By id Card VIP
    public async getTransactionsByCard(idVipCard: number, from?: string, to?: string, type?: string, page?: number, pageSize?: number): Promise<VipCardTransactionModel[]> {

        const conditions: string[] = ["id_vip_card = ?"];

        const values: (string | number | boolean | Date | null)[] = [idVipCard];

        if (from) {
            conditions.push("created_at >= ?");
            values.push(`${from} 00:00:00`);
        }

        if (to) {
            conditions.push("created_at <= ?");
            values.push(`${to} 23:59:59`);
        }

        if(type){
            conditions.push("transaction_type = ?");
            values.push(type);
        }

    

        let pagination = "";
        if(page && pageSize){
            const offset = (page -1) * pageSize;

            pagination = `LIMIT ? OFFSET ?`;

            values.push(pageSize);
            values.push(offset);
        }
        


        const sql = `
            SELECT
                id_vip_transaction AS idVipTransaction,
                id_vip_card AS idVipCard,
                id_sale AS idSale,
                created_by AS createdBy,
                transaction_type AS transactionType,
                amount,
                balance_before AS balanceBefore,
                balance_after AS balanceAfter,
                notes,
                created_at AS createdAt
            FROM vip_card_transactions
            WHERE ${conditions.join(" AND ")}
            ORDER BY created_at DESC
            ${pagination}
        `;
        return await dal.execute(sql, values) as VipCardTransactionModel[];
    }
}

export const vipCardTransactionService = new VipCardTransactionService();