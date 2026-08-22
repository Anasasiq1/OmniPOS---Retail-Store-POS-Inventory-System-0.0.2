# OmniPOS — Forensic Codebase Audit Report

**Date:** August 2026  
**Repository:** `Anasasiq1/OmniPOS---Retail-Store-POS-Inventory-System-0.0.2`  
**Branch:** `main`  
**Application:** OmniPOS — Enterprise Retail & Restaurant Multi-Tenant POS SaaS  

---

## A. Current Architecture
OmniPOS operates as a full-stack, multi-tenant SaaS architecture combining an **Express 4.x TypeScript backend** with a **React 19 + Vite + Tailwind CSS** frontend. The backend handles REST API requests, tenant isolation, RBAC role-checking middleware, and serve-static/Vite middleware for single-port (`3000`) container environments. The frontend provides a responsive single-page application with modular managers, live state synchronization, optical scanning, and tenant isolation.

## B. Technology Stack
* **Runtime & Package Management:** Node.js (v18–v22+), TypeScript 5.8, Bun (`bun.lock` provided for Bun runtimes, `package.json` for npm/yarn/pnpm).
* **Backend Server:** Express 4.21, `tsx` for direct TypeScript development execution, `esbuild` for single-bundle CommonJS (`dist/server.cjs`) production compilation.
* **Frontend Framework:** React 19, React-DOM 19, Vite 6.2.
* **Styling & Icons:** Tailwind CSS v4, `@tailwindcss/vite`, Lucide React.
* **Animations & Interactivity:** Motion (`motion/react`), `canvas-confetti`.
* **Data Processing & Utilities:** JSZip (for offline JSON/ZIP database export and backup archives).

## C. Application Entry Points
* **Development Server Entry:** `/server.ts` running via `npm run dev` (`tsx server.ts`).
* **Client Frontend Entry:** `/index.html` → `/src/main.tsx` → `/src/App.tsx`.
* **State & Persistence Core:** `/src/context/POSContext.tsx`.
* **API Routing Hub:** `/server/routes/api.routes.ts`.

## D. Frontend Architecture
* Modular component tree partitioned under `/src/components/`:
  * `Auth/`: Account Authentication modal (zero demo credentials/hints).
  * `Dashboard/`: Real-time KPI cards, sales trends, quick actions.
  * `POS/`: Fast barcode scanning, variant selector, addons, 3-step billing.
  * `WaiterApp/`: Mobile-first dining room order taking with table assignment.
  * `ChefApp/`: Real-time Kitchen Display System (KDS) with bump status.
  * `Tables/`: Visual floor map, table status, reservation management.
  * `Orders/`: Filterable master order book, delivery status, refunds.
  * `Inventory/`: Products, barcode generator, categories, batch/expiry alerts.
  * `Purchases/`: Inward stock tracking, supplier invoices, payment records.
  * `Parties/`: Customer Khata ledgers and Supplier directories.
  * `DueList/`: Credit collection dashboard with WhatsApp reminder generator.
  * `PaymentGateways/`: 11+ payment gateways (Stripe, PayPal, Razorpay, bKash, etc.).
  * `Subscriptions/`: SaaS subscription tiers, tenant limit enforcement.
  * `Superadmin/`: Master tenant controls, domain manager, vertical switches.
  * `VatSettings/`: Dynamic tax rules, inclusive/exclusive toggle, service charges.

## E. Backend Architecture
* Express application bound to `0.0.0.0:3000`.
* `/api` router providing authentication, tenant CRUD, user management, and health checks.
* Middleware stack:
  * `verifyToken`: Validates Bearer tokens and attaches authenticated user identity.
  * `authorizeRoles`: Restricts endpoints by role hierarchy.
  * `checkTenant`: Enforces tenant-level data isolation.
  * `protectVertical`: Prevents unauthorized modification of store business verticals.

## F. Authentication Architecture
* Secure credential verification with salt-based HMAC SHA-256 hashing.
* Superadmin account bootstrapped from environment variables (`SUPER_ADMIN_USERNAME`, `SUPER_ADMIN_PASSWORD`).
* No plain passwords stored or returned in API responses.
* Zero demo credentials displayed on frontend login screens.

