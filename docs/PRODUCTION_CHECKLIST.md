# OmniPOS — Production Deployment Readiness Checklist

Run through this checklist before launching OmniPOS into live production environments.

---

- [x] **1. Security & Credentials**
  - [x] Zero demo credentials displayed on frontend login modal.
  - [x] Superadmin initial credentials loaded exclusively via server-side environment variables (`SUPER_ADMIN_USERNAME`, `SUPER_ADMIN_PASSWORD`).
  - [x] Password hashing enabled (HMAC SHA-256 with custom `AUTH_SECRET` salt).
  - [x] Passwords excluded from all API response payloads.
  - [x] `.env` excluded from source control (`.gitignore`).

- [x] **2. Multi-Tenant Isolation**
  - [x] Every query and store-level operation scoped to `tenantId`.
  - [x] `checkTenant` middleware prevents cross-tenant data access and IDOR attacks.
  - [x] Store business vertical protected against unauthorized modification.

- [x] **3. Role-Based Access Control (RBAC)**
  - [x] Server-side route authorization with `authorizeRoles`.
  - [x] Client-side sidebar navigation dynamically adapts to role permissions.

- [x] **4. Point of Sale & Kitchen Workflow**
  - [x] Optical barcode scanner operational.
  - [x] 3-step billing cycle (KOT → Pre-bill Check → Thermal Receipt).
  - [x] Live stock deduction on checkout and stock reversal on refund/cancellation.
  - [x] Waiter table ordering and Chef KDS kitchen display status updates.

- [x] **5. Infrastructure & Performance**
  - [x] Single port (`3000`) ingress routing compliant.
  - [x] `/health` and `/api/health` endpoints available for uptime monitors.
  - [x] CORS and JSON payload limit configured.
  - [x] Offline export/backup to `.zip` archive verified.

- [x] **6. Build Verification**
  - [x] TypeScript lint checks passing with zero errors (`npm run lint`).
  - [x] Production build bundle generated successfully (`npm run build`).
