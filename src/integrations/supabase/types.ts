export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agent_analytics: {
        Row: {
          agent_id: string | null
          id: string
          metric_type: string
          timestamp: string | null
          value: number
        }
        Insert: {
          agent_id?: string | null
          id?: string
          metric_type: string
          timestamp?: string | null
          value: number
        }
        Update: {
          agent_id?: string | null
          id?: string
          metric_type?: string
          timestamp?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "agent_analytics_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_logs: {
        Row: {
          agent_id: string | null
          created_at: string | null
          id: string
          log_type: string | null
          message: string | null
          metadata: Json | null
          version_id: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          id?: string
          log_type?: string | null
          message?: string | null
          metadata?: Json | null
          version_id?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          id?: string
          log_type?: string | null
          message?: string | null
          metadata?: Json | null
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_logs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_logs_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "agent_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_metrics: {
        Row: {
          agent_id: string | null
          created_at: string | null
          date: string | null
          id: string
          purchases: number | null
          revenue: number | null
          unique_views: number | null
          views: number | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          purchases?: number | null
          revenue?: number | null
          unique_views?: number | null
          views?: number | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          purchases?: number | null
          revenue?: number | null
          unique_views?: number | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_metrics_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_test_environments: {
        Row: {
          agent_id: string | null
          configuration: Json | null
          created_at: string | null
          environment_name: string
          id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          configuration?: Json | null
          created_at?: string | null
          environment_name: string
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          configuration?: Json | null
          created_at?: string | null
          environment_name?: string
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_test_environments_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_versions: {
        Row: {
          agent_id: string | null
          api_endpoint: string | null
          changes: string | null
          created_at: string | null
          created_by: string | null
          id: string
          published_at: string | null
          runtime_config: Json | null
          status: string | null
          version_number: string
        }
        Insert: {
          agent_id?: string | null
          api_endpoint?: string | null
          changes?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          published_at?: string | null
          runtime_config?: Json | null
          status?: string | null
          version_number: string
        }
        Update: {
          agent_id?: string | null
          api_endpoint?: string | null
          changes?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          published_at?: string | null
          runtime_config?: Json | null
          status?: string | null
          version_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_versions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          api_endpoint: string | null
          api_key: string | null
          category_id: string | null
          changelog: string | null
          comparison_data: Json | null
          created_at: string
          current_version_id: string | null
          demo_url: string | null
          deployment_status: string | null
          description: string
          developer_id: string
          documentation_url: string | null
          features: Json | null
          id: string
          integration_guide: string | null
          last_updated: string | null
          price: number
          rating: number | null
          reviews_count: number | null
          runtime_config: Json | null
          search_vector: unknown | null
          status: string | null
          technical_requirements: Json | null
          test_results: Json | null
          title: string
          updated_at: string
          version: string | null
          version_number: string | null
        }
        Insert: {
          api_endpoint?: string | null
          api_key?: string | null
          category_id?: string | null
          changelog?: string | null
          comparison_data?: Json | null
          created_at?: string
          current_version_id?: string | null
          demo_url?: string | null
          deployment_status?: string | null
          description: string
          developer_id: string
          documentation_url?: string | null
          features?: Json | null
          id?: string
          integration_guide?: string | null
          last_updated?: string | null
          price: number
          rating?: number | null
          reviews_count?: number | null
          runtime_config?: Json | null
          search_vector?: unknown | null
          status?: string | null
          technical_requirements?: Json | null
          test_results?: Json | null
          title: string
          updated_at?: string
          version?: string | null
          version_number?: string | null
        }
        Update: {
          api_endpoint?: string | null
          api_key?: string | null
          category_id?: string | null
          changelog?: string | null
          comparison_data?: Json | null
          created_at?: string
          current_version_id?: string | null
          demo_url?: string | null
          deployment_status?: string | null
          description?: string
          developer_id?: string
          documentation_url?: string | null
          features?: Json | null
          id?: string
          integration_guide?: string | null
          last_updated?: string | null
          price?: number
          rating?: number | null
          reviews_count?: number | null
          runtime_config?: Json | null
          search_vector?: unknown | null
          status?: string | null
          technical_requirements?: Json | null
          test_results?: Json | null
          title?: string
          updated_at?: string
          version?: string | null
          version_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agents_current_version_id_fkey"
            columns: ["current_version_id"]
            isOneToOne: false
            referencedRelation: "agent_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agents_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_logs: {
        Row: {
          created_at: string | null
          event_type: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_metrics: {
        Row: {
          avg_session_duration: number | null
          created_at: string | null
          daily_active_users: number | null
          id: string
          metric_date: string
          new_users: number | null
          successful_transactions: number | null
          total_revenue: number | null
        }
        Insert: {
          avg_session_duration?: number | null
          created_at?: string | null
          daily_active_users?: number | null
          id?: string
          metric_date: string
          new_users?: number | null
          successful_transactions?: number | null
          total_revenue?: number | null
        }
        Update: {
          avg_session_duration?: number | null
          created_at?: string | null
          daily_active_users?: number | null
          id?: string
          metric_date?: string
          new_users?: number | null
          successful_transactions?: number | null
          total_revenue?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          last_active: string | null
          last_login: string | null
          login_count: number | null
          name: string | null
          notification_settings: Json | null
          preferences: Json | null
          role: string
          social_links: Json | null
          updated_at: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          email: string
          id: string
          last_active?: string | null
          last_login?: string | null
          login_count?: number | null
          name?: string | null
          notification_settings?: Json | null
          preferences?: Json | null
          role?: string
          social_links?: Json | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          last_active?: string | null
          last_login?: string | null
          login_count?: number | null
          name?: string | null
          notification_settings?: Json | null
          preferences?: Json | null
          role?: string
          social_links?: Json | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          agent_id: string
          amount: number
          buyer_id: string
          created_at: string
          id: string
          status: string | null
        }
        Insert: {
          agent_id: string
          amount: number
          buyer_id: string
          created_at?: string
          id?: string
          status?: string | null
        }
        Update: {
          agent_id?: string
          amount?: number
          buyer_id?: string
          created_at?: string
          id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          agent_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          agent_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          agent_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_agents: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_agents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_agents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          created_at: string
          filters: Json | null
          id: string
          query: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          filters?: Json | null
          id?: string
          query?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          filters?: Json | null
          id?: string
          query?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          agent_id: string | null
          amount: number
          created_at: string | null
          id: string
          metadata: Json | null
          payment_intent_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          amount: number
          created_at?: string | null
          id?: string
          metadata?: Json | null
          payment_intent_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          amount?: number
          created_at?: string | null
          id?: string
          metadata?: Json | null
          payment_intent_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_daily_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
