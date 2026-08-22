# OmniPOS — Multi-Tenant Security & Isolation Architecture

## 1. Architectural Tenant Isolation

In OmniPOS, every store is treated as an isolated tenant. Under no circumstances may Store A view, update, delete, or list records belonging to Store B.

```
       Tenant A Client Request                  Tenant B Client Request
                  │                                        │
                  ▼                                        ▼
      [ verifyToken Middleware ]              [ verifyToken Middleware ]
        Attaches req.user.tenantId              Attaches req.user.tenantId
                  │                                        │
                  ▼                                        ▼
      [ checkTenant Middleware ]              [ checkTenant Middleware ]
   Enforces tenantId === 'tenant-A'        Enforces tenantId === 'tenant-B'
                  │                                        │
                  ▼                                        ▼
      ┌───────────────────────┐                ┌───────────────────────┐
      │  Tenant A Data Scope  │                │  Tenant B Data Scope  │
      │  (Products, Orders,   │                │  (Products, Orders,   │
      │   Customers, Tables)  │                │   Customers, Tables)  │
      └───────────────────────┘                └───────────────────────┘
```

---

## 2. Prevention of Cross-Tenant Vulnerabilities

### A. IDOR (Insecure Direct Object Reference) Protection
Even if an attacker manually modifies a request parameter to include another store's `tenantId` (e.g. `?tenantId=tenant-resto-99`), the `checkTenant` middleware overrides or rejects the request:
```typescript
if (req.user.role !== 'superadmin' && targetTenantId !== req.user.tenantId) {
  res.status(403).json({
    success: false,
    message: 'Cross-Tenant Access Denied: You cannot view or modify another store’s data',
  });
  return;
}
```

### B. Store Vertical Protection
Store Admins are prohibited from modifying their assigned business vertical (e.g., attempting to change from Grocery to Restaurant). Vertical modification is restricted exclusively to the Superadmin route `/api/superadmin/tenants/:id/vertical` through the `protectVertical` interceptor.

### C. Client State Scoping
In the React client, product catalogs, tables, orders, customers, and financial transactions are automatically scoped to the active user's `tenantId`.

---

## 3. Super Admin Audit Access Mode
When a Super Admin inspects a specific store for technical support or compliance auditing:
1. Every access switch is logged with action `TENANT_SWITCH` in the immutable audit ledger.
2. The audit trail captures the Super Admin's ID, username, target tenant ID, timestamp, and IP/environment metadata.
