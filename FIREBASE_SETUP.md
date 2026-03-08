# Firebase Configuration Updated ☕

## What Changed

Your app now uses **Firebase ONLY for user authentication** (credentials). Cafe data is stored **locally**.

### Firebase Stores:
- ✅ User accounts (email/password, Google sign-in)
- ✅ User profiles (name, email, photo)
- ✅ User favorites (cafe IDs only, not full cafe data)
- ✅ User bookings
- ✅ User reviews

### Local Data (NOT in Firebase):
- ✅ Cafe information (names, ratings, locations, etc.)
- ✅ Cafe menus
- ✅ Cafe amenities
- ✅ All cafe details

## Files Updated

1. **app.js** - Removed Firestore calls for cafes, now loads from local sample data
2. **cafe-detail.js** - Loads cafe details from localStorage instead of Firestore
3. **favorites.js** - Gets cafe details from localStorage
4. **reviews.js** - Gets cafe filter options from localStorage

## What You Need in Firebase Console

Only set up these in your Firebase project:

### 1. Authentication (Required)
- Go to: https://console.firebase.google.com/project/cafe-5b867/authentication
- Click "Get started"
- Enable "Email/Password" provider
- Enable "Google" provider
- Add your domain to Authorized Domains:
  - `localhost`
  - `127.0.0.1`

### 2. Firestore Database (Optional - for user data only)
- Go to: https://console.firebase.google.com/project/cafe-5b867/firestore
- Click "Create database"
- Choose "Start in test mode"
- Set rules to allow read/write:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // Change for production
    }
  }
}
```

### ❌ DON'T Create:
- `cafes` collection - cafes are stored locally
- `reviews` collection in Firestore (currently uses Firestore, can be changed)
- Any cafe-related data in Firebase

## Testing

1. Start your local server:
```bash
start-server.bat
```

2. Open: http://localhost:8080/auth.html

3. Sign up with email/password or Google

4. Browse cafes - they load from local data

## Console Check

Open browser console (F12) and type:
```javascript
// Check if Firebase is initialized
firebase.apps.length  // Should return 1

// Check current user
firebase.auth().currentUser  // Should show user object when logged in
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Permission denied" | Update Firestore rules to allow read/write |
| "Firebase not initialized" | Make sure you're running via localhost, not file:// |
| Cafes not loading | Clear localStorage and refresh |
| Can't sign in | Check Firebase Auth is enabled in console |

---

Your cafe data is now completely local - no need to upload cafes to Firebase! ☕
