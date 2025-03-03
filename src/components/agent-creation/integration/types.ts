
// Webhook related types
export interface WebhookFormValues {
  enableWebhook: boolean;
  webhookUrl?: string;
  webhookEvents: string[];
  authType: "none" | "basic" | "bearer" | "api_key";
  authDetails?: {
    username?: string;
    password?: string;
    token?: string;
    headerName?: string;
  };
}

// API related types
export interface ApiFormValues {
  apiKey?: string;
  enableRateLimit: boolean;
  rateLimitPerMinute: number;
}

// Add the missing IntegrationFormData export to fix the import errors
export type IntegrationFormData = IntegrationFormValues;

// Combined integration form values
export interface IntegrationFormValues {
  // Webhook related fields
  enableWebhook: boolean;
  webhookUrl?: string;
  webhookEvents: string[];
  authType: "none" | "basic" | "bearer" | "api_key";
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
