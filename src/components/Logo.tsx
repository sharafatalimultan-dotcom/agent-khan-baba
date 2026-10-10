// Agent Khan Baba professional brand mark. Independent informational service; not a government logo.
export function LogoMark({ size = 40, uid = "lm" }: { size?: number; uid?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Agent Khan Baba logo" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${uid}-bg`} x1="8" y1="4" x2="54" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0b8050" />
          <stop offset="1" stopColor="#063454" />
        </linearGradient>
      </defs>
      <path d="M32 3 55 12v17c0 15-9 25-23 32C18 54 9 44 9 29V12L32 3Z" fill={`url(#${uid}-bg)`} />
      <path d="M32 9 49 16v13c0 11-6 19-17 25-11-6-17-14-17-25V16L32 9Z" fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="1.6"/>
      <path d="M23 22h14l6 6v15a3 3 0 0 1-3 3H23a3 3 0 0 1-3-3V25a3 3 0 0 1 3-3Z" fill="#fff"/>
      <path d="M34 22v7h7" fill="none" stroke="#0b8050" strokeWidth="2"/>
      <rect x="24" y="31" width="14" height="11" rx="2" fill="#f3c64e"/>
      <path d="M24 36.5h14M31 31v11" stroke="#063454" strokeOpacity=".55" strokeWidth="1.4"/>
      <circle cx="44" cy="43" r="9" fill="#fff" stroke="#0b8050" strokeWidth="2.5"/>
      <path d="m40 43 2.5 2.5L48 39" fill="none" stroke="#07864b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
export default function Logo({ size = 40, uid = "lg", showText = true, light = false }: { size?: number; uid?: string; showText?: boolean; light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} uid={uid} />
      {showText && <span className="flex flex-col leading-none">
        <span className={`text-[17px] font-extrabold tracking-tight sm:text-lg ${light ? "text-white" : "text-ink"}`}>Agent <span className="text-brand">Khan Baba</span></span>
        <span className={`mt-1 text-[10px] font-bold uppercase tracking-[0.2em] ${light ? "text-white/70" : "text-ink-soft"}`}>SIM Details · Pakistan</span>
      </span>}
    </span>
  );
}
