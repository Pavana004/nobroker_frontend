"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Pencil, Plus } from "lucide-react";
import { propertyService } from "@/services/propertyService";
import { formatPrice } from "@/utils/format";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/StateBlocks";
import { PropertyGridSkeleton } from "@/components/ui/Skeleton";

function MyPropertiesList() {
  const queryClient = useQueryClient();

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties", "mine"],
    queryFn: propertyService.getMine,
  });

  const deleteMutation = useMutation({
    mutationFn: propertyService.remove,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["properties", "mine"] }),
  });

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">My properties</h1>
        <Link href="/properties/create">
          <Button size="sm">
            <Plus className="h-4 w-4" /> List a property
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <PropertyGridSkeleton />
      ) : !properties || properties.length === 0 ? (
        <EmptyState
          title="No listings yet"
          message="Once you list a property, it'll show up here for you to manage."
        />
      ) : (
        <div className="divide-y divide-line border border-line">
          {properties.map((property) => (
            <div
              key={property.id}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div>
                <Link
                  href={`/properties/${property.id}`}
                  className="font-display text-base text-ink hover:text-teal"
                >
                  {property.title}
                </Link>
                <p className="text-sm text-ink/60">
                  {property.locality}, {property.city} ·{" "}
                  <span className="ledger-value">
                    {formatPrice(property.price)}
                  </span>{" "}
                  · {property.status}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link href={`/properties/${property.id}/edit`}>
                  <Button variant="secondary" size="sm">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    if (
                      confirm("Delete this listing? This cannot be undone.")
                    ) {
                      deleteMutation.mutate(property.id);
                    }
                  }}
                  isLoading={
                    deleteMutation.isPending &&
                    deleteMutation.variables === property.id
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyPropertiesPage() {
  return (
    <RequireAuth>
      <MyPropertiesList />
    </RequireAuth>
  );
}
