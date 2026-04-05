import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Auth client - your own Supabase project
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

// Data client - teacher's Supabase project (no auth needed)
export function createDbClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_DB_URL!,
    process.env.NEXT_PUBLIC_DB_ANON_KEY!,
    {
      cookies: {
        getAll() { return []; },
        setAll() {},
      },
    }
  );
}