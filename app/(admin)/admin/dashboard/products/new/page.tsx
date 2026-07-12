"use client";

import { useState } from "react";
import { ArrowLeft, Upload, X, Loader } from "lucide-react";
import Link from "next/link";
import {
  ProductTypeName,
  GraphicalAppearanceName,
  ColourGroupName,
  PerceivedColourValueName,
  PerceivedColourMasterName,
  DepartmentName,
  IndexName,
} from "@/libs/enums/product.enums";

// ── Types ─────────────────────────────────────────────

type FormData = {
  prod_name: string;
  product_type_name: string;
  graphical_appearance_name: string;
  colour_group_name: string;
  perceived_colour_value_name: string;
  perceived_colour_master_name: string;
  department_name: string;
  index_name: string;
  detail_desc: string;
  price: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialForm: FormData = {
  prod_name: "",
  product_type_name: "",
  graphical_appearance_name: "",
  colour_group_name: "",
  perceived_colour_value_name: "",
  perceived_colour_master_name: "",
  department_name: "",
  index_name: "",
  detail_desc: "",
  price: "",
};

// ── Select Field Component ────────────────────────────

function SelectField({
  label,
  value,
  options,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  error?: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-cloud/70">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border bg-white/80 px-4 py-2.5 text-sm text-cloud transition focus:outline-none focus:ring-2 focus:ring-accent dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/50 ${
          error
            ? "border-red-500 dark:border-red-400"
            : "border-black/10 dark:border-[rgba(244,244,242,0.08)]"
        } ${!value ? "text-cloud/40" : ""}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

// ── Component ──────────────────────────────────────────

export default function NewProductPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Validation ──────────────────────────────────────

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.prod_name.trim())
      newErrors.prod_name = "Product name is required";

    if (!form.product_type_name)
      newErrors.product_type_name = "Product type is required";

    if (!form.graphical_appearance_name)
      newErrors.graphical_appearance_name = "Appearance is required";

    if (!form.colour_group_name)
      newErrors.colour_group_name = "Colour group is required";

    if (!form.perceived_colour_value_name)
      newErrors.perceived_colour_value_name = "Colour value is required";

    if (!form.perceived_colour_master_name)
      newErrors.perceived_colour_master_name = "Colour master is required";

    if (!form.department_name)
      newErrors.department_name = "Department is required";

    if (!form.index_name) newErrors.index_name = "Index is required";

    if (!form.detail_desc.trim())
      newErrors.detail_desc = "Description is required";
    else if (form.detail_desc.trim().length < 20)
      newErrors.detail_desc = "Description must be at least 20 characters";

    if (!form.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(form.price)) || Number(form.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Helpers ─────────────────────────────────────────

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-60 max-w-lg flex-col items-center justify-center gap-4 px-4 py-4 text-center sm:px-6 sm:py-6 lg:p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
          <svg
            className="h-7 w-7 text-emerald-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="font-display text-xl font-medium text-cloud">
          Product Created
        </h2>
        <p className="text-sm text-cloud/50">
          Your product has been added successfully.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setForm(initialForm);
              setImages([]);
              setImagePreviews([]);
              setErrors({});
            }}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
          >
            Add Another
          </button>
          <Link
            href="/admin/dashboard/products"
            className="rounded-xl border border-black/10 px-5 py-2.5 text-sm font-medium text-cloud/60 transition hover:bg-black/5 dark:border-[rgba(244,244,242,0.08)] dark:hover:bg-white/5"
          >
            View Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 sm:py-6 lg:p-8">
      {/* ── Header ── */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/dashboard/products"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 text-cloud/50 transition hover:bg-black/5 hover:text-cloud dark:border-[rgba(244,244,242,0.08)] dark:hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-medium text-cloud sm:text-2xl">
            New Product
          </h1>
          <p className="text-xs text-cloud/50 sm:text-sm">
            Add a new product to your catalog
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        {/* ── Basic Info ── */}
        <div className="rounded-2xl border border-black/10 bg-white/80 p-5 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60">
          <h2 className="mb-4 font-display text-[16px] font-medium text-cloud">
            Basic Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-cloud/70">
                Product Name
              </label>
              <input
                type="text"
                value={form.prod_name}
                onChange={(e) => updateField("prod_name", e.target.value)}
                placeholder="e.g. Classic Leather Jacket"
                className={`w-full rounded-xl border bg-white/80 px-4 py-2.5 text-sm text-cloud placeholder:text-cloud/40 transition focus:outline-none focus:ring-2 focus:ring-accent dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/50 ${
                  errors.prod_name
                    ? "border-red-500 dark:border-red-400"
                    : "border-black/10 dark:border-[rgba(244,244,242,0.08)]"
                }`}
              />
              {errors.prod_name && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.prod_name}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-cloud/70">
                Description
              </label>
              <textarea
                value={form.detail_desc}
                onChange={(e) => updateField("detail_desc", e.target.value)}
                placeholder="Describe the product in detail…"
                rows={4}
                className={`w-full resize-none rounded-xl border bg-white/80 px-4 py-2.5 text-sm text-cloud placeholder:text-cloud/40 transition focus:outline-none focus:ring-2 focus:ring-accent dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/50 ${
                  errors.detail_desc
                    ? "border-red-500 dark:border-red-400"
                    : "border-black/10 dark:border-[rgba(244,244,242,0.08)]"
                }`}
              />
              {errors.detail_desc && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.detail_desc}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-cloud/70">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="0.00"
                  className={`w-full rounded-xl border bg-white/80 px-4 py-2.5 text-sm text-cloud placeholder:text-cloud/40 transition focus:outline-none focus:ring-2 focus:ring-accent dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/50 ${
                    errors.price
                      ? "border-red-500 dark:border-red-400"
                      : "border-black/10 dark:border-[rgba(244,244,242,0.08)]"
                  }`}
                />
                {errors.price && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors.price}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Classification ── */}
        <div className="rounded-2xl border border-black/10 bg-white/80 p-5 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60">
          <h2 className="mb-4 font-display text-[16px] font-medium text-cloud">
            Classification
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Product Type"
              value={form.product_type_name}
              options={ProductTypeName}
              onChange={(v) => updateField("product_type_name", v)}
              error={errors.product_type_name}
              placeholder="Select type…"
            />

            <SelectField
              label="Graphical Appearance"
              value={form.graphical_appearance_name}
              options={GraphicalAppearanceName}
              onChange={(v) => updateField("graphical_appearance_name", v)}
              error={errors.graphical_appearance_name}
              placeholder="Select appearance…"
            />

            <SelectField
              label="Colour Group"
              value={form.colour_group_name}
              options={ColourGroupName}
              onChange={(v) => updateField("colour_group_name", v)}
              error={errors.colour_group_name}
              placeholder="Select colour…"
            />

            <SelectField
              label="Colour Value"
              value={form.perceived_colour_value_name}
              options={PerceivedColourValueName}
              onChange={(v) => updateField("perceived_colour_value_name", v)}
              error={errors.perceived_colour_value_name}
              placeholder="Select value…"
            />

            <SelectField
              label="Colour Master"
              value={form.perceived_colour_master_name}
              options={PerceivedColourMasterName}
              onChange={(v) => updateField("perceived_colour_master_name", v)}
              error={errors.perceived_colour_master_name}
              placeholder="Select master…"
            />

            <SelectField
              label="Department"
              value={form.department_name}
              options={DepartmentName}
              onChange={(v) => updateField("department_name", v)}
              error={errors.department_name}
              placeholder="Select department…"
            />

            <SelectField
              label="Index"
              value={form.index_name}
              options={IndexName}
              onChange={(v) => updateField("index_name", v)}
              error={errors.index_name}
              placeholder="Select index…"
            />
          </div>
        </div>

        {/* ── Image Upload ── */}
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

        {/* ── Submit ── */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting && <Loader className="h-4 w-4 animate-spin" />}
            {submitting ? "Creating…" : "Create Product"}
          </button>
          <Link
            href="/admin/dashboard/products"
            className="rounded-xl border border-black/10 px-5 py-2.5 text-sm font-medium text-cloud/60 transition hover:bg-black/5 dark:border-[rgba(244,244,242,0.08)] dark:hover:bg-white/5"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
