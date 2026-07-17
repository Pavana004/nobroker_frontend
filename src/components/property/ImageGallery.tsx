"use client";

import Image from "next/image";
import { useState } from "react";
import { PropertyImage } from "@/types";

export function ImageGallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return <div className="bracket-frame flex h-96 items-center justify-center bg-line/30 text-sm text-ink/40">No photos yet</div>;
  }

  return (
    <div className="space-y-3">
      <div className="bracket-frame relative h-80 w-full overflow-hidden bg-line/30 sm:h-96">
        <Image
          src={images[activeIndex].url}
          alt={`${title} — photo ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden border-2 ${
                idx === activeIndex ? "border-teal" : "border-transparent"
              }`}
              aria-label={`View photo ${idx + 1}`}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
