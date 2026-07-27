# AI-Based Personalized Recommendation System for Fashion E-Commerce

### Project Documentation & Build Plan

---

## 1. Project Overview

A full-stack fashion e-commerce platform with:

- **Content-based AI recommendations** (TF-IDF + Cosine Similarity) that suggest personalized products based on user behavior (clicks, views, purchases)
- **AI image classification** using CLIP zero-shot learning to find visually similar products from uploaded photos
- **Full admin dashboard** for managing products, orders, users, and viewing analytics
- **Cloudinary integration** for secure product image uploads

---

## 2. Tech **Stack**

| Layer         | Technology                                                                               |
| ------------- | ---------------------------------------------------------------------------------------- |
| Frontend      | Next.js (App Router) + Tailwind CSS                                                      |
| Backend       | Next.js Route Handlers                                                                   |
| Database      | MongoDB (Mongoose)                                                                       |
| Auth          | Auth.js (NextAuth) — Credentials provider, role-based (user/admin)                       |
| Language      | TypeScript (entire stack)                                                                |
| AI Engine     | TF-IDF + Cosine Similarity (hand-rolled in TypeScript)                                   |
| Image AI      | Transformers.js — CLIP zero-shot image classification (Xenova/clip-vit-base-patch32)     |
| Image Hosting | Cloudinary (signed uploads)                                                              |
| Password      | bcrypt                                                                                   |
| Deployment    | Persistent Node server (e.g. Render) — **not** serverless/edge, due to in-memory caching |

---

## 3. Data Models (MongoDB Collections)

### `users`

