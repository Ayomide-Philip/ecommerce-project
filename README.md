# AI-Based Personalized Recommendation System for Fashion E-Commerce

### Project Documentation & Build Plan

---

## 1. Project Overview

A web-based fashion e-commerce platform that uses a content-based AI recommendation engine (TF-IDF + Cosine Similarity) to suggest personalized fashion products to users based on their behavior (clicks, views, purchases).

---

## 2. Tech Stack

| Layer      | Technology                                                                               |
| ---------- | ---------------------------------------------------------------------------------------- |
| Frontend   | Next.js (App Router)                                                                     |
| Backend    | Next.js Route Handlers                                                                   |
| Database   | MongoDB (Mongoose)                                                                       |
| Auth       | Auth.js (NextAuth) — role-based (user/admin)                                             |
| Language   | TypeScript (entire stack)                                                                |
| AI Engine  | TF-IDF + Cosine Similarity (hand-rolled in TypeScript, or `natural` npm package)         |
| Deployment | Persistent Node server (e.g. Render) — **not** serverless/edge, due to in-memory caching |

---

## 3. Data Models (MongoDB Collections)

### `users`

```ts
{
  _id: ObjectId,
  name: string,
  email: string,
  passwordHash: string,
  role: "user" | "admin",
  createdAt: Date
}
```

### `products`

```ts
{
  _id: ObjectId,
  name: string,
  category: string,      // e.g. shoes, jackets, dresses
  brand: string,
  colour: string,
  style: string,
  price: number,
  description: string,
  imageUrl?: string,
  inStock: boolean,
  createdAt: Date
}
```

### `interactions`

```ts
{
  _id: ObjectId,
  userId: ObjectId,
  productId: ObjectId,
  eventType: "click" | "view" | "purchase",
  timestamp: Date
}
```

### `orders` (new — dummy payment flow)

```ts
{
  _id: ObjectId,
  userId: ObjectId,
  items: [
    { productId: ObjectId, quantity: number, priceAtPurchase: number }
  ],
  totalAmount: number,
  status: "pending" | "paid" | "failed", // simulated only
  paymentMethod: "dummy-card" | "dummy-transfer",
  createdAt: Date
}
```

> **Note:** No real payment processor is integrated. The checkout page simulates a successful transaction and logs it as an `order` + a `purchase` interaction — enough to demonstrate the full recommendation feedback loop without handling real money or PCI compliance.

---

## 4. API Routes

| Route                           | Method | Access        | Purpose                                                         |
| ------------------------------- | ------ | ------------- | --------------------------------------------------------------- |
| `/api/auth/[...nextauth]`       | —      | Public        | Login/session handling via Auth.js                              |
| `/api/auth/register`            | POST   | Public        | Register a new user                                             |
| `/api/products`                 | GET    | Public        | List all products (with search/filter)                          |
| `/api/products/[id]`            | GET    | Public        | Get single product details                                      |
| `/api/products`                 | POST   | Admin only    | Create a new product                                            |
| `/api/products/[id]`            | PATCH  | Admin only    | Edit a product                                                  |
| `/api/products/[id]`            | DELETE | Admin only    | Delete a product                                                |
| `/api/track-event`              | POST   | Authenticated | Log a click/view/purchase interaction                           |
| `/api/recommendations/[userId]` | GET    | Authenticated | Return personalized (or fallback) recommendations               |
| `/api/checkout`                 | POST   | Authenticated | Simulate payment, create dummy order, log purchase interactions |
| `/api/orders/[userId]`          | GET    | Authenticated | View order history (optional, for UI polish)                    |

---

## 5. AI Recommendation Engine — Logic Breakdown

**Location:** `lib/recommendation-engine.ts`

### Step 1 — Feature Extraction

Pull structured fields from each product: `category`, `brand`, `colour`, `style`. Combine into a single text string per product (e.g. `"sneakers nike black sportswear"`).

### Step 2 — TF-IDF Vectorization

Convert each product's text string into a numeric vector representing term importance across the whole catalog.

### Step 3 — User Preference Vector

Build a "taste profile" for each user by aggregating the TF-IDF vectors of products they've clicked/viewed/purchased (weighted — purchases > clicks > views).

