import type { OfficialLink } from "@/lib/defaults";

export default function LinkList({ links }: { links: OfficialLink[] }) {
  return (
    <ul className="not-prose grid gap-3 sm:grid-cols-2">
      {links.map((l) => (
        <li key={l.id}>
          <a href={l.url} target="_blank" rel="noopener noreferrer" className="card block h-full transition hover:border-brand">
            <span className="font-bold">{l.label} ↗</span>
            {l.description && <span className="mt-1 block text-sm text-ink-soft">{l.description}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
