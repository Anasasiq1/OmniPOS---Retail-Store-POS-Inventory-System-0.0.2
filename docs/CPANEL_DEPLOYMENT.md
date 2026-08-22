# OmniPOS — cPanel Production Deployment Guide

Deploying OmniPOS on cPanel hosting with CloudLinux / Passenger Node.js Application Manager.

---

## 1. Prerequisites on cPanel

1. cPanel hosting with **Setup Node.js App** (CloudLinux / Phusion Passenger).
2. SSH access or cPanel Terminal / File Manager.
3. Node.js v18.x or v20.x supported by host.

---

## 2. Deployment Instructions

### Step 1: Create Application in cPanel
1. Log into cPanel → Scroll to **Software** → Click **Setup Node.js App**.
2. Click **Create Application**.
3. Fill in settings:
   * **Node.js version:** Select `20.x` or latest LTS.
   * **Application mode:** `Production`.
   * **Application root:** `omnipos` (or subfolder under `/home/username/`).
   * **Application URL:** Select your domain/subdomain (e.g. `pos.store.com`).
   * **Application startup file:** `dist/server.cjs`.
4. Click **Create**.

### Step 2: Upload Files & Configure Environment
1. In cPanel **File Manager**, upload project source to your application root directory (`/home/username/omnipos`).
2. Add Environment Variables inside cPanel Node.js App or in `.env`:
   * `PORT`: `3000`
   * `APP_ENV`: `production`
   * `SUPER_ADMIN_USERNAME`: `Anasasiq`
   * `SUPER_ADMIN_PASSWORD`: `YourSecurePassword`
   * `AUTH_SECRET`: `your_random_salt_2026`

### Step 3: Install & Compile Application
Open cPanel Terminal (or SSH):
```bash
# Enter virtual environment shown at the top of your Node.js App page:
source /home/username/nodevenv/omnipos/20/bin/activate && cd /home/username/omnipos

# Install production dependencies
npm install

# Compile Vite frontend and esbuild server backend
npm run build
```

### Step 4: Restart Application
In cPanel **Setup Node.js App**, click **Restart** to launch the compiled `dist/server.cjs` service.
Test by visiting `https://pos.store.com/health`.
