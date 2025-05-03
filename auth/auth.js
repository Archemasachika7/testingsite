// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDlFYzg5Te2jz-kVKXd0yGYlJkMwU9fxss",
    authDomain: "ju-civil-a-martian.firebaseapp.com",
    projectId: "ju-civil-a-martian",
    storageBucket: "ju-civil-a-martian.firebasestorage.app",
    messagingSenderId: "247448010406",
    appId: "1:247448010406:web:a2efa79a4080513cc87e67",
    measurementId: "G-BXYMLKE395"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();

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
const backdrop = document.getElementById('backdrop');
const errorAlert = document.getElementById('error-alert');

// List of admin emails
const adminEmails = [
    'admin@jucivila.com',
    'professor@jucivila.com',
    // Add more admin emails as needed
];

// Theme Toggle
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Check for saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// Direct tab switching function
function switchTab(tabName) {
    // Update active tab
    const authTabs = document.querySelectorAll('.auth-tab');
    authTabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`.auth-tab[data-tab="${tabName}"]`).classList.add('active');
    
    // Hide all forms first
    const authForms = document.querySelectorAll('.auth-form');
    authForms.forEach(form => {
        form.classList.remove('active');
    });
    
    // Show the corresponding form
    document.getElementById(`${tabName}Form`).classList.add('active');
}

// Auth Tabs
document.addEventListener("DOMContentLoaded", function() {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabTarget = this.getAttribute('data-tab');
            
            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Hide all forms first
            authForms.forEach(form => {
                form.classList.remove('active');
            });
            
            // Show the corresponding form
            document.getElementById(`${tabTarget}Form`).classList.add('active');
        });
    });
});

// Toggle Password Visibility
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
});

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
}

// Show Error Message
function showErrorMessage(message) {
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

// Check if user is admin
function isAdmin(email) {
    return adminEmails.includes(email);
}

// Redirect based on user role
function redirectUser(email) {
    if (isAdmin(email)) {
        window.location.href = '/admin.html';
    } else {
        window.location.href = '/mainpage.html';
    }
}

// Email/Password Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('remember').checked;
    
    try {
        showLoading();
        
        // Set persistence based on remember me checkbox
        await auth.setPersistence(rememberMe ? 
            firebase.auth.Auth.Persistence.LOCAL : 
            firebase.auth.Auth.Persistence.SESSION);
        
        // Sign in with email and password
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
        hideLoading();
        showSuccessModal('You have successfully logged in!');
        
        // Redirect after 2 seconds
        setTimeout(() => {
            redirectUser(userCredential.user.email);
        }, 2000);
        
    } catch (error) {
        hideLoading();
        let errorMessage = 'Login failed: ';
        
        switch(error.code) {
            case 'auth/invalid-email':
                errorMessage += 'Invalid email address.';
                break;
            case 'auth/user-disabled':
                errorMessage += 'This account has been disabled.';
                break;
            case 'auth/user-not-found':
                errorMessage += 'No account found with this email.';
                break;
            case 'auth/wrong-password':
                errorMessage += 'Incorrect password.';
                break;
            default:
                errorMessage += error.message;
        }
        
        showErrorMessage(errorMessage);
    }
});

// Email/Password Registration
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const rollNumber = document.getElementById('registerRoll').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const rememberMe = document.getElementById('remember').checked;
    
    if (password !== confirmPassword) {
        showErrorMessage('Passwords do not match!');
        return;
    }
    
    try {
        showLoading();
        
        // Set persistence based on remember me checkbox
        await auth.setPersistence(rememberMe ? 
            firebase.auth.Auth.Persistence.LOCAL : 
            firebase.auth.Auth.Persistence.SESSION);
        
        // Create user with email and password
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Update profile with name
        await userCredential.user.updateProfile({
            displayName: name
        });
        
        // Store additional user data in Firestore
        await db.collection("users").doc(userCredential.user.uid).set({
            name: name,
            email: email,
            rollNumber: rollNumber,
            isAdmin: isAdmin(email),
            createdAt: new Date()
        });
        
        hideLoading();
        showSuccessModal('Your account has been created successfully!');
        
        // Redirect after 2 seconds
        setTimeout(() => {
            redirectUser(email);
        }, 2000);
        
    } catch (error) {
        hideLoading();
        let errorMessage = 'Registration failed: ';
        
        switch(error.code) {
            case 'auth/email-already-in-use':
                errorMessage += 'Email already in use.';
                break;
            case 'auth/invalid-email':
                errorMessage += 'Invalid email address.';
                break;
            case 'auth/weak-password':
                errorMessage += 'Password is too weak.';
                break;
            default:
                errorMessage += error.message;
        }
        
        showErrorMessage(errorMessage);
    }
});

