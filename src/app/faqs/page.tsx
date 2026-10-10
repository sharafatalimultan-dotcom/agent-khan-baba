import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import FaqList from "@/components/FaqList";
import { getFaqs } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/faqs");
}

export default async function Page() {
  const faqs = await getFaqs();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
  return (
    <PageShell title="Frequently Asked Questions" intro="Clear answers about SIM verification, CNIC safety and reporting." prose={false}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <FaqList faqs={faqs} />
    </PageShell>
  );
}
