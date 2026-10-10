import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/terms-and-conditions");
}

export default function Page() {
  return (
    <PageShell title="Terms and Conditions" intro="By using this website you agree to these terms. Last updated: October 2026.">
      <h2>Purpose</h2>
      <p>This website provides general information about verifying SIM registrations in Pakistan through official channels.</p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Use the tool only for your own number or CNIC, or with the owner's permission.</li>
        <li>Do not use the site to stalk, harass, defraud or identify other people.</li>
        <li>Do not attempt to attack, overload, scrape or bypass the security of the site.</li>
      </ul>

      <h2>No guarantees</h2>
      <p>Information is provided as is. Official services, numbers and links may change. Always confirm with PTA or your network operator.</p>

      <h2>Third-party links</h2>
      <p>We link to external official websites. We are not responsible for their content or availability.</p>

      <h2>Limitation of liability</h2>
      <p>To the extent permitted by law, we are not liable for losses arising from use of, or reliance on, this website.</p>

      <h2>Changes</h2>
      <p>We may update these terms. Continued use means you accept the updated terms.</p>
    </PageShell>
  );
}
