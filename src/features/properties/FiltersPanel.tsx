"use client";

import { PROPERTY_TYPES } from "@/constants/property";
import { SearchParams } from "@/types";
import { Select } from "@/components/ui/FormFields";

interface FiltersPanelProps {
  filters: Omit<SearchParams, "cursor">;
  onChange: (filters: Omit<SearchParams, "cursor">) => void;
}

const BEDROOM_OPTIONS = [
  { value: "1", label: "1+ BHK" },
  { value: "2", label: "2+ BHK" },
  { value: "3", label: "3+ BHK" },
  { value: "4", label: "4+ BHK" },
];

const BUDGET_OPTIONS = [
  { value: "25000", label: "Up to ₹25,000" },
  { value: "50000", label: "Up to ₹50,000" },
  { value: "100000", label: "Up to ₹1,00,000" },
  { value: "200000", label: "Up to ₹2,00,000" },
];

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "price:asc", label: "Price: Low to High" },
  { value: "price:desc", label: "Price: High to Low" },
];

export function FiltersPanel({ filters, onChange }: FiltersPanelProps) {
  const sortValue = `${filters.sortBy ?? "createdAt"}:${filters.sortOrder ?? "desc"}`;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Select
        aria-label="Property type"
        placeholder="Property type"
        options={PROPERTY_TYPES}
        value={filters.propertyType ?? ""}
        onChange={(e) =>
          onChange({ ...filters, propertyType: (e.target.value || undefined) as SearchParams["propertyType"] })
        }
      />
      <Select
        aria-label="Bedrooms"
        placeholder="Bedrooms"
        options={BEDROOM_OPTIONS}
        value={filters.bedrooms?.toString() ?? ""}
        onChange={(e) => onChange({ ...filters, bedrooms: e.target.value ? Number(e.target.value) : undefined })}
      />
      <Select
        aria-label="Budget"
        placeholder="Max budget"
        options={BUDGET_OPTIONS}
        value={filters.maxPrice?.toString() ?? ""}
        onChange={(e) => onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
      />
      <Select
        aria-label="Sort by"
        options={SORT_OPTIONS}
        value={sortValue}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split(":") as [SearchParams["sortBy"], SearchParams["sortOrder"]];
          onChange({ ...filters, sortBy, sortOrder });
        }}
      />
    </div>
  );
}
