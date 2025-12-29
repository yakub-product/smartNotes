import { logout, onUserStatusChanged } from './auth.js';
import { createNote, subscribeToNotes, updateNote, deleteNote } from './notes.js';
import { generateSummary, explainConcept, generateQuiz, enhanceNote, getStudyTips } from './ai.js';

let currentUser = null;
let currentNoteId = null;
let notes = [];
let saveTimeout = null;
let notesUnsubscribe = null;
let isInternalUpdate = false;

// Elements
const noteList = document.getElementById('note-list');
const emptyState = document.getElementById('empty-state');
const editorContainer = document.getElementById('editor-container');
const titleInput = document.getElementById('note-title');
const contentInput = document.getElementById('note-content');
const subjectInput = document.getElementById('note-subject');
const createBtn = document.getElementById('create-note-btn');
const deleteBtn = document.getElementById('delete-note-btn');
const manualSaveBtn = document.getElementById('manual-save-btn');
const saveStatus = document.getElementById('save-status');
const logoutBtn = document.getElementById('logout-btn');
const userEmailSpan = document.getElementById('user-email');
const appLoader = document.getElementById('app-loader');
const searchInput = document.getElementById('search-notes');
const sidebar = document.querySelector('aside');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');

// AI Modal Elements
const aiModal = document.getElementById('ai-modal');
const aiModalTitle = document.getElementById('ai-modal-title');
const aiContent = document.getElementById('ai-content');
const aiLoading = document.getElementById('ai-loading');
const closeModalBtn = document.getElementById('close-modal');
const copyAiBtn = document.getElementById('copy-ai-btn');
const appendNoteBtn = document.getElementById('append-note-btn');

// Check Auth
onUserStatusChanged(async (user) => {
    try {
        if (!user) {
            console.log("No user found, redirecting to login...");
            window.location.replace('index.html');
        } else {
            console.log("Authenticated as:", user.email);
            currentUser = user;
            if (userEmailSpan) userEmailSpan.textContent = user.email;

            // 1. Hide the loader
            if (appLoader) {
                appLoader.classList.add('hidden');
                console.log("Dashboard loader hidden.");
            }

            // 2. Ensure empty state is shown centrally on first load
            closeEditor();

            setupNotesSubscription();
        }
    } catch (error) {
        console.error("Dashboard Auth Error:", error);
        if (appLoader) appLoader.classList.add('hidden');
    }
});

function setupNotesSubscription() {
    try {
        if (notesUnsubscribe) notesUnsubscribe();
        notesUnsubscribe = subscribeToNotes(currentUser.uid, (updatedNotes) => {
            notes = updatedNotes;
            renderNoteList();

            if (currentNoteId && !notes.find(n => n.id === currentNoteId)) {
                closeEditor();
            }
        });
    } catch (error) {
        console.error("Setup subscription error:", error);
        if (appLoader) appLoader.classList.add('hidden'); // Force hide loader if error
    }
}

function closeEditor() {
    currentNoteId = null;
    if (emptyState) emptyState.classList.remove('hidden');
    if (editorContainer) editorContainer.classList.add('hidden');
}

function renderNoteList() {
    if (!noteList) return;
    noteList.innerHTML = '';

    const queryTerm = searchInput?.value?.toLowerCase() || '';
    const filteredNotes = notes.filter(n =>
        (n.title?.toLowerCase().includes(queryTerm)) ||
        (n.content?.toLowerCase().includes(queryTerm)) ||
        (n.subject?.toLowerCase().includes(queryTerm))
    );

    if (filteredNotes.length === 0) {
        noteList.innerHTML = `<div class="text-sm text-slate-500 text-center mt-4">${queryTerm ? 'No notes match search.' : 'No notes yet.'}</div>`;
        return;
    }

    filteredNotes.forEach(note => {
        const div = document.createElement('div');
        div.className = `p-3 rounded-lg cursor-pointer transition-colors mb-2 ${currentNoteId === note.id ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-slate-800'}`;
        div.innerHTML = `
            <div class="flex justify-between items-start">
                <h3 class="font-semibold text-slate-100 truncate flex-1">${note.title || 'Untitled'}</h3>
                ${note.subject ? `<span class="ml-2 px-2 py-0.5 bg-slate-700 text-[10px] text-blue-300 rounded-full uppercase tracking-wider">${note.subject}</span>` : ''}
            </div>
            <p class="text-xs text-slate-400 truncate mt-1">${note.content?.substring(0, 40) || 'No content'}</p>
        `;
        div.onclick = () => selectNote(note.id);
        noteList.appendChild(div);
    });
}

searchInput?.addEventListener('input', renderNoteList);

// Mobile Menu Toggle
mobileMenuBtn?.addEventListener('click', () => {
    sidebar?.classList.toggle('hidden');
    sidebar?.classList.toggle('fixed');
    sidebar?.classList.toggle('inset-0');
    sidebar?.classList.toggle('z-50');
    sidebar?.classList.toggle('w-full');
});

