/* ─────────────────────────────────────────────────────────
   firebase-init.js
   Shared Firebase setup, loaded straight from Google's CDN —
   no npm install / build step needed since this is a plain
   static site. Imported by admin.js and news.js.
   ───────────────────────────────────────────────────────── */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAjPjpy5uoeA2S8uctKcBJLpi9KTcJlmQU",
  authDomain: "snflse-site.firebaseapp.com",
  projectId: "snflse-site",
  storageBucket: "snflse-site.firebasestorage.app",
  messagingSenderId: "382688602040",
  appId: "1:382688602040:web:5be11fb281c74ae6aa114d"
};

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

export {
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
  collection, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc, getDocs,
  query, orderBy, serverTimestamp
};
