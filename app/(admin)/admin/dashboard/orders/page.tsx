"use client";

import { useEffect, useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import OrdersDesktop from "@/components/admin/orders/desktop";
import OrdersMobile from "@/components/admin/orders/mobile";

// ── Types ─────────────────────────────────────────────

type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
};

type Order = {
  _id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  createdAt: string;
};

// ── Mock Data ──────────────────────────────────────────

const allOrders: Order[] = [
  {
    _id: "66f1a2b3c4d5e6f7a8b9c0d1",
    userId: "user_001",
    customerName: "Amara Okafor",
    customerEmail: "amara.o@email.com",
    items: [
      {
        productId: "p1",
        productName: "Basic Dress Fit",
        quantity: 1,
        priceAtPurchase: 248.99,
      },
      {
        productId: "p2",
        productName: "Winona Cardigan",
        quantity: 1,
        priceAtPurchase: 224.0,
      },
    ],
    totalAmount: 472.99,
    status: "delivered",
    paymentMethod: "Credit Card",
    createdAt: "2026-07-10T14:30:00Z",
  },
  {
    _id: "66f1a2b3c4d5e6f7a8b9c0d2",
    userId: "user_002",
    customerName: "Chidi Eze",
    customerEmail: "chidi.eze@email.com",
    items: [
      {
        productId: "p3",
        productName: "Kente Street Hoodie",
        quantity: 2,
        priceAtPurchase: 89.0,
      },
    ],
    totalAmount: 178.0,
    status: "processing",
    paymentMethod: "PayPal",
    createdAt: "2026-07-10T10:15:00Z",
  },
  {
    _id: "66f1a2b3c4d5e6f7a8b9c0d3",
    userId: "user_003",
    customerName: "Zara Bello",
    customerEmail: "zara.b@email.com",
    items: [
      {
        productId: "p4",
        productName: "Dashiki Midi Dress",
        quantity: 1,
        priceAtPurchase: 159.0,
      },
      {
        productId: "p5",
        productName: "Leather Crossbody Bag",
        quantity: 1,
        priceAtPurchase: 145.0,
      },
      {
        productId: "p6",
        productName: "Basic Skirt Edition",
        quantity: 1,
        priceAtPurchase: 89.99,
      },
    ],
    totalAmount: 393.99,
    status: "shipped",
    paymentMethod: "Credit Card",
    createdAt: "2026-07-09T16:45:00Z",
  },
  {
    _id: "66f1a2b3c4d5e6f7a8b9c0d4",
    userId: "user_004",
    customerName: "Kofi Mensah",
    customerEmail: "kofi.m@email.com",
    items: [
      {
        productId: "p7",
        productName: "Ankara Bomber Jacket",
        quantity: 1,
        priceAtPurchase: 210.0,
      },
    ],
    totalAmount: 210.0,
    status: "paid",
    paymentMethod: "Bank Transfer",
    createdAt: "2026-07-09T09:20:00Z",
  },
  {
    _id: "66f1a2b3c4d5e6f7a8b9c0d5",
    userId: "user_005",
    customerName: "Ngozi Adeyemi",
    customerEmail: "ngozi.a@email.com",
    items: [
      {
        productId: "p8",
        productName: "Batik Wide-Leg Pants",
        quantity: 1,
        priceAtPurchase: 74.0,
      },
      {
        productId: "p9",
        productName: "Printed Maxi Dress",
        quantity: 1,
        priceAtPurchase: 312.0,
      },
    ],
    totalAmount: 386.0,
    status: "cancelled",
    paymentMethod: "PayPal",
    createdAt: "2026-07-08T11:30:00Z",
  },
  {
    _id: "66f1a2b3c4d5e6f7a8b9c0d6",
    userId: "user_006",
    customerName: "Fatima Usman",
    customerEmail: "fatima.u@email.com",
    items: [
      {
        productId: "p10",
        productName: "Elegant Trousers Line",
        quantity: 2,
        priceAtPurchase: 231.0,
      },
      {
        productId: "p11",
        productName: "Casual Blazer Style",
        quantity: 1,
        priceAtPurchase: 179.0,
      },
    ],
    totalAmount: 641.0,
    status: "processing",
    paymentMethod: "Credit Card",
    createdAt: "2026-07-08T08:10:00Z",
  },
  {
    _id: "66f1a2b3c4d5e6f7a8b9c0d7",
    userId: "user_007",
    customerName: "Kwame Asante",
    customerEmail: "kwame.a@email.com",
    items: [
      {
        productId: "p12",
        productName: "Classic Slippers Collection",
        quantity: 3,
        priceAtPurchase: 11.0,
      },
    ],
    totalAmount: 33.0,
    status: "delivered",
    paymentMethod: "Bank Transfer",
    createdAt: "2026-07-07T15:00:00Z",
  },
  {
    _id: "66f1a2b3c4d5e6f7a8b9c0d8",
    userId: "user_008",
    customerName: "Sade Bello",
    customerEmail: "sade.b@email.com",
    items: [
      {
        productId: "p13",
        productName: "Classic Underwear Bottom Wear",
        quantity: 3,
        priceAtPurchase: 249.99,
      },
    ],
    totalAmount: 749.97,
    status: "shipped",
    paymentMethod: "Credit Card",
    createdAt: "2026-07-07T12:25:00Z",
  },
];

const ITEMS_PER_PAGE = 10;

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  if (current <= 3) pages.push(1, 2, 3, 4, "...", total);
  else if (current >= total - 2)
    pages.push(1, "...", total - 3, total - 2, total - 1, total);
  else pages.push(1, "...", current - 1, current, current + 1, "...", total);
  return pages;
}

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        await new Promise((r) => setTimeout(r, 600));
        setOrders(allOrders);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      o._id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q) ||
      o.paymentMethod.toLowerCase().includes(q) ||
      o.totalAmount.toString().includes(q) ||
      o.items.some((item) => item.productName.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filtered.slice(
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
            aria-label="Loading orders"
          />
          <p className="text-xs text-cloud/40">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 lg:p-8">
      {/* ── Header ── */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-medium text-cloud sm:text-3xl">
            Orders
          </h1>
          <p className="mt-0.5 text-xs text-cloud/50 sm:mt-1 sm:text-sm">
            Manage customer orders — {orders.length} total
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cloud/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search orders..."
              className="w-full rounded-xl border border-black/10 bg-white/80 py-2 pl-9 pr-3 text-sm text-cloud placeholder:text-cloud/40 focus:outline-none focus:ring-2 focus:ring-accent dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/50 sm:w-56"
            />
          </div>
        </div>
      </div>

      <OrdersDesktop paginatedOrders={paginatedOrders} />

      <OrdersMobile paginatedOrders={paginatedOrders} />

      {/* ── Empty State ── */}
      {filtered.length === 0 && (
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-cloud/10">
          <ShoppingBag className="h-8 w-8 text-cloud/20" />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cloud/30">
            No orders match your search
          </p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-4 flex items-center justify-between sm:mt-6">
          <p className="text-xs text-cloud/50">
            Showing {startIndex + 1}–
            {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of{" "}
            {orders.length} orders
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