## G. Database / Storage Architecture
* **In-Memory Seed Store:** Backend state initialized with default tenants and users.
* **Client Persistence Engine:** Local storage caching with automatic migration and JSON/ZIP backup archive utilities.
* **Durable Export / Restore:** Full backup generation creating compressed `.zip` containing all tenant entities.

## H. API Architecture
* Fully RESTful API mounted on `/api/*`.
* Standardized JSON response envelope: `{ success: boolean, message?: string, data?: any }`.
* Health endpoints `/health` and `/api/health` providing platform status without leaking system secrets.

## I. Current Role System
Strict Multi-Tier Role-Based Access Control (RBAC):
1. `SUPER_ADMIN`: Master SaaS provider with platform-wide authority.
2. `ADMIN`: Store Owner with full control over their tenant store.
3. `MANAGER`: Operational floor manager.
4. `ACCOUNTS`: Financial ledger, expense, and Khata manager.
5. `KOT`: Kitchen Order Ticket station operator.
6. `WAITER`: Dining room and table order agent.
7. `CHEF`: Food preparation and kitchen bump station operator.
8. `STAFF`: Cashier and order clerk.

## J. Current Store / Tenant System
* Complete isolation per `tenantId`.
* Business Verticals supported: `restaurant`, `grocery`, `electronics`, `shop`.
* Dedicated custom domain and subdomain routing management.

## K. Current POS Functionality
* Real-time optical barcode scanning.
* Dynamic variants, modifiers, and addon selections.
* 3-step billing cycle (Table KOT → Pre-bill Check → Thermal Receipt).
* Multi-payment support: Cash, Card, UPI/QR, Customer Khata Credit, Split tender, and 11+ gateways.
* Real-time inventory deduction and refund inventory reversals.

## L. Current Inventory Functionality
* SKU & EAN-13 Barcode generator.
* Low stock alerts and expiry date tracking.
* Cost price vs Selling price profit margin calculations.
* Stock adjustment logs with audit trail.

## M. Current Reporting Functionality
* 13+ analytics reports: Sales summary, Daily ledger, Top products, Tax/VAT report, Khata dues, Inventory valuation, Cash flow.

## N. Broken / Conflicting Functionality (Identified & Resolved)
* *Found:* Plaintext password hints in API 401 error messages.  
  *Fix:* Removed all credential hints; unified standard 401 response; stored passwords as HMAC SHA-256 hashes.
* *Found:* Missing context methods (`updatePaymentGateway`, `togglePaymentGateway`, `restoreFromZip`).  
  *Fix:* Fully implemented and connected in `POSContext.tsx`.
* *Found:* Unmapped data fields in `Coupon`, `TableReservation`, and `SupplierParty`.  
  *Fix:* Aligned schema fields across all interfaces.

## O. Missing Functionality (Implemented)
* Standard `/health` root endpoint.
* Secure environment-based Superadmin bootstrap.
* Clean, non-demo login interface with real authentication flow.

## P. Security Issues (Addressed)
* Hardcoded credentials in source removed; replaced with environment variables.
* Strict tenant isolation checks enforced in backend routes.
* API responses sanitized to never return password hashes.

## Q. Deployment Capabilities
* **Local Computer:** Node.js (v18+) with npm, pnpm, or bun.
* **aaPanel:** Compatible with Node.js Manager, PM2, and Nginx reverse proxy.
* **cPanel:** Compatible with Setup Node.js App via Passenger and `dist/server.cjs`.
* **Offline Environments:** Full offline fallback and dependency archive support.

## R. Dependency Status
* All dependencies verified against `package.json`.
* Zero missing imports; TypeScript build passes cleanly with 0 errors.

## S. Build Status
* `npm run lint` (`tsc --noEmit`): **PASSED (0 errors)**.
* `npm run build` (`vite build && esbuild server.ts`): **PASSED**.

---
*Report certified by OmniPOS Engineering.*
