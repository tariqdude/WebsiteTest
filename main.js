'use strict';

// Minimal App Logic
const App = {
  // DOM Ready Utility
  ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  },

  // Loader Overlay
  loader() {
    setTimeout(() => {
      const loader = document.getElementById('pageloader');
      if (loader) loader.classList.add('hide');
    }, 400);
  },

  // Footer Year
  year() {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  },

  // Theme Toggle & Persistence
  theme() {
    const btn = document.getElementById('themeToggle');
    const icon = btn && btn.querySelector('i');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const setTheme = mode => {
      document.body.classList.toggle('dark', mode === 'dark');
      localStorage.setItem('theme', mode);
      if (icon) icon.className = mode === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    };
    const saved = localStorage.getItem('theme');
    setTheme(saved ? saved : (prefersDark ? 'dark' : 'light'));
    if (btn) {
      btn.onclick = () => setTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
    }
  },

  // Back-to-top Button
  backToTop() {
    const btn = document.getElementById('topBtn');
    window.addEventListener('scroll', () => {
      if (btn) btn.style.display = window.scrollY > 200 ? 'flex' : 'none';
    });
    if (btn) btn.onclick = () => window.scrollTo({top:0,behavior:'smooth'});
  },

  // Mobile Nav
  mobileNav() {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    if (!hamburger || !menu) return;
    hamburger.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menu.classList.remove('open');
    }));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 700) menu.classList.remove('open');
    });
  },

  // Contact Form Validation and Feedback
  contactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.onsubmit = function(e) {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      let valid = true;
      if (!name) valid = false;
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) valid = false;
      if (!message) valid = false;
      const status = document.getElementById('formStatus');
      if (!valid) {
        status.textContent = 'Please fill all fields correctly.';
        return false;
      }
      status.textContent = 'Sending...';
      fetch('https://formspree.io/f/mnqekgqj', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      }).then(response => {
        if (response.ok) {
          status.textContent = 'Thank you! We will be in touch soon.';
          form.reset();
        } else {
          status.textContent = 'There was an error. Please try again.';
        }
      }).catch(() => {
        status.textContent = 'There was an error. Please try again.';
      });
    };
  }
};

App.ready(() => {
  App.loader();
  App.year();
  App.theme();
  App.backToTop();
  App.mobileNav();
  App.contactForm();
});
