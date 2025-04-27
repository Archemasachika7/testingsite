// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const parallaxBg = document.getElementById('parallax-bg');
const header = document.querySelector('header');
const loginBtn = document.getElementById('login-btn');
const mobileLoginBtn = document.getElementById('mobile-login-btn');
const authModal = document.getElementById('authModal');
const modalClose = document.getElementById('modal-close');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuClose = document.getElementById('mobile-menu-close');

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

// Enhanced Parallax Effect
document.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;
  
  if (parallaxBg) {
    parallaxBg.style.transform = `translate(${mouseX * -30}px, ${mouseY * -30}px)`;
  }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
      }
    }
  });
});

// Header Scroll Effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Modal Functionality
function openModal() {
  if (authModal) {
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  if (authModal) {
    authModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

if (loginBtn) loginBtn.addEventListener('click', openModal);
if (mobileLoginBtn) mobileLoginBtn.addEventListener('click', openModal);
if (modalClose) modalClose.addEventListener('click', closeModal);
if (authModal) {
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
      closeModal();
    }
  });
}

// Auth Tabs
if (authTabs.length > 0) {
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabTarget = tab.getAttribute('data-tab');
      
      // Update active tab
      authTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Show corresponding form
      authForms.forEach(form => form.classList.remove('active'));
      document.getElementById(`${tabTarget}Form`).classList.add('active');
    });
  });
}

// Mobile Menu
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
  });
}

if (mobileMenuClose) {
  mobileMenuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
  });
}

// Animations on Scroll
const animateElements = document.querySelectorAll('[data-aos]');

function checkScroll() {
  const triggerBottom = window.innerHeight * 0.8;
  
  animateElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    
    if (elementTop < triggerBottom) {
      element.classList.add('aos-animate');
    } else {
      element.classList.remove('aos-animate');
    }
  });
}

window.addEventListener('scroll', checkScroll);
window.addEventListener('resize', checkScroll);
window.addEventListener('load', () => {
  // Initial check for elements in view
  checkScroll();
  
  // Fade in the page
  document.body.classList.add('loaded');
});

// Initialize animations with delays
animateElements.forEach((element, index) => {
  const delay = element.getAttribute('data-aos-delay') || (index % 3) * 100;
  element.style.transitionDelay = `${delay}ms`;
});

// Authentication check
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is authenticated
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      // User is not authenticated, redirect to landing page
      window.location.href = '/';
    } else {
      // User is authenticated, show content
      document.body.classList.add('authenticated');
      
      // You can also update UI with user info
      const userNameElements = document.querySelectorAll('.user-name');
      if (user.displayName && userNameElements.length > 0) {
        userNameElements.forEach(el => {
          el.textContent = user.displayName;
        });
      }
    }
  });
});

// Logout functionality
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
      window.location.href = '/';
    }).catch(error => {
      console.error('Logout error:', error);
    });
  });
}

// Coding Challenge Features
// This would connect to a backend in a real implementation
const challengeData = [
  {
    id: 1,
    title: "Two Sum Problem",
    difficulty: "easy",
    points: 100,
    category: "Arrays",
    solved: 1243,
    description: "Find two numbers in an array that add up to a specific target."
  },
  {
    id: 2,
    title: "Longest Substring",
    difficulty: "medium",
    points: 250,
    category: "Strings",
    solved: 856,
    description: "Find the length of the longest substring without repeating characters."
  },
  {
    id: 3,
    title: "Merge K Sorted Lists",
    difficulty: "hard",
    points: 500,
    category: "Linked Lists",
    solved: 432,
    description: "Merge k sorted linked lists into one sorted linked list."
  },
  {
    id: 4,
    title: "Binary Tree Level Order",
    difficulty: "medium",
    points: 300,
    category: "Trees",
    solved: 723,
    description: "Return the level order traversal of a binary tree's values."
  }
];

// Leaderboard Data
const leaderboardData = [
  {
    rank: 1,
    username: "CodeMaster",
    avatar: "https://via.placeholder.com/40",
    level: 42,
    solved: 187,
    points: 15420,
    accuracy: "98.2%",
    streak: "42 days"
  },
  {
    rank: 2,
    username: "AlgoNinja",
    avatar: "https://via.placeholder.com/40",
    level: 39,
    solved: 175,
    points: 14830,
    accuracy: "97.5%",
    streak: "38 days"
  },
  {
    rank: 3,
    username: "ByteWizard",
    avatar: "https://via.placeholder.com/40",
    level: 37,
    solved: 168,
    points: 13950,
    accuracy: "96.8%",
    streak: "35 days"
  },
  {
    rank: 4,
    username: "DataDragon",
    avatar: "https://via.placeholder.com/40",
    level: 35,
    solved: 159,
    points: 12780,
    accuracy: "95.3%",
    streak: "29 days"
  },
  {
    rank: 5,
    username: "LogicLegend",
    avatar: "https://via.placeholder.com/40",
    level: 33,
    solved: 152,
    points: 11920,
    accuracy: "94.7%",
    streak: "26 days"
  }
];

// Filter Leaderboard
const timeFilter = document.getElementById('time-filter');
const categoryFilter = document.getElementById('category-filter');

if (timeFilter) timeFilter.addEventListener('change', updateLeaderboard);
if (categoryFilter) categoryFilter.addEventListener('change', updateLeaderboard);

function updateLeaderboard() {
  // In a real implementation, this would fetch data from the server
  // based on the selected filters
  console.log('Leaderboard updated with new filters');
  
  // For demonstration, we'll just show an alert
  if (timeFilter && categoryFilter) {
    const timeFilterValue = timeFilter.value;
    const categoryFilterValue = categoryFilter.value;
    alert(`Leaderboard filtered by: ${timeFilterValue} time period and ${categoryFilterValue} category`);
  }
}

// Code Editor functionality for challenge page
function initCodeEditor() {
  const codeEditor = document.getElementById('code-editor');
  if (!codeEditor) return;
  
  // In a real implementation, this would initialize a code editor like Monaco or CodeMirror
  console.log('Code editor initialized');
  
  // Run code button
  const runCodeBtn = document.getElementById('run-code');
  if (runCodeBtn) {
    runCodeBtn.addEventListener('click', () => {
      const code = codeEditor.value;
      // In a real implementation, this would send the code to a server for execution
      alert('Code execution would happen here');
    });
  }
  
  // Submit code button
  const submitCodeBtn = document.getElementById('submit-code');
  if (submitCodeBtn) {
    submitCodeBtn.addEventListener('click', () => {
      const code = codeEditor.value;
      // In a real implementation, this would submit the code for evaluation
      alert('Code submission would happen here');
    });
  }
}

// Initialize any code editors on the page
document.addEventListener('DOMContentLoaded', () => {
  initCodeEditor();
});
