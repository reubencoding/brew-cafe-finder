# ☕ BREW - Chennai's Café Guide - Setup Complete!

## ✅ What's Been Created

A complete full-stack café discovery and booking web application with Firebase backend.

---

## 📁 File Structure

```
cafe/
├── HTML Pages
│   ├── index.html              # Main discovery page with search & filters
│   ├── auth.html               # Login/signup with Email/Google
│   ├── cafe-detail.html        # Individual café page with booking
│   ├── bookings.html           # My bookings page
│   ├── favorites.html          # Saved cafés page
│   ├── reviews.html            # Community reviews page
│   └── setup.html              # Firebase setup helper
│
├── JavaScript Files
│   ├── firebase-compat-config.js   # Firebase configuration (YOUR CONFIG)
│   ├── firebase-config.js          # Alternative ES module config
│   ├── app.js                      # Main app - café discovery
│   ├── auth.js                     # Authentication logic
│   ├── cafe-detail.js              # Café detail & booking
│   ├── bookings.js                 # Booking management
│   ├── favorites.js                # Favorites management
│   └── reviews.js                  # Reviews display
│
├── Styles
│   └── styles.css              # Complete responsive styles
│
└── Documentation
    ├── README.md               # Full documentation
    ├── DATA_STRUCTURE.md       # Firestore data model
    └── SETUP_SUMMARY.md        # This file
```

---

## 🔥 Firebase Configuration (Your Project)

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCCE5D-s4osZN9J7dhesbI5CGWkPxSi0Tw",
  authDomain: "cafe-5b867.firebaseapp.com",
  projectId: "cafe-5b867",
  storageBucket: "cafe-5b867.firebasestorage.app",
  messagingSenderId: "922765379923",
  appId: "1:922765379923:web:a1c362a9514eba941239a6",
  measurementId: "G-R7K624GCEH"
};
```

---

## 📊 Data Structure (As Requested)

### Collection: `cafes`

Document IDs: `cafe_001`, `cafe_002`, `cafe_003`, etc.

**Core Fields (Your Structure):**
```javascript
{
  name: "Amethyst Cafe",        // Café name
  location: "Royapettah",       // Area/neighborhood
  rating: 4.5,                  // Rating out of 5
  tables: 20                    // Number of tables
}
```

**Additional Display Fields:**
```javascript
{
  address: "Full address",
  reviews: 7953,
  price: "₹₹₹₹",
  hours: "10:00 AM – 10:30 PM",
  phone: "+91 44 4599 1633",
  tags: ["Serene", "Pet Friendly"],
  description: "Café description",
  emoji: "🌸",
  color: "#5C4033",
  menu: [{ name: "Coffee", price: "₹80" }],
  amenities: ["WiFi", "Garden"]
}
```

### Sample Cafés Included (12):
1. **cafe_001** - Amethyst Cafe (Royapettah) ⭐ 4.5
2. **cafe_002** - The Brew Room (Mylapore) ⭐ 4.4
3. **cafe_003** - Chamiers Café (Alwarpet) ⭐ 4.3
4. **cafe_004** - Café de Paris (Teynampet) ⭐ 4.1
5. **cafe_005** - Writer's Café (Gopalapuram) ⭐ 4.4
6. **cafe_006** - The Entrance Cafe (Kilpauk) ⭐ 4.2
7. **cafe_007** - The Bistrograph (Adyar) ⭐ 4.4
8. **cafe_008** - Tea Villa Cafe (T. Nagar) ⭐ 4.5
9. **cafe_009** - Beachville Coffee Roasters (Alwarpet) ⭐ 4.3
10. **cafe_010** - DOU (Alwarpet) ⭐ 4.4
11. **cafe_011** - GLOW CAFE (Nungambakkam) ⭐ 4.3
12. **cafe_012** - Soroco House (Anna Nagar) ⭐ 4.0

---

## 🚀 Quick Start

### Step 1: Open Setup Helper
Open `setup.html` in your browser to see your Firebase config pre-filled.

### Step 2: Enable Firebase Services
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **cafe-5b867**
3. **Authentication** → Get Started → Enable:
   - ✅ Email/Password
   - ✅ Google
4. **Firestore Database** → Create Database → Start in **test mode**

### Step 3: Run the App
Open any of these files in a browser:
- `auth.html` - Start here to sign in
- `index.html` - Browse cafés
- `setup.html` - Setup helper

**Recommended:** Use a local server:
```bash
# Python
python -m http.server 8080

# Node.js
npx http-server -p 8080

# Then open http://localhost:8080/auth.html
```

---

## ✨ Features Included

### User Features
- [x] Browse 12 Chennai cafés
- [x] Search by name, location, or tags
- [x] Filter by location (Mylapore, Alwarpet, etc.)
- [x] Sort by rating, reviews, price, name
- [x] View café details with tables count
- [x] Book a table (date, time, guests)
- [x] Write reviews with star ratings
- [x] Save favorites
- [x] View booking history

### Technical Features
- [x] Firebase Authentication (Email + Google)
- [x] Firestore Database with your data structure
- [x] Offline support with localStorage fallback
- [x] Responsive design (mobile, tablet, desktop)
- [x] Beautiful coffee-themed UI

---

## 🔐 Security Rules

Add these to Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cafes/{cafeId} {
      allow read: if true;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /favorites/{favoriteId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    match /bookings/{bookingId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 📱 Screenshots

The app features:
- Dark coffee-themed aesthetic ☕
- Gold/bronze accent colors (#C8853A)
- Glass-morphism cards
- Smooth animations
- Mobile-responsive layout

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| "Firebase not defined" | Use a local server, not file:// |
| "Permission denied" | Check Firestore security rules |
| Data not loading | Check internet connection & console |
| Can't sign in | Enable Auth providers in Firebase Console |

---

## 📦 Collections Created

1. **cafes** - Café data (cafe_001, cafe_002, ...)
2. **users** - User profiles
3. **users/{id}/favorites** - User's saved cafés
4. **bookings** - Table reservations
5. **reviews** - Café reviews

---

## 🎉 You're Ready!

Open `auth.html` to start exploring Chennai's cafés! ☕
