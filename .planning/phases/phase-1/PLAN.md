---
phase: phase-1
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - auth.js
  - app.js
  - bookings.js
  - favorites.js
  - index.html
autonomous: false
requirements:
  - JS-01
  - JS-02
  - JS-03
  - JS-04
must_haves:
  truths:
    - "No `Identifier 'currentUser' has already been declared` errors in console on any page"
    - "No duplicate `showToast` function declarations causing errors"
    - "No duplicate `signOut` function declarations causing errors"
    - "No `Cannot set properties of null` errors on non-auth pages"
    - "Zero console errors on all pages (auth, index, café-detail, bookings, favorites, reviews) when signed in or signed out"
    - "No stray blank modal component visible on index.html page"
  artifacts:
    - path: "auth.js"
      provides: "Central auth state management with safe DOM access, single currentUser, shared showToast and signOut"
    - path: "app.js"
      provides: "Main app logic without duplicate global declarations"
    - path: "bookings.js"
      provides: "Bookings page logic without duplicate global declarations"
    - path: "favorites.js"
      provides: "Favorites page logic without duplicate global declarations"
    - path: "index.html"
      provides: "Clean layout without unused modal overlay component"
  key_links:
    - from: "auth.js"
      to: "app.js, bookings.js, favorites.js"
      via: "Single global declarations (currentUser, showToast, signOut) loaded first"
      pattern: "global.*currentUser|window\.showToast|signOut calls"
    - from: "auth.js"
      to: "DOM elements on auth page"
      via: "DOMContentLoaded guard prevents accessing auth-specific elements on other pages"
      pattern: "getElementById.*fields"
    - from: "index.html"
      to: "app.js modal functions"
      via: "modal overlay element removed (no longer referenced in DOM)"
      pattern: "modal-overlay"
---

<objective>
Fix JavaScript stability issues preventing reliable user interaction across all BREW pages.

**Purpose:** Eliminate syntax and runtime errors that block page functionality, ensuring all pages (auth, index, café-detail, bookings, favorites, reviews) can execute without console errors whether the user is signed in or signed out.

**Output:** Clean JavaScript environment with:
- No global variable/function redeclarations
- Safe auth script execution on all pages
- Extraneous UI elements removed
- Consistent sign-out and toast behavior
</objective>

<execution_context>
@C:/Users/xende/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/xende/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md

# Problem Analysis

**JS-01: Duplicate variable and function declarations**
- Root cause: Multiple page scripts declare the same global variables/functions (`currentUser`, `showToast`, `signOut`) causing `Identifier 'X' has already been declared` errors when loaded together.
- Affected pages:
  - `index.html`: loads `auth.js` and `app.js` → duplicates in `currentUser` (only if present), `showToast`, `signOut`
  - `bookings.html`: loads `auth.js` and `bookings.js` → duplicates in `currentUser`, `showToast`, `signOut`
  - `favorites.html`: loads `auth.js` and `favorites.js` → duplicates in `currentUser`, `showToast`, `signOut`
- Not affected: `cafe-detail.html`, `reviews.html` (do not load `auth.js`), `auth.html` (only `auth.js`).
- Notes: `app.js` does not declare `currentUser`, but does declare `showToast` and `signOut`. `bookings.js` and `favorites.js` declare all three.

**JS-02: Cannot set properties of null on non-auth pages**
- Root cause: `auth.js` runs `DOMContentLoaded` on every page, unconditionally calling `renderFields()` and attaching click listener to `#auth-submit`. On non-auth pages, these elements don't exist, causing `Cannot set properties of null`.
- Affected pages: all pages that load `auth.js` except `auth.html`.

**JS-03: Zero console errors**
- Combined outcome after fixing JS-01, JS-02, and ensuring no other errors (e.g., duplicate function declarations for `showToast` and `signOut`).

**JS-04: Stray blank modal component**
- Root cause: `index.html` contains an unused modal overlay (`#modal-overlay` with close button). The modal is never populated or shown; it's a leftover artifact. Its presence is unnecessary and could confuse screen readers or cause layout shifts.

# Fix Strategy (Summary)

