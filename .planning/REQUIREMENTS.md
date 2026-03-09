# Requirements: BREW Bug Fixes

**Defined:** 2026-03-09
**Core Value:** Users can reliably discover cafés, view details with reviews, book tables, and manage their reservations without errors or broken features

## v1 Requirements

### JavaScript Stability

- [x] **JS-01**: Eliminate duplicate variable declaration errors (`currentUser` redeclaration)
- [x] **JS-02**: Fix `Cannot set properties of null` error on non-auth pages (auth.js)
- [x] **JS-03**: Ensure no console errors on any page when running on local server
- [x] **JS-04**: Remove stray blank component with close button from index.html

### Bookings System

- [x] **BOOK-01**: Bookings page loads successfully (no infinite loading)
- [x] **BOOK-02**: Bookings display correctly with date, time, café name, and guest count
- [x] **BOOK-03**: Cancellation of bookings works (status changes to 'cancelled')
- [x] **BOOK-04**: Creating a new booking from café detail page succeeds
- [x] **BOOK-05**: Firestore query correctly filters bookings by logged-in user's `userId`

### Reviews Display

- [x] **REV-01**: Reviews load correctly when viewing a café detail page
- [x] **REV-02**: Reviews display with proper formatting: author, date, star rating, text
- [x] **REV-03**: Review count on café card updates when new reviews are added
- [x] **REV-04**: Query filters reviews by exact `cafeId` match (case-sensitive, exact string)
- [x] **REV-05**: Empty state shows "No reviews yet" only when café truly has no reviews

### General

- [x] **GEN-01**: All pages (auth, index, café-detail, bookings, favorites, reviews) load without JavaScript errors
- [x] **GEN-02**: Firebase initialization succeeds on all pages
- [x] **GEN-03**: User authentication state persists correctly across page navigation
- [x] **GEN-04**: No 15-second timeouts on Firestore queries (bookings, reviews, favorites, cafe-detail)

## v2 Requirements

*(None — all focus on v1 bug fixes)*

## Out of Scope

| Feature | Reason |
|---------|--------|
| Café image assets | Images folder and photo files will be added separately; image paths are already correct |
| New features | Only fixing broken functionality, no enhancements |
| UI redesign | No visual changes beyond removing stray component |
| Firebase rules modification | Assuming existing rules from DATA_STRUCTURE.md are deployed |
| LocalStorage architecture change | Café data remains local; Firebase only for user data |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| JS-01 | 1 | ✓ Complete |
| JS-02 | 1 | ✓ Complete |
| JS-03 | 1 | ✓ Complete |
| JS-04 | 1 | ✓ Complete |
| BOOK-01 | 2 | ✓ Complete |
| BOOK-02 | 2 | ✓ Complete |
| BOOK-03 | 2 | ✓ Complete |
| BOOK-04 | 2 | ✓ Complete |
| BOOK-05 | 2 | ✓ Complete |
| REV-01 | 3 | ✓ Complete |
| REV-02 | 3 | ✓ Complete |
| REV-03 | 3 | ✓ Complete |
| REV-04 | 3 | ✓ Complete |
| REV-05 | 3 | ✓ Complete |
| GEN-01 | 4 | ✓ Complete |
| GEN-02 | 4 | ✓ Complete |
| GEN-03 | 4 | ✓ Complete |
| GEN-04 | 4 | ✓ Complete |

---

*Requirements defined: 2026-03-09*
*Last updated: 2026-03-09 after roadmap creation*
