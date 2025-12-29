import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAmuvDP5KPt61CvVCTEBwLG2O_bgJwXoSI",
    authDomain: "smartnotes-e2a2b.firebaseapp.com",
    projectId: "smartnotes-e2a2b",
    storageBucket: "smartnotes-e2a2b.firebasestorage.app",
    messagingSenderId: "666853593104",
    appId: "1:666853593104:web:12a21bbd916ed5938c3a95",
    measurementId: "G-NYBQ875S0F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let analytics;

try {
    analytics = getAnalytics(app);
} catch (e) {
    console.warn("Analytics failed to load:", e);
}

export { app, analytics, db, auth, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, onSnapshot, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged };
