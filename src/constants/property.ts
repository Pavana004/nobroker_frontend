import { FurnishingType, PropertyType } from "@/types";

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "VILLA", label: "Villa" },
  { value: "INDEPENDENT_HOUSE", label: "Independent House" },
  { value: "PLOT", label: "Plot" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "PG_HOSTEL", label: "PG / Hostel" },
];

export const FURNISHING_TYPES: { value: FurnishingType; label: string }[] = [
  { value: "UNFURNISHED", label: "Unfurnished" },
  { value: "SEMI_FURNISHED", label: "Semi-furnished" },
  { value: "FULLY_FURNISHED", label: "Fully furnished" },
];

export const AMENITIES = [
  "parking",
  "lift",
  "gym",
  "swimming_pool",
  "power_backup",
  "security",
  "clubhouse",
  "park",
  "wifi",
  "water_supply",
] as const;

export function propertyTypeLabel(value: PropertyType): string {
  return PROPERTY_TYPES.find((t) => t.value === value)?.label ?? value;
}

export function furnishingLabel(value: FurnishingType): string {
  return FURNISHING_TYPES.find((t) => t.value === value)?.label ?? value;
}

export const CITIES = ["Bangalore", "Mumbai", "Pune", "Delhi"];
