export function formatPrice(price: string | number): string {
  const value = typeof price === "string" ? Number(price) : price;
  // Indian numbering: lakhs/crores read naturally to the target audience.
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${new Intl.NumberFormat("en-IN").format(value)}`;
}

export function formatPriceExact(price: string | number): string {
  const value = typeof price === "string" ? Number(price) : price;
  return `₹${new Intl.NumberFormat("en-IN").format(value)}`;
}

export function formatArea(area: string | number): string {
  const value = typeof area === "string" ? Number(area) : area;
  return `${new Intl.NumberFormat("en-IN").format(value)} sq.ft`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  const units: [number, string][] = [
    [31536000, "y"],
    [2592000, "mo"],
    [604800, "w"],
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
  ];
  for (const [secs, label] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value}${label} ago`;
  }
  return "just now";
}
