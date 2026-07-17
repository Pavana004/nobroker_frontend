import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Ruler } from "lucide-react";
import { Property } from "@/types";
import { formatPrice, formatArea, timeAgo } from "@/utils/format";
import { propertyTypeLabel } from "@/constants/property";
import { Badge } from "@/components/ui/Badge";

export function PropertyCard({ property }: { property: Property }) {
  const primaryImage = property.images.find((img) => img.isPrimary) ?? property.images[0];

  return (
    <Link
      href={`/properties/${property.id}`}
      className="bracket-frame group block border border-line bg-paper transition-transform"
    >
      <div className="relative h-48 w-full overflow-hidden bg-line/30">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink/40">No photo</div>
        )}
        <div className="absolute left-2 top-2">
          <Badge tone="brass">{propertyTypeLabel(property.propertyType)}</Badge>
        </div>
      </div>

      <div className="space-y-2 p-4">
        <p className="ledger-value text-lg text-brick">
          {formatPrice(property.price)}
          <span className="text-xs font-normal text-ink/50"> /mo</span>
        </p>
        <h3 className="line-clamp-1 font-display text-base text-ink">{property.title}</h3>
        <p className="text-sm text-ink/60">
          {property.locality}, {property.city}
        </p>

        <div className="flex items-center gap-4 border-t border-line pt-2 text-xs text-ink/60">
          <span className="flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5" /> {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" /> {property.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Ruler className="h-3.5 w-3.5" /> {formatArea(property.area)}
          </span>
          <span className="ml-auto">{timeAgo(property.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
