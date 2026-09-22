import express, { Request, Response } from "express";
import { whatsappService } from "../services/whatsapp-service";

class WhatsAppController {

    public readonly router = express.Router();

    public constructor() {
        this.router.get("/api/whatsapp/webhook", this.verifyWebhook);
        this.router.post("/api/whatsapp/webhook", this.receiveMessage);
    }


    private verifyWebhook = (request: Request, response: Response): void => {

        const mode = request.query["hub.mode"];
        const token = request.query["hub.verify_token"];
        const challenge = request.query["hub.challenge"];

        const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
        
        console.log("mode:", mode);
        console.log("token from request:", token);
        console.log("token from env:", verifyToken);


        if (mode === "subscribe" && token === verifyToken) {

            console.log("WhatsApp webhook verified successfully.");

            response.status(200).send(challenge);
            return;
        }

        console.log("WhatsApp webhook verification failed.");

        response.sendStatus(403);
    };


    private receiveMessage = (request: Request, response: Response): void => {

        try {

            const message =
                whatsappService.extractIncomingMessage(request.body);

            if (message) {

                console.log("WhatsApp message received:");
                console.log("Phone:", message.phone);
                console.log("Message:", message.text);
                console.log("Message ID:", message.messageId);

            }

            response.sendStatus(200);

        }
        catch (err: any) {

            console.error("WhatsApp webhook error:", err);

            response.sendStatus(500);
        }
    };
}

export const whatsappController = new WhatsAppController();