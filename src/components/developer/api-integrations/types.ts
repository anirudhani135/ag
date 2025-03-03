
export interface ApiKey {
  id: string;
  key: string;
  created_at: string;
  last_used?: string;
  description?: string;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  created_at: string;
  status: 'active' | 'inactive';
}
