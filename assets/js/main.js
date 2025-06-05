// Main site JS using ES2025 module features
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const fab = document.getElementById('callFab');
if (fab) {
  fab.addEventListener('click', () => {
    if (navigator.vibrate) navigator.vibrate(30);
    location.href = 'tel:+13125550110';
  });
  fab.addEventListener('contextmenu', e => {
    e.preventDefault();
    navigator.clipboard?.writeText('+13125550110');
  });
}

const quoteBtn = document.getElementById('quoteBtn');
if (quoteBtn) {
  quoteBtn.addEventListener('click', () => {
    if (navigator.vibrate) navigator.vibrate(20);
    location.href = '/services.html#quote';
  });
}

// handle PWA install prompt
let deferredPrompt;
const installBanner = document.getElementById('installBanner');
const installBtn = document.getElementById('installBtn');
self.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  document.documentElement.style.setProperty('--has-install', 'true');
  installBanner?.removeAttribute('hidden');
});
installBtn?.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  installBanner.hidden = true;
  deferredPrompt.prompt();
  deferredPrompt = null;
});

// Install service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}

// Dark mode toggle
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  const apply = t => document.documentElement.dataset.theme = t;
  apply(localStorage.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light'));
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.theme = next;
    apply(next);
  });
}

// font size toggle for accessibility
const fontToggle = document.getElementById('fontToggle');
if (fontToggle) {
  const applyFont = () => {
    const scale = parseFloat(localStorage.fontScale) || 1;
    document.documentElement.style.setProperty('--font-scale', scale);
    fontToggle.setAttribute('aria-pressed', scale > 1 ? 'true' : 'false');
  };
  applyFont();
  fontToggle.addEventListener('click', () => {
    const current = parseFloat(localStorage.fontScale) || 1;
    const next = current > 1 ? 1 : 1.25;
    localStorage.fontScale = next;
    applyFont();
  });
}

// mobile nav toggle
const navToggle = document.getElementById('navToggle');
const header = document.querySelector('header');
const nav = header?.querySelector('nav');
navToggle?.addEventListener('click', () => {
  const open = header.dataset.menu === 'open';
  header.dataset.menu = open ? 'closed' : 'open';
  navToggle.setAttribute('aria-expanded', String(!open));
  if (nav) {
    nav.inert = open;
    nav.setAttribute('aria-hidden', open ? 'true' : 'false');
  }
});

// orientation change debounce for mobile
let t;
const setVH = () => document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
setVH();
['resize','orientationchange'].forEach(ev => addEventListener(ev, () => { clearTimeout(t); t = setTimeout(setVH, 200); }));

// scroll progress bar
const progress = document.getElementById('progressBar');
if (progress && !CSS.supports('animation-timeline: scroll()')) {
  const update = () => {
    const scrolled = document.documentElement.scrollTop / (document.documentElement.scrollHeight - innerHeight);
    progress.style.width = (scrolled * 100) + '%';
    progress.hidden = scrolled <= 0;
  };
  update();
  addEventListener('scroll', update);
}

// back to top button
const topBtn = document.getElementById('topBtn');
if (topBtn) {
  const toggle = () => topBtn.style.display = pageYOffset > innerHeight ? 'flex' : 'none';
  toggle();
  addEventListener('scroll', toggle);
  topBtn.addEventListener('click', () => {
    if (navigator.vibrate) navigator.vibrate(20);
    scrollTo({top:0, behavior:'smooth'});
  });
}

// collect web vitals if analytics module present and user allows
if (!navigator.doNotTrack && !navigator.globalPrivacyControl) {
  try {
    const {track} = await import('analytics');
    track('/analytics');
  } catch (err) { console.error(err); }
}
