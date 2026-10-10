import CrudTable from "@/components/admin/CrudTable";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function Page() {
  const { data } = await createSupabaseServer().from("helplines").select("*").order("sort_order");
  return (
    <>
      <h1 className="mb-4 text-2xl">Manage network helplines</h1>
      <CrudTable
        table="helplines"
        titleField="network"
        initialRows={(data ?? []) as never}
        defaults={{ network: "", number: "", note: "", website: "", sort_order: 100, published: true }}
        fields={[
          { name: "network", label: "Network / organisation", type: "text", required: true },
          { name: "number", label: "Helpline number", type: "text", required: true },
          { name: "note", label: "Note", type: "text" },
          { name: "website", label: "Official website (https)", type: "url" },
          { name: "sort_order", label: "Sort order", type: "number" },
          { name: "published", label: "Published", type: "checkbox" },
        ]}
      />
    </>
  );
}
