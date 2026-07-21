@@ -0,0 +1,135 @@
# 🧠 TalentIQ — LeetCode Clone

A full-featured competitive coding platform built with **HTML, CSS, JavaScript + Firebase**.

---

## 📁 Project Structure

```
talentiq/
├── index.html          ← Homepage (problem list)
├── login.html          ← Sign In page
├── register.html       ← Sign Up page
├── problem.html        ← Code editor + problem description
├── leaderboard.html    ← Rankings page
├── profile.html        ← User profile + stats
├── css/
│   └── style.css       ← All styles (dark theme)
└── js/
    ├── firebase-config.js  ← Firebase setup (edit this!)
    ├── auth.js             ← Login, register, logout logic
    ├── problems.js         ← Problem listing and filtering
    └── judge.js            ← Code execution via Judge0 API
```

---

## ⚙️ Setup Instructions

### Step 1 — Create Firebase Project
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add Project"** → name it **TalentIQ**
3. Disable Google Analytics (optional) → Create

### Step 2 — Enable Firebase Services
- **Authentication**: Console → Authentication → Sign-in method → Enable Email/Password + Google
- **Firestore**: Console → Firestore Database → Create database → Start in **test mode**

### Step 3 — Get Firebase Config
1. Console → Project Settings → Your apps → Add web app
2. Copy the config object
3. Open `js/firebase-config.js` and replace the placeholder values

### Step 4 — Get Judge0 API Key (for code execution)
1. Go to [https://rapidapi.com/judge0-official/api/judge0-ce](https://rapidapi.com/judge0-official/api/judge0-ce)
2. Sign up for free → Subscribe to the basic plan (free tier)
3. Copy your API key
4. Open `js/judge.js` and replace `YOUR_RAPIDAPI_KEY`

### Step 5 — Seed Problems
1. Open `index.html` in a browser with Firebase configured
2. Open browser console (F12)
3. Type: `seedProblems()` and press Enter
4. You should see: ✅ Problems seeded!

### Step 6 — Run the Project
- Just open `index.html` in a browser — no build step needed!
- Or use VS Code **Live Server** extension for the best experience

---

## 🔥 Firestore Security Rules (Paste in Firebase Console)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can read all profiles, but only edit their own
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Anyone can read problems (admins add problems)
    match /problems/{problemId} {
      allow read: if true;
      allow write: if false; // Only via Firebase Console or Admin SDK
    }

    // Users can read/write their own submissions
    match /submissions/{submissionId} {
      allow read: if request.auth != null &&
                     request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

---

## 🎯 Features

| Feature | Status |
|---|---|
| Email + Google Authentication | ✅ |
| Problem listing with filters | ✅ |
| Monaco code editor | ✅ |
| Multi-language support (JS, Python, C++) | ✅ |
| Code execution via Judge0 | ✅ |
| Submission history | ✅ |
| User profile with stats | ✅ |
| Global leaderboard | ✅ |
| Activity heatmap | ✅ |
| Badges system | ✅ |
| Dark theme | ✅ |
| Responsive design | ✅ |

---

## 🚀 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Code Editor**: Monaco Editor (CDN)
- **Styling**: Custom CSS with CSS Variables
- **Auth**: Firebase Authentication
- **Database**: Firebase Firestore
- **Code Execution**: Judge0 CE API (via RapidAPI)
- **Hosting**: Firebase Hosting (optional)

---

## 📦 Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

Made with ❤️ for Web Technology subject project.
