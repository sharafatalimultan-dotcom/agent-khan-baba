import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/server";
import LogoutButton from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Agent Khan Baba", robots: { index: false, follow: false } };

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/helplines", label: "Helplines" },
  { href: "/admin/links", label: "Official links" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/api", label: "API & logs" },
  { href: "/admin/seo", label: "SEO & settings" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // Second, independent server-side check (middleware is the first).
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-ink-soft">Signed in as {user.email}</p>
        <LogoutButton />
      </div>
      <nav aria-label="Admin" className="mb-6 flex flex-wrap gap-2">
        {LINKS.map((l) => <Link key={l.href} href={l.href} className="btn-secondary !py-2 text-sm">{l.label}</Link>)}
      </nav>
      {children}
    </div>
  );
}
