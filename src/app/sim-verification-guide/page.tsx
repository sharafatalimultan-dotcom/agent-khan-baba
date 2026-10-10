import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import LinkList from "@/components/LinkList";
import { getLinks } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/sim-verification-guide");
}

export default async function Page() {
  const links = await getLinks();
  return (
    <PageShell
      title="SIM Verification Guide"
      intro="A practical checklist for confirming which SIMs are registered on your own CNIC, using official channels only."
    >
      <h2>Before you start</h2>
      <ul>
        <li>Have your own CNIC and the mobile numbers you actually use ready.</li>
        <li>Use only official PTA and network channels. Never type your CNIC into unofficial websites or apps.</li>
        <li>Never share OTP codes, PINs or biometric verification prompts with anyone.</li>
      </ul>

      <h2>Step by step</h2>
      <ol>
        <li><strong>Open the PTA website</strong> and look for the consumer service that lists SIMs registered against a CNIC. PTA updates its services from time to time, so always confirm the current method there.</li>
        <li><strong>Enter or send only your own CNIC</strong> through the official method. Do not check other people's CNICs.</li>
        <li><strong>Compare the result</strong> with the SIMs you use at home, at work and in devices such as trackers or tablets.</li>
        <li><strong>Mark any unknown SIM</strong> and note the network. Do not call or message the unknown number.</li>
        <li><strong>Report and block</strong> through <Link href="/block-report-sim">the official reporting process</Link>, and keep your complaint number.</li>
        <li><strong>Re-check</strong> every few months, and after you lose a CNIC, change address or hand your CNIC to a shop for biometric verification.</li>
      </ol>

      <h2>What this site cannot do</h2>
      <p>
        We cannot tell you the owner, address or CNIC behind someone else's number. That information is private and protected. Sites that claim otherwise are often scams or illegal data resellers.
      </p>

      <h2>Official links</h2>
      <LinkList links={links} />
    </PageShell>
  );
}
