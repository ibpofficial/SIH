# ⚡ Super Simple Vercel Deployment (Zero Complexity)

We have pre-configured `vercel.json` in your project repo! Deploying to Vercel takes **less than 60 seconds**.

---

## 🎯 Step-by-Step 1-Minute Vercel Deployment

1. Go to **[vercel.com](https://vercel.com)** (Sign in with your GitHub account).
2. Click **Add New...** → **Project**.
3. Select your GitHub repository (`SIH` / `FreightIQ`).
4. **Vercel will auto-detect everything** (Framework: `Vite`, Output: `apps/web/dist`).
5. Click **Deploy**!

That's it! Vercel will build your web app and give you a live production link (e.g., `https://freightiq.vercel.app`) that judges can open on any phone, laptop, or tablet worldwide!

---

## ⚙️ How It Works Under The Hood
- **Root `vercel.json`**: Pre-configured build command `pnpm --filter @freightiq/shared-types build && pnpm --filter freightiq-web build`.
- **Single Page Application Routing**: Configured `/index.html` rewrites so all route paths (Dashboard, Procurement, Data Ingestion, Audit Trail) work smoothly without 404 errors.
- **24/7 Availability**: Hosted on Vercel's global edge network for free!
