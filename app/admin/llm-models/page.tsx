import { createDbClient } from "@/utils/supabase/server";
import CrudClient from "./LlmModelsClient";
export default async function Page() {
  const supabase = await createDbClient();
  const { data } = await supabase.from("llm_models").select("*").order("created_at", { ascending: false });
  return <CrudClient initial={data ?? []} />;
}
