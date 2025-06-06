// Navigation related interactions

// Utility: Debounce
function debounce(func: (...args: any[]) => void, wait = 20, immediate = true): (...args: any[]) => void {
  let timeout: number | undefined;
  return function (this: unknown, ...args: any[]) {
    const context = this;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Header shrink on scroll
const header = document.getElementById('site-header') as HTMLElement;
function handleHeaderShrink(): void {
  if (window.scrollY > 100) {
    header.classList.add('header--small');
  } else {
    header.classList.remove('header--small');
  }
}
window.addEventListener('scroll', debounce(handleHeaderShrink, 20));

// Mobile navigation toggle
const menuToggle = document.getElementById('menu-toggle') as HTMLButtonElement;
const mobileNav = document.getElementById('mobile-nav') as HTMLElement;
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  mobileNav.setAttribute('aria-hidden', String(expanded));
  mobileNav.classList.toggle('nav--open');
  if (!expanded) {
    const items = mobileNav.querySelectorAll<HTMLElement>('.nav__item');
    items.forEach((item: HTMLElement, i: number) => {
      item.style.animationDelay = `${i * 0.1 + 0.2}s`;
    });
  }
});

// Close mobile nav when a link is clicked
mobileNav.querySelectorAll<HTMLAnchorElement>('.nav__link').forEach((link: HTMLAnchorElement) => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileNav.classList.remove('nav--open');
  });
});

// Smooth scroll & active nav link highlight
const sections = document.querySelectorAll<HTMLElement>('section[id]');
const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav__link');
function highlightNav(): void {
  let scrollPos = window.scrollY + (window.innerHeight / 3);
  sections.forEach((section: HTMLElement) => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      const id = section.getAttribute('id');
      navLinks.forEach((link: HTMLAnchorElement) => {
        link.classList.toggle('nav__link--active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}
window.addEventListener('scroll', debounce(highlightNav, 20));

// Back-to-top button & scroll progress
const backToTopBtn = document.getElementById('backToTop') as HTMLButtonElement;
const scrollProgress = document.getElementById('scrollProgress') as HTMLElement;
function handleScrollUI(): void {
  if (window.scrollY > 800) {
    backToTopBtn.classList.add('back-to-top--visible');
  } else {
    backToTopBtn.classList.remove('back-to-top--visible');
  }
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / docHeight) * 100;
  scrollProgress.style.width = `${scrolled}%`;
}
window.addEventListener('scroll', debounce(handleScrollUI, 20));
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
