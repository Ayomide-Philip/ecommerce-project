import { Heart, Search, ShoppingCart, ChevronDown, LogIn } from "lucide-react";
import Toggle from "@/components/toggle";
import Link from "next/link";

const isUserLoggedIn = false;

const iconButtonClass =
  "glass inline-flex h-9 w-9 items-center justify-center rounded-full text-cloud/80 transition hover:bg-black/8 dark:text-cloud/85 dark:hover:bg-[rgba(244,244,242,0.08)] focus-visible:text-accent";

const badgeClass =
  "absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 font-mono text-[9px] font-medium leading-none text-white";

export default function Navbar() {
  return (
    <header className="fixed inset-x-3 top-3 z-50 sm:inset-x-4 sm:top-4 lg:inset-x-8 lg:top-2">
      <div className="mx-auto w-full max-w-7xl">
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-2 rounded-[18px] border border-black/10 bg-white/85 px-3 py-2.5 shadow-sm backdrop-blur-md dark:border-[rgba(244,244,242,0.08)] dark:bg-base/80 sm:gap-3 sm:px-4 sm:py-3 lg:px-6"
        >
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-lg font-medium tracking-tight text-cloud sm:text-2xl">
              Ēlan
            </span>
          </Link>

          <div className="glass mx-auto hidden min-w-0 flex-1 items-center gap-2 rounded-full border border-black/8 px-4 py-2 sm:flex lg:max-w-lg dark:border-[rgba(244,244,242,0.08)]">
            <Search
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-cloud/50"
            />
            <label htmlFor="nav-search" className="sr-only">
              Search products
            </label>
            <input
              id="nav-search"
              type="text"
              placeholder="What are you looking for?"
              className="w-full bg-transparent text-sm text-cloud placeholder:text-cloud/40 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              className="relative"
              type="button"
              aria-label="Wishlist (3)"
            >
              <span className={iconButtonClass}>
                <Heart aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className={badgeClass}>3</span>
            </button>

            <button className="relative" type="button" aria-label="Cart (20)">
              <span className={iconButtonClass}>
                <ShoppingCart aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className={badgeClass}>20</span>
            </button>

            <Toggle />

            {isUserLoggedIn ? (
              <button
                className="flex items-center gap-2 rounded-full p-1 pr-3 transition hover:bg-black/5 dark:hover:bg-[rgba(244,244,242,0.06)]"
                type="button"
                aria-label="Account"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-mono text-xs font-medium text-cloud">
                  AR
                </span>
                <span className="hidden text-left leading-tight lg:block">
                  <span className="block font-mono text-[10px] text-cloud/50">
                    Welcome Back!
                  </span>
                  <span className="block text-sm font-medium text-cloud">
                    Abdel Rahman
                  </span>
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className="hidden h-3.5 w-3.5 text-cloud/50 lg:block"
                />
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-cloud transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent"
              >
                <LogIn aria-hidden="true" className="h-3.5 w-3.5" />
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
