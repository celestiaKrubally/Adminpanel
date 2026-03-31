import { createClient } from "@/utils/supabase/server";
import CrudClient from "./CaptionExamplesClient";
export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from("caption_examples").select("*").order("created_at", { ascending: false });
  return <CrudClient initial={data ?? []} />;
}
