# FreightIQ Firestore Data Schema & Indexing Plan

This document specifies the Firestore document database structure and composite indexing strategy for **FreightIQ (Project `ibpsih`)**.

---

## 1. Top-Level Collections

Every document includes standard metadata fields: `id`, `createdAt`, `updatedAt`, and `orgId` (multi-tenant tenant key).

### `organizations`
- `id` (string): e.g. `'sail-org-id'`
- `name` (string): Organization name, e.g. `'Steel Authority of India Ltd (SAIL)'`
- `type` (string): `'CHARTERER' | 'SHIPOWNER' | 'PORT_AUTHORITY'`
- `country` (string): `'India'`

### `users`
- Doc ID mirrors Firebase Auth UID.
- `id` (string)
- `email` (string)
- `displayName` (string)
- `role` (string): `'ADMIN' | 'PROCUREMENT_MANAGER' | 'ANALYST' | 'VIEWER'`
- `orgId` (string)
- `organizationName` (string)
- `hasCompletedOnboarding` (boolean)

### `ports`
- `id` (string): e.g. `'port-paradip'`
- `name` (string): `'Paradip Port'`
- `code` (string): `'INPRT'`
- `type` (string): `'ORIGIN' | 'DESTINATION'`
- `state` (string)
- `maxDraftM` (number): Max water depth in meters (e.g. 14.5)
- `maxLoaM` (number): Max length overall in meters (e.g. 230)
- `berthCapacityTpd` (number): Daily discharge capacity in MT/day
- `orgId` (string)

### `vesselTypes`
- `id` (string): e.g. `'vt-panamax'`
- `name` (string): `'Panamax Carrier'`
- `code` (string): `'PANAMAX'`
- `minDwt` (number), `maxDwt` (number)
- `draftM` (number): Vessel draft requirement
- `lengthM` (number): Vessel LOA
- `orgId` (string)

### `procurementRequests`
Central cargo chartering plan document.
- `id` (string)
- `commodity` (string): Bulk cargo description
- `quantityMt` (number): Cargo tonnage
- `originPortId` (string), `originPortName` (string)
- `destinationPortId` (string), `destinationPortName` (string)
- `requiredDeliveryDate` (string): ISO date format
- `budgetInrCrore` (number): Budget allocation in ₹ Cr
- `status` (string): `'DRAFT' | 'ANALYZING' | 'OPTIMIZED' | 'CONTRACTED'`
- `latestRecommendation` (string): Denormalized 1-line summary
- `latestRiskScore` (number): Denormalized composite risk rating
- `orgId` (string)

#### Subcollection: `procurementRequests/{id}/optimizationRuns/{runId}`
Contains full historical execution reports of the 6-stage decision engine (ML forecast points, constraint solver output, contract strategy comparison, idle vessel repositioning, composite risk matrix, and Gemini AI synthesis).

---

## 2. Firestore Security Rules Summary

Rules are defined in [firestore.rules](file:///d:/metad/SIH/firestore.rules):
- **Default Deny**: All unauthenticated access is rejected (`request.auth != null`).
- **Multi-Tenant Scoping**: All reads and writes must match tenant claim (`resource.data.orgId == request.auth.token.orgId`).
- **Role Permissions**:
  - `ADMIN`: Full read/write access.
  - `PROCUREMENT_MANAGER`: Full read/write on `procurementRequests` & `cargo`.
  - `ANALYST`: Read access on all collections, write access to analytical annotations.
  - `VIEWER`: Read-only observer.

---

## 3. Composite Indexing Plan

Defined in [firestore.indexes.json](file:///d:/metad/SIH/firestore.indexes.json):
1. `procurementRequests`: `orgId` ASC + `createdAt` DESC
2. `freightRates`: `route` ASC + `rateDate` DESC
3. `auditLogs`: `orgId` ASC + `timestamp` DESC
