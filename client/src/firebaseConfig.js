// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7a6q-ivFHpZrUBVsuPC8sP7gHV47yLSA",
  authDomain: "login-react-sara.firebaseapp.com",
  projectId: "login-react-sara",
  storageBucket: "login-react-sara.firebasestorage.app",
  messagingSenderId: "1014040159980",
  appId: "1:1014040159980:web:b8a8f192974918742fa7c9",
  measurementId: "G-8ZR52RMCYN"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Proveedor de Google
export const googleProvider = new GoogleAuthProvider();
