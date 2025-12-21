// TEMPORARY STUB FILE
// This file exists only to prevent TypeScript errors during migration
// These types are no longer used - please update components to use the new API types

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: Record<string, any>;
    Views: Record<string, any>;
    Functions: Record<string, any>;
    Enums: Record<string, any>;
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Profile = any;
export type UserProgress = any;
export type QuizStage = any;
export type VocabularyStage = any;
