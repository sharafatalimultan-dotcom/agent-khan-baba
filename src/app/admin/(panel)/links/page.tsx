import CrudTable from "@/components/admin/CrudTable";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function Page() {
  const { data } = await createSupabaseServer().from("official_links").select("*").order("sort_order");
  return (
    <>
      <h1 className="mb-4 text-2xl">Manage official help links</h1>
      <CrudTable
        table="official_links"
        titleField="label"
        initialRows={(data ?? []) as never}
        defaults={{ label: "", url: "https://", description: "", category: "pta", sort_order: 100, published: true }}
        fields={[
          { name: "label", label: "Label", type: "text", required: true },
          { name: "url", label: "URL (https)", type: "url", required: true },
          { name: "description", label: "Description", type: "text" },
          { name: "category", label: "Category", type: "select", options: ["pta", "report", "other"] },
          { name: "sort_order", label: "Sort order", type: "number" },
          { name: "published", label: "Published", type: "checkbox" },
        ]}
      />
    </>
  );
}
