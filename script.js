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
const db = firebase.firestore(); // ✅ Firestore inițializat corect

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
      window.location.reload();
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
    const user = auth.currentUser;
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

// Înregistrare
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
        window.location.reload();
      });
    })
    .catch((error) => alert(error.message));
}

// Afișare date profil
auth.onAuthStateChanged((user) => {
  if (document.getElementById("userEmail") && user) {
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userName").textContent = user.displayName || "Utilizator";
    document.getElementById("userPhone").textContent = localStorage.getItem("userPhone") || "Nespecificat";
  }
});

// Încărcare favorite
function loadFavorites() {
  const user = auth.currentUser;
  if (user) {
    console.log('Utilizator autentificat, încărcăm favoritele...');
    const favoritesRef = db.collection('favorites').doc(user.uid);

    favoritesRef.get().then((doc) => {
      const favoritesList = document.getElementById('favoritesList');
      if (doc.exists) {
        const products = doc.data().products || [];

        if (products.length === 0) {
          favoritesList.innerHTML = '<p>Nu ai adăugat niciun produs la favorite.</p>';
        } else {
          favoritesList.innerHTML = '';
          products.forEach((product) => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.innerHTML = `
              <img src="${product.image}" alt="${product.name}">
              <h2>${product.name}</h2>
              <a href="product.html?model=${product.id}.glb">Vezi în AR</a>
              <button onclick="removeFromFavorites('${product.id}')">Îndepărtează din favorite</button>
            `;
            favoritesList.appendChild(card);
          });
        }
      } else {
        favoritesList.innerHTML = '<p>Nu ai adăugat niciun produs la favorite.</p>';
      }
    }).catch((error) => {
      console.error('Eroare la încărcarea favorite: ', error);
      alert("Nu s-au putut încărca favoritele. Verifică conexiunea la internet sau setările Firebase.");
    });
  } else {
    console.log("Nu ești autentificat, nu se pot încărca favoritele.");
  }
}

// Îndepărtare produs
function removeFromFavorites(productId) {
  const user = auth.currentUser;
  if (user) {
    const favoritesRef = db.collection('favorites').doc(user.uid);
    favoritesRef.update({
      products: firebase.firestore.FieldValue.arrayRemove({ id: productId })
    }).then(() => {
      alert("Produsul a fost îndepărtat.");
      loadFavorites();
    }).catch((error) => {
      console.error("Eroare la ștergerea produsului:", error);
    });
  }
}
function addToFavorites(product) {
  const user = firebase.auth().currentUser;
  if (user) {
    const favoritesRef = firebase.firestore().collection("favorites").doc(user.uid);

    // Adaugă produsul dacă nu există deja
    favoritesRef.get().then((doc) => {
      let existing = doc.exists && doc.data().products ? doc.data().products : [];
      const alreadyExists = existing.some(p => p.id === product.id);

      if (!alreadyExists) {
        favoritesRef.set({
          products: firebase.firestore.FieldValue.arrayUnion(product)
        }, { merge: true }).then(() => {
          alert("Produsul a fost adăugat la favorite!");
        }).catch((error) => {
          console.error("Eroare la salvarea produsului:", error);
        });
      } else {
        alert("Produsul este deja în favorite.");
      }
    });
  } else {
    alert("Trebuie să te autentifici pentru a adăuga la favorite.");
  }
}

// Când pagina se încarcă
window.onload = () => {
  console.log('Încărcăm favoritele...');
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("Utilizator logat:", user.email);
      loadFavorites();
    } else {
      console.log("Utilizator neautentificat.");
      const favoritesList = document.getElementById('favoritesList');
      if (favoritesList) {
        favoritesList.innerHTML = `<p>Te rugăm să te autentifici pentru a vizualiza favoritele.</p>`;
      }
    }
  });
};

firebase.auth().onAuthStateChanged(user => {
  console.log("UID autentificat:", user?.uid);
});

