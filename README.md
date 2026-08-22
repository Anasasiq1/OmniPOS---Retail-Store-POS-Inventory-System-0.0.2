# OmniPOS — Retail & Restaurant POS SaaS

ക്ലീൻ ആർക്കിടെക്ചറിൽ നിർമ്മിച്ച വിശ്വസനീയമായ എന്റർപ്രൈസ് റീട്ടെയിൽ & റെസ്റ്റോറന്റ് പോയിന്റ് ഓഫ് സെയിൽ (POS), KOT, ഇൻവെന്ററി മാനേജ്മെന്റ് സിസ്റ്റം.

---

## 🛠️ ആവശ്യമായ സാങ്കേതികവിദ്യകൾ (Prerequisites)

* **Node.js**: v18.x അല്ലെങ്കിൽ അതിനു മുകളിൽ (Recommended: v20 LTS)
* **Package Manager**: `pnpm` / `npm` / `yarn` / `bun`
* **സപ്പോർട്ട് ചെയ്യുന്ന പ്ലാറ്റ്‌ഫോമുകൾ**:
  * 🌐 **aaPanel** (Node.js Project Manager / PM2 / Nginx)
  * 📁 **cPanel** (Setup Node.js App അല്ലെങ്കിൽ File Manager SPA Upload)
  * 💻 **Local Computer** (Windows / macOS / Linux)
  * ⚡ **VPS / Dedicated Server** (Ubuntu / Debian / CentOS / Docker)
  * 🗂️ **CodeCanyon / Shared Hosting** (Apache `.htaccess` / Nginx `dist` export)
  * 📴 **Offline POS Terminals** (Air-gapped local machine setup)

---

## ⚙️ Environment Configuration (`.env`)

പ്രൊജക്റ്റ് റൂട്ട് ഫോൾഡറിൽ `.env` ഫയൽ ക്രിയേറ്റ് ചെയ്ത് താഴെ പറയുന്ന വിവരങ്ങൾ ക്രമീകരിക്കുക:

```env
# Application Settings
APP_NAME="OmniPOS"
APP_ENV="production"
APP_URL="http://hcp.hm-q.org:4302"

# Dynamic Port Selection (നിങ്ങൾക്ക് ഇഷ്ടമുള്ള പോർട്ട് നൽകാം)
PORT=4302

# Authentication & Security
AUTH_SECRET="your-256-bit-secret-key-here"
JWT_SECRET="your-jwt-secret-key-here"
JWT_EXPIRES_IN="7d"

# Super Admin Initial Bootstrap Credentials (ആദ്യ ലോഗിൻ)
SUPER_ADMIN_USERNAME="Anasasiq"
SUPER_ADMIN_PASSWORD="your_secure_password"

# CORS Configuration (ഏത് ഡൊമെയ്‌നും സ്വീകരിക്കാൻ)
CORS_ORIGIN="*"
```

---

## 🚀 1. Local Machine Setup (ഡെവലപ്‌മെന്റ് & ലോക്കൽ റൺ)

```bash
# 1. പ്രൊജക്റ്റ് ക്ലോൺ ചെയ്യുക
git clone https://github.com/Anasasiq1/OmniPOS---Retail-Store-POS-Inventory-System-0.0.2.git
cd OmniPOS---Retail-Store-POS-Inventory-System-0.0.2

# 2. എൻവയോൺമെന്റ് ഫയൽ കോപ്പി ചെയ്യുക
cp .env.example .env

# 3. ഡിപൻഡൻസികൾ ഇൻസ്റ്റാൾ ചെയ്യുക (npm അല്ലെങ്കിൽ pnpm)
npm install
# അല്ലെങ്കിൽ: pnpm install

# 4. ഡെവലപ്മെന്റ് സെർവർ റൺ ചെയ്യാൻ:
npm run dev

# 5. പ്രൊഡക്ഷൻ ബിൽഡ് ചെയ്ത് റൺ ചെയ്യാൻ:
npm run build
npm start
```
ബ്രൗസറിൽ `http://localhost:4302` (അല്ലെങ്കിൽ നിങ്ങൾ നൽകിയ പോർട്ട്) തുറക്കുക.

