// Inițializare Firebase
const firebaseConfig = {
  apiKey: "AIzaxxxxxxx",
  authDomain: "catalog-mobila.firebaseapp.com",
  projectId: "catalog-mobila",
  storageBucket: "catalog-mobila.appspot.com",
  messagingSenderId: "xxxxxxx",
  appId: "x:xxxxxxxxx:web:xxxxxxx"
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

    menu.style.display = 'block';
  }
}
