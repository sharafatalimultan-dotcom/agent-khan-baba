import { getSetting } from "@/lib/data";

export default async function AnnouncementBar() {
  const text = (await getSetting("announcement", "")).trim();
  if (!text) return null;
  // Rendered as plain text: admin-entered content can never inject markup.
  return <div role="note" className="bg-brand px-4 py-2 text-center text-sm font-semibold text-white">{text}</div>;
}
