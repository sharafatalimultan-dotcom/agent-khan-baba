export const SITE = {
  name: "Agent Khan Baba",
  tagline: "Your trusted guide to safe SIM verification and official telecom services in Pakistan.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "support@example.com",
};

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/sim-verification-guide", label: "SIM Verification Guide" },
  { href: "/pta-guide", label: "PTA Guide" },
  { href: "/network-helplines", label: "Network Helplines" },
  { href: "/block-report-sim", label: "Block or Report a SIM" },
  { href: "/faqs", label: "FAQs" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export const LEGAL_NAV = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms and Conditions" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export const ALL_PUBLIC_PATHS = [...NAV, ...LEGAL_NAV].map((n) => n.href);
