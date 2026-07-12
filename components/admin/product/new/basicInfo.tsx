import { FormData, FormErrors } from "./form";

export default function ProductFormBasicInfo({
  errors,
  form,
  updateField,
}: {
  errors: FormErrors;
  form: FormData;
  updateField: (field: keyof FormData, value: string) => void;
}) {
  return (
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
            <p className="mt-1 text-[11px] text-red-500">{errors.prod_name}</p>
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
              errors?.detail_desc
                ? "border-red-500 dark:border-red-400"
                : "border-black/10 dark:border-[rgba(244,244,242,0.08)]"
            }`}
          />
          {errors?.detail_desc && (
            <p className="mt-1 text-[11px] text-red-500">
              {errors?.detail_desc}
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
              value={form?.price}
              onChange={(e) => updateField("price", e.target.value)}
              placeholder="0.00"
              className={`w-full rounded-xl border bg-white/80 px-4 py-2.5 text-sm text-cloud placeholder:text-cloud/40 transition focus:outline-none focus:ring-2 focus:ring-accent dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/50 ${
                errors?.price
                  ? "border-red-500 dark:border-red-400"
                  : "border-black/10 dark:border-[rgba(244,244,242,0.08)]"
              }`}
            />
            {errors?.price && (
              <p className="mt-1 text-[11px] text-red-500">{errors?.price}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
