'use strict';

// --- Utility Functions ---
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const ready = fn => (document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn));
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const throttle = (fn, wait) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
};
const debounce = (fn, ms) => {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), ms); };
};
const lockScroll = lock => { document.body.style.overflow = lock ? 'hidden' : ''; };
const setFavicon = theme => {
  const favicon = $('link[rel="icon"]');
  if (!favicon) return;
  const color = theme === 'dark' ? '%231d4ed8' : '%231d4ed8';
  favicon.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='${color}'/><text x='50' y='60' font-size='50' text-anchor='middle' fill='white' font-family='Montserrat'>A</text></svg>`;
};
const setThemeColorMeta = color => {
  let meta = $('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.content = color;
};

// --- Advanced Theme Animated Transition ---
const animateThemeTransition = () => {
  const body = document.body;
  body.classList.add('theme-transition');
  setTimeout(() => body.classList.remove('theme-transition'), 500);
};

// --- Main ---
ready(async () => {
  // Year in footer
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // --- Theme Management ---
  const html = document.documentElement;
  const themeBtn = $('#themeToggle');
  const themeIcon = themeBtn && themeBtn.querySelector('i');
  let themeMode = localStorage.getItem('themeMode') || 'auto';
  const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const getThemeColor = theme => theme === 'dark' ? '#181a23' : '#f8fafc';
  function setTheme(mode) {
    animateThemeTransition();
    themeMode = mode;
    localStorage.setItem('themeMode', mode);
    let theme = mode === 'auto' ? getSystemTheme() : mode;
    html.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark', theme === 'dark');
    if (themeIcon) themeIcon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    if (themeBtn) themeBtn.setAttribute('aria-pressed', theme === 'dark');
    setFavicon(theme);
    setThemeColorMeta(getThemeColor(theme));
  }
  setTheme(themeMode);
  if (themeBtn) {
    themeBtn.onclick = () => {
      const next = { light: 'dark', dark: 'auto', auto: 'light' }[themeMode] || 'light';
      setTheme(next);
    };
    themeBtn.title = 'Toggle theme (light/dark/auto)';
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (themeMode === 'auto') setTheme('auto');
  });
  document.addEventListener('keydown', e => {
    if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey && (e.key === 't' || e.key === 'T')) {
      themeBtn?.click();
    }
  });

  // --- Focus Ring for Keyboard Users ---
  (() => {
    function showRing(e) { if (e.key === 'Tab') document.body.classList.add('show-focus-ring'); }
    function hideRing() { document.body.classList.remove('show-focus-ring'); }
    window.addEventListener('keydown', showRing);
    window.addEventListener('mousedown', hideRing);
    window.addEventListener('touchstart', hideRing);
  })();

  // --- Animate Hero Headline/Sub (ARIA live) ---
  setTimeout(() => {
    $('#heroHeadline')?.classList.add('animated');
    $('#heroSub')?.classList.add('animated');
    // Animate color transition
    $('#heroHeadline')?.style.setProperty('color', 'var(--accent)');
    $('#heroSub')?.style.setProperty('color', 'var(--accent)');
    const live = document.createElement('div');
    live.setAttribute('aria-live', 'polite');
    live.className = 'visually-hidden';
    live.textContent = 'Build Better. Build Allied.';
    document.body.appendChild(live);
    setTimeout(() => live.remove(), 2000);
  }, 400);

  // --- IntersectionObserver for AOS/Fade-in (robust) ---
  function observeAOS() {
    const els = $$('[data-aos]');
    if ('IntersectionObserver' in window && !prefersReducedMotion()) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      els.forEach(el => observer.observe(el));
    } else {
      els.forEach(el => el.classList.add('aos-animate'));
    }
  }
  observeAOS();

  // --- Mobile Nav (improved accessibility) ---
  const hamburger = $('#hamburger');
  const menu = $('#menu');
  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      const open = !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      if (open) menu.querySelector('a').focus();
    });
    $$('.nav-menu a', menu).forEach(link => link.addEventListener('click', () => {
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
    hamburger.setAttribute('aria-haspopup', 'true');
    hamburger.setAttribute('aria-expanded', false);
  }

  // --- Back-to-top Button (with ARIA live) ---
  const topBtn = $('#topBtn');
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
    topBtn.setAttribute('aria-live', 'polite');
  }

  // --- Nav Highlight on Scroll (improved) ---
  const navLinks = $$('.nav-menu a');
  const sections = navLinks.map(link => $(link.getAttribute('href')));
  function setActive() {
    let idx = sections.findIndex((section, i) =>
      section && window.scrollY + 120 < section.offsetTop + section.offsetHeight
    );
    if (idx === -1) idx = sections.length - 1;
    navLinks.forEach((link, i) => {
      if (i === idx) {
        link.setAttribute('aria-current', 'page');
        link.classList.add('active');
      } else {
        link.removeAttribute('aria-current');
        link.classList.remove('active');
      }
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  // --- Keyboard Navigation for Cards (improved) ---
  const allCards = $$('.card, .testimonial-card');
  allCards.forEach((card, idx) => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        card.classList.add('focus-effect');
        setTimeout(() => card.classList.remove('focus-effect'), 200);
      }
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

  // --- Smooth Scroll for Anchor Links (improved) ---
  $$( 'a[href^="#"]' ).forEach(link => {
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
    link.setAttribute('role', 'link');
  });

  // --- Modal Dialog Logic (with Focus Trap, Scroll Lock, ARIA) ---
  function trapFocus(modal) {
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
  }
  function showModal() {
    const modal = $('#formModal');
    const overlay = $('#modalOverlay');
    if (modal && overlay) {
      modal.style.display = 'block';
      overlay.style.display = 'block';
      modal.focus();
      lockScroll(true);
      trapFocus(modal);
      overlay.onclick = closeModal;
      $('#closeModalBtn').onclick = closeModal;
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('role', 'dialog');
    }
  }
  function closeModal() {
    const modal = $('#formModal');
    const overlay = $('#modalOverlay');
    if (modal && overlay) {
      modal.style.display = 'none';
      overlay.style.display = 'none';
      lockScroll(false);
      const form = $('#contactForm');
      if (form) {
        const firstInput = form.querySelector('input, textarea');
        if (firstInput) firstInput.focus();
      }
    }
  }
  window.showModal = showModal;
  window.closeModal = closeModal;

  // --- Keyboard Help Modal (with Focus Trap, Scroll Lock, ARIA) ---
  function showHelpModal() {
    const modal = $('#helpModal');
    if (!modal) return;
    modal.style.display = 'block';
    modal.focus();
    lockScroll(true);
    document.body.setAttribute('aria-hidden', 'true');
    trapFocus(modal);
    $('#closeHelpModalBtn').onclick = closeHelpModal;
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('role', 'dialog');
  }
  function closeHelpModal() {
    const modal = $('#helpModal');
    if (!modal) return;
    modal.style.display = 'none';
    lockScroll(false);
    document.body.removeAttribute('aria-hidden');
    $('#themeToggle')?.focus();
  }
  window.showHelpModal = showHelpModal;
  window.closeHelpModal = closeHelpModal;

  // --- Scroll Progress Bar (animated) ---
  const scrollProgress = $('#scrollProgress');
  function updateScrollProgress() {
    const h = document.documentElement, b = document.body;
    const st = h.scrollTop || b.scrollTop, sh = h.scrollHeight - h.clientHeight;
    const pct = sh > 0 ? (st / sh) * 100 : 0;
    if (scrollProgress) {
      scrollProgress.style.width = pct + '%';
      scrollProgress.setAttribute('aria-valuenow', Math.round(pct));
    }
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // --- Sticky Header Hide/Show on Scroll (with shadow) ---
  const siteHeader = $('#siteHeader');
  let lastScrollY = window.scrollY;
  let headerHidden = false;
  function handleHeaderHide() {
    const curr = window.scrollY;
    if (!siteHeader) return;
    if (curr > lastScrollY && curr > 80 && !headerHidden) {
      siteHeader.style.transform = 'translateY(-100%)';
      siteHeader.classList.add('scrolled');
      headerHidden = true;
    } else if (curr < lastScrollY && headerHidden) {
      siteHeader.style.transform = '';
      siteHeader.classList.remove('scrolled');
      headerHidden = false;
    }
    lastScrollY = curr;
  }
  window.addEventListener('scroll', throttle(handleHeaderHide, 80), { passive: true });

  // --- Hero Headline Typing Effect (with gradient) ---
  const heroHeadline = $('#heroHeadline');
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
    heroHeadline.style.background = 'linear-gradient(90deg, var(--accent), var(--primary), var(--accent))';
    heroHeadline.style.backgroundSize = '200% 200%';
    heroHeadline.style.webkitBackgroundClip = 'text';
    heroHeadline.style.backgroundClip = 'text';
    heroHeadline.style.color = 'transparent';
  }

  // --- Sticky CTA Hide When Embed In View (IntersectionObserver) ---
  const stickyCta = $('#stickyCta');
  function stickyCtaObserver() {
    if (!stickyCta) return;
    const embed = $('#embed');
    const isMobile = window.innerWidth <= 700;
    if ('IntersectionObserver' in window && embed) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          stickyCta.style.display = (isMobile && !entry.isIntersecting) ? 'flex' : 'none';
        });
      }, { threshold: 0.1 });
      observer.observe(embed);
      window.addEventListener('resize', () => observer.observe(embed));
    } else {
      function fallback() {
        let hide = false;
        if (embed) {
          const rect = embed.getBoundingClientRect();
          hide = rect.top < window.innerHeight && rect.bottom > 0;
        }
        stickyCta.style.display = (isMobile && !hide) ? 'flex' : 'none';
      }
      window.addEventListener('scroll', fallback, { passive: true });
      window.addEventListener('resize', fallback);
      fallback();
    }
    stickyCta.setAttribute('aria-live', 'polite');
  }
  stickyCtaObserver();

  // --- Print Button and Print Mode (with ARIA) ---
  const printBtn = $('#printBtn');
  if (printBtn) {
    printBtn.onclick = () => {
      document.body.classList.add('printing');
      window.print();
    };
    window.addEventListener('afterprint', () => {
      document.body.classList.remove('printing');
    });
    printBtn.setAttribute('aria-live', 'polite');
  }

  // --- Keyboard Shortcuts (improved) ---
  document.addEventListener('keydown', function(e) {
    if ((e.key === '?' || e.key === '/') && !e.ctrlKey && !e.altKey && !e.metaKey) {
      if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        showHelpModal();
        e.preventDefault();
      }
    }
    if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      if (e.key === '1') $('a[href="#about"]')?.click();
      if (e.key === '2') $('a[href="#services"]')?.click();
      if (e.key === '3') $('a[href="#projects"]')?.click();
      if (e.key === '4') $('a[href="#embed"]')?.click();
    }
    if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey && e.key === '0') {
      window.scrollTo({top:0,behavior:'smooth'});
    }
    if (e.key === 'Escape') {
      closeHelpModal();
      closeModal();
    }
  });

  // --- Loading Overlay Hide (animated) ---
  const loadingOverlay = $('#loadingOverlay');
  window.addEventListener('load', () => {
    if (loadingOverlay) {
      loadingOverlay.setAttribute('aria-hidden', 'true');
      loadingOverlay.style.opacity = '0';
      setTimeout(() => loadingOverlay.style.display = 'none', prefersReducedMotion() ? 0 : 400);
    }
  });

  // --- Scroll Down Arrow in Hero (improved) ---
  const scrollDownArrow = $('#scrollDownArrow');
  if (scrollDownArrow) {
    scrollDownArrow.onclick = () => {
      const about = $('#about');
      if (about) about.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    scrollDownArrow.setAttribute('aria-live', 'polite');
  }

  // --- Fade-in Cards on Scroll (IntersectionObserver, robust) ---
  function fadeInOnScroll() {
    const els = $$('.card, .project-card, .testimonial-card');
    if ('IntersectionObserver' in window && !prefersReducedMotion()) {
      const observer = new IntersectionObserver(entries => {
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
    els.forEach(el => el.setAttribute('aria-live', 'polite'));
  }
  fadeInOnScroll();

  // --- Copy Email Button (Visual Feedback, ARIA) ---
  const copyEmailBtn = $('#copyEmailBtn');
  const emailInput = $('#email');
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
    copyEmailBtn.setAttribute('aria-live', 'polite');
  }

  function greetUser() {
    console.log('Hello from Allied Construction! Enjoy your visit.');
  }
  greetUser();

  // PWA: service-worker registration
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');
    } catch (err) {
      console.error('SW registration failed:', err);
    }
  }

  // Performance: log Largest Contentful Paint
  new PerformanceObserver(list => {
    list.getEntries().forEach(e => console.log('LCP:', e.startTime));
  }).observe({ type: 'largest-contentful-paint', buffered: true });

  // PWA: install prompt UI
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = document.getElementById('installBtn');
    if (btn) {
      btn.style.display = 'block';
      btn.onclick = async () => {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        console.log('PWA install:', choice.outcome);
        btn.style.display = 'none';
      };
    }
  });

  // Dynamic import example (analytics)
  if (navigator.onLine) {
    import('./analytics.js')
      .then(mod => mod.initAnalytics())
      .catch(() => {/* no analytics */});
  }
});

// --- Smooth Scroll Polyfill for All Anchor Links ---
(function() {
  if ('scrollBehavior' in document.documentElement.style) return;
  window.scrollTo = function(options) {
    if (typeof options === 'object' && options.top !== undefined) {
      window.scroll(0, options.top);
    }
  };
})();

// --- Restore Scroll Position on Back/Forward ---
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

class AdvancedWebsite {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.handleLoading();
    this.setupScrollEffects();
    this.setupFormValidation();
    this.setupAnimations();
    this.setupServiceInteractions();
  }

  setupEventListeners() {
    // Navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle?.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = target.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // CTA button interaction
    const ctaButton = document.querySelector('.cta-button');
    ctaButton?.addEventListener('click', () => {
      this.showNotification('Welcome! Explore our amazing features below.', 'success');
      document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
    });

    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    backToTopButton?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  handleLoading() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    // Simulate loading time and hide loading screen
    window.addEventListener('load', () => {
      setTimeout(() => {
        loadingScreen?.classList.add('hidden');
        setTimeout(() => {
          loadingScreen?.remove();
        }, 500);
      }, 1000);
    });
  }

  setupScrollEffects() {
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    const backToTopButton = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Header hide/show on scroll
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      lastScrollTop = scrollTop;

      // Back to top button visibility
      if (scrollTop > 500) {
        backToTopButton?.classList.add('visible');
      } else {
        backToTopButton?.classList.remove('visible');
      }

      // Parallax effect for floating shapes
      this.updateParallax(scrollTop);
    });
  }

  updateParallax(scrollTop) {
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
      const speed = 0.5 + (index * 0.2);
      const yPos = -(scrollTop * speed);
      shape.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  }

  setupAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    // Observe elements with animation attributes
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.classList.add('fade-up');
      observer.observe(el);
    });
  }

  setupFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const validators = {
      name: (value) => {
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return null;
      },
      email: (value) => {
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return null;
      },
      message: (value) => {
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        return null;
      }
    };

    // Real-time validation
    Object.keys(validators).forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      const errorElement = field?.parentElement.querySelector('.error-message');

      field?.addEventListener('blur', () => {
        this.validateField(field, validators[fieldName], errorElement);
      });

      field?.addEventListener('input', () => {
        if (field.classList.contains('error')) {
          this.validateField(field, validators[fieldName], errorElement);
        }
      });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      // Validate all fields
      Object.keys(validators).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        const errorElement = field?.parentElement.querySelector('.error-message');
        const fieldValid = this.validateField(field, validators[fieldName], errorElement);
        if (!fieldValid) isValid = false;
      });

      if (isValid) {
        this.submitForm(data);
      }
    });
  }

  validateField(field, validator, errorElement) {
    const error = validator(field.value);
    
    if (error) {
      field.classList.add('error');
      if (errorElement) errorElement.textContent = error;
      return false;
    } else {
      field.classList.remove('error');
      if (errorElement) errorElement.textContent = '';
      return true;
    }
  }

  async submitForm(data) {
    const submitButton = document.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    try {
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;

      // Simulate API call
      await this.delay(2000);
      
      this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
      document.querySelector('.contact-form').reset();
      
    } catch (error) {
      this.showNotification('Failed to send message. Please try again.', 'error');
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }

  setupServiceInteractions() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
      item.addEventListener('click', () => {
        const service = item.dataset.service;
        this.showServiceDetails(service);
      });

      // Add ripple effect
      item.addEventListener('mousedown', (e) => {
        this.createRipple(e, item);
      });
    });
  }

  showServiceDetails(service) {
    const serviceDetails = {
      'web-dev': 'Our web development services include modern frameworks like React, Vue, and Angular, along with robust backend solutions.',
      'mobile-dev': 'We create native iOS and Android apps, as well as cross-platform solutions using React Native and Flutter.',
      'ui-ux': 'Our design team focuses on user research, wireframing, prototyping, and creating beautiful, intuitive interfaces.'
    };

    const detail = serviceDetails[service] || 'Service details coming soon!';
    this.showNotification(detail, 'info');
  }

  createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }

  showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      padding: 1rem 1.5rem;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      border-radius: 0.5rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
      word-wrap: break-word;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Add dynamic ripple animation CSS
const rippleCSS = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AdvancedWebsite();
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close mobile menu if open
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    if (navMenu?.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  }
});

// Performance monitoring
if ('PerformanceObserver' in window) {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime);
      }
    });
  });
  
  observer.observe({ entryTypes: ['largest-contentful-paint'] });
}
