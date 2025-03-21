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
      ab_tests: {
        Row: {
          agent_id: string | null
          end_date: string | null
          id: string
          metrics: Json | null
          name: string
          start_date: string | null
          status: string | null
          variant_a: Json
          variant_b: Json
        }
        Insert: {
          agent_id?: string | null
          end_date?: string | null
          id?: string
          metrics?: Json | null
          name: string
          start_date?: string | null
          status?: string | null
          variant_a: Json
          variant_b: Json
        }
        Update: {
          agent_id?: string | null
          end_date?: string | null
          id?: string
          metrics?: Json | null
          name?: string
          start_date?: string | null
          status?: string | null
          variant_a?: Json
          variant_b?: Json
        }
        Relationships: [
          {
            foreignKeyName: "ab_tests_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
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
      agent_configurations: {
        Row: {
          agent_id: string | null
          api_config: Json | null
          created_at: string | null
          environment_variables: Json | null
          id: string
          resource_allocation: Json | null
          runtime_config: Json | null
          updated_at: string | null
          version_id: string | null
        }
        Insert: {
          agent_id?: string | null
          api_config?: Json | null
          created_at?: string | null
          environment_variables?: Json | null
          id?: string
          resource_allocation?: Json | null
          runtime_config?: Json | null
          updated_at?: string | null
          version_id?: string | null
        }
        Update: {
          agent_id?: string | null
          api_config?: Json | null
          created_at?: string | null
          environment_variables?: Json | null
          id?: string
          resource_allocation?: Json | null
          runtime_config?: Json | null
          updated_at?: string | null
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_configurations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_configurations_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "agent_versions"
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
          avg_session_duration: unknown | null
          bounce_rate: number | null
          conversion_rate: number | null
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
          avg_session_duration?: unknown | null
          bounce_rate?: number | null
          conversion_rate?: number | null
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
          avg_session_duration?: unknown | null
          bounce_rate?: number | null
          conversion_rate?: number | null
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
          deployment_config: Json | null
          id: string
          integration_config: Json | null
          performance_metrics: Json | null
          published_at: string | null
          runtime_config: Json | null
          status: string | null
          test_cases: Json | null
          version_number: string
        }
        Insert: {
          agent_id?: string | null
          api_endpoint?: string | null
          changes?: string | null
          created_at?: string | null
          created_by?: string | null
          deployment_config?: Json | null
          id?: string
          integration_config?: Json | null
          performance_metrics?: Json | null
          published_at?: string | null
          runtime_config?: Json | null
          status?: string | null
          test_cases?: Json | null
          version_number: string
        }
        Update: {
          agent_id?: string | null
          api_endpoint?: string | null
          changes?: string | null
          created_at?: string | null
          created_by?: string | null
          deployment_config?: Json | null
          id?: string
          integration_config?: Json | null
          performance_metrics?: Json | null
          published_at?: string | null
          runtime_config?: Json | null
          status?: string | null
          test_cases?: Json | null
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
      api_metrics: {
        Row: {
          endpoint: string
          error_details: Json | null
          error_rate: number | null
          id: string
          ip_address: string | null
          request_method: string
          requests_count: number | null
          requests_per_minute: number | null
          response_time: number
          status_code: number
          timestamp: string | null
          user_agent: string | null
        }
        Insert: {
          endpoint: string
          error_details?: Json | null
          error_rate?: number | null
          id?: string
          ip_address?: string | null
          request_method: string
          requests_count?: number | null
          requests_per_minute?: number | null
          response_time: number
          status_code: number
          timestamp?: string | null
          user_agent?: string | null
        }
        Update: {
          endpoint?: string
          error_details?: Json | null
          error_rate?: number | null
          id?: string
          ip_address?: string | null
          request_method?: string
          requests_count?: number | null
          requests_per_minute?: number | null
          response_time?: number
          status_code?: number
          timestamp?: string | null
          user_agent?: string | null
        }
        Relationships: []
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
      case_studies: {
        Row: {
          challenge: string
          company: string
          created_at: string
          featured_image_url: string | null
          id: string
          industry: string
          is_featured: boolean | null
          logo_url: string | null
          results: Json
          solution: string
          title: string
        }
        Insert: {
          challenge: string
          company: string
          created_at?: string
          featured_image_url?: string | null
          id?: string
          industry: string
          is_featured?: boolean | null
          logo_url?: string | null
          results: Json
          solution: string
          title: string
        }
        Update: {
          challenge?: string
          company?: string
          created_at?: string
          featured_image_url?: string | null
          id?: string
          industry?: string
          is_featured?: boolean | null
          logo_url?: string | null
          results?: Json
          solution?: string
          title?: string
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
      chat_conversations: {
        Row: {
          agent_id: string | null
          created_at: string | null
          id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          sender_type: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          sender_type: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_usage: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      credit_usage_breakdown: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          service_name: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string | null
          id?: string
          service_name: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          service_name?: string
          user_id?: string
        }
        Relationships: []
      }
      deployment_environments: {
        Row: {
          config: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      deployment_history: {
        Row: {
          agent_id: string | null
          config_snapshot: Json | null
          deployed_at: string | null
          deployed_by: string | null
          id: string
          performance_impact: Json | null
          rollback_from: string | null
          status: string | null
          version_id: string | null
        }
        Insert: {
          agent_id?: string | null
          config_snapshot?: Json | null
          deployed_at?: string | null
          deployed_by?: string | null
          id?: string
          performance_impact?: Json | null
          rollback_from?: string | null
          status?: string | null
          version_id?: string | null
        }
        Update: {
          agent_id?: string | null
          config_snapshot?: Json | null
          deployed_at?: string | null
          deployed_by?: string | null
          id?: string
          performance_impact?: Json | null
          rollback_from?: string | null
          status?: string | null
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deployment_history_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deployment_history_rollback_from_fkey"
            columns: ["rollback_from"]
            isOneToOne: false
            referencedRelation: "deployment_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deployment_history_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "agent_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      deployment_logs: {
        Row: {
          created_at: string | null
          deployment_id: string | null
          environment_id: string | null
          id: string
          logs: string | null
          metadata: Json | null
          status: string
        }
        Insert: {
          created_at?: string | null
          deployment_id?: string | null
          environment_id?: string | null
          id?: string
          logs?: string | null
          metadata?: Json | null
          status: string
        }
        Update: {
          created_at?: string | null
          deployment_id?: string | null
          environment_id?: string | null
          id?: string
          logs?: string | null
          metadata?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "deployment_logs_deployment_id_fkey"
            columns: ["deployment_id"]
            isOneToOne: false
            referencedRelation: "deployments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deployment_logs_environment_id_fkey"
            columns: ["environment_id"]
            isOneToOne: false
            referencedRelation: "deployment_environments"
            referencedColumns: ["id"]
          },
        ]
      }
      deployments: {
        Row: {
          agent_id: string | null
          alert_status: string | null
          deployed_at: string | null
          error_rate: number | null
          health_status: string | null
          id: string
          incident_count: number | null
          last_health_check: string | null
          logs: string[] | null
          metrics: Json | null
          resource_usage: Json | null
          response_time: number | null
          status: string | null
          uptime_percentage: number | null
          version_id: string | null
        }
        Insert: {
          agent_id?: string | null
          alert_status?: string | null
          deployed_at?: string | null
          error_rate?: number | null
          health_status?: string | null
          id?: string
          incident_count?: number | null
          last_health_check?: string | null
          logs?: string[] | null
          metrics?: Json | null
          resource_usage?: Json | null
          response_time?: number | null
          status?: string | null
          uptime_percentage?: number | null
          version_id?: string | null
        }
        Update: {
          agent_id?: string | null
          alert_status?: string | null
          deployed_at?: string | null
          error_rate?: number | null
          health_status?: string | null
          id?: string
          incident_count?: number | null
          last_health_check?: string | null
          logs?: string[] | null
          metrics?: Json | null
          resource_usage?: Json | null
          response_time?: number | null
          status?: string | null
          uptime_percentage?: number | null
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deployments_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deployments_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "agent_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string | null
          id: string
          is_published: boolean | null
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      feature_tours: {
        Row: {
          created_at: string | null
          id: string
          steps: Json
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          steps: Json
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          steps?: Json
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      health_check_history: {
        Row: {
          created_at: string | null
          details: Json | null
          duration_ms: number | null
          id: string
          service_name: string
          status: string
          timestamp: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          duration_ms?: number | null
          id?: string
          service_name: string
          status: string
          timestamp?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          duration_ms?: number | null
          id?: string
          service_name?: string
          status?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      health_incidents: {
        Row: {
          created_at: string | null
          deployment_id: string | null
          description: string | null
          id: string
          incident_type: string
          resolution_notes: string | null
          resolved_at: string | null
          severity: string
          started_at: string | null
        }
        Insert: {
          created_at?: string | null
          deployment_id?: string | null
          description?: string | null
          id?: string
          incident_type: string
          resolution_notes?: string | null
          resolved_at?: string | null
          severity: string
          started_at?: string | null
        }
        Update: {
          created_at?: string | null
          deployment_id?: string | null
          description?: string | null
          id?: string
          incident_type?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          severity?: string
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_incidents_deployment_id_fkey"
            columns: ["deployment_id"]
            isOneToOne: false
            referencedRelation: "deployments"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base_articles: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string | null
          id: string
          published: boolean | null
          search_vector: unknown | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category: string
          content: string
          created_at?: string | null
          id?: string
          published?: boolean | null
          search_vector?: unknown | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          published?: boolean | null
          search_vector?: unknown | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      monitoring_metrics: {
        Row: {
          agent_id: string | null
          alert_status: string | null
          error_rate: number | null
          id: string
          metrics: Json
          request_count: number | null
          response_time: number | null
          timestamp: string | null
        }
        Insert: {
          agent_id?: string | null
          alert_status?: string | null
          error_rate?: number | null
          id?: string
          metrics: Json
          request_count?: number | null
          response_time?: number | null
          timestamp?: string | null
        }
        Update: {
          agent_id?: string | null
          alert_status?: string | null
          error_rate?: number | null
          id?: string
          metrics?: Json
          request_count?: number | null
          response_time?: number | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "monitoring_metrics_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          notification_types: Json | null
          push_notifications: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          notification_types?: Json | null
          push_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          notification_types?: Json | null
          push_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
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
            foreignKeyName: "fk_notifications_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
          average_session_duration: unknown | null
          avg_session_duration: number | null
          created_at: string | null
          daily_active_users: number | null
          hourly_revenue: number[] | null
          id: string
          metric_date: string
          new_users: number | null
          peak_concurrent_users: number | null
          successful_transactions: number | null
          total_revenue: number | null
        }
        Insert: {
          average_session_duration?: unknown | null
          avg_session_duration?: number | null
          created_at?: string | null
          daily_active_users?: number | null
          hourly_revenue?: number[] | null
          id?: string
          metric_date: string
          new_users?: number | null
          peak_concurrent_users?: number | null
          successful_transactions?: number | null
          total_revenue?: number | null
        }
        Update: {
          average_session_duration?: unknown | null
          avg_session_duration?: number | null
          created_at?: string | null
          daily_active_users?: number | null
          hourly_revenue?: number[] | null
          id?: string
          metric_date?: string
          new_users?: number | null
          peak_concurrent_users?: number | null
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
          credit_balance: number | null
          credit_limit: number | null
          email: string
          id: string
          last_active: string | null
          last_credit_purchase: string | null
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
          credit_balance?: number | null
          credit_limit?: number | null
          email: string
          id: string
          last_active?: string | null
          last_credit_purchase?: string | null
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
          credit_balance?: number | null
          credit_limit?: number | null
          email?: string
          id?: string
          last_active?: string | null
          last_credit_purchase?: string | null
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
      revenue_details: {
        Row: {
          average_transaction_value: number | null
          comparison_period_revenue: number | null
          created_at: string | null
          customer_retention_rate: number | null
          growth_rate: number | null
          id: string
          mrr: number | null
          period_end: string
          period_start: string
          revenue_by_category: Json | null
          total_revenue: number
          transaction_count: number
        }
        Insert: {
          average_transaction_value?: number | null
          comparison_period_revenue?: number | null
          created_at?: string | null
          customer_retention_rate?: number | null
          growth_rate?: number | null
          id?: string
          mrr?: number | null
          period_end: string
          period_start: string
          revenue_by_category?: Json | null
          total_revenue?: number
          transaction_count?: number
        }
        Update: {
          average_transaction_value?: number | null
          comparison_period_revenue?: number | null
          created_at?: string | null
          customer_retention_rate?: number | null
          growth_rate?: number | null
          id?: string
          mrr?: number | null
          period_end?: string
          period_start?: string
          revenue_by_category?: Json | null
          total_revenue?: number
          transaction_count?: number
        }
        Relationships: []
      }
      reviews: {
        Row: {
          agent_id: string
          comment: string | null
          created_at: string
          developer_reply: string | null
          developer_reply_at: string | null
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          agent_id: string
          comment?: string | null
          created_at?: string
          developer_reply?: string | null
          developer_reply_at?: string | null
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          agent_id?: string
          comment?: string | null
          created_at?: string
          developer_reply?: string | null
          developer_reply_at?: string | null
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
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string
          current_period_start: string
          id: string
          plan_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end: string
          current_period_start: string
          id?: string
          plan_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string
          id: string
          last_updated_by: string | null
          metadata: Json | null
          priority: Database["public"]["Enums"]["ticket_priority"] | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description: string
          id?: string
          last_updated_by?: string | null
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string
          id?: string
          last_updated_by?: string | null
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_last_updated_by_fkey"
            columns: ["last_updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_performance_metrics: {
        Row: {
          alert_status: string | null
          created_at: string | null
          custom_alert_thresholds: Json | null
          error_rate: number
          historical_data: Json | null
          id: string
          resource_usage: Json | null
          response_time: number
          service_category: string | null
          service_name: string
          timestamp: string | null
          uptime_percentage: number
        }
        Insert: {
          alert_status?: string | null
          created_at?: string | null
          custom_alert_thresholds?: Json | null
          error_rate: number
          historical_data?: Json | null
          id?: string
          resource_usage?: Json | null
          response_time: number
          service_category?: string | null
          service_name: string
          timestamp?: string | null
          uptime_percentage: number
        }
        Update: {
          alert_status?: string | null
          created_at?: string | null
          custom_alert_thresholds?: Json | null
          error_rate?: number
          historical_data?: Json | null
          id?: string
          resource_usage?: Json | null
          response_time?: number
          service_category?: string | null
          service_name?: string
          timestamp?: string | null
          uptime_percentage?: number
        }
        Relationships: []
      }
      team_members: {
        Row: {
          added_at: string | null
          id: string
          permissions: Json | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          added_at?: string | null
          id?: string
          permissions?: Json | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          added_at?: string | null
          id?: string
          permissions?: Json | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      test_suites: {
        Row: {
          agent_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          results: Json | null
          status: string | null
          test_cases: Json | null
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          results?: Json | null
          status?: string | null
          test_cases?: Json | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          results?: Json | null
          status?: string | null
          test_cases?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_suites_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          client_name: string
          company: string
          created_at: string
          id: string
          industry: string | null
          is_featured: boolean | null
          logo_url: string | null
          metrics: Json | null
          rating: number | null
          role: string
          testimonial: string
          video_url: string | null
        }
        Insert: {
          client_name: string
          company: string
          created_at?: string
          id?: string
          industry?: string | null
          is_featured?: boolean | null
          logo_url?: string | null
          metrics?: Json | null
          rating?: number | null
          role: string
          testimonial: string
          video_url?: string | null
        }
        Update: {
          client_name?: string
          company?: string
          created_at?: string
          id?: string
          industry?: string | null
          is_featured?: boolean | null
          logo_url?: string | null
          metrics?: Json | null
          rating?: number | null
          role?: string
          testimonial?: string
          video_url?: string | null
        }
        Relationships: []
      }
      ticket_activities: {
        Row: {
          content: string
          created_at: string | null
          id: string
          ticket_id: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          ticket_id: string
          type?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          ticket_id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_activities_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_activities_user_id_fkey"
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
      user_activity: {
        Row: {
          activity_type: string
          created_at: string | null
          details: Json | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          details?: Json | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_engagement_metrics: {
        Row: {
          conversion_points: Json | null
          created_at: string | null
          features_used: Json | null
          id: string
          pages_visited: Json | null
          session_duration: number | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          conversion_points?: Json | null
          created_at?: string | null
          features_used?: Json | null
          id?: string
          pages_visited?: Json | null
          session_duration?: number | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          conversion_points?: Json | null
          created_at?: string | null
          features_used?: Json | null
          id?: string
          pages_visited?: Json | null
          session_duration?: number | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      revenue_analytics: {
        Row: {
          active_agents: number | null
          average_transaction: number | null
          hour: string | null
          total_revenue: number | null
          transaction_count: number | null
          unique_buyers: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          user_id: string
          required_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      update_daily_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "developer" | "buyer"
      ticket_priority: "low" | "medium" | "high"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
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
