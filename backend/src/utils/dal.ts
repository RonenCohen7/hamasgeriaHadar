import mysql2, { PoolOptions, QueryError, QueryResult } from "mysql2";
import { appConfig } from "./app-config";

class Dal {

    private readonly options: PoolOptions = {
        host: appConfig.mysqlHost,
        user: appConfig.mysqlUser,
        password: appConfig.mysqlPassword,
        database: appConfig.mysqlDatabase
    };

    private readonly connection = mysql2.createPool(this.options);

    public execute(sql: string, values?: (string | boolean | number | Date | null)[]): Promise<QueryResult> {
        return new Promise<QueryResult>((resolve, reject) => {
            this.connection.query(sql, values, (err: QueryError | null, result: QueryResult) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });

        });
    }
}

export const dal = new Dal();
