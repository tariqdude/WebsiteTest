/* =============================================================================
   SCRIPTS.JS
   ========================================================================== */

/* Utility: Debounce */
function debounce(func, wait = 20, immediate = true) {
  let timeout;
  return function () {
    const context = this, args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/* =============================================================================
   HEADER SHRINK ON SCROLL
   ========================================================================== */
const header = document.getElementById('site-header');
function handleHeaderShrink() {
  if (window.scrollY > 100) {
    header.classList.add('header--small');
  } else {
    header.classList.remove('header--small');
  }
}
window.addEventListener('scroll', debounce(handleHeaderShrink, 20));

/* =============================================================================
   MOBILE NAV MENU TOGGLE
   ========================================================================== */
const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  mobileNav.setAttribute('aria-hidden', String(expanded));
  mobileNav.classList.toggle('nav--open');
  if (!expanded) {
    // Animate each nav item with a slight delay
    const items = mobileNav.querySelectorAll('.nav__item');
    items.forEach((item, i) => {
      item.style.animationDelay = `${i * 0.1 + 0.2}s`;
    });
  }
});

/* Close mobile nav when a link is clicked */
mobileNav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileNav.classList.remove('nav--open');
  });
});

/* =============================================================================
   SMOOTH SCROLL & ACTIVE NAV LINK HIGHLIGHT
   ========================================================================== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

function highlightNav() {
  let scrollPos = window.scrollY + (window.innerHeight / 3);
  sections.forEach(section => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      const id = section.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('nav__link--active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}
window.addEventListener('scroll', debounce(highlightNav, 20));

/* =============================================================================
   BACK-TO-TOP & SCROLL PROGRESS
   ========================================================================== */
const backToTopBtn = document.getElementById('backToTop');
const scrollProgress = document.getElementById('scrollProgress');

function handleScrollUI() {
  // Back to Top visibility
  if (window.scrollY > 800) {
    backToTopBtn.classList.add('back-to-top--visible');
  } else {
    backToTopBtn.classList.remove('back-to-top--visible');
  }
  // Scroll Progress
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / docHeight) * 100;
  scrollProgress.style.width = `${scrolled}%`;
}
window.addEventListener('scroll', debounce(handleScrollUI, 20));

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =============================================================================
   PROJECT FILTERING
   ========================================================================== */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Toggle active class
    filterButtons.forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');
    const filter = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.style.display = 'block';
        card.classList.remove('filtered-out');
      } else {
        card.style.display = 'none';
        card.classList.add('filtered-out');
      }
    });
  });
});

/* =============================================================================
   SCROLL-ON-LOAD ANIMATIONS (IntersectionObserver)
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
  };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(el => observer.observe(el));
}

/* =============================================================================
   LAZY-LOADING IMAGES & BGs (IntersectionObserver)
   ========================================================================== */
function initLazyLoad() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const lazyBackgrounds = document.querySelectorAll('[data-bg]');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px 200px 0px',
    threshold: 0.1
  };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.tagName === 'IMG' && el.dataset.src) {
          el.src = el.dataset.src;
          if (el.dataset.srcset) el.srcset = el.dataset.srcset;
          el.removeAttribute('loading');
        } else if (el.dataset.bg) {
          el.style.backgroundImage = `url('${el.dataset.bg}')`;
          el.removeAttribute('data-bg');
        }
        obs.unobserve(el);
      }
    });
  }, observerOptions);

  lazyImages.forEach(img => observer.observe(img));
  lazyBackgrounds.forEach(bg => observer.observe(bg));
}

/* =============================================================================
   TESTIMONIAL CAROUSEL
   ========================================================================== */
