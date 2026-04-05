import { createBrowserClient } from "@supabase/ssr";

// Auth client - your own Supabase project
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Data client - teacher's Supabase project
export function createDbClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_DB_URL!,
    process.env.NEXT_PUBLIC_DB_ANON_KEY!
  );
}