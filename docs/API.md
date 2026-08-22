# OmniPOS — REST API Reference Manual

All endpoints are prefixed with `/api`. Requests must pass JSON payloads and standard authorization headers.

---

## 1. System Health Endpoints

### `GET /health` & `GET /api/health`
Checks server health status and runtime environment.
* **Access:** Public
* **Response (200 OK):**
```json
{
  "status": "ok",
  "platform": "OmniPOS Multi-Tenant SaaS Engine",
  "environment": "production",
  "timestamp": "2026-08-22T08:20:00.000Z"
}
```

---

## 2. Authentication

### `POST /api/auth/login`
Authenticates a user and returns their session token.
* **Access:** Public
* **Request Body:**
```json
{
  "username": "kochi_admin",
  "password": "your_password"
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Welcome back, Suresh Menon!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr-admin-resto",
    "username": "kochi_admin",
    "name": "Suresh Menon (Store Owner)",
    "role": "admin",
    "tenantId": "tenant-resto-01",
    "businessVertical": "restaurant",
    "isActive": true
  }
}
```

### `GET /api/auth/me`
Retrieves identity profile for current active session.
* **Access:** Authenticated (`Bearer <token>`)

---

## 3. Super Admin Endpoints (`role: superadmin`)

### `GET /api/superadmin/tenants`
Lists all store tenants registered on the platform.

### `POST /api/superadmin/tenants`
Creates a new tenant and its root Store Owner account.
* **Request Body:**
```json
{
  "name": "Malabar Daily Fresh",
  "business_vertical": "grocery",
  "admin_name": "Faizal Rahman",
  "admin_username": "malabar_owner",
  "admin_password": "secure_password",
  "admin_email": "owner@malabarmart.in",
  "store_phone": "+91 94471 99887",
  "city": "Calicut, Kerala",
  "gst_number": "32XYZPQ9876M2K8",
  "plan": "Professional"
}
```

### `PATCH /api/superadmin/tenants/:id/status`
Toggles tenant active/disabled status.
* **Request Body:** `{ "is_active": false }`

### `PATCH /api/superadmin/tenants/:id/vertical`
Reassigns the store business vertical.
* **Request Body:** `{ "business_vertical": "restaurant" }`

### `DELETE /api/superadmin/tenants/:id`
Cascades delete to remove tenant and associated tenant users.

---

## 4. Tenant User Management (`roles: superadmin, admin`)

### `GET /api/tenant/users`
Lists all staff members belonging to the current tenant.

### `POST /api/tenant/users`
Creates a new staff member (Manager, Waiter, Chef, Cashier, etc.).
* **Request Body:**
```json
{
  "username": "anu_waiter",
  "name": "Anu V",
  "password": "staff_password",
  "role": "waiter",
  "email": "anu@store.com",
  "phone": "+91 98470 12345"
}
```

### `PATCH /api/tenant/users/:id/status`
Toggles a staff account between active and disabled.

### `DELETE /api/tenant/users/:id`
Removes a staff member account.
