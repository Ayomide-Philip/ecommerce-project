"use client";

import { Upload, X } from "lucide-react";
import { useState } from "react";

export default function ProductImageUpload({
  setImageId,
}: {
  setImageId?: (id: string) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Revoke previous preview to avoid memory leaks
    if (preview) URL.revokeObjectURL(preview);

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleRemove = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 p-5 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60">
      <h2 className="mb-4 font-display text-[16px] font-medium text-cloud">
        Product Image
      </h2>

      <div className="flex justify-center">
        {preview ? (
          <div className="group relative aspect-square w-full max-w-xs overflow-hidden rounded-xl border border-black/10 bg-panel dark:border-[rgba(244,244,242,0.08)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Product preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition hover:bg-black/80 group-hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex aspect-square w-full max-w-xs cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-cloud/20 transition hover:border-accent/50 hover:bg-accent/5">
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-cloud/40" />
              <span className="text-xs font-medium text-cloud/40">
                Click to upload
              </span>
              <span className="text-[10px] text-cloud/30">
                JPG, PNG or WebP
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        )}
      </div>

      {file && (
        <p className="mt-3 truncate text-center text-[11px] text-cloud/50">
          {file.name}
        </p>
      )}
    </div>
  );
}