// Google Authentication
async function signInWithGoogle() {
    try {
        showLoading();
        const provider = new firebase.auth.GoogleAuthProvider();
        const rememberMe = document.getElementById('remember').checked;
        
        await auth.setPersistence(rememberMe ? 
            firebase.auth.Auth.Persistence.LOCAL : 
            firebase.auth.Auth.Persistence.SESSION);
        const result = await auth.signInWithPopup(provider);
        
        // Check if this is a new user
        const isNewUser = result.additionalUserInfo.isNewUser;
        
        if (isNewUser) {
            // Store additional user data in Firestore for new users
            await db.collection("users").doc(result.user.uid).set({
                name: result.user.displayName,
                email: result.user.email,
                rollNumber: "Please update your roll number",
                isAdmin: isAdmin(result.user.email),
                createdAt: new Date()
            });
        }
        
        hideLoading();
        showSuccessModal('You have successfully logged in with Google!');
        
        // Redirect after 2 seconds
        setTimeout(() => {
            redirectUser(result.user.email);
        }, 2000);
        
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
        const rememberMe = document.getElementById('remember').checked;
        
        await auth.setPersistence(rememberMe ? 
            firebase.auth.Auth.Persistence.LOCAL : 
            firebase.auth.Auth.Persistence.SESSION);
        const result = await auth.signInWithPopup(provider);
        
        // Check if this is a new user
        const isNewUser = result.additionalUserInfo.isNewUser;
        
        if (isNewUser) {
            // Store additional user data in Firestore for new users
            await db.collection("users").doc(result.user.uid).set({
                name: result.user.displayName || "GitHub User",
                email: result.user.email || "No email provided",
                rollNumber: "Please update your roll number",
                isAdmin: isAdmin(result.user.email),
                createdAt: new Date()
            });
        }
        
        hideLoading();
        showSuccessModal('You have successfully logged in with GitHub!');
        
        // Redirect after 2 seconds
        setTimeout(() => {
            redirectUser(result.user.email);
        }, 2000);
        
    } catch (error) {
        hideLoading();
        showErrorMessage(`GitHub sign-in failed: ${error.message}`);
    }
}

githubLoginBtn.addEventListener('click', signInWithGithub);
githubRegisterBtn.addEventListener('click', signInWithGithub);

// Success Done Button
successDoneBtn.addEventListener('click', () => {
    const email = auth.currentUser ? auth.currentUser.email : null;
    redirectUser(email);
});

// Close Success Modal when clicking outside
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('active');
    }
});

// Create Mars dust particles
function createDustParticle() {
    const dustParticles = document.querySelector('.dust-particles');
    const particle = document.createElement('div');
    particle.className = 'dust-particle';
    
    // Random positioning
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    // Random size
    const size = 1 + Math.random() * 3;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random opacity
    particle.style.opacity = 0.3 + Math.random() * 0.7;
    
    // Set animation timing
    const duration = 5 + Math.random() * 10;
    const delay = Math.random() * 5;
    
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    
    dustParticles.appendChild(particle);
    
    // Remove after animation completes
    setTimeout(() => {
        particle.remove();
    }, (duration + delay) * 1000);
}

// Initialize animations when the document is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Create initial dust particles
    for (let i = 0; i < 30; i++) {
        createDustParticle();
    }
    
    // Create new dust particles at intervals
    setInterval(createDustParticle, 1000);
});

// Debug tab switching
function debugTabs() {
    const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
    const registerTab = document.querySelector('.auth-tab[data-tab="register"]');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    console.log('Login tab active:', loginTab.classList.contains('active'));
    console.log('Register tab active:', registerTab.classList.contains('active'));
    console.log('Login form active:', loginForm.classList.contains('active'));
    console.log('Register form active:', registerForm.classList.contains('active'));
}

// Add click listeners with debugging
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        console.log('Tab clicked:', this.getAttribute('data-tab'));
        setTimeout(debugTabs, 100);
    });
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message);
    alert('A JavaScript error occurred: ' + e.message);
});
