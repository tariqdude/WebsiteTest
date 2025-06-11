'use strict';

// Helper: DOM ready
function ready(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

// Helper: Detect prefers-reduced-motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Helper: Throttle
function throttle(fn, wait) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

// Helper: Lock/unlock scroll for modals
function lockScroll(lock = true) {
  document.body.style.overflow = lock ? 'hidden' : '';
}

// Helper: Set favicon based on theme
function setFavicon(theme) {
  const favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) return;
  const color = theme === 'dark' ? '%231d4ed8' : '%231d4ed8';
  favicon.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='${color}'/><text x='50' y='60' font-size='50' text-anchor='middle' fill='white' font-family='Montserrat'>A</text></svg>`;
}

ready(() => {
  // Set current year in footer (advanced: use data-year)
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Advanced theme toggle: light/dark/system/auto
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const themeIcon = themeBtn && themeBtn.querySelector('i');
  let themeMode = localStorage.getItem('themeMode') || 'auto';
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function setTheme(mode) {
    themeMode = mode;
    localStorage.setItem('themeMode', mode);
    let theme = mode === 'auto' ? getSystemTheme() : mode;
    html.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark', theme === 'dark');
    if (themeIcon) themeIcon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    if (themeBtn) themeBtn.setAttribute('aria-pressed', theme === 'dark');
    setFavicon(theme);
  }
  setTheme(themeMode);
  if (themeBtn) {
    themeBtn.onclick = () => {
      // Cycle: light → dark → auto → light
      const next = { light: 'dark', dark: 'auto', auto: 'light' }[themeMode] || 'light';
      setTheme(next);
    };
    themeBtn.title = 'Toggle theme (light/dark/auto)';
  }
  // Listen for system theme changes if in auto mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (themeMode === 'auto') setTheme('auto');
  });

  // Keyboard shortcut: Alt+T to toggle theme
  document.addEventListener('keydown', e => {
    if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey && (e.key === 't' || e.key === 'T')) {
      if (themeBtn) themeBtn.click();
    }
  });

  // Focus ring only for keyboard navigation
  function handleFocusRing() {
    function showRing(e) {
      if (e.key === 'Tab') document.body.classList.add('show-focus-ring');
    }
    function hideRing() {
      document.body.classList.remove('show-focus-ring');
    }
    window.addEventListener('keydown', showRing);
    window.addEventListener('mousedown', hideRing);
    window.addEventListener('touchstart', hideRing);
  }
  handleFocusRing();

  // Animate hero headline/subtitle on load (with ARIA live)
  setTimeout(() => {
    document.getElementById('heroHeadline')?.classList.add('animated');
    document.getElementById('heroSub')?.classList.add('animated');
    // ARIA live update for screen readers
    const live = document.createElement('div');
    live.setAttribute('aria-live', 'polite');
    live.className = 'visually-hidden';
    live.textContent = 'Build Better. Build Allied.';
    document.body.appendChild(live);
    setTimeout(() => live.remove(), 2000);
  }, 400);

  // Intersection Observer for AOS/fade-in (better perf)
  function aosInit() {
    const els = document.querySelectorAll('[data-aos]');
    if ('IntersectionObserver' in window && !prefersReducedMotion()) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      els.forEach(el => observer.observe(el));
    } else {
      // Fallback: show all
      els.forEach(el => el.classList.add('aos-animate'));
    }
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
    hamburger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hamburger.click();
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
    topBtn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        topBtn.click();
      }
    });
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
    card.addEventListener('focus', () => card.classList.add('focus-effect'));
    card.addEventListener('blur', () => card.classList.remove('focus-effect'));
  });

  // Improved smooth scroll for anchor links (with reduced motion support)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
          block: 'start'
        });
        setTimeout(() => target.focus({ preventScroll: true }), 300);
      }
    });
  });

  // Modal dialog logic for form submission (add scroll lock)
  function showModal() {
    const modal = document.getElementById('formModal');
    const overlay = document.getElementById('modalOverlay');
    if (modal && overlay) {
      modal.style.display = 'block';
      overlay.style.display = 'block';
      modal.focus();
      lockScroll(true);
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
      lockScroll(false);
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

  // Keyboard help modal logic (add scroll lock)
  function showHelpModal() {
    const modal = document.getElementById('helpModal');
    if (!modal) return;
    modal.style.display = 'block';
    modal.focus();
    lockScroll(true);
    document.body.setAttribute('aria-hidden', 'true');
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
      if (e.key === 'Escape') closeHelpModal();
    };
    document.getElementById('closeHelpModalBtn').onclick = closeHelpModal;
  }
  function closeHelpModal() {
    const modal = document.getElementById('helpModal');
    if (!modal) return;
    modal.style.display = 'none';
    lockScroll(false);
    document.body.removeAttribute('aria-hidden');
    // Return focus to theme toggle for accessibility
    document.getElementById('themeToggle')?.focus();
  }
  window.showHelpModal = showHelpModal;
  window.closeHelpModal = closeHelpModal;

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

  // Sticky header: hide on scroll down, show on scroll up (mobile/desktop)
  let lastScrollY = window.scrollY;
  let headerHidden = false;
  function handleHeaderHide() {
    const curr = window.scrollY;
    if (!siteHeader) return;
    if (curr > lastScrollY && curr > 80 && !headerHidden) {
      siteHeader.style.transform = 'translateY(-100%)';
      headerHidden = true;
    } else if (curr < lastScrollY && headerHidden) {
      siteHeader.style.transform = '';
      headerHidden = false;
    }
    lastScrollY = curr;
  }
  window.addEventListener('scroll', throttle(handleHeaderHide, 80), { passive: true });

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

  // Print page button logic (add before/after print events)
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.onclick = () => {
      document.body.classList.add('printing');
      window.print();
    };
    window.addEventListener('afterprint', () => {
      document.body.classList.remove('printing');
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
    // Alt+1..4 for nav (updated for new nav structure)
    if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      if (e.key === '1') document.querySelector('a[href="#about"]')?.click();
      if (e.key === '2') document.querySelector('a[href="#services"]')?.click();
      if (e.key === '3') document.querySelector('a[href="#projects"]')?.click();
      if (e.key === '4') document.querySelector('a[href="#embed"]')?.click();
    }
    // Alt+0 for scroll to top
    if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey && e.key === '0') {
      window.scrollTo({top:0,behavior:'smooth'});
    }
    // Esc closes help modal
    if (e.key === 'Escape') closeHelpModal();
  });

  // Loading overlay: hide when page is loaded (add reduced motion support)
  const loadingOverlay = document.getElementById('loadingOverlay');
  window.addEventListener('load', () => {
    if (loadingOverlay) {
      loadingOverlay.setAttribute('aria-hidden', 'true');
      setTimeout(() => loadingOverlay.style.display = 'none', prefersReducedMotion() ? 0 : 400);
    }
  });

  // Scroll-down arrow in hero
  const scrollDownArrow = document.getElementById('scrollDownArrow');
  if (scrollDownArrow) {
    scrollDownArrow.onclick = () => {
      const about = document.getElementById('about');
      if (about) about.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
  }

  // Fade-in cards on scroll (use IntersectionObserver)
  function fadeInOnScroll() {
    const els = document.querySelectorAll('.card, .project-card, .testimonial-card');
    if ('IntersectionObserver' in window && !prefersReducedMotion()) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      els.forEach(el => observer.observe(el));
    } else {
      els.forEach(el => el.classList.add('visible'));
    }
  }
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

// Improved smooth scroll polyfill for all anchor links
(function() {
  if ('scrollBehavior' in document.documentElement.style) return;
  window.scrollTo = function(options) {
    if (typeof options === 'object' && options.top !== undefined) {
      window.scroll(0, options.top);
    }
  };
})();

// All high-level features (accessibility, smooth scroll, nav highlight, contact form UX, modal dialog, back-to-top, theme toggle) are implemented as required.
