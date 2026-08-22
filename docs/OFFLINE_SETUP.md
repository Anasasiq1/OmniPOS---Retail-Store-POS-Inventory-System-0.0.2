# OmniPOS — Offline Environment Setup Guide

For air-gapped workstations, POS terminals, and retail cash registers without an active internet connection.

---

## 1. Overview of Offline Strategy
In an offline retail or restaurant setting:
1. All client assets (JavaScript, CSS, fonts, SVG icons) are bundled locally.
2. The Express server serves all assets from local disk.
3. Optical barcode scanning and receipt printing execute entirely client-side.
4. Data is maintained in local indexed state and can be exported as `.zip` archive to a USB flash drive.

---

## 2. Preparing Offline Dependencies (On Online Machine)

### Method A: Full Portable Directory Bundle
On an internet-connected computer:
```bash
# 1. Clone and install all dependencies
git clone https://github.com/Anasasiq1/OmniPOS---Retail-Store-POS-Inventory-System-0.0.2.git omnipos-offline
cd omnipos-offline
npm install

# 2. Pre-build the application
npm run build

# 3. Create a compressed portable archive (including node_modules and dist/)
zip -r omnipos-offline-bundle.zip .
```

### Method B: Offline Tarball Packaging
```bash
# Package cached dependencies for offline installation
npm pack
```

---

## 3. Deployment on the Offline Machine

1. Transfer `omnipos-offline-bundle.zip` to the offline machine via USB flash drive.
2. Extract the archive into the target directory:
   ```bash
   unzip omnipos-offline-bundle.zip -d /opt/omnipos
   cd /opt/omnipos
   ```
3. Create your `.env` configuration:
   ```env
   PORT=3000
   SUPER_ADMIN_USERNAME=Anasasiq
   SUPER_ADMIN_PASSWORD=Anasasiq4302@
   ```
4. Start the application using the pre-compiled production server:
   ```bash
   node dist/server.cjs
   ```
5. Open your local browser to `http://localhost:3000` or configure your browser in kiosk mode.
