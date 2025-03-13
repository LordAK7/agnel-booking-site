import { createClient } from '@supabase/supabase-js'

// Use environment variables for Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

// Create regular Supabase client with anon key
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create admin Supabase client with service role key (if available)
// This client can bypass RLS policies
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null
