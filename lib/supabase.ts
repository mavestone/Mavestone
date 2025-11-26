import { createClient } from '@supabase/supabase-js';

// Safely access env vars to prevent crashes in environments where import.meta.env is undefined
const getEnvVar = (key: string) => {
  try {
    return (import.meta as any).env?.[key];
  } catch (e) {
    return undefined;
  }
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || 'https://trxdkodipryfaiceqnxu.supabase.co';
// Use the legacy key provided by user as fallback
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyeGRrb2RpcHJ5ZmFpY2Vxbnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzE5ODksImV4cCI6MjA3OTcwNzk4OX0.dPnEicMt4TmEXATkW-qELQip7lZ2ijSqc17PkYZB4aY';

let client = null;

try {
  // Only attempt to create client if we have a potentially valid key structure
  if (supabaseUrl && supabaseAnonKey && supabaseAnonKey.startsWith('ey')) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    console.warn("Invalid or missing Supabase keys. Running in offline mode.");
  }
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
  client = null;
}

export const supabase = client;