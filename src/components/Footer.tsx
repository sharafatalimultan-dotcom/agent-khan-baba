import Link from "next/link";
import { LEGAL_NAV, NAV } from "@/lib/site";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-20 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:grid-cols-3">
        <div>
          <Logo size={42} uid="ftr" light />
          <p className="mt-4 text-sm leading-6 text-slate-400">
            An independent information website. Not affiliated with PTA, NADRA or any mobile network operator.
          </p>
        </div>
        <nav aria-label="Pages">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Explore</p>
          <ul className="space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.href}><Link className="transition hover:text-white hover:underline" href={n.href}>{n.label}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Legal">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Legal</p>
          <ul className="space-y-2 text-sm">
            {LEGAL_NAV.map((n) => (
              <li key={n.href}><Link className="transition hover:text-white hover:underline" href={n.href}>{n.label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Agent Khan Baba. We never sell or reveal private SIM-owner records.
      </p>
    </footer>
  );
}
