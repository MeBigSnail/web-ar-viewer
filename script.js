// Inițializare Firebase
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
    .then(() => {
      alert('Logare reușită!');
      closeLoginPopup();
      window.location.reload(); // Reîncarcă pagina pentru a reflecta autentificarea
    })
    .catch((error) => alert(error.message));
}

// Logout
function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}

// Meniu profil
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

// Trecere la formular înregistrare
function showRegister() {
  document.getElementById('popupTitle').innerText = "Înregistrare";
  document.getElementById('loginButton').innerText = "Înregistrează-te";
  document.getElementById('loginButton').setAttribute("onclick", "register()");
  document.getElementById('toggleText').innerHTML = `Ai deja cont? <a href="#" onclick="showLogin()">Logare aici</a>`;
  document.getElementById('displayName').style.display = 'block';
  document.getElementById('phoneNumber').style.display = 'block';
}

// Trecere la formular logare
function showLogin() {
  document.getElementById('popupTitle').innerText = "Autentificare";
  document.getElementById('loginButton').innerText = "Logare";
  document.getElementById('loginButton').setAttribute("onclick", "login()");
  document.getElementById('toggleText').innerHTML = `Nu ai cont? <a href="#" onclick="showRegister()">Înregistrează-te aici</a>`;
  document.getElementById('displayName').style.display = 'none';
  document.getElementById('phoneNumber').style.display = 'none';
}

// Înregistrare nouă
function register() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const displayName = document.getElementById('displayName').value.trim();
  const phone = document.getElementById('phoneNumber').value.trim();

  if (!email || !password || !displayName) {
    alert("Completează toate câmpurile obligatorii!");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user.updateProfile({
        displayName: displayName
      }).then(() => {
        localStorage.setItem("userPhone", phone);
        alert("Cont creat!");
        closeLoginPopup();
        window.location.reload(); // Reîncarcă pagina după înregistrare
      });
    })
    .catch((error) => alert(error.message));
}

// Afișare date în profil
auth.onAuthStateChanged((user) => {
  if (document.getElementById("userEmail") && user) {
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userName").textContent = user.displayName || "Utilizator";
    document.getElementById("userPhone").textContent = localStorage.getItem("userPhone") || "Nespecificat";
  }
});


//
// Asigură-te că autentificarea este gestionată corect
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("Utilizator logat:", user.email);
    loadFavorites(); // se apelează doar când utilizatorul este autentificat
  } else {
    console.log("Utilizator NElogat.");
    alert("Te rugăm să te autentifici pentru a vizualiza favoritele.");
  }
});

// Funcție pentru a încărca favoritele
function loadFavorites() {
  const user = firebase.auth().currentUser;
  if (user) {
    console.log('Utilizator autentificat, încărcăm favoritele...');
    const favoritesRef = firebase.firestore().collection('favorites').doc(user.uid);

    favoritesRef.get().then((doc) => {
      if (doc.exists) {
        const products = doc.data().products;
        const favoritesList = document.getElementById('favoritesList');

        if (products.length === 0) {
          favoritesList.innerHTML = '<p>Nu ai adăugat niciun produs la favorite.</p>';
        } else {
          favoritesList.innerHTML = ''; // Curățăm lista înainte de a adăuga noi produse
          products.forEach((product) => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
              <img src="${product.image}" alt="${product.name}">
              <h2>${product.name}</h2>
              <a href="product.html?model=${product.id}.glb">Vezi în AR</a>
              <button onclick="removeFromFavorites('${product.id}')">Îndepărtează din favorite</button>
            `;
            favoritesList.appendChild(productCard);
          });
        }
      } else {
        console.log('Nu au fost găsite favorite pentru acest utilizator.');
      }
    }).catch((error) => {
      console.error('Eroare la încărcarea favorite: ', error);
    });
  } else {
    console.log('Nu ești autentificat, nu se pot încărca favoritele.');
    alert('Te rugăm să te autentifici pentru a vizualiza favoritele.');
  }
}

// Funcție pentru a îndepărta un produs din favorite
function removeFromFavorites(productId) {
  const user = firebase.auth().currentUser;
  if (user) {
    const favoritesRef = firebase.firestore().collection('favorites').doc(user.uid);
    favoritesRef.update({
      products: firebase.firestore.FieldValue.arrayRemove({
        id: productId
      })
    }).then(() => {
      console.log('Produsul a fost îndepărtat din favorite.');
      alert('Produsul a fost îndepărtat din favorite.');
      // Refreshem lista pentru a reflecta modificările
      document.getElementById('favoritesList').innerHTML = '';
      loadFavorites();
    }).catch((error) => {
      console.error('Eroare la îndepărtarea produsului: ', error);
    });
  }
}

// Afișare favorite la încărcarea paginii
window.onload = function() {
  console.log('Încărcăm favoritele...');
  loadFavorites();
};




