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

// Highlight active nav link on scroll
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = Array.from(document.querySelectorAll('.nav-menu a'));
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
  const setActive = () => {
    let idx = sections.findIndex((section, i) =>
      section && window.scrollY + 120 < section.offsetTop + section.offsetHeight
    );
    if (idx === -1) idx = sections.length - 1;
    navLinks.forEach((link, i) => {
      if (i === idx) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
});

// Keyboard accessibility for cards
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card, .testimonial-card').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        card.classList.add('focus-effect');
        setTimeout(() => card.classList.remove('focus-effect'), 200);
      }
    });
  });
});

// Modal dialog logic for form submission
function showModal() {
  const modal = document.getElementById('formModal');
  const overlay = document.getElementById('modalOverlay');
  if (modal && overlay) {
    modal.style.display = 'block';
    overlay.style.display = 'block';
    modal.focus();
    // Trap focus inside modal
    const focusable = modal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
    let first = focusable[0], last = focusable[focusable.length - 1];
    modal.onkeydown = e => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
      if (e.key === 'Escape') closeModal();
    };
    // Close on overlay click
    overlay.onclick = closeModal;
    // Close on button click
    document.getElementById('closeModalBtn').onclick = closeModal;
  }
}
function closeModal() {
  const modal = document.getElementById('formModal');
  const overlay = document.getElementById('modalOverlay');
  if (modal && overlay) {
    modal.style.display = 'none';
    overlay.style.display = 'none';
    document.getElementById('contactForm').querySelector('input, textarea').focus();
  }
}

// Improved smooth scroll polyfill for older browsers
(function() {
  if ('scrollBehavior' in document.documentElement.style) return;
  window.scrollTo = function(options) {
    if (typeof options === 'object' && options.top !== undefined) {
      window.scroll(0, options.top);
    }
  };
})();

// Debounce utility for scroll events
function debounce(fn, ms) {
  let t; return (...args) => {
    clearTimeout(t); t = setTimeout(() => fn.apply(this, args), ms);
  };
}

// Back-to-top button (debounced for performance)
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('topBtn');
  window.addEventListener('scroll', debounce(() => {
    if (btn) btn.style.display = window.scrollY > 200 ? 'flex' : 'none';
  }, 50));
  if (btn) {
    btn.onclick = () => window.scrollTo({top:0,behavior:'smooth'});
  }
});

// Improved smooth scroll for anchor links (with reduced motion support)
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
        setTimeout(() => target.focus({ preventScroll: true }), 300);
      }
    });
  });
});

// Simple contact form validation
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = document.getElementById('formStatus');
  const fields = [
    { id: 'name', error: 'nameError', message: 'Name is required.' },
    { id: 'email', error: 'emailError', message: 'Enter a valid email.' },
    { id: 'message', error: 'messageError', message: 'Message is required.' },
    { id: 'phone', error: 'phoneError', message: 'Enter a valid phone number.' }
  ];
  // Add error message elements if not present
  fields.forEach(f => {
    let el = document.getElementById(f.error);
    if (!el) {
      el = document.createElement('span');
      el.id = f.error;
      el.className = 'error-message';
      const input = document.getElementById(f.id);
      if (input && input.parentNode) input.parentNode.appendChild(el);
    }
  });
  form.onsubmit = async function(e) {
    e.preventDefault();
    let valid = true;
    // Clear previous errors
    fields.forEach(f => {
      const err = document.getElementById(f.error);
      if (err) err.textContent = '';
    });
    status.textContent = '';
    status.classList.remove('success');
    // Validate fields
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const phone = form.phone.value.trim();
    if (!name) {
      document.getElementById('nameError').textContent = 'Name is required.';
      valid = false;
    }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      document.getElementById('emailError').textContent = 'Enter a valid email.';
      valid = false;
    }
    if (!message) {
      document.getElementById('messageError').textContent = 'Message is required.';
      valid = false;
    }
    if (phone && !/^[0-9+\-\s().]{7,}$/.test(phone)) {
      document.getElementById('phoneError').textContent = 'Enter a valid phone number.';
      valid = false;
    }
    if (!valid) return;
    status.textContent = 'Sending...';
    try {
      const response = await fetch('https://formspree.io/f/mnqekgqj', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      if (response.ok) {
        status.textContent = '';
        status.classList.add('success');
        form.reset();
        showModal();
      } else {
        status.textContent = 'There was an error. Please try again later.';
      }
    } catch (err) {
      status.textContent = 'Network error. Please try again.';
    }
  };
});
