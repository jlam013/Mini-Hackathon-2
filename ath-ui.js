import { 
  auth,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "./firebase.js";

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userDisplay = document.getElementById("userDisplay");

// Login popup
if (loginBtn) {
    loginBtn.onclick = () => {
        signInWithPopup(auth, provider)
            .catch(err => console.error(err));
    };
}

// Logout
if (logoutBtn) {
    logoutBtn.onclick = () => {
        signOut(auth);
    };
}

// User state
onAuthStateChanged(auth, user => {
    if (user) {
        if (userDisplay) {
            userDisplay.innerText = user.email;
        }

        if (loginBtn) loginBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
    } 
    else {
        if (userDisplay) userDisplay.innerText = "";

        if (loginBtn) loginBtn.style.display = "inline-block";
        if (logoutBtn) logoutBtn.style.display = "none";
    }
});