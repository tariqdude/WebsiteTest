'use strict';

// Minimal App Logic
const App = {
  // DOM Ready Utility
  ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  },

  // Loader Overlay (with fade out)
  loader() {
    const loader = document.getElementById('pageloader');
    if (!loader) return;
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hide'), 400);
      setTimeout(() => loader.style.display = 'none', 1000);
    });
  },

  // Footer Year
  year() {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  },

  // Theme Toggle & Persistence (with ARIA)
  theme() {
    const btn = document.getElementById('themeToggle');
    const icon = btn && btn.querySelector('i');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const setTheme = mode => {
      document.body.classList.toggle('dark', mode === 'dark');
      localStorage.setItem('theme', mode);
      if (icon) icon.className = mode === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
      if (btn) btn.setAttribute('aria-pressed', mode === 'dark');
    };
    const saved = localStorage.getItem('theme');
    setTheme(saved ? saved : (prefersDark ? 'dark' : 'light'));
    if (btn) {
      btn.onclick = () => setTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
    }
  },

  // Back-to-top Button (with requestAnimationFrame for perf)
  backToTop() {
    const btn = document.getElementById('topBtn');
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (btn) btn.style.display = window.scrollY > 200 ? 'flex' : 'none';
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll);
    if (btn) btn.onclick = () => window.scrollTo({top:0,behavior:'smooth'});
  },

  // Mobile Nav (ARIA expanded)
  mobileNav() {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    if (!hamburger || !menu) return;
    hamburger.addEventListener('click', () => {
      const open = !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    }));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 700) {
        menu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      }
    });
  },

  // Contact Form Validation and Feedback (improved)
  contactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const status = document.getElementById('formStatus');
    form.onsubmit = async function(e) {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      let valid = true;
      let errorMsg = '';
      if (!name) { valid = false; errorMsg = 'Name is required.'; }
      else if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { valid = false; errorMsg = 'Enter a valid email.'; }
      else if (!message) { valid = false; errorMsg = 'Message is required.'; }
      if (!valid) {
        status.textContent = errorMsg;
        status.setAttribute('aria-live', 'assertive');
        return false;
      }
      status.textContent = 'Sending...';
      status.setAttribute('aria-live', 'polite');
      try {
        const response = await fetch('https://formspree.io/f/mnqekgqj', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });
        if (response.ok) {
          status.textContent = 'Thank you! We will be in touch soon.';
          form.reset();
        } else {
          status.textContent = 'There was an error. Please try again.';
        }
      } catch {
        status.textContent = 'There was an error. Please try again.';
      }
    };
  }
};

// Accessibility: Focus main on skip link
document.addEventListener('DOMContentLoaded', () => {
  const skip = document.querySelector('.skip-link');
  if (skip) {
    skip.addEventListener('click', e => {
      const main = document.getElementById('home');
      if (main) main.focus();
    });
  }
});

App.ready(() => {
  App.loader();
  App.year();
  App.theme();
  App.backToTop();
  App.mobileNav();
  App.contactForm();
});
