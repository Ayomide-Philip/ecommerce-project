"use client";

import { useState } from "react";
import { Loader } from "lucide-react";
import Link from "next/link";
import ProductFormBasicInfo from "./basicInfo";
import ProductFormClassification from "./classification";
import ProductImageUpload from "./imageupload";
import { toast } from "sonner";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const request = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const response = await request.json();
      if (!request?.ok || response?.error) {
        return toast.error(
          response?.error || "Unable to create product. Please try again.",
        );
      }
      toast.success(response?.message || "Product created successfully.");
      window.location.href = "/admin/dashboard/products";
    } catch (err) {
      console.log(err);
      return toast.error("Unable to create product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
