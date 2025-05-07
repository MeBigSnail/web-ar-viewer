// firebase.js (pentru Firebase 8.10)
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQjt5Vqyp7zs5ppnZasuNHKkGg6DTGFQU",
  authDomain: "furniturefuture-ed302.firebaseapp.com",
  projectId: "furniturefuture-ed302",
  storageBucket: "furniturefuture-ed302.appspot.com",
  messagingSenderId: "746220689658",
  appId: "1:746220689658:web:2fc5949203b9de6fb11143",
  measurementId: "G-GBMPN4YJ7Y"
};

// Inițializează Firebase (doar dacă nu a fost deja inițializat)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Exportă instanțele necesare
const auth = firebase.auth();
const db = firebase.firestore();

export { firebase, auth, db };
