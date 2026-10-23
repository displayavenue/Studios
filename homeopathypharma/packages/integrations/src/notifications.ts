/**
 * Notification providers — SERVER-SIDE ONLY.
 * TODO: Wire SMTP (nodemailer), SMS (MSG91/Twilio), WhatsApp (Meta Cloud API) in worker service.
 */

export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: string[];
}

export interface SmsMessage {
  to: string;
  body: string;
  templateId?: string;
  variables?: Record<string, string>;
}

export interface WhatsAppMessage {
  to: string;
  templateName: string;
  languageCode: string;
  components?: Array<{
    type: "body" | "header" | "button";
    parameters: Array<{ type: "text"; text: string }>;
  }>;
}

export interface NotificationResult {
  providerMessageId: string;
  status: "queued" | "sent" | "failed";
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<NotificationResult>;
}

export interface SmsProvider {
  send(message: SmsMessage): Promise<NotificationResult>;
}

export interface WhatsAppProvider {
  send(message: WhatsAppMessage): Promise<NotificationResult>;
}

export class NotificationNotConfiguredError extends Error {
  constructor(channel: "email" | "sms" | "whatsapp") {
    super(`${channel} provider not configured. Set provider credentials in environment.`);
    this.name = "NotificationNotConfiguredError";
  }
}

export const stubEmailProvider: EmailProvider = {
  async send() {
    throw new NotificationNotConfiguredError("email");
  },
};

export const stubSmsProvider: SmsProvider = {
  async send() {
    throw new NotificationNotConfiguredError("sms");
  },
};

export const stubWhatsAppProvider: WhatsAppProvider = {
  async send() {
    throw new NotificationNotConfiguredError("whatsapp");
  },
};

export type NotificationChannel = "email" | "sms" | "whatsapp";

export interface NotificationDispatcher {
  email: EmailProvider;
  sms: SmsProvider;
  whatsapp: WhatsAppProvider;
}

export const stubNotificationDispatcher: NotificationDispatcher = {
  email: stubEmailProvider,
  sms: stubSmsProvider,
  whatsapp: stubWhatsAppProvider,
};
