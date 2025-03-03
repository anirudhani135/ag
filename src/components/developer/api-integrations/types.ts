
export interface ApiKey {
  id: string;
  key: string;
  developer_id: string;
  created_at: string;
  last_used?: string;
  status: 'active' | 'revoked';
  description?: string;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  developer_id: string;
  created_at: string;
  status: 'active' | 'inactive';
  secret?: string;
}

export interface GenerateApiKeyRequest {
  description?: string;
}

export interface GenerateApiKeyResponse {
  id: string;
  key: string;
  created_at: string;
}

export interface AddWebhookRequest {
  url: string;
  events: string[];
}

export interface AddWebhookResponse {
  id: string;
  url: string;
  events: string[];
  created_at: string;
}
