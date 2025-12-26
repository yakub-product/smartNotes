import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from './firebase-config.js';

export async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        if (error.code === 'auth/configuration-not-found' || error.message.includes('configuration-not-found')) {
            alert("Error: Email/Password authentication is not enabled in your Firebase Console.\n\nPlease go to Firebase Console > Authentication > Sign-in method and enable 'Email/Password'.");
        }
        throw error;
    }
}

export async function signup(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Signup Error Detailed:", error);
        if (error.code === 'auth/configuration-not-found' || error.message.includes('configuration-not-found')) {
            alert("Error: Email/Password authentication is not enabled in your Firebase Console.\n\nPlease go to Firebase Console > Authentication > Sign-in method and enable 'Email/Password'.");
        } else {
            throw error;
        }
    }
}

export async function logout() {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
}

export function onUserStatusChanged(callback) {
    onAuthStateChanged(auth, callback);
}
