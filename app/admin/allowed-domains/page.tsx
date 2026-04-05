import { createDbClient } from "@/utils/supabase/server";
import CrudClient from "./AllowedDomainsClient";
export default async function Page() {
  const supabase = await createDbClient();
  const { data } = await supabase.from("allowed_signup_domains").select("*").order("created_at", { ascending: false });
  return <CrudClient initial={data ?? []} />;
}
