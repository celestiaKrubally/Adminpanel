import { createClient } from "@/utils/supabase/server";
import CrudClient from "./WhitelistedEmailsClient";
export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from("whitelisted_emails").select("*").order("created_at", { ascending: false });
  return <CrudClient initial={data ?? []} />;
}
