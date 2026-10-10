import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ContactForm from "@/components/ContactForm";
import { pageMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/contact");
}

export default function Page() {
  return (
    <PageShell title="Contact Us" intro="Questions, corrections or suggestions? Send us a message." prose={false}>
      <ContactForm />
      <p className="mt-4 text-sm text-ink-soft">
        You can also email <a className="font-semibold text-brand underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>. We cannot look up, block or report SIMs for you. For that, use the <a className="font-semibold text-brand underline" href="/block-report-sim">official channels</a>.
      </p>
    </PageShell>
  );
}
