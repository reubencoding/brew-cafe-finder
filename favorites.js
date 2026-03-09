// Favorites Page Logic

// Using global currentUser from auth.js - do not redeclare
let favorites = [];
let fallbackTimer = null;

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
  if (user) {
    currentUser = user;
    document.getElementById('user-display').textContent = user.displayName || user.email.split('@')[0];
    loadFavorites();
  } else {
    document.getElementById('user-display').textContent = 'Guest';
    document.getElementById('favorites-grid').innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="cup">🔒</div>
        <h3>Please sign in</h3>
        <p>Sign in to view your favorites</p>
        <a href="auth.html" class="brew-btn">Sign In</a>
      </div>
    `;
  }
});

// Load favorites
async function loadFavorites() {
  if (!currentUser) {
    // Should not happen normally, but ensure UI consistency
    const grid = document.getElementById('favorites-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="cup">🔒</div>
          <h3>Please sign in</h3>
          <p>Sign in to view your favorites</p>
          <a href="auth.html" class="brew-btn">Sign In</a>
        </div>
      `;
    }
    return;
  }

  // Clear any existing fallback timer
  if (fallbackTimer) {
    clearTimeout(fallbackTimer);
    fallbackTimer = null;
  }

  try {
    // Set fallback timer: if loading persists after 20 seconds, show error
    fallbackTimer = setTimeout(() => {
      const grid = document.getElementById('favorites-grid');
      const loadingState = grid?.querySelector('.loading-state');
      if (loadingState) {
        showErrorState('Loading is taking too long. Please refresh the page or try again.');
      }
    }, 20000);

    console.log('[loadFavorites] Querying favorites for userId:', currentUser.uid);
    const snapshot = await withTimeout(
      db.collection('users')
        .doc(currentUser.uid)
        .collection('favorites')
        .orderBy('addedAt', 'desc')
        .get()
    );

    // Clear fallback timer on success
    if (fallbackTimer) {
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }

    console.log('[loadFavorites] Snapshot size:', snapshot.size);
    const favoriteIds = snapshot.docs.map(doc => doc.data().cafeId);

    if (!favoriteIds.length) {
      showEmptyState();
      return;
    }

    // Load café details from LOCAL data (Firebase stores only user credentials)
    const savedCafes = localStorage.getItem('cafes');
    const allCafes = savedCafes ? JSON.parse(savedCafes) : [];

    favorites = favoriteIds.map(id => {
      const cafe = allCafes.find(c => c.docId === id || c.id === id);
      return cafe || null;
    }).filter(c => c !== null);

    renderFavorites();

  } catch (err) {
    console.error('[loadFavorites] Error:', err);
    if (fallbackTimer) {
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }
    if (err.message === 'Query timeout after 15 seconds') {
      showErrorState('Request timed out after 15 seconds. Please check your connection and try again.');
    } else {
      showErrorState('Failed to load favorites: ' + err.message);
    }
  }
}

// Render favorites
function renderFavorites() {
  const container = document.getElementById('favorites-grid');
  const emptyState = document.getElementById('empty-state');

  if (!favorites.length) {
    showEmptyState();
    return;
  }

  emptyState.style.display = 'none';

  container.innerHTML = favorites.map(c => `
    <div class="cafe-card" onclick="window.location.href='cafe-detail.html?id=${c.docId}'">
      <div class="card-top">
        <div class="card-icon" style="background:${c.color}40; border: 1.5px solid ${c.color}60">${c.emoji}</div>
        <div class="card-rating">
          <div class="stars">${'★'.repeat(Math.floor(c.rating))}${'☆'.repeat(5-Math.floor(c.rating))}</div>
          <div class="rev-count">${c.reviews.toLocaleString()} reviews</div>
        </div>
      </div>
      <a href="cafe-detail.html?id=${c.docId}">
        <h3 class="card-name">${c.name}</h3>
      </a>
      <p class="card-meta">📍 ${c.location} · ${c.price} · ${c.tables} tables</p>
      <p class="card-desc">${c.description}</p>
      <div class="tags">${c.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <div class="card-footer">
        <span class="card-hours">🕐 ${c.hours}</span>
        <button class="card-view" onclick="event.stopPropagation(); removeFavorite('${c.docId}', event)">REMOVE</button>
      </div>
    </div>
  `).join('');
}

// Remove from favorites
async function removeFavorite(cafeId, event) {
  event.stopPropagation();
  event.preventDefault();

  if (!currentUser) return;

  try {
    await db.collection('users')
      .doc(currentUser.uid)
      .collection('favorites')
      .doc(cafeId)
      .delete();

    showToast('Removed from favorites');
    favorites = favorites.filter(f => f.id !== cafeId);
    renderFavorites();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

// Show empty state
function showEmptyState() {
  const grid = document.getElementById('favorites-grid');
  const empty = document.getElementById('empty-state');
  if (grid) grid.innerHTML = '';
  if (empty) empty.style.display = 'block';
}

// Show error state
function showErrorState(message) {
  const grid = document.getElementById('favorites-grid');
  const empty = document.getElementById('empty-state');
  if (grid) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="cup">⚠️</div>
        <h3>Unable to load favorites</h3>
        <p>${message}</p>
        <button class="brew-btn" onclick="loadFavorites()">Retry</button>
      </div>
    `;
  }
  if (empty) empty.style.display = 'none';
}