---

## 🌐 2. aaPanel Deployment Guide (വിശദമായ ഘട്ടങ്ങൾ)

1. **Project Upload**: പ്രൊജക്റ്റ് `/www/wwwroot/OmniPOS` എന്ന പാത്തിലേക്ക് അപ്‌ലോഡ് ചെയ്യുക.
2. **Environment File**: റൂട്ട് ഫോൾഡറിൽ `.env` ഫയൽ ഉണ്ടാക്കി ആവശ്യമായ പോർട്ടും ക്രെഡൻഷ്യലുകളും നൽകുക.
3. **aaPanel Node Project ചേർക്കുക**:
   * aaPanel തുറന്ന് **Website** → **Node project** → **Add Node Project** ക്ലിക്ക് ചെയ്യുക.
   * **Project Name**: `OmniPOS` (സ്പെഷ്യൽ കാരക്ടറുകൾ ഒഴിവാക്കുക).
   * **Run Path**: `/www/wwwroot/OmniPOS`
   * **Run Opt**: `dev` അല്ലെങ്കിൽ `dist/server.cjs` (പ്രൊഡക്ഷൻ ആണെങ്കിൽ `start`)
   * **Port**: `4302` (അല്ലെങ്കിൽ `.env`-ൽ നൽകിയ പോർട്ട്).
   * **Node Version**: Node v20.x അല്ലെങ്കിൽ v18+ തിരഞ്ഞെടുക്കുക.
   * **Package Manager**: `npm` അല്ലെങ്കിൽ `pnpm`
4. **Nginx Reverse Proxy & Domain Mapping**:
   * നിങ്ങളുടെ ഡൊമെയ്ൻ (ഉദാ: `hcp.hm-q.org`) മാപ്പ് ചെയ്യുക.
   * aaPanel സെർവർ പ്രോക്സി സ്വയം സെറ്റ് ചെയ്യും.
5. **SSL Certificate**: **SSL** ടാബിൽ നിന്ന് സൗജന്യ Let's Encrypt സർട്ടിഫിക്കറ്റ് ആക്റ്റീവ് ചെയ്ത് **Force HTTPS** ഓൺ ചെയ്യുക.

---

## 💼 3. cPanel Deployment Guide

### രീതി A: cPanel "Setup Node.js App" (ഫുൾ-സ്റ്റാക്ക്)
1. cPanel ലോഗിൻ ചെയ്ത് **Setup Node.js App** എടുക്കുക.
2. **Create Application** ക്ലിക്ക് ചെയ്യുക.
3. **Node.js version**: `20.x` തിരഞ്ഞെടുക്കുക.
4. **Application root**: `omnipos` നൽകുക.
5. **Application startup file**: `dist/server.cjs` നൽകുക.
6. ഫയലുകൾ അപ്‌ലോഡ് ചെയ്ത് Terminal വഴി `npm install && npm run build` റൺ ചെയ്യുക.
7. ഡാഷ്‌ബോർഡിൽ **Restart** ക്ലിക്ക് ചെയ്യുക.

---

## 🗂️ 4. CodeCanyon / Shared Hosting / File Manager Upload (PHP & Apache)

Node.js സെർവർ ഇല്ലാത്ത സാധാരണ ഷെയർഡ് ഹോസ്റ്റിംഗുകളിലോ cPanel File Manager വഴിയോ ഇത് ഇൻസ്റ്റാൾ ചെയ്യാം:

1. നിങ്ങളുടെ കമ്പ്യൂട്ടറിൽ വെച്ച് ബിൽഡ് ചെയ്യുക:
   ```bash
   npm run build
   ```
