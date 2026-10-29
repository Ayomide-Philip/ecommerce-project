# Software Requirements, Libraries, Configuration & Installation Resources

**Project:** ĒLAN Fashion Rec — AI-Based Personalized Recommendation System for Fashion E-Commerce
**Repository:** `Ayomide-Philip/ecommerce-project`
**Document owner:** Engineering
**Last verified:** 2026-10-29 (against `package-lock.json`, Node.js `v24.2.0`, npm `11.19.1`, Windows 10/11)

This document lists every runtime, library, configuration file, environment variable, local asset, and external
service the application needs in order to install, build, and run. Installation procedures and user-facing
instructions live in [documentation_and_user_guide.md](./documentation_and_user_guide.md).

---

## 1. Software Requirements

### 1.1 Required runtimes

| Software | Minimum version | Verified version | Why it is required |
| --- | --- | --- | --- |
| **Node.js** | **20.19.0** | `v24.2.0` | Next.js 16 declares `node >= 20.9.0`; Mongoose 9 declares `node >= 20.19.0`, which is the binding constraint. Node 22 LTS or 24 LTS are recommended. |
| **npm** | 10.x | `11.19.1` | Installs dependencies from [package-lock.json](./package-lock.json) (lockfile v3). `npm ci` is recommended for clean, reproducible installs. |
| **MongoDB server** | 6.0 (recommended) | local `mongod` on `127.0.0.1:27017` | Primary data store. A local community server or MongoDB Atlas cluster both work. The app connects to database `ecommerce-website`. |
| **Git** | 2.40+ | installed | Source control. |
| **Git LFS** | 3.x | `3.7.1` | The quantized CLIP model (`models/Xenova/clip-vit-base-patch32/onnx/model_quantized.onnx`, ~147 MB) is stored in Git LFS. A clone without LFS yields a pointer file and image classification will fail. |

> **Deployment runtime:** a persistent Node.js process is required (`next start` on a VM/container/PaaS such as
> Render or Railway). Serverless/edge hosting is **not** supported because the recommendation engine keeps a
> module-level in-memory TF-IDF cache (`libs/recommendation/engine.ts`) and the CLIP model is loaded once per
> process (`app/api/recommendations/classify/route.ts`). Cold starts would reload both.

### 1.2 Optional tooling (data pipeline and operations)

| Software | Version | Used by | Notes |
| --- | --- | --- | --- |
| **Python** | 3.13 | [data/download_images.py](./data/download_images.py) | Script hardcodes the Kaggle CLI path for Python 3.13 on Windows; update `KAGGLE_CMD` if your install differs. |
| **Kaggle CLI** | latest (`pip install kaggle`) | `data/*.py`, `data/*.sh` | Downloads product images from the *H&M Personalized Fashion Recommendations* competition. Requires Kaggle credentials **and** acceptance of the competition rules. |
| **Bash** | Git Bash, WSL, or Linux/macOS shell | `data/download_images.sh`, `data/download_products.sh`, `data/download_batches.sh`, `data/list_kaggle_images.sh` | Shell scripts use MSYS-style paths such as `/c/Users/...`. |
| **MongoDB Database Tools** | latest | `mongoimport`, `mongodump`, `mongorestore` | Used for seeding and backups (see the user guide). |
| **mongosh** | latest | optional | Manual data fixes (promoting an admin, pruning interactions). |
| **Hugging Face CLI** | latest (`pip install "huggingface_hub[cli]"`) | optional | Alternative way to (re)download the CLIP model. |

### 1.3 Operating system support

- **Windows 10/11** — primary development environment. Several data scripts contain absolute Windows paths
  (for example `KAGGLE_CMD` and `IMAGES_DIR`), which must be edited if the repository moves.
- **Linux / macOS** — supported for running the application (`npm run dev`, `npm run build`, `npm start`).
  The data scripts are not portable as written: `.sh` scripts use MSYS-style `/c/Users/...` paths, and the
  `.py`/`.mjs` scripts embed Windows absolute paths. Edit those constants before use off Windows.

