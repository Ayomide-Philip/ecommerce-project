"use client";

import { useState } from "react";
import { Loader } from "lucide-react";
import Link from "next/link";
import ProductFormBasicInfo from "./basicInfo";
import ProductFormClassification from "./classification";
import ProductImageUpload from "./imageupload";

export type FormData = {
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
  article_id?: string;
};

export type FormErrors = Partial<Record<keyof FormData, string>>;

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
  article_id: "",
};

export default function ProductForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

    if (!form.article_id || !form.article_id.trim()) {
      newErrors.article_id = "Product image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
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
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      <ProductFormBasicInfo
        form={form}
        errors={errors}
        updateField={updateField}
      />

      <ProductFormClassification
        errors={errors}
        form={form}
        updateField={updateField}
      />

      <ProductImageUpload updateField={updateField} />

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
  );
}
