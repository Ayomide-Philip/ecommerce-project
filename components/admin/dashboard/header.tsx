import Toggle from "@/components/toggle";

export default function AdminDashboardHeader() {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-xl font-medium text-cloud sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-0.5 text-xs text-cloud/50 sm:mt-1 sm:text-sm">
          Welcome back, Admin. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:block">
          <Toggle />
        </div>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent sm:h-9 sm:w-9 sm:text-sm">
          A
        </div>
      </div>
    </div>
  );
}