### 1.4 Hardware requirements

| Resource | Minimum | Recommended | Notes |
| --- | --- | --- | --- |
| CPU | 2 cores | 4+ cores | CLIP inference is CPU-bound (`q8` quantized model). |
| RAM | 4 GB | 8 GB+ | Next.js build plus ONNX Runtime memory for CLIP inference. |
| Disk | ~4 GB free | 6 GB+ free | `node_modules` (~0.9 GB), `.next` build/cache (up to ~1.7 GB locally), 147 MB model, and optional image dataset. |
| Network | Required for first install and build | — | `npm install`, optional font fetch by `next/font/google`, Cloudinary uploads, and (if not pre-downloaded) model weights. |

### 1.5 External services and accounts

| Service | Purpose | Required configuration |
| --- | --- | --- |
| **MongoDB** (local or Atlas) | Persists users, products, carts, orders, interactions | `DATABASE_URL` |
| **Cloudinary** | Product image hosting; signed browser uploads; `CldImage` rendering | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, plus an upload preset named **`ecommerce-website`** (see [imageupload.tsx](./components/admin/product/new/imageupload.tsx)) |
| **Kaggle** | One-off dataset/image acquisition for seeding | Kaggle API token; competition rules accepted |
| **Hugging Face** | One-off download of `Xenova/clip-vit-base-patch32` | Optional account/token for rate limits |
| **Google Fonts** | Fraunces, Inter, IBM Plex Mono via `next/font/google` in [app/layout.tsx](./app/layout.tsx) | Build-time network access unless fonts are already cached |

---

## 2. Application Stack

| Layer | Technology | Version (manifest → lockfile) |
| --- | --- | --- |
| Framework | Next.js (App Router, Route Handlers) | `^16.2.12` → `16.2.12` |
| UI runtime | React / React DOM | `19.2.4` (pinned) |
| Language | TypeScript | `^5` |
| Styling | Tailwind CSS + `@tailwindcss/postcss` | `^4` → `4.3.3` |
| Auth | Auth.js / NextAuth (Credentials provider, JWT sessions, role claim) | `^5.0.0-beta.31` → `5.0.0-beta.32` |
| Database ODM | Mongoose | `^9.7.4` → `9.8.1` |
| Password hashing | bcrypt (native module, cost factor 10) | `^6.0.0` |
| Image AI | Transformers.js (`@huggingface/transformers`), CLIP ViT-B/32 `q8` | `^3.8.1` → `3.8.1` |
| Image hosting | Cloudinary SDK + `next-cloudinary` | `^2.10.0`, `^6.17.5` |
| Theming | `next-themes` | `^0.4.6` |
| Notifications | `sonner` | `^2.0.7` |
| Icons | `lucide-react`, `react-icons` | `^1.23.0`, `^5.7.0` |
| Recommendations | Hand-rolled TF-IDF + cosine similarity (no third-party dependency) | [libs/recommendation/](./libs/recommendation/) |

---

## 3. Dependency Inventory

### 3.1 Production dependencies (from [package.json](./package.json))

| Package | Declared | Purpose |
| --- | --- | --- |
| `next` | `^16.2.12` | App Router, server components, route handlers, image optimization. |
| `react`, `react-dom` | `19.2.4` | UI runtime. Pinned exact versions. |
| `mongoose` | `^9.7.4` | MongoDB schemas/models and aggregation pipelines. |
| `next-auth` | `^5.0.0-beta.31` | Credentials login, JWT session, `auth()` wrapper for route handlers, `role` claim. |
| `bcrypt` | `^6.0.0` | Password hashing (native addon — see §8.3). |
| `@huggingface/transformers` | `^3.8.1` | Runs CLIP zero-shot image classification locally through ONNX Runtime (WASM/CPU build). |
| `cloudinary` | `^2.10.0` | Server-side signing and asset deletion. |
| `next-cloudinary` | `^6.17.5` | `CldUploadWidget` for signed uploads and `CldImage` for delivery. |
| `next-themes` | `^0.4.6` | Dark/light theme provider. |
| `sonner` | `^2.0.7` | Toast notifications. |
| `lucide-react` | `^1.23.0` | Icon set. |
| `react-icons` | `^5.7.0` | Additional icons. |

