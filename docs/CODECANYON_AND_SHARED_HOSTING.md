# OmniPOS — CodeCanyon / Shared Hosting / File Manager Installation Guide

ഈ ഗൈഡ് cPanel File Manager, Shared Hosting, Apache/Nginx വെബ് സെർവറുകൾ, അല്ലെങ്കിൽ പരമ്പരാഗത CodeCanyon സ്ക്രിപ്റ്റുകൾ ഇൻസ്റ്റാൾ ചെയ്യുന്ന രീതിയിൽ OmniPOS പ്രവർത്തിപ്പിക്കാൻ സഹായിക്കുന്നു.

---

## ഓപ്ഷൻ 1: സ്റ്റാറ്റിക് സിംഗിൾ പേജ് ആപ്ലിക്കേഷൻ (SPA / File Manager Direct Upload)
നിങ്ങളുടെ ഹോസ്റ്റിംഗിൽ Node.js സപ്പോർട്ട് ഇല്ലെങ്കിലും, സാധാരണ PHP/Apache Shared Hosting വഴി OmniPOS ഫ്രണ്ട്-എൻഡ് പൂർണ്ണമായി പ്രവർത്തിപ്പിക്കാം.

### ഘട്ടം 1: പ്രൊഡക്ഷൻ ബിൽഡ് തയ്യാറാക്കുക
നിങ്ങളുടെ കമ്പ്യൂട്ടറിലോ ഡെവലപ്‌മെന്റ് മെഷീനിലോ താഴെ പറയുന്ന കമാൻഡ് റൺ ചെയ്യുക:
```bash
npm install
npm run build
```
ഇത് പ്രൊജക്റ്റിൽ `dist/` എന്നൊരു ഫോൾഡർ നിർമ്മിക്കും.

### ഘട്ടം 2: ഫയലുകൾ അപ്‌ലോഡ് ചെയ്യുക
1. cPanel അല്ലെങ്കിൽ ഹോസ്റ്റിംഗ് പാനൽ ലോഗിൻ ചെയ്ത് **File Manager** തുറക്കുക.
2. `public_html` (അല്ലെങ്കിൽ നിങ്ങളുടെ സബ്ഡൊമെയ്ൻ ഫോൾഡർ) തുറക്കുക.
3. `dist/` ഫോൾഡറിലുള്ള എല്ലാ ഫയലുകളും ഫോൾഡറുകളും (`index.html`, `assets/` മുതലായവ) `public_html`-ലേക്ക് അപ്‌ലോഡ് ചെയ്യുക.

### ഘട്ടം 3: Apache `.htaccess` കോൺഫിഗറേഷൻ (SPA Routing Fix)
റീഫ്രഷ് ചെയ്യുമ്പോൾ 404 Not Found എറർ വരാതിരിക്കാൻ `public_html` ഫോൾഡറിൽ ഒരു `.htaccess` ഫയൽ നിർമ്മിച്ച് താഴെ പറയുന്ന കോഡ് നൽകുക:

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

# Security Headers & Caching
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

### ഘട്ടം 4: Nginx സെർവർ കോൺഫിഗറേഷൻ (Nginx User ആണെങ്കിൽ)
നിങ്ങൾ Nginx സെർവറാണ് ഉപയോഗിക്കുന്നതെങ്കിൽ `nginx.conf`-ൽ താഴെ പറയുന്ന ബ്ലോക്ക് നൽകുക:
```nginx
location / {
    root /www/wwwroot/your-domain.com/public_html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
}
```

---

## ഓപ്ഷൻ 2: cPanel "Setup Node.js App" വഴി ഫുൾ-സ്റ്റാക്ക് ഇൻസ്റ്റാളേഷൻ

നിങ്ങളുടെ cPanel-ൽ Node.js സപ്പോർട്ട് ഉണ്ടെങ്കിൽ:

1. **cPanel → Setup Node.js App** തുറക്കുക.
2. **Create Application** ക്ലിക്ക് ചെയ്യുക:
   - **Node.js version**: `20.x` അല്ലെങ്കിൽ `18.x`
   - **Application mode**: `Production`
   - **Application root**: `omnipos`
   - **Application startup file**: `dist/server.cjs`
3. File Manager വഴി പ്രൊജക്റ്റ് ഫയലുകൾ അപ്‌ലോഡ് ചെയ്യുക.
4. cPanel Terminal തുറന്ന് ഡിപൻഡൻസികൾ ഇൻസ്റ്റാൾ ചെയ്ത് ബിൽഡ് ചെയ്യുക:
   ```bash
   npm install
   npm run build
   ```
5. Node.js App ഡാഷ്‌ബോർഡിൽ **Restart** ക്ലിക്ക് ചെയ്യുക.
