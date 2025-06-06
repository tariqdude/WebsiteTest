/* =============================================================================
   SCRIPTS.JS
   ========================================================================== */



import { initNavigation } from './js/navigation.js';
import { initCarousel } from './js/carousel.js';
import { initForms } from './js/forms.js';
import { initTheme } from './js/theme.js';

/* =============================================================================
   PROJECT FILTERING
   ========================================================================== */
export function initProjectFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class
      filterButtons.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.classList.remove('filtered-out');
        } else {
          card.style.display = 'none';
          card.classList.add('filtered-out');
        }
      });
    });
  });
}

/* =============================================================================
   SCROLL-ON-LOAD ANIMATIONS (IntersectionObserver)
   ========================================================================== */
export function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
  };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(el => observer.observe(el));
}

/* =============================================================================
   LAZY-LOADING IMAGES & BGs (IntersectionObserver)
   ========================================================================== */
export function initLazyLoad() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const lazyBackgrounds = document.querySelectorAll('[data-bg]');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px 200px 0px',
    threshold: 0.1
  };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.tagName === 'IMG' && el.dataset.src) {
          el.src = el.dataset.src;
          if (el.dataset.srcset) el.srcset = el.dataset.srcset;
          el.removeAttribute('loading');
        } else if (el.dataset.bg) {
          el.style.backgroundImage = `url('${el.dataset.bg}')`;
          el.removeAttribute('data-bg');
        }
        obs.unobserve(el);
      }
    });
  }, observerOptions);

  lazyImages.forEach(img => observer.observe(img));
  lazyBackgrounds.forEach(bg => observer.observe(bg));
}

/* =============================================================================
   COOKIE CONSENT BANNER
   ========================================================================== */
const cookieBanner = document.getElementById('cookieConsent');
const acceptCookiesBtn = document.getElementById('acceptCookies');

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
}

export function checkCookieConsent() {
  if (getCookie('cookieConsent') !== 'true') {
    cookieBanner.classList.add('show');
  }
}

acceptCookiesBtn.addEventListener('click', () => {
  setCookie('cookieConsent', 'true', 365);
  cookieBanner.classList.remove('show');
});

/* =============================================================================
   INITIALIZATIONS ON DOM CONTENT LOADED
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCarousel();
  initForms();
  initTheme();
  initProjectFiltering();
  initScrollAnimations();
  initLazyLoad();
  checkCookieConsent();
});