### 3.2 Development dependencies

| Package | Declared | Purpose |
| --- | --- | --- |
| `typescript` | `^5` | Type checking (`npx tsc --noEmit`). |
| `@types/node`, `@types/react`, `@types/react-dom`, `@types/bcrypt` | `^20`, `^19`, `^19`, `^6` | Type definitions. |
| `tailwindcss` | `^4` | Utility CSS. |
| `@tailwindcss/postcss` | `^4` | Tailwind v4 PostCSS integration. |
| `eslint` | `^10.8.0` | Linting. |
| `eslint-config-next` | `^0.2.4` | ⚠️ **Wrong package** — see §8.1. This resolves to a third-party package (`mvila/eslint-config-next` 0.2.4), not the official Next.js config, so `npm run lint` currently fails. |

### 3.3 npm `overrides` (transitive dependency pinning)

Declared in [package.json](./package.json):

```json
"overrides": {
  "postcss": "^8.5.20",
  "sharp": "^0.35.0",
  "next": { "postcss": "^8.5.20", "sharp": "^0.35.0" },
  "@huggingface/transformers": { "sharp": "^0.35.0" }
}
```

- **`sharp`** is used by Next.js for image optimization and by Transformers.js for image decoding. The override
  guarantees a single modern native binary instead of several nested copies.
- **`postcss`** is pinned to a patched 8.5.x line shared by Tailwind and Next.

> When deploying to Linux, `sharp` installs a platform-specific prebuilt binary. Keep the lockfile platform
> agnostic by installing with `npm ci` on the target OS/architecture (do not copy `node_modules` between
> platforms).

---

## 4. Configuration Files

| File | Purpose | Key settings |
| --- | --- | --- |
| [package.json](./package.json) | Manifest, scripts, dependency ranges, npm overrides | `"type": "module"`; scripts `dev`, `build`, `start`, `lint`; **no `test` script** |
| [package-lock.json](./package-lock.json) | Exact resolved dependency tree | lockfile v3 |
| [tsconfig.json](./tsconfig.json) | TypeScript compiler options | `strict: true`, `target: ES2017`, `moduleResolution: bundler`, `jsx: react-jsx`, `noEmit: true`, `incremental: true`, path alias `@/* → ./*`, Next.js TS plugin; includes `libs/utility/script.js` |
| [next.config.ts](./next.config.ts) | Next.js configuration | Currently defaults (no custom images/domains). Remote Cloudinary images are rendered via `CldImage`, not `next/image`, so no `images.remotePatterns` entry is needed. |
| [postcss.config.mjs](./postcss.config.mjs) | PostCSS pipeline | Single plugin `@tailwindcss/postcss` |
| [tailwind.config.ts](./tailwind.config.ts) | Theme extension | Content globs `app/**` and `components/**`; colors `base #0B0B0D`, `panel #151519`, `accent #3D6BFF`, `cloud #F4F4F2`; font families bound to CSS variables; `borderRadius.glass = 1.25rem`. Loaded by Tailwind v4 through `@config "../tailwind.config.ts"` in [app/globals.css](./app/globals.css). |
| [eslint.config.mjs](./eslint.config.mjs) | Flat ESLint config | Imports `eslint-config-next/core-web-vitals` and `/typescript`; ignores `.next`, `out`, `build`, `next-env.d.ts` |
| [app/globals.css](./app/globals.css) | Tailwind entry + design tokens | `@import "tailwindcss"`, `@config` directive, `@theme inline` token mapping, dark-mode variables |
| [auth.ts](./auth.ts) | Auth.js initialization | Credentials provider, bcrypt compare, JWT strategy, 24-hour session, `role` on token/session, custom sign-in page `/login`, `trustHost: true`, `secret: BETTER_AUTH_SECRET`, sets `process.env.AUTH_URL = BASE_URL` |
| [libs/config/database.config.ts](./libs/config/database.config.ts) | Mongoose connection singleton | Reads `DATABASE_URL` (throws at import time if missing), `dbName: "ecommerce-website"`, `bufferCommands: false`, caches the connection on `globalThis` |
| [libs/config/config.ts](./libs/config/config.ts) | Environment accessor | Re-exports the six environment variables used by the app |
| [libs/config/encrypt.ts](./libs/config/encrypt.ts) | Password hashing helper | `bcrypt.genSalt(10)` + `bcrypt.hash` |
| [.gitignore](./.gitignore) | Ignored paths | `node_modules`, `.next`, `build`, `data/`, all `.env*`, `.idea` |
| [next-env.d.ts](./next-env.d.ts) | Next.js ambient types | Generated/managed by Next.js |
| `app/` directory | App Router route groups | `(admin)`, `(root)`, `api` |
| `models/Xenova/clip-vit-base-patch32/` | Local CLIP model (Git LFS) | Loaded via `env.localModelPath = "./models"` |
| [data/](./data/) | Kaggle dataset tooling and generated seed JSON | **Not tracked** (ignored) — see §7.2 |

