"use client";

import { Upload, X, Loader } from "lucide-react";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { FormData } from "./form";

export default function ProductImageUpload({
  updateField,
}: {
  updateField?: (field: keyof FormData, value: string) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleRemove = () => {
    setPreview(null);
    setPublicId(null);
    updateField?.("article_id", "");
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 p-5 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60">
      <h2 className="mb-4 font-display text-[16px] font-medium text-cloud">
        Product Image
      </h2>

      <div className="flex justify-center w-full">
        {preview ? (
          // 1. Keep the preview window separate
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
          <CldUploadWidget
            uploadPreset="ecommerce-website"
            signatureEndpoint="/api/sign-cloudinary"
            onSuccess={(result) => {
              console.log(result);
              setUploading(false);
              const info = result?.info as
                | { secure_url?: string; public_id?: string }
                | undefined;
              if (info?.secure_url) {
                setPreview(info.secure_url);
                const id = info.public_id || null;
                setPublicId(id);
                if (id) {
                  updateField?.("article_id", id);
                }
              }
            }}
            onQueuesStart={() => setUploading(true)}
            onError={(error) => {
              console.error("Cloudinary upload error:", error);
              setUploading(false);
            }}
            options={{
              maxFiles: 1,
              sources: ["local", "url", "camera"],
              clientAllowedFormats: ["jpg", "png", "webp", "jpeg"],
            }}
          >
            {({ open, isLoading }) => (
              <button
                type="button"
                disabled={uploading || isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  open();
                }}
                className="flex aspect-square w-full max-w-xs cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-cloud/20 transition hover:border-accent/50 hover:bg-accent/5 disabled:cursor-not-allowed"
              >
                {uploading || isLoading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader className="h-8 w-8 animate-spin text-cloud/30" />
                    <span className="text-xs text-cloud/40">Uploading…</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-cloud/40" />
                    <span className="text-xs font-medium text-cloud/40">
                      Click to upload
                    </span>
                    <span className="text-[10px] text-cloud/30">
                      JPG, PNG or WebP
                    </span>
                  </div>
                )}
              </button>
            )}
          </CldUploadWidget>
        )}
      </div>

      {publicId && (
        <p className="mt-3 truncate text-center text-[11px] text-cloud/50">
          {publicId}
        </p>
      )}
    </div>
  );
}
