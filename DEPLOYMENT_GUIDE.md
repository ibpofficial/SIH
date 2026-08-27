# 🚀 FreightIQ — 100% FREE 24/7 Cloud Deployment Guide

This guide explains how to deploy all 3 servers (**Python Decision Engine on port 8000**, **NestJS API on port 4000**, and **Vite Web Frontend on port 3000**) so FreightIQ stays online **24/7 even when your PC is turned off**!

---

## 🌐 Architecture Overview

```
Judges / Users Browser
        ↓
[1] Vite React Web App (Vercel / Render / Firebase Hosting - 100% Free)
        ↓ Calls https://freightiq-api.onrender.com/api/v1
[2] NestJS API Gateway (Render / Railway / Koyeb Free Tier)
        ↓ Calls https://freightiq-decision-engine.onrender.com
[3] Python Decision Engine (Render / Koyeb / GCP Cloud Run Free Tier)
```

---

## Step 1: Deploy Python Decision Engine (Port 8000) for FREE

### Option A: Render (Recommended - Free Web Service)
1. Sign up at [render.com](https://render.com) (Free account).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Set settings:
   - **Name**: `freightiq-decision-engine`
   - **Root Directory**: `apps/decision-engine`
   - **Environment**: `Docker` (Render will automatically pick up your `Dockerfile`!)
   - **Instance Type**: `Free`
5. Click **Create Web Service**.
6. Render will build and deploy it. Copy your live URL (e.g. `https://freightiq-decision-engine.onrender.com`).

---

## Step 2: Deploy NestJS API Gateway (Port 4000) for FREE

### Option A: Render (Free Web Service)
1. On [render.com](https://render.com), click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Set settings:
   - **Name**: `freightiq-api`
   - **Root Directory**: `apps/api`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start:prod`
4. Add **Environment Variables**:
   - `PYTHON_ENGINE_URL` = `https://freightiq-decision-engine.onrender.com`
   - `CORS_ORIGIN` = `https://freightiq.vercel.app`
5. Click **Create Web Service**. Copy your live API URL (e.g. `https://freightiq-api.onrender.com/api/v1`).

---

## Step 3: Deploy Vite Web Frontend (Port 3000) for FREE

### Option A: Vercel (Recommended - Instant Free Deployment)
1. Sign up at [vercel.com](https://vercel.com) (Free Hobby plan).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository.
4. Set settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `apps/web`
5. Add **Environment Variable**:
   - `VITE_API_BASE_URL` = `https://freightiq-api.onrender.com/api/v1`
6. Click **Deploy**.

Vercel will build your frontend and give you a live production link (e.g. `https://freightiq.vercel.app`) that judges can open from **any phone, laptop, or tablet worldwide** without needing your PC on!

---

## 🔒 Summary Checklist for Production

| Component | Local Port | Free Hosting Provider | Environment Variable to Set |
|---|---|---|---|
| **Python Decision Engine** | 8000 | Render / Koyeb (Docker) | `PORT=8000` |
| **NestJS API Gateway** | 4000 | Render / Railway | `PYTHON_ENGINE_URL=https://...` |
| **Vite Web Frontend** | 3000 | Vercel / Netlify | `VITE_API_BASE_URL=https://.../api/v1` |