### 4.1 Environment variables

The application reads exactly these variables (see [libs/config/config.ts](./libs/config/config.ts) and
[app/api/sign-cloudinary/route.ts](./app/api/sign-cloudinary/route.ts)):

| Variable | Required | Scope | Description | Example |
| --- | --- | --- | --- | --- |
| `DATABASE_URL` | **Yes** | Server | MongoDB connection string. Missing value throws `Please define the DATABASE_URL environment variable` on first DB access. | `mongodb://localhost:27017/` or `mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority` |
| `BETTER_AUTH_SECRET` | **Yes** | Server | Auth.js signing/encryption secret. Generate with `openssl rand -hex 32` or `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. | 64-char hex string |
| `BASE_URL` | Recommended | Server | Public base URL. Copied into `process.env.AUTH_URL` at startup. | `http://localhost:3000` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | **Yes** for images | Client + server | Cloudinary cloud name. Baked into the client bundle at build time. | `my-cloud` |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | **Yes** for uploads | Client + server | Cloudinary API key. Baked into the client bundle at build time. | `123456789012345` |
| `CLOUDINARY_API_SECRET` | **Yes** for uploads | Server only | Signs uploads and authenticates asset deletion. **Never expose to the client.** | 40-char secret |

Notes:

1. **File name:** Next.js loads `.env`, `.env.local`, `.env.development`, and `.env.production`. This repository
   uses [.env.local](./.env.local), which is git-ignored.
2. **Naming mismatch:** the root [README.md](./README.md) documents `AUTH_SECRET`, but the code requires
   `BETTER_AUTH_SECRET`. Use the code's name.
3. **No `.env.example` is committed.** Create one (placeholders only) before onboarding contributors. Never commit
   real secrets.
4. **`NEXT_PUBLIC_*` values are inlined at build time.** Changing the Cloudinary cloud name requires a rebuild,
   not just a restart.
5. **`BASE_URL` vs `AUTH_URL`:** [`auth.ts`](./auth.ts) assigns `process.env.AUTH_URL = BASE_URL` when `BASE_URL`
   is set. On platforms that inject `AUTH_URL`/`VERCEL_URL`, set `BASE_URL` explicitly to avoid redirect bugs.

---

## 5. Local AI Model Asset (CLIP)

| Property | Value |
| --- | --- |
| Model ID | `Xenova/clip-vit-base-patch32` |
| Task | Zero-shot image classification (product type, appearance, colour) |
| Quantization | `q8` (`dtype: "q8"`) |
| Location | `models/Xenova/clip-vit-base-patch32/` |
| Loading mode | `env.localModelPath = "./models"`, `env.allowRemoteModels = false` — **no runtime download** |
| Storage | Git LFS (`*.onnx` filter in `models/Xenova/clip-vit-base-patch32/.gitattributes`) |

