"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import Toggle from "@/components/toggle";
import { Session } from "next-auth";

const STORAGE_KEY = "admin-sidebar-collapsed";

function getInitialCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export default function AdminShell({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  const [collapsed, setCollapsed] = useState(getInitialCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Persist on change
  const handleToggle = (val: boolean) => {
    setCollapsed(val);
    localStorage.setItem(STORAGE_KEY, String(val));
  };

  // Close mobile sidebar when a nav link is clicked
  const handleMobileClose = () => setMobileOpen(false);

  // Prevent flash before localStorage is read
  if (!ready) {
    return (
      <div className="flex min-h-screen">
        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-black/10 bg-white/90 dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/90 md:block" />
        <main className="min-h-screen md:pl-64">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-black/10 bg-white/90 px-4 py-3 backdrop-blur-xl dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/90 md:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-cloud/70 transition hover:bg-black/5 hover:text-cloud dark:hover:bg-white/5"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
            <span className="font-display text-xs font-medium text-white">
              Ē
            </span>
          </div>
          <span className="font-display text-[16px] font-medium text-cloud">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Toggle />
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
            {session?.user?.name?.[0]?.toUpperCase() || "A"}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <AdminSidebar
        collapsed={collapsed}
        onToggle={handleToggle}
        mobileOpen={mobileOpen}
        onMobileClose={handleMobileClose}
      />

      <main
        className={`relative flex-1 overflow-x-hidden transition-all duration-300 ${
          collapsed ? "md:pl-18" : "md:pl-64"
        } pt-14 md:pt-0`}
      >
        {children}
      </main>
    </div>
  );
}
