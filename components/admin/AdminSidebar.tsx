"use client";

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  // Settings,
  LogOut,
  ChevronLeft,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/products", label: "Products", icon: Package },
  { href: "/admin/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/dashboard/users", label: "Users", icon: Users },
  // { href: "/admin/dashboard/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: {
  collapsed: boolean;
  onToggle: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const pathname = usePathname();

  const handleNavClick = () => {
    onMobileClose?.();
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-black/10 bg-white/90 backdrop-blur-xl transition-all duration-300 dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/90 md:flex ${
          collapsed ? "w-18" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-black/10 px-5 dark:border-[rgba(244,244,242,0.08)]">
          <Link
            href="/admin/dashboard"
            onClick={handleNavClick}
            className={`flex items-center gap-2.5 ${collapsed && "justify-center w-full"}`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <span className="font-display text-sm font-medium text-white">
                Ē
              </span>
            </div>
            {!collapsed && (
              <span className="font-display text-lg font-medium text-cloud">
                Ēlan
              </span>
            )}
          </Link>
          {!collapsed && (
            <button
              type="button"
              onClick={() => onToggle(true)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-cloud/50 transition hover:bg-black/5 hover:text-cloud dark:hover:bg-white/5"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  collapsed && "justify-center"
                } ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-cloud/60 hover:bg-black/5 hover:text-cloud dark:hover:bg-white/5"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${isActive ? "text-accent" : ""}`}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Expand button (visible when collapsed) */}
        {collapsed && (
          <div className="border-t border-black/10 px-3 py-3 dark:border-[rgba(244,244,242,0.08)]">
            <button
              type="button"
              onClick={() => onToggle(false)}
              className="flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-cloud/50 transition hover:bg-black/5 hover:text-cloud dark:hover:bg-white/5"
              title="Expand sidebar"
            >
              <ChevronLeft className="h-5 w-5 rotate-180" />
            </button>
          </div>
        )}

        {/* Logout */}
        <div className="border-t border-black/10 p-3 dark:border-[rgba(244,244,242,0.08)]">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-500/10 ${
              collapsed && "justify-center"
            }`}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-black/10 bg-white/90 backdrop-blur-xl transition-transform duration-300 dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/90 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        <div className="flex h-16 items-center justify-between border-b border-black/10 px-5 dark:border-[rgba(244,244,242,0.08)]">
          <Link
            href="/admin/dashboard"
            onClick={handleNavClick}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <span className="font-display text-sm font-medium text-white">
                Ē
              </span>
            </div>
            <span className="font-display text-lg font-medium text-cloud">
              Ēlan
            </span>
          </Link>
          <button
            type="button"
            onClick={onMobileClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-cloud/50 transition hover:bg-black/5 hover:text-cloud dark:hover:bg-white/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-cloud/60 hover:bg-black/5 hover:text-cloud dark:hover:bg-white/5"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${isActive ? "text-accent" : ""}`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-black/10 p-3 dark:border-[rgba(244,244,242,0.08)]">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-500/10"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