```ts
{
  _id: ObjectId,
  name: string,                          // lowercase
  email: string,                         // lowercase, unique
  password: string,                      // select: false, bcrypt hashed
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
  product_type_name: string,             // enum — 24 types (e.g. "Shirt", "Trousers", "Dress")
  graphical_appearance_name: string,     // enum — 24 appearances (e.g. "Solid", "Stripe", "Denim")
  colour_group_name: string,             // enum — 24 colour groups
  perceived_colour_value_name: string,   // enum — 6 values (e.g. "Light", "Dark", "Bright")
  perceived_colour_master_name: string,  // enum — 15 master colours
  department_name: string,               // enum
  index_name: string,                    // enum
  detail_desc: string,                   // lowercase
  price: number,
  article_id: string,                    // original data identifier
  createdAt: Date,
  updatedAt: Date
}
// Indexes: product_type_name, graphical_appearance_name, colour_group_name,
//          perceived_colour_value_name, perceived_colour_master_name
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

### `orders`

```ts
{
  _id: ObjectId,
  userId: ObjectId,       // ref: "User"
  items: [{
    productId: ObjectId,  // ref: "Products"
    quantity: number,
    priceAtPurchase: number
  }],
  totalAmount: number,
  status: "paid",
  paymentMethod: string,  // "dummy-card"
  createdAt: Date,
  updatedAt: Date
}
// Index: { userId: 1, createdAt: -1 }
```

---

## 4. API Routes

### Public Routes

| Route                       | Method | Purpose                                                       |
| --------------------------- | ------ | ------------------------------------------------------------- |
| `/api/auth/[...nextauth]`   | —      | Login/session handling via Auth.js                            |
| `/api/auth/register`        | POST   | Register a new user                                           |
| `/api/products`             | GET    | List all products (optional `?limit=N`)                       |
| `/api/products/[productId]` | GET    | Get single product details                                    |
| `/api/categories/[slug]`    | GET    | Get products by category slug (e.g. `t-shirt`, `trousers`)    |
| `/api/sign-cloudinary`      | POST   | Generate Cloudinary upload signature for secure image uploads |

### Authenticated Routes (User)

| Route                           | Method | Purpose                                                                |
| ------------------------------- | ------ | ---------------------------------------------------------------------- |
| `/api/cart`                     | GET    | Fetch user's cart (populated with product data)                        |
| `/api/cart`                     | POST   | Add item to cart                                                       |
| `/api/cart`                     | PUT    | Update cart item quantity                                              |
| `/api/cart`                     | DELETE | Remove item from cart                                                  |
| `/api/checkout`                 | POST   | Create order, log purchase interactions, clear cart                    |
| `/api/orders`                   | GET    | Fetch order history (sorted newest first)                              |
| `/api/recommendations`          | GET    | Return personalized TF-IDF recommendations (or popularity fallback)    |
| `/api/recommendations/classify` | POST   | Upload an image → classify via CLIP → return visually similar products |
| `/api/track-event`              | POST   | Log a click/view/purchase interaction (feeds recommendation engine)    |

### Admin Routes

| Route                  | Method | Purpose                                                  |
| ---------------------- | ------ | -------------------------------------------------------- |
| `/api/admin`           | GET    | Admin session verification endpoint                      |
| `/api/admin/dashboard` | GET    | Dashboard stats (total users, products, orders, revenue) |
| `/api/admin/orders`    | GET    | List all orders (optional `?limit=N`)                    |
| `/api/admin/products`  | POST   | Create new product (with Cloudinary image upload)        |
| `/api/admin/products`  | DELETE | Delete product (removes from DB + Cloudinary image)      |
| `/api/admin/users`     | GET    | List all registered users                                |

---

## 5. AI Image Classification (CLIP Zero-Shot)

**Endpoint:** `POST /api/recommendations/classify`  
**Auth:** Required  
**Input:** Multipart form with an `image` file  
**Model:** `Xenova/clip-vit-base-patch32` (quantized q8) — runs fully client-side via Transformers.js

### How It Works

1. **Upload** — User sends an image of a clothing item
2. **3 parallel classification calls** (optimized from 5 original → 40% faster):
   - **Product type** (24 labels + non-clothing detection) — identifies the garment
   - **Appearance** (24 labels) — detects patterns, textures (Solid, Denim, Stripe, etc.)
   - **Colours** (45 labels) — identifies colour group, value, and master
3. **Non-clothing rejection** — If the image is classified as food, animal, landscape, vehicle, etc., it's rejected
4. **Similar product search** — Matches the top-2 predicted product types against the database and ranks by visual attribute similarity

### Performance Optimizations

- **3 parallel calls** instead of 5 (scores are higher per-category vs 1 giant call)
- **`globalThis` model caching** — survives Next.js hot reloads
- **Database indexes** on all classified attributes for fast aggregation
- **Weighted fallback aggregation** — if exact product type yields no matches, broadens search with weighted scoring

---

## 6. AI Recommendation Engine (TF-IDF + Cosine Similarity)

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
- If the Interactions collection is also empty (brand-new app), a random subset of products is returned instead.

---

## 7. Admin Dashboard & Management

**Location:** `app/(admin)/admin/` + `components/admin/`

### Pages

| Route                           | Purpose                                                |
| ------------------------------- | ------------------------------------------------------ |
| `/admin`                        | Dashboard overview (stats, charts, recent orders)      |
| `/admin/dashboard/orders`       | View and manage all orders (desktop + mobile views)    |
| `/admin/dashboard/products`     | View all products + create new                         |
| `/admin/dashboard/products/new` | Add new product form with:                             |
|                                 | • Basic info (name, price, description)                |
|                                 | • Image upload (Cloudinary with preview)               |
|                                 | • AI classification (auto-fills attributes from image) |
| `/admin/dashboard/users`        | View all users (desktop + mobile views)                |

### Components

| Component                        | Purpose                                               |
| -------------------------------- | ----------------------------------------------------- |
| `AdminShell`                     | Admin layout shell                                    |
| `AdminSidebar`                   | Navigation sidebar                                    |
| `dashboard/stats.tsx`            | Summary stat cards (users, products, orders, revenue) |
| `dashboard/header.tsx`           | Dashboard page header                                 |
| `dashboard/quickactions.tsx`     | Quick action shortcuts                                |
| `dashboard/recentorders.tsx`     | Recent orders table                                   |
| `dashboard/topproducts.tsx`      | Top products listing                                  |
| `orders/desktop.tsx`             | Orders table (desktop view)                           |
| `orders/mobile.tsx`              | Orders cards (mobile view)                            |
| `users/desktop.tsx`              | Users table (desktop view)                            |
| `users/mobile.tsx`               | Users cards (mobile view)                             |
| `product/desktop.tsx`            | Products table (desktop view)                         |
| `product/mobile.tsx`             | Products cards (mobile view)                          |
| `product/header.tsx`             | Product management header                             |
| `product/new/form.tsx`           | New product form wrapper                              |
| `product/new/basicInfo.tsx`      | Product name, price, description fields               |
| `product/new/classification.tsx` | Manual attribute dropdowns + AI classify trigger      |
| `product/new/imageupload.tsx`    | Cloudinary upload with drag-and-drop + preview        |

---

## 8. Frontend Pages

### Public Pages

| Route                           | Purpose                                                                                       |
| ------------------------------- | --------------------------------------------------------------------------------------------- |
| `/`                             | Landing page — Hero, Categories, Recommendations, Catalog                                     |
| `/login`                        | User login                                                                                    |
| `/register`                     | User registration                                                                             |
| `/catalog`                      | Full product catalog with search bar + sidebar filters (by type, colour, pattern, department) |
| `/category/[slug]`              | Products filtered by category                                                                 |
| `/category/[slug]/product/[id]` | Product detail page                                                                           |

### Authenticated Pages (User)

| Route             | Purpose                                       |
| ----------------- | --------------------------------------------- |
| `/cart`           | Shopping cart with quantity controls          |
| `/cart/checkout`  | Checkout page (shipping + dummy payment form) |
| `/orders`         | Order history                                 |
| `/recommendation` | Personalized product recommendations          |

### Components

| Component                                 | Purpose                                           |
| ----------------------------------------- | ------------------------------------------------- |
| `Navbar`                                  | Responsive navigation with auth state             |
| `Footer`                                  | Site footer                                       |
| `Hero`                                    | Landing page hero section                         |
| `Explainer`                               | Recommendation engine explainer (shown to guests) |
| `ProductCard`                             | Reusable product card with add-to-cart            |
| `FilterPills`                             | Category filter pills                             |
| `shopping/categories.tsx`                 | Category grid section                             |
| `shopping/recommended.tsx`                | Personalized recommendations section              |
| `shopping/rootcatalog.tsx`                | Landing page catalog section                      |
| `shopping/catalog.tsx`                    | Full catalog page                                 |
| `shopping/catalog/filterSideBar.tsx`      | Catalog filter sidebar (by type, colour, etc.)    |
| `shopping/checkout/leftOrderSummary.tsx`  | Checkout left panel — shipping + payment          |
| `shopping/checkout/rightOrderSummary.tsx` | Checkout right panel — order summary              |

---

## 9. Theming

- **Dark/Light mode** via `themesproviders.tsx`
- **Toggle** component for switching themes
- Tailwind CSS color scheme with `bg-base`, `text-cloud`, and other custom tokens

---

## 10. Cloudinary Image Uploads

**Endpoint:** `POST /api/sign-cloudinary` (public)  
Generates a signed signature for secure direct-upload from the browser. Used in the admin product creation flow.

---

## 11. Auth.js Setup Notes

- Credentials-based authentication with bcrypt password hashing
- JWT/session callbacks extended to include `role` on the session object
- Admin routes protected by `session.user.role === "admin"` server-side check
- Regular users can only access customer-facing routes

---

## 12. Dummy Payment Page (Checkout Flow)

Since real payment integration is out of scope, it is simulated:

1. User adds items to cart via ProductCard or product detail page.
2. User goes to `/cart/checkout` — a form with shipping address and dummy card fields (validated client-side).
3. On submit, `POST /api/checkout` is called:
   - Creates an `orders` document with `status: "paid"` (always succeeds — simulation).
   - Logs a `purchase` interaction for each item (feeds the recommendation engine).
   - Clears the user's cart.
4. User is redirected to `/orders` to view their order history.

> This is a **simulated payment flow for demonstration purposes** only.

---

## 13. Installation & Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd ecommerce-project
npm install

# 2. Set up environment variables (copy .env.example or create .env):
#    DATABASE_URL=<mongodb-connection-string>
#    AUTH_SECRET=<nextauth-secret>
#    BASE_URL=http://localhost:3000
#    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloudinary-cloud>
#    NEXT_PUBLIC_CLOUDINARY_API_KEY=<cloudinary-api-key>
#    CLOUDINARY_API_SECRET=<cloudinary-api-secret>

# 3. Place the CLIP model locally (required for offline use):
#    Download Xenova/clip-vit-base-patch32 into ./models/Xenova/clip-vit-base-patch32/

# 4. Seed the database with product data:
#    (Use the scripts in data/ directory or your own seed process)

# 5. Run dev server
npm run dev
```

