import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export type Database = {
  public: {
    Tables: {
      votes: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      experiences: {
        Row: {
          id: string;
          name: string | null;
          experience: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          experience: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          experience?: string;
          created_at?: string;
        };
      };
      polls: {
        Row: {
          id: string;
          question: string;
          option: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          question?: string;
          option: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          option?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          message?: string;
          created_at?: string;
        };
      };
      ogs: {
        Row: {
          id: string;
          name: string;
          dept: string;
          quote: string;
          photo_url: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          dept: string;
          quote: string;
          photo_url?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          dept?: string;
          quote?: string;
          photo_url?: string | null;
        };
      };
    };
  };
};