import {
    WhatsAppIncomingMessage,
    WhatsAppSendMessage
} from "../models/whatsapp-message-model";

class WhatsAppService {

    public extractIncomingMessage(body: any): WhatsAppIncomingMessage | null {

        const message =
            body?.entry?.[0]
                ?.changes?.[0]
                ?.value
                ?.messages?.[0];

        if (!message) {
            return null;
        }

        if (message.type !== "text") {
            return null;
        }

        return {
            phone: message.from,
            messageId: message.id,
            text: message.text?.body ?? "",
            timestamp: message.timestamp
        };
    }


    public async sendMessage(message: WhatsAppSendMessage): Promise<void> {

        console.log("WhatsApp outgoing message:", message);

        // בשלב הזה עדיין לא שולחים בפועל ל-Meta.
        // קודם נבדוק קבלה של הודעות דרך ה-webhook.
    }
}

export const whatsappService = new WhatsAppService();