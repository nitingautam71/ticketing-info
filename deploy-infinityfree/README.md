# 🚀 Deployment Guide: Hosting on InfinityFree

InfinityFree is a popular, high-performance free hosting platform. However, because it is a shared Apache/PHP environment, it **does not support running persistent Node.js servers** (such as Express or PM2) directly. 

To bridge this gap, we have built a **fully compatible PHP Backend Bridge (`api.php`)** and an Apache routing file (`.htaccess`) for you. When you upload these alongside your compiled React static frontend, the app will run perfectly on InfinityFree!

---

## 📂 Deployment Package Overview

These files are located in `/deploy-infinityfree/` in your workspace:
1. **`api.php`**: The entire server-side router translated into standard PHP. It serves mock flights/hotels/tours/insurance data and handles profile and booking persistence (saving to `db.json` dynamically on your server).
2. **`config.php`**: Your server-side settings file. You can paste your **Gemini API Key** here to activate the real AI Travel Companion.
3. **`.htaccess`**: The Apache routing director. It performs two critical jobs:
   - Maps relative `/api/*` fetch requests from React directly to `api.php` with zero code modifications needed!
   - Prevents `404 Not Found` errors when you refresh your browser on custom sub-tabs.
4. **`db.json`**: Created automatically when you start making bookings or saving profile data.

---

## 🛠️ Step-by-Step Deployment Guide

### Step 1: Export Your Project
1. Open the **Settings Menu** in AI Studio (bottom left of your screen).
2. Click **Export to ZIP** to download the complete codebase to your computer.
3. Unzip the downloaded file on your computer.

### Step 2: Build the React SPA
1. Open a terminal in your project's root directory.
2. Run the installation and build commands to compile the frontend:
   ```bash
   npm install
   npm run build
   ```
3. This creates a directory called **`dist`** containing all of your static HTML, CSS, and JS.

### Step 3: Integrate the PHP Backend
1. Go into the folder `deploy-infinityfree` inside your project.
2. Copy these three files:
   - `.htaccess`
   - `api.php`
   - `config.php`
3. Paste them directly **inside** the generated **`dist`** folder (right next to `index.html` and the `assets` folder).

*(Optional)* Open `dist/config.php` in a text editor and enter your Gemini API Key:
```php
define('GEMINI_API_KEY', 'your-actual-gemini-key-goes-here');
```

### Step 4: Upload to InfinityFree
1. Log in to your **InfinityFree Client Area** and go to your Control Panel.
2. Open the **Online File Manager** (or connect via your favorite FTP client like FileZilla using the FTP details shown in the client area).
3. Open the **`htdocs`** folder.
4. Upload **everything inside your `dist` folder** directly into the `htdocs` folder. 
   *(Note: Upload the contents of the `dist` folder, not the `dist` folder itself. Your `index.html` and `.htaccess` must be at the very root of `htdocs`).*

---

## 🎉 That's It!
Your application is now live on your InfinityFree domain! 

- **Smooth Routing**: Refreshing tabs or visiting different pages works flawlessly because `.htaccess` points them to your app.
- **Durable Mock Data & Local Storage**: Bookings and user profile edits are saved securely on your server in a generated `db.json` file.
- **Secure AI Companion**: The AI Travel Assistant calls Gemini securely from your server so your API keys are never exposed to client browsers.
