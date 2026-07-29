import dotenv from "dotenv"

dotenv.config({ quiet: true })

class AppConfig {
    public readonly isDevelopment = process.env.ENVIRONMENT === "development";
    public readonly isProduction = process.env.ENVIRONMENT === "production";
    public readonly port = Number(process.env.PORT);
    public readonly mysqlHost = process.env.MYSQL_HOST;
    public readonly mysqlUser = process.env.MYSQL_USER;
    public readonly mysqlPassword = process.env.MYSQL_PASSWORD;
    public readonly mysqlDatabase = process.env.MYSQL_DATABASE;

    public readonly productImages = "src/assets/images/products";
    public readonly baseImageUrl = process.env.BASE_IMAGE_URL!;
}

export const appConfig = new AppConfig();