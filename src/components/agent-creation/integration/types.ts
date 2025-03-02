
import { WebhookFormValues } from "./WebhooksTab";
import { ApiFormValues } from "./ApiTab";

export interface IntegrationFormValues {
  // Webhook related fields
  enableWebhook: boolean;
  webhookUrl?: string;
  webhookEvents: string[];
  authType: string;
  authDetails?: {
    username?: string;
    password?: string;
    token?: string;
    headerName?: string;
  };
  // API related fields
  apiKey?: string;
  enableRateLimit: boolean;
  rateLimitPerMinute: number;
}

export type WebhookTabData = Pick<
  IntegrationFormValues, 
  'enableWebhook' | 'webhookUrl' | 'webhookEvents' | 'authType' | 'authDetails'
>;

export type ApiTabData = Pick<
  IntegrationFormValues,
  'apiKey' | 'enableRateLimit' | 'rateLimitPerMinute'
>;
