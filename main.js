'use strict';

// Helper: DOM ready
function ready(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

ready(() => {
  // Set current year in footer (advanced: use data-year)
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Advanced theme toggle using data-theme on <html>
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const themeIcon = themeBtn && themeBtn.querySelector('i');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  function setTheme(mode) {
    html.setAttribute('data-theme', mode);
    document.body.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('theme', mode);
    if (themeIcon) themeIcon.className = mode === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  }
  const savedTheme = localStorage.getItem('theme');
  setTheme(savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light'));
  if (themeBtn) {
    themeBtn.onclick = () => setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }

  // Animate hero headline/subtitle on load
  setTimeout(() => {
    document.getElementById('heroHeadline')?.classList.add('animated');
    document.getElementById('heroSub')?.classList.add('animated');
  }, 400);

  // Animate On Scroll (AOS) for [data-aos] elements
  function aosInit() {
    const els = document.querySelectorAll('[data-aos]');
    function animate() {
      els.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
          el.classList.add('aos-animate');
        }
      });
    }
    window.addEventListener('scroll', animate, { passive: true });
    animate();
  }
  aosInit();

  // Mobile nav
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('menu');
  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      const open = !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      if (open) menu.querySelector('a').focus();
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
  }

  // Back-to-top button (debounced)
  const topBtn = document.getElementById('topBtn');
  function toggleTopBtn() {
    if (topBtn) topBtn.style.display = window.scrollY > 200 ? 'flex' : 'none';
  }
  window.addEventListener('scroll', debounce(toggleTopBtn, 50));
  toggleTopBtn();
  if (topBtn) {
    topBtn.onclick = () => window.scrollTo({top:0,behavior:'smooth'});
  }

  // Highlight active nav link on scroll
  const navLinks = Array.from(document.querySelectorAll('.nav-menu a'));
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
  function setActive() {
    let idx = sections.findIndex((section, i) =>
      section && window.scrollY + 120 < section.offsetTop + section.offsetHeight
    );
    if (idx === -1) idx = sections.length - 1;
    navLinks.forEach((link, i) => {
      if (i === idx) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  // Keyboard accessibility for cards (advanced: arrow navigation)
  const allCards = Array.from(document.querySelectorAll('.card, .testimonial-card'));
  allCards.forEach((card, idx) => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        card.classList.add('focus-effect');
        setTimeout(() => card.classList.remove('focus-effect'), 200);
      }
      // Arrow navigation between cards
      if (['ArrowRight', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        const next = allCards[idx + 1] || allCards[0];
        next.focus();
      }
      if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        const prev = allCards[idx - 1] || allCards[allCards.length - 1];
        prev.focus();
      }
    });
  });

  // Improved smooth scroll for anchor links (with reduced motion support)
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
      overlay.onclick = closeModal;
      document.getElementById('closeModalBtn').onclick = closeModal;
    }
  }
  function closeModal() {
    const modal = document.getElementById('formModal');
    const overlay = document.getElementById('modalOverlay');
    if (modal && overlay) {
      modal.style.display = 'none';
      overlay.style.display = 'none';
      const form = document.getElementById('contactForm');
      if (form) {
        const firstInput = form.querySelector('input, textarea');
        if (firstInput) firstInput.focus();
      }
    }
  }

  // Expose modal functions globally for form handler
  window.showModal = showModal;
  window.closeModal = closeModal;

  // Scroll progress bar
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const h = document.documentElement, b = document.body;
    const st = h.scrollTop || b.scrollTop, sh = h.scrollHeight - h.clientHeight;
    const pct = sh > 0 ? (st / sh) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // Sticky header shadow on scroll
  const siteHeader = document.getElementById('siteHeader');
  function toggleHeaderShadow() {
    if (!siteHeader) return;
    if (window.scrollY > 10) siteHeader.classList.add('scrolled');
    else siteHeader.classList.remove('scrolled');
  }
  window.addEventListener('scroll', toggleHeaderShadow, { passive: true });
  toggleHeaderShadow();

  // Hero headline typing effect
  const heroHeadline = document.getElementById('heroHeadline');
  if (heroHeadline) {
    const text = "Build Better. Build Allied.";
    heroHeadline.textContent = "";
    let idx = 0;
    function typeNext() {
      if (idx <= text.length) {
        heroHeadline.textContent = text.slice(0, idx);
        idx++;
        setTimeout(typeNext, idx === text.length ? 400 : 55);
      } else {
        heroHeadline.classList.add('animated');
      }
    }
    setTimeout(typeNext, 400);
  }

  // Improved sticky CTA hide if embed section is in view or on desktop
  const stickyCta = document.getElementById('stickyCta');
  function toggleStickyCta() {
    if (!stickyCta) return;
    const embed = document.getElementById('embed');
    const isMobile = window.innerWidth <= 700;
    let hide = false;
    if (embed) {
      const rect = embed.getBoundingClientRect();
      hide = rect.top < window.innerHeight && rect.bottom > 0;
    }
    stickyCta.style.display = (isMobile && !hide) ? 'flex' : 'none';
  }
  window.addEventListener('scroll', toggleStickyCta, { passive: true });
  window.addEventListener('resize', toggleStickyCta);
  toggleStickyCta();

  // Print page button logic
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.onclick = () => window.print();
    printBtn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        printBtn.click();
      }
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Show help modal with '?'
    if ((e.key === '?' || e.key === '/') && !e.ctrlKey && !e.altKey && !e.metaKey) {
      if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        showHelpModal();
        e.preventDefault();
      }
    }
    // Alt+1..5 for nav
    if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      if (e.key === '1') document.querySelector('a[href="#about"]')?.click();
      if (e.key === '2') document.querySelector('a[href="#services"]')?.click();
      if (e.key === '3') document.querySelector('a[href="#projects"]')?.click();
      if (e.key === '4') document.querySelector('a[href="#testimonials"]')?.click();
      if (e.key === '5') document.querySelector('a[href="#contact"]')?.click();
    }
    // Alt+0 for scroll to top
    if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey && e.key === '0') {
      window.scrollTo({top:0,behavior:'smooth'});
    }
    // Esc closes help modal
    if (e.key === 'Escape') closeHelpModal();
  });

  // Loading overlay: hide when page is loaded
  const loadingOverlay = document.getElementById('loadingOverlay');
  window.addEventListener('load', () => {
    if (loadingOverlay) {
      loadingOverlay.setAttribute('aria-hidden', 'true');
      setTimeout(() => loadingOverlay.style.display = 'none', 400);
    }
  });

  // Auto dark mode by time (7pm-7am)
  function autoDarkMode() {
    const hour = new Date().getHours();
    if (!localStorage.getItem('theme')) {
      setTheme(hour >= 19 || hour < 7 ? 'dark' : 'light');
    }
  }
  autoDarkMode();

  // Scroll-down arrow in hero
  const scrollDownArrow = document.getElementById('scrollDownArrow');
  if (scrollDownArrow) {
    scrollDownArrow.onclick = () => {
      const about = document.getElementById('about');
      if (about) about.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
  }

  // Fade-in cards on scroll
  function fadeInOnScroll() {
    document.querySelectorAll('.card, .project-card, .testimonial-card').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        el.classList.add('visible');
      }
    });
  }
  window.addEventListener('scroll', fadeInOnScroll, { passive: true });
  fadeInOnScroll();

  // Copy email button (advanced: visual feedback)
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailInput = document.getElementById('email');
  if (copyEmailBtn && emailInput) {
    copyEmailBtn.onclick = () => {
      navigator.clipboard.writeText(emailInput.value || emailInput.placeholder || '').then(() => {
        copyEmailBtn.classList.add('copied');
        copyEmailBtn.setAttribute('aria-label', 'Copied!');
        setTimeout(() => {
          copyEmailBtn.classList.remove('copied');
          copyEmailBtn.setAttribute('aria-label', 'Copy email address');
        }, 1200);
      });
    };
    copyEmailBtn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copyEmailBtn.click();
      }
    });
  }
});

// Debounce utility for scroll events
function debounce(fn, ms) {
  let t; return (...args) => {
    clearTimeout(t); t = setTimeout(() => fn.apply(this, args), ms);
  };
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

// All high-level features (accessibility, smooth scroll, nav highlight, contact form UX, modal dialog, back-to-top, theme toggle) are implemented as required.