function initCarousel() {
  const track = document.querySelector('.carousel__track');
  const slides = Array.from(track.children);
  const prevButton = document.querySelector('.carousel__prev');
  const nextButton = document.querySelector('.carousel__next');
  const indicatorsContainer = document.querySelector('.carousel__indicators');
  const indicators = Array.from(indicatorsContainer.children);
  let currentIndex = 0;
  let autoRotate;

  function updateSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('carousel__slide--active', i === index);
      slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
    indicators.forEach((dot, i) => {
      dot.classList.toggle('carousel__indicator--active', i === index);
    });
  }

  function goToNext() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlide(currentIndex);
  }
  function goToPrev() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlide(currentIndex);
  }

  nextButton.addEventListener('click', () => {
    goToNext();
    resetAutoRotate();
  });
  prevButton.addEventListener('click', () => {
    goToPrev();
    resetAutoRotate();
  });
  indicators.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      currentIndex = idx;
      updateSlide(currentIndex);
      resetAutoRotate();
    });
  });

  // Auto-rotate
  function startAutoRotate() {
    autoRotate = setInterval(goToNext, 5000);
  }
  function resetAutoRotate() {
    clearInterval(autoRotate);
    startAutoRotate();
  }

  // Pause on hover/focus
  const carouselRegion = document.querySelector('.testimonials__carousel');
  carouselRegion.addEventListener('mouseenter', () => clearInterval(autoRotate));
  carouselRegion.addEventListener('mouseleave', () => startAutoRotate());
  carouselRegion.addEventListener('focusin', () => clearInterval(autoRotate));
  carouselRegion.addEventListener('focusout', () => startAutoRotate());

  // Keyboard navigation
  carouselRegion.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      goToNext();
      resetAutoRotate();
    } else if (e.key === 'ArrowLeft') {
      goToPrev();
      resetAutoRotate();
    }
  });

  // Initialize
  updateSlide(currentIndex);
  startAutoRotate();
}

/* =============================================================================
   CONTACT FORM VALIDATION & SUBMISSION
   ========================================================================== */
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

function showError(input, message) {
  const errorEl = document.getElementById(`${input.id}Error`);
  errorEl.textContent = message;
  input.setAttribute('aria-invalid', 'true');
}

function clearError(input) {
  const errorEl = document.getElementById(`${input.id}Error`);
  errorEl.textContent = '';
  input.removeAttribute('aria-invalid');
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  let valid = true;

  // Fields
  const name = contactForm.querySelector('#name');
  const email = contactForm.querySelector('#email');
  const phone = contactForm.querySelector('#phone');
  const details = contactForm.querySelector('#details');

  // Clear previous errors
  [name, email, phone, details].forEach(clearError);
  formMessage.textContent = '';
  formMessage.className = 'form__message';

  // Validate Name
  if (!name.value.trim()) {
    showError(name, 'Please enter your name.');
    valid = false;
  }

  // Validate Email
  if (!email.value.trim()) {
    showError(email, 'Please enter your email.');
    valid = false;
  } else if (!validateEmail(email.value.trim())) {
    showError(email, 'Please enter a valid email address.');
    valid = false;
  }

  // Validate Phone (optional)
  if (phone.value.trim()) {
    const phoneRe = /^[0-9\-+()\s]{7,20}$/;
    if (!phoneRe.test(phone.value.trim())) {
      showError(phone, 'Please enter a valid phone number.');
      valid = false;
    }
  }

  // Validate Details
  if (!details.value.trim()) {
    showError(details, 'Please provide project details.');
    valid = false;
  }

  if (!valid) {
    return;
  }

  // Submit (Example uses Fetch to placeholder endpoint)
  const formData = {
    name: name.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    details: details.value.trim()
  };

  try {
    const response = await fetch('https://formspree.io/f/your-form-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      formMessage.textContent = 'Thank you! Your message has been sent.';
      formMessage.classList.add('success');
      contactForm.reset();
      name.focus();
    } else {
      throw new Error('Network response was not OK');
    }
  } catch (err) {
    formMessage.textContent = 'Oops! Something went wrong. Please try again later.';
    formMessage.classList.add('error');
  }
});

/* =============================================================================
   COOKIE CONSENT BANNER
   ========================================================================== */
const cookieBanner = document.getElementById('cookieConsent');
const acceptCookiesBtn = document.getElementById('acceptCookies');

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
}

function checkCookieConsent() {
  if (getCookie('cookieConsent') !== 'true') {
    cookieBanner.classList.add('show');
  }
}

acceptCookiesBtn.addEventListener('click', () => {
  setCookie('cookieConsent', 'true', 365);
  cookieBanner.classList.remove('show');
});

document.addEventListener('DOMContentLoaded', () => {
  checkCookieConsent();
});

/* =============================================================================
   INITIALIZATIONS ON DOM CONTENT LOADED
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initLazyLoad();
  initCarousel();
  const themeToggleBtn = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
});
