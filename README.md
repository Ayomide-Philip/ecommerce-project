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
  name: string,                          // lowercase
  email: string,                         // lowercase, unique
  password: string,                      // select: false
  role: "user" | "admin",               // default: "user"
  emailVerified: boolean,                // default: false
  createdAt: Date,
  updatedAt: Date
}
```

### `products`

```ts
{
  _id: ObjectId,
  prod_name: string,                     // lowercase
  product_type_name: string,             // lowercase, enum — e.g. "t-shirt", "dress"
  graphical_appearance_name: string,     // lowercase, enum — e.g. "solid", "stripe"
  colour_group_name: string,             // lowercase, enum
  perceived_colour_value_name: string,   // lowercase, enum
  perceived_colour_master_name: string,  // lowercase, enum
  department_name: string,               // lowercase, enum
  index_name: string,                    // lowercase, enum — "ladieswear" | "menswear"
  detail_desc: string,                   // lowercase
  price: number,
  createdAt: Date,
  updatedAt: Date
}
```

### `interactions`

```ts
{
  _id: ObjectId,
  userId: ObjectId,       // ref: "User"
  productId: ObjectId,    // ref: "Products"
  eventType: "click" | "view" | "purchase",
  createdAt: Date,
  updatedAt: Date
}
// Index: { userId: 1, createdAt: -1 }
```

### `carts`

```ts
{
  _id: ObjectId,
  userId: ObjectId,       // ref: "User"
  productId: ObjectId,    // ref: "Products"
  quantity: number,       // min: 1, default: 1
  createdAt: Date,
  updatedAt: Date
}
// Unique index: { userId: 1, productId: 1 }
// Index: { userId: 1, createdAt: -1 }
```

---

## 4. API Routes

| Route                     | Method | Access        | Purpose                                           |
| ------------------------- | ------ | ------------- | ------------------------------------------------- |
| `/api/auth/[...nextauth]` | —      | Public        | Login/session handling via Auth.js                |
| `/api/auth/register`      | POST   | Public        | Register a new user                               |
| `/api/products`           | GET    | Public        | List all products (with optional `?limit=`)       |
| `/api/products/[id]`      | GET    | Public        | Get single product details                        |
| `/api/products`           | POST   | Admin only    | Create a new product                              |
| `/api/categories/[slug]`  | GET    | Public        | Get products by category slug                     |
| `/api/cart`               | GET    | Authenticated | Fetch user's cart (populated with product data)   |
| `/api/cart`               | POST   | Authenticated | Add item to cart                                  |
| `/api/cart`               | PUT    | Authenticated | Update cart item quantity                         |
| `/api/cart`               | DELETE | Authenticated | Remove item from cart                             |
| `/api/recommendations`    | GET    | Authenticated | Return personalized (or fallback) recommendations |
| `/api/recommended`        | GET    | Public        | Random product sample (for testing)               |

---

## 5. AI Recommendation Engine — Logic Breakdown

**Location:** `libs/recommendation/`

| File                     | Purpose                                                                          |
| ------------------------ | -------------------------------------------------------------------------------- |
| `productToText.ts`       | Feature extraction — concatenates 7 descriptive fields into a text fingerprint   |
| `tfidf.ts`               | TF-IDF vectorization (tokenize, vocabulary, TF, IDF, vectorizeAgainstVocabulary) |
| `cosine-similarity.ts`   | Cosine similarity with zero-vector edge case handling                            |
| `user-to-text.ts`        | Builds a weighted preference text from a user's interaction history              |
| `popularity-fallback.ts` | Cold-start fallback via MongoDB aggregation                                      |
| `engine.ts`              | Orchestrator with in-memory cache + `invalidateCache()`                          |

### Step 1 — Feature Extraction (`productToText.ts`)

Pull structured fields from each product: `product_type_name`, `graphical_appearance_name`, `colour_group_name`, `perceived_colour_master_name`, `department_name`, `index_name`, and `detail_desc`. Combine into a single lowercase space-separated string per product.

### Step 2 — TF-IDF Vectorization (`tfidf.ts`)

Convert each product's text string into a numeric vector. TF = term frequency within a document; IDF = `ln((N+1)/(df+1)) + 1` with +1 smoothing. Produces a shared vocabulary and one vector per product. A `vectorizeAgainstVocabulary()` helper also exists to align a user's text against the pre-computed vocabulary without rebuilding it.

### Step 3 — User Preference Vector (`user-to-text.ts`)

Fetch the user's interactions and weight them: purchases = 3×, clicks = 2×, views = 1×. Repeat the product's text `weight` times so frequently interacted products naturally carry more TF-IDF weight. Returns `null` for cold-start users.

### Step 4 — Cosine Similarity (`cosine-similarity.ts`)

Compare the user's preference vector against every cached product vector. Score ranges 0 (unrelated) to 1 (identical). Returns 0 for zero-vectors (avoids NaN).

### Step 5 — Ranking (`engine.ts`)

Sort products by similarity score descending, return top-N.

### Step 6 — Caching

- Compute TF-IDF vectors for all products once and store in a module-level in-memory cache (`{ vocabulary, idfValues, productVectors, products }`).
- Call `invalidateCache()` when a product is added, edited, or deleted so the cache rebuilds on the next request.
- Deployment must run on a persistent Node process — serverless functions won't retain the cache between invocations.

### Step 7 — Cold-Start Fallback (`popularity-fallback.ts`)

If a user has zero interactions:

- Query `interactions` collection via aggregation, group by `productId`, count occurrences across **all** users, sort descending, limit to top N.
- `$lookup` against Products collection to return full product docs.
- If the Interactions collection is also empty (brand-new app), a random subset of products is returned instead (marked as removable in code).

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

## 8. Build Status

| Phase                                                                                         | Status       |
| --------------------------------------------------------------------------------------------- | ------------ |
| **Project setup** — Next.js + TypeScript + MongoDB (Mongoose) + Auth.js                       | ✅ Done      |
| **Schemas** — `User`, `Product`, `Interaction`, `Cart`                                        | ✅ Done      |
| **Auth** — registration, login                                                                | ✅ Done      |
| **Product catalog** — listing, filtering, search, detail page                                 | ✅ Done      |
| **Cart** — full CRUD API + frontend with optimistic updates                                   | ✅ Done      |
| **Recommendation engine** — TF-IDF + cosine similarity + caching + cold-start fallback        | ✅ Done      |
| **Recommendations API route**                                                                 | ✅ Done      |
| **Frontend pages** — Catalog, Product Detail, Cart, Recommendations, Category, Login/Register | ✅ Done      |
| **Admin CRUD** — product creation only (PATCH/DELETE missing)                                 | ⏳ Partial   |
| **Track-event route** — interaction logging from frontend                                     | ❌ Not built |
| **Checkout flow** — dummy payment + order creation                                            | ❌ Not built |
| **Seed data script** — automated product seeding                                              | ❌ Not built |
| **Simulated interaction data** — fake user histories for testing                              | ❌ Not built |
| **Evaluation** — Precision@K, Recall@K, MAP                                                   | ❌ Not built |

---

## 9. Explicit Scope Boundaries (for your report)

**In scope:**

- User registration/login with roles
- Product catalog
- Behavior tracking infrastructure (model exists, frontend wiring pending)
- Content-based recommendation engine (TF-IDF + cosine similarity)
- Cold-start fallback via popularity ranking

**Out of scope:**

- Real payment gateway integration
- Collaborative or hybrid filtering
- Real-time social media trend analysis
- Production-grade security/infrastructure
- Logistics/delivery integration
