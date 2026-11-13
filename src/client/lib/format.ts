export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export function formatSize(bytes: number): string {
  if (!bytes) return "0 Ko";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} Ko`;
  return `${(kb / 1024).toFixed(1)} Mo`;
}

export function plural(n: number, singular: string, pluralForm?: string): string {
  if (n <= 1) return singular;
  return pluralForm || singular + "s";
}
