import { createClient } from '@supabase/supabase-js'

// Supabase credentials
const supabaseUrl = 'https://axxtodwfcqzrddenzwop.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4eHRvZHdmY3F6cmRkZW56d29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMzIzNjMsImV4cCI6MjA1NjYwODM2M30.iPgkunhWeWJF2xNEeO3G9FRHsleZaZ-bL5JEFCcbRV4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
