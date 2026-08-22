# OmniPOS — Login & Access Control Guide

## 1. Zero Demo Credentials Policy
The OmniPOS production user interface strictly forbids showing hardcoded demo credentials, quick-login buttons, or placeholder passwords on the login screen. All credentials must be issued and managed through authorized administrative workflows.

---

## 2. Super Admin Initial Bootstrap Procedure

The platform Super Admin account is initialized via server-side environment variables upon application launch:

```env
# .env (Never commit this file to public repositories)
SUPER_ADMIN_USERNAME=Anasasiq
SUPER_ADMIN_PASSWORD=<YourSecurePasswordHere>
```

### Bootstrap Workflow:
1. On server startup, the authentication engine reads `SUPER_ADMIN_USERNAME` and `SUPER_ADMIN_PASSWORD`.
2. The password is automatically hashed using HMAC SHA-256 with the server's `AUTH_SECRET` salt.
3. Only the resulting hash is retained in the database (`usersDB`).
4. The Super Admin signs in through the standard login modal using their username and password.

---

## 3. Store Admin Account Creation

A Store Admin (Tenant Owner) account is created exclusively by the SaaS Super Admin:
1. Super Admin navigates to **Superadmin → Store Tenants**.
2. Clicks **+ New Store Tenant**.
3. Enters Store Name, Business Vertical (Restaurant, Grocery, Electronics, etc.), Store Code, and Admin Credentials (Username, Temporary Password, Email, Phone).
4. Upon creation, the new Store Admin can log in and manage only their respective store.

---

## 4. Store Staff & User Creation

Store Admins can create and manage their store's internal team:
1. Store Admin navigates to **Staff & Roles** in the sidebar.
2. Clicks **+ Add Team Member**.
3. Selects role:
   * **Manager** (Floor & operational supervision)
   * **Accounts** (Financial management & ledger)
   * **KOT** (Kitchen ticketing desk)
   * **Waiter** (Dining room order taking)
   * **Chef** (Kitchen display KDS)
   * **Delivery Driver** (Logistics & dispatch)
   * **Staff / Cashier** (POS checkout)
4. Configures username, password, and active status.

---

## 5. Password Security & Hashing

* Passwords are never stored in plaintext.
* Password hashing algorithm: **HMAC SHA-256 with Server Salt** (`AUTH_SECRET`).
* Passwords are never returned in API payloads (`sanitizedUser` filters out `password_hash`).
* Account lock / toggle: Admins can instantly enable or disable any user account with a single switch.
