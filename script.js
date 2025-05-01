const firebaseConfig = {
  apiKey: "AIzaSyDQjt5Vqyp7zs5ppnZasuNHKkGg6DTGFQU",
  authDomain: "furniturefuture-ed302.firebaseapp.com",
  projectId: "furniturefuture-ed302",
  storageBucket: "furniturefuture-ed302.appspot.com",
  messagingSenderId: "746220689658",
  appId: "1:746220689658:web:2fc5949203b9de6fb11143",
  measurementId: "G-GBMPN4YJ7Y"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function openMenu() {
  document.getElementById('sideMenu').style.width = '250px';
}
function closeMenu() {
  document.getElementById('sideMenu').style.width = '0';
}
function openLoginPopup() {
  document.getElementById('loginPopup').style.display = 'flex';
}
function closeLoginPopup() {
  document.getElementById('loginPopup').style.display = 'none';
}

function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert('Logare reușită!');
      closeLoginPopup();
      window.location.reload();
    })
    .catch((error) => alert(error.message));
}

function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}

function toggleProfileMenu() {
  const menu = document.getElementById('profileMenu');
  if (menu.style.display === 'flex' || menu.style.display === 'block') {
    menu.style.display = 'none';
  } else {
    const user = firebase.auth().currentUser;
    if (user) {
      menu.innerHTML = `<a href="profile.html">My Profile</a><a href="#" onclick="logout()">Log Out</a>`;
    } else {
      menu.innerHTML = `<a href="#" onclick="openLoginPopup()">Log In</a>`;
    }
    menu.style.display = 'block';
  }
}

function showRegister() {
  document.getElementById('popupTitle').innerText = "Înregistrare";
  document.getElementById('loginButton').innerText = "Înregistrează-te";
  document.getElementById('loginButton').setAttribute("onclick", "register()");
  document.getElementById('toggleText').innerHTML = `Ai deja cont? <a href="#" onclick="showLogin()">Logare aici</a>`;
  document.getElementById('displayName').style.display = 'block';
  document.getElementById('phoneNumber').style.display = 'block';
  document.getElementById('photoURL').style.display = 'block';
}

function showLogin() {
  document.getElementById('popupTitle').innerText = "Autentificare";
  document.getElementById('loginButton').innerText = "Logare";
  document.getElementById('loginButton').setAttribute("onclick", "login()");
  document.getElementById('toggleText').innerHTML = `Nu ai cont? <a href="#" onclick="showRegister()">Înregistrează-te aici</a>`;
  document.getElementById('displayName').style.display = 'none';
  document.getElementById('phoneNumber').style.display = 'none';
  document.getElementById('photoURL').style.display = 'none';
}

function register() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const displayName = document.getElementById('displayName').value.trim();
  const phone = document.getElementById('phoneNumber').value.trim();
  const photoURL = document.getElementById('photoURL').value.trim();

  if (!email || !password || !displayName) {
    alert("Completează toate câmpurile obligatorii!");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user.updateProfile({
        displayName: displayName,
        photoURL: photoURL || "assets/default-user.png"
      }).then(() => {
        localStorage.setItem("userPhone", phone);
        alert("Cont creat!");
        closeLoginPopup();
        window.location.reload();
      });
    })
    .catch((error) => alert(error.message));
}

auth.onAuthStateChanged((user) => {
  if (document.getElementById("userEmail") && user) {
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userName").textContent = user.displayName || "Utilizator";
    document.getElementById("userPhoto").src = user.photoURL || "assets/default-user.png";
    document.getElementById("userUID").textContent = user.uid;
    document.getElementById("userPhone").textContent = localStorage.getItem("userPhone") || "Nespecificat";
  }
});
