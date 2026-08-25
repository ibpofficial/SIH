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
```bash
# Starts both Backend API (port 4000) and Frontend Web App (port 3000)
pnpm dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend API**: `http://localhost:4000/api/v1`

## Architecture Overview

FreightIQ is structured as a pnpm monorepo:
- `apps/web`: React + TypeScript + Vite + Tailwind CSS frontend featuring a Bloomberg/Palantir-inspired maritime industrial dark theme.
- `apps/api`: NestJS modular backend providing REST endpoints, Argon2 JWT authentication, RBAC, 3-stage Data Ingestion validation engine, and Audit logging.
- `packages/shared-types`: Unified Zod schemas and TypeScript interfaces shared between frontend and backend.
