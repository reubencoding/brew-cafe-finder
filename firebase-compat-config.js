// Firebase Configuration - Compatibility Mode (for non-module scripts)
// Using the compat SDK for easier integration with vanilla JS

const firebaseConfig = {
  apiKey: "AIzaSyCCE5D-s4osZN9J7dhesbI5CGWkPxSi0Tw",
  authDomain: "cafe-5b867.firebaseapp.com",
  projectId: "cafe-5b867",
  storageBucket: "cafe-5b867.firebasestorage.app",
  messagingSenderId: "922765379923",
  appId: "1:922765379923:web:a1c362a9514eba941239a6",
  measurementId: "G-R7K624GCEH"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export for use in other files
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence
db.enablePersistence({
  synchronizeTabs: true
}).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.log('The current browser does not support persistence.');
  }
});

console.log('Firebase initialized');
