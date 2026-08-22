# OmniPOS — Local Computer Setup Guide

This guide describes running OmniPOS locally on Windows, macOS, or Linux.

---

## 1. Prerequisites

* **Node.js:** v18.0.0 or higher (v20+ Recommended)
* **Package Manager:** `npm` (bundled with Node.js), `pnpm`, or `bun` (if Bun runtime is installed).
* **Git:** Installed on local machine.

---

## 2. Step-by-Step Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/Anasasiq1/OmniPOS---Retail-Store-POS-Inventory-System-0.0.2.git
cd OmniPOS---Retail-Store-POS-Inventory-System-0.0.2
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` to set your desired Super Admin bootstrap credentials and application port:
```env
PORT=3000
AUTH_SECRET=local_super_secret_salt_2026
SUPER_ADMIN_USERNAME=Anasasiq
SUPER_ADMIN_PASSWORD=Anasasiq4302@
```

### Step 3: Install Dependencies
Using **npm**:
```bash
npm install
```
Or using **bun** (if installed):
```bash
bun install
```

### Step 4: Run Development Server
```bash
npm run dev
```
The server will boot on `http://localhost:3000`.

---

## 3. Production Build & Execution

To test the compiled production bundle locally:

```bash
# 1. Compile frontend with Vite and bundle backend with esbuild
npm run build

# 2. Launch production server
npm start
```
Open `http://localhost:3000` in your web browser.

---

## 4. Troubleshooting Common Issues

* **Port 3000 already in use:**
  Kill existing process or change `PORT=3001` in your `.env` file.
* **TypeScript lint check:**
  Run `npm run lint` (`tsc --noEmit`) to verify all TypeScript interfaces.
