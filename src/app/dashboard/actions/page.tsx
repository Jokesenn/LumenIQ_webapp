import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ActionsPageContent } from "./actions-content";

export default async function ActionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <ActionsPageContent />;
}
