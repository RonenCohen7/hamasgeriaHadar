import { useEffect,  useState } from "react";
import "./card-transactions.css";
import { VipCardTransactionModel } from "../../models/vip-card-transactions";
import { vipCardService } from "../../service/vipCardService";




type cardTransactionsProps = {
    idVipCard: number;
}

export function CardTransactions({ idVipCard }: cardTransactionsProps) {

    const [transactions, setTransactions ] = useState<VipCardTransactionModel[]>([]);
    const [isLoading , setIsLoading] = useState(true);


    useEffect(()=>{
        vipCardService
            .getAllTransactionByCard(idVipCard,undefined,undefined,undefined,1,10)
            .then(setTransactions)
            .catch(console.error)
            .finally(()=> setIsLoading(false))
    },[idVipCard]);


    if(isLoading){
        return <p>Loading transactions...</p>
    }

    if(transactions.length === 0){
        return <p>No transactions found</p>
    }

    return (
        <div className="CardTransactions">

            {transactions.map(transaction => (
                <div className="transaction-item" key={transaction.idVipTransaction}
                >
                    <div>
                        <strong>{transaction.transactionType}</strong>
                        <p>
                            {transaction.notes || "No notes"}
                        </p>
                    </div>


                    <div className={`transaction-amount ${transaction.transactionType}`}>
                        {transaction.transactionType === "payment" ? "-": "+"}
                        ₪{Number(transaction.amount).toFixed(2)}
                    </div>

                    <small>
                        {new Date(transaction.createdAt).toLocaleDateString("en-GB")}
                    </small>

                </div>
            ))}

        </div>
    );
}