Required files (all tracked):

| File | Size | Role |
| --- | --- | --- |
| `onnx/model_quantized.onnx` | ~146.6 MB | Vision + text encoder weights (`q8`) |
| `tokenizer.json` | ~2.1 MB | Tokenizer vocabulary/merges |
| `merges.txt` | ~0.5 MB | BPE merges |
| `tokenizer_config.json` | <1 KB | Tokenizer configuration |
| `preprocessor_config.json` | <1 KB | Image preprocessing (resize/crop/normalize) |
| `config.json` | <1 KB | Model architecture config |
| `README.md`, `.gitattributes` | — | Model card and LFS rules |

**Failure mode:** if the directory is missing or contains only LFS pointers, requests to
`POST /api/recommendations/classify` fail (the model cannot be loaded) while the rest of the app keeps working.
The production build does not need the model, so a build can succeed while classification is broken.

**Acquisition options:**

```powershell
# Option A — Git LFS (preferred; matches the committed layout)
git lfs install
git lfs pull

# Option B — Hugging Face CLI
pip install "huggingface_hub[cli]"
huggingface-cli download Xenova/clip-vit-base-patch32 --local-dir models/Xenova/clip-vit-base-patch32
```

Model card and license: <https://huggingface.co/Xenova/clip-vit-base-patch32>

---

## 6. Data Assets & Seed Inputs

| Asset | Path | Tracked? | Purpose |
| --- | --- | --- | --- |
| Sample products ready for import | `data/articles_sample_with_ids.json` | **No** (git-ignored) | 414 product documents in MongoDB Extended JSON (`{ "$oid": ... }`), generated by the data pipeline; ideal for seeding. |
| Full articles dataset | `data/articles.json` | No | ~240 MB H&M articles metadata (UTF-16LE) used by the pipeline. |
| Kaggle CSV extract | `data/kaggle_articles.csv` | No | ~34 MB source extract. |
| ID / mapping lists | `data/article_ids.txt`, `data/full_article_ids.txt`, `data/kaggle_image_ids.txt`, `data/valid_kaggle_ids.txt`, `data/kaggle_image_map.json`, `data/kaggle_files.txt` | No | Inputs/manifests for image download and matching. |
| Build/validation scripts | `data/build_products_from_images.mjs`, `data/match_kaggle_images.mjs`, `data/run_match.mjs`, `data/download_matched.mjs`, `data/check_*.{js,cjs,mjs}`, `data/validate_enums.cjs`, `data/check_prices.mjs` | No | Build seed JSON, validate enum values and prices against [product.enums.ts](./libs/enums/product.enums.ts). |
| Download scripts | `data/download_images.py`, `data/download_images.sh`, `data/download_products.sh`, `data/download_batches.sh`, `data/list_kaggle_images.sh` | No | Kaggle image acquisition. |
| Category thumbnails | [public/images/](./public/images/) (25 JPGs) | Yes | Landing/hero/category artwork (`dress.jpg`, `t-shirt.jpg`, …). |
| Product photos | [public/images/product_images/](./public/images/product_images/) (416 JPGs) | Yes | Local image pool corresponding to sample `article_id`s. |
| Product images at runtime | Cloudinary | External | The app renders `CldImage src={article_id}`; seeded `article_id` values are H&M IDs, so they resolve only after the matching images are uploaded to your Cloudinary cloud (or replaced with your own public IDs). |

> **Important:** because `data/` is git-ignored, a fresh clone has **no seed file**. Either obtain
> `articles_sample_with_ids.json` from the project owner, or regenerate it with the data pipeline
> (`node data/build_products_from_images.mjs`) after downloading images and the articles dataset.

**Kaggle prerequisites for the data scripts:**

