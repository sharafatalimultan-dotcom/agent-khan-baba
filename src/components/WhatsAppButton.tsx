import { SITE } from "@/lib/site";

export default function WhatsAppButton() {
  const digits = SITE.whatsapp.replace(/\D/g, "");
  const href = digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent("Hello, I need help with SIM verification guidance.")}`
    : "/contact";
  const external = Boolean(digits);
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={external ? "Chat with support on WhatsApp" : "Contact support"}
      className="fixed bottom-4 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-card transition hover:scale-105"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7a11.300 11.300 0 0 1-4.600-4.100c-.5-.7-1.100-1.800-1.100-2.900s.6-1.600.8-1.900c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.500l.8 1.900c.1.200.1.400 0 .600l-.4.600c-.1.200-.3.300-.1.600.2.300.8 1.200 1.600 1.900 1.100.9 2 1.200 2.300 1.300.3.100.4.100.6-.1l.8-1c.2-.3.400-.2.600-.1l1.800.9c.3.100.5.200.5.300.1.200.1.800-.1 1.400Z" />
      </svg>
    </a>
  );
}
