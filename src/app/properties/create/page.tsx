"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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
import { ImageUploader } from "@/features/properties/ImageUploader";

function CreatePropertyForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreatePropertyInput>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: { amenities: [], imageUrls: [] },
  });

  const selectedAmenities = watch("amenities") ?? [];
  const imageUrls = watch("imageUrls") ?? [];

  const mutation = useMutation({
    mutationFn: propertyService.create,
    onSuccess: (property) => router.push(`/properties/${property.id}`),
  });

  function toggleAmenity(amenity: string) {
    const next = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];
    setValue("amenities", next);
  }

  return (
    <div className="container-page max-w-2xl py-10">
      <h1 className="mb-1 font-display text-2xl text-ink">List a property</h1>
      <p className="mb-8 text-sm text-ink/60">
        Reach seekers directly — no brokerage fees, no middlemen.
      </p>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="space-y-5"
      >
        <Input
          label="Title"
          placeholder="e.g. 3BHK Apartment in Koramangala"
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
            placeholder="Select type"
            options={PROPERTY_TYPES}
            error={errors.propertyType?.message}
            {...register("propertyType")}
          />
          <Select
            label="Furnishing"
            placeholder="Select furnishing"
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

        <div>
          <p className="mb-2 text-sm font-medium text-ink">Photos</p>
          <ImageUploader
            value={imageUrls}
            onChange={(urls) => setValue("imageUrls", urls)}
          />
        </div>

        {mutation.isError && (
          <p className="text-sm text-brick">
            {getErrorMessage(mutation.error)}
          </p>
        )}

        <Button type="submit" className="w-full" isLoading={mutation.isPending}>
          Publish listing
        </Button>
      </form>
    </div>
  );
}

export default function CreatePropertyPage() {
  return (
    <RequireAuth>
      <CreatePropertyForm />
    </RequireAuth>
  );
}