### Environment Variables

| Variable                            | Description                               |
| ----------------------------------- | ----------------------------------------- |
| `DATABASE_URL`                      | MongoDB connection string                 |
| `AUTH_SECRET`                       | NextAuth.js secret                        |
| `BASE_URL`                          | App base URL (e.g. http://localhost:3000) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                     |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY`    | Cloudinary API key                        |
| `CLOUDINARY_API_SECRET`             | Cloudinary API secret                     |

---

## 14. Project Structure

```
app/
├── (admin)/admin/           # Admin pages (dashboard, orders, products, users)
├── (root)/                  # Public pages (home, catalog, cart, checkout, orders)
│   ├── (auth)/              # Login, register
│   └── (shopping)/          # Cart, orders, recommendations, catalog, category
├── api/
│   ├── admin/               # Admin API routes
│   ├── auth/                # Auth routes (nextauth, register)
│   ├── cart/                # Cart CRUD
│   ├── categories/          # Category-based product listing
│   ├── checkout/            # Checkout/order creation
│   ├── orders/              # Order history
│   ├── products/            # Product listing & detail
│   ├── recommendations/     # TF-IDF recommendations + CLIP image classification
│   ├── sign-cloudinary/     # Cloudinary upload signature
│   └── track-event/         # Interaction logging
components/
├── admin/                   # Admin components (dashboard, orders, products, users)
├── shopping/                # Shopping components (catalog, categories, checkout)
└── static/                  # Static data (colours, image map)
libs/
├── config/                  # App config, database config, encryption
├── enums/                   # Product attribute enums (24 product types, etc.)
├── models/                  # Mongoose schemas
├── recommendation/          # TF-IDF engine, cosine similarity, caching
└── utility/                 # Classification utilities
data/                        # Seed data scripts & Kaggle article datasets
public/images/               # Product category images (blazer.jpg, shirt.jpg, etc.)
models/Xenova/               # Local CLIP model files
```

---

## 15. Build Status

| Phase                                                                                   | Status       |
| --------------------------------------------------------------------------------------- | ------------ |
| **Project setup** — Next.js + TypeScript + MongoDB (Mongoose) + Auth.js                 | ✅ Done      |
| **Schemas** — `User`, `Product`, `Interaction`, `Cart`, `Order`                         | ✅ Done      |
| **Auth** — registration, login, role-based access                                       | ✅ Done      |
| **Product catalog** — listing, detail, category filtering                               | ✅ Done      |
| **Cart** — full CRUD API + frontend with quantity controls                              | ✅ Done      |
| **Checkout flow** — Dummy payment, order creation, cart clear                           | ✅ Done      |
| **Order history** — API + `/orders` page with loading/empty states                      | ✅ Done      |
| **Recommendation engine** — TF-IDF + cosine similarity + caching + cold-start fallback  | ✅ Done      |
| **Image classification** — CLIP zero-shot (3 parallel calls, non-clothing detection)    | ✅ Done      |
| **Visual similarity search** — Classify image → find similar products by attributes     | ✅ Done      |
| **Admin dashboard** — Stats, recent orders, top products                                | ✅ Done      |
| **Admin product management** — Create products with image upload + AI auto-classify     | ✅ Done      |
| **Admin orders management** — View all orders (desktop + mobile)                        | ✅ Done      |
| **Admin users management** — View all users                                             | ✅ Done      |
| **Cloudinary integration** — Signed uploads for product images                          | ✅ Done      |
| **Dark/Light theme** — Toggle theme support                                             | ✅ Done      |
| **Responsive design** — Desktop + mobile views throughout                               | ✅ Done      |
| **Track-event route** — Interaction logging from frontend                               | ✅ Done      |
| **Seed data scripts** — Kaggle dataset processing tools                                 | ✅ Done      |
| **Product images** — Category thumbnail assets (24 product types)                       | ✅ Done      |
| **Admin delete products** — Delete products from admin panel (with Cloudinary cleanup)  | ✅ Done      |
| **Product search & filters** — Text search + category/colour/pattern/department filters | ✅ Done      |


---

## 16. Explicit Scope Boundaries

**In scope:**

- User registration/login with roles (user/admin)
- Product catalog with text search and category/colour/pattern/department filters
- Shopping cart (full CRUD)
- Checkout with dummy payment simulation
- Behavior tracking infrastructure (interaction logging)
- Content-based recommendation engine (TF-IDF + cosine similarity)
- Cold-start fallback via popularity ranking
- AI image classification for visual similarity search
- Admin dashboard and management panel
- Admin product management (create, delete with Cloudinary cleanup)
- Cloudinary image upload integration

**Out of scope:**

- Real payment gateway integration
- Collaborative or hybrid filtering
- Real-time social media trend analysis
- Production-grade security/infrastructure
- Logistics/delivery integration
- Product reviews and ratings
