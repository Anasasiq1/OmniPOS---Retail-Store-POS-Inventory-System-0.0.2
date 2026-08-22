# OmniPOS — Retail Store POS & Inventory Management System

OmniPOS is an enterprise multi-tenant Point of Sale (POS), Kitchen Order Ticketing (KOT), Table Management, Customer Khata, and Inventory Management platform built for restaurants, supermarkets, electronics, and retail stores.

---

## Key Capabilities

* **Multi-Tenant SaaS Architecture:** Multi-store isolation with Super Admin governance and individual Store Admin controls.
* **Unified Business Verticals:** Configurable for **Restaurant**, **Grocery/Supermarket**, **Electronics**, and **Retail Shop** modules.
* **Restaurant Ecosystem:** Mobile-responsive **Waiter App**, wall-mounted **Chef KDS (Kitchen Display System)**, visual **Table Booking**, and **3-Step Bill Printing** (KOT → Pre-bill → Thermal Receipt).
* **Retail & Inventory Engine:** Optical barcode scanning, variant & addon matrices, batch/expiry alerts, low-stock notifications, and supplier purchase invoices.
* **Accounting & Customer Khata:** Digital ledger, customer credit recovery with direct WhatsApp reminders, expense tracking, and 13+ analytics reports.
* **Universal Payments:** Support for Cash, Card, UPI/QR, Customer Khata, Split Payments, and 11+ configured payment gateways.
* **Strict RBAC Security:** 8 distinct user roles (Super Admin, Admin, Manager, Accounts, KOT, Waiter, Chef, Staff) with server-side authorization.

---

## Technology Stack

* **Backend:** Node.js (v18–v22+), Express 4.21, `tsx`, `esbuild`
* **Frontend:** React 19, TypeScript 5.8, Vite 6, Tailwind CSS v4
* **Icons & Animation:** Lucide React, Motion (`motion/react`), `canvas-confetti`
* **Storage & Archives:** Local Storage cache, JSZip backup export/import

---

## Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/Anasasiq1/OmniPOS---Retail-Store-POS-Inventory-System-0.0.2.git
cd OmniPOS---Retail-Store-POS-Inventory-System-0.0.2

# 2. Configure environment
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```
Visit `http://localhost:3000` in your web browser.

---

## Production Build & Start

```bash
# Build the application (Vite frontend + esbuild server backend)
npm run build

# Start the production server
npm start
```

---

## Documentation Suite

* [Codebase Audit Report](docs/CODEBASE_AUDIT.md)
* [System Architecture](docs/ARCHITECTURE.md)
* [Local Setup Guide](docs/LOCAL_SETUP.md)
* [Offline Environment Setup](docs/OFFLINE_SETUP.md)
* [aaPanel Deployment Guide](docs/AAPANEL_DEPLOYMENT.md)
* [cPanel Deployment Guide](docs/CPANEL_DEPLOYMENT.md)
* [Login & Access Security](docs/LOGIN_AND_ACCESS.md)
* [Roles & Permissions (RBAC)](docs/ROLES_AND_PERMISSIONS.md)
* [Multi-Tenant Security](docs/MULTI_TENANT_SECURITY.md)
* [REST API Reference](docs/API.md)
* [Bug & Error Report](docs/BUG_AND_ERROR_REPORT.md)
* [Production Checklist](docs/PRODUCTION_CHECKLIST.md)

---

## License & Copyright

Copyright (c) 2026 OmniPOS SaaS. All rights reserved.
