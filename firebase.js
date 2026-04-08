import { initializeApp } from 
"https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";

import { 
  getAuth, 
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 
"https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDLoZ6uEzkvx2UGvUZdZqFoClnZqnE6dH0",
    authDomain: "mru-cs-hub.firebaseapp.com",
    projectId: "mru-cs-hub",
    storageBucket: "mru-cs-hub.firebasestorage.app",
    messagingSenderId: "376515875493",
    appId: "1:376515875493:web:529a30b1e079613a69b34c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { 
  auth, 
  provider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged, 
  signOut 
};