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
    menu.style.display = 'block';
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
