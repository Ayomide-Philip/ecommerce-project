"use client";
import {
  Search,
  ShoppingCart,
  ChevronDown,
  LogIn,
  Menu,
  X,
} from "lucide-react";
import Toggle from "@/components/toggle";
import Link from "next/link";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const iconButtonClass =
  "glass inline-flex h-9 w-9 items-center justify-center rounded-full text-cloud/80 transition hover:bg-black/8 dark:text-cloud/85 dark:hover:bg-[rgba(244,244,242,0.08)] focus-visible:text-accent";

const badgeClass =
  "absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 font-mono text-[9px] font-medium leading-none text-white";

const navLinks = [
  { href: "/catalog", label: "Catalog" },
  { href: "/category", label: "Categories" },
  { href: "/recommendation", label: "Recommendations" },
];

export default function Navbar({ session }: { session: Session }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [totalCartItems, setTotalCartItems] = useState(0);

  useEffect(() => {
    async function fetchCartItems() {
      try {
        const request = await fetch("/api/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const response = await request.json();
        if (!request.ok || response?.error) {
          return toast.error("Failed to fetch cart items. Please try again.");
        }
        setTotalCartItems(response?.cart?.length || 0);
      } catch (err) {
        console.log(err);
        return toast.error("Failed to fetch cart items. Please try again.");
      }
    }
    fetchCartItems();
  }, []);

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

          <div className="hidden items-center gap-1 sm:flex">
            {navLinks.map((link) => {
              if (
                (!session || !session?.user) &&
                link?.label === "Recommendations"
              )
                return null;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-cloud/60 transition hover:bg-[rgba(244,244,242,0.08)] hover:text-cloud"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

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

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              className={iconButtonClass + " sm:hidden"}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X aria-hidden="true" className="h-4 w-4" />
              ) : (
                <Menu aria-hidden="true" className="h-4 w-4" />
              )}
            </button>

            <Link className="relative" href="/cart" aria-label="Cart (20)">
              <span className={iconButtonClass}>
                <ShoppingCart aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className={badgeClass}>{totalCartItems}</span>
            </Link>

            <Toggle />

            {session && session?.user ? (
              <button
                className="flex items-center gap-2 rounded-full p-1 pr-3 transition hover:bg-black/5 dark:hover:bg-[rgba(244,244,242,0.06)]"
                type="button"
                aria-label="Account"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-mono text-xs font-medium text-cloud">
                  {session?.user?.name?.charAt(0)?.toUpperCase() ||
                    session?.user?.email?.charAt(0)?.toUpperCase()}
                </span>
                <span className="hidden text-left leading-tight lg:block">
                  <span className="block font-mono text-[10px] text-cloud/50">
                    Welcome Back!
                  </span>
                  <span className="block text-sm font-medium text-cloud capitalize">
                    {session?.user?.name || session?.user?.email}
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
                className="inline-flex items-center gap-2 rounded-full bg-accent p-2 font-mono text-xs uppercase tracking-[0.14em] text-cloud transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent sm:px-4 sm:py-2"
              >
                <LogIn aria-hidden="true" className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </nav>

        {mobileOpen && (
          <div className="mt-2 rounded-2xl border border-black/10 bg-white/95 p-3 shadow-lg backdrop-blur-md dark:border-[rgba(244,244,242,0.08)] dark:bg-base/95 sm:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link, idx) => {
                if (
                  (!session || !session?.user) &&
                  link?.label === "Recommendations"
                )
                  return null;
                return (
                  <Link
                    key={idx}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-cloud/70 transition hover:bg-[rgba(244,244,242,0.08)] hover:text-cloud"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
