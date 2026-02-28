import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getJobHistory } from "@/lib/queries/dashboard";
import { HistoryContent } from "./history-content";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const jobs = await getJobHistory(user.id);

  return <HistoryContent jobs={jobs} />;
}
