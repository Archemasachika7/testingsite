// DOM Elements
const themeToggle = document.getElementById("theme-toggle");
const header = document.querySelector("header");
const loginBtn = document.getElementById("login-btn");
const mobileLoginBtn = document.getElementById("mobile-login-btn");
const registerBtn = document.getElementById("register-btn");
const ctaRegisterBtn = document.getElementById("cta-register-btn");
const ctaLoginBtn = document.getElementById("cta-login-btn");
const demoBtn = document.getElementById("demo-btn");
const videoModal = document.getElementById("videoModal");
const modalClose = document.getElementById("modal-close");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuClose = document.getElementById("mobile-menu-close");
const tabBtns = document.querySelectorAll(".tab-btn");
const tabPanes = document.querySelectorAll(".tab-pane");
const faqItems = document.querySelectorAll(".faq-item");
const tryBtn = document.querySelector(".try-btn");
const parallaxElements = document.querySelectorAll(".parallax-element");
const parallaxSections = document.querySelectorAll(".parallax-section");
const globeContainer = document.querySelector(".globe-container");

// Theme Toggle
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  // Reinitialize globe if it exists
  if (window.globe) {
    initGlobe();
  }
}

// Check for saved theme
const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
});

// Enhanced Parallax Effect
function handleParallax() {
  parallaxElements.forEach((element) => {
    const speed = element.getAttribute("data-speed") || 0.1;
    const rect = element.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const viewportHeight = window.innerHeight;
    const distanceFromCenter = centerY - viewportHeight / 2;

    // Only apply parallax if element is in viewport
    if (rect.bottom > 0 && rect.top < viewportHeight) {
      element.style.transform = `translateY(${distanceFromCenter * speed}px)`;
    }
  });
}

// Create Falling Stars
function createStars() {
  const starsContainer = document.querySelector(".stars-container");
  if (!starsContainer) return;

  starsContainer.innerHTML = "";
  const starCount = 200;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    // Random positioning
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 10 + 5;

    star.style.left = `${left}%`;
    star.style.animation = `fall ${duration}s linear ${delay}s infinite`;

    // Random size for variety
    const size = Math.random() * 3 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    starsContainer.appendChild(star);
  }
}

// Animated Code Particles
function createCodeParticles() {
  const container = document.querySelector(".code-particles");
  if (!container) return;

  container.innerHTML = "";
  const symbols = [
    "<>",
    "{}",
    "()",
    "//",
    "/*",
    "*/",
    "=>",
    "+=",
    "==",
    "===",
    "!=",
    "!==",
    "&&",
    "||"
  ];

  for (let i = 0; i < 40; i++) {
    const particle = document.createElement("span");
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];

    particle.textContent = symbol;
    particle.style.position = "absolute";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.opacity = Math.random() * 0.3 + 0.1;
    particle.style.fontSize = `${Math.random() * 16 + 10}px`;
    particle.style.color = "var(--text-color-light)";
    particle.style.transform = `rotate(${Math.random() * 360}deg)`;
    particle.style.transition = "opacity 0.5s ease";

    container.appendChild(particle);

    // Animate particles
    setInterval(() => {
      particle.style.opacity = Math.random() * 0.3 + 0.1;
    }, Math.random() * 5000 + 2000);
  }
}

// Create connection lines for the globe
function createConnections() {
  const container = document.querySelector(".connections-container");
  if (!container) return;

  // Clear existing connections
  container.innerHTML = "";

  // Create new connections
  for (let i = 0; i < 15; i++) {
    const connection = document.createElement("div");
    connection.classList.add("connection");

    // Random positioning
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const length = Math.random() * 150 + 50;
    const angle = Math.random() * 360;
    const delay = Math.random() * 5;

    connection.style.left = `${startX}%`;
    connection.style.top = `${startY}%`;
    connection.style.width = `${length}px`;
    connection.style.transform = `rotate(${angle}deg)`;
    connection.style.animationDelay = `${delay}s`;

    container.appendChild(connection);
  }
}

