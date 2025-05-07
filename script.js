// script.js (modular Firebase v9+)
import { auth, db } from './firebase.js';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';

// Meniu lateral
export function openMenu() {
  document.getElementById('sideMenu').style.width = '250px';
}
export function closeMenu() {
  document.getElementById('sideMenu').style.width = '0';
}

// Popup Login
export function openLoginPopup() {
  document.getElementById('loginPopup').style.display = 'flex';
}
export function closeLoginPopup() {
  document.getElementById('loginPopup').style.display = 'none';
}

// Login
export function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert('Logare reușită!');
      closeLoginPopup();
      window.location.reload();
    })
    .catch((error) => alert(error.message));
}

// Logout
export function logout() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
}

// Meniu profil
export function toggleProfileMenu() {
  const menu = document.getElementById('profileMenu');
  const user = auth.currentUser;
  if (menu.style.display === 'flex' || menu.style.display === 'block') {
    menu.style.display = 'none';
  } else {
    if (user) {
      menu.innerHTML = `<a href="profile.html">My Profile</a><a href="#" onclick="logout()">Log Out</a>`;
    } else {
      menu.innerHTML = `<a href="#" onclick="openLoginPopup()">Log In</a>`;
    }
    menu.style.display = 'block';
  }
}

// Formulare
export function showRegister() {
  document.getElementById('popupTitle').innerText = "Înregistrare";
  document.getElementById('loginButton').innerText = "Înregistrează-te";
  document.getElementById('loginButton').setAttribute("onclick", "register()")
  document.getElementById('toggleText').innerHTML = `Ai deja cont? <a href="#" onclick="showLogin()">Logare aici</a>`;
  document.getElementById('displayName').style.display = 'block';
  document.getElementById('phoneNumber').style.display = 'block';
}

export function showLogin() {
  document.getElementById('popupTitle').innerText = "Autentificare";
  document.getElementById('loginButton').innerText = "Logare";
  document.getElementById('loginButton').setAttribute("onclick", "login()")
  document.getElementById('toggleText').innerHTML = `Nu ai cont? <a href="#" onclick="showRegister()">Înregistrează-te aici</a>`;
  document.getElementById('displayName').style.display = 'none';
  document.getElementById('phoneNumber').style.display = 'none';
}

export function register() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const displayName = document.getElementById('displayName').value.trim();
  const phone = document.getElementById('phoneNumber').value.trim();

  if (!email || !password || !displayName) {
    alert("Completează toate câmpurile obligatorii!");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return updateProfile(user, {
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

// Afișare date în profil
onAuthStateChanged(auth, (user) => {
  if (document.getElementById("userEmail") && user) {
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userName").textContent = user.displayName || "Utilizator";
    document.getElementById("userPhone").textContent = localStorage.getItem("userPhone") || "Nespecificat";
  }
});

// Favorite
export function loadFavorites() {
  const user = auth.currentUser;
  if (user) {
    const favoritesRef = doc(db, 'favorites', user.uid);

    getDoc(favoritesRef).then((docSnap) => {
      const favoritesList = document.getElementById('favoritesList');
      if (docSnap.exists()) {
        const products = docSnap.data().products || [];

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
      alert("Nu s-au putut încărca favoritele.");
    });
  }
}

export function removeFromFavorites(productId) {
  const user = auth.currentUser;
  if (user) {
    const favoritesRef = doc(db, 'favorites', user.uid);
    updateDoc(favoritesRef, {
      products: arrayRemove({ id: productId })
    }).then(() => {
      alert("Produsul a fost îndepărtat.");
      loadFavorites();
    }).catch((error) => {
      console.error("Eroare la ștergerea produsului:", error);
    });
  }
}

export function addToFavorites(product) {
  const user = auth.currentUser;
  if (user) {
    const favoritesRef = doc(db, 'favorites', user.uid);
    getDoc(favoritesRef).then((docSnap) => {
      let existing = docSnap.exists() && docSnap.data().products ? docSnap.data().products : [];
      const alreadyExists = existing.some(p => p.id === product.id);

      if (!alreadyExists) {
        setDoc(favoritesRef, {
          products: arrayUnion(product)
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

window.onload = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadFavorites();
    } else {
      const favoritesList = document.getElementById('favoritesList');
      if (favoritesList) {
        favoritesList.innerHTML = `<p>Te rugăm să te autentifici pentru a vizualiza favoritele.</p>`;
      }
    }
  });
};
