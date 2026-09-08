export type NotificationPayload = {
  userId: string;
  title: string;
  body?: string;
  link?: string;
  type: "ORDER" | "REPORT" | "SUBSCRIPTION" | "SYSTEM";
};

export interface NotificationProvider {
  send(payload: NotificationPayload): Promise<{ id: string; mock: boolean }>;
}