1. **Consolidate global declarations**
   - Keep single declarations of `currentUser`, `showToast` (no-op version), and `signOut` in `auth.js`.
   - Remove local declarations of these from `app.js`, `bookings.js`, `favorites.js`.
   - `cafe-detail.js` and `reviews.js` retain their own `currentUser`, `showToast` (cafe-detail: no-op; reviews: active), and `signOut` because they don't load `auth.js`.

2. **Make `auth.js` safe on non-auth pages**
   - In `DOMContentLoaded`: check for existence of `#fields` before calling `renderFields()` and attaching `#auth-submit` listener.
   - Guard `renderFields()` to return if `container` is null.

3. **Remove stray modal**
   - Delete the modal overlay block from `index.html`.

4. **Verification**
   - Automated checks (grep-based) validate file modifications.
   - Final manual checkpoint confirms zero console errors and clean UI.

# Risk Assessment

- **Risk:** Removing global declarations from `app.js`/`bookings.js`/`favorites.js` could break if `auth.js` fails to load or loads after them.
  - **Mitigation:** HTML already loads `auth.js` before page-specific scripts. Preserve this order.

- **Risk:** `showToast` in `auth.js` is a no-op; removing active toast implementations on favorites/bookings could hide user feedback.
  - **Mitigation:** Those pages already used no-op toasts; no functional change.

- **Risk:** Removing modal could break keyboard shortcuts.
  - **Mitigation:** `closeModalBtn` already checks for modal existence; no side effects.

- **Side Effects:** None flagged. All changes are defensive and preserve existing behavior.
</context>

<tasks>

<task type="auto">
  <name>Task 1a: Clean auth.js and make it page-safe</name>
  <files>
    auth.js
  </files>
  <action>
    **Modify auth.js:**

    1. Keep the single declarations:
       - `let currentUser = null;`
       - `let currentMode = 'signin';`
       - `function showToast(msg) { /* no-op */ }` (already present)
       - `function signOut() { ... }` (already present)

    2. Update `renderFields()` to guard against missing container:
       ```js
       function renderFields() {
         const container = document.getElementById('fields');
         if (!container) return; // Safe on non-auth pages
         // ... existing content
       }
       ```

    3. Update `DOMContentLoaded` listener to only initialize on auth page:
       ```js
       document.addEventListener('DOMContentLoaded', () => {
         if (!document.getElementById('fields')) return; // Only run on auth.html
         renderFields();
         const btn = document.getElementById('auth-submit');
         if (btn) btn.addEventListener('click', handleAuth);
       });
       ```

    4. Ensure no other code accesses auth-specific DOM elements without checks.
  </action>
  <verify>
    <automated>
      node -e "const fs=require('fs'); const a=fs.readFileSync('auth.js','utf8'); if(!a.includes('if (!container) return')) throw new Error('renderFields guard missing'); if(!a.includes('if (!document.getElementById(\\'fields\\')) return')) throw new Error('DOMContentLoaded guard missing'); if(!a.includes('let currentUser = null')) throw new Error('currentUser declaration missing'); if(!a.includes('function showToast')||!a.includes('function signOut')) throw new Error('auth.js missing critical functions'); console.log('✅ auth.js updated correctly')"
    </automated>
  </verify>
  <done>
    - auth.js contains safe guards in renderFields and DOMContentLoaded
    - Single currentUser, showToast, and signOut remain
    - Syntax is valid and no syntax errors introduced
  </done>
</task>

<task type="auto">
  <name>Task 1b: Remove duplicate declarations from app.js, bookings.js, favorites.js</name>
  <files>
    app.js
    bookings.js
    favorites.js
  </files>
  <action>
    For each file (`app.js`, `bookings.js`, `favorites.js`), remove the following if present:
    - The line `let currentUser = null;`
    - The entire `function showToast(msg) { /* no-op */ }` definition
    - The entire `function signOut() { ... }` definition

    Notes:
    - In `app.js`, `showToast` is at the bottom and unused; `signOut` is near bottom.
    - In `bookings.js`, they are near the bottom (showToast at ~230-233, signOut at ~236-240).
    - In `favorites.js`, they are near the bottom (showToast ~123-126, signOut ~129-133).
    - Adjust line numbers accordingly. Ensure removal does not leave dangling blank lines or unclosed blocks.
    - After removal, these files will use the global `currentUser`, `showToast`, and `signOut` from `auth.js`.
    - Do NOT modify `cafe-detail.js` or `reviews.js` — they retain their own implementations.
  </action>
  <verify>
    <automated>
      node -e "const fs=require('fs'); const files=['app.js','bookings.js','favorites.js']; let ok=true; for(const f of files){ const s=fs.readFileSync(f,'utf8'); if(s.includes('let currentUser = null')){ console.error('❌',f,'still declares currentUser'); ok=false; } if(s.includes('function showToast')){ console.error('❌',f,'still declares showToast'); ok=false; } if(s.includes('function signOut')){ console.error('❌',f,'still declares signOut'); ok=false; } } if(ok) console.log('✅ No duplicate declarations in app.js, bookings.js, favorites.js')"
    </automated>
  </verify>
  <done>
    - app.js, bookings.js, favorites.js no longer declare currentUser, showToast, or signOut
    - Files remain syntactically valid
    - No leftover syntax errors from removed functions
  </done>