// Initialize 3D Globe using Three.js
function initGlobe() {
  if (!window.THREE || !document.getElementById("globe-canvas")) return;

  const globeCanvas = document.getElementById("globe-canvas");
  const isDarkTheme =
    document.documentElement.getAttribute("data-theme") === "dark";

  // Set up scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    globeCanvas.clientWidth / globeCanvas.clientHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: globeCanvas
  });

  renderer.setSize(globeCanvas.clientWidth, globeCanvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Create globe
  const globeGeometry = new THREE.SphereGeometry(5, 64, 64);
  const globeMaterial = new THREE.MeshPhongMaterial({
    color: isDarkTheme ? 0x1e293b : 0xf1f5f9,
    transparent: true,
    opacity: 0.8,
    wireframe: true
  });

  const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
  scene.add(globeMesh);

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  // Add point light
  const pointLight = new THREE.PointLight(isDarkTheme ? 0x8b5cf6 : 0x6d28d9, 1);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  // Position camera
  camera.position.z = 15;

  // Create hotspots (points on the globe)
  const hotspots = [];
  for (let i = 0; i < 20; i++) {
    const phi = Math.acos(-1 + 2 * Math.random());
    const theta = 2 * Math.PI * Math.random();

    const x = 5 * Math.sin(phi) * Math.cos(theta);
    const y = 5 * Math.sin(phi) * Math.sin(theta);
    const z = 5 * Math.cos(phi);

    const hotspotGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const hotspotMaterial = new THREE.MeshBasicMaterial({
      color: isDarkTheme ? 0xa78bfa : 0x6d28d9
    });

    const hotspot = new THREE.Mesh(hotspotGeometry, hotspotMaterial);
    hotspot.position.set(x, y, z);
    scene.add(hotspot);

    // Add pulse effect data
    hotspot.userData = {
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 2 + 1
    };

    hotspots.push(hotspot);
  }

  // Create connections between hotspots
  const connectionsMaterial = new THREE.LineBasicMaterial({
    color: isDarkTheme ? 0xa78bfa : 0x6d28d9,
    transparent: true,
    opacity: 0.3
  });

  for (let i = 0; i < 10; i++) {
    const start = hotspots[Math.floor(Math.random() * hotspots.length)];
    const end = hotspots[Math.floor(Math.random() * hotspots.length)];

    if (start !== end) {
      const points = [start.position, end.position];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, connectionsMaterial);
      scene.add(line);
    }
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Rotate globe
    globeMesh.rotation.y += 0.002;

    // Animate hotspots
    const time = Date.now() * 0.001;
    hotspots.forEach((hotspot) => {
      const { pulseSpeed, pulsePhase } = hotspot.userData;
      const scale = 1 + 0.3 * Math.sin(time * pulseSpeed + pulsePhase);
      hotspot.scale.set(scale, scale, scale);
    });

    renderer.render(scene, camera);
  }

  animate();

  // Handle window resize
  function handleResize() {
    camera.aspect = globeCanvas.clientWidth / globeCanvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(globeCanvas.clientWidth, globeCanvas.clientHeight);
  }

  window.addEventListener("resize", handleResize);

  // Save reference to dispose later if needed
  window.globe = {
    renderer,
    scene,
    camera,
    dispose: () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      globeGeometry.dispose();
      globeMaterial.dispose();
      hotspots.forEach((hotspot) => {
        hotspot.geometry.dispose();
        hotspot.material.dispose();
      });
    }
  };
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth"
      });

      // Close mobile menu if open
      if (mobileMenu.classList.contains("active")) {
        mobileMenu.classList.remove("active");
      }
    }
  });
});

// Header Scroll Effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  // Call parallax effect on scroll
  handleParallax();

  // Adjust star speed based on scroll position
  adjustStarSpeed();

  // Handle scroll animations
  handleScrollAnimations();
});

