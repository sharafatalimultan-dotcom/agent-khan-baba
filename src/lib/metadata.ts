import type { Metadata } from "next";
import { getSeo } from "./data";
import { SITE } from "./site";

export async function pageMetadata(path: string): Promise<Metadata> {
  const seo = await getSeo(path);
  const url = `${SITE.url}${path === "/" ? "" : path}`;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: url },
    openGraph: { title: seo.title, description: seo.description, url, siteName: SITE.name, type: "website", locale: "en_PK" },
    twitter: { card: "summary", title: seo.title, description: seo.description },
  };
}
