import { TrendingUp, TrendingDown } from "lucide-react";

export default function DashboardStats({
  stats,
}: {
  stats: {
    label: string;
    value: string;
    change: string;
    up: boolean;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
  }[];
}) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-black/10 bg-white/80 p-5 backdrop-blur-sm transition hover:shadow-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-xl ${stat.bg} p-2.5`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  stat.up ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {stat.up ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {stat.change}
              </span>
            </div>
            <p className="mt-3 text-xl font-semibold text-cloud sm:mt-4 sm:text-2xl">
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs text-cloud/50 sm:mt-1 sm:text-sm">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
