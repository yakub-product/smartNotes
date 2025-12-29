import { login, signup, onUserStatusChanged } from './auth.js';

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignupBtn = document.getElementById('show-signup');
const showLoginBtn = document.getElementById('show-login');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// Toggle Forms
showSignupBtn.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
});

showLoginBtn.addEventListener('click', () => {
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Show Toast
function showToast(message, type = 'info') {
    toastMessage.textContent = message;
    toast.className = `fixed bottom-4 right-4 bg-slate-800 border-l-4 ${type === 'error' ? 'border-red-500' : 'border-blue-500'} text-white px-6 py-4 rounded shadow-lg transform translate-y-0 opacity-100 transition-all duration-300 z-50`;
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// Handle Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        showToast('Logging in...', 'info');
        await login(email, password);
        // Redirect handled by onUserStatusChanged
    } catch (error) {
        showToast(error.message, 'error');
    }
});

// Handle Signup
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        showToast('Creating account...', 'info');
        await signup(email, password);
        showToast('Account created!', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    }
});

// Auth State Listener
onUserStatusChanged((user) => {
    if (user) {
        console.log("User detected, redirecting to dashboard...");
        window.location.replace('dashboard.html');
    } else {
        console.log("No user session found on landing page.");
    }
});
