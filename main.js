// ===== Utility: DOM Ready =====
const onReady = fn => {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
};

// ===== Loader overlay =====
onReady(() => {
  setTimeout(() => {
    document.getElementById('pageloader').classList.add('hide');
  }, 400);
});

// ===== Cookie Consent =====
onReady(() => {
  const cookieConsent = document.getElementById('cookieConsent');
  if (!localStorage.getItem('cookieConsent')) {
    cookieConsent.classList.remove('hide');
  }
  document.getElementById('acceptCookies').onclick = () => {
    localStorage.setItem('cookieConsent', '1');
    cookieConsent.classList.add('hide');
  };
});

// ===== Header scroll shadow, progress, sticky hide/show =====
onReady(() => {
  const header = document.getElementById('header');
  const progress = document.getElementById('progress');
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const scY = window.scrollY;
    header.classList.toggle('scrolled', scY > 80);
    const max = document.body.scrollHeight - innerHeight;
    progress.style.width = `${(scY / max) * 100}%`;
    // Sticky hide/show
    if (scY > lastScrollY && scY > 120) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = '';
    }
    lastScrollY = scY;
  }, { passive: true });
});

// ===== Mobile Nav (close on link click, ESC, focus trap, click outside, close on resize) =====
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

// ===== Theme Toggle (with transition, system preference on first load) =====
onReady(() => {
  const toggleBtn = document.getElementById('themeToggle');
  const root = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const setTheme = mode => {
    root.classList.toggle('dark', mode === 'dark');
    root.classList.toggle('light', mode === 'light');
    localStorage.setItem('theme', mode);
    toggleBtn.innerHTML = mode === 'dark'
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
    document.body.style.transition = 'background .4s, color .4s';
  };
  const saved = localStorage.getItem('theme');
  if (saved) setTheme(saved);
  else setTheme(prefersDark ? 'dark' : 'light');
  toggleBtn.addEventListener('click', () =>
    setTheme(root.classList.contains('dark') ? 'light' : 'dark')
  );
});

// ===== Active link & back-to-top =====
onReady(() => {
  const links = document.querySelectorAll('nav a');
  const topBtn = document.getElementById('topBtn');
  window.addEventListener('scroll', () => {
    const fromTop = scrollY + 90;
    links.forEach(l => {
      const section = document.querySelector(l.getAttribute('href'));
      if (section && section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
        l.classList.add('active');
        l.setAttribute('aria-current', 'page');
      } else {
        l.classList.remove('active');
        l.removeAttribute('aria-current');
      }
    });
    topBtn.classList.toggle('show', scrollY > 700);
  }, { passive: true });
  topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
});

// ===== Reveal on scroll (IntersectionObserver, prefers-reduced-motion support) =====
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

// ===== Counters (animate on scroll into view, reduced motion support) =====
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

// ===== Accessibility: Trap focus in modals and improve keyboard navigation =====
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

// ===== Enhanced Gallery Lightbox: focus trap, ESC close, ARIA improvements =====
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

// ===== Enhanced Testimonials Carousel: pause on focus, resume on blur, ARIA improvements =====
onReady(() => {
  const carousel = document.querySelector('.carousel');
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

// ===== Anchor scroll restoration (for smooth scroll and focus) =====
onReady(() => {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.focus({ preventScroll: true });
      }
    });
  });
});

// ===== Form: AJAX submit, validation, honeypot, accessibility, improved error handling =====
onReady(() => {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const btn = form.querySelector('button[type="submit"]');
  const nameInput = form.querySelector('#name');
  const emailInput = form.querySelector('#email');
  const messageInput = form.querySelector('#message');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const honeypot = form.querySelector('input[name="website"]');
  function validate() {
    let valid = true;
    // Name
    if (!nameInput.value.trim()) {
      nameError.textContent = 'Name is required';
      nameInput.parentElement.classList.add('error');
      valid = false;
    } else {
      nameError.textContent = '';
      nameInput.parentElement.classList.remove('error');
    }
    // Email
    const emailVal = emailInput.value.trim();
    if (!emailVal) {
      emailError.textContent = 'Email is required';
      emailInput.parentElement.classList.add('error');
      valid = false;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailVal)) {
      emailError.textContent = 'Invalid email address';
      emailInput.parentElement.classList.add('error');
      valid = false;
    } else {
      emailError.textContent = '';
      emailInput.parentElement.classList.remove('error');
    }
    // Message
    if (!messageInput.value.trim()) {
      messageError.textContent = 'Message is required';
      messageInput.parentElement.classList.add('error');
      valid = false;
    } else {
      messageError.textContent = '';
      messageInput.parentElement.classList.remove('error');
    }
    return valid;
  }
  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('input', validate);
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    status.textContent = '';
    if (honeypot.value) return; // bot detected
    if (!validate()) {
      status.textContent = 'Please fix errors above.';
      status.style.color = '#f44336';
      return;
    }
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    btn.querySelector('#submitText').textContent = 'Sending...';
    const data = new FormData(form);
    fetch('https://formspree.io/f/mwkajgyd', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    }).then(response => {
      btn.disabled = false;
      btn.setAttribute('aria-busy', 'false');
      btn.querySelector('#submitText').textContent = 'Send Message';
      if (response.ok) {
        form.reset();
        status.innerHTML = 'Message sent successfully!';
        status.style.color = '#4caf50';
      } else {
        status.innerHTML = 'Error sending message. Please try again later.';
        status.style.color = '#f44336';
      }
    }).catch(() => {
      btn.disabled = false;
      btn.setAttribute('aria-busy', 'false');
      btn.querySelector('#submitText').textContent = 'Send Message';
      status.innerHTML = 'Network error. Please try again.';
      status.style.color = '#f44336';
    });
  });
});

// ===== Footer: Set copyright year =====
onReady(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});

// ===== Skip link focus management =====
onReady(() => {
  const skip = document.querySelector('.skip-link');
  if (skip) {
    skip.addEventListener('click', e => {
      const main = document.getElementById('home');
      if (main) main.focus();
    });
  }
});

// ===== Sticky CTA & Chat Widget: Keyboard accessibility =====
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
        // Placeholder: open chat modal or focus chat input
        chatWidget.setAttribute('aria-label', 'Chat support coming soon');
      }
    });
  }
});
