"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  createPropertySchema,
  CreatePropertyInput,
} from "@/features/properties/schemas";
import { propertyService } from "@/services/propertyService";
import { getErrorMessage } from "@/utils/getErrorMessage";
import {
  PROPERTY_TYPES,
  FURNISHING_TYPES,
  AMENITIES,
} from "@/constants/property";
import { Input } from "@/components/ui/Input";
import { Textarea, Select } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { useAuthStore } from "@/store/authStore";

function EditPropertyForm({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: property, isLoading } = useQuery({
    queryKey: ["properties", id],
    queryFn: () => propertyService.getById(id),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreatePropertyInput>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: { amenities: [], imageUrls: [] },
  });

  useEffect(() => {
    if (property) {
      reset({
        title: property.title,
        description: property.description,
        price: Number(property.price),
        city: property.city,
        locality: property.locality,
        address: property.address,
        propertyType: property.propertyType,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: Number(property.area),
        furnishing: property.furnishing,
        amenities: property.amenities,
        imageUrls: property.images.map((img) => img.url),
      });
    }
  }, [property, reset]);

  const selectedAmenities = watch("amenities") ?? [];

  const mutation = useMutation({
    mutationFn: (data: CreatePropertyInput) => propertyService.update(id, data),
    onSuccess: () => router.push(`/properties/${id}`),
  });

  function toggleAmenity(amenity: string) {
    const next = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];
    setValue("amenities", next);
  }

  if (isLoading) {
    return (
      <div className="container-page py-10 text-sm text-ink/50">
        Loading listing…
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container-page py-10 text-sm text-ink/50">
        Listing not found.
      </div>
    );
  }

  if (user && property.ownerId !== user.id) {
    return (
      <div className="container-page py-10 text-sm text-brick">
        You can only edit your own listings.
      </div>
    );
  }

  return (
    <div className="container-page max-w-2xl py-10">
      <h1 className="mb-8 font-display text-2xl text-ink">Edit listing</h1>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="space-y-5"
      >
        <Input
          label="Title"
          error={errors.title?.message}
          {...register("title")}
        />
        <Textarea
          label="Description"
          rows={5}
          error={errors.description?.message}
          {...register("description")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="City"
            error={errors.city?.message}
            {...register("city")}
          />
          <Input
            label="Locality"
            error={errors.locality?.message}
            {...register("locality")}
          />
        </div>
        <Input
          label="Address"
          error={errors.address?.message}
          {...register("address")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Property type"
            options={PROPERTY_TYPES}
            error={errors.propertyType?.message}
            {...register("propertyType")}
          />
          <Select
            label="Furnishing"
            options={FURNISHING_TYPES}
            error={errors.furnishing?.message}
            {...register("furnishing")}
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Input
            label="Bedrooms"
            type="number"
            min={0}
            error={errors.bedrooms?.message}
            {...register("bedrooms")}
          />
          <Input
            label="Bathrooms"
            type="number"
            min={0}
            error={errors.bathrooms?.message}
            {...register("bathrooms")}
          />
          <Input
            label="Area (sq.ft)"
            type="number"
            min={0}
            error={errors.area?.message}
            {...register("area")}
          />
          <Input
            label="Rent (₹/mo)"
            type="number"
            min={0}
            error={errors.price?.message}
            {...register("price")}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink">Amenities</p>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((amenity) => (
              <button
                type="button"
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                className={`border px-3 py-1.5 text-xs capitalize transition-colors ${
                  selectedAmenities.includes(amenity)
                    ? "border-teal bg-teal text-paper"
                    : "border-line text-ink/70 hover:border-ink"
                }`}
              >
                {amenity.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {mutation.isError && (
          <p className="text-sm text-brick">
            {getErrorMessage(mutation.error)}
          </p>
        )}

        <Button type="submit" className="w-full" isLoading={mutation.isPending}>
          Save changes
        </Button>
      </form>
    </div>
  );
}

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  return (
    // <RequireAuth>
    <EditPropertyForm id={params.id} />
    // </RequireAuth>
  );
}
