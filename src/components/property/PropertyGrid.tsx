import { Property } from "@/types";
import { PropertyCard } from "./PropertyCard";
import { PropertyGridSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/StateBlocks";

interface PropertyGridProps {
  properties: Property[];
  isLoading: boolean;
}

export function PropertyGrid({ properties, isLoading }: PropertyGridProps) {
  if (isLoading) return <PropertyGridSkeleton />;
  if (properties.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
