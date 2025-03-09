
// Review type definition
export interface Review {
  id: string;
  agent_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at?: string;
  updated_at?: string;
}
