---
phase: phase-3
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - cafe-detail.js
autonomous: false
requirements:
  - REV-01
  - REV-02
  - REV-03
  - REV-04
  - REV-05
must_haves:
  truths:
    - "Reviews load successfully when viewing any café detail page (no empty reviews section when data exists)"
    - "Each review displays author name, date, star rating, and text with proper visual formatting"
    - "Review count on café card updates immediately when a new review is added"
    - "Query filters reviews correctly: only reviews matching exact `cafeId` are shown"
    - "Empty state 'No reviews yet' appears ONLY for cafés with zero reviews in Firestore (not for errors)"
  artifacts:
    - path: "cafe-detail.js"
      provides: "Robust reviews loading and rendering with proper error handling, correct cafeId filtering, and localStorage count updates"
      contains:
        - "loadReviews: queries Firestore with where('cafeId', '==', currentDocId), handles empty results vs errors separately"
        - "renderReviews: displays author (userName), date (createdAt formatted), star rating (★/☆), and text"
        - "submitReview: increments localStorage café reviews count after successful Firestore add"
    - path: "reviews collection (Firestore)"
      provides: "Review documents with fields: userId, userName, cafeId, cafeName, rating, text, createdAt"
      contains:
        - "cafeId matches the café's docId exactly"
        - "createdAt is a Firestore timestamp"
  key_links:
    - from: "cafe-detail.js loadReviews"
      to: "Firestore reviews collection"
      via: "db.collection('reviews').where('cafeId', '==', currentDocId).orderBy('createdAt', 'desc').limit(5).get()"
      pattern: "collection\\(['\"]reviews['\"]\\)\\.where\\(['\"]cafeId['\"]"
    - from: "cafe-detail.js renderReviews"
      to: "DOM element #reviews-list"
      via: "document.getElementById('reviews-list').innerHTML = ..."
      pattern: "getElementById\\(['\"]reviews-list['\"]\\)"
    - from: "cafe-detail.js submitReview"
      to: "localStorage cafes array"
      via: "cafes[cafeIndex].reviews = (cafes[cafeIndex].reviews || 0) + 1"
      pattern: "\\.reviews\\s*=\\s*\\(.*\\+\\s*1\\)"
    - from: "cafe-detail.js renderCafeDetail"
      to: "cafes[].reviews count"
      via: "c.reviews.toLocaleString() in stats section"
      pattern: "reviews\\.toLocaleString"
---

<objective>
Fix reviews display on café detail pages to ensure reviews load correctly, display with proper formatting, and update review counts in real-time.

**Purpose:** Users must see reviews for each café, formatted clearly with author, date, rating, and text. The review count on the café card must increment immediately when a user submits a new review. The query must filter reviews accurately by café ID, and empty states must appear only when cafés truly have no reviews.

**Output:** Updated `cafe-detail.js` with:
- Reliable `loadReviews()` that correctly queries and distinguishes empty vs error states
- `renderReviews()` that shows properly formatted review cards
- `submitReview()` that updates localStorage review count
- Comprehensive error handling and diagnostic logging for maintainability
</objective>

<execution_context>
@C:/Users/xende/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/xende/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/phase-1/SUMMARY.md
@.planning/phases/phase-2/SUMMARY.md

# Phase 3 Problem Analysis

**Symptom:** Café detail page shows "No reviews yet" even when reviews exist in Firestore.

**Root causes to investigate:**
1. `currentDocId` value mismatch: The café ID extracted from URL params may not match the `cafeId` field stored in review documents (e.g., using `cafe_001` vs `cafe_001` with different prefix/format).
2. Query execution failure: Firestore query may be throwing due to security rules, missing indexes, or permission errors.
3. Data structure issues: Review documents may have missing `cafeId` or malformed `createdAt` timestamps.
4. Error state confusion: The catch block shows "No reviews yet" which masks actual errors, making diagnosis difficult.

**Current code issues:**
- `loadReviews()` catch block displays empty state message, conflating errors with zero reviews.
- Limited diagnostic logging makes it hard to know: café ID being queried, snapshot size, whether query succeeded.
- No explicit check that `currentDocId` is set before querying.
- Date formatting uses optional chaining but could fail if `createdAt` is missing or not a timestamp.
- `renderReviews()` properly handles empty array but cannot distinguish between "query returned 0" vs "query failed".

**Fix strategy:**
1. Add diagnostic console logs to trace: `currentDocId` value, query start, snapshot size, errors.
2. Separate empty state (0 reviews) from error state (show distinct error message with retry or console info).
3. Validate that `currentDocId` matches expected format; if needed, add fallback conversions (trim, case normalization).
4. Ensure Firestore query is properly constructed with single `where('cafeId', '==', currentDocId)`.
5. Defensive: check `db` and `currentUser` availability (though page loads with auth.js safe patterns from Phase 1).
6. Keep `submitReview()` localStorage count update intact; verify it works.
7. Clean up debug logs after confirming functionality.

