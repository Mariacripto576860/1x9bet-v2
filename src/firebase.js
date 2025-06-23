// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqPY1qs-sZNZb9CH2WEAo0Y2A_PeKxXoQ",
  authDomain: "x9bet-7eaaf.firebaseapp.com",
  projectId: "x9bet-7eaaf",
  storageBucket: "x9bet-7eaaf.appspot.com", // Corrigido aqui
  messagingSenderId: "809779028179",
  appId: "1:809779028179:web:87bee2b2ff35a4f3183426"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta Auth e Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);