# 🔥 FreightIQ — All-in-One Firebase & GCP Cloud Run Deployment Guide

YES! You can run **ALL 3 components** inside your Firebase / Google Cloud Platform (GCP) project so everything stays under one unified Firebase URL (100% 24/7 free tier)!

---

## 🏗️ Firebase & GCP Architecture

| Component | Port | Firebase / GCP Product | Deployment Command | Cost |
|---|---|---|---|---|
| **Vite Web Frontend** | 3000 | **Firebase Hosting** | `firebase deploy --only hosting` | **100% Free** |
| **NestJS API Gateway** | 4000 | **Firebase Functions (2nd Gen)** / **Cloud Run** | `firebase deploy --only functions` | **Free Tier** |
| **Python Decision Engine** | 8000 | **GCP Cloud Run** (Docker Container) | `gcloud run deploy decision-engine` | **2M Free Req/Mo** |

---

## Step 1: Deploy Python Decision Engine to GCP Cloud Run (Port 8000)

Firebase projects are automatically Google Cloud Platform (GCP) projects!

1. Install Google Cloud CLI (`gcloud`) or use Google Cloud Console.
2. Open terminal in `apps/decision-engine`:
```bash
# Build & deploy your Docker container to Cloud Run
gcloud run deploy freightiq-decision-engine \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 8000
```
3. GCP Cloud Run will output a live URL (e.g. `https://freightiq-decision-engine-xxx.a.run.app`).

---

## Step 2: Deploy NestJS API Backend to Firebase Cloud Functions / Cloud Run (Port 4000)

1. Set the Python Decision Engine URL in NestJS environment variables:
```bash
PYTHON_ENGINE_URL=https://freightiq-decision-engine-xxx.a.run.app
```
2. Deploy to Cloud Run / Firebase Functions:
```bash
gcloud run deploy freightiq-api \
  --source ./apps/api \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 4000 \
  --set-env-vars PYTHON_ENGINE_URL="https://freightiq-decision-engine-xxx.a.run.app"
```
3. Copy your API URL (e.g. `https://freightiq-api-xxx.a.run.app/api/v1`).

---

## Step 3: Deploy Vite Web App to Firebase Hosting (Port 3000)

1. Set the API URL in `apps/web/.env.production`:
```bash
VITE_API_BASE_URL=https://freightiq-api-xxx.a.run.app/api/v1
```
2. Build the web app and deploy to Firebase Hosting:
```bash
# Build the production bundle
pnpm --filter apps/web build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

Your Firebase Web App will be live at `https://<YOUR-FIREBASE-PROJECT-ID>.web.app` running 24/7 online!

---

## 🌟 Why Firebase + GCP Cloud Run Is Great
1. **Single Google Account**: All logs, authentication, database (Firestore), and hosting are under one dashboard.
2. **Auto-Scaling**: Scales down to 0 instances when idle (costing $0) and boots up instantly when judges open your link.
3. **Generous Free Tier**: 2 Million requests/month free on Cloud Run + 10 GB/month free on Firebase Hosting.
