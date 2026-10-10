import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { getFaqs } from "@/lib/data";
import { NAV, LEGAL_NAV } from "@/lib/site";

export const metadata: Metadata = { title: "Search | Agent Khan Baba", robots: { index: false, follow: true } };
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q ?? "").trim().slice(0, 80).toLowerCase();
  const faqs = await getFaqs();
  const pages = [...NAV, ...LEGAL_NAV].filter((p) => q && p.label.toLowerCase().includes(q));
  const hits = faqs.filter((f) => q && (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)));

  return (
    <PageShell title="Search" intro={q ? `Results for “${q}”` : "Type a word in the search box above."} prose={false}>
      {q && !pages.length && !hits.length && <p className="text-ink-soft">No results found. Try a different word, or browse the <Link className="font-semibold text-brand underline" href="/faqs">FAQs</Link>.</p>}
      {pages.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-lg">Pages</h2>
          <ul className="space-y-2">{pages.map((p) => <li key={p.href}><Link className="font-semibold text-brand underline" href={p.href}>{p.label}</Link></li>)}</ul>
        </section>
      )}
      {hits.length > 0 && (
        <section>
          <h2 className="mb-2 text-lg">FAQs</h2>
          <ul className="space-y-3">{hits.map((f) => (
            <li key={f.id} className="card"><p className="font-semibold">{f.question}</p><p className="mt-1 text-sm text-ink-soft">{f.answer}</p></li>
          ))}</ul>
        </section>
      )}
    </PageShell>
  );
}
