import Link from "next/link";

const CARDS = [
  { href: "/pta-guide", icon: "📖", title: "PTA Verification Guide", text: "Official services and links", tint: "bg-sky-100" },
  { href: "/network-helplines", icon: "📱", title: "Network Helplines", text: "Jazz, Zong, Telenor, Ufone", tint: "bg-emerald-100" },
  { href: "/block-report-sim", icon: "🚫", title: "Block or Report Unauthorized SIMs", text: "Steps to protect your CNIC", tint: "bg-emerald-100" },
  { href: "/faqs", icon: "❓", title: "Frequently Asked Questions", text: "Quick, clear answers", tint: "bg-amber-100" },
];

export default function QuickCards() {
  return (
    <section aria-label="Quick access" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {CARDS.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          className="group flex flex-col items-center gap-2 rounded-xl2 border border-slate-200 bg-white p-4 text-center shadow-card transition duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_10px_28px_rgba(220,38,38,0.12)]"
        >
          <span aria-hidden className={`grid h-14 w-14 place-items-center rounded-2xl text-3xl transition group-hover:scale-110 ${c.tint}`}>{c.icon}</span>
          <span className="text-sm font-bold leading-snug">{c.title}</span>
          <span className="text-xs text-ink-soft">{c.text}</span>
        </Link>
      ))}
    </section>
  );
}
