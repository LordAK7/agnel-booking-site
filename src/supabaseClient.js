import { createClient } from '@supabase/supabase-js'

// Supabase credentials
const supabaseUrl = 'https://gowhiaumhdapekrvxaka.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdvd2hpYXVtaGRhcGVrcnZ4YWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MTg4MjUsImV4cCI6MjA1NzM5NDgyNX0.26wf2UvV1MHgC4LhMTHHiBFzUPgP6J5iOfkjeaPTULo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
