type FilterPillsProps = {
  filters: string[];
  activeFilter: string;
};

export default function FilterPills({
  filters,
  activeFilter,
}: FilterPillsProps) {
  return (
    <div
      className="flex flex-wrap gap-3"
      role="tablist"
      aria-label="Catalog filters"
    >
      {filters.map((filter) => {
        const isActive = filter === activeFilter;

        return (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={
              isActive
                ? "rounded-full bg-accent px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-cloud"
                : "glass rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-panel/80 transition hover:bg-black/8 dark:text-cloud/80 dark:hover:bg-[rgba(244,244,242,0.08)]"
            }
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
