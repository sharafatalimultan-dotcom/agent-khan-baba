"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV, SITE } from "@/lib/site";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
    setSearchOpen(false);
    setQ("");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 shadow-[0_1px_12px_rgba(15,23,42,0.05)] backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" aria-label={`${SITE.name} home`} onClick={() => setMenuOpen(false)}>
          <Logo size={40} uid="hdr" />
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => { setSearchOpen((s) => !s); setMenuOpen(false); }}
            className="grid h-10 w-10 place-items-center rounded-xl hover:bg-panel"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          </button>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => { setMenuOpen((m) => !m); setSearchOpen(false); }}
            className="grid h-10 w-10 place-items-center rounded-xl hover:bg-panel"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={onSearch} role="search" className="mx-auto max-w-5xl px-4 pb-3">
          <label htmlFor="site-search" className="sr-only">Search the site</label>
          <div className="flex gap-2">
            <input id="site-search" ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)} className="input" placeholder="Search guides and FAQs" maxLength={80} />
            <button className="btn-primary !w-auto" type="submit">Search</button>
          </div>
        </form>
      )}

      {menuOpen && (
        <nav id="site-menu" aria-label="Main" className="border-t border-panel-border bg-white">
          <ul className="mx-auto grid max-w-5xl gap-1 px-4 py-3 sm:grid-cols-2">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2.5 font-medium hover:bg-panel">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
