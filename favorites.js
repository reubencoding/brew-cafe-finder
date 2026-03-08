// Favorites Page Logic

let currentUser = null;
let favorites = [];

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
  if (!currentUser) return;

  try {
    const snapshot = await db.collection('users')
      .doc(currentUser.uid)
      .collection('favorites')
      .orderBy('addedAt', 'desc')
      .get();

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
    console.error('Error loading favorites:', err);
    showEmptyState();
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
  document.getElementById('favorites-grid').innerHTML = '';
  document.getElementById('empty-state').style.display = 'block';
}

// Toast (disabled - component removed)
function showToast(msg) {
  // No-op; toast removed
}

// Sign out
function signOut() {
  auth.signOut().then(() => {
    window.location.href = 'auth.html';
  });
}
