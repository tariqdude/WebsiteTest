/* =============================================================================
   SCRIPTS.JS
   ========================================================================== */

/* =============================================================================
   SCROLL-ON-LOAD ANIMATIONS (IntersectionObserver)
   ========================================================================== */
export function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
  };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);
  elements.forEach((el) => observer.observe(el));
}
/* =============================================================================
   LAZY-LOADING IMAGES & BGs (IntersectionObserver)
   ========================================================================== */
export function initLazyLoad() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const lazyBackgrounds = document.querySelectorAll('[data-bg]');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px 200px 0px',
    threshold: 0.1
  };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.tagName === 'IMG' && el.dataset.src) {
          const img = el;
          img.src = img.dataset.src;
          if (img.dataset.srcset)
            img.srcset = img.dataset.srcset;
          img.removeAttribute('loading');
        }
        else if (el.dataset.bg) {
          el.style.backgroundImage = `url('${el.dataset.bg}')`;
          el.removeAttribute('data-bg');
        }
        obs.unobserve(el);
      }
    });
  }, observerOptions);
  lazyImages.forEach((img) => observer.observe(img));
  lazyBackgrounds.forEach((bg) => observer.observe(bg));
}
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

  if (getCookie('cookieConsent') !== 'true') {
    cookieBanner.classList.add('show');
  }
}
acceptCookiesBtn.addEventListener('click', () => {
  setCookie('cookieConsent', 'true', 365);
  cookieBanner.classList.remove('show');
});

/* =============================================================================
   INITIALIZATIONS ON DOM CONTENT LOADED
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCarousel();
  initForms();
  initTheme();
  initProjectFiltering();
  initScrollAnimations();
  initLazyLoad();
  checkCookieConsent();
});
