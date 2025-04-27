// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCN8q1uF4Ox5drhgQLY3m-oCEt8suSlRfs", // Replace with your actual API key
    authDomain: "ahjincc.firebaseapp.com",
    databaseURL: "https://ahjincc-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ahjincc",
    storageBucket: "ahjincc.firebasestorage.app",
    messagingSenderId: "287401404736",
    appId: "1:287401404736:web:88fbe3b9bf4c4c20ae32a5",
    measurementId: "G-FLKN369J4M"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const googleLoginBtn = document.getElementById('googleLogin');
const googleRegisterBtn = document.getElementById('googleRegister');
const githubLoginBtn = document.getElementById('githubLogin');
const githubRegisterBtn = document.getElementById('githubRegister');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');
const successModal = document.getElementById('successModal');
const successMessage = document.getElementById('successMessage');
const successDoneBtn = document.getElementById('successDoneBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const registerPassword = document.getElementById('registerPassword');
const strengthSegments = document.querySelectorAll('.strength-segment');
const strengthText = document.querySelector('.strength-text');

// Theme Toggle
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Check for saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// Auth Tabs
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabTarget = tab.getAttribute('data-tab');
        
        // Update active tab
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Hide all forms first
        authForms.forEach(form => {
            form.classList.remove('active');
        });
        
        // Show the corresponding form
        if (tabTarget === 'login') {
            loginForm.classList.add('active');
        } else {
            registerForm.classList.add('active');
        }
    });
});

// Toggle Password Visibility
togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        const icon = btn.querySelector('.material-icons');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.textContent = 'visibility';
        } else {
            input.type = 'password';
            icon.textContent = 'visibility_off';
        }
    });
});

// Password Length Validator
registerPassword.addEventListener('input', function() {
    const errorMessage = document.getElementById('password-error');
    const password = document.getElementById('registerPassword').value;
    
    if (password && (password.length < 6 || password.length > 16)) {
        errorMessage.style.display = 'block';
        registerPassword.style.borderColor = 'red';
    } else {
        errorMessage.style.display = 'none';
        registerPassword.style.borderColor = '';
    }
});

// Password Strength Meter
registerPassword.addEventListener('input', () => {
    const password = registerPassword.value;
    const passwordStrengthContainer = document.querySelector('.password-strength');
    passwordStrengthContainer.style.display = password.length > 0 ? 'block' : 'none';

    const strength = checkPasswordStrength(password);
    
    // Reset all segments
    strengthSegments.forEach(segment => {
        segment.className = 'strength-segment';
    });
    
    if (password.length === 0) {
        strengthText.textContent = 'Password strength';
        return;
    }
    
    if (strength === 'weak') {
        strengthSegments[0].classList.add('weak');
        strengthText.textContent = 'Weak';
    } else if (strength === 'medium') {
        strengthSegments[0].classList.add('medium');
        strengthSegments[1].classList.add('medium');
        strengthText.textContent = 'Medium';
    } else if (strength === 'strong') {
        strengthSegments[0].classList.add('strong');
        strengthSegments[1].classList.add('strong');
        strengthSegments[2].classList.add('strong');
        strengthText.textContent = 'Strong';
    } else if (strength === 'very-strong') {
        strengthSegments.forEach(segment => {
            segment.classList.add('strong');
        });
        strengthText.textContent = 'Very Strong';
    }
});

function checkPasswordStrength(password) {
    const length = password.length;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const criteria = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChars].filter(Boolean).length;
    
    if (length < 6) {
        return 'weak';
    } else if (length < 8 || criteria < 2) {
        return 'medium';
    } else if (length < 10 || criteria < 3) {
        return 'strong';
    } else {
        return 'very-strong';
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const passwordInputs = document.querySelectorAll('input[type="password"]');

    passwordInputs.forEach(input => {
        const toggleBtn = input.parentElement.querySelector(".toggle-password");

        input.addEventListener("input", function () {
            if (input.value.length > 0) {
                toggleBtn.style.display = "inline-block";
            } else {
                toggleBtn.style.display = "none";
            }
        });
    });
})

// Show Loading
function showLoading() {
    loadingOverlay.classList.add('active');
}

// Hide Loading
function hideLoading() {
    loadingOverlay.classList.remove('active');
}

