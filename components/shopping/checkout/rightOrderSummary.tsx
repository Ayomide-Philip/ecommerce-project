import { Lock, ShieldCheck } from "lucide-react";
export default function RightOrderSummary({
  sampleItems,
  subtotal,
  shipping,
  total,
  handlePlaceOrder,
}: {
  sampleItems: {
    name: string;
    type: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  handlePlaceOrder: () => void;
}) {
  return (
    <div className="lg:col-span-2">
      <div className="glass rounded-[20px] p-5 sm:p-6">
        <h2 className="font-display text-lg font-medium text-cloud">
          Order Summary
        </h2>

        {/* Items */}
        <div className="mt-5 divide-y divide-black/8 dark:divide-[rgba(244,244,242,0.08)]">
          {sampleItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-medium text-cloud">
                  {item.name}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-cloud/40">
                  {item.type} × {item.quantity}
                </p>
              </div>
              <p className="ml-4 shrink-0 font-mono text-sm text-cloud">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-5 space-y-3 border-t border-black/8 pt-4 dark:border-[rgba(244,244,242,0.08)]">
          <div className="flex justify-between text-sm">
            <span className="text-cloud/50">Subtotal</span>
            <span className="font-mono text-cloud">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-cloud/50">Shipping</span>
            <span className="font-mono text-cloud">
              {shipping === 0 ? (
                <span className="text-green-400">FREE</span>
              ) : (
                `$${shipping.toFixed(2)}`
              )}
            </span>
          </div>
          <div className="flex justify-between border-t border-black/8 pt-3 dark:border-[rgba(244,244,242,0.08)]">
            <span className="text-sm font-medium text-cloud">Total</span>
            <span className="font-mono font-medium text-cloud dark:text-cloud">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePlaceOrder}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white transition hover:bg-accent/90"
        >
          <Lock aria-hidden="true" className="h-4 w-4" />
          Place Order — ${total.toFixed(2)}
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-cloud/30">
          <ShieldCheck aria-hidden="true" className="h-3 w-3" />
          <span>Simulated payment — no real charges</span>
        </div>
      </div>
    </div>
  );
}
