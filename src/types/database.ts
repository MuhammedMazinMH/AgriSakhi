export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          phone: string | null
          full_name: string | null
          avatar_url: string | null
          preferred_language: string
          role: 'user' | 'expert' | 'admin'
          is_guest: boolean
          guest_detections_count: number
          free_detections_count: number
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          email?: string | null
          phone?: string | null
          full_name?: string | null
          avatar_url?: string | null
          preferred_language?: string
          role?: 'user' | 'expert' | 'admin'
          is_guest?: boolean
          guest_detections_count?: number
          free_detections_count?: number
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          phone?: string | null
          full_name?: string | null
          avatar_url?: string | null
          preferred_language?: string
          role?: 'user' | 'expert' | 'admin'
          is_guest?: boolean
          guest_detections_count?: number
          free_detections_count?: number
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
      }
      detections: {
        Row: {
          id: string
          user_id: string | null
          image_url: string
          thumbnail_url: string | null
          disease_name: string
          disease_name_local: string | null
          scientific_name: string | null
          confidence: number
          severity: number
          affected_area_percentage: number
          crop_type: string | null
          detection_metadata: Json
          weather_data: Json | null
          location_data: Json | null
          status: 'pending' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          image_url: string
          thumbnail_url?: string | null
          disease_name: string
          disease_name_local?: string | null
          scientific_name?: string | null
          confidence: number
          severity: number
          affected_area_percentage: number
          crop_type?: string | null
          detection_metadata?: Json
          weather_data?: Json | null
          location_data?: Json | null
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          image_url?: string
          thumbnail_url?: string | null
          disease_name?: string
          disease_name_local?: string | null
          scientific_name?: string | null
          confidence?: number
          severity?: number
          affected_area_percentage?: number
          crop_type?: string | null
          detection_metadata?: Json
          weather_data?: Json | null
          location_data?: Json | null
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
      }
      diseases: {
        Row: {
          id: string
          name: string
          scientific_name: string
          description: Json
          symptoms: Json
          crop_types: string[]
          severity_levels: Json
          treatment_methods: Json
          prevention_strategies: Json
          images: string[]
          seasonal_info: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          scientific_name: string
          description: Json
          symptoms: Json
          crop_types: string[]
          severity_levels?: Json
          treatment_methods: Json
          prevention_strategies: Json
          images?: string[]
          seasonal_info?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          scientific_name?: string
          description?: Json
          symptoms?: Json
          crop_types?: string[]
          severity_levels?: Json
          treatment_methods?: Json
          prevention_strategies?: Json
          images?: string[]
          seasonal_info?: Json
          created_at?: string
          updated_at?: string
        }
      }
      treatments: {
        Row: {
          id: string
          detection_id: string
          method: string
          method_type: 'organic' | 'chemical' | 'cultural' | 'biological'
          description: string
          dosage: string | null
          cost_estimate: number | null
          effectiveness_rating: number | null
          duration_days: number | null
          applied_at: string | null
          result_status: 'pending' | 'effective' | 'ineffective' | 'partial'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          detection_id: string
          method: string
          method_type: 'organic' | 'chemical' | 'cultural' | 'biological'
          description: string
          dosage?: string | null
          cost_estimate?: number | null
          effectiveness_rating?: number | null
          duration_days?: number | null
          applied_at?: string | null
          result_status?: 'pending' | 'effective' | 'ineffective' | 'partial'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          detection_id?: string
          method?: string
          method_type?: 'organic' | 'chemical' | 'cultural' | 'biological'
          description?: string
          dosage?: string | null
          cost_estimate?: number | null
          effectiveness_rating?: number | null
          duration_days?: number | null
          applied_at?: string | null
          result_status?: 'pending' | 'effective' | 'ineffective' | 'partial'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          detection_id: string
          user_id: string
          report_type: 'pdf' | 'email' | 'whatsapp'
          file_url: string | null
          shared_at: string | null
          verification_code: string
          created_at: string
        }
        Insert: {
          id?: string
          detection_id: string
          user_id: string
          report_type: 'pdf' | 'email' | 'whatsapp'
          file_url?: string | null
          shared_at?: string | null
          verification_code: string
          created_at?: string
        }
        Update: {
          id?: string
          detection_id?: string
          user_id?: string
          report_type?: 'pdf' | 'email' | 'whatsapp'
          file_url?: string | null
          shared_at?: string | null
          verification_code?: string
          created_at?: string
        }
      }
      community_posts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          post_type: 'question' | 'tip' | 'success_story' | 'new_disease'
          images: string[]
          tags: string[]
          upvotes: number
          downvotes: number
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          post_type: 'question' | 'tip' | 'success_story' | 'new_disease'
          images?: string[]
          tags?: string[]
          upvotes?: number
          downvotes?: number
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          post_type?: 'question' | 'tip' | 'success_story' | 'new_disease'
          images?: string[]
          tags?: string[]
          upvotes?: number
          downvotes?: number
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      expert_consultations: {
        Row: {
          id: string
          user_id: string
          expert_id: string | null
          detection_id: string | null
          question: string
          answer: string | null
          status: 'pending' | 'answered' | 'closed'
          priority: 'low' | 'medium' | 'high'
          created_at: string
          answered_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          expert_id?: string | null
          detection_id?: string | null
          question: string
          answer?: string | null
          status?: 'pending' | 'answered' | 'closed'
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
          answered_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          expert_id?: string | null
          detection_id?: string | null
          question?: string
          answer?: string | null
          status?: 'pending' | 'answered' | 'closed'
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
          answered_at?: string | null
          updated_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          user_id: string | null
          event_type: string
          event_data: Json
          session_id: string | null
          device_info: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          event_type: string
          event_data: Json
          session_id?: string | null
          device_info?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          event_type?: string
          event_data?: Json
          session_id?: string | null
          device_info?: Json | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'detection_complete' | 'expert_answer' | 'system' | 'community'
          is_read: boolean
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: 'detection_complete' | 'expert_answer' | 'system' | 'community'
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'detection_complete' | 'expert_answer' | 'system' | 'community'
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
