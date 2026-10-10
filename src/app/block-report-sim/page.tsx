import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import LinkList from "@/components/LinkList";
import { getLinks } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/block-report-sim");
}

export default async function Page() {
  const links = await getLinks("report");
  return (
    <PageShell
      title="Block or Report a SIM"
      intro="If a SIM is registered on your CNIC without your knowledge, act quickly. These are the usual steps."
    >
      <h2>What to do</h2>
      <ol>
        <li><strong>Collect details.</strong> Note the number and the network. Do not contact the unknown number.</li>
        <li><strong>Contact the network.</strong> Use the official helpline listed on <Link href="/network-helplines">our helplines page</Link> and ask for the SIM to be reviewed and blocked.</li>
        <li><strong>Report to PTA.</strong> File a complaint through the PTA complaint channels and keep the complaint number.</li>
        <li><strong>Report fraud.</strong> If the SIM was used for scams, threats or financial fraud, contact the FIA cyber crime wing as well.</li>
        <li><strong>Protect your identity.</strong> Do not hand your CNIC copy or biometric verification to unverified people, and keep records of your complaints.</li>
      </ol>

      <h2>Do not</h2>
      <ul>
        <li>Pay anyone who promises to "remove" SIMs for you outside official channels.</li>
        <li>Share OTPs, PINs or CNIC photos in reply to calls, SMS or WhatsApp messages.</li>
      </ul>

      <h2>Where to report</h2>
      <LinkList links={links} />
      <p className="mt-4 text-sm">This site cannot block or report a SIM on your behalf. It only points to the official channels.</p>
    </PageShell>
  );
}
