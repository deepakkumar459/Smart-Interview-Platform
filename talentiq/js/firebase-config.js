// ── firebase-config.js ──
// Replace these values with your own Firebase project config
// Go to: Firebase Console → Project Settings → Your apps → SDK setup

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export services
const auth = firebase.auth();
const db   = firebase.firestore();

// ── Google Provider ──
const googleProvider = new firebase.auth.GoogleAuthProvider();

// ── Auth State Observer ──
// Redirect to login if not authenticated (call on protected pages)
function requireAuth(redirectTo = 'login.html') {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(user => {
      if (user) {
        resolve(user);
      } else {
        window.location.href = redirectTo;
        reject('Not authenticated');
      }
    });
  });
}

// ── Get current user ──
function getCurrentUser() {
  return auth.currentUser;
}
