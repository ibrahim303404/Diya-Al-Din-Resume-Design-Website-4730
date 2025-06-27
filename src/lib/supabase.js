import { createClient } from '@supabase/supabase-js'

// Project ID will be auto-injected during deployment
const SUPABASE_URL = 'https://apejsnufhvkutbhiyhmz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZWpzbnVmaHZrdXRiaGl5aG16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTY1MjksImV4cCI6MjA2NjUzMjUyOX0.2VOSq1QlwEFCT2fa_7tB7eao6EZYMO3SdVnL4F1dQ6k'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>'){
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})