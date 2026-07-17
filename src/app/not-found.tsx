import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <Compass className="h-10 w-10 text-ink/30" strokeWidth={1.5} />
      <h1 className="font-display text-3xl text-ink">This address doesn't exist</h1>
      <p className="max-w-sm text-sm text-ink/60">
        The listing or page you're looking for has moved, been taken down, or never existed.
      </p>
      <Link href="/properties">
        <Button variant="secondary">Browse listings instead</Button>
      </Link>
    </div>
  );
}
