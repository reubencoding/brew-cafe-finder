// Reviews Page Logic

let currentUser = null;
let reviews = [];
let cafes = [];
let currentFilter = '';
let currentSort = 'newest';
let lastDoc = null;
const REVIEWS_PER_PAGE = 9;

// Helper: Wrap promises with 15-second timeout
function withTimeout(promise, timeout = 15000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Query timeout after 15 seconds')), timeout)
    )
  ]);
}

// Initialize
auth.onAuthStateChanged((user) => {
  currentUser = user;
  if (user) {
    document.getElementById('user-display').textContent = user.displayName || user.email.split('@')[0];
  } else {
    document.getElementById('user-display').textContent = 'Guest';
  }
  loadReviews();
  loadCafeFilter();
});

// Load reviews
async function loadReviews(loadMore = false) {
  try {
    let query = db.collection('reviews')
      .orderBy('createdAt', 'desc');

    if (currentFilter) {
      query = query.where('cafeId', '==', currentFilter);
    }

    if (currentSort === 'highest') {
      query = query.orderBy('rating', 'desc');
    } else if (currentSort === 'lowest') {
      query = query.orderBy('rating', 'asc');
    }

    query = query.limit(REVIEWS_PER_PAGE);

    if (loadMore && lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const snapshot = await withTimeout(query.get());

    if (!loadMore) {
      reviews = [];
    }

    const newReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    reviews = [...reviews, ...newReviews];
    lastDoc = snapshot.docs[snapshot.docs.length - 1];

    renderReviews(reviews);
    updateStats();

    // Show/hide load more button
    document.getElementById('load-more').style.display =
      newReviews.length === REVIEWS_PER_PAGE ? 'block' : 'none';

  } catch (err) {
    console.error('Error loading reviews:', err);
    document.getElementById('reviews-grid').innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="cup">⭐</div>
        <h3>No reviews yet</h3>
        <p>Be the first to review a café!</p>
      </div>
    `;
  }
}

// Load café filter options - from LOCAL data (Firebase stores only user credentials)
async function loadCafeFilter() {
  try {
    // Load from localStorage instead of Firestore
    const savedCafes = localStorage.getItem('cafes');
    cafes = savedCafes ? JSON.parse(savedCafes) : [];

    const select = document.getElementById('cafe-filter');
    select.innerHTML = '<option value="">All Cafés</option>' +
      cafes.map(c => `<option value="${c.docId || c.id}">${c.name}</option>`).join('');
  } catch (err) {
    console.error('Error loading cafes:', err);
  }
}

// Filter reviews
function filterReviews() {
  currentFilter = document.getElementById('cafe-filter').value;
  lastDoc = null;
  loadReviews();
}

// Sort reviews
function sortReviews() {
  currentSort = document.getElementById('sort-filter').value;
  lastDoc = null;
  loadReviews();
}

// Load more reviews
function loadMoreReviews() {
  loadReviews(true);
}

// Render reviews
function renderReviews(reviewsList) {
  const container = document.getElementById('reviews-grid');

  if (!reviewsList.length) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="cup">⭐</div>
        <h3>No reviews found</h3>
        <p>Try a different filter</p>
      </div>
    `;
    return;
  }

  container.innerHTML = reviewsList.map(r => {
    const date = r.createdAt?.toDate ?
      r.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) :
      'Recently';

    return `
      <div class="review-card">
        <div class="review-card-header">
          <a href="cafe-detail.html?id=${r.cafeId}" class="review-card-cafe">${r.cafeName}</a>
          <span class="review-card-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span>
        </div>
        <p class="review-card-author">by ${r.userName} · ${date}</p>
        <p class="review-card-text">${r.text}</p>
      </div>
    `;
  }).join('');
}

// Update stats
async function updateStats() {
  try {
    // Total reviews
    const totalSnapshot = await withTimeout(db.collection('reviews').get());
    document.getElementById('total-reviews').textContent = totalSnapshot.size;

    // Average rating
    let totalRating = 0;
    totalSnapshot.forEach(doc => {
      totalRating += doc.data().rating;
    });
    const avgRating = totalSnapshot.size > 0 ? (totalRating / totalSnapshot.size).toFixed(1) : '0.0';
    document.getElementById('avg-rating').textContent = avgRating;

    // Most reviewed café
    const cafeCounts = {};
    totalSnapshot.forEach(doc => {
      const cafeId = doc.data().cafeId;
      cafeCounts[cafeId] = (cafeCounts[cafeId] || 0) + 1;
    });

    let topCafeId = null;
    let maxCount = 0;
    for (const [cafeId, count] of Object.entries(cafeCounts)) {
      if (count > maxCount) {
        maxCount = count;
        topCafeId = cafeId;
      }
    }

    if (topCafeId) {
      // Get cafe name from localStorage (Firebase stores only user credentials)
      const savedCafes = localStorage.getItem('cafes');
      const allCafes = savedCafes ? JSON.parse(savedCafes) : [];
      const cafe = allCafes.find(c => c.docId === topCafeId || c.id === topCafeId);
      const cafeName = cafe ? cafe.name : 'Unknown';
      document.getElementById('top-cafe').textContent =
        cafeName.split(' ').slice(0, 2).join(' ') + (cafeName.split(' ').length > 2 ? '...' : '');
    } else {
      document.getElementById('top-cafe').textContent = '-';
    }

  } catch (err) {
    console.error('Error updating stats:', err);
  }
}

// Toast
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// Sign out
function signOut() {
  auth.signOut().then(() => {
    window.location.href = 'auth.html';
  });
}
