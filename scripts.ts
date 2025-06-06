/* =============================================================================
   SCRIPTS.JS
   ========================================================================== */



/* =============================================================================
   PROJECT FILTERING
   ========================================================================== */
const filterButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.filter-btn');
const projectCards: NodeListOf<HTMLElement> = document.querySelectorAll('.project-card');

filterButtons.forEach((btn: HTMLButtonElement) => {
  btn.addEventListener('click', () => {
    // Toggle active class
    filterButtons.forEach((b: HTMLButtonElement) => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');
    const filter = btn.getAttribute('data-filter');
    projectCards.forEach((card: HTMLElement) => {
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
function initScrollAnimations(): void {
  const elements: NodeListOf<HTMLElement> = document.querySelectorAll('.animate-on-scroll');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
  };
  const observer = new IntersectionObserver((entries: IntersectionObserverEntry[], obs: IntersectionObserver) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach((el: HTMLElement) => observer.observe(el));
}

/* =============================================================================
   LAZY-LOADING IMAGES & BGs (IntersectionObserver)
   ========================================================================== */
function initLazyLoad(): void {
  const lazyImages: NodeListOf<HTMLImageElement> = document.querySelectorAll('img[loading="lazy"]');
  const lazyBackgrounds: NodeListOf<HTMLElement> = document.querySelectorAll('[data-bg]');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px 200px 0px',
    threshold: 0.1
  };
  const observer = new IntersectionObserver((entries: IntersectionObserverEntry[], obs: IntersectionObserver) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        if (el.tagName === 'IMG' && el.dataset.src) {
          const img = el as HTMLImageElement;
          img.src = img.dataset.src!;
          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
          img.removeAttribute('loading');
        } else if (el.dataset.bg) {
          el.style.backgroundImage = `url('${el.dataset.bg}')`;
          el.removeAttribute('data-bg');
        }
        obs.unobserve(el);
      }
    });
  }, observerOptions);

  lazyImages.forEach((img: HTMLImageElement) => observer.observe(img));
  lazyBackgrounds.forEach((bg: HTMLElement) => observer.observe(bg));
}

/* =============================================================================
   COOKIE CONSENT BANNER
   ========================================================================== */
const cookieBanner: HTMLElement = document.getElementById('cookieConsent') as HTMLElement;
const acceptCookiesBtn: HTMLButtonElement = document.getElementById('acceptCookies') as HTMLButtonElement;
const closeCookiesBtn: HTMLButtonElement | null = document.getElementById('closeCookies') as HTMLButtonElement | null;

function setCookie(name: string, value: string, days: number): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getCookie(name: string): string {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
}

function checkCookieConsent(): void {
  if (getCookie('cookieConsent') !== 'true') {
    cookieBanner.classList.add('show');
  }
}

acceptCookiesBtn.addEventListener('click', () => {
  setCookie('cookieConsent', 'true', 365);
  cookieBanner.classList.remove('show');
});

if (closeCookiesBtn) {
  closeCookiesBtn.addEventListener('click', () => {
    cookieBanner.classList.remove('show');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  checkCookieConsent();
});

/* =============================================================================
   INITIALIZATIONS ON DOM CONTENT LOADED
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initLazyLoad();
  const themeToggleBtn = document.getElementById('theme-toggle') as HTMLButtonElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggleBtn.setAttribute('aria-checked', savedTheme === 'dark' ? 'true' : 'false');
  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeToggleBtn.setAttribute('aria-checked', next === 'dark' ? 'true' : 'false');
  });
});
