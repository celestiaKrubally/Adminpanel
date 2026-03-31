import { createClient } from "@/utils/supabase/server";
import CrudClient from "./TermsClient";
export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from("terms").select("*").order("created_at", { ascending: false });
  return <CrudClient initial={data ?? []} />;
}
