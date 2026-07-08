import { Heart, Search, ShoppingBag, User, LogIn } from "lucide-react";
import Toggle from "@/components/toggle";

const isLoggedIn = false;

const iconButtonClass =
  "glass inline-flex h-10 w-10 items-center justify-center rounded-full text-cloud/80 transition hover:bg-black/8 dark:text-cloud/85 dark:hover:bg-[rgba(244,244,242,0.08)] focus-visible:text-accent";

export default function Navbar() {
  return (
    <header className="fixed inset-x-3 top-3 z-50 sm:inset-x-4 sm:top-4 lg:inset-x-8 lg:top-2">
      <nav
        aria-label="Main navigation"
        className="glass mx-auto bg-base/80 backdrop-blur-md flex w-full max-w-7xl items-center gap-2 rounded-[20px] px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 lg:px-6"
      >
        <a
          href="#"
          className="font-display text-lg font-medium tracking-tight text-cloud sm:text-2xl"
        >
          Ēlan
        </a>

        <div className="glass ml-2 hidden min-w-0 flex-1 items-center gap-2 rounded-full px-3 py-2 sm:flex sm:px-4 sm:py-2.5">
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

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
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
          {isLoggedIn ? (
            <button
              className={iconButtonClass}
              type="button"
              aria-label="Profile"
            >
              <User aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : (
            <button
              className={iconButtonClass}
              type="button"
              aria-label="Sign In"
            >
              <LogIn aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
