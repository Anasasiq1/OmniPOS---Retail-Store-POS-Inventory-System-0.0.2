# OmniPOS SaaS – Authentication, Access Control & Setup Guide

## 1. System Access Architecture (Role-Based Access Control)

OmniPOS is built on a hardened Multi-Tenant SaaS foundation with 5 primary tiers of user roles:

| Role | Scope | Key Capabilities |
| :--- | :--- | :--- |
| **Super Admin** | SaaS Platform Wide | Manages all tenants, custom domains, store admins, system-wide API keys, and global audit logs. |
| **Store Admin** | Tenant / Store Level | Full control of tenant store inventory, purchasing, accounting, staff users, tables, and Khata ledger. |
| **Store Manager** | Store Level | Operational control over POS terminal, inventory adjustments, purchase entries, and customer Khata entries. |
| **Cashier** | Store Level | POS billing, split payments, cash tendering, order processing, and table assignment. |
| **Staff / Waiter** | Store Level | Dine-in order taking, KOT transmission, and table status viewing. |

---

## 2. Initial Setup Credentials (Development / Demo Environment)

> **Important Security Directive:** 
> Login credentials are intentionally kept out of the client-side login forms. Users must enter valid credentials manually into the login form.

| Role | Username | Tenant / Store | Default Password |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin` | Platform Wide Controller | `superadmin@123` |
| **Store Admin (Restaurant)** | `kiran_admin` | Malabar Spice Restaurant | `kiran@123` |
| **Store Admin (Grocery)** | `faizal_admin` | FreshMart Supermarket | `faizal@123` |
| **Store Admin (Retail)** | `priya_admin` | ElectroHub Digital Store | `priya@123` |
| **Store Manager** | `suresh_mgr` | Malabar Spice Restaurant | `manager@123` |
| **Cashier** | `anita_cashier` | Malabar Spice Restaurant | `cashier@123` |
| **Kitchen / Waiter Staff** | `rohit_staff` | Malabar Spice Restaurant | `staff@123` |

---

## 3. Account Status Rules
* **Active**: User can log in and perform actions according to their role permissions.
* **Disabled**: User login is blocked with an account disabled notification.
* **Suspended**: Access temporarily revoked by Super Admin or Tenant Admin.