// Show Success Modal
function showSuccessModal(message) {
    successMessage.textContent = message;
    successModal.classList.add('active');
    
    setTimeout(() => {
        window.location.href = '/landing/landing.html'; 
    }, 2000);
}

// Email/Password Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        showLoading();
        await auth.signInWithEmailAndPassword(email, password);
        hideLoading();
        showSuccessModal('You have successfully logged in!');
    } catch (error) {
        hideLoading();
        console.log(error)
        const errorMessage = extractErrorMessage(error);
        showErrorMessage(`Login failed: ${errorMessage}`);
    }
});

// Parse the error for login - issues
function extractErrorMessage(error) {
    if (error && error.message && error.message.startsWith('{"error":')) {
        try {
            const parsedMessage = JSON.parse(error.message);
            return parsedMessage.error.message || 'An unknown error occurred.';
        } catch (e) {
            return 'An error occurred. Please try again later.';
        }
    }
    return error.code || 'An unknown error occurred.';
}

// Email/Password Registration
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showErrorMessage('Passwords do not match!');
        return;
    }
    
    try {
        showLoading();
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Update profile with name
        await userCredential.user.updateProfile({
            displayName: name
        });
        
        hideLoading();
        showSuccessModal('Your account has been created successfully!');
    } catch (error) {
        hideLoading();
        showErrorMessage(`Registration failed: ${error.message}`);
    }
});

// Google Authentication
async function signInWithGoogle() {
    try {
        showLoading();
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
        hideLoading();
        showSuccessModal('You have successfully logged in with Google!');
    } catch (error) {
        hideLoading();
        showErrorMessage(`Google sign-in failed: ${error.message}`);
    }
}

googleLoginBtn.addEventListener('click', signInWithGoogle);
googleRegisterBtn.addEventListener('click', signInWithGoogle);

// GitHub Authentication
async function signInWithGithub() {
    try {
        showLoading();
        const provider = new firebase.auth.GithubAuthProvider();
        await auth.signInWithPopup(provider);
        hideLoading();
        showSuccessModal('You have successfully logged in with GitHub!');
    } catch (error) {
        hideLoading();
        showErrorMessage(`GitHub sign-in failed: ${error.message}`);
    }
}

githubLoginBtn.addEventListener('click', signInWithGithub);
githubRegisterBtn.addEventListener('click', signInWithGithub);

// Success Done Button
successDoneBtn.addEventListener('click', () => {
    window.location.href = '/landing/landing.html'; // Change to your main page
});

// Close Success Modal when clicking outside
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('active');
    }
});

// Error Alert Message:
function showErrorMessage(message) {
    const errorAlert = document.getElementById('error-alert');
    const backdrop = document.getElementById('backdrop');
    
    const alertMessageElement = errorAlert.querySelector('.alert-message');
    alertMessageElement.textContent = message;

    backdrop.classList.add('active');
    errorAlert.classList.add('show');
    
    setTimeout(() => {
        errorAlert.classList.remove('show');
        
        setTimeout(() => {
            backdrop.classList.remove('active');
        }, 500);
    }, 5000);  
}


function createCodeParticle() {
    const codeParticles = document.querySelector('.code-particles');
    const codeSymbols = [
        '{ code }', 
        '<div>', 
        'function()', 
        'if (true) {}', 
        '// comment', 
        'const x = 10;', 
        'return data;',
        'async await',
        'import React',
        '[1, 2, 3]'
    ];

    const particle = document.createElement('span');
    particle.className = 'code-particle';
    particle.textContent = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];

    // Random positioning
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;

    // Random size
    particle.style.fontSize = `${Math.floor(10 + Math.random() * 8)}px`;

    // Set animation timing
    const duration = 5 + Math.random() * 10;  // Duration between 5s and 15s
    const delay = Math.random() * 5;          // Delay between 0s and 5s

    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;

    codeParticles.appendChild(particle);

    // Remove after animation completes
    setTimeout(() => {
        particle.remove();
    }, (duration + delay) * 1000);
}

// Initialize animations when the document is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Create initial code particles
    const codeParticles = document.querySelector('.code-particles');

    // Create 15 initial code particles
    for (let i = 0; i < 15; i++) {
        createCodeParticle();
    }

    // Create new code particles at intervals
    setInterval(createCodeParticle, 2000);  // New particles every 5 seconds
});
