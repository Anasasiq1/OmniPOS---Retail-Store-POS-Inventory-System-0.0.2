# OmniPOS — aaPanel Production Deployment Guide

This guide covers deploying OmniPOS on a Linux server running aaPanel with Node.js Project Manager, PM2, Nginx reverse proxy, and SSL.

---

## 1. Prerequisites on aaPanel

1. **aaPanel Web Panel** installed on your VPS/Dedicated Server.
2. **App Store Plugins:**
   * **Nginx** (v1.22+ or OpenResty)
   * **Node.js Version Manager** (Node.js v20 LTS recommended)
   * **PM2 Manager** (or built-in Node Project Manager)

---

## 2. Server Deployment Steps

### Step 1: Upload Source Code
1. Open aaPanel → **Files** → Navigate to `/www/wwwroot/`.
2. Create directory `/www/wwwroot/omnipos`.
3. Upload project files (via Git clone, FTP, or ZIP upload).

### Step 2: Configure Environment
1. In `/www/wwwroot/omnipos/`, create `.env`:
```env
APP_NAME=OmniPOS
APP_ENV=production
APP_URL=https://your-pos-domain.com
PORT=3000

AUTH_SECRET=your_production_secure_salt_key_here
SUPER_ADMIN_USERNAME=Anasasiq
SUPER_ADMIN_PASSWORD=YourSecureSuperadminPassword
```

### Step 3: Install Dependencies & Build
Open the aaPanel Web Terminal in `/www/wwwroot/omnipos`:
```bash
# 1. Install dependencies
npm install

# 2. Build frontend and backend production bundle
npm run build
```

### Step 4: Configure Node Project in aaPanel
1. Navigate to **Website** → **Node project** → **Add Node Project**.
2. Set configuration:
   * **Project Name:** `omnipos`
   * **Run Path:** `/www/wwwroot/omnipos`
   * **Startup File:** `dist/server.cjs` (or Run Command: `node dist/server.cjs`)
   * **Port:** `3000`
   * **Node Version:** Node v20.x
3. Click **Submit** to start the PM2 service.

### Step 5: Configure Domain, Nginx Reverse Proxy & SSL
1. In the project settings, map your domain (e.g. `pos.yourdomain.com`).
2. aaPanel automatically configures the Nginx reverse proxy:
```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```
3. Go to **SSL** tab → Request Free **Let's Encrypt** SSL Certificate and enable **Force HTTPS**.
