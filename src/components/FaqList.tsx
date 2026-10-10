import type { Faq } from "@/lib/defaults";

export default function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((f) => (
        <details key={f.id} className="card group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold">
            {f.question}
            <span aria-hidden className="text-brand transition group-open:rotate-45">＋</span>
          </summary>
          <p className="mt-3 leading-7 text-ink-soft">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
