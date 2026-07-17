"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2, Star } from "lucide-react";
import { uploadService } from "@/services/uploadService";

const MAX_IMAGES = 10; // mirrors backend MAX_IMAGES_PER_PROPERTY default — see backend/.env.example

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

// Controlled component: `value` holds the Cloudinary secure_urls already
// attached to the property being created/edited. Selecting files uploads
// them straight to Cloudinary (see uploadService) and appends the returned
// URLs — the URLs are what actually gets submitted with the property form,
// exactly as PropertyImage.url expects on the backend. The first image in
// the array is treated as primary, matching propertyRepository.replaceImages.
export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow re-selecting the same file later
    if (files.length === 0) return;

    if (value.length + files.length > MAX_IMAGES) {
      setError(`You can upload up to ${MAX_IMAGES} photos per listing.`);
      return;
    }

    setError(null);
    setIsUploading(true);
    setProgress({ done: 0, total: files.length });

    try {
      const uploadedUrls = await uploadService.uploadImages(
        files,
        (done, total) => setProgress({ done, total }),
      );
      onChange([...value, ...uploadedUrls]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Upload failed. Please try again.",
      );
    } finally {
      setIsUploading(false);
      setProgress(null);
    }
  }

  function removeImage(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  function makePrimary(url: string) {
    onChange([url, ...value.filter((u) => u !== url)]);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((url, idx) => (
          <div
            key={url}
            className="group relative aspect-square overflow-hidden border border-line"
          >
            <Image
              src={url}
              alt={`Property photo ${idx + 1}`}
              fill
              sizes="150px"
              className="object-cover"
            />
            {idx === 0 && (
              <span className="absolute left-1 top-1 flex items-center gap-1 bg-brass px-1.5 py-0.5 text-[10px] font-medium text-paper">
                <Star className="h-2.5 w-2.5 fill-current" /> Primary
              </span>
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/0 opacity-0 transition-opacity group-hover:bg-ink/40 group-hover:opacity-100">
              {idx !== 0 && (
                <button
                  type="button"
                  onClick={() => makePrimary(url)}
                  className="bg-paper px-2 py-1 text-[11px] text-ink hover:bg-brass hover:text-paper"
                >
                  Make primary
                </button>
              )}
              <button
                type="button"
                onClick={() => removeImage(url)}
                aria-label="Remove photo"
                className="bg-paper p-1.5 text-ink hover:bg-brick hover:text-paper"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        {value.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 border border-dashed border-line text-ink/50 transition-colors hover:border-teal hover:text-teal disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-[11px]">
                  {progress
                    ? `${progress.done}/${progress.total}`
                    : "Uploading…"}
                </span>
              </>
            ) : (
              <>
                <ImagePlus className="h-5 w-5" strokeWidth={1.5} />
                <span className="text-[11px]">Add photos</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />

      {error && <p className="text-xs text-brick">{error}</p>}
      <p className="text-xs text-ink/40">
        Up to {MAX_IMAGES} photos. First photo is used as the listing&apos;s
        primary image — hover any photo to change it.
      </p>
    </div>
  );
}
