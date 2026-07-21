"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImageUp, LoaderCircle, Search, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Loading from "@/components/loading";
import { toast } from "sonner";

type ProductExtend = {
  _id: string;
  prod_name: string;
  product_type_name: string;
  price: number;
  detail_desc?: string;
  article_id?: string;
};

export default function RecommendationPage() {
  const [products, setProducts] = useState<ProductExtend[]>([]);
  const [loading, setLoading] = useState(true);

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSimilar, setIsSimilar] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch("/api/recommendations?topN=20", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "default",
        });
        const data = await res.json();
        if (!res.ok || data?.error) {
          return toast.error(data?.error || "Failed to load recommendations.");
        }
        setProducts(data?.recommendations || []);
      } catch {
        toast.error("Failed to load recommendations.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  function handleFileSelect(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      return toast.error("Please select an image file.");
    }
    setUploadedImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFileSelect(e.target.files?.[0] ?? null);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files?.[0] ?? null);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    clearImage();
  }

  function clearImage() {
    setUploadedImage(null);
    setImagePreview(null);
  }

  async function handleSearchSimilar() {
    if (!uploadedImage) return;
    try {
      setIsSearching(true);
      const formData = new FormData();
      formData.append("image", uploadedImage);
      const res = await fetch("/api/recommendations/classify", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || data?.error) {
        return toast.error(
          data?.error || "Failed to search for similar products.",
        );
      }
      setProducts(data?.similarProducts || []);
      setIsSimilar(true);
      setModalOpen(false);
    } catch (err) {
      console.log(err);
      return toast.error("Failed to search for similar products.");
    } finally {
      setIsSearching(false);
      setModalOpen(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-16 px-3 py-8 sm:px-4 md:px-6 lg:px-8 mt-15 sm:mt-16 lg:mt-18">
      <section aria-labelledby="recommendation-heading" className="space-y-8">
        <div>
          <div className="flex items-center gap-3">
            <h2
              id="recommendation-heading"
              className="font-display text-2xl font-medium text-cloud sm:text-3xl"
            >
              {isSimilar ? "Similar Products" : "Recommended for You"}
            </h2>
          </div>
          <p className="mt-2 text-sm text-cloud/55">
            A curated selection we think you&rsquo;ll love — {products.length}{" "}
            picks ready for you.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={openModal}
              className="flex  w-full cursor-pointer  items-center gap-3 rounded-xl border border-black/10 bg-white/80 px-4 py-3 text-left text-sm text-cloud/40 backdrop-blur-sm transition hover:border-accent/30 hover:text-cloud/60 dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/50"
            >
              <ImageUp className="h-5 w-5 shrink-0 text-accent" />
              <span>Search by uploading an image...</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {modalOpen && (
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                <div
                  className="absolute inset-0 cursor-pointer bg-black/40 backdrop-blur-sm"
                  onClick={closeModal}
                />

                <div className="relative w-full max-w-lg rounded-t-2xl sm:rounded-2xl border border-black/10 bg-white/90 p-5 sm:p-6 backdrop-blur-xl dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/90 max-sm:pb-8">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="font-display text-lg font-medium text-cloud">
                      Upload Image
                    </h3>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-cloud/40 transition hover:bg-black/5 hover:text-cloud dark:hover:bg-white/5"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {!imagePreview ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      className="group flex w-full cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-cloud/20 py-8 sm:py-10 transition hover:border-accent/50 hover:bg-accent/5"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 transition group-hover:bg-accent/20">
                        <ImageUp className="h-5 w-5 text-accent" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-cloud">
                          Click to upload or drag and drop
                        </p>
                        <p className="mt-0.5 text-xs text-cloud/40">
                          PNG, JPG or WebP — up to 10MB
                        </p>
                      </div>
                    </button>
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-black/10 dark:border-[rgba(244,244,242,0.08)]">
                      <div className="relative">
                        <Image
                          src={imagePreview}
                          alt="Uploaded preview"
                          width={800}
                          height={400}
                          className="max-h-48 sm:max-h-64 w-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute top-2 right-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-black/5 px-4 py-3 dark:border-[rgba(244,244,242,0.05)]">
                        <span className="truncate text-sm text-cloud/70">
                          {uploadedImage?.name}
                        </span>
                        <button
                          type="button"
                          onClick={handleSearchSimilar}
                          disabled={isSearching}
                          className="flex w-full sm:w-auto items-center justify-center cursor-pointer gap-2 rounded-lg bg-accent px-4 py-2.5 sm:py-2 text-sm font-medium text-white transition hover:bg-accent/90 disabled:opacity-60"
                        >
                          {isSearching ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <Search className="h-4 w-4" />
                          )}
                          {isSearching ? "Searching..." : "Find Similar"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product?._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-60 items-center justify-center rounded-2xl border border-dashed border-cloud/10">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cloud/30">
              {isSimilar
                ? "No similar products found."
                : "No recommendations available."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
