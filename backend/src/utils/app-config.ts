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


    public readonly productImages = "storage/products";  //save in docker 



    public readonly experienceImages = "storage/experiences";

    public readonly baseEventImageUrl = process.env.BASE_EVENT_IMAGE_URL!;

    public readonly baseExperienceImageUrl = process.env.BASE_EXPERIENCE_IMAGE_URL!;

    public readonly baseImageUrl = process.env.BASE_IMAGE_URL!;

    public readonly frontendUrl = process.env.FRONTEND_URL!;


    //Ready for Caspit payment
    public readonly paymentProvider = process.env.PAYMENT_PROVIDER;

    public readonly paymentApiUrl = process.env.PAYMENT_API_URL;

    public readonly paymentApiKey = process.env.PAYMENT_API_KEY;

    public readonly paymentApiSecret = process.env.PAYMENT_API_SECRET;

    public readonly paymentTerminalId = process.env.PAYMENT_TERMINAL_ID;

    public readonly paymentBusinessId = process.env.PAYMENT_BUSINESS_ID;




}

export const appConfig = new AppConfig();