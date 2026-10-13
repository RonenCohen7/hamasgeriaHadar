import nodemailer, { Transporter } from "nodemailer";
import { appConfig } from "../utils/app-config";


class MailService {

    private transporter: Transporter | null = null;


    public isConfigured(): boolean {
        return Boolean(appConfig.smtpHost && appConfig.smtpUser && appConfig.smtpPass && appConfig.mailFrom);
    }


    private getTransporter(): Transporter {

        if (!this.transporter) {
            this.transporter = nodemailer.createTransport({
                host: appConfig.smtpHost,
                port: appConfig.smtpPort,
                secure: appConfig.smtpSecure,
                auth: {
                    user: appConfig.smtpUser,
                    pass: appConfig.smtpPass
                }
            });
        }

        return this.transporter;
    }


    public async send(to: string, subject: string, html: string, text: string): Promise<void> {

        if (!this.isConfigured()) {
            throw new Error("SMTP is not configured (SMTP_HOST / SMTP_USER / SMTP_PASS / MAIL_FROM)");
        }

        await this.getTransporter().sendMail({
            from: appConfig.mailFrom,
            to,
            subject,
            html,
            text
        });
    }

}


export const mailService = new MailService();
