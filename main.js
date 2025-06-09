'use strict';

// Utility: DOM Ready
const onReady = fn => {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
};

// Loader overlay
onReady(() => {
  setTimeout(() => {
    const loader = document.getElementById('pageloader');
    if (loader) loader.classList.add('hide');
  }, 400);
});

// Service Worker Registration
onReady(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
});

// Set Current Year in Footer
onReady(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});

// Cookie Consent
onReady(() => {
  const cookieConsent = document.getElementById('cookieConsent');
  const acceptBtn = document.getElementById('acceptCookies');
  if (!localStorage.getItem('cookieConsent') && cookieConsent) {
    cookieConsent.classList.remove('hide');
  }
  if (acceptBtn) {
    acceptBtn.onclick = () => {
      localStorage.setItem('cookieConsent', 'true');
      if (cookieConsent) cookieConsent.classList.add('hide');
    };
  }
});

// Theme Toggle & Persistence
onReady(() => {
  const toggleBtn = document.getElementById('themeToggle');
  const icon = toggleBtn && toggleBtn.querySelector('i');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const setTheme = mode => {
    document.body.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('theme', mode);
    if (icon) icon.className = mode === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  };
  const saved = localStorage.getItem('theme');
  setTheme(saved ? saved : (prefersDark ? 'dark' : 'light'));
  if (toggleBtn) {
    toggleBtn.onclick = () => {
      setTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
    };
  }
});

// Back-to-top Button
onReady(() => {
  const btn = document.getElementById('topBtn');
  window.addEventListener('scroll', () => {
    if (btn) btn.style.display = window.scrollY > 200 ? 'block' : 'none';
  });
  if (btn) btn.onclick = () => window.scrollTo({top:0,behavior:'smooth'});
});

// Smooth Scroll for Anchor Links (with polyfill fallback)
onReady(() => {
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
});

// Dynamic Active Link Highlighting
onReady(() => {
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
    // Default to first if none matched
    if (!found && navLinks[0]) navLinks[0].setAttribute('aria-current', 'page');
  }
  window.addEventListener('hashchange', setActiveLink);
  setActiveLink();
});

// Contact Form Validation and Feedback
onReady(() => {
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
});

// Header Scroll Shadow, Progress, Sticky Hide/Show
onReady(() => {
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
    // Sticky hide/show
    if (header) {
      if (scY > lastScrollY && scY > 120) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = '';
      }
    }
    lastScrollY = scY;
  }, { passive: true });
});

// Mobile Nav (close on link click, ESC, focus trap, click outside, close on resize)
onReady(() => {
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
  // Close menu on link click (mobile)
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  // Close menu on outside click
  document.addEventListener('click', e => {
    if (menu.classList.contains('open') && !menu.contains(e.target) && e.target !== hamburger) {
      closeMenu();
    }
  });
  // Close menu on window resize (if > 900px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && menu.classList.contains('open')) {
      closeMenu();
    }
  });
});

// Reveal on Scroll (IntersectionObserver, prefers-reduced-motion support)
onReady(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver(es => {
      es.forEach(e => e.isIntersecting && e.target.classList.add('show'));
    }, { threshold: .15 });
    document.querySelectorAll('[data-animate]').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('show'));
  }
});

// Gallery Lightbox with Focus Trap
onReady(() => {
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
    trapFocus(overlay);
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
});

// Testimonials Carousel
onReady(() => {
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
  // Init
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
});

// Animated Counters
onReady(() => {
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
});

// Accessibility: Trap Focus in Modals
function trapFocus(element) {
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
}

// Skip Link Focus Management
onReady(() => {
  const skip = document.querySelector('.skip-link');
  if (skip) {
    skip.addEventListener('click', e => {
      const main = document.getElementById('home');
      if (main) main.focus();
    });
  }
});

// Sticky CTA & Chat Widget: Keyboard Accessibility
onReady(() => {
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
});
