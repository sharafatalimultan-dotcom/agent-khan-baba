// Pure validation helpers (no framework imports so they can be unit tested).

const MOBILE_PREFIXES = new Set([
  // Jazz / Warid
  "300", "301", "302", "303", "304", "305", "306", "307", "308", "309",
  // Ufone
  "330", "331", "332", "333", "334", "335", "336", "337",
  // Telenor
  "340", "341", "342", "343", "344", "345", "346", "347", "348", "349",
  // Zong
  "310", "311", "312", "313", "314", "315", "316", "317", "318", "319",
  // SCOM
  "355",
]);

export type Validation<T> = { ok: true; value: T } | { ok: false; message: string };

/** Normalises 03XXXXXXXXX, 3XXXXXXXXX, +923XXXXXXXXX, 00923XXXXXXXXX, 923XXXXXXXXX to 03XXXXXXXXX. */
export function normalizeMobile(input: string): Validation<string> {
  const raw = (input ?? "").trim();
  if (!raw) return { ok: false, message: "Please enter a mobile number." };
  if (/[^\d+\s-]/.test(raw)) {
    return { ok: false, message: "Use digits only, for example 03001234567 or +923001234567." };
  }
  let digits = raw.replace(/[\s-]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.includes("+")) return { ok: false, message: "The + sign is only allowed at the start." };
  if (digits.startsWith("0092")) digits = digits.slice(4);
  else if (digits.startsWith("92") && digits.length === 12) digits = digits.slice(2);
  else if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);

  if (digits.length !== 10 || !digits.startsWith("3")) {
    return {
      ok: false,
      message: "Enter a valid Pakistani mobile number such as 03001234567 or +923001234567.",
    };
  }
  if (!MOBILE_PREFIXES.has(digits.slice(0, 3))) {
    return { ok: false, message: "This number prefix is not a recognised Pakistani mobile prefix." };
  }
  return { ok: true, value: "0" + digits };
}

/** Accepts 13 digits, with or without dashes (12345-1234567-1). */
export function normalizeCnic(input: string): Validation<string> {
  const raw = (input ?? "").trim();
  if (!raw) return { ok: false, message: "Please enter your 13-digit CNIC number." };
  if (/[^\d-\s]/.test(raw)) return { ok: false, message: "CNIC may contain digits and dashes only." };
  const digits = raw.replace(/[-\s]/g, "");
  if (digits.length !== 13) return { ok: false, message: "A CNIC has exactly 13 digits." };
  if (digits[0] === "0") return { ok: false, message: "This does not look like a valid CNIC (province digit)." };
  return { ok: true, value: digits };
}

export function maskMobile(m: string): string {
  return m.length >= 11 ? `${m.slice(0, 4)}•••${m.slice(-4)}` : "•••";
}

export function maskCnic(c: string): string {
  return c.length === 13 ? `•••••-•••${c.slice(8, 12)}-•` : "•••";
}

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
