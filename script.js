                  // Căutare produse

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const products = document.querySelectorAll(".product-card");

  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase();

    products.forEach((card) => {
      const name = card.getAttribute("data-name").toLowerCase();
      card.style.display = name.includes(query) ? "" : "none";
    });
  });
});


function openMenu() {
  document.getElementById('sideMenu').style.width = '250px'; /* Lățimea meniului */
}

function closeMenu() {
  document.getElementById('sideMenu').style.width = '0';
}


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyDQjt5Vqyp7zs5ppnZasuNHKkGg6DTGFQU",
  authDomain: "furniturefuture-ed302.firebaseapp.com",
  projectId: "furniturefuture-ed302",
  storageBucket: "furniturefuture-ed302.firebasestorage.app",
  messagingSenderId: "746220689658",
  appId: "1:746220689658:web:2fc5949203b9de6fb11143",
  measurementId: "G-GBMPN4YJ7Y"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ✅ Verificare dacă userul e logat
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("✅ User logat:", user.email);
    showProfileMenu(user);
  } else {
    console.log("🚫 User nelogat");
    showLoginMenu();
  }
});

// ✅ Login
function login(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("Logare reușită:", userCredential.user.email);
    })
    .catch((error) => {
      console.error("Eroare la login:", error.message);
    });
}

// ✅ Logout
function logout() {
  auth.signOut()
    .then(() => {
      console.log("Deconectare reușită");
    })
    .catch((error) => {
      console.error("Eroare la logout:", error.message);
    });
}

// ✅ Register (Creare cont nou)
function register(email, password) {
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("Cont creat:", userCredential.user.email);
    })
    .catch((error) => {
      console.error("Eroare la înregistrare:", error.message);
    });
}

// ✅ Schimbare meniul din profil în funcție de login/logout
function showProfileMenu(user) {
  const profileMenu = document.getElementById('profileMenu');
  profileMenu.innerHTML = `
    <a href="#">My Profile</a>
    <a href="#" onclick="logout()">Log Out</a>
  `;
}

function showLoginMenu() {
  const profileMenu = document.getElementById('profileMenu');
  profileMenu.innerHTML = `
    <a href="#" onclick="openLoginModal()">Log In</a>
  `;
}

// ✅ Exemplu funcție pentru a deschide un modal de login (opțional)
function openLoginModal() {
  alert("Aici ar trebui să apară un formular de Login!");
}

function toggleProfileMenu() {
  const menu = document.getElementById('profileMenu');
  menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';

  // Exemplu simplu: presupunem că există o variabilă "loggedIn"
  const loggedIn = localStorage.getItem('loggedIn') === 'true';

  menu.innerHTML = loggedIn
    ? '<a href="profile.html">My Profile</a><a href="#" onclick="logout()">Log Out</a>'
    : '<a href="login.html">Log In</a>';
}

function logout() {
  localStorage.setItem('loggedIn', 'false');
  location.reload();
}

