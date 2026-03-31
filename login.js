import { 
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "./firebase.js";

document.getElementById("loginBtn").onclick = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => window.location.href = "index.html");
};

document.getElementById("signupBtn").onclick = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => window.location.href = "index.html");
};