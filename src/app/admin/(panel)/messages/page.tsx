import MessageList from "@/components/admin/MessageList";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function Page() {
  const { data } = await createSupabaseServer().from("contact_messages").select("*").order("created_at", { ascending: false }).limit(200);
  return (
    <>
      <h1 className="mb-4 text-2xl">Contact messages</h1>
      <MessageList initial={(data ?? []) as never} />
    </>
  );
}