### Step 4 — Cosine Similarity

Compare the user's preference vector against every product vector. Score ranges 0 (unrelated) to 1 (identical).

### Step 5 — Ranking

Sort products by similarity score, return top-N as recommendations.

### Step 6 — Caching

- Compute the full product similarity matrix once and store in a module-level in-memory variable.
- Invalidate and recompute **only** when a product is added, edited, or deleted (triggered from the admin CRUD routes).
- This is why deployment must run on a persistent Node process — serverless functions won't retain the cache between invocations.

### Step 7 — Cold-Start Fallback

If a user has zero interactions:

- Query `interactions` collection, group by `productId`, count occurrences across **all** users.
- Return the top-N most popular products instead of an empty list.
- Once the user accumulates interaction history, the system automatically switches to personalized recommendations.

---

## 6. Auth.js Setup Notes

- Extend the JWT/session callback to include `role` on the session object.
- Protect `/api/products` (POST/PATCH/DELETE) and `/admin/*` pages by checking `session.user.role === "admin"` server-side.
- Regular users can only access customer-facing routes.

---

## 7. Dummy Payment Page (Checkout Flow)

Since real payment integration is out of scope, simulate it:

1. User adds items to cart (client-side state, no DB needed unless you want persistence).
2. User goes to `/checkout` page — a simple form (card number placeholder, "Pay Now" button). No real validation, no external payment gateway.
3. On submit, call `/api/checkout`:
   - Create an `orders` document with `status: "paid"` (always succeeds — it's a simulation).
   - Log a `purchase` interaction for each item in the order (feeds the recommendation engine).
   - Trigger a cache-relevant nothing (products aren't changed, just interactions — no need to invalidate the similarity cache here).
4. Redirect to a `/order-confirmation` page showing a fake receipt.

> Clearly label this in your report as a **simulated payment flow for demonstration purposes**, explicitly out of scope per your Chapter 1 scope statement.

---

## 8. Build Order (Recommended Sequence)

1. **Project setup** — Next.js + TypeScript + MongoDB connection (Mongoose) + Auth.js config
2. **Schemas** — `User`, `Product`, `Interaction`, `Order` models
3. **Auth** — registration, login, role-based session handling
4. **Admin CRUD** — product management routes + admin dashboard UI
5. **Seed data** — script to populate `products` with realistic fashion items (structured fields)
6. **Track-event route** — log interactions from frontend clicks/views
7. **Recommendation engine module** — TF-IDF + cosine similarity + caching + cold-start fallback
8. **Recommendations API route** — wire the engine into `/api/recommendations/[userId]`
9. **Frontend pages:**
   - Home / product browsing
   - Product detail page (fires `view`/`click` events)
   - "Recommended for You" section
   - Cart + dummy checkout flow
   - Order confirmation page
10. **Simulated interaction data** — generate randomized fake user interactions (for testing recommendation quality before real usage exists)
11. **Evaluation** — compute Precision@K, Recall@K, MAP against held-out simulated interactions

---

## 9. Explicit Scope Boundaries (for your report)

**In scope:**

- User registration/login with roles
- Product catalog + admin CRUD
- Behavior tracking (click/view/purchase)
- Content-based recommendation engine (TF-IDF + cosine similarity)
- Cold-start fallback via popularity ranking
- Simulated/dummy checkout flow

**Out of scope:**

- Real payment gateway integration
- Collaborative or hybrid filtering
- Real-time social media trend analysis
- Production-grade security/infrastructure
- Logistics/delivery integration

---

## 10. Evaluation Metrics (Chapter 3.7)

| Metric      | Formula                                        | Purpose                                          |
| ----------- | ---------------------------------------------- | ------------------------------------------------ |
| Precision@K | relevant items in top-K / K                    | How accurate are the top recommendations         |
| Recall@K    | relevant items in top-K / total relevant items | How comprehensive is the retrieval               |
| MAP         | mean of Average Precision across sessions      | Rewards correct ranking order, not just presence |

Testing approach: withhold a portion of each simulated user's interactions, generate recommendations, then check whether withheld items appear in the top-K results.
