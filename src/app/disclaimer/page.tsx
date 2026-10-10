import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/disclaimer");
}

export default function Page() {
  return (
    <PageShell title="Disclaimer" intro="Please read this before relying on anything on this website.">
      <ul>
        <li>This is an independent information website. It is <strong>not</strong> affiliated with, endorsed by or operated by PTA, NADRA, the Government of Pakistan or any mobile network operator.</li>
        <li>We do not provide access to private SIM-owner databases and do not reveal personal information about other people.</li>
        <li>No owner names, addresses or CNICs are ever displayed unless a legally authorized provider has been connected and returns them, and then only the fields it is permitted to return.</li>
        <li>Information may be out of date. Verify all services, numbers and links with the official source.</li>
        <li>Nothing here is legal advice.</li>
      </ul>
    </PageShell>
  );
}