```powershell
pip install kaggle
# Place kaggle.json in %USERPROFILE%\.kaggle\kaggle.json, or set KAGGLE_USERNAME / KAGGLE_KEY
```

Then accept the competition rules at
<https://www.kaggle.com/competitions/h-and-m-personalized-fashion-recommendations/rules>.

> ⚠️ **Security:** [data/download_images.py](./data/download_images.py) contains a hard-coded Kaggle API token
> and absolute paths. Rotate that token in Kaggle, move credentials to environment variables, and parameterize
> the paths before sharing the repository or its archive.

---

## 7. Installation Resources

### 7.1 Official documentation

| Resource | Link |
| --- | --- |
| Node.js downloads | <https://nodejs.org/en/download> |
| npm CLI documentation | <https://docs.npmjs.com/cli/v11> |
| Next.js 16 docs | <https://nextjs.org/docs> |
| Next.js App Router | <https://nextjs.org/docs/app> |
| Auth.js / NextAuth v5 | <https://authjs.dev/> |
| Mongoose 9 docs | <https://mongoosejs.com/docs/> |
| MongoDB Community Server | <https://www.mongodb.com/try/download/community> |
| MongoDB Atlas | <https://www.mongodb.com/atlas> |
| MongoDB Database Tools (`mongoimport`, `mongodump`) | <https://www.mongodb.com/try/download/database-tools> |
| mongosh | <https://www.mongodb.com/try/download/shell> |
| Cloudinary console | <https://cloudinary.com/console> |
| Cloudinary Node SDK | <https://cloudinary.com/documentation/node_integration> |
| next-cloudinary | <https://next.cloudinary.dev/> |
| Transformers.js | <https://huggingface.co/docs/transformers.js> |
| CLIP model card | <https://huggingface.co/Xenova/clip-vit-base-patch32> |
| Hugging Face CLI | <https://huggingface.co/docs/huggingface_hub/guides/cli> |
| Tailwind CSS v4 | <https://tailwindcss.com/docs> |
| bcrypt (node.bcrypt.js) | <https://github.com/kelektiv/node.bcrypt.js> |
| Kaggle API | <https://github.com/Kaggle/kaggle-api> |
| H&M competition dataset | <https://www.kaggle.com/competitions/h-and-m-personalized-fashion-recommendations> |
| Git LFS | <https://git-lfs.com/> |

### 7.2 Package installation commands

```powershell
# Reproducible install from the lockfile (recommended)
npm ci

# Or, to update within declared ranges
npm install
```

Scripts provided by [package.json](./package.json):

| Script | Command | Purpose |
| --- | --- | --- |
| `npm run dev` | `next dev` | Development server on <http://localhost:3000> (hot reload). |
| `npm run build` | `next build` | Production build; required before `npm start`. |
| `npm start` | `next start` | Serve the production build (persistent Node process). |
| `npm run lint` | `eslint` | Lint — currently fails at config load (§8.1). Use `npx eslint .` after fixing the config. |
| *(no script)* | `npx tsc --noEmit` | Type check (passes as of 2026-10-29). |

---

## 8. Known Dependency Issues & Compatibility Notes

### 8.1 `eslint-config-next` is the wrong package (blocking lint)

- `package.json` declares `"eslint-config-next": "^0.2.4"`, which resolves to the third-party package
  `mvila/eslint-config-next@0.2.4` (an old Babel-based config), **not** the official `eslint-config-next`
  maintained by Vercel.
- [eslint.config.mjs](./eslint.config.mjs) imports `eslint-config-next/core-web-vitals` and
  `eslint-config-next/typescript`, which do not exist in that package. Verified failure:

  ```text
  Error [ERR_MODULE_NOT_FOUND]: Cannot find module '...\node_modules\eslint-config-next\core-web-vitals'
  ```

- **Remediation (maintainers):** replace the dependency with the official config that matches the Next.js
  major version (for Next 16, `eslint-config-next@16`), align `eslint` to the version required by that package,
  reinstall, then run `npx eslint .`. Until then, treat type checking and the production build as the
  authoritative static checks.

