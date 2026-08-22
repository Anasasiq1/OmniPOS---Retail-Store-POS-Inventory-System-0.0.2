# OmniPOS — System Architecture & Design

## 1. High-Level Architectural Model

OmniPOS is designed as a high-performance, multi-tenant POS & Enterprise Resource Planning platform. It enforces strict separation between platform governance (Super Admin) and individual store operations (Store Tenants).

```
                 ┌────────────────────────────────┐
                 │       SaaS SUPER ADMIN         │
                 │   (Platform Management & Hub)   │
                 └──────────────┬─────────────────┘
                                │
        ┌───────────────────────┴────────────────────────┐
        ▼                                                ▼
┌───────────────────────────────┐        ┌───────────────────────────────┐
│     STORE TENANT A (Kochi)    │        │    STORE TENANT B (Calicut)   │
│   (Business: Restaurant)      │        │    (Business: Grocery Mart)   │
├───────────────────────────────┤        ├───────────────────────────────┤
│ • Store Admin (Owner)         │        │ • Store Admin (Owner)         │
│ • Manager (Floor Lead)        │        │ • Manager (Store Lead)        │
│ • Accounts (Bookkeeper)       │        │ • Accounts (Bookkeeper)       │
│ • Waiter (Table Order Take)   │        │ • Staff / Cashier (POS Desk)  │
│ • Chef (Kitchen Display KDS)  │        │ • Inventory Stock Clerk       │
│ • Delivery Driver (Dispatch)  │        │                               │
└───────────────────────────────┘        └───────────────────────────────┘
```

---

## 2. Component Layers

### A. Client Presentation Layer (React 19 + Tailwind CSS)
* **Framework:** React 19 single-page application bundled with Vite 6.
* **Component Modularity:** Dedicated directory modules under `/src/components/*` preventing monolith accumulation.
* **State Management:** Centralized `POSContext` handling global state, tenant caching, cart computations, audit logs, and hardware triggers.
* **Responsive Interfaces:** Optimized for Desktop POS screens, 10" dining room tablets (Waiter App), and Wall-mounted kitchen displays (Chef KDS).

### B. Application Server Layer (Node.js + Express 4.x)
* **Entry Point:** `/server.ts` binding to `0.0.0.0:3000`.
* **TypeScript Transpilation:** `tsx` for real-time development; `esbuild` for bundling into a production CommonJS single file (`dist/server.cjs`).
* **Vite Integration:** Mounts Vite middleware during development and static `dist/` fallback in production.
* **Security Interceptors:** Token verification (`verifyToken`), role-based authorization (`authorizeRoles`), and tenant boundary validation (`checkTenant`).

### C. Data & State Storage Layer
* **Tenant Isolation:** Every operational record (product, category, order, table, reservation, coupon, invoice) carries a compulsory `tenantId`.
* **State Persistence:** Local storage synchronization with automatic schema migrations.
* **Data Recovery:** Full JSON and ZIP backup export/import engine (`JSZip`).

---

## 3. Request Lifecycle

1. **Client Request:** Browser sends request to `/api/*` with `Authorization: Bearer <token>` or session identity headers.
2. **CORS & Body Parsing:** Express parses JSON body and validates CORS headers.
3. **Authentication Filter:** `verifyToken` inspects token, validates account status, and populates `req.user`.
4. **Tenant Verification:** `checkTenant` ensures non-superadmin users can only interact with entities matching `req.user.tenantId`.
5. **Role & Permission Check:** `authorizeRoles` ensures the active role has explicit permission to execute the action.
6. **Execution & Audit:** Handler executes the operation and records an audit log entry.
7. **Response:** Sanitized JSON payload returned without sensitive password hashes or system internals.
