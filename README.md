# বাজার দর (BazarDor)

**প্রয়োজনীয় পণ্যের দাম এক নজরে।**

BazarDor is a Bengali-first market-price browsing application for essential products in Bangladesh. It brings product prices, categories, and available market comparisons into one responsive interface, helping shoppers explore options and make more informed everyday purchasing decisions. Prices depend on the data source and are not guaranteed to be live or independently verified.

## Table of Contents

- [Key Features](#-key-features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation and Local Setup](#installation-and-local-setup)
- [Environment Variables](#-environment-variables)
- [API Integration](#-api-integration)
- [Routes and Navigation](#routes-and-navigation)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Design and Responsive Interface](#design-and-responsive-interface)
- [Deployment on Vercel](#deployment-on-vercel)
- [Security Notes](#security-notes)
- [Limitations and Data Accuracy](#limitations-and-data-accuracy)
- [Assignment Submission](#assignment-submission)

## ✨ Key Features

- **Product price browsing:** Explore product names, units, prices, and price-change indicators in the catalog.
- **Price movement overview:** Browse separate lists of products with rising and falling prices, plus a scrolling price ticker.
- **Categories and sorting:** Filter the catalog by category and sort prices from low to high or high to low.
- **Product and market comparisons:** Signed-in users can view a product’s price summary and market-level information when provided by the catalog data.
- **Accounts and profiles:** Register and sign in with email and password, view profile details, update a display name, and sign out.
- **Optional social sign-in:** Google and GitHub sign-in are available when their respective OAuth credentials are configured.
- **Bengali responsive UI:** Use the catalog and account pages on desktop, tablet, and mobile layouts.
- **Loading, empty, and not-found states:** See loading skeletons and helpful empty or not-found pages where applicable.

## Technologies

| Technology | Purpose |
|---|---|
| Next.js App Router | Provides application routing, server-rendered pages, API route handlers, and the production web server. |
| React | Builds the interactive pages and reusable interface components. |
| TypeScript | Adds static types to application code. |
| Tailwind CSS 4 and CSS | Provide utility classes and the shared responsive visual styling. |
| Better Auth | Handles email/password authentication and configured Google or GitHub social sign-in. |
| MongoDB Node.js Driver and Better Auth MongoDB adapter | Connect the authentication setup to MongoDB for persistent account data. |
| React Hot Toast | Displays brief success and error notifications. |
| Lucide React | Supplies interface icons. |
| BazarDor API | Provides the upstream product and category data used by the catalog when available. |
| Vercel | The project includes Next.js Vercel configuration and can be deployed there. |

## Prerequisites

- **Node.js 20.19 or newer** (the version range specified in `package.json`).
- **npm**, included with Node.js. The repository includes `package-lock.json`.
- **Git** to clone the repository.
- **MongoDB** for persistent, database-backed authentication. MongoDB Atlas or a supported local MongoDB server can be used.
- **Google and/or GitHub OAuth applications**, only if you want to use those optional social sign-in providers.

The public catalog can use its fallback data if the upstream API is unavailable. Configure MongoDB before relying on persistent authentication.

## Installation and Local Setup

Clone the repository and install its dependencies:

```bash
git clone https://github.com/faiyaz-10/BazarDor.git
cd BazarDor
npm install
```

Create the local environment file from the provided example.

**Windows PowerShell**

```powershell
Copy-Item .env.example .env.local
```

**macOS or Linux**

```bash
cp .env.example .env.local
```

Edit `.env.local` and replace placeholders with your own values. See [Environment Variables](#-environment-variables) for details. Then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Environment Variables

The names below match `.env.example` and the application source. Values shown are examples or placeholders only; never put real credentials in this README.

| Variable | Required? | Purpose |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Recommended | Application origin used by the browser auth client and Better Auth trusted origins. If omitted, the server uses `BETTER_AUTH_URL`, then `http://localhost:3000`. |
| `BETTER_AUTH_URL` | Recommended | Better Auth server base URL. If omitted, the server falls back to `NEXT_PUBLIC_APP_URL`, then `http://localhost:3000`. |
| `BETTER_AUTH_SECRET` | Required in production | Secret used by Better Auth. Production requires a unique, random value of at least 32 characters; development has a local-only fallback. |
| `MONGODB_URI` | Required for persistent MongoDB authentication | MongoDB connection string. Obtain it from Atlas under **Connect → Drivers**, or use the URI for your supported local MongoDB instance. |
| `MONGODB_DB` | Optional | Database name; defaults to `BazarDor` if omitted. |
| `MONGODB_DISABLE_TRANSACTIONS` | Optional | Set to `true` only for a standalone MongoDB server that does not support transactions. Leave it unset or set to `false` for MongoDB Atlas replica sets. |
| `GOOGLE_CLIENT_ID` | Optional; configure with its secret | OAuth client ID from your Google Cloud OAuth client. If either Google value is set, both are required. |
| `GOOGLE_CLIENT_SECRET` | Optional; configure with its ID | Secret for that Google OAuth client. If either Google value is set, both are required. |
| `GITHUB_CLIENT_ID` | Optional; configure with its secret | OAuth client ID from your GitHub OAuth App. If either GitHub value is set, both are required. |
| `GITHUB_CLIENT_SECRET` | Optional; configure with its ID | Secret for that GitHub OAuth App. If either GitHub value is set, both are required. |
| `BAZARDOR_API_BASE` | Optional | Absolute HTTP(S) base URL for upstream products and categories, without query parameters or a fragment. Defaults to `https://api.api-store.workers.dev/api/bazardor`. |

For a local setup, configure `.env.local` with the appropriate values, for example:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=REPLACE_WITH_A_LONG_RANDOM_SECRET
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
MONGODB_DB=BazarDor
MONGODB_DISABLE_TRANSACTIONS=false

# Optional: configure each provider only if you want to enable its sign-in button.
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Optional; this is the default upstream API base.
BAZARDOR_API_BASE=https://api.api-store.workers.dev/api/bazardor
```

### MongoDB setup

1. Create a MongoDB Atlas cluster, or prepare a supported local MongoDB server.
2. In Atlas, create a dedicated database user with only the permissions needed by this application.
3. In **Network Access**, allow the IP address or deployment network that needs to connect. Avoid broad public access when a narrower rule is possible.
4. Select **Connect → Drivers**, copy the connection string, and replace its username, password, and other placeholders. URL-encode special characters in credentials when required.
5. Put the URI in `MONGODB_URI` and set `MONGODB_DB` if you want a database name other than `BazarDor`.

The application uses Better Auth’s MongoDB adapter and creates/uses its auth collections as needed; it does not require a SQL migration. Without `MONGODB_URI`, MongoDB-backed persistent authentication is not configured.

### Generate an authentication secret

Generate a secure secret locally with Node.js, then copy the output into `.env.local`:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Do not share or commit the generated value.

### OAuth setup

Social providers are optional and are registered only when both the client ID and client secret for that provider are set. Create OAuth applications in the Google Cloud and/or GitHub developer settings, configure the Better Auth callback URL for your local or deployed domain (typically `/api/auth/callback/google` or `/api/auth/callback/github`), and store the credentials only in the environment. Recheck the provider dashboard’s exact callback requirements when configuring it.

## 🔌 API Integration

The application uses one configurable upstream API base: `BAZARDOR_API_BASE`. If it is unset, the code uses:

```text
https://api.api-store.workers.dev/api/bazardor
```

The catalog requests these upstream endpoints:

| Upstream request | Purpose |
|---|---|
| `GET {BAZARDOR_API_BASE}/products` | Retrieves the product list. |
| `GET {BAZARDOR_API_BASE}/products?category={slug}` | Retrieves products for a category. |
| `GET {BAZARDOR_API_BASE}/categories` | Retrieves the category list. |

The assignment also lists `https://openapi.programming-hero.com/api/bazardor` as a main API base and `https://api.abcz.workers.dev/api/bazardor` as another alternative. The application currently defaults to the `api.api-store.workers.dev` base shown above. You can point `BAZARDOR_API_BASE` at another compatible base, but the application does not try the listed sources in sequence.

The app unwraps supported list-shaped payloads and maps available product and category fields into its internal types. If a request fails, returns a non-success status, or cannot provide usable mapped data, the catalog uses local fallback data (or derives categories from the available products). It does **not** automatically cycle through the other assignment API URLs.

The application also exposes these same-origin Next.js API routes:

| Local request | Response purpose |
|---|---|
| `GET /api/catalog/products` | Returns `{ products, source }` for the catalog. |
| `GET /api/catalog/products?category=chal` | Returns a category-filtered `{ products, source }` result. |
| `GET /api/catalog/products/{slug}` | Returns `{ product }`, or a 404 when the product is unavailable. |
| `GET /api/catalog/categories` | Returns `{ categories }`. |
| `GET /api/catalog/categories/{slug}` | Returns `{ category, products }`, or a 404 when the category is unavailable. |

The app currently gets individual products from the fetched product list rather than calling an upstream `/products/{id}` endpoint. Its local category-detail route similarly builds on the upstream category and product-list requests.

Example local requests while the development server is running:

```bash
curl "http://localhost:3000/api/catalog/products"
curl "http://localhost:3000/api/catalog/products?category=chal"
curl "http://localhost:3000/api/catalog/products/miniket-chal"
curl "http://localhost:3000/api/catalog/categories"
curl "http://localhost:3000/api/catalog/categories/chal"
```

The local API responses are based on the app’s normalized catalog data and may contain fallback values when upstream data is unavailable. They should not be treated as verified market quotations.

## Routes and Navigation

| Route | Description | Access |
|---|---|---|
| `/` | Homepage with hero, price movement sections, ticker, and product catalog. | Public |
| `/category/[slug]` | Category product listing with price sorting. | Public |
| `/product/[slug]` | Product summary and market comparison details. | Requires sign-in; redirects to `/signin` and returns to the requested product after sign-in. |
| `/signin` | Email/password and configured social sign-in. | Public |
| `/signup` | Email/password account registration. | Public |
| `/profile` | Signed-in user information and profile-name update. | Requires a signed-in session. |
| `/profile/update` | Profile-name update form. | Requires a signed-in session. |
| `/api/auth/[...all]` | Better Auth API handler. | Auth endpoints |
| `/api/catalog/products` | Normalized products API, with optional `category` query parameter. | Public |
| `/api/catalog/products/[slug]` | Normalized single-product API. | Public |
| `/api/catalog/categories` | Normalized categories API. | Public |
| `/api/catalog/categories/[slug]` | Category and its products API. | Public |
| Not-found page | Bengali not-found page for unknown routes or products. | Public |

## Project Structure

```text
BazarDor/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/route.ts
│   │   └── catalog/
│   ├── category/[slug]/page.tsx
│   ├── product/[slug]/page.tsx
│   ├── profile/
│   ├── signin/page.tsx
│   ├── signup/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── assets/                 # Local visual assets
├── components/             # Shared UI and page components
├── lib/
│   ├── auth.ts             # Better Auth server configuration
│   ├── auth-client.ts      # Browser auth client
│   ├── catalog.ts          # Upstream API mapping and fallback data
│   ├── mongodb.ts          # MongoDB connection
│   ├── session.ts          # Server session helper
│   └── types.ts            # Catalog types
├── public/                 # Public static assets
├── .env.example            # Environment variable template
├── .gitignore
├── package.json
├── package-lock.json
├── next.config.ts
├── vercel.json
└── README.md
```

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve the production build. Run `npm run build` first. |
| `npm run lint` | Run ESLint across the project. |
| `npm run typecheck` | Run TypeScript checking without emitting files. |

## Design and Responsive Interface

The interface is Bengali-first and uses a pale sage page background, light bordered cards, and green accents for primary actions and selected categories. The homepage includes a scrolling price ticker, a hero section, and product cards with price-change indicators. Category, product-detail, sign-in, sign-up, and profile pages use shared styling, with responsive navigation, grids, and layouts for smaller screens.

## Deployment on Vercel

1. Push the repository to GitHub.
2. In Vercel, import the GitHub repository and use the detected Next.js framework.
3. Add the required production environment variables from [Environment Variables](#-environment-variables) under the Vercel project’s **Settings → Environment Variables**. `.env.local` is not uploaded automatically.
4. Confirm MongoDB Atlas network access permits connections from the deployment, and use a dedicated database user.
5. Set both `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to the deployed application origin. Keep `BETTER_AUTH_SECRET` strong and private.
6. If using Google or GitHub sign-in, configure the production callback URL for each provider and add its credentials to Vercel.
7. Redeploy after adding or changing environment variables.
8. Test the homepage, categories, product details, registration, sign-in, sign-out, and profile update on the deployed site.

Live website: `YOUR_VERCEL_DEPLOYMENT_URL`

## Security Notes

- Never commit `.env.local`, database credentials, OAuth secrets, or a real Better Auth secret.
- `.gitignore` excludes `.env`, `.env.local`, and `.env.*.local`; `.env.example` should contain placeholders only.
- Use a dedicated MongoDB database user and restrict network access to the necessary addresses.
- Configure production secrets through Vercel’s environment-variable settings, not in source files.
- Use a unique, securely generated `BETTER_AUTH_SECRET` in production; the source’s development fallback is not a production secret.

## Limitations and Data Accuracy

Prices and market information depend on the configured upstream API. When usable API data cannot be obtained, the application can display local illustrative fallback data. Fallback values are for demonstration and interface availability only; neither fallback nor upstream data is represented as guaranteed real-time, official, or independently verified market pricing.

## Assignment Submission

- **Project:** বাজার দর (BazarDor)
- **GitHub repository:** [https://github.com/faiyaz-10/BazarDor](https://github.com/faiyaz-10/BazarDor)
- **Live website:** `YOUR_VERCEL_DEPLOYMENT_URL` (replace after deployment)
