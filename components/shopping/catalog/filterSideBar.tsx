export default function CatalogFilterSidebar({
  hasActiveFilters,
  clearAllFilters,
  categories,
  selectedCategories,
  setSelectedCategories,
  colors,
  selectedColors,
  setSelectedColors,
  patterns,
  selectedPatterns,
  setSelectedPatterns,
  toggleFilter,
}: {
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
  categories: string[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  colors: string[];
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  patterns: string[];
  selectedPatterns: string[];
  setSelectedPatterns: (patterns: string[]) => void;
  toggleFilter: (
    selected: string[],
    setSelected: (items: string[]) => void,
    item: string,
  ) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cloud/40">
          Filters
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent hover:text-accent/80"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cloud/60">
          Category
        </p>
        <div className="space-y-1">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-[rgba(244,244,242,0.06)]"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() =>
                  toggleFilter(selectedCategories, setSelectedCategories, cat)
                }
                className="h-4 w-4 rounded border-cloud/30 accent-accent"
              />
              <span className="text-sm text-cloud/70">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cloud/60">
          Colour
        </p>
        <div className="space-y-1">
          {colors.map((color) => (
            <label
              key={color}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-[rgba(244,244,242,0.06)]"
            >
              <input
                type="checkbox"
                checked={selectedColors.includes(color)}
                onChange={() =>
                  toggleFilter(selectedColors, setSelectedColors, color)
                }
                className="h-4 w-4 rounded border-cloud/30 accent-accent"
              />
              <span className="text-sm text-cloud/70">{color}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cloud/60">
          Pattern
        </p>
        <div className="space-y-1">
          {patterns.map((pattern) => (
            <label
              key={pattern}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-[rgba(244,244,242,0.06)]"
            >
              <input
                type="checkbox"
                checked={selectedPatterns.includes(pattern)}
                onChange={() =>
                  toggleFilter(selectedPatterns, setSelectedPatterns, pattern)
                }
                className="h-4 w-4 rounded border-cloud/30 accent-accent"
              />
              <span className="text-sm text-cloud/70">{pattern}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
