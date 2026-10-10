import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { getHelplines } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/network-helplines");
}

export default async function Page() {
  const lines = await getHelplines();
  return (
    <PageShell
      title="Network Helplines"
      intro="Contact your mobile network or the regulator directly. Always confirm numbers on the operator's official website."
      prose={false}
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {lines.map((h) => (
          <li key={h.id} className="card">
            <h2 className="text-lg">{h.network}</h2>
            <p className="mt-1 text-2xl font-extrabold text-brand">
              <a href={`tel:${h.number.replace(/[^\d+]/g, "")}`}>{h.number}</a>
            </p>
            {h.note && <p className="mt-1 text-sm text-ink-soft">{h.note}</p>}
            {h.website && (
              <a className="mt-2 inline-block text-sm font-semibold text-brand underline" href={h.website} target="_blank" rel="noopener noreferrer">
                Official website ↗
              </a>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-ink-soft">
        Numbers can change and may differ depending on whether you call from the same network. If a number does not connect, check the operator's website.
      </p>
    </PageShell>
  );
}