### 8.2 NextAuth v5 beta

`next-auth` is pinned to a v5 beta (`5.0.0-beta.31`, resolved `5.0.0-beta.32`). API surface (e.g. `auth()`
wrapping route handlers, `NextAuthRequest`) can change between beta releases. Keep the lockfile and re-test
authenticated routes when upgrading.

### 8.3 Native module `bcrypt`

`bcrypt@6` is a native addon. Prebuilt binaries cover common platforms; otherwise a C++ toolchain is needed:

- **Windows:** Visual Studio Build Tools with "Desktop development with C++", plus Python 3.
- **Linux:** `build-essential` and `python3` if no prebuilt binary is available for the architecture.
- **Alpine/musl:** rebuild inside the container (`npm ci` during the image build).

### 8.4 `sharp` on deployment targets

`sharp` is pinned to `^0.35.0`. Install dependencies on the same OS/architecture/CPU as the runtime. Linux
deployments should use a glibc-based image unless a musl build is installed explicitly.

### 8.5 Node.js version drift

- Node < 20.9 fails `next` engine checks.
- Node < 20.19 fails `mongoose` engine checks and may break at runtime.
- Node 24 is verified locally; Node 22 LTS is the conservative production choice.

### 8.6 Tailwind v4 configuration

Tailwind v4 is CSS-first. The legacy JS config is honored **only** because [app/globals.css](./app/globals.css)
contains `@config "../tailwind.config.ts";`. Do not delete that line or the custom colors/fonts/radius vanish.

### 8.7 Google Fonts at build time

`next/font/google` (Fraunces, Inter, IBM Plex Mono) is resolved during `next build`. In offline CI, either
allow network access or switch to `next/font/local` with vendored font files.

---

## 9. Disk & Build Footprint (reference)

| Item | Approx. size |
| --- | --- |
| `node_modules` | ~0.9 GB measured on Windows (depends on platform binaries) |
| `.next` build + dev caches | ~0.2–1.7 GB measured locally (dev and production artifacts combined) |
| CLIP model (`q8` ONNX + tokenizer) | ~150 MB |
| `public/images` (thumbnails + 416 product photos) | tens of MB |
| Optional full dataset (`data/articles.json`) | ~240 MB |

---

## 10. Security-Relevant Configuration Checklist

- [ ] `BETTER_AUTH_SECRET` is a random 32-byte hex value, unique per environment, stored in a secrets manager.
- [ ] `CLOUDINARY_API_SECRET` is server-only (never prefixed with `NEXT_PUBLIC_`).
- [ ] `.env.local` and `data/` remain git-ignored; verify `git status` before committing.
- [ ] Rotate the Kaggle token currently hard-coded in `data/download_images.py`, and remove credentials from
      source before distributing archives.
- [ ] Cloudinary upload preset `ecommerce-website` is configured for signed uploads with the expected folder
      and format restrictions.
- [ ] MongoDB has authentication enabled and network access restricted (Atlas IP allowlist or firewall).
- [ ] Run `npm audit` and review transitive advisories before each release.
- [ ] Rotate Cloudinary and Auth secrets immediately if a `.env` file is ever exposed.

---

## 11. Version Verification Record

| Check | Command | Result (2026-10-29) |
| --- | --- | --- |
| Node | `node --version` | `v24.2.0` |
| npm | `npm --version` | `11.19.1` |
| Type check | `npx tsc --noEmit` | Passed (exit 0) |
| Production build | `npm run build` | Passed; all routes compiled successfully |
| Lint | `npm run lint` | **Failed** — `eslint-config-next` module resolution (§8.1) |
| MongoDB reachable | TCP probe `127.0.0.1:27017` | Open |
| Git LFS | `git lfs ls-files` | `model_quantized.onnx` tracked |

Re-run these checks after dependency upgrades and record the results in the table above.
