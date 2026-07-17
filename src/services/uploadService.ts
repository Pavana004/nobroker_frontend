import { api } from "@/lib/axios";
import { ApiSuccess } from "@/types";

interface UploadSignature {
  timestamp: number;
  folder: string;
  signature: string;
  apiKey: string;
  cloudName: string;
  maxImageSizeMb: number;
  maxImagesPerProperty: number;
}

export const uploadService = {
  async getSignature(): Promise<UploadSignature> {
    const res =
      await api.post<ApiSuccess<UploadSignature>>("/upload/signature");
    console.log("Upload signature:", res);
    return res.data.data;
  },

  // Uploads a single file directly to Cloudinary using a signature minted
  // by our API (see backend/src/services/upload.service.ts). The file bytes
  // never touch our Express server — only the resulting secure_url does,
  // once it's attached to a property. See docs/IMAGE_STRATEGY.md.
  async uploadToCloudinary(
    file: File,
    signature: UploadSignature,
  ): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signature.apiKey);
    formData.append("timestamp", String(signature.timestamp));
    formData.append("signature", signature.signature);
    formData.append("folder", signature.folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(
        body?.error?.message ?? "Image upload failed. Please try again.",
      );
    }

    const data = await res.json();
    return data.secure_url as string;
  },

  async uploadImages(
    files: File[],
    onProgress?: (uploaded: number, total: number) => void,
  ): Promise<string[]> {
    const signature = await this.getSignature();

    const maxBytes = signature.maxImageSizeMb * 1024 * 1024;
    const oversized = files.find((f) => f.size > maxBytes);
    if (oversized) {
      throw new Error(
        `"${oversized.name}" exceeds the ${signature.maxImageSizeMb}MB limit.`,
      );
    }

    const urls: string[] = [];
    for (const file of files) {
      const url = await this.uploadToCloudinary(file, signature);
      urls.push(url);
      onProgress?.(urls.length, files.length);
    }
    return urls;
  },
};
