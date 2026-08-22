# OmniPOS — Bug & Error Resolution Report

| Bug ID | Severity | Module / File | Root Cause | Resolution & Fix | Test Performed | Status |
| :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **BUG-001** | High | `/server/routes/api.routes.ts` | 401 response included plaintext hints exposing default superadmin password. | Removed all credential hints; unified standard 401 error message. | Auth API test | **RESOLVED** |
| **BUG-002** | High | `/server/routes/api.routes.ts` | Passwords stored and checked as plaintext strings in memory. | Implemented HMAC SHA-256 password hashing with `AUTH_SECRET` salt. | Password hashing check | **RESOLVED** |
| **BUG-003** | Medium | `/src/components/Coupons/CouponsManager.tsx` | Schema mismatch where `usageCount` and `startDate` / `endDate` were not mapped. | Mapped full coupon data contracts with type safety. | TypeScript type check | **RESOLVED** |
| **BUG-004** | Medium | `/src/components/Tables/TableManager.tsx` | Reservation form missed `reservationDate` property. | Added `reservationDate: resDate` mapping to reservation handler. | TypeScript compile | **RESOLVED** |
| **BUG-005** | Medium | `/src/context/POSContext.tsx` | Missing payment gateway toggle methods (`updatePaymentGateway`, `togglePaymentGateway`). | Implemented complete payment gateway management context handlers. | Gateway settings test | **RESOLVED** |
| **BUG-006** | Medium | `/server.ts` | Missing direct root `/health` route for load balancers. | Added `/health` and `/api/health` endpoints returning system metrics. | Endpoint verification | **RESOLVED** |
| **BUG-007** | Low | `/src/components/Dashboard/DashboardOverview.tsx` | Reference to undefined `setActiveReceiptOrder` identifier. | Replaced with unified `openPrintModal(order, 'receipt')` handler. | Lint & build | **RESOLVED** |
| **BUG-008** | Low | `/.env.example` | Missing environment documentation for Super Admin bootstrap and secrets. | Fully documented all configurable variables with placeholder values. | Env audit | **RESOLVED** |
