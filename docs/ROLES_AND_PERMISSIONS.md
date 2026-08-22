# OmniPOS — Roles & Permissions (RBAC) Matrix

OmniPOS implements strict, server-enforced Role-Based Access Control. Permissions are checked at both the route middleware level and the frontend navigational layer.

---

## 1. Role Definitions

| Role | Scope | Primary Function |
| :--- | :--- | :--- |
| **SUPER_ADMIN** | Global Platform | Full SaaS management, store provisioning, vertical assignments, domain routing, platform audit logs. |
| **ADMIN** | Store Tenant | Full authority over own store, staff management, catalog, finances, settings. |
| **MANAGER** | Store Tenant | Daily operations, inventory adjustments, order overrides, table status. |
| **ACCOUNTS** | Store Tenant | Expense records, income ledgers, supplier bills, customer Khata recovery. |
| **KOT** | Store Tenant | Kitchen order ticket management, print dispatch, station assignment. |
| **WAITER** | Store Tenant | Mobile table order taking, seat allocation, digital menu assistance. |
| **CHEF** | Store Tenant | Kitchen Display System (KDS), bumping cooking status to ready. |
| **STAFF** | Store Tenant | POS checkout, barcode scanning, thermal receipt printing. |

---

## 2. Module Permission Matrix

| Module / Action | SUPER_ADMIN | ADMIN | MANAGER | ACCOUNTS | WAITER | CHEF | STAFF |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **SaaS Tenants & Plans** |  | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Store Vertical Change** |  | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Domain Management** |  | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Staff & User Management**|  |  |  (View) | ❌ | ❌ | ❌ | ❌ |
| **POS & Checkout** |  |  |  | ❌ |  | ❌ |  |
| **Waiter App** |  |  |  | ❌ |  | ❌ | ❌ |
| **Chef KDS Display** |  |  |  | ❌ | ❌ |  | ❌ |
| **Tables & Floor Map** |  |  |  | ❌ |  | ❌ | ❌ |
| **Menu & Inventory CRUD**|  |  |  | ❌ | ❌ | ❌ | ❌ |
| **Purchases & Suppliers** |  |  |  |  | ❌ | ❌ | ❌ |
| **Customer Khata & Dues** |  |  |  |  | ❌ | ❌ |  (View) |
| **Tax & VAT Configuration**|  |  | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Payment Gateways** |  |  | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Financial Ledger** |  |  |  |  | ❌ | ❌ | ❌ |
| **Full Backup & Restore** |  |  | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 3. Server-Side Enforcement

Every protected Express route enforces RBAC via middleware:
```typescript
router.post(
  '/api/tenant/users',
  verifyToken,
  authorizeRoles('superadmin', 'admin'),
  checkTenant,
  handler
);
```
Attempts by unauthorized roles return HTTP 403 Forbidden with a clear security rejection payload.
