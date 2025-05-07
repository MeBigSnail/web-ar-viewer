// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configurația aplicației tale Firebase
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Inițializează Firebase
const app = initializeApp(firebaseConfig);

// Inițializează Firestore și Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Exportă instanțele
export { db, auth };
