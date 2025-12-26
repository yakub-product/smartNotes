import { db, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, onSnapshot } from './firebase-config.js';

export function subscribeToNotes(userId, callback) {
    const notesRef = collection(db, "users", userId, "notes");
    const q = query(notesRef, orderBy("updatedAt", "desc"));
    return onSnapshot(q, (querySnapshot) => {
        const notes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(notes);
    }, (error) => {
        console.error("Error subscribing to notes:", error);
    });
}

export async function createNote(userId, noteData) {
    try {
        const notesRef = collection(db, "users", userId, "notes");
        const docRef = await addDoc(notesRef, {
            ...noteData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating note:", error);
        throw error;
    }
}

export async function getNotes(userId) {
    try {
        const notesRef = collection(db, "users", userId, "notes");
        const q = query(notesRef, orderBy("updatedAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching notes:", error);
        throw error;
    }
}

export async function updateNote(userId, noteId, updateData) {
    try {
        const noteRef = doc(db, "users", userId, "notes", noteId);
        await updateDoc(noteRef, {
            ...updateData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating note:", error);
        throw error;
    }
}

export async function deleteNote(userId, noteId) {
    try {
        const noteRef = doc(db, "users", userId, "notes", noteId);
        await deleteDoc(noteRef);
    } catch (error) {
        console.error("Error deleting note:", error);
        throw error;
    }
}
