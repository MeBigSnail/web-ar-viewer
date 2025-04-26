// Inițializare Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDQjt5Vqyp7zs5ppnZasuNHKkGg6DTGFQU",
  authDomain: "furniturefuture-ed302.firebaseapp.com",
  projectId: "furniturefuture-ed302",
  storageBucket: "furniturefuture-ed302.firebasestorage.app",
  messagingSenderId: "746220689658",
  appId: "1:746220689658:web:2fc5949203b9de6fb11143",
  measurementId: "G-GBMPN4YJ7Y"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Meniu lateral
function openMenu() {
  document.getElementById('sideMenu').style.width = '250px';
}
function closeMenu() {
  document.getElementById('sideMenu').style.width = '0';
}

// Popup Login
function openLoginPopup() {
  document.getElementById('loginPopup').style.display = 'flex';
}
function closeLoginPopup() {
  document.getElementById('loginPopup').style.display = 'none';
}

// Login
function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert('Logare reușită!');
      closeLoginPopup();
      window.location.reload();
    })
    .catch((error) => {
      alert(error.message);
    });
}

// Logout
function logout() {
  auth.signOut()
    .then(() => {
      console.log("Delogat cu succes");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Eroare la delogare:", error.message);
    });
}

// Meniul de profil când apeși pe 👤
function toggleProfileMenu() {
  const menu = document.getElementById('profileMenu');

  if (menu.style.display === 'flex' || menu.style.display === 'block') {
    menu.style.display = 'none';
  } else {
    const user = firebase.auth().currentUser;

    if (user) {
      menu.innerHTML = `
        <a href="profile.html">My Profile</a>
        <a href="#" onclick="logout()">Log Out</a>
      `;
    } else {
      menu.innerHTML = `
        <a href="#" onclick="openLoginPopup()">Log In</a>
      `;
    }

          // Funcție pentru Register
    
function register() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert('Cont creat cu succes!');
      closeLoginPopup();
      window.location.reload();
    })
    .catch((error) => {
      alert(error.message);
    });
}
    menu.style.display = 'block';
  }
}

function showRegister() {
  document.getElementById('popupTitle').innerText = "Înregistrare";
  document.getElementById('loginButton').innerText = "Înregistrează-te";
  document.getElementById('loginButton').setAttribute("onclick", "register()");
  document.getElementById('toggleText').innerHTML = `Ai deja cont? <a href="#" onclick="showLogin()">Logare aici</a>`;
}

function showLogin() {
  document.getElementById('popupTitle').innerText = "Autentificare";
  document.getElementById('loginButton').innerText = "Logare";
  document.getElementById('loginButton').setAttribute("onclick", "login()");
  document.getElementById('toggleText').innerHTML = `Nu ai cont? <a href="#" onclick="showRegister()">Înregistrează-te aici</a>`;
}

