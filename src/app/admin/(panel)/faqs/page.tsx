import CrudTable from "@/components/admin/CrudTable";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function Page() {
  const { data } = await createSupabaseServer().from("faqs").select("*").order("sort_order");
  return (
    <>
      <h1 className="mb-4 text-2xl">Manage FAQs</h1>
      <CrudTable
        table="faqs"
        titleField="question"
        initialRows={(data ?? []) as never}
        defaults={{ question: "", answer: "", sort_order: 100, published: true }}
        fields={[
          { name: "question", label: "Question", type: "text", required: true },
          { name: "answer", label: "Answer", type: "textarea", required: true },
          { name: "sort_order", label: "Sort order", type: "number" },
          { name: "published", label: "Published", type: "checkbox" },
        ]}
      />
    </>
  );
}
