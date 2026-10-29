# Documentation & User Guide

**Project:** ĒLAN Fashion Rec — AI-Based Personalized Recommendation System for Fashion E-Commerce
**Repository:** `Ayomide-Philip/ecommerce-project`
**Audience:** developers installing the project, end users (shoppers), store administrators, and QA/testers
**Last verified:** 2026-10-29 (Node `v24.2.0`, npm `11.19.1`, MongoDB on `127.0.0.1:27017`)

This guide covers installation, the user manual for each role, standard operating procedures, and testing.
Software/runtime prerequisites and the full dependency inventory are in
[software_and_dependencies.md](./software_and_dependencies.md).

---

## Table of contents

1. [System overview](#1-system-overview)
2. [Prerequisites checklist](#2-prerequisites-checklist)
3. [Installation instructions](#3-installation-instructions)
4. [Configuration reference](#4-configuration-reference)
5. [User manual](#5-user-manual)
6. [Operating procedures](#6-operating-procedures)
7. [Testing instructions](#7-testing-instructions)
8. [Troubleshooting](#8-troubleshooting)
9. [Appendix](#9-appendix)

---

## 1. System overview

### 1.1 What the application does

A full-stack fashion e-commerce marketplace with:

- A public storefront: landing page, catalog with search/filters, category pages, product details.
- Account registration and credentials login, with `user` and `admin` roles.
- A shopping cart, simulated checkout (no real payment gateway), and order history.
- **Content-based recommendations** — TF-IDF + cosine similarity over a user's click/view/purchase history,
  with a popularity fallback for new users.
- **Visual product search** — upload a clothing photo; a local CLIP model predicts garment type, pattern and
  colours, then the database is searched for visually similar products.
- An **admin dashboard** with stats, product management (Cloudinary image upload + manual attribute
  selection), order viewing, and user viewing.

### 1.2 Roles and permissions

| Role      | How to obtain                                                                                                     | Can access                                                                                                                                                                      |
| --------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Guest** | No account                                                                                                        | `/`, `/catalog`, `/category/*`, `/category/*/product/*`, `/login`, `/register`                                                                                                  |
| **User**  | Register at `/register` (role defaults to `user`)                                                                 | Guest pages + `/cart`, `/cart/checkout`, `/orders`, `/recommendation`, `/api/cart`, `/api/checkout`, `/api/orders`, `/api/recommendations*`, `/api/track-event`                 |
| **Admin** | Register, then promote the account in MongoDB (see [§3.7](#37-create-the-first-admin)); sign in at `/admin/login` | Admin pages `/admin/dashboard*`, `/admin/dashboard/orders`, `/admin/dashboard/products`, `/admin/dashboard/products/new`, `/admin/dashboard/users`, and `/api/admin*` endpoints |

Admin **pages** redirect non-admins to `/admin/login`. Admin **APIs** return `401` when unauthenticated; when an
authenticated non-admin calls them they return `401` (dashboard, orders) or `403` (users, product create/delete),
depending on the route.

### 1.3 Architecture at a glance

| Concern         | Implementation                                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| UI              | Next.js App Router, React Server/Client Components, Tailwind CSS v4                                                                        |
| API             | Next.js Route Handlers under `app/api/**`                                                                                                  |
| Data            | MongoDB via Mongoose models in [libs/models/](./libs/models/); database name `ecommerce-website`                                           |
| Auth            | Auth.js v5 Credentials provider, bcrypt hashes, JWT session (24 h), `role` claim                                                           |
| Recommendations | [libs/recommendation/](./libs/recommendation/): TF-IDF vectors cached in process memory                                                    |
| Visual search   | [app/api/recommendations/classify/route.ts](./app/api/recommendations/classify/route.ts) using local `Xenova/clip-vit-base-patch32` (`q8`) |
| Images          | Cloudinary signed uploads (`/api/sign-cloudinary`) and `CldImage` delivery; `article_id` stores the Cloudinary public ID                   |
| Theme           | `next-themes` dark/light toggle; tokens defined in [tailwind.config.ts](./tailwind.config.ts) + [app/globals.css](./app/globals.css)       |

### 1.4 Route map

| Page route                                                   | Notes                                                                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `/`                                                          | Landing page: hero, categories, recommendations, catalog preview                                              |
| `/catalog`                                                   | Full catalog with search bar and sidebar filters                                                              |
| `/category`                                                  | Category index                                                                                                |
| `/category/[categoryId]`                                     | Products for a category slug (e.g. `/category/dress`); see [§8](#8-troubleshooting) for hyphenated type names |
| `/category/[categoryId]/product/[productId]`                 | Product detail                                                                                                |
| `/login`, `/register`                                        | Shopper authentication                                                                                        |
| `/cart`, `/cart/checkout`                                    | Cart and simulated checkout (login required)                                                                  |
| `/orders`                                                    | Order history (login required)                                                                                |
| `/recommendation`                                            | Personalized recommendations (login required)                                                                 |
| `/admin/login`                                               | Admin sign-in                                                                                                 |
| `/admin/dashboard`                                           | Stats, recent orders, quick actions (admin only)                                                              |
| `/admin/dashboard/orders`                                    | All orders                                                                                                    |
| `/admin/dashboard/products`, `/admin/dashboard/products/new` | Product list and creation                                                                                     |
| `/admin/dashboard/users`                                     | All users                                                                                                     |

API endpoints are listed in [§9.1](#91-api-reference).

---

## 2. Prerequisites checklist

Before installing, confirm:

- [ ] **Node.js ≥ 20.19.0** and npm ≥ 10 — `node --version`, `npm --version`
- [ ] **Git** and **Git LFS** — `git --version`, `git lfs version`
- [ ] **MongoDB 6.0+** reachable (local service or Atlas cluster) and a connection string
- [ ] **Cloudinary account** with cloud name, API key, API secret, and an upload preset named
      **`ecommerce-website`** (signed uploads)
- [ ] MongoDB Database Tools (`mongoimport`, `mongodump`) if you plan to seed or back up from the CLI
- [ ] Optional: Python 3.13 + Kaggle CLI for regenerating the image dataset
- [ ] Internet access for `npm ci` (and for `next/font/google` during the first build)

---

## 3. Installation instructions

### 3.1 Get the code and model weights

```powershell
git clone <repository-url>
cd ecommerce-project

# The CLIP ONNX model is stored in Git LFS. Without this line the model file is only a pointer.
git lfs install
git lfs pull
```

Verify the model file is real (≈146.6 MB, not a few hundred bytes):

```powershell
Get-Item .\models\Xenova\clip-vit-base-patch32\onnx\model_quantized.onnx |
  Select-Object Name, @{n='MB';e={[math]::Round($_.Length/1MB,2)}}
```

### 3.2 Install dependencies

```powershell
npm ci        # reproducible install from package-lock.json
# or
npm install   # update within declared ranges
```

### 3.3 Create the environment file

Create `.env.local` in the repository root (it is git-ignored). Use placeholders — never commit real secrets.

```dotenv
# --- Core ---
DATABASE_URL=mongodb://localhost:27017/
BETTER_AUTH_SECRET=<64-char-random-hex>
BASE_URL=http://localhost:3000

# --- Cloudinary ---
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
NEXT_PUBLIC_CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
```

Generate a secret with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> `BETTER_AUTH_SECRET` is the name the code reads ([libs/config/config.ts](./libs/config/config.ts)), even though
> the root README mentions `AUTH_SECRET`. Use `BETTER_AUTH_SECRET`.

### 3.4 Start MongoDB

**Local community server (Windows service example):**

```powershell
Get-Service MongoDB | Start-Service      # if installed as a service
# or run in a terminal:
mongod --dbpath C:\data\db
```

**MongoDB Atlas:** create a free cluster, add your IP to the network allowlist, create a database user, and use
the SRV connection string as `DATABASE_URL`.

Verify connectivity:

```powershell
mongosh "mongodb://localhost:27017/" --eval "db.runCommand({ ping: 1 })"
```

### 3.5 Configure Cloudinary

1. Sign in at <https://cloudinary.com/console> and copy the **cloud name**, **API key**, and **API secret** into
   `.env.local`.
2. Create an **upload preset** named **`ecommerce-website`** (Settings → Upload → Upload presets). The admin form
   references that preset name in
   [imageupload.tsx](./components/admin/product/new/imageupload.tsx); if you choose another name, update the code.
3. Contract: uploads are **signed** via `POST /api/sign-cloudinary`, so the API secret must stay server-side.

> Product images are rendered by public ID (`article_id`) through `CldImage`. Seeded H&M `article_id` values
> will not resolve unless the matching images are uploaded into **your** Cloudinary cloud.

### 3.6 Seed the product catalog

The seed file `data/articles_sample_with_ids.json` is **not committed** (`data/` is git-ignored). Obtain it from
the project owner or regenerate it (see [software_and_dependencies.md §6](./software_and_dependencies.md#6-data-assets--seed-inputs)).

**Option A — `mongoimport` (recommended):**

```powershell
mongoimport `
  --uri "mongodb://localhost:27017" `
  --db ecommerce-website `
  --collection products `
  --file .\data\articles_sample_with_ids.json `
  --jsonArray
```

**Option B — Node + Mongoose (if you have the JSON but not the Database Tools):**

```powershell
node -e "const fs=require('fs');const mongoose=require('mongoose');const {EJSON}=require('bson');const docs=EJSON.parse(fs.readFileSync('data/articles_sample_with_ids.json','utf8'));(async()=>{await mongoose.connect('mongodb://localhost:27017/ecommerce-website');const res=await mongoose.connection.db.collection('products').insertMany(docs);console.log('inserted',res.insertedCount);await mongoose.disconnect();})()"
```

`EJSON.parse` is required because the file stores `_id` values as `{ "$oid": "..." }`; plain `JSON.parse`
would insert a subdocument instead of an ObjectId. The `bson` package is available through Mongoose's MongoDB
driver.

Verify:

```powershell
mongosh "mongodb://localhost:27017/ecommerce-website" --eval "db.products.countDocuments()"
```

Expected for the sample file: **414** documents. The model expects collection name `products` and database
`ecommerce-website` (see [libs/config/database.config.ts](./libs/config/database.config.ts)).

> If you have no seed file, the storefront loads but lists no products; recommendations return an empty list.

### 3.7 Create the first admin

Registration always creates `role: "user"` ([app/api/auth/register/route.ts](./app/api/auth/register/route.ts)),
so promote the account directly in MongoDB:

```powershell
mongosh "mongodb://localhost:27017/ecommerce-website" --eval "db.users.updateOne({ email: 'admin@example.com' }, { `$set: { role: 'admin' } })"
```

Notes:

- Registration rules: name ≥ 5 characters **and** must contain a space; valid email; password ≥ 8 characters.
  Names and emails are stored lower-case.
- Sign out and back in after promotion so the JWT picks up the new role (the token stores `role`).
- Verify: `mongosh "mongodb://localhost:27017/ecommerce-website" --eval "db.users.findOne({role:'admin'},{email:1,role:1})"`

### 3.8 Run the application

**Development (hot reload):**

```powershell
npm run dev
```

Open <http://localhost:3000>. Admin sign-in: <http://localhost:3000/admin/login>.

**Production build:**

```powershell
npm run build
npm start
```

`next start` serves the build on port 3000 by default; change it with the `PORT` environment variable.

### 3.9 Post-install verification

| Check              | Command / action                                                 | Expected                                                   |
| ------------------ | ---------------------------------------------------------------- | ---------------------------------------------------------- |
| API is alive       | `Invoke-RestMethod http://localhost:3000/api`                    | `message: Hello from the API route!`                       |
| Catalog loaded     | `Invoke-RestMethod "http://localhost:3000/api/products?limit=3"` | `product` array with 3 items                               |
| Category works     | `Invoke-RestMethod http://localhost:3000/api/categories/dress`   | 200 with products (404 if none)                            |
| Auth is configured | Open `/login` and sign in                                        | Redirects into the storefront; no secret errors in console |
| Admin access       | Sign in at `/admin/login` with the promoted account              | `/admin/dashboard` loads stats                             |
| Model is local     | Upload a clothing photo at `/recommendation`                     | Similar products returned; no download attempt in logs     |

---

## 4. Configuration reference

### 4.1 Environment variables

| Variable                            | Default (dev)           | Change requires restart? | Change requires rebuild?                  |
| ----------------------------------- | ----------------------- | ------------------------ | ----------------------------------------- |
| `DATABASE_URL`                      | —                       | Yes                      | No                                        |
| `BETTER_AUTH_SECRET`                | —                       | Yes                      | No (but existing sessions become invalid) |
| `BASE_URL`                          | `http://localhost:3000` | Yes                      | No                                        |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | —                       | Yes                      | **Yes** (inlined at build)                |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY`    | —                       | Yes                      | **Yes** (inlined at build)                |
| `CLOUDINARY_API_SECRET`             | —                       | Yes                      | No                                        |

Full descriptions: [software_and_dependencies.md §4.1](./software_and_dependencies.md#41-environment-variables).

### 4.2 Application constants

| Setting                         | Value                                  | Location                                                      |
| ------------------------------- | -------------------------------------- | ------------------------------------------------------------- |
| MongoDB database name           | `ecommerce-website`                    | [database.config.ts](./libs/config/database.config.ts)        |
| Session strategy / lifetime     | JWT / 24 hours                         | [auth.ts](./auth.ts)                                          |
| Password hashing cost           | 10                                     | [encrypt.ts](./libs/config/encrypt.ts)                        |
| Local model root                | `./models`                             | [classify route](./app/api/recommendations/classify/route.ts) |
| Remote model download           | Disabled (`allowRemoteModels = false`) | [classify route](./app/api/recommendations/classify/route.ts) |
| Classification confidence floor | `0.15`                                 | [classify route](./app/api/recommendations/classify/route.ts) |
| Recommendation top-N (API)      | 20 when omitted; clamped to 1–20       | [recommendations route](./app/api/recommendations/route.ts)   |
| Interaction weights             | purchase 3×, click 2×, view 1×         | [user-to-text.ts](./libs/recommendation/user-to-text.ts)      |
| Cart quantity bounds            | 1–100                                  | [cart route](./app/api/cart/route.ts)                         |
| Product price bounds            | 1–100,000                              | [admin products route](./app/api/admin/products/route.ts)     |

---

## 5. User manual

### 5.1 Guests (not signed in)

1. **Browse the storefront.** `/` shows the hero, category tiles, recommendation explainer, and a catalog preview.
2. **Search and filter.** `/catalog` provides a search bar plus a sidebar to filter by product type, colour,
   pattern, and department. Active filters appear as removable pills.
3. **Browse a category.** Selecting a category opens `/category/<slug>` (for example `/category/dress`).
4. **View a product.** Clicking a product card records a `click` interaction (when signed in) and opens the
   product detail page with price, description, and add-to-cart controls.
5. **Create an account.** `/register` requires a full name (at least 5 characters and containing a space), a
   valid email, and an 8+ character password.
6. **Sign in.** `/login`. Sessions last 24 hours. Use the header menu to sign out.

### 5.2 Signed-in shoppers

| Task                | Steps                                                                                         | Notes                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Add to cart         | On a product card or detail page choose a quantity (1–99 in the UI) and click **Add to Cart** | Server rejects duplicates: update the existing line instead                            |
| Change quantity     | In `/cart`, use the quantity controls                                                         | Server enforces integer 1–100                                                          |
| Remove a line       | In `/cart`, click remove                                                                      | Deletes that cart line                                                                 |
| Checkout            | `/cart` → **Checkout** → fill shipping and dummy card fields → submit                         | Payment is simulated; the order is always created with `status: "paid"`                |
| View orders         | `/orders`                                                                                     | Newest first, with items, quantities, and purchase prices                              |
| Get recommendations | `/recommendation`                                                                             | Cold-start users see popular products; after interactions, results become personalized |
| Visual search       | `/recommendation` → upload a clothing photo                                                   | Rejects non-clothing images and low-confidence photos with a message                   |
| Theme               | Toggle in the header                                                                          | Preference persists in the browser                                                     |

**How recommendations behave**

- Every click, view, and purchase is logged to `interactions`. Duplicate `(user, product, eventType)` events are
  ignored by `/api/track-event`.
- The engine builds a weighted preference text (purchase 3×, click 2×, view 1×), vectorizes it with TF-IDF, and
  ranks products by cosine similarity.
- Users with no interactions receive the most-interacted products across all users; if there are no interactions
  at all, a random sample is returned.

**How visual search behaves**

- The first classification request loads the CLIP model and can take tens of seconds on CPU; later requests are
  faster because the model is cached per process.
- The model predicts product type (top 2), appearance, and three colour dimensions in three focused model passes.
- Images classified as food/drink, animals, landscapes, buildings, vehicles, electronics, furniture, or plants
  are rejected.
- If the top product-type confidence is below `0.15`, the request is rejected as unclassifiable.
- Results are ranked by attribute matches, with a weighted broader search when no exact product type matches.

### 5.3 Administrators

Sign in at `/admin/login` with an account whose `role` is `admin`.

| Area                                              | Actions                                                                                      |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Dashboard** (`/admin/dashboard`)                | Total users, products, orders, revenue; recent orders; top products; quick actions           |
| **Orders** (`/admin/dashboard/orders`)            | Read-only list of all orders for desktop and mobile layouts                                  |
| **Products** (`/admin/dashboard/products`)        | Browse/search products; start creation; delete a product (also deletes its Cloudinary asset) |
| **New product** (`/admin/dashboard/products/new`) | Upload an image, choose classification attributes manually, then submit                      |
| **Users** (`/admin/dashboard/users`)              | Read-only list of registered users for desktop and mobile layouts                            |

**Creating a product**

1. Open **Products → New product**.
2. Upload a clothing image in the **Product Image** panel. The uploader stores the Cloudinary public ID in
   `article_id`.
   > The form has **no** "classify with AI" button as of 2026-10-29 — every classification field is selected
   > manually. AI classification is only exposed to shoppers (`/recommendation`) and via
   > `POST /api/recommendations/classify`.
3. Complete the fields:

   | Field                                                                                  | Rule                                                                                                                        |
   | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
   | Product name                                                                           | 5–100 characters                                                                                                            |
   | Description                                                                            | 10–1,000 characters                                                                                                         |
   | Price                                                                                  | Number between 1 and 100,000                                                                                                |
   | Image (`article_id`)                                                                   | Required; the Cloudinary public ID (3–50 characters) is filled by the uploader                                              |
   | Product type, appearance, colour group, colour value, master colour, department, index | Must be one of the fixed enum values in [product.enums.ts](./libs/enums/product.enums.ts); casing is normalized server-side |

4. Submit. A duplicate name + description pair is rejected with _"A product with the same name and description
   already exists."_

**Deleting a product**

- Deleting removes the MongoDB document and destroys the Cloudinary asset referenced by `article_id`.
- If Cloudinary is unreachable, deletion fails with `503` and the product stays in the database.
- After any catalog change, restart the Node process so the recommendation cache rebuilds
  (see [§6.4](#64-recommendation-cache-management)).

**Limitations administrators should know**

- Orders cannot be edited, cancelled, or refunded; status is always `paid`.
- Users cannot be edited or deleted from the UI; role changes and password resets are database operations.
- The product form does not call the AI classifier; attributes are manual (see step 2 above).
- There is no audit log; `console.log` output on the server is the only trace.

---

## 6. Operating procedures

### 6.1 Start, stop, and restart

| Environment      | Start                            | Stop                       | Notes                                                                                |
| ---------------- | -------------------------------- | -------------------------- | ------------------------------------------------------------------------------------ |
| Development      | `npm run dev`                    | `Ctrl+C`                   | Hot reload; recompiles on change.                                                    |
| Production       | `npm run build` then `npm start` | `Ctrl+C` / process manager | Persistent process required. Use PM2, systemd, Docker, or your PaaS process manager. |
| Docker/container | Build image, run `npm start`     | `docker stop`              | Install native deps in the same image/architecture.                                  |

**Restart triggers:** environment variable changes, `.env.local` edits, catalog changes (recommendation cache),
and dependency upgrades. `NEXT_PUBLIC_*` changes additionally require `npm run build`.

### 6.2 Health and monitoring

- **Liveness:** `GET /api` → `{"message":"Hello from the API route!"}`.
- **Database:** `GET /api/products?limit=1` must return a `product` array (a `500` indicates a DB problem).
- **Logs:** Next.js writes request errors and route `console.log` output to the process stdout/stderr. Ship them
  to your platform's log drain. Failed DB/Cloudinary operations and authentication failures are logged there.
- **Resource watch:** memory grows with the CLIP model and TF-IDF cache; alert above ~80% of the container limit.

### 6.3 Daily / weekly checks

| Frequency | Check                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------- |
| Daily     | `/api` and `/api/products?limit=1` return 200; error rate and 5xx count normal                     |
| Daily     | Admin dashboard loads and revenue/order counts look plausible                                      |
| Weekly    | Disk usage for logs and MongoDB growth; interaction collection size                                |
| Weekly    | Cloudinary usage against plan limits                                                               |
| Monthly   | Run `npm audit`, review dependency advisories, and apply security patches in a staging environment |

### 6.4 Recommendation cache management

The TF-IDF cache is built once per process. `invalidateCache()` exists in
[engine.ts](./libs/recommendation/engine.ts) but **no route calls it**, so product create/delete does not refresh
recommendations automatically.

**Procedure after catalog changes:** restart the application process. The next recommendations request rebuilds
the cache from the current product collection.

**Recommended code fix (maintainers):** call `invalidateCache()` after successful product create/delete in
[app/api/admin/products/route.ts](./app/api/admin/products/route.ts).

### 6.5 Product lifecycle

1. Create the product in the admin UI (image upload → manual attribute selection → submit).
2. Verify it appears in `/catalog` and via `GET /api/products?limit=<n>`.
3. Restart the process so recommendations include it.
4. To retire a product, delete it from the admin UI (this also removes the Cloudinary asset). Historical orders
   keep their stored `priceAtPurchase`; cart lines referencing a deleted product should be cleared manually (see
   [§6.7](#67-data-maintenance)).

### 6.6 User and role administration

**Promote or demote an admin:**

```powershell
mongosh "mongodb://localhost:27017/ecommerce-website" --eval "db.users.updateOne({ email: 'person@example.com' }, { `$set: { role: 'admin' } })"
mongosh "mongodb://localhost:27017/ecommerce-website" --eval "db.users.updateOne({ email: 'person@example.com' }, { `$set: { role: 'user' } })"
```

The affected user must sign out and sign in again for the JWT to carry the new role.

**Reset a password (no self-service reset exists):**

```powershell
node -e "const b=require('bcrypt');b.hash('NewStrongPassword123',10).then(h=>console.log(h))"
# copy the hash, then:
mongosh "mongodb://localhost:27017/ecommerce-website" --eval "db.users.updateOne({ email: 'person@example.com' }, { `$set: { password: '<bcrypt-hash>' } })"
```

Handle resets through a secure channel and ask the user to change the password afterwards.

**Create an admin without the UI (optional):** register normally, then promote. Do not insert users manually —
the password must be a bcrypt hash.

### 6.7 Data maintenance

**Remove orphaned cart lines** (product deleted):

```javascript
// mongosh — ensure the products collection is not empty first: an empty $nin array matches every document
const productIds = new Set(
  db.products
    .find({}, { _id: 1 })
    .toArray()
    .map((p) => p._id.toString()),
);
if (productIds.size > 0) {
  db.carts.deleteMany({
    productId: { $nin: [...productIds].map((id) => ObjectId(id)) },
  });
}
```

**Prune old interactions** (optional; affects personalization):

```javascript
// mongosh — keep the last 180 days
db.interactions.deleteMany({
  createdAt: { $lt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) },
});
```

**Integrity checks:**

```javascript
// mongosh — duplicate cart lines should be impossible (unique index)
db.carts.aggregate([
  { $group: { _id: { u: "$userId", p: "$productId" }, n: { $sum: 1 } } },
  { $match: { n: { $gt: 1 } } },
]);
// Orders with a total that does not match their items
db.orders.find({
  $expr: {
    $ne: [
      "$totalAmount",
      {
        $sum: {
          $map: {
            input: "$items",
            as: "i",
            in: { $multiply: ["$$i.priceAtPurchase", "$$i.quantity"] },
          },
        },
      },
    ],
  },
});
```

### 6.8 Backup and restore

**Backup:**

```powershell
$stamp = Get-Date -Format 'yyyy-MM-dd'
mongodump --uri "mongodb://localhost:27017" --db ecommerce-website --out ".\backups\$stamp"
```

**Restore (destructive):**

```powershell
mongorestore --uri "mongodb://localhost:27017" --db ecommerce-website --drop ".\backups\2026-10-29\ecommerce-website"
```

For Atlas, replace `--uri` with the SRV connection string. Store backups encrypted and off-host; they contain
password hashes and customer order data. Recommended cadence: nightly full backup, 30-day retention, and a
quarterly restore rehearsal.

### 6.9 Deployment and upgrade procedure

1. **Freeze** writes (optional maintenance window) and take a backup.
2. Pull the release and install exactly: `git lfs pull` → `npm ci`.
3. Ensure production `.env` values are present (secret manager), including `BASE_URL` with the public URL.
4. Build: `npm run build`.
5. Restart the Node process (`npm start` under your process manager).
6. Smoke test: `/api`, `/api/products?limit=1`, sign-in, catalog, and one admin page.
7. Verify classification once (first call is slow) and recommendations after restart.
8. Tag the release and record the verification results.

**Never** deploy to a serverless/edge platform: the TF-IDF cache and CLIP model require a persistent process.

### 6.10 Incident response quick actions

| Symptom                  | First action                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| All pages 500            | Check `DATABASE_URL`, MongoDB reachability, and process logs                                     |
| Login fails for everyone | Confirm `BETTER_AUTH_SECRET` is set and unchanged; check system time skew                        |
| Images broken            | Verify Cloudinary env vars, the `ecommerce-website` preset, and public IDs                       |
| Classification failing   | Confirm the ONNX file is a real binary (LFS pulled) and that `./models` is the working directory |
| Recommendations stale    | Restart the process to rebuild the TF-IDF cache                                                  |
| Out-of-memory            | Increase memory limit; check for repeated model loads after crashes                              |

---

## 7. Testing instructions

### 7.1 Current test coverage

**There is no automated test suite in this repository.** Verified 2026-10-29:

- No `test` script in [package.json](./package.json).
- No `*.test.*` / `*.spec.*` files under `app/`, `components/`, or `libs/`.
- No test runner dependency (Jest/Vitest/Playwright).

Therefore validation is a combination of static checks, API smoke tests, and the manual functional test plan
below. Adding Vitest + React Testing Library for pure functions (TF-IDF, cosine similarity) and Playwright for
end-to-end flows is the recommended next step.

### 7.2 Static checks

| Check            | Command            | Baseline result                                                                                                                                                                   | Gate                      |
| ---------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| TypeScript       | `npx tsc --noEmit` | **Pass** (exit 0)                                                                                                                                                                 | Must pass                 |
| Production build | `npm run build`    | **Pass** (all routes compiled)                                                                                                                                                    | Must pass                 |
| Lint             | `npm run lint`     | **Fails** — wrong `eslint-config-next` package (see [software_and_dependencies.md §8.1](./software_and_dependencies.md#81-eslint-config-next-is-the-wrong-package-blocking-lint)) | Informational until fixed |
| Git LFS model    | `git lfs ls-files` | Lists `model_quantized.onnx`                                                                                                                                                      | Must list the model       |
| Dependency audit | `npm audit`        | Review findings                                                                                                                                                                   | No unpatched criticals    |

After fixing the ESLint configuration, run `npx eslint .` (with no arguments, ESLint 10 has no target files).

### 7.3 Test environment setup

1. Use a **separate test database** to protect real data:
   `DATABASE_URL=mongodb://localhost:27017/` (the app always uses database `ecommerce-website`; point the URI at
   a disposable server or restore afterwards).
2. Seed at least 20 products (`data/articles_sample_with_ids.json` is ideal — expected 414).
3. Create two shoppers (`shopper1@example.com`, `shopper2@example.com`) and one admin.
4. Keep a non-clothing image (e.g. a landscape) and a clothing image ready for classification tests.
5. Start the app with `npm run dev` and keep the server log visible.

### 7.4 API smoke tests

**Unauthenticated endpoints:**

```powershell
Invoke-RestMethod http://localhost:3000/api
Invoke-RestMethod "http://localhost:3000/api/products?limit=3"
Invoke-RestMethod http://localhost:3000/api/categories/dress
Invoke-RestMethod http://localhost:3000/api/products/<productId>
```

**Authorization negatives (expect 401):**

```powershell
curl.exe -i http://localhost:3000/api/cart
curl.exe -i http://localhost:3000/api/orders
curl.exe -i http://localhost:3000/api/recommendations
curl.exe -i http://localhost:3000/api/admin/dashboard
curl.exe -i -X POST http://localhost:3000/api/recommendations/classify
```

**Authenticated testing.** The simplest path is the browser UI (the session cookie is HTTP-only). For scripted
tests, sign in with curl and a cookie jar:

```powershell
# 1. Get a CSRF token (saves cookies)
$csrf = (curl.exe -s -c cookies.txt http://localhost:3000/api/auth/csrf | ConvertFrom-Json).csrfToken

# 2. Sign in with credentials
#    A 302 redirect indicates success; the session cookie is written to cookies.txt.
#    Invalid credentials redirect to the error page and store no session cookie.
curl.exe -s -o NUL -w "%{http_code}`n" -b cookies.txt -c cookies.txt `
  -X POST http://localhost:3000/api/auth/callback/credentials `
  -H "Content-Type: application/x-www-form-urlencoded" `
  --data-urlencode "csrfToken=$csrf" `
  --data-urlencode "email=shopper1@example.com" `
  --data-urlencode "password=<shopper-password>" `
  --data-urlencode "callbackUrl=http://localhost:3000"

# 3. Call authenticated routes with the saved cookie
curl.exe -s -b cookies.txt http://localhost:3000/api/cart
curl.exe -s -b cookies.txt http://localhost:3000/api/orders
curl.exe -s -b cookies.txt "http://localhost:3000/api/recommendations?topN=5"
```

**Authenticated JSON calls (PowerShell, after copying the session cookie from DevTools →
Application → Cookies → `authjs.session-token`):**

```powershell
$session = '<authjs.session-token value>'
$headers = @{ Cookie = "authjs.session-token=$session" }

Invoke-RestMethod -Uri http://localhost:3000/api/cart -Headers $headers
Invoke-RestMethod -Uri http://localhost:3000/api/checkout -Method POST -Headers $headers
```

**Image classification:**

```powershell
curl.exe -s -b cookies.txt -X POST http://localhost:3000/api/recommendations/classify `
  -F "image=@C:\path\to\clothing.jpg"
```

### 7.5 Manual functional test cases

| ID    | Area                                | Steps                                                                 | Expected result                                                                                                |
| ----- | ----------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| TC-01 | Landing                             | Open `/`                                                              | Hero, categories, recommendation explainer/catalog render without console errors                               |
| TC-02 | Catalog                             | Open `/catalog`; type a product name in search                        | Grid filters to matching products                                                                              |
| TC-03 | Catalog filters                     | Apply colour/pattern/department filters                               | Only matching products remain; filter pills are removable                                                      |
| TC-04 | Category                            | Open `/category/dress`                                                | Dresses only; page title reflects category                                                                     |
| TC-05 | Category negative                   | Open `/category/not-a-real-category`                                  | Graceful "not found"/empty state (API returns 404)                                                             |
| TC-06 | Product detail                      | Click a product card                                                  | Detail page opens; a `click` interaction is recorded for signed-in users                                       |
| TC-07 | Registration validation             | Submit short name, name without space, invalid email, 7-char password | Specific field errors; no account created                                                                      |
| TC-08 | Registration success                | Submit valid data                                                     | Account created; role is `user`; can sign in                                                                   |
| TC-09 | Duplicate email                     | Register an existing email                                            | "User with this email already exists"                                                                          |
| TC-10 | Login success                       | Sign in at `/login`                                                   | Redirected into the storefront; header shows the user                                                          |
| TC-11 | Login failure                       | Wrong password                                                        | Error toast; no session                                                                                        |
| TC-12 | Session expiry                      | Sign in, wait 24 h or clear/expire cookie, call `/api/cart`           | `401 Unauthorized`                                                                                             |
| TC-13 | Add to cart                         | Add a product with quantity 2                                         | Cart shows the line with quantity 2                                                                            |
| TC-14 | Duplicate add                       | Add the same product again                                            | `400` with "Product already in cart. Please update the quantity instead."                                      |
| TC-15 | Quantity bounds                     | Set quantity 0, 101, or non-integer (API)                             | `400` with the 1–100 message                                                                                   |
| TC-16 | Remove line                         | Remove a cart line                                                    | Line disappears; DB row deleted                                                                                |
| TC-17 | Checkout empty cart                 | POST `/api/checkout` with no items                                    | `400` "Your cart is empty…"                                                                                    |
| TC-18 | Checkout success                    | Checkout with items                                                   | `201`; order created with `paid`, `dummy-card`, correct total; cart cleared; purchase interactions created     |
| TC-19 | Order history                       | Open `/orders`                                                        | Newest order first; items, quantity, and purchase price displayed                                              |
| TC-20 | Recommendation cold start           | New user opens `/recommendation`                                      | Popular products (or a random sample when there are no interactions at all)                                    |
| TC-21 | Recommendation personalization      | Click/view/purchase several items, open `/recommendation`             | Results lean toward interacted product attributes                                                              |
| TC-22 | Track-event validation              | POST invalid `eventType`, malformed IDs, unknown product              | `400` for an invalid event type or malformed IDs; `404` for an unknown product; nothing saved                  |
| TC-23 | Track-event dedupe                  | POST the same `(product, eventType)` twice                            | First saves; second returns "Event already tracked"                                                            |
| TC-24 | Image classification (clothing)     | Upload a clear clothing photo at `/recommendation`                    | Classified attributes plus up to 10 similar products                                                           |
| TC-25 | Image classification (non-clothing) | Upload a landscape/food photo                                         | `400` "…does not appear to be a clothing item"                                                                 |
| TC-26 | Image classification (missing file) | POST without `image`                                                  | `400` "No image file provided."                                                                                |
| TC-27 | Admin login                         | Sign in at `/admin/login` as admin                                    | `/admin/dashboard` loads stats                                                                                 |
| TC-28 | Admin guard                         | Sign in as a normal user and open `/admin/dashboard`                  | Redirect to `/admin/login`                                                                                     |
| TC-29 | Admin API guard                     | Call `/api/admin/products` (POST) as a normal user                    | `403` "Only admins can add new products"                                                                       |
| TC-30 | Create product                      | Admin creates a product with an uploaded image                        | Product appears in catalog; duplicate name+description rejected                                                |
| TC-31 | Delete product                      | Admin deletes a product                                               | Removed from catalog and DB; Cloudinary asset destroyed; usage of a deleted item's cart line is cleaned by ops |
| TC-32 | Admin lists                         | Open orders/products/users pages on desktop and mobile widths         | Tables/cards render, no overflow, values match the DB                                                          |
| TC-33 | Theme                               | Toggle dark/light on storefront and admin                             | Whole UI switches; preference persists after reload                                                            |
| TC-34 | Responsive                          | Test 360 px, 768 px, 1280 px widths                                   | Navigation, cards, and tables adapt without horizontal scrolling                                               |
| TC-35 | Secrets                             | Search the client bundle for the Cloudinary secret / auth secret      | Not present (only `NEXT_PUBLIC_*` values may appear)                                                           |

### 7.6 Data integrity verification

Run after registration, cart, and checkout tests:

```javascript
// mongosh "mongodb://localhost:27017/ecommerce-website"
db.users.countDocuments({ role: "admin" }); // ≥ 1
db.users.getIndexes(); // unique email index
db.products.countDocuments(); // matches seed/created count
db.carts.getIndexes(); // unique { userId, productId }
db.carts.aggregate([
  { $group: { _id: { u: "$userId", p: "$productId" }, n: { $sum: 1 } } },
  { $match: { n: { $gt: 1 } } }, // must be empty
]);
db.orders.find({
  $expr: {
    $ne: [
      "$totalAmount",
      {
        $sum: {
          $map: {
            input: "$items",
            as: "i",
            in: { $multiply: ["$$i.priceAtPurchase", "$$i.quantity"] },
          },
        },
      },
    ],
  },
}); // must be empty
db.orders.findOne({}); // status "paid", paymentMethod "dummy-card"
db.interactions.aggregate([
  { $match: { eventType: "purchase" } },
  { $count: "purchases" },
]);
```

Also confirm the checkout flow left **no** cart rows for the buyer and created one purchase interaction per item.

### 7.7 AI behavior verification

| Check                    | Method                                                                          | Expected                                                         |
| ------------------------ | ------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Model is local           | Temporarily block outbound internet; classify an image                          | Still works (no remote download)                                 |
| Cold-start latency       | Time the first request after a restart                                          | Slower (model load); subsequent requests faster                  |
| Non-clothing rejection   | Upload landscape/food/animal image                                              | Rejected with the clothing-only message                          |
| Low-confidence rejection | Upload a blurry/ambiguous image                                                 | `400` "Unable to classify the image with sufficient confidence." |
| Similar-product quality  | Upload a shirt photo                                                            | Results are mostly shirts/tops with related colours/patterns     |
| Weighting                | Create a user with only purchases of type A vs a user with only views of type A | Purchase-driven user's recommendations skew more strongly to A   |
| Cache rebuild            | Add a product, restart the process, request recommendations                     | New product can appear                                           |

### 7.8 Acceptance criteria for a release

- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run build` passes.
- [ ] TC-01 to TC-34 executed; blockers (auth, catalog, cart, checkout, admin) pass.
- [ ] No secrets in the client bundle or repository.
- [ ] Model present via Git LFS; classification works offline.
- [ ] Backup taken before deployment; restore path verified at least quarterly.
- [ ] Known issues documented (lint configuration, cache invalidation, read-only admin operations).

### 7.9 Test cleanup

```javascript
// mongosh — delete test data only; adjust the email list first
const emails = ["shopper1@example.com", "shopper2@example.com"];
const ids = db.users
  .find({ email: { $in: emails } }, { _id: 1 })
  .toArray()
  .map((u) => u._id);
db.carts.deleteMany({ userId: { $in: ids } });
db.orders.deleteMany({ userId: { $in: ids } });
db.interactions.deleteMany({ userId: { $in: ids } });
const removed = db.users.deleteMany({ _id: { $in: ids } });
print(`removed ${removed.deletedCount} test users`);
```

Restore the seeded database with `mongorestore --drop` if tests mutated production-like data.

---

## 8. Troubleshooting

| Symptom                                                       | Likely cause                                                                                                              | Resolution                                                                                                                                                                                       |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Please define the DATABASE_URL environment variable`         | `.env.local` missing/typo, or server started from the wrong directory                                                     | Create `.env.local` in the repo root and restart from that directory                                                                                                                             |
| Mongo `ECONNREFUSED` / timeout                                | MongoDB not running, wrong URI, Atlas IP not allowlisted                                                                  | Start the service; verify with `mongosh`; update the allowlist                                                                                                                                   |
| Login always fails                                            | `BETTER_AUTH_SECRET` missing/changed; user has no password hash; wrong callback URL                                       | Set a stable secret; reset the password hash; check `BASE_URL`/`AUTH_URL`                                                                                                                        |
| Redirect loop after login                                     | `BASE_URL`/`AUTH_URL` mismatch with the actual host                                                                       | Set `BASE_URL` to the public origin and restart                                                                                                                                                  |
| 401 on cart/orders/recommendations                            | No session / expired JWT                                                                                                  | Sign in again; verify cookies are enabled                                                                                                                                                        |
| 403 on product create/delete                                  | Account is not an admin                                                                                                   | Promote in MongoDB and sign in again                                                                                                                                                             |
| Cloudinary upload fails                                       | Missing env vars, preset `ecommerce-website` absent, wrong API key/secret                                                 | Verify the console values and preset; check server logs                                                                                                                                          |
| Cloudinary delete returns 503                                 | Outbound network blocked                                                                                                  | Restore connectivity; retry deletion                                                                                                                                                             |
| Product images broken after seeding                           | Seeded H&M `article_id` values do not exist in your Cloudinary cloud                                                      | Upload corresponding images or re-create products with uploaded images                                                                                                                           |
| Classification fails immediately                              | Model directory missing/only LFS pointers                                                                                 | `git lfs install && git lfs pull`; verify the ONNX file size                                                                                                                                     |
| Classification hangs on first request                         | Model load/inference on CPU                                                                                               | Wait; pre-warm by calling the endpoint after deploy; scale CPU                                                                                                                                   |
| `Unable to classify… confidence`                              | Blurry/ambiguous/unsupported image                                                                                        | Ask for a clearer clothing photo                                                                                                                                                                 |
| Recommendations stale after adding products                   | No cache invalidation is wired into product routes                                                                        | Restart the process (or implement `invalidateCache()` in the admin routes)                                                                                                                       |
| Recommendations empty                                         | No products and/or no interactions                                                                                        | Seed products; generate interactions                                                                                                                                                             |
| Category 404 for a hyphenated type (e.g. `/category/t-shirt`) | `/api/categories/[slug]` converts `-` to a space and matches exactly, so `t-shirt` becomes `t shirt` and misses `T-shirt` | Use a type without a hyphen (e.g. `/category/dress`) until the route preserves hyphens; code fix: compare against `product_type_name` after also restoring the hyphen, or query by a stored slug |
| `npm run lint` crashes with `ERR_MODULE_NOT_FOUND`            | Wrong `eslint-config-next` package                                                                                        | See [software_and_dependencies.md §8.1](./software_and_dependencies.md#81-eslint-config-next-is-the-wrong-package-blocking-lint)                                                                 |
| `npm run build` fails fetching fonts                          | Offline build with `next/font/google`                                                                                     | Allow network access or vendor local fonts                                                                                                                                                       |
| `bcrypt` install error                                        | No prebuilt binary for the platform                                                                                       | Install C++ build tools/Python, or use a supported Node/platform combination                                                                                                                     |
| `sharp` runtime error after copying `node_modules`            | Platform-specific native binary                                                                                           | Reinstall on the target platform with `npm ci`                                                                                                                                                   |
| Admin sidebar/UI glitches                                     | Stale browser cache after deploy                                                                                          | Hard reload; verify the build's static assets are served                                                                                                                                         |

---

## 9. Appendix

### 9.1 API reference

| Method | Route                           | Auth   | Purpose                                                         |
| ------ | ------------------------------- | ------ | --------------------------------------------------------------- |
| GET    | `/api`                          | Public | Health message                                                  |
| ANY    | `/api/auth/[...nextauth]`       | Public | Auth.js handlers (sign-in, session, sign-out)                   |
| POST   | `/api/auth/register`            | Public | Register a user (validates name, email, password)               |
| GET    | `/api/products?limit=N`         | Public | List products, newest first                                     |
| GET    | `/api/products/[productId]`     | Public | Product detail                                                  |
| GET    | `/api/categories/[slug]`        | Public | Products by product-type slug                                   |
| POST   | `/api/sign-cloudinary`          | Public | Sign Cloudinary upload parameters (`paramsToSign`)              |
| GET    | `/api/cart`                     | User   | Cart with populated product fields                              |
| POST   | `/api/cart`                     | User   | Add line `{ productId, quantity }` (1–100, no duplicates)       |
| PUT    | `/api/cart`                     | User   | Update quantity `{ productId, quantity }` (integer 1–100)       |
| DELETE | `/api/cart`                     | User   | Remove line `{ productId }`                                     |
| POST   | `/api/checkout`                 | User   | Create order, log purchases, clear cart                         |
| GET    | `/api/orders`                   | User   | Order history, newest first                                     |
| GET    | `/api/recommendations?topN=N`   | User   | TF-IDF recommendations (1–20, default 20)                       |
| POST   | `/api/recommendations/classify` | User   | Multipart `image` → CLIP attributes + up to 10 similar products |
| POST   | `/api/track-event`              | User   | Record `{ productId, eventType: click\|view\|purchase }`        |
| GET    | `/api/admin`                    | Admin  | Admin session probe                                             |
| GET    | `/api/admin/dashboard`          | Admin  | Aggregate stats                                                 |
| GET    | `/api/admin/orders?limit=N`     | Admin  | All orders                                                      |
| POST   | `/api/admin/products`           | Admin  | Create product (JSON, `article_id` = Cloudinary public ID)      |
| DELETE | `/api/admin/products`           | Admin  | Delete product + Cloudinary asset                               |
| GET    | `/api/admin/users`              | Admin  | All users                                                       |

### 9.2 Data model summary

| Collection     | Key fields                                                                                                    | Indexes                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `users`        | `name`, `email` (unique), `password` (bcrypt, `select:false`), `role`, `emailVerified`                        | unique `email`                                                      |
| `products`     | `prod_name`, enum attributes, `detail_desc`, `price`, `article_id` (Cloudinary ID)                            | product type, appearance, colour group, colour value, master colour |
| `interactions` | `userId`, `productId`, `eventType`                                                                            | `{ userId, createdAt }`                                             |
| `carts`        | `userId`, `productId`, `quantity`                                                                             | unique `{ userId, productId }`, `{ userId, createdAt }`             |
| `orders`       | `userId`, `items[{ productId, quantity, priceAtPurchase }]`, `totalAmount`, `status: "paid"`, `paymentMethod` | `{ userId, createdAt }`                                             |

### 9.3 Glossary

| Term                  | Meaning                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| **TF-IDF**            | Term Frequency–Inverse Document Frequency; numeric weighting of words in a product description |
| **Cosine similarity** | Angle-based similarity between two vectors (0 = unrelated, 1 = identical)                      |
| **Cold start**        | A user with no interaction history, handled by popularity fallback                             |
| **CLIP**              | Contrastive Language–Image Pretraining; zero-shot image classification model                   |
| **q8**                | 8-bit quantized model weights (smaller/faster, slight accuracy trade-off)                      |
| **Public ID**         | Cloudinary's identifier for an uploaded asset; stored in `products.article_id`                 |
| **Interaction**       | A click, view, or purchase record that feeds the recommendation engine                         |
| **JWT session**       | Stateless session token carrying identity and role for 24 hours                                |

### 9.4 Document maintenance

Update this guide when routes, environment variables, admin capabilities, seed data, or test coverage change.
Re-run the [§7.2](#72-static-checks) checks and update the "Last verified" date at the top.
Dependency and prerequisite details live in [software_and_dependencies.md](./software_and_dependencies.md).
