export interface WhatsAppIncomingMessage {
    phone: string;
    messageId: string;
    text: string;
    timestamp?: string;
}

export interface WhatsAppSendMessage {
    to: string;
    text: string;
}