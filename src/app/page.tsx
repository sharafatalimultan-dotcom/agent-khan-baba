import Link from "next/link";
import type { Metadata } from "next";
import VerifyTool from "@/components/VerifyTool";
import QuickCards from "@/components/QuickCards";
import FaqList from "@/components/FaqList";
import { getFaqs, getLinks } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/");
}

const TRUST = [
  { icon: "✅", text: "Official methods only" },
  { icon: "🔒", text: "No CNIC stored" },
  { icon: "🆓", text: "Free to use" },
];

export default async function HomePage() {
  const [faqs, links] = await Promise.all([getFaqs(), getLinks()]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", name: SITE.name, url: SITE.url, inLanguage: "en-PK", publisher: { "@type": "Organization", name: SITE.name, logo: `${SITE.url}/logo-mark.svg` } },
      {
        "@type": "FAQPage",
        mainEntity: faqs.slice(0, 6).map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -left-24 top-40 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 pb-10 pt-10 sm:pt-14">
          <div className="text-center">
            <p className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand" /> Official verification guide
            </p>
            <h1 className="text-balance">
              Check SIM information <span className="bg-gradient-to-r from-brand to-emerald-500 bg-clip-text text-transparent">the official way</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-ink-soft sm:text-lg">
              Validate a number, learn how to see which SIMs are registered on your own CNIC, and report any SIM you do not recognise.
            </p>
            <ul className="mt-5 flex flex-wrap justify-center gap-2">
              {TRUST.map((t) => (
                <li key={t.text} className="chip"><span aria-hidden>{t.icon}</span>{t.text}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <VerifyTool links={links.map((l) => ({ label: l.label, url: l.url }))} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-10 px-4 py-6">
        <QuickCards />

        <section className="prose-page">
          <h2>Why SIM verification matters</h2>
          <p>
            Every mobile SIM in Pakistan is registered against a CNIC. If someone misuses your identity, SIMs can end up in your name without your knowledge, and you may be held responsible for activity you never carried out. Checking regularly is a simple way to protect yourself.
          </p>
          <p>
            This site explains the official ways to do that. It does not sell, leak or reveal the private details of other people, and it will never display invented results. Read our <Link href="/sim-verification-guide">step by step guide</Link> or the <Link href="/disclaimer">disclaimer</Link> to understand exactly what we do.
          </p>
        </section>

        <section>
          <h2 className="mb-3">Common questions</h2>
          <FaqList faqs={faqs.slice(0, 4)} />
          <p className="mt-4 text-center"><Link className="font-semibold text-brand underline" href="/faqs">See all FAQs</Link></p>
        </section>
      </div>
    </>
  );
}
