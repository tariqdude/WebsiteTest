'use strict';

// Utility: DOM Ready
function ready(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

// Loader Overlay (with fade out)
function loader() {
  const loader = document.getElementById('pageloader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hide'), 400);
    setTimeout(() => loader.style.display = 'none', 1000);
  });
}

// Footer Year
function year() {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
}

// Theme Toggle & Persistence (with ARIA)
function theme() {
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
}

// Back-to-top Button (with requestAnimationFrame for perf)
function backToTop() {
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
}

// Mobile Nav (ARIA expanded, keyboard accessible, focus trap)
function mobileNav() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('menu');
  if (!hamburger || !menu) return;
  hamburger.addEventListener('click', () => {
    const open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    if (open) {
      // Focus first link
      const firstLink = menu.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  });
  hamburger.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && !menu.classList.contains('open')) {
      e.preventDefault();
      hamburger.click();
    }
  });
  menu.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      menu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      hamburger.focus();
    }
  });
  // Focus trap fallback (in case HTML script fails)
  menu.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      const focusable = menu.querySelectorAll('a');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
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
  // Close menu on outside click
  document.addEventListener('click', function(e) {
    if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
      menu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    }
  });
}

// Highlight active nav link on scroll
function navHighlight() {
  const sections = ['about', 'services', 'projects', 'contact'];
  const navLinks = Array.from(document.querySelectorAll('#menu a'));
  function onScroll() {
    let current = '';
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el && window.scrollY + 120 >= el.offsetTop) current = id;
    }
    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${current}`) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Smooth scroll for anchor links (with offset for sticky header)
function smoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const yOffset = window.innerWidth > 700 ? 70 : 56;
        const y = target.getBoundingClientRect().top + window.pageYOffset - yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        setTimeout(() => {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }, 400);
      }
    });
  });
}

// Animate stats numbers when visible (IntersectionObserver, reduced motion support)
function animateStats() {
  const stats = [
    { id: 'years', end: 30, suffix: '+', duration: 1200 },
    { id: 'projects', end: 150, suffix: '', duration: 1200 },
    { id: 'safety', end: 0, suffix: '', duration: 1200 }
  ];
  let animated = false;
  function animateValue(el, end, suffix, duration) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = end + suffix;
      return;
    }
    let start = 0, startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = end + suffix;
    }
    requestAnimationFrame(step);
  }
  function trigger() {
    if (animated) return;
    stats.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) animateValue(el, s.end, s.suffix, s.duration);
    });
    animated = true;
  }
  const statsDiv = document.querySelector('.stats');
  if (!statsDiv) return;
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        trigger();
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(statsDiv);
  } else {
    // fallback
    function onScroll() {
      const rect = statsDiv.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        trigger();
        window.removeEventListener('scroll', onScroll);
      }
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
  }
}

// Section fade-in on scroll (IntersectionObserver)
function sectionFadeIn() {
  const sections = document.querySelectorAll('main section, .cta-banner, #testimonials');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13 });
    sections.forEach(sec => observer.observe(sec));
  } else {
    // fallback
    function reveal() {
      const trigger = window.innerHeight * 0.92;
      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < trigger) sec.classList.add('visible');
      });
    }
    window.addEventListener('scroll', reveal);
    reveal();
  }
}

// Gallery images fade-in effect
function galleryFadeIn() {
  const imgs = document.querySelectorAll('.gallery img');
  imgs.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.7s cubic-bezier(.4,0,.2,1)';
    img.addEventListener('load', () => {
      img.style.opacity = '1';
    });
    if (img.complete) img.style.opacity = '1';
  });
}

// Floating label support for form (for accessibility)
function floatingLabels() {
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
    field.addEventListener('blur', function() {
      if (this.value) this.classList.add('filled');
      else this.classList.remove('filled');
    });
  });
}

// Contact Form Validation and Feedback (async, ARIA live region)
function contactForm() {
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
      status.classList.remove('success');
      status.style.color = '';
      return false;
    }
    status.textContent = 'Sending...';
    status.setAttribute('aria-live', 'polite');
    status.classList.remove('success');
    status.style.color = '';
    try {
      // Replace with your endpoint or use Formspree for demo
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
        status.setAttribute('aria-live', 'assertive');
        status.classList.remove('success');
      }
    } catch {
      status.textContent = 'There was an error. Please try again.';
      status.setAttribute('aria-live', 'assertive');
      status.classList.remove('success');
    }
  };
}

// Accessibility: Focus main on skip link
function skipLinkFocus() {
  const skip = document.querySelector('.skip-link');
  if (skip) {
    skip.addEventListener('click', e => {
      const main = document.getElementById('home');
      if (main) {
        e.preventDefault();
        main.setAttribute('tabindex', '-1');
        main.focus({ preventScroll: true });
      }
    });
  }
}

// Enhance CTA button animation
function enhanceCTA() {
  const ctaBtn = document.querySelector('.cta-banner .btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('mouseenter', () => {
      ctaBtn.style.transform = 'scale(1.06)';
      ctaBtn.style.boxShadow = '0 6px 24px rgba(251,191,36,0.18)';
    });
    ctaBtn.addEventListener('mouseleave', () => {
      ctaBtn.style.transform = '';
      ctaBtn.style.boxShadow = '';
    });
  }
}

// On DOM ready, initialize all features
ready(() => {
  loader();
  year();
  theme();
  backToTop();
  mobileNav();
  navHighlight();
  smoothScroll();
  animateStats();
  sectionFadeIn();
  galleryFadeIn();
  floatingLabels();
  contactForm();
  skipLinkFocus();
  enhanceCTA();
});