// Adjust falling stars speed based on scroll
function adjustStarSpeed() {
  const scrollPosition = window.scrollY;
  const stars = document.querySelectorAll(".star");

  stars.forEach((star, index) => {
    // Adjust star speed based on scroll position
    const speed = 1 + scrollPosition * 0.0005;
    const currentAnimation = star.style.animation;
    const durationMatch = currentAnimation.match(/fall\s+(\d+\.?\d*)s/);

    if (durationMatch && durationMatch[1]) {
      const originalDuration = parseFloat(durationMatch[1]);
      const newDuration = originalDuration / speed;

      // Update animation with new duration
      star.style.animation = currentAnimation.replace(
        /fall\s+\d+\.?\d*s/,
        `fall ${newDuration}s`
      );
    }
  });
}

// Video Modal
function openVideoModal() {
  videoModal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Set video src (in a real implementation, you would use an actual video URL)
  const iframe = videoModal.querySelector("iframe");
  iframe.src = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Replace with your actual demo video
}

function closeVideoModal() {
  videoModal.classList.remove("active");
  document.body.style.overflow = "";

  // Reset video src to stop playback
  const iframe = videoModal.querySelector("iframe");
  iframe.src = "";
}

demoBtn.addEventListener("click", openVideoModal);
modalClose.addEventListener("click", closeVideoModal);
videoModal.addEventListener("click", (e) => {
  if (e.target === videoModal) {
    closeVideoModal();
  }
});

// Mobile Menu
mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.add("active");
});

mobileMenuClose.addEventListener("click", () => {
  mobileMenu.classList.remove("active");
});

// Tabs
tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;

    // Update active tab button
    tabBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Show active tab content
    tabPanes.forEach((pane) => pane.classList.remove("active"));
    document.getElementById(`${tab}-tab`).classList.add("active");
  });
});

// FAQ Accordion
faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    // Close all items
    faqItems.forEach((i) => i.classList.remove("active"));

    // Open clicked item if it wasn't active
    if (!isActive) {
      item.classList.add("active");
    }
  });
});

// Testimonial Slider
const testimonialCards = document.querySelectorAll(".testimonial-card");
const dots = document.querySelectorAll(".testimonial-dots .dot");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
let currentSlide = 0;

function showSlide(index) {
  // Hide all slides
  testimonialCards.forEach((card) => {
    card.style.display = "none";
  });

  // Remove active class from all dots
  dots.forEach((dot) => {
    dot.classList.remove("active");
  });

  // Show current slide and activate dot
  if (testimonialCards[index]) {
    testimonialCards[index].style.display = "block";
  }

  if (dots[index]) {
    dots[index].classList.add("active");
  }
}

// Initialize slider
if (testimonialCards.length > 0) {
  showSlide(currentSlide);

  // Next slide
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % testimonialCards.length;
      showSlide(currentSlide);
    });
  }

  // Previous slide
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentSlide =
        (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
      showSlide(currentSlide);
    });
  }

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index;
      showSlide(currentSlide);
    });
  });

  // Auto slide (optional)
  setInterval(() => {
    currentSlide = (currentSlide + 1) % testimonialCards.length;
    showSlide(currentSlide);
  }, 8000);
}

// Interactive Demo
if (tryBtn) {
  tryBtn.addEventListener("click", () => {
    alert(
      "In a real implementation, this would open an interactive demo of the platform."
    );
  });
}

// Scroll Animation for Elements
function handleScrollAnimations() {
  const elements = document.querySelectorAll(
    ".feature-card, .testimonial-card, .faq-item, .community-stat, .activity-item"
  );

  elements.forEach((element) => {
    const elementPosition = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementPosition < windowHeight * 0.85) {
      element.classList.add("animate");
    }
  });
}

// Enhanced Parallax Effect for Mouse Movement
function handleMouseParallax(e) {
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;

  document
    .querySelectorAll(".preview-window, .tabs-content")
    .forEach((element) => {
      const moveX = (mouseX - 0.5) * 20;
      const moveY = (mouseY - 0.5) * 20;
      element.style.transform = `perspective(1000px) rotateY(${-moveX}deg) rotateX(${moveY}deg)`;
    });

  // Add subtle movement to feature cards on mouse move
  document.querySelectorAll(".feature-card").forEach((card, index) => {
    const moveX = (mouseX - 0.5) * 5;
    const moveY = (mouseY - 0.5) * 5;
    card.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
  });
}

