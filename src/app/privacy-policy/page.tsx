import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { pageMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/privacy-policy");
}

export default function Page() {
  return (
    <PageShell title="Privacy Policy" intro="Last updated: October 2026. This policy explains what data we handle and why.">
      <h2>Data you enter in the verification tool</h2>
      <p>Mobile numbers and CNIC numbers are validated for format and are not saved in our database. If an authorized verification provider is enabled, the value is sent to that provider over a secure connection solely to return the result you requested. For troubleshooting we keep only a one-way hash that cannot be turned back into your number.</p>

      <h2>Contact messages</h2>
      <p>If you use the contact form we store your name, email, subject and message so we can reply. Please never include your CNIC or passwords. You can ask us to delete your message by emailing <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>

      <h2>Cookies and similar technologies</h2>
      <p>We use essential cookies for administrator sign-in. If we display advertising, third-party vendors including Google may use cookies to serve ads based on your visits to this and other sites. You can manage personalised advertising through Google Ads Settings or at aboutads.info.</p>

      <h2>Analytics and logs</h2>
      <p>Our hosting provider may keep standard server logs such as IP address and browser type for security and reliability.</p>

      <h2>Data retention and your choices</h2>
      <p>We keep personal data only as long as needed for the purpose it was collected. You may request access to or deletion of data you sent us.</p>

      <h2>Children</h2>
      <p>This website is not directed at children under 13.</p>

      <h2>Contact</h2>
      <p>Questions about this policy: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
    </PageShell>
  );
}
