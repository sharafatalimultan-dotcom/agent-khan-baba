import { createSupabaseServer, supabaseConfigured } from "./supabase/server";
import {
  DEFAULT_FAQS,
  DEFAULT_HELPLINES,
  DEFAULT_LINKS,
  DEFAULT_SEO,
  type Faq,
  type Helpline,
  type OfficialLink,
  type SeoEntry,
} from "./defaults";

// Public content readers. Each falls back to defaults if Supabase is absent, empty or errors.

export async function getFaqs(): Promise<Faq[]> {
  if (!supabaseConfigured()) return DEFAULT_FAQS;
  try {
    const { data, error } = await createSupabaseServer()
      .from("faqs").select("*").eq("published", true).order("sort_order");
    return !error && data && data.length ? (data as Faq[]) : DEFAULT_FAQS;
  } catch {
    return DEFAULT_FAQS;
  }
}

export async function getHelplines(): Promise<Helpline[]> {
  if (!supabaseConfigured()) return DEFAULT_HELPLINES;
  try {
    const { data, error } = await createSupabaseServer()
      .from("helplines").select("*").eq("published", true).order("sort_order");
    return !error && data && data.length ? (data as Helpline[]) : DEFAULT_HELPLINES;
  } catch {
    return DEFAULT_HELPLINES;
  }
}

export async function getLinks(category?: string): Promise<OfficialLink[]> {
  let list: OfficialLink[] = DEFAULT_LINKS;
  if (supabaseConfigured()) {
    try {
      const { data, error } = await createSupabaseServer()
        .from("official_links").select("*").eq("published", true).order("sort_order");
      if (!error && data && data.length) list = data as OfficialLink[];
    } catch {
      /* use defaults */
    }
  }
  return category ? list.filter((l) => l.category === category) : list;
}

export async function getSeo(path: string): Promise<SeoEntry> {
  const fallback = DEFAULT_SEO[path] ?? DEFAULT_SEO["/"];
  if (!supabaseConfigured()) return fallback;
  try {
    const { data } = await createSupabaseServer()
      .from("seo_settings").select("title, description").eq("path", path).maybeSingle();
    return data?.title && data?.description ? { title: data.title, description: data.description } : fallback;
  } catch {
    return fallback;
  }
}

export async function getSetting(key: string, fallback = ""): Promise<string> {
  if (!supabaseConfigured()) return fallback;
  try {
    const { data } = await createSupabaseServer()
      .from("site_settings").select("value").eq("key", key).maybeSingle();
    return data?.value ?? fallback;
  } catch {
    return fallback;
  }
}