2. പ്രൊജക്റ്റിലെ `dist/` ഫോൾഡറിലുള്ള എല്ലാ ഫയലുകളും സിപ്പ് ചെയ്ത് ഹോസ്റ്റിംഗിലെ `public_html`-ലേക്ക് അപ്‌ലോഡ് ചെയ്ത് Extract ചെയ്യുക.
3. `public_html` ഫോൾഡറിൽ താഴെ കാണുന്ന `.htaccess` ഫയൽ നിർമ്മിക്കുക:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```
ഇതോടെ ആപ്പ് ഒരു റെഗുലർ വെബ്‌സൈറ്റ് പോലെ ഏതൊരു ഷെയർഡ് സെർവറിലും പ്രവർത്തിക്കും!

---

## 🔌 5. Port & Dynamic Domain Support (`vite.config.ts`)

ഏത് പോർട്ടിലും ഏത് കസ്റ്റം ഡൊമെയ്നിലും (ഉദാ: `hcp.hm-q.org`) എററുകളില്ലാതെ ആപ്പ് പ്രവർത്തിക്കാൻ `vite.config.ts` ക്രമീകരിച്ചിരിക്കുന്നു:

```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const PORT = parseInt(env.PORT || process.env.PORT || '4302', 10);

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: true,        // എല്ലാ IP-കളിൽ നിന്നും ഡൊമെയ്നുകളിൽ നിന്നും കണക്റ്റ് ചെയ്യാം
      port: PORT,        // .env-ൽ നിന്നുള്ള ഡൈനാമിക് പോർട്ട്
      strictPort: false,
      allowedHosts: true // Blocked Host എറർ വരാതിരിക്കാൻ
    },
  };
});
```

---

## 📴 6. Offline / POS Terminal Kiosk Setup

ഇന്റർനെറ്റ് ലഭ്യമല്ലാത്ത ക്യാഷ് കൗണ്ടറുകളിൽ റൺ ചെയ്യാൻ:
1. ഇന്റർനെറ്റ് ഉള്ള സിസ്റ്റത്തിൽ `npm install && npm run build` റൺ ചെയ്യുക.
2. പ്രൊജക്റ്റ് ഫോൾഡർ USB പെൻഡ്രൈവ് വഴി ഓഫ്‌ലൈൻ കമ്പ്യൂട്ടറിലേക്ക് മാറ്റുക.
3. ഓഫ്‌ലൈൻ സിസ്റ്റത്തിൽ `node dist/server.cjs` റൺ ചെയ്യുക.
4. ബ്രൗസറിൽ `http://localhost:4302` ഓപ്പൺ ചെയ്ത് Kiosk Mode-ൽ ഉപയോഗിക്കുക.

---

## 🔒 സുരക്ഷാ മുൻകരുതലുകൾ (Security Rules)

1. **`.env` ഫയൽ ഒരിക്കലും ഗിറ്റ്ഹബ്ബിലേക്ക് പുഷ് ചെയ്യരുത്** (`.gitignore`-ൽ നൽകിയിട്ടുണ്ടെന്ന് ഉറപ്പാക്കുക).
2. പ്രൊഡക്ഷനിലേക്ക് മാറ്റുമ്പോൾ `SUPER_ADMIN_PASSWORD` നിങ്ങളുടെ സ്വന്തം ശക്തമായ രഹസ്യവാക്ക് നൽകി മാറ്റുക.
3. ആപ്പിലെ ബാക്കപ്പുകൾ ഡൗൺലോഡ് ചെയ്ത് സുരക്ഷിതമായി സൂക്ഷിക്കാൻ **Settings → Backup & Restore** ടൂൾ ഉപയോഗിക്കുക.

---

## 📚 കൂടുതൽ ഡോക്യുമെന്റേഷനുകൾ (Detailed Guides)

* [Codebase Forensic Audit](docs/CODEBASE_AUDIT.md)
* [System Architecture & RBAC](docs/ARCHITECTURE.md)
* [aaPanel Deployment Full Details](docs/AAPANEL_DEPLOYMENT.md)
* [cPanel Deployment Guide](docs/CPANEL_DEPLOYMENT.md)
* [CodeCanyon & Shared Hosting Guide](docs/CODECANYON_AND_SHARED_HOSTING.md)
* [Offline Setup Guide](docs/OFFLINE_SETUP.md)
* [REST API Documentation](docs/API.md)
* [Roles & Permissions (RBAC Matrix)](docs/ROLES_AND_PERMISSIONS.md)
* [Production Checklist](docs/PRODUCTION_CHECKLIST.md)

---

## 📄 ലൈസൻസ് (License)

Copyright (c) 2026 OmniPOS SaaS. All rights reserved.
