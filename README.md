# FreightIQ

**FreightIQ** is an Intelligent Bulk Cargo Chartering & Procurement Decision Platform designed for Smart India Hackathon problem statement **SIH26006**. It empowers chartering desks, freight procurement managers, and maritime analysts to manage port/vessel registries, execute multi-stage data ingestion, manage cargo procurement plans, and audit decision workflows.

## Quick Start

### 1. Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose

### 2. Infrastructure & Environment Setup
```bash
# Clone and enter directory
cd SIH

# Start PostgreSQL database
docker compose up -d

# Copy environment variables
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

### 3. Install Dependencies & Seed Database
```bash
# Install all dependencies across workspace
pnpm install

# Run database migrations & seed initial dry-bulk data
pnpm db:migrate
pnpm db:seed
```

### 4. Run Development Servers
To run the full stack locally:
1. **Python Decision Engine** (Port 8000):
   ```bash
   cd apps/decision-engine
   pip install -r requirements.txt
   python main.py
   ```
2. **NestJS Backend API** (Port 4000):
   ```bash
   pnpm dev:api
   ```
3. **Web Frontend App** (Port 3000):
   ```bash
   pnpm dev:web
   ```

Alternatively, run `pnpm dev` to launch all workspaces in parallel.

- **Decision Engine Microservice**: `http://localhost:8000`
- **Backend API**: `http://localhost:4000/api/v1`
- **Frontend Application**: `http://localhost:3000`

## Architecture Overview

FreightIQ is structured as a pnpm monorepo:
- `apps/web`: React + TypeScript + Vite + Tailwind CSS frontend featuring an industrial maritime decision dashboard.
- `apps/api`: NestJS modular backend providing REST endpoints, Prisma DB persistence, RBAC, Data Ingestion, Audit logging, and Python Decision Engine integration.
- `apps/decision-engine`: Python FastAPI microservice providing XGBoost freight forecasting, port/vessel constraint solving, multi-strategy COA comparison, composite risk assessment, and idle vessel repositioning.
- `packages/shared-types`: Unified Zod schemas and TypeScript interfaces shared across all microservices and web client.