**Success will be verified via browser testing and automated grep checks.**

</context>

<tasks>

<task type="auto">
  <name>Task 1: Enhance diagnostics and error handling in loadReviews</name>
  <files>
    cafe-detail.js
  </files>
  <action>
    Modify the `loadReviews()` function to add robust diagnostics and proper state separation:

    1. Add entry log: `console.log('[loadReviews] currentDocId:', currentDocId)`
    2. Add guard: if `!currentDocId`, log warning and return early without querying.
    3. Before query, log: `console.log('[loadReviews] Querying reviews for cafeId:', currentDocId)`
    4. After snapshot, log: `console.log('[loadReviews] Snapshot size:', snapshot.size, 'docs:', snapshot.docs.map(d => d.id))`
    5. In catch block:
       - Log full error: `console.error('[loadReviews] Error:', err)`
       - Display an ERROR message (distinct from empty state): `'<p class="review-text error">Unable to load reviews. Please check console.</p>'`
       - Do NOT show "No reviews yet" in error case.
    6. Ensure `renderReviews()` is called only with the array from snapshot.
    7. Add a separate explicit empty state: if `snapshot.empty` or `reviews.length === 0`, `renderReviews([])` will handle it (already shows "No reviews yet").
    8. Add defensive check that `db` exists: if `!db`, log error and show error state.
    9. Keep existing `orderBy('createdAt', 'desc')` and `limit(5)` unchanged.

    Do not remove existing behavior; only augment with diagnostics and better error display.
  </action>
  <verify>
    <automated>
      node -e "const fs=require('fs'); const c=fs.readFileSync('cafe-detail.js','utf8'); if(!c.includes('console.log(\\'[loadReviews] currentDocId:\\', currentDocId)')) throw new Error('Missing currentDocId log'); if(!c.includes('console.log(\\'[loadReviews] Snapshot size:\\'')) throw new Error('Missing snapshot size log'); if(!c.includes('\\'<p class=\\\"review-text error\\\"')) throw new Error('Missing error display'); if(!c.includes('if (!currentDocId)')) throw new Error('Missing currentDocId guard'); console.log('✅ loadReviews enhanced with diagnostics and error handling')"
    </automated>
  </verify>
  <done>
    - loadReviews logs diagnostic info (cafeId, snapshot size) to console
    - Separate empty state (shows "No reviews yet") from error state (shows error message)
    - Guard against missing currentDocId
    - Defensive check for db availability
    - Existing behavior preserved: query remains the same, empty array renders empty state
  </done>
</task>

