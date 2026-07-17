import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BedDouble, Bath, Ruler, MapPin } from "lucide-react";
import { Property } from "@/types";
import { serverFetch } from "@/lib/serverFetch";
import { formatPriceExact, formatArea, formatDate } from "@/utils/format";
import { propertyTypeLabel, furnishingLabel } from "@/constants/property";
import { Badge } from "@/components/ui/Badge";
import { ImageGallery } from "@/components/property/ImageGallery";
import { ContactForm } from "@/components/property/ContactForm";
import { PropertyGrid } from "@/components/property/PropertyGrid";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProperty(id: string) {
  return serverFetch<Property>(`/properties/${id}`);
}

// Dynamic metadata per docs/SEO_STRATEGY.md — unique title/description
// per listing, driven directly from the property record.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) return { title: "Listing not found" };

  const title = `${property.bedrooms}BHK ${propertyTypeLabel(property.propertyType)} for Rent in ${property.locality}, ${property.city} | ${formatPriceExact(property.price)}/mo`;
  const description = `${property.bedrooms} bed, ${property.bathrooms} bath ${propertyTypeLabel(property.propertyType).toLowerCase()} — ${formatArea(property.area)}, ${furnishingLabel(property.furnishing)}. ${property.description.slice(0, 120)}...`;
  const image = property.images[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: `/properties/${property.id}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) notFound();

  const similar = await serverFetch<Property[]>(`/properties/${id}/similar`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.title,
    description: property.description,
    image: property.images.map((img) => img.url),
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "INR",
      availability: property.status === "ACTIVE" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.locality,
      addressRegion: property.city,
    },
  };

  return (
    <div className="container-page py-10">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ImageGallery images={property.images} title={property.title} />

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brass">{propertyTypeLabel(property.propertyType)}</Badge>
              <Badge>{furnishingLabel(property.furnishing)}</Badge>
              <Badge tone={property.status === "ACTIVE" ? "teal" : "neutral"}>{property.status}</Badge>
            </div>
            <h1 className="font-display text-2xl text-ink sm:text-3xl">{property.title}</h1>
            <p className="flex items-center gap-1 text-sm text-ink/60">
              <MapPin className="h-4 w-4" /> {property.address}, {property.locality}, {property.city}
            </p>
            <p className="ledger-value text-2xl text-brick">
              {formatPriceExact(property.price)} <span className="text-sm font-normal text-ink/50">/month</span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 border-y border-line py-4 text-sm">
            <div className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-ink/50" />
              <span className="ledger-value">{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-4 w-4 text-ink/50" />
              <span className="ledger-value">{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-ink/50" />
              <span className="ledger-value">{formatArea(property.area)}</span>
            </div>
          </div>

          <div>
            <h2 className="mb-2 font-display text-lg text-ink">Description</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink/80">{property.description}</p>
          </div>

          {property.amenities.length > 0 && (
            <div>
              <h2 className="mb-2 font-display text-lg text-ink">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <Badge key={a}>{a.replace(/_/g, " ")}</Badge>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-ink/40">Listed on {formatDate(property.createdAt)}</p>
        </div>

        <div className="space-y-6">
          <div className="border border-line p-4">
            <h3 className="mb-1 font-display text-base text-ink">Listed by</h3>
            <p className="text-sm text-ink/70">{property.owner.name}</p>
          </div>
          <ContactForm propertyId={property.id} ownerId={property.ownerId} />
        </div>
      </div>

      {similar && similar.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-xl text-ink">Similar properties nearby</h2>
          <PropertyGrid properties={similar} isLoading={false} />
        </section>
      )}
    </div>
  );
}
