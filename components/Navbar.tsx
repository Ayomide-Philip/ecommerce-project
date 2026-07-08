import { Heart, Search, ShoppingBag, User } from "lucide-react";
import Toggle from "@/components/toggle";

const iconButtonClass =
  "glass inline-flex h-10 w-10 items-center justify-center rounded-full text-cloud/80 transition hover:bg-black/8 dark:text-cloud/85 dark:hover:bg-[rgba(244,244,242,0.08)] focus-visible:text-accent";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-base/80 py-3 backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="glass mx-auto flex w-full max-w-7xl items-center gap-3 rounded-[20px] px-4 py-3 sm:px-6 lg:px-8"
      >
        <a
          href="#"
          className="font-display text-2xl font-medium tracking-tight text-cloud"
        >
          Adúnní
        </a>

        <div className="glass ml-2 flex min-w-0 flex-1 items-center gap-2 rounded-full px-4 py-2.5">
          <Search
            aria-hidden="true"
            className="h-4 w-4 text-cloud/60 dark:text-cloud/70"
          />
          <label htmlFor="search" className="sr-only">
            Search products
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search Ankara, streetwear, sneakers"
            className="w-full bg-transparent text-sm text-cloud placeholder:text-cloud/45 focus:outline-none dark:text-cloud dark:placeholder:text-cloud/50"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:ml-0">
          <Toggle />
          <button
            className={iconButtonClass}
            type="button"
            aria-label="Wishlist"
          >
            <Heart aria-hidden="true" className="h-4 w-4" />
          </button>
          <button className={iconButtonClass} type="button" aria-label="Cart">
            <ShoppingBag aria-hidden="true" className="h-4 w-4" />
          </button>
          <button
            className={iconButtonClass}
            type="button"
            aria-label="Profile"
          >
            <User aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </nav>
    </header>
  );
}
