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
                                                      //Funcții pentru meniu lateral

function openMenu() {
  document.getElementById('sideMenu').style.width = '250px';
}
function closeMenu() {
  document.getElementById('sideMenu').style.width = '0';
}
                                                    //Funcție pentru togglare Meniul Profil

function toggleProfileMenu() {
  const menu = document.getElementById('profileMenu');

  if (menu.style.display === 'flex' || menu.style.display === 'block') {
    menu.style.display = 'none';
  } else {
    // Înainte să arătăm meniul, setăm ce linkuri afișăm în funcție dacă userul e logat
    const user = firebase.auth().currentUser;

    if (user) {
      // User logat
      menu.innerHTML = `
        <a href="profile.html">My Profile</a>
        <a href="#" onclick="logout()">Log Out</a>
      `;
    } else {
      // User nelogat
      menu.innerHTML = `
        <a href="#" onclick="openLoginPopup()">Log In</a>
      `;
    }

    menu.style.display = 'block'; // sau 'flex', depinde de stilul tău
  }
}

                                              //Când starea utilizatorului se schimbă (logat sau nelogat)

auth.onAuthStateChanged((user) => {
  const profileMenu = document.getElementById('profileMenu');
  if (!profileMenu) return; // Siguranță dacă nu există încă div-ul

  if (user) {
    console.log("User logat:", user.email);
    profileMenu.innerHTML = `
      <a href="profile.html">My Profile</a>
      <a href="#" onclick="logout()">Log Out</a>
    `;
  } else {
    console.log("User nelogat");
    profileMenu.innerHTML = `
      <a href="login.html">Log In</a>
    `;
  }
});
                                              // Funcție Logout

function logout() {
  auth.signOut()
    .then(() => {
      console.log("Deconectare reușită");
      window.location.reload(); // Reîncarcă pagina după delogare
    })
    .catch((error) => {
      console.error("Eroare la logout:", error.message);
    });
}

// Deschide popup Login
function openLoginPopup() {
  document.getElementById('loginPopup').style.display = 'flex';
}

// Închide popup Login
function closeLoginPopup() {
  document.getElementById('loginPopup').style.display = 'none';
}

// Login prin Firebase
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
