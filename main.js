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

// The following logic is added for PWA and UX improvements
// (see index.html for inline script, but this file is for main logic)
// If you want to move the logic from index.html <script> to here, you can do so:

// Service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js');
  });
}
// Set current year in footer
(function() {
  var yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
})();
// Cookie consent logic
(function() {
  var consent = localStorage.getItem('cookieConsent');
  var banner = document.getElementById('cookieConsent');
  var btn = document.getElementById('acceptCookies');
  if (banner && btn) {
    if (!consent) banner.classList.remove('hide');
    btn.onclick = function() {
      localStorage.setItem('cookieConsent', 'true');
      banner.classList.add('hide');
    };
  }
})();
// Theme toggle
(function() {
  var btn = document.getElementById('themeToggle');
  var icon = btn && btn.querySelector('i');
  var dark = localStorage.getItem('theme') === 'dark';
  if (dark) document.body.classList.add('dark');
  if (btn && icon) {
    btn.onclick = function() {
      document.body.classList.toggle('dark');
      var isDark = document.body.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      icon.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    };
    icon.className = document.body.classList.contains('dark') ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  }
})();
// Back-to-top button
(function() {
  var btn = document.getElementById('topBtn');
  window.addEventListener('scroll', function() {
    if (btn) btn.style.display = window.scrollY > 200 ? 'block' : 'none';
  });
  if (btn) btn.onclick = function() { window.scrollTo({top:0,behavior:'smooth'}); };
})();
// Smooth scroll for anchor links
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth'});
      }
    });
  });
})();
// Contact form validation and feedback
(function() {
  var form = document.getElementById('contactForm');
  if (!form) return;
  form.onsubmit = function(e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();
    var website = form.website.value.trim();
    var valid = true;
    form.querySelectorAll('.error-tooltip').forEach(function(el){el.textContent='';});
    if (website) return false; // honeypot
    if (!name) { valid=false; form.name.setAttribute('aria-invalid','true'); document.getElementById('nameError').textContent='Name required.'; }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { valid=false; form.email.setAttribute('aria-invalid','true'); document.getElementById('emailError').textContent='Valid email required.'; }
    if (!message) { valid=false; form.message.setAttribute('aria-invalid','true'); document.getElementById('messageError').textContent='Message required.'; }
    if (!valid) return false;
    var status = document.getElementById('formStatus');
    var submitText = document.getElementById('submitText');
    form.querySelector('button[type="submit"]').setAttribute('aria-busy','true');
    submitText.textContent = 'Sending...';
    fetch('https://formspree.io/f/mnqekgqj', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    }).then(function(response) {
      if (response.ok) {
        status.textContent = 'Thank you! We will be in touch soon.';
        form.reset();
      } else {
        status.textContent = 'There was an error. Please try again.';
      }
    }).catch(function() {
      status.textContent = 'There was an error. Please try again.';
    }).finally(function() {
      form.querySelector('button[type="submit"]').setAttribute('aria-busy','false');
      submitText.textContent = 'Send Message';
    });
  };
})();
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

// ===== Gallery Lightbox =====
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

// ===== Testimonials Carousel =====
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

// ===== Animated Counters =====
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

// ===== Service Worker Registration for PWA =====
onReady(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
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
