import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import LinkList from "@/components/LinkList";
import { getLinks } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/pta-guide");
}

export default async function Page() {
  const links = await getLinks();
  return (
    <PageShell
      title="PTA Guide"
      intro="The Pakistan Telecommunication Authority (PTA) regulates telecom services. Here is how consumers can use its official channels."
    >
      <h2>What PTA helps with</h2>
      <ul>
        <li>Information on the number of SIMs registered against your own CNIC.</li>
        <li>Complaints about SIMs you did not register or services you did not request.</li>
        <li>Consumer rights and guidance on telecom services.</li>
      </ul>

      <h2>How to use PTA channels safely</h2>
      <ol>
        <li>Type the PTA address directly into your browser or use the official app store listing. Avoid links from messages or ads.</li>
        <li>Use only your own CNIC. Official services are designed for checking your own registrations.</li>
        <li>Save any complaint or reference number you receive.</li>
        <li>If a service has moved or changed, follow the instructions on the official PTA site, not instructions from third parties.</li>
      </ol>
      <p>
        Service names, short codes and web addresses can change. We review this page regularly, but the PTA website is always the final authority.
      </p>

      <h2>Official links</h2>
      <LinkList links={links} />
    </PageShell>
  );
}
