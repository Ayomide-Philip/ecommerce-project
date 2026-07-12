import { Upload, X } from "lucide-react";

export default function ProductImageUpload({
  imagePreviews,
  removeImage,
  handleImageUpload,
}: {
  imagePreviews: string[];
  removeImage: (index: number) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 p-5 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60">
      <h2 className="mb-4 font-display text-[16px] font-medium text-cloud">
        Product Images
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {imagePreviews.map((preview, i) => (
          <div
            key={i}
            className="group relative aspect-square overflow-hidden rounded-xl border border-black/10 bg-panel dark:border-[rgba(244,244,242,0.08)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt={`Preview ${i + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition hover:bg-black/80 group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        <label className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-cloud/20 transition hover:border-accent/50 hover:bg-accent/5">
          <div className="flex flex-col items-center gap-1.5">
            <Upload className="h-5 w-5 text-cloud/40" />
            <span className="text-[10px] font-medium text-cloud/40">
              Upload
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="sr-only"
          />
        </label>
      </div>

      <p className="mt-3 text-[11px] text-cloud/40">
        Supported formats: JPG, PNG, WebP. Max 5MB each.
      </p>
    </div>
  );
}
