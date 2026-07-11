"use client";

import { useEffect, useState } from "react";
import { Search, UsersIcon, Shield, Mail, Ban } from "lucide-react";
import { toast } from "sonner";
import UsersDesktop from "@/components/admin/users/desktop";
import UsersMobile from "@/components/admin/users/mobile";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  emailVerified: boolean;
  createdAt: string;
};

const ITEMS_PER_PAGE = 6;

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  if (current <= 3) pages.push(1, 2, 3, 4, "...", total);
  else if (current >= total - 2)
    pages.push(1, "...", total - 3, total - 2, total - 1, total);
  else pages.push(1, "...", current - 1, current, current + 1, "...", total);
  return pages;
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const request = await fetch("/api/admin/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
          credentials: "include",
        });
        const response = await request.json();
        if (!request.ok || response?.error) {
          return toast.error(
            response?.error || "Failed to load users. Please try again later.",
          );
        }
        setUsers(response?.users || []);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load users.");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.includes(q) ||
      u.email.includes(q) ||
      u.role.includes(q) ||
      u._id.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filtered.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-cloud/10 border-t-accent"
            role="status"
            aria-label="Loading users"
          />
          <p className="text-xs text-cloud/40">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-medium text-cloud sm:text-3xl">
            Users
          </h1>
          <p className="mt-0.5 text-xs text-cloud/50 sm:mt-1 sm:text-sm">
            Manage registered users — {users.length} total
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cloud/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-xl border border-black/10 bg-white/80 py-2 pl-9 pr-3 text-sm text-cloud placeholder:text-cloud/40 focus:outline-none focus:ring-2 focus:ring-accent dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/50 sm:w-56"
            />
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <div className="rounded-xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
              <UsersIcon className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-lg font-semibold text-cloud">{users.length}</p>
              <p className="text-xs text-cloud/50">Total Users</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <Shield className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-lg font-semibold text-cloud">
                {users.filter((u) => u.role === "admin").length}
              </p>
              <p className="text-xs text-cloud/50">Admins</p>
            </div>
          </div>
        </div>
        <div className="col-span-2 rounded-xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm sm:col-span-1 dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
              <Mail className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="text-lg font-semibold text-cloud">
                {users.filter((u) => !u.emailVerified).length}
              </p>
              <p className="text-xs text-cloud/50">Unverified</p>
            </div>
          </div>
        </div>
      </div>

      <UsersDesktop paginatedUsers={paginatedUsers} />

      <UsersMobile paginatedUsers={paginatedUsers} />

      {filtered.length === 0 && (
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-cloud/10">
          <Ban className="h-8 w-8 text-cloud/20" />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cloud/30">
            No users match your search
          </p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-4 flex items-center justify-between sm:mt-6">
          <p className="text-xs text-cloud/50">
            Showing {startIndex + 1}–
            {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of{" "}
            {users.length} users
          </p>
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-medium text-cloud/50 transition hover:bg-black/5 hover:text-cloud disabled:opacity-30 disabled:cursor-not-allowed dark:hover:bg-white/5"
            >
              ‹
            </button>

            {getPageNumbers(currentPage, totalPages).map((page, i) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center text-xs text-cloud/30"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page as number)}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-medium transition ${
                    page === currentPage
                      ? "bg-accent/10 text-accent"
                      : "text-cloud/50 hover:bg-black/5 hover:text-cloud dark:hover:bg-white/5"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-medium text-cloud/50 transition hover:bg-black/5 hover:text-cloud disabled:opacity-30 disabled:cursor-not-allowed dark:hover:bg-white/5"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
