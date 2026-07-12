import { FormData, FormErrors } from "./form";
import {
  ProductTypeName,
  GraphicalAppearanceName,
  ColourGroupName,
  PerceivedColourValueName,
  PerceivedColourMasterName,
  DepartmentName,
  IndexName,
} from "@/libs/enums/product.enums";

export default function ProductFormClassification({
  form,
  updateField,
  errors,
}: {
  errors: FormErrors;
  form: FormData;
  updateField: (field: keyof FormData, value: string) => void;
}) {
  return (
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
  );
}

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
