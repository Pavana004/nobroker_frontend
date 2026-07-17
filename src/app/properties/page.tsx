"use client";

import { useState } from "react";
import { SearchParams } from "@/types";
import { useSearchProperties } from "@/features/properties/useSearchProperties";
import { SearchBar } from "@/features/properties/SearchBar";
import { FiltersPanel } from "@/features/properties/FiltersPanel";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/StateBlocks";

export default function PropertiesPage() {
  const [filters, setFilters] = useState<Omit<SearchParams, "cursor">>({
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: 12,
  });

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useSearchProperties(filters);

  console.log("properties data:", data);

  const properties = data?.pages.flatMap((page) => page.properties) ?? [];

  return (
    <div className="container-page py-10">
      <div className="mb-8 space-y-4">
        <h1 className="font-display text-3xl text-ink">Browse listings</h1>
        <SearchBar
          defaultValue={filters.city}
          onSearch={(city) =>
            setFilters((f) => ({ ...f, city: city || undefined }))
          }
        />
        <FiltersPanel filters={filters} onChange={setFilters} />
      </div>

      {isError ? (
        <ErrorState onAction={() => refetch()} />
      ) : (
        <>
          <PropertyGrid properties={properties} isLoading={isLoading} />

          {hasNextPage && (
            <div className="mt-10 flex justify-center">
              <Button
                variant="secondary"
                onClick={() => fetchNextPage()}
                isLoading={isFetchingNextPage}
              >
                Load more listings
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
