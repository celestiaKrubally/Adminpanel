import { createClient } from "@/utils/supabase/server";
import ImagesClient from "./ImagesClient";
export default async function ImagesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("images").select("*").order("created_at", { ascending: false });
  return <ImagesClient initial={data ?? []} />;
}
