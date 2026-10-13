export function formatBdt(value: number): string {
  return new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 2 }).format(
    Number.isFinite(value) ? value : 0,
  );
}

export function formatChange(value: number): string {
  const absolute = Math.abs(value);
  return `${value > 0 ? "▲" : value < 0 ? "▼" : "—"} ${formatBdt(absolute)}%`;
}

export function toAsciiDigits(value: string | number): string {
  const digits: Record<string, string> = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
    ",": "",
    "٬": "",
    "৳": "",
    "%": "",
    " ": "",
  };
  return String(value).replace(
    /[০-৯,٬৳% ]/g,
    (character) => digits[character] ?? character,
  );
}

export function numericValue(value: string | number): number {
  const parsed = Number(toAsciiDigits(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function banglaDate(date = new Date()): string {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);
}
