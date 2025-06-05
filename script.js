// script.js
/**
 * @module main
 * Purpose: Initialize components, handle scroll events, and wire up interactivity.
 */

/* ========================= IMPORTS ========================= */
import "./paint-worklet.js";         // Registers CSS Paint Worklet for I-Beam
import "./servicecard.js";                              // Defines <service-card>
import { initCarousel } from "./carousel.js";               // Testimonials carousel logic
import { handleForm } from "./contactform.js";                 // Contact form validation/submission
import { drawMap } from "./mapcanvas.js";                       // Live canvas map rendering
import { initAnalytics } from "./analytics.js";            // Analytics beacon stub

// Toggle console output during development
const DEBUG_MODE = false;
const debugLog = (...args) => { if (DEBUG_MODE) console.log(...args); };
const debugWarn = (...args) => { if (DEBUG_MODE) console.warn(...args); };

/* ========================= HEADER / NAV BEHAVIOR ========================= */
const header = document.getElementById("header");
let lastScrollY = window.scrollY;

// Generic throttle helper
const throttle = (fn, limit) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
};

const fab = document.getElementById("back-to-top");
const handleScroll = () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    header.classList.add("hidden");
    header.classList.remove("scrolled");
  } else if (currentScrollY < lastScrollY) {
    header.classList.remove("hidden");
    header.classList.toggle("scrolled", currentScrollY > 50);
  }
  fab.classList.toggle("show", currentScrollY > 500);
  lastScrollY = currentScrollY;
};
window.addEventListener("scroll", throttle(handleScroll, 100));

/* ========================= MOBILE MENU ========================= */
const hamburgerBtn = document.getElementById("hamburger-btn");
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuClose = document.getElementById("mobile-menu-close");

hamburgerBtn.addEventListener("click", () => {
  mobileMenu.classList.add("open");
  hamburgerBtn.setAttribute("aria-expanded", "true");
  mobileMenu.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
});
mobileMenuClose.addEventListener("click", () => {
  mobileMenu.classList.remove("open");
  hamburgerBtn.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
});
mobileMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  });
});

const setMenuHeight = () => {
  mobileMenu.style.height = `${window.innerHeight}px`;
};
window.addEventListener("resize", setMenuHeight);
window.addEventListener("orientationchange", setMenuHeight);
setMenuHeight();

let swipeStartX = null;
mobileMenu.addEventListener("pointerdown", (e) => {
  swipeStartX = e.clientX;
});
mobileMenu.addEventListener("pointerup", (e) => {
  if (swipeStartX !== null && Math.abs(e.clientX - swipeStartX) > 50) {
    mobileMenu.classList.remove("open");
    document.body.style.overflow = "";
  }
  swipeStartX = null;
});

const sections = document.querySelectorAll("main > section[id]");
const mobileLinks = mobileMenu.querySelectorAll("a");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      mobileLinks.forEach(link => {
        if (link.getAttribute("href") === `#${entry.target.id}`) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }
  });
}, { threshold: 0.6 });
sections.forEach(sec => sectionObserver.observe(sec));

/* ========================= HERO ANIMATIONS ========================= */
const heroTitle = document.querySelector(".hero-title");
const skipHero = document.getElementById("skip-hero");
const heroCtaPrimary = document.getElementById("hero-cta-primary");
const rotatingObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      heroTitle.classList.add("visible");
    }
  });
}, { threshold: 0.5 });
rotatingObserver.observe(heroTitle);

skipHero?.addEventListener('click', () => {
  heroTitle.classList.add('visible');
});

