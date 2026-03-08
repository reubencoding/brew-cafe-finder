// Bookings Page Logic

let currentUser = null;
let currentTab = 'upcoming';
let bookings = [];
let bookingToCancel = null;

// Ensure no modal is left open on page load
document.getElementById('cancel-modal')?.classList.remove('open');

// Initialize
auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
    document.getElementById('user-display').textContent = user.displayName || user.email.split('@')[0];
    loadBookings();
  } else {
    document.getElementById('user-display').textContent = 'Guest';
    document.getElementById('bookings-container').innerHTML = `
      <div class="empty-state">
        <div class="cup">🔒</div>
        <h3>Please sign in</h3>
        <p>Sign in to view your bookings</p>
        <a href="auth.html" class="brew-btn">Sign In</a>
      </div>
    `;
  }
});

// Load bookings
async function loadBookings() {
  if (!currentUser) return;

  try {
    // Get bookings without server-side ordering to avoid composite index requirement
    const snapshot = await db.collection('bookings')
      .where('userId', '==', currentUser.uid)
      .get();

    bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Sort by createdAt descending (client-side)
    bookings.sort((a, b) => {
      const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
      const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
      return bTime - aTime;
    });

    filterAndRenderBookings();
  } catch (err) {
    console.error('Error loading bookings:', err);
    alert('Failed to load bookings: ' + err.message);
    document.getElementById('bookings-container').innerHTML = `
      <div class="empty-state">
        <div class="cup">📅</div>
        <h3>Unable to load bookings</h3>
        <p>Please try again later</p>
      </div>
    `;
  }
}

// Switch tab
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase().includes(tab));
  });
  filterAndRenderBookings();
}

// Filter and render bookings
function filterAndRenderBookings() {
  const now = new Date();

  let filtered = bookings.filter(b => {
    // Combine date and time to get the full booking datetime
    // b.time is expected in "HH:MM" format (e.g., "14:30")
    let bookingDate;
    if (b.time) {
      const [hours, minutes] = b.time.split(':').map(Number);
      bookingDate = new Date(b.date);
      bookingDate.setHours(hours, minutes, 0, 0);
    } else {
      // Fallback to date only if time is missing
      bookingDate = new Date(b.date);
    }
    const isPast = bookingDate < now;

    switch(currentTab) {
      case 'upcoming':
        return b.status !== 'cancelled' && !isPast;
      case 'past':
        return b.status !== 'cancelled' && isPast;
      case 'cancelled':
        return b.status === 'cancelled';
      default:
        return true;
    }
  });

  renderBookings(filtered);
}

// Render bookings
function renderBookings(bookingsList) {
  const container = document.getElementById('bookings-container');
  const emptyState = document.getElementById('empty-state');

  if (!bookingsList.length) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  container.innerHTML = bookingsList.map(booking => {
    const date = new Date(booking.date);
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    const statusClass = {
      'confirmed': 'confirmed',
      'pending': 'pending',
      'cancelled': 'cancelled',
      'completed': 'completed'
    }[booking.status] || 'pending';

    const showCancel = booking.status === 'confirmed' && currentTab === 'upcoming';

    return `
      <div class="booking-card">
        <div class="booking-emoji" style="background:${booking.cafeColor}40;">
          ${booking.cafeEmoji}
        </div>
        <div class="booking-info">
          <h4>${booking.cafeName}</h4>
          <p>${dateStr} at ${booking.time}</p>
          <div class="booking-meta">
            <span>${booking.guests} Guest${booking.guests > 1 ? 's' : ''}</span>
            ${booking.notes ? '<span>Has notes</span>' : ''}
          </div>
        </div>
        <div class="booking-status">
          <span class="status-badge ${statusClass}">${booking.status}</span>
          ${showCancel ? `<button class="cancel-btn" onclick="openCancelModal('${booking.id}')">Cancel</button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// Open cancel modal
function openCancelModal(bookingId) {
  bookingToCancel = bookingId;
  document.getElementById('cancel-modal').classList.add('open');
}

// Close cancel modal
function closeCancelModal(e) {
  if (e.target === document.getElementById('cancel-modal')) {
    document.getElementById('cancel-modal').classList.remove('open');
    bookingToCancel = null;
  }
}

function closeCancelModalBtn() {
  document.getElementById('cancel-modal').classList.remove('open');
  bookingToCancel = null;
}

// Confirm cancel
async function confirmCancel() {
  if (!bookingToCancel) return;

  try {
    await db.collection('bookings').doc(bookingToCancel).update({
      status: 'cancelled',
      cancelledAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    closeCancelModalBtn();
    // Refresh bookings list
    loadBookings();
  } catch (err) {
    alert('Error: ' + err.message);
  }
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
