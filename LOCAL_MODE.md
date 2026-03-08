# Running Without Firebase (Local Mode)

If you can't set up a server or Firebase, the app will automatically work in **Local Mode** using your browser's localStorage.

## What Works in Local Mode

✅ Browse all 12 cafés
✅ Search and filter
✅ View café details
✅ Save favorites (stored locally)
✅ View sample bookings (demo data)
✅ View sample reviews (demo data)

## What Doesn't Work

❌ Real user accounts
❌ Sync across devices
❌ Real bookings (stored locally only)
❌ Real reviews (stored locally only)
❌ Google Sign-in

## Quick Fix

### Option 1: Use VS Code (Easiest)
1. Install VS Code: https://code.visualstudio.com/
2. Install "Live Server" extension
3. Right-click on `auth.html` → "Open with Live Server"

### Option 2: Use Python (If Installed)
1. Open Command Prompt in the cafe folder
2. Run: `python -m http.server 8080`
3. Open http://localhost:8080/auth.html

### Option 3: Use Node.js
1. Install Node.js: https://nodejs.org/
2. Open Command Prompt in the cafe folder
3. Run: `npx http-server -p 8080`
4. Open http://localhost:8080/auth.html

### Option 4: Just Open Directly (Local Mode)
Simply open `auth.html` or `index.html` directly in your browser. The app will work with local data only!

## Why This Happens

Firebase (and many modern web features) require the page to be served over HTTP/HTTPS, not directly from your file system. This is a security feature of browsers.

## Using Local Mode

When you open the files directly:
1. You'll see sample data for all cafés
2. You can still click around and explore
3. Any favorites/bookings you create are saved in your browser only
4. Refreshing the page will reset to default data

## Switching to Firebase Later

When you're ready to use Firebase:
1. Set up a local server (Options 1-3 above)
2. Follow the setup in SETUP_SUMMARY.md
3. The same code will connect to Firebase automatically!
