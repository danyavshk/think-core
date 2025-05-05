import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nizokxomiatvqovdflib.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pem9reG9taWF0dnFvdmRmbGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzODMzNzYsImV4cCI6MjA2MTk1OTM3Nn0.muDFe2HRed3NqtJiQYjgo14peXuTG2sdp1TRgrCTR3Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