<task type="auto">
  <name>Task 2: Verify and ensure correct query filtering and rendering</name>
  <files>
    cafe-detail.js
  </files>
  <action>
    Review the entire review-related flow to ensure correct filtering and display:

    **A. Verify query construction:**
    - Confirm the query is: `db.collection('reviews').where('cafeId', '==', currentDocId).orderBy('createdAt', 'desc').limit(5).get()`
    - Ensure no extra where clauses or incorrect field names.

    **B. Ensure renderReviews handles data correctly:**
    - Check that `r.userName`, `r.rating`, `r.text` are used.
    - Date formatting: `r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString() : 'Recently'` is acceptable.
    - Stars: `'★'.repeat(r.rating) + '☆'.repeat(5 - r.rating)` is correct.
    - No changes needed unless data is missing; add fallbacks: if `r.userName` missing, show 'Anonymous'; if `r.rating` missing, show 0; if `r.text` missing, show empty string.

    **C. Add defensive defaults:**
    - In `renderReviews`, add defaults to prevent crashes:
      ```javascript
      const userName = r.userName || 'Anonymous';
      const rating = Math.min(5, Math.max(0, r.rating || 0));
      const text = r.text || '';
      const date = r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently';
      ```

    **D. Verify review count update in submitReview:**
    - The existing code (lines 422-430) updates localStorage correctly. Ensure it remains unchanged and works.
    - After `loadReviews()` is called post-submit, the new review should appear at top due to `orderBy('createdAt', 'desc')`.

    **E. Check café ID consistency:**
    - In `loadCafeDetail()`, `currentDocId` comes from URL param `id`. Ensure it's not being modified elsewhere.
    - If logs show mismatched IDs, add normalization: `currentDocId = decodeURIComponent(currentDocId).trim()` after extraction.

    Make minimal changes only if issues are found. The primary goal is correctness and robustness.
  </action>
  <verify>
    <automated>
      node -e "const fs=require('fs'); const c=fs.readFileSync('cafe-detail.js','utf8'); // Check query constuct if(!c.includes('.where(\\'cafeId\\', \\'==\\', currentDocId)')) throw new Error('Query missing correct where clause'); // Check render uses correct fields if(!c.includes('userName') || !c.includes('rating') || !c.includes('text')) throw new Error('renderReviews missing required fields'); // Check star rendering if(!c.includes('.repeat(r.rating)') || !c.includes('repeat(5-r.rating)')) throw new Error('Star rendering incorrect'); // Check localStorage count update in submitReview if(!c.includes('cafes[cafeIndex].reviews = (cafes[cafeIndex].reviews || 0) + 1')) throw new Error('Review count increment missing'); console.log('✅ Query filtering and rendering verified')"
    </automated>
  </verify>
  <done>
    - Firestore query correctly filters by exact cafeId with proper ordering and limit
    - renderReviews displays author, formatted date, star rating, and text with fallback defaults
    - submitReview updates localStorage review count correctly
    - No crashes from missing fields; graceful fallbacks present
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>
    Phase 3 reviews display fixes: enhanced diagnostics, proper error/empty state handling, verified query filtering and formatting, confirmed review count updates.
  </what-built>
  <how-to-verify>
    1. Ensure Phase 1 (JS stability) and Phase 2 (bookings) are complete and verified. Start local server and sign in.
    2. **Load café with existing reviews:**
       - Choose a café known to have reviews in Firestore (or add test reviews first).
       - Open café detail page: `cafe-detail.html?id=<cafe_id>`.
       - Open DevTools console.
       - Verify logs show: `[loadReviews] currentDocId: ...`, `[loadReviews] Querying reviews...`, `[loadReviews] Snapshot size: N`.
       - The reviews list should display N reviews (up to 5). Each review should show:
         - Author name (bold/emphasized)
         - Date formatted like "Mar 9, 2026" or "Recently"
         - Star rating (filled ★ and empty ☆ for exactly 5 stars)
         - Review text (not truncated)
       - No console errors.
    3. **Test empty state:**
       - Open a café with NO reviews in Firestore.
       - The reviews section should show exactly: "No reviews yet. Be the first to review!" (or similar). No error styling.
       - Console should show `Snapshot size: 0`.
    4. **Test review submission and count update:**
       - On any café detail page, click "Write a Review", submit a review (5 stars, some text).
       - After submission:
         - Toast says "Review posted! ☕"
         - The new review appears at the top of the reviews list within ~1 second (after loadReviews completes).
         - The review count in the café stats (e.g., " Reviews" card) increments by 1 immediately (value from localStorage).
       - Refresh the page; the new review should still be visible (persisted in Firestore) and count should be updated.
    5. **Test filtering (REV-04):**
       - While on a café detail page, check console logs confirm `currentDocId` matches the café's expected ID.
       - In Firestore console, verify that reviews for OTHER cafés are NOT appearing in the query (snapshot docs should only have that cafeId). Or, simply trust the query correctness if verified via logs.
    6. **Error handling:**
       - Simulate an error (optional): temporarily break Firebase config or go offline, reload café page. The reviews section should show an error message (not "No reviews yet"). Restore connectivity afterward.
    7. **Cross-check zero reviews behavior (REV-05):** Confirm that "No reviews yet" appears only when snapshot size is 0, not when errors occur.
    8. Finally, verify no JavaScript errors appear in console during any of these actions.

    Note: If any step fails, note the exact console output and observed behavior.
  </how-to-verify>
  <resume-signal>Type "approved" if all verification steps pass; otherwise describe the failed step(s) with console logs and screenshots if possible.</resume-signal>
</task>

</tasks>

<verification>
Automated checks confirm:
- loadReviews has diagnostic logging and separate error state
- Query uses correct where clause on cafeId
- renderReviews includes all required fields with fallback defaults
- submitReview increments localStorage review count
- Star rating rendering is mathematically correct

The human-verify checkpoint ensures end-to-end functionality: reviews load for cafés with data, empty state only for zero reviews, new reviews appear and increment count, and formatting is correct.
</verification>

<success_criteria>
Phase 3 (Reviews Display) is complete when:
- REV-01: Reviews load correctly on café detail pages (successful query displays reviews; no false empty states when data exists).
- REV-02: Each review shows author name, date, star rating (★/☆), and text with proper formatting.
- REV-03: The review count in the café stats card updates immediately after submitting a new review (localStorage increment triggers re-render).
- REV-04: The Firestore query filters correctly: only reviews with `cafeId` exactly matching the current café's ID are returned.
- REV-05: The message "No reviews yet" appears ONLY for cafés with zero reviews; errors display a distinct error message.

Additional: Zero console JavaScript errors on café detail pages during reviews operations.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-3/SUMMARY.md` documenting the changes made, diagnostic findings (if any), and verification results including manual test notes from the checkpoint.
</output>
