'use strict';

// Core App Logic Encapsulation
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

  // Service Worker Registration
  sw() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  },

  // Footer Year
  year() {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  },

  // Cookie Consent
  cookieConsent() {
    const banner = document.getElementById('cookieConsent');
    const btn = document.getElementById('acceptCookies');
    if (!localStorage.getItem('cookieConsent') && banner) {
      banner.classList.remove('hide');
    }
    if (btn) {
      btn.onclick = () => {
        localStorage.setItem('cookieConsent', 'true');
        if (banner) banner.classList.add('hide');
      };
    }
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
      if (btn) btn.style.display = window.scrollY > 200 ? 'block' : 'none';
    });
    if (btn) btn.onclick = () => window.scrollTo({top:0,behavior:'smooth'});
  },

  // Smooth Scroll for Anchor Links
  smoothScroll() {
    document.body.addEventListener('click', function(e) {
      if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
          e.preventDefault();
          if ('scrollBehavior' in document.documentElement.style) {
            target.scrollIntoView({behavior:'smooth'});
          } else {
            window.location.hash = e.target.getAttribute('href');
          }
        }
      }
    });
  },

  // Dynamic Active Link Highlighting
  navActive() {
    const navLinks = document.querySelectorAll('#menu a');
    function setActiveLink() {
      let found = false;
      navLinks.forEach(link => {
        link.removeAttribute('aria-current');
        if (!found && window.location.hash && link.getAttribute('href') === window.location.hash) {
          link.setAttribute('aria-current', 'page');
          found = true;
        }
      });
      if (!found && navLinks[0]) navLinks[0].setAttribute('aria-current', 'page');
    }
    window.addEventListener('hashchange', setActiveLink);
    setActiveLink();
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
      const website = form.website.value.trim();
      let valid = true;
      form.querySelectorAll('.error-tooltip').forEach(el => el.textContent = '');
      // Reset aria-invalid
      form.name.setAttribute('aria-invalid','false');
      form.email.setAttribute('aria-invalid','false');
      form.message.setAttribute('aria-invalid','false');
      if (website) return false; // honeypot
      if (!name) { valid = false; form.name.setAttribute('aria-invalid','true'); document.getElementById('nameError').textContent='Name required.'; }
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { valid = false; form.email.setAttribute('aria-invalid','true'); document.getElementById('emailError').textContent='Valid email required.'; }
      if (!message) { valid = false; form.message.setAttribute('aria-invalid','true'); document.getElementById('messageError').textContent='Message required.'; }
      if (!valid) return false;
      const status = document.getElementById('formStatus');
      const submitText = document.getElementById('submitText');
      form.querySelector('button[type="submit"]').setAttribute('aria-busy','true');
      submitText.textContent = 'Sending...';
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
      }).finally(() => {
        form.querySelector('button[type="submit"]').setAttribute('aria-busy','false');
        submitText.textContent = 'Send Message';
      });
    };
  },

  // Header Scroll Shadow, Progress, Sticky Hide/Show
  headerScroll() {
    const header = document.getElementById('header');
    const progress = document.getElementById('progress');
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
      const scY = window.scrollY;
      if (header) header.classList.toggle('scrolled', scY > 80);
      if (progress) {
        const max = document.body.scrollHeight - innerHeight;
        progress.style.width = `${(scY / max) * 100}%`;
      }
      if (header) {
        if (scY > lastScrollY && scY > 120) {
          header.style.transform = 'translateY(-100%)';
        } else {
          header.style.transform = '';
        }
      }
      lastScrollY = scY;
    }, { passive: true });
  },

  // Mobile Nav
  mobileNav() {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    let menuOpen = false;
    const closeMenu = () => {
      menu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      menu.onkeydown = null;
      menuOpen = false;
    };
    hamburger.addEventListener('click', () => {
      menuOpen = menu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', menuOpen);
      if (menuOpen) {
        const focusable = menu.querySelectorAll('a');
        let idx = 0;
        if (focusable[0]) focusable[0].focus();
        menu.onkeydown = e => {
          if (e.key === 'Tab') {
            e.preventDefault();
            idx = e.shiftKey ? (idx - 1 + focusable.length) % focusable.length : (idx + 1) % focusable.length;
            focusable[idx].focus();
          }
          if (e.key === 'Escape') {
            closeMenu();
            hamburger.focus();
          }
        };
      } else {
        menu.onkeydown = null;
      }
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('click', e => {
      if (menu.classList.contains('open') && !menu.contains(e.target) && e.target !== hamburger) {
        closeMenu();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && menu.classList.contains('open')) {
        closeMenu();
      }
    });
  },

  // Reveal on Scroll
  revealOnScroll() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      const io = new IntersectionObserver(es => {
        es.forEach(e => e.isIntersecting && e.target.classList.add('show'));
      }, { threshold: .15 });
      document.querySelectorAll('[data-animate]').forEach(el => io.observe(el));
    } else {
      document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('show'));
    }
  },

  // Gallery Lightbox
  galleryLightbox() {
    const imgs = document.querySelectorAll('.gallery img');
    imgs.forEach((img, idx) => {
      img.addEventListener('click', () => openLightbox(idx));
      img.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') openLightbox(idx);
      });
    });
    function openLightbox(idx) {
      const arr = Array.from(document.querySelectorAll('.gallery img'));
      let current = idx;
      const overlay = document.createElement('div');
      overlay.id = 'lightbox';
      overlay.tabIndex = 0;
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', arr[current].alt);
      overlay.style.outline = 'none';
      const showImg = i => {
        overlay.innerHTML = `<img src="${arr[i].src.replace('600x400','1200x800')}" alt="${arr[i].alt}"><button id='close' tabindex="0" aria-label="Close" style="position:absolute;top:2rem;right:2rem;font-size:2.5rem;background:none;border:none;color:#fff;cursor:pointer;">&times;</button>`;
      };
      showImg(current);
      document.body.appendChild(overlay);
      overlay.focus();
      App.trapFocus(overlay);
      overlay.addEventListener('keydown', e => {
        if (e.key === 'Escape') overlay.remove();
        if (e.key === 'ArrowRight') { current = (current + 1) % arr.length; showImg(current);}
        if (e.key === 'ArrowLeft') { current = (current - 1 + arr.length) % arr.length; showImg(current);}
      });
      overlay.addEventListener('click', e => {
        if (e.target.id === 'lightbox' || e.target.id === 'close') overlay.remove();
      });
      overlay.addEventListener('keydown', e => {
        if (e.target.id === 'close' && (e.key === 'Enter' || e.key === ' ')) overlay.remove();
      });
      overlay.querySelector('#close').addEventListener('click', () => overlay.remove());
      // Swipe support
      let startX = null;
      overlay.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
      overlay.addEventListener('touchend', e => {
        if (!startX) return;
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;
        if (Math.abs(diff) > 30) {
          current = (current + (diff > 0 ? -1 : 1) + arr.length) % arr.length;
          showImg(current);
        }
        startX = null;
      });
    }
  },

  // Testimonials Carousel
  testimonials() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    const cards = carousel.querySelectorAll('.card');
    const indicators = document.querySelectorAll('.carousel-indicators button');
    let idx = 0, timer = null;
    function show(i) {
      idx = i;
      cards.forEach((c, j) => {
        c.style.display = j === i ? 'block' : 'none';
        c.setAttribute('aria-hidden', j === i ? 'false' : 'true');
      });
      indicators.forEach((b, j) => {
        b.classList.toggle('active', j === i);
        b.setAttribute('aria-selected', j === i ? 'true' : 'false');
      });
      carousel.setAttribute('aria-live', 'polite');
      setTimeout(() => carousel.setAttribute('aria-live', 'off'), 1000);
    }
    function next() { show((idx + 1) % cards.length); }
    function prev() { show((idx - 1 + cards.length) % cards.length); }
    function startAuto() {
      timer = setInterval(next, 7000);
    }
    function stopAuto() {
      clearInterval(timer);
    }
    show(0);
    startAuto();
    indicators.forEach((btn, i) => {
      btn.addEventListener('click', () => { show(i); stopAuto(); startAuto(); });
    });
    carousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { next(); stopAuto(); startAuto(); }
      if (e.key === 'ArrowLeft') { prev(); stopAuto(); startAuto(); }
    });
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);
    carousel.addEventListener('focusin', stopAuto);
    carousel.addEventListener('focusout', startAuto);
    // Touch swipe support
    let startX = null;
    carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    carousel.addEventListener('touchend', e => {
      if (!startX) return;
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      if (Math.abs(diff) > 30) {
        if (diff > 0) prev(); else next();
        stopAuto(); startAuto();
      }
      startX = null;
    });
  },

  // Animated Counters
  counters() {
    const animateCounter = (el, target, suffix) => {
      let start = target === 0 ? 0 : 1;
      const step = target > 0 ? Math.max(1, target / 60) : 1;
      let started = false;
      function run() {
        if (target === 0) {
          el.textContent = '0';
          return;
        }
        const i = setInterval(() => {
          start += step;
          if (start >= target) {
            el.textContent = target + (suffix || '');
            clearInterval(i);
          } else {
            el.textContent = Math.ceil(start) + (suffix || '');
          }
        }, 30);
      }
      function onScroll() {
        if (!started && el.getBoundingClientRect().top < window.innerHeight - 80) {
          started = true;
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            el.textContent = target + (suffix || '');
          } else {
            run();
          }
          window.removeEventListener('scroll', onScroll);
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    };
    animateCounter(document.getElementById('years'), 30, '+');
    animateCounter(document.getElementById('projects'), 150, '');
    animateCounter(document.getElementById('safety'), 0, '');
  },

  // Accessibility: Trap Focus in Modals
  trapFocus(element) {
    const focusable = element.querySelectorAll('a, button, textarea, input, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    let first = focusable[0], last = focusable[focusable.length - 1];
    element.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  },

  // Skip Link Focus Management
  skipLink() {
    const skip = document.querySelector('.skip-link');
    if (skip) {
      skip.addEventListener('click', e => {
        const main = document.getElementById('home');
        if (main) main.focus();
      });
    }
  },

  // Sticky CTA & Chat Widget: Keyboard Accessibility
  stickyChat() {
    const stickyCTA = document.getElementById('stickyCTA');
    const chatWidget = document.getElementById('chatWidget');
    if (stickyCTA) {
      stickyCTA.tabIndex = 0;
      stickyCTA.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          const link = stickyCTA.querySelector('a');
          if (link) link.click();
        }
      });
    }
    if (chatWidget) {
      chatWidget.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          chatWidget.setAttribute('aria-label', 'Chat support coming soon');
        }
      });
    }
  },

  // Enhanced: Keyboard Help Modal
  keyboardHelpModal() {
    const modal = document.getElementById('keyboardHelpModal');
    if (!modal) return;
    const closeBtn = modal.querySelector('.modal-close');
    function showModal() {
      modal.hidden = false;
      modal.focus();
      document.body.style.overflow = 'hidden';
    }
    function hideModal() {
      modal.hidden = true;
      document.body.style.overflow = '';
    }
    document.addEventListener('keydown', function(e) {
      if ((e.altKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        showModal();
      }
      if (e.key === 'Escape' && !modal.hidden) hideModal();
    });
    closeBtn?.addEventListener('click', hideModal);
    modal?.addEventListener('click', e => { if (e.target === modal) hideModal(); });
  },

  // Enhanced: Scroll Progress Bar
  scrollProgressBar() {
    const bar = document.getElementById('scrollProgressBar');
    if (!bar) return;
    window.addEventListener('scroll', function() {
      const max = document.body.scrollHeight - window.innerHeight;
      bar.style.width = `${(window.scrollY / max) * 100}%`;
    });
  },

  // Enhanced: Scroll to Next Section Button
  scrollNextBtn() {
    const btn = document.getElementById('scrollNextBtn');
    const nextSection = document.getElementById('about');
    if (!btn || !nextSection) return;
    btn.onclick = () => {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    };
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  },

  // Language Switcher (EN/ES demo)
  languageSwitcher() {
    const enBtn = document.getElementById('langEn');
    const esBtn = document.getElementById('langEs');
    const translations = {
      es: {
        'About Us': 'Sobre Nosotros',
        'Our Services': 'Nuestros Servicios',
        'Our 4‑Step Process': 'Nuestro Proceso de 4 Pasos',
        'Featured Projects': 'Proyectos Destacados',
        'Awards & Certifications': 'Premios y Certificaciones',
        'What Our Clients Say': 'Lo Que Dicen Nuestros Clientes',
        'Frequently Asked Questions': 'Preguntas Frecuentes',
        'Latest News': 'Últimas Noticias',
        'Ready to break ground?': '¿Listo para comenzar?',
        'Request a free consultation and project estimate.': 'Solicite una consulta y presupuesto gratuitos.',
        'Subscribe to Our Newsletter': 'Suscríbase a Nuestro Boletín',
        'Send Message': 'Enviar Mensaje',
        'Request a Quote': 'Solicitar Cotización',
        'Search…': 'Buscar…',
        'Your Name': 'Su Nombre',
        'Email': 'Correo Electrónico',
        'Phone (optional)': 'Teléfono (opcional)',
        'Project details…': 'Detalles del proyecto…',
        'Copy Phone': 'Copiar Teléfono',
        'Copy Email': 'Copiar Correo',
        'Print': 'Imprimir',
        'vCard': 'vCard',
        'Subscribe': 'Suscribirse',
        'Stay updated:': 'Manténgase informado:',
        'Join our newsletter': 'Únase a nuestro boletín'
      }
    };
    function translateTo(lang) {
      document.querySelectorAll('h2, h3, .btn, label, input[placeholder], textarea[placeholder], .footer-newsletter-hint span, #siteSearch input').forEach(el => {
        let txt = el.textContent || el.placeholder;
        Object.entries(translations[lang]).forEach(([en, es]) => {
          if (txt && txt.trim() === en) {
            if (el.placeholder !== undefined) el.placeholder = es;
            else el.textContent = es;
          }
        });
      });
      // Update aria-labels and button text
      document.getElementById('searchInput').setAttribute('aria-label', lang === 'es' ? 'Buscar en el sitio' : 'Search site');
      document.getElementById('newsletterForm').querySelector('button').textContent = lang === 'es' ? 'Suscribirse' : 'Subscribe';
      document.getElementById('langEn').setAttribute('aria-current', lang === 'en');
      document.getElementById('langEs').setAttribute('aria-current', lang === 'es');
    }
    if (enBtn && esBtn) {
      enBtn.onclick = () => translateTo('en');
      esBtn.onclick = () => translateTo('es');
    }
  },

  // Advanced Search with Suggestions
  searchSuggestions() {
    const searchInput = document.getElementById('searchInput');
    const suggestionsBox = document.getElementById('searchSuggestions');
    const data = [
      { label: 'About Us', anchor: '#about' },
      { label: 'Our Services', anchor: '#services' },
      { label: 'Process', anchor: '#process' },
      { label: 'Projects', anchor: '#projects' },
      { label: 'Awards', anchor: '#awards' },
      { label: 'Testimonials', anchor: '#testimonials' },
      { label: 'FAQ', anchor: '#faq' },
      { label: 'Contact', anchor: '#contact' },
      { label: 'Newsletter', anchor: '#newsletter' }
    ];
    let currentIdx = -1;
    function showSuggestions(val) {
      suggestionsBox.innerHTML = '';
      if (!val) {
        suggestionsBox.classList.remove('show');
        return;
      }
      const filtered = data.filter(d => d.label.toLowerCase().includes(val.toLowerCase()));
      if (!filtered.length) {
        suggestionsBox.classList.remove('show');
        return;
      }
      filtered.forEach((item, idx) => {
        const li = document.createElement('li');
        li.textContent = item.label;
        li.setAttribute('role', 'option');
        li.setAttribute('tabindex', '-1');
        li.onclick = () => {
          window.location.hash = item.anchor;
          suggestionsBox.classList.remove('show');
        };
        suggestionsBox.appendChild(li);
      });
      suggestionsBox.classList.add('show');
      currentIdx = -1;
    }
    searchInput.addEventListener('input', e => showSuggestions(e.target.value));
    searchInput.addEventListener('keydown', e => {
      const items = suggestionsBox.querySelectorAll('li');
      if (!items.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentIdx = (currentIdx + 1) % items.length;
        items.forEach((li, i) => li.setAttribute('aria-selected', i === currentIdx));
        items[currentIdx].focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentIdx = (currentIdx - 1 + items.length) % items.length;
        items.forEach((li, i) => li.setAttribute('aria-selected', i === currentIdx));
        items[currentIdx].focus();
      }
      if (e.key === 'Enter' && currentIdx >= 0) {
        items[currentIdx].click();
      }
      if (e.key === 'Escape') {
        suggestionsBox.classList.remove('show');
      }
    });
    document.addEventListener('click', e => {
      if (!suggestionsBox.contains(e.target) && e.target !== searchInput) {
        suggestionsBox.classList.remove('show');
      }
    });
  },

  // Newsletter Double Opt-In Confirmation
  newsletter() {
    const form = document.getElementById('newsletterForm');
    const status = document.getElementById('newsletterStatus');
    const confirmBox = document.getElementById('newsletterConfirm');
    if (!form) return;
    form.onsubmit = function(e) {
      e.preventDefault();
      const email = form.newsletterEmail.value.trim();
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        status.textContent = 'Please enter a valid email.';
        return false;
      }
      status.textContent = 'Subscribing...';
      fetch('https://formspree.io/f/mnqekgqj', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      }).then(response => {
        if (response.ok) {
          status.textContent = '';
          confirmBox.hidden = false;
          form.reset();
        } else {
          status.textContent = 'There was an error. Please try again.';
        }
      }).catch(() => {
        status.textContent = 'There was an error. Please try again.';
      });
    };
  },

  // Tooltips for Contact Actions
  contactTooltips() {
    document.querySelectorAll('.contact-actions button[data-tooltip]').forEach(btn => {
      btn.addEventListener('focus', () => btn.setAttribute('data-show-tooltip', 'true'));
      btn.addEventListener('blur', () => btn.removeAttribute('data-show-tooltip'));
      btn.addEventListener('mouseleave', () => btn.removeAttribute('data-show-tooltip'));
    });
  },

  // Contact Actions: Copy/Print/vCard
  contactActions() {
    const phoneBtn = document.getElementById('copyPhoneBtn');
    const emailBtn = document.getElementById('copyEmailBtn');
    const vCardBtn = document.getElementById('downloadVCardBtn');
    const printBtn = document.getElementById('printPageBtn');
    if (phoneBtn) {
      phoneBtn.onclick = () => {
        navigator.clipboard.writeText('312-555-1234');
        phoneBtn.setAttribute('data-tooltip', 'Copied!');
        setTimeout(() => phoneBtn.setAttribute('data-tooltip', 'Copy to clipboard'), 1200);
      };
    }
    if (emailBtn) {
      emailBtn.onclick = () => {
        navigator.clipboard.writeText('info@alliedconstruction.com');
        emailBtn.setAttribute('data-tooltip', 'Copied!');
        setTimeout(() => emailBtn.setAttribute('data-tooltip', 'Copy to clipboard'), 1200);
      };
    }
    if (vCardBtn) {
      vCardBtn.onclick = () => {
        const vcf = `BEGIN:VCARD
VERSION:3.0
FN:Allied Construction
ORG:Allied Construction
TEL;TYPE=WORK,VOICE:+1-312-555-1234
EMAIL:info@alliedconstruction.com
ADR;TYPE=WORK:;;Chicago;IL;USA
URL:https://alliedconstruction.github.io/
END:VCARD`;
        const blob = new Blob([vcf], { type: 'text/vcard' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'allied-construction.vcf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        vCardBtn.setAttribute('data-tooltip', 'Downloaded!');
        setTimeout(() => vCardBtn.setAttribute('data-tooltip', 'Download vCard'), 1200);
      };
    }
    if (printBtn) {
      printBtn.onclick = () => window.print();
    }
  },

  // Enhanced: Contact Modal
  contactModal() {
    const modal = document.getElementById('contactModal');
    const openBtn = document.getElementById('openContactBtn');
    const closeBtn = modal.querySelector('.modal-close');
    const form = document.getElementById('contactForm');
    function openModal() {
      modal.hidden = false;
      modal.setAttribute('aria-modal', 'true');
      modal.focus();
      App.trapFocus(modal);
    }
    function closeModal() {
      modal.hidden = true;
      modal.removeAttribute('aria-modal');
      form.reset();
    }
    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    modal.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // App Initialization
  App.ready(() => {
    App.loader();
    App.sw();
    App.year();
    App.cookieConsent();
    App.theme();
    App.backToTop();
    App.smoothScroll();
    App.navActive();
    App.contactForm();
    App.headerScroll();
    App.mobileNav();
    App.revealOnScroll();
    App.galleryLightbox();
    App.testimonials();
    App.counters();
    App.trapFocus(document.body);
    App.skipLink();
    App.stickyChat();
    App.keyboardHelpModal();
    App.scrollProgressBar();
    App.scrollNextBtn();
    // Advanced features
    App.languageSwitcher();
    App.searchSuggestions();
    App.newsletter();
    App.contactTooltips();
    App.contactActions();
    App.contactModal();
  });
