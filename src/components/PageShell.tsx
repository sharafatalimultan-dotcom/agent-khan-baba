import Link from "next/link";

export default function PageShell({
  title,
  intro,
  children,
  prose = true,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
  prose?: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-soft">
        <Link href="/" className="hover:underline">Home</Link> <span aria-hidden>/</span> <span>{title}</span>
      </nav>
      <h1>{title}</h1>
      {intro && <p className="mt-3 text-lg leading-8 text-ink-soft">{intro}</p>}
      <div className={`mt-6 ${prose ? "prose-page" : ""}`}>{children}</div>
    </div>
  );
}
