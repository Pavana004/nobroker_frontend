import { z } from "zod";

const PropertyTypeEnum = z.enum([
  "APARTMENT",
  "VILLA",
  "INDEPENDENT_HOUSE",
  "PLOT",
  "COMMERCIAL",
  "PG_HOSTEL",
]);
const FurnishingEnum = z.enum(["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"]);

export const createPropertySchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(150),
  description: z.string().trim().min(20, "Add a bit more detail (min 20 characters)").max(5000),
  price: z.coerce.number({ invalid_type_error: "Enter a price" }).positive("Price must be greater than 0"),
  city: z.string().trim().min(2, "City is required").max(100),
  locality: z.string().trim().min(2, "Locality is required").max(150),
  address: z.string().trim().min(5, "Address is required").max(300),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  propertyType: PropertyTypeEnum,
  bedrooms: z.coerce.number().int().min(0).max(20),
  bathrooms: z.coerce.number().int().min(0).max(20),
  area: z.coerce.number().positive("Enter the area in sq.ft"),
  furnishing: FurnishingEnum,
  amenities: z.array(z.string()).default([]),
  imageUrls: z.array(z.string().url()).max(10).default([]),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
