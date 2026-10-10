import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/about");
}

export default function Page() {
  return (
    <PageShell title="About Us" intro="We help people in Pakistan protect their identity by explaining official SIM verification methods.">
      <h2>What we do</h2>
      <p>We publish clear, original guides on how to check SIMs registered on your own CNIC, how to contact networks and how to report unauthorized SIMs. Our tool validates the format of numbers and points you to official channels.</p>
      <h2>What we will never do</h2>
      <ul>
        <li>Sell, leak or display private information about other people.</li>
        <li>Show invented owner names, addresses or CNICs.</li>
        <li>Claim access to private SIM-owner databases.</li>
        <li>Store your CNIC or mobile number from the verification tool.</li>
      </ul>
      <h2>Independence</h2>
      <p>This is an independent website. It is not affiliated with PTA, NADRA, or any mobile network operator. Official names are used only to describe the services we link to.</p>
    </PageShell>
  );
}
