import Link from "next/link";
import { KeyRound, ShieldCheck, Wallet } from "lucide-react";
import { Property } from "@/types";
import { serverFetch } from "@/lib/serverFetch";
import { PropertyCard } from "@/components/property/PropertyCard";
import { HomeSearchBar } from "@/features/properties/HomeSearchBar";

export default async function HomePage() {
  const result = await serverFetch<Property[]>("/properties/search?limit=6&sortBy=createdAt&sortOrder=desc", 300);
  const featured = result ?? [];

  return (
    <div>
      {/* Hero — the thesis: a direct line from search to a verified owner. */}
      <section className="border-b border-line bg-paper">
        <div className="container-page grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-brass">No brokerage · No middlemen</p>
            <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
              Find a home,<br />drawn straight from the owner.
            </h1>
            <p className="mt-5 max-w-md text-ink/70">
              Every listing on Plinth connects you directly to the person who owns it —
              verified details, real photos, and a conversation with no one in between.
            </p>
            <div className="mt-8">
              <HomeSearchBar />
            </div>
          </div>

          <div className="bracket-frame relative hidden aspect-[4/3] border border-line bg-line/20 lg:block">
            <div className="absolute inset-0 flex flex-col justify-between p-6 font-mono text-xs text-ink/40">
              <div className="flex justify-between">
                <span>SITE PLAN</span>
                <span>SCALE 1:100</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-ink/60">
                <div className="border border-line/60 p-3">
                  <p className="text-2xl text-ink">10k+</p>
                  <p>Active listings</p>
                </div>
                <div className="border border-line/60 p-3">
                  <p className="text-2xl text-ink">4</p>
                  <p>Metro cities</p>
                </div>
                <div className="border border-line/60 p-3">
                  <p className="text-2xl text-ink">₹0</p>
                  <p>Brokerage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — a genuine 3-step sequence, so numbering earns its place. */}
      <section className="border-b border-line">
        <div className="container-page grid grid-cols-1 gap-8 py-14 sm:grid-cols-3">
          {[
            { icon: KeyRound, step: "01", title: "Search & shortlist", body: "Filter by city, budget, and bedrooms with results that stay fast even at scale." },
            { icon: ShieldCheck, step: "02", title: "Message the owner", body: "Send one inquiry per listing — owners see it immediately, no forwarding through an agent." },
            { icon: Wallet, step: "03", title: "Move in, brokerage-free", body: "Agree terms directly. No commission split, no hidden listing fee." },
          ].map(({ icon: Icon, step, title, body }) => (
            <div key={step}>
              <div className="mb-3 flex items-center gap-2 font-mono text-xs text-ink/40">{step}</div>
              <Icon className="mb-3 h-6 w-6 text-teal" strokeWidth={1.5} />
              <h3 className="mb-1 font-display text-lg text-ink">{title}</h3>
              <p className="text-sm text-ink/60">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured listings */}
      {featured.length > 0 && (
        <section className="container-page py-14">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl text-ink">Recently listed</h2>
            <Link href="/properties" className="text-sm text-teal underline underline-offset-2">
              View all listings
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
