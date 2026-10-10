import SeoEditor from "@/components/admin/SeoEditor";
import { createSupabaseServer } from "@/lib/supabase/server";
import { DEFAULT_SEO } from "@/lib/defaults";

export default async function Page() {
  const db = createSupabaseServer();
  const [{ data: rows }, { data: banner }] = await Promise.all([
    db.from("seo_settings").select("path,title,description"),
    db.from("site_settings").select("value").eq("key", "announcement").maybeSingle(),
  ]);
  const saved = new Map((rows ?? []).map((r) => [r.path as string, r]));
  const entries = Object.entries(DEFAULT_SEO).map(([path, d]) => ({
    path,
    title: (saved.get(path)?.title as string) ?? d.title,
    description: (saved.get(path)?.description as string) ?? d.description,
  }));
  return (
    <>
      <h1 className="mb-4 text-2xl">SEO and website settings</h1>
      <SeoEditor entries={entries} announcement={banner?.value ?? ""} />
    </>
  );
}
