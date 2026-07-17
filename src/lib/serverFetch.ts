const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

// Used only in Server Components — plain fetch (not the Axios client, which
// depends on the client-only Zustand store) so property detail pages can be
// statically generated / ISR'd. `revalidate: 3600` matches the ISR strategy
// documented in docs/SEO_STRATEGY.md.
export async function serverFetch<T>(path: string, revalidateSeconds = 3600): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: revalidateSeconds },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as T;
  } catch {
    return null;
  }
}
