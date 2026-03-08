# Firestore Data Structure Reference

## Collection: `cafes`

Each document represents a café with a custom ID format: `cafe_001`, `cafe_002`, etc.

### Document Fields:

```javascript
{
  // Required Core Fields (your structure)
  name: "Amethyst Cafe",        // String: Cafe name
  location: "Royapettah",       // String: Area/neighborhood
  rating: 4.5,                  // Number: Rating out of 5
  tables: 20,                   // Number: Number of tables available

  // Additional Display Fields (for the app)
  address: "Amethyst, Whites Rd, Royapettah",  // String: Full address
  reviews: 7953,                // Number: Total review count
  price: "₹₹₹₹",               // String: Price range
  hours: "10:00 AM – 10:30 PM", // String: Operating hours
  phone: "+91 44 4599 1633",   // String: Contact number
  tags: ["Serene", "Pet Friendly", "Al Fresco"],  // Array: Tags
  description: "The best cafe...",  // String: Description
  emoji: "🌸",                  // String: Display emoji
  color: "#5C4033",            // String: Theme color
  menu: [                       // Array: Menu items
    { name: "Filter Coffee", price: "₹80" },
    { name: "Club Sandwich", price: "₹240" }
  ],
  amenities: ["WiFi", "Garden", "Pet Friendly"],  // Array: Amenities

  // Metadata
  createdAt: timestamp          // Timestamp: When added
}
```

---

## Collection: `users`

Each document represents a user with their Firebase Auth UID as the document ID.

### Document Fields:

```javascript
{
  name: "John Doe",            // String: Display name
  email: "john@example.com",   // String: Email
  photoURL: "...",             // String: Profile photo (optional)
  createdAt: timestamp         // Timestamp: When account created
}
```

### Subcollection: `users/{userId}/favorites`

Each document represents a favorite café.

```javascript
{
  cafeId: "cafe_001",          // String: Reference to cafe
  cafeName: "Amethyst Cafe",   // String: Cached name
  addedAt: timestamp           // Timestamp: When favorited
}
```

---

## Collection: `bookings`

Each document represents a table booking with an auto-generated ID.

### Document Fields:

```javascript
{
  userId: "abc123",            // String: User who made booking
  userName: "John Doe",        // String: User display name
  cafeId: "cafe_001",          // String: Cafe booked
  cafeName: "Amethyst Cafe",   // String: Cafe name
  cafeEmoji: "🌸",            // String: Cafe emoji
  cafeColor: "#5C4033",       // String: Cafe color

  date: "2024-01-15",         // String: Booking date (YYYY-MM-DD)
  time: "19:00",              // String: Booking time (HH:MM)
  guests: 2,                  // Number: Number of guests
  notes: "Birthday celebration", // String: Special requests

  status: "confirmed",        // String: confirmed/pending/cancelled/completed
  createdAt: timestamp         // Timestamp: When booked
}
```

---

## Collection: `reviews`

Each document represents a cafe review with an auto-generated ID.

### Document Fields:

```javascript
{
  userId: "abc123",            // String: User who wrote review
  userName: "John Doe",        // String: User display name
  userPhoto: "...",            // String: User photo (optional)

  cafeId: "cafe_001",          // String: Cafe being reviewed
  cafeName: "Amethyst Cafe",   // String: Cafe name

  rating: 5,                  // Number: 1-5 stars
  text: "Amazing place!",      // String: Review text

  createdAt: timestamp         // Timestamp: When posted
}
```

---

## Example: Creating a Cafe Document

```javascript
// In Firebase Console > Firestore Database
// Collection: cafes
// Document ID: cafe_013 (custom ID)

{
  name: "My New Cafe",
  location: "T Nagar",
  rating: 4.2,
  tables: 15,
  address: "123 Main Road, T Nagar",
  reviews: 0,
  price: "₹₹",
  hours: "9:00 AM – 10:00 PM",
  phone: "+91 98765 43210",
  tags: ["Coffee", "Quiet", "Work Friendly"],
  description: "A peaceful spot for coffee and work",
  emoji: "☕",
  color: "#6B3A2A",
  menu: [
    { name: "Espresso", price: "₹80" },
    { name: "Cappuccino", price: "₹120" }
  ],
  amenities: ["WiFi", "Power Outlets", "Quiet"]
}
```

---

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cafes - public read, admin write
    match /cafes/{cafeId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // User data - users can only read/write their own
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Favorites subcollection
      match /favorites/{favoriteId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // Bookings - authenticated users
    match /bookings/{bookingId} {
      allow read: if request.auth != null &&
        (request.auth.uid == resource.data.userId ||
         request.auth.token.admin == true);
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        (request.auth.uid == resource.data.userId ||
         request.auth.token.admin == true);
    }

    // Reviews - public read, authenticated write
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## Quick Commands

### Add a new cafe via JavaScript:

```javascript
await db.collection('cafes').doc('cafe_013').set({
  name: 'My New Cafe',
  location: 'T Nagar',
  rating: 4.0,
  tables: 12,
  // ... other fields
});
```

### Get all cafes:

```javascript
const snapshot = await db.collection('cafes').get();
snapshot.forEach(doc => {
  console.log(doc.id, '=>', doc.data());
});
```

### Get cafes by location:

```javascript
const snapshot = await db.collection('cafes')
  .where('location', '==', 'Royapettah')
  .get();
```

---

## Firebase Config Used:

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
