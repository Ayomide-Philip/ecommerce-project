import { Package, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
      {[
        {
          label: "Add New Product",
          desc: "List a new item in your catalog",
          icon: Package,
          href: "/admin/products/new",
        },
        {
          label: "View All Orders",
          desc: "Check pending and completed orders",
          icon: ShoppingBag,
          href: "/admin/dashboard/orders",
        },
      ].map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.label}
            href={action.href}
            className="group flex items-center gap-4 rounded-2xl border border-black/10 bg-white/80 p-4 text-left backdrop-blur-sm transition hover:border-accent/30 hover:shadow-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60 dark:hover:border-accent/30"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 transition group-hover:bg-accent/20">
              <Icon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-cloud">{action.label}</p>
              <p className="text-xs text-cloud/50">{action.desc}</p>
            </div>
            <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-cloud/30 transition group-hover:text-accent" />
          </Link>
        );
      })}
    </div>
  );
}