</task>

<task type="auto">
  <name>Task 2: Remove stray blank modal from index.html</name>
  <files>
    index.html
  </files>
  <action>
    - Open `index.html`.
    - Locate the modal overlay block (usually around lines 76-82):
      ```html
      <!-- Modal -->
      <div id="modal-overlay" onclick="closeModal(event)">
        <div class="modal-box" id="modal-box">
          <button class="modal-close" onclick="closeModalBtn()">✕</button>
          <div id="modal-content"></div>
        </div>
      </div>
      ```
    - Delete these lines entirely.
    - Ensure the `</body>` and `</html>` tags remain correctly positioned.
    - Do not modify any other part of the file.
  </action>
  <verify>
    <automated>
      node -e "const fs=require('fs'); const h=fs.readFileSync('index.html','utf8'); if(h.includes('id=\"modal-overlay\"')) throw new Error('Modal overlay still present'); console.log('✅ Modal overlay removed from index.html')"
    </automated>
  </verify>
  <done>
    - index.html no longer contains the modal overlay div
    - Page layout remains intact; café grid and other elements unaffected
    - No JavaScript errors will occur from missing modal due to existing null checks in app.js
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>
    Phase 1 JavaScript stability fixes: removed duplicate global declarations, added safe guards in auth.js, and removed stray modal from index.html.
  </what-built>
  <how-to-verify>
    1. Start a local web server in the project root (e.g., `python -m http.server 8000` or `npx serve`).
    2. Open each page in a browser (test both signed-out and signed-in states):
       - `auth.html`
       - `index.html`
       - `cafe-detail.html?id=cafe_001` (any valid café ID)
       - `bookings.html`
       - `favorites.html`
       - `reviews.html`
    3. For each page, open DevTools console (F12) and verify:
       - No `Identifier 'currentUser' has already been declared`
       - No `Identifier 'showToast' has already been declared`
       - No `Identifier 'signOut' has already been declared`
       - No `Cannot set properties of null` errors
       - Zero JavaScript errors (warnings are ok if unrelated)
    4. On `index.html`, visually confirm there is no blank modal overlay or stray close button anywhere on the page.
    5. Test basic interactions:
       - Sign in and sign out works from any page (header button triggers signOut).
       - Navigation between pages works.
       - No toast-related errors appear when performing actions (e.g., removing a favorite).
    6. If any error appears, note the page and error message.
  </how-to-verify>
  <resume-signal>Type "approved" if all pages show 0 console errors and no stray modal; otherwise describe any issues found.</resume-signal>
</task>

</tasks>

<verification>
The automated checks in Tasks 1a, 1b, and 2 confirm the code modifications. The final human-verify checkpoint ensures end-to-end stability: all pages load with zero JavaScript errors in both signed-in and signed-out states, and the UI is clean.
</verification>

<success_criteria>
Phase 1 is complete when:
- All six pages (auth, index, café-detail, bookings, favorites, reviews) execute with zero JavaScript errors in the console, regardless of auth state.
- The `currentUser`, `showToast`, and `signOut` symbols are declared exactly once per page load (no redeclarations).
- `auth.js` safely handles pages without auth-specific DOM elements.
- `index.html` contains no stray blank modal component.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-1/SUMMARY.md` documenting the changes made and verification results (including any manual test notes).
</output>