async function selectNote(id) {
    if (currentNoteId && id !== currentNoteId) {
        await forceSave();
    }

    currentNoteId = id;
    const note = notes.find(n => n.id === id);
    if (!note) return;

    isInternalUpdate = true;
    if (titleInput) titleInput.value = note.title || '';
    if (contentInput) contentInput.value = note.content || '';
    if (subjectInput) subjectInput.value = note.subject || 'General';
    isInternalUpdate = false;

    if (emptyState) emptyState.classList.add('hidden');
    if (editorContainer) editorContainer.classList.remove('hidden');

    // Auto-hide sidebar on mobile after selecting a note
    if (window.innerWidth < 768) {
        sidebar?.classList.add('hidden');
        sidebar?.classList.remove('fixed', 'inset-0', 'z-50', 'w-full');
    }

    renderNoteList();
}

createBtn?.addEventListener('click', async () => {
    try {
        const newNote = { title: 'New Note', content: '', subject: 'General' };
        const id = await createNote(currentUser.uid, newNote);
        selectNote(id);
        showToast("Note created", "success");
    } catch (error) {
        showToast("Failed to create note", "error");
    }
});

async function forceSave() {
    if (saveTimeout) clearTimeout(saveTimeout);
    if (!currentNoteId || !currentUser) return;
    try {
        await updateNote(currentUser.uid, currentNoteId, {
            title: titleInput.value,
            content: contentInput.value,
            subject: subjectInput.value || 'General'
        });
        if (saveStatus) saveStatus.textContent = "Saved";
    } catch (error) {
        console.error("Save error:", error);
    }
}

function autoSave() {
    if (isInternalUpdate) return;
    if (saveTimeout) clearTimeout(saveTimeout);
    if (saveStatus) saveStatus.textContent = "Saving...";

    saveTimeout = setTimeout(async () => {
        await forceSave();
    }, 1500);
}

titleInput?.addEventListener('input', autoSave);
contentInput?.addEventListener('input', autoSave);
subjectInput?.addEventListener('input', autoSave);

deleteBtn?.addEventListener('click', async () => {
    if (!currentNoteId || !currentUser || !confirm("Are you sure you want to delete this note?")) return;
    try {
        await deleteNote(currentUser.uid, currentNoteId);
        closeEditor();
        showToast("Note deleted", "success");
    } catch (error) {
        showToast("Failed to delete note", "error");
    }
});

logoutBtn?.addEventListener('click', async () => {
    await logout();
    window.location.href = 'index.html';
});

window.handleAI = async (type) => {
    if (!contentInput) return;
    const content = contentInput.value;
    const selection = window.getSelection().toString();
    const textToProcess = (type === 'explain' && selection) ? selection : content;

    if (!textToProcess && type !== 'tips') {
        showToast(type === 'explain' ? "Select text to explain" : "Note is empty", "error");
        return;
    }

    if (aiModal) aiModal.classList.remove('hidden');
    if (aiContent) aiContent.innerHTML = '';
    if (aiLoading) aiLoading.classList.remove('hidden');

    let displayType = type;
    if (type === 'tips') displayType = 'Study Tips';

    if (aiModalTitle) aiModalTitle.innerHTML = `<span class="w-2 h-2 rounded-full bg-purple-500"></span> ${displayType.charAt(0).toUpperCase() + displayType.slice(1)}`;

    try {
        let result = "";
        if (type === 'summarize') result = await generateSummary(content);
        if (type === 'explain') result = await explainConcept(textToProcess);
        if (type === 'quiz') result = await generateQuiz(content);
        if (type === 'enhance') result = await enhanceNote(content);
        if (type === 'tips') result = await getStudyTips(content, subjectInput?.value);

        if (aiLoading) aiLoading.classList.add('hidden');
        if (aiContent) aiContent.innerHTML = result.replace(/\n/g, '<br>');
    } catch (error) {
        if (aiLoading) aiLoading.classList.add('hidden');
        if (aiContent) aiContent.textContent = "Error: " + error.message;
    }
};

closeModalBtn?.addEventListener('click', () => aiModal?.classList.add('hidden'));

copyAiBtn?.addEventListener('click', () => {
    if (aiContent) {
        navigator.clipboard.writeText(aiContent.innerText);
        showToast("Copied to clipboard", "success");
    }
});

appendNoteBtn?.addEventListener('click', () => {
    if (contentInput && aiContent) {
        const currentVal = contentInput.value;
        contentInput.value = currentVal + "\n\n--- AI Assistant ---\n" + aiContent.innerText;
        autoSave();
        aiModal?.classList.add('hidden');
        showToast("Added to note", "success");
    }
});

manualSaveBtn?.addEventListener('click', async () => {
    if (!currentNoteId || !currentUser) return;
    try {
        manualSaveBtn.classList.add('animate-pulse', 'bg-blue-800');
        await forceSave();
        showToast("Manually Saved", "success");
        setTimeout(() => manualSaveBtn.classList.remove('animate-pulse', 'bg-blue-800'), 500);
    } catch (error) {
        showToast("Save Failed", "error");
    }
});

function showToast(message, type) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;

    // UI Feedback styling
    if (type === 'error') {
        toast.classList.remove('border-blue-500');
        toast.classList.add('border-red-500');
    } else {
        toast.classList.remove('border-red-500');
        toast.classList.add('border-blue-500');
    }

    // Animation Toggle
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3000);
}
