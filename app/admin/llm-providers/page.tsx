import { createDbClient } from "@/utils/supabase/server";
import CrudClient from "./LlmProvidersClient";
export default async function Page() {
  const supabase = await createDbClient();
  const { data } = await supabase.from("llm_providers").select("*").order("created_at", { ascending: false });
  return <CrudClient initial={data ?? []} />;
}
