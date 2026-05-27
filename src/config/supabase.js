import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;
let isRealSupabase = false;

// Only initialize if environment variables are valid
if (
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    isRealSupabase = true;
    console.log('Supabase Database & Storage initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
  }
} else {
  console.warn(
    'Supabase environment variables missing. Running in interactive Database Mock Mode.'
  );
}

export { supabase, isRealSupabase };