// Create live activity feed updates
function createLiveActivityFeed() {
  const activityList = document.querySelector(".activity-list");
  if (!activityList) return;

  const activities = [
    {
      icon: "trophy",
      text:
        '<strong>Alex K.</strong> just solved <span class="highlight">Binary Search Tree</span> challenge',
      time: "2 minutes ago"
    },
    {
      icon: "code",
      text:
        '<strong>Maria S.</strong> submitted a solution in <span class="highlight">JavaScript</span>',
      time: "5 minutes ago"
    },
    {
      icon: "users",
      text:
        '<strong>John D.</strong> joined from <span class="highlight">Canada</span>',
      time: "10 minutes ago"
    },
    {
      icon: "star",
      text:
        '<strong>Emma W.</strong> earned <span class="highlight">Algorithm Master</span> badge',
      time: "15 minutes ago"
    },
    {
      icon: "comments",
      text:
        '<strong>David L.</strong> posted in <span class="highlight">Dynamic Programming</span> forum',
      time: "20 minutes ago"
    }
  ];

  // Rotate activities every 5 seconds
  setInterval(() => {
    const activity = activities[Math.floor(Math.random() * activities.length)];

    const newItem = document.createElement("div");
    newItem.classList.add("activity-item");
    newItem.innerHTML = `
            <div class="activity-icon"><i class="fas fa-${activity.icon}"></i></div>
            <div class="activity-content">
                <p>${activity.text}</p>
                <span class="activity-time">just now</span>
            </div>
        `;

    // Add new item at the top
    activityList.prepend(newItem);

    // Fade in animation
    setTimeout(() => {
      newItem.classList.add("animate");
    }, 10);

    // Remove oldest item if more than 3
    if (activityList.children.length > 3) {
      activityList.removeChild(activityList.lastChild);
    }
  }, 5000);
}

// Auth Redirects
function redirectToAuth(tab) {
  window.location.href = `auth.html?tab=${tab}`;
}

if (loginBtn) loginBtn.addEventListener("click", () => redirectToAuth("login"));
if (mobileLoginBtn)
  mobileLoginBtn.addEventListener("click", () => redirectToAuth("login"));
if (registerBtn)
  registerBtn.addEventListener("click", () => redirectToAuth("register"));
if (ctaRegisterBtn)
  ctaRegisterBtn.addEventListener("click", () => redirectToAuth("register"));
if (ctaLoginBtn)
  ctaLoginBtn.addEventListener("click", () => redirectToAuth("login"));

// Newsletter form submission
const newsletterForm = document.querySelector(".newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector("input").value;

    if (email) {
      alert(
        `Thank you for subscribing with ${email}! In a real implementation, this would add you to our newsletter.`
      );
      newsletterForm.reset();
    }
  });
}

// Initialize animations and event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Create stars
  createStars();

  // Create particles
  createCodeParticles();

  // Create connections
  createConnections();

  // Initialize globe if Three.js is available
  if (window.THREE) {
    initGlobe();
  }

  // Create live activity feed
  createLiveActivityFeed();

  // Initial parallax calculation
  handleParallax();

  // Add mousemove event for 3D effect
  document.addEventListener("mousemove", handleMouseParallax);

  // Fade in the page
  document.body.classList.add("loaded");

  // Check URL parameters for direct auth redirects
  const urlParams = new URLSearchParams(window.location.search);
  const authRedirect = urlParams.get("auth");

  if (authRedirect === "login") {
    redirectToAuth("login");
  } else if (authRedirect === "register") {
    redirectToAuth("register");
  }

  // Trigger initial animations
  handleScrollAnimations();
});

// Add resize event listener to recalculate parallax
window.addEventListener("resize", handleParallax);
