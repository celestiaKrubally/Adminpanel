import { redirect } from "next/navigation";
import { createDbClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createDbClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/admin");
  else redirect("/login");
}
