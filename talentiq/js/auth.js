// ── auth.js ──

// ── Toast Helper ──
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  const icon = type === 'success' ? '✅' : '❌';
  toast.innerHTML = `<span class="toast-icon">${icon}</span> ${message}`;
  toast.className = `toast ${type}`;
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── Show / hide error ──
function showError(msg) {
  const el = document.getElementById('error-msg');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}
function clearError() {
  const el = document.getElementById('error-msg');
  if (el) el.style.display = 'none';
}

// ── LOGIN ──
async function loginWithEmail(email, password) {
  clearError();
  try {
    await auth.signInWithEmailAndPassword(email, password);
    window.location.href = 'index.html';
  } catch (err) {
    const messages = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
    };
    showError(messages[err.code] || err.message);
  }
}

// ── REGISTER ──
async function registerWithEmail(name, email, password) {
  clearError();
  if (password.length < 6) {
    showError('Password must be at least 6 characters.');
    return;
  }
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName: name });

    // Save user to Firestore
    await db.collection('users').doc(cred.user.uid).set({
      name,
      email,
      avatar: '🧠',
      joined: firebase.firestore.FieldValue.serverTimestamp(),
      solved: [],
      score: 0,
      streak: 0,
      submissions: 0,
      easyCount: 0,
      mediumCount: 0,
      hardCount: 0
    });

    window.location.href = 'index.html';
  } catch (err) {
    const messages = {
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/weak-password': 'Password is too weak.',
    };
    showError(messages[err.code] || err.message);
  }
}

// ── GOOGLE LOGIN ──
async function loginWithGoogle() {
  clearError();
  try {
    const result = await auth.signInWithPopup(googleProvider);
    const user = result.user;
    const isNew = result.additionalUserInfo.isNewUser;

    if (isNew) {
      await db.collection('users').doc(user.uid).set({
        name: user.displayName,
        email: user.email,
        avatar: '🧠',
        joined: firebase.firestore.FieldValue.serverTimestamp(),
        solved: [], score: 0, streak: 0, submissions: 0,
        easyCount: 0, mediumCount: 0, hardCount: 0
      });
    }
    window.location.href = 'index.html';
  } catch (err) {
    showError('Google sign-in failed. Please try again.');
  }
}

// ── LOGOUT ──
async function logout() {
  await auth.signOut();
  window.location.href = 'login.html';
}

// ── DOM Ready ──
document.addEventListener('DOMContentLoaded', () => {

  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email    = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      loginWithEmail(email, password);
    });
  }

  // Register form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const name     = document.getElementById('name').value.trim();
      const email    = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      registerWithEmail(name, email, password);
    });
  }

  // Google login buttons
  document.querySelectorAll('.google-login-btn').forEach(btn => {
    btn.addEventListener('click', loginWithGoogle);
  });

  // Logout buttons
  document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', logout);
  });

  // Update navbar based on auth state
  auth.onAuthStateChanged(user => {
    const navAuth  = document.getElementById('nav-auth');
    const navUser  = document.getElementById('nav-user');

    if (user) {
      if (navAuth) navAuth.style.display = 'none';
      if (navUser) {
        navUser.style.display = 'flex';
        const nameEl = document.getElementById('nav-username');
        if (nameEl) nameEl.textContent = user.displayName || 'User';
      }
    } else {
      if (navAuth) navAuth.style.display = 'flex';
      if (navUser) navUser.style.display = 'none';
    }
  });
});
