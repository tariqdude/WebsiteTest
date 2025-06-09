'use strict';

// Set current year in footer
document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});

// Theme toggle (light/dark)
document.addEventListener('DOMContentLoaded', () => {
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
});

// Mobile nav
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('menu');
  if (!hamburger || !menu) return;
  hamburger.addEventListener('click', () => {
    const open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    if (open) {
      menu.querySelector('a').focus();
    }
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  }));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 800) {
      menu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    }
  });
});

// Back-to-top button
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('topBtn');
  window.addEventListener('scroll', () => {
    if (btn) btn.style.display = window.scrollY > 200 ? 'flex' : 'none';
  });
  if (btn) {
    btn.onclick = () => window.scrollTo({top:0,behavior:'smooth'});
  }
});

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.focus({ preventScroll: true });
      }
    });
  });
});

// Simple contact form validation
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = document.getElementById('formStatus');
  form.onsubmit = async function(e) {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name) { status.textContent = 'Name is required.'; status.classList.remove('success'); return; }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { status.textContent = 'Enter a valid email.'; status.classList.remove('success'); return; }
    if (!message) { status.textContent = 'Message is required.'; status.classList.remove('success'); return; }
    status.textContent = 'Sending...';
    status.classList.remove('success');
    try {
      const response = await fetch('https://formspree.io/f/mnqekgqj', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      if (response.ok) {
        status.textContent = 'Thank you! We will be in touch soon.';
        status.classList.add('success');
        form.reset();
      } else {
        status.textContent = 'There was an error. Please try again.';
        status.classList.remove('success');
      }
    } catch {
      status.textContent = 'There was an error. Please try again.';
      status.classList.remove('success');
    }
  };
});
