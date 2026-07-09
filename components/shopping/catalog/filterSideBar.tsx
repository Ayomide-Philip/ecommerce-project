"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

function FilterSection({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[rgba(244,244,242,0.06)] pb-4 last:border-0 last:pb-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-1"
      >
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-cloud/60">
          {label}
        </span>
        {open ? (
          <ChevronUp aria-hidden="true" className="h-3.5 w-3.5 text-cloud/30" />
        ) : (
          <ChevronDown
            aria-hidden="true"
            className="h-3.5 w-3.5 text-cloud/30"
          />
        )}
      </button>
      {open && <div className="mt-2 space-y-0.5">{children}</div>}
    </div>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-[rgba(244,244,242,0.05)]">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition ${
          checked ? "border-accent bg-accent" : "border-[rgba(244,244,242,0.2)]"
        }`}
      >
        {checked && (
          <svg
            aria-hidden="true"
            className="h-3 w-3 text-cloud"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="flex-1 text-sm text-cloud/70">{label}</span>
      {count !== undefined && (
        <span className="font-mono text-[10px] text-cloud/30">{count}</span>
      )}
    </label>
  );
}

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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cloud/40">
          Filters
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-accent transition hover:text-accent/80"
          >
            <RotateCcw aria-hidden="true" className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5">
          {selectedCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() =>
                toggleFilter(selectedCategories, setSelectedCategories, cat)
              }
              className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-accent transition hover:bg-accent/20"
            >
              {cat}
              <svg
                aria-hidden="true"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          ))}
          {selectedColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() =>
                toggleFilter(selectedColors, setSelectedColors, color)
              }
              className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-accent transition hover:bg-accent/20"
            >
              {color}
              <svg
                aria-hidden="true"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          ))}
          {selectedPatterns.map((pattern) => (
            <button
              key={pattern}
              type="button"
              onClick={() =>
                toggleFilter(selectedPatterns, setSelectedPatterns, pattern)
              }
              className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-accent transition hover:bg-accent/20"
            >
              {pattern}
              <svg
                aria-hidden="true"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          ))}
        </div>
      )}

      <FilterSection label="Category">
        {categories.map((cat) => (
          <FilterCheckbox
            key={cat}
            label={cat}
            checked={selectedCategories.includes(cat)}
            onChange={() =>
              toggleFilter(selectedCategories, setSelectedCategories, cat)
            }
          />
        ))}
      </FilterSection>

      <FilterSection label="Colour">
        {colors.map((color) => (
          <FilterCheckbox
            key={color}
            label={color}
            checked={selectedColors.includes(color)}
            onChange={() =>
              toggleFilter(selectedColors, setSelectedColors, color)
            }
          />
        ))}
      </FilterSection>

      <FilterSection label="Pattern">
        {patterns.map((pattern) => (
          <FilterCheckbox
            key={pattern}
            label={pattern}
            checked={selectedPatterns.includes(pattern)}
            onChange={() =>
              toggleFilter(selectedPatterns, setSelectedPatterns, pattern)
            }
          />
        ))}
      </FilterSection>
    </div>
  );
}