// Magnetic cursor effect on Primary CTA
document.addEventListener("mousemove", (e) => {
  const rect = heroCtaPrimary.getBoundingClientRect();
  const dx = e.clientX - (rect.left + rect.width / 2);
  const dy = e.clientY - (rect.top + rect.height / 2);
  const dist = Math.hypot(dx, dy);
  if (dist < 150) {
    heroCtaPrimary.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px) scale(1.05)`;
  } else {
    heroCtaPrimary.style.transform = "translate(0, 0) scale(1)";
  }
});

// Credentials dialog logic
const credentialsBtn = document.getElementById("hero-cta-credentials");
const credentialsDialog = document.getElementById("credentials-dialog");
const credentialsClose = document.getElementById("credentials-close");
credentialsBtn.addEventListener("click", () => {
  credentialsDialog.showModal();
});
credentialsClose.addEventListener("click", () => {
  credentialsDialog.close();
});

/* ========================= ABOUT SECTION ========================= */
const aboutSection = document.getElementById("about");
const aboutParagraphs = aboutSection.querySelectorAll(".about-paragraph");
const aboutObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
aboutParagraphs.forEach(p => aboutObserver.observe(p));

const ibeamCanvas = document.getElementById("ibeam-canvas");
const ibeamObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      aboutSection.classList.add("visible");
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
ibeamObserver.observe(ibeamCanvas);

/* ========================= SERVICES SECTION ========================= */
// <service-card> components auto-initialize via serviceCard.js

/* ========================= FEATURED PROJECTS ========================= */
const projectsContainer = document.querySelector(".projects-container");
const projectCards = projectsContainer.querySelectorAll(".project-card");
const projectAnnouncer = document.getElementById("project-announcer");

projectsContainer.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    projectsContainer.scrollBy({ left: projectsContainer.clientWidth, behavior: "smooth" });
  } else if (e.key === "ArrowLeft") {
    projectsContainer.scrollBy({ left: -projectsContainer.clientWidth, behavior: "smooth" });
  }
});
projectCards.forEach((card, index) => {
  card.addEventListener("pointermove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = (y / (rect.height / 2)) * 3;
    const tiltY = (x / (rect.width / 2)) * -3;
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
  // Announce on focus
  card.addEventListener("focus", () => {
    const title = card.querySelector(".project-title").textContent;
    projectAnnouncer.textContent = `Viewing Project ${index + 1} of ${projectCards.length}: ${title}`;
  });
});

/* ========================= WHY CHOOSE US ========================= */
const counters = document.querySelectorAll(".counter");
counters.forEach(counter => {
  const span = counter.querySelector(".count");
  const target = +counter.getAttribute("data-target");
  let current = 0;
  const step = () => {
    current += Math.ceil(target / 100);
    if (current > target) current = target;
    span.textContent = current + (target > 50 ? "+" : "");
    if (current < target) {
      requestAnimationFrame(step);
    }
  };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        step();
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  observer.observe(counter);
});

const gauges = document.querySelectorAll(".gauge");
gauges.forEach(gauge => {
  const circle = gauge.querySelector(".gauge-foreground");
  const percent = +gauge.getAttribute("data-percent");
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const offset = circumference * (1 - percent / 100);
        circle.style.strokeDashoffset = offset;
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  observer.observe(gauge);
});

/* ========================= TESTIMONIALS ========================= */
initCarousel(); // Initializes Ken Burns carousel from carousel.js

/* ========================= CTA BANNER ========================= */
const pinnedCta = document.getElementById("pinned-cta");
const contactSection = document.getElementById("contact");
const pinnedObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    pinnedCta.setAttribute("aria-hidden", entry.isIntersecting ? "false" : "true");
  });
}, { rootMargin: "0px 0px -50% 0px" });
pinnedObserver.observe(contactSection);

/* ========================= CONTACT FORM & MAP ========================= */
handleForm();  // Initializes form validation & submission logic from contactForm.js
drawMap();     // Draws procedural grid and pulsing markers on map canvas from mapCanvas.js

/* ========================= FOOTER & BACK-TO-TOP ========================= */
fab.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ========================= SERVICE WORKER REGISTRATION ========================= */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => debugLog('Service Worker registered:', reg))
      .catch(err => debugWarn('Service Worker registration failed:', err));
  });
}

/* ========================= ANALYTICS ========================= */
const analyticsIdleHandle = (window.requestIdleCallback || function(cb){
  return setTimeout(cb, 200);
})(initAnalytics);
// If cancellation is needed elsewhere, use
//   (window.cancelIdleCallback || clearTimeout)(analyticsIdleHandle);
