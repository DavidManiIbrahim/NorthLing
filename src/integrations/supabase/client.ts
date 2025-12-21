// TEMPORARY STUB FILE
// This file exists only to prevent import errors during migration
// Please update all components to use: import { apiClient } from "@/lib/api-client"

console.warn('⚠️ WARNING: You are importing from the old Supabase client. Please update to use apiClient from @/lib/api-client');

export const supabase = {
  auth: {
    signInWithPassword: () => Promise.reject(new Error('Supabase has been removed. Use apiClient.signIn() instead')),
    signUp: () => Promise.reject(new Error('Supabase has been removed. Use apiClient.signUp() instead')),
    signOut: () => Promise.reject(new Error('Supabase has been removed. Use apiClient.signOut() instead')),
    getUser: () => Promise.reject(new Error('Supabase has been removed. Use apiClient.getCurrentUser() instead')),
    getSession: () => Promise.reject(new Error('Supabase has been removed. Use apiClient.getCurrentUser() instead')),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
    resetPasswordForEmail: () => Promise.reject(new Error('Supabase has been removed')),
  },
  from: () => ({
    select: () => Promise.reject(new Error('Supabase has been removed. Use apiClient methods instead')),
    insert: () => Promise.reject(new Error('Supabase has been removed. Use apiClient methods instead')),
    update: () => Promise.reject(new Error('Supabase has been removed. Use apiClient methods instead')),
    delete: () => Promise.reject(new Error('Supabase has been removed. Use apiClient methods instead')),
  }),
};