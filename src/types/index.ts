export type Role = "USER" | "ADMIN";

export type PropertyType =
  | "APARTMENT"
  | "VILLA"
  | "INDEPENDENT_HOUSE"
  | "PLOT"
  | "COMMERCIAL"
  | "PG_HOSTEL";

export type FurnishingType = "UNFURNISHED" | "SEMI_FURNISHED" | "FULLY_FURNISHED";

export type ListingStatus = "ACTIVE" | "INACTIVE" | "RENTED" | "SOLD";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  createdAt: string;
}

export interface PropertyOwner {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface PropertyImage {
  id: string;
  url: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  price: string; // Decimal serializes as string over JSON
  city: string;
  locality: string;
  address: string;
  latitude: string | null;
  longitude: string | null;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area: string;
  furnishing: FurnishingType;
  amenities: string[];
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
  images: PropertyImage[];
  owner: PropertyOwner;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  senderId: string;
  message: string;
  status: "PENDING" | "CONTACTED" | "CLOSED";
  createdAt: string;
  property: {
    id: string;
    title: string;
    city: string;
    price?: string;
    images?: { url: string }[];
  };
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: { pagination?: Pagination };
}

export interface ApiFailure {
  success: false;
  message: string;
  errors?: unknown;
}

export interface Pagination {
  nextCursor: string | null;
  hasNextPage: boolean;
  count: number;
}

export interface SearchParams {
  city?: string;
  locality?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType;
  bedrooms?: number;
  sortBy?: "price" | "createdAt";
  sortOrder?: "asc" | "desc";
  cursor?: string;
  limit?: number;
}
