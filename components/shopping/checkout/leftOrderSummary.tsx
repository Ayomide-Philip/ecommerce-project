import { Truck, CreditCard } from "lucide-react";

type FieldKey =
  | "fullName"
  | "address"
  | "city"
  | "zip"
  | "cardNumber"
  | "expiry"
  | "cvv";

export default function LeftOrderSummary({
  fields,
  errors,
  updateField,
}: {
  fields: Record<FieldKey, string>;
  errors: Partial<Record<FieldKey, string>>;
  updateField: (key: FieldKey, value: string) => void;
}) {
  return (
    <div className="space-y-6 lg:col-span-3">
      <div className="glass rounded-[20px] p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Truck aria-hidden="true" className="h-4 w-4 text-accent" />
          <h2 className="font-display text-lg font-medium text-cloud">
            Shipping Address
          </h2>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(
            [
              { key: "fullName" as const, label: "Full Name", colSpan: true },
              { key: "address" as const, label: "Address", colSpan: true },
              { key: "city" as const, label: "City", colSpan: false },
              { key: "zip" as const, label: "ZIP Code", colSpan: false },
            ] as const
          ).map(({ key, label, colSpan }) => (
            <div key={key} className={colSpan ? "sm:col-span-2" : undefined}>
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-cloud/40">
                  {label}
                </label>
                <input
                  type="text"
                  value={fields[key]}
                  onChange={(e) => updateField(key, e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 font-mono text-sm text-cloud placeholder:text-cloud/30 transition focus:outline-none focus:ring-2 bg-panel ${
                    errors[key]
                      ? "border-red-400/60 focus:ring-red-400/60"
                      : "border-black/12 focus:ring-accent/60 dark:border-[rgba(244,244,242,0.12)]"
                  }`}
                />
                {errors[key] && (
                  <p className="font-mono text-[10px] text-red-400">
                    {errors[key]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-[20px] p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <CreditCard aria-hidden="true" className="h-4 w-4 text-accent" />
          <h2 className="font-display text-lg font-medium text-cloud">
            Payment Details
          </h2>
        </div>

        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-cloud/40">
              Card Number
            </label>
            <input
              type="text"
              placeholder="4242 4242 4242 4242"
              value={fields.cardNumber}
              onChange={(e) => updateField("cardNumber", e.target.value)}
              maxLength={19}
              className={`w-full rounded-xl border px-4 py-3 font-mono text-sm text-cloud placeholder:text-cloud/30 transition focus:outline-none focus:ring-2 bg-panel ${
                errors.cardNumber
                  ? "border-red-400/60 focus:ring-red-400/60"
                  : "border-black/12 focus:ring-accent/60 dark:border-[rgba(244,244,242,0.12)]"
              }`}
            />
            {errors.cardNumber && (
              <p className="font-mono text-[10px] text-red-400">
                {errors.cardNumber}
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-cloud/40">
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                value={fields.expiry}
                onChange={(e) => updateField("expiry", e.target.value)}
                maxLength={5}
                className={`w-full rounded-xl border px-4 py-3 font-mono text-sm text-cloud placeholder:text-cloud/30 transition focus:outline-none focus:ring-2 bg-panel ${
                  errors.expiry
                    ? "border-red-400/60 focus:ring-red-400/60"
                    : "border-black/12 focus:ring-accent/60 dark:border-[rgba(244,244,242,0.12)]"
                }`}
              />
              {errors.expiry && (
                <p className="font-mono text-[10px] text-red-400">
                  {errors.expiry}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-cloud/40">
                CVV
              </label>
              <input
                type="text"
                placeholder="123"
                value={fields.cvv}
                onChange={(e) => updateField("cvv", e.target.value)}
                maxLength={3}
                className={`w-full rounded-xl border px-4 py-3 font-mono text-sm text-cloud placeholder:text-cloud/30 transition focus:outline-none focus:ring-2 bg-panel ${
                  errors.cvv
                    ? "border-red-400/60 focus:ring-red-400/60"
                    : "border-black/12 focus:ring-accent/60 dark:border-[rgba(244,244,242,0.12)]"
                }`}
              />
              {errors.cvv && (
                <p className="font-mono text-[10px] text-red-400">
                  {errors.cvv}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
