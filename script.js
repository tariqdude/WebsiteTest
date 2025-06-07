// ---- Preloader ----
window.addEventListener('load', () => {
  document.getElementById('preloader').style.display = 'none';
});

// ---- Scroll Progress Bar ----
window.addEventListener('scroll', () => {
  const doc = document.documentElement;
  const scrollPercent = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
  document.getElementById('progress-bar').style.width = scrollPercent + '%';
});

// ---- Dark Mode Toggle ----
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
let theme = localStorage.getItem('theme') || 'light';
root.setAttribute('data-theme', theme);
themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
themeToggle.addEventListener('click', () => {
  theme = theme === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
});

// ---- Mobile Nav Toggle ----
document.getElementById('menu-toggle').addEventListener('click', () => {
  document.getElementById('nav').classList.toggle('show');
});

// ---- Smooth Scroll & ScrollSpy ----
const navLinks = document.querySelectorAll('.nav a');
const sections = Array.from(navLinks).map(l => document.querySelector(l.getAttribute('href')));
window.addEventListener('scroll', () => {
  sections.forEach((sec, i) => {
    if (window.scrollY >= sec.offsetTop - 80) {
      navLinks.forEach(a => a.classList.remove('active'));
      navLinks[i].classList.add('active');
    }
  });
});

// ---- Typewriter Effect ----
const words = ['Crafting Excellence,', 'Building the Future,', 'Restoring the Past.'];
let idx = 0, char = 0, current = '', isDeleting = false;
const typeEl = document.getElementById('typewriter');
function type() {
  if (char <= words[idx].length && !isDeleting) {
    current = words[idx].substring(0, char++);
  } else if (char > 0 && isDeleting) {
    current = words[idx].substring(0, char--);
  }
  typeEl.textContent = current;
  if (char === words[idx].length) isDeleting = true;
  if (isDeleting && char === 0) { isDeleting = false; idx = (idx + 1) % words.length; }
  setTimeout(type, isDeleting ? 75 : 150);
}
type();

// ---- Parallax Hero ----
window.addEventListener('scroll', () => {
  const y = window.scrollY / 2;
  document.getElementById('hero').style.backgroundPosition = `center ${y}px`;
});

// ---- AOS-style Animations ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('aos-animate');
  });
}, { threshold: 0.2 });
document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

// ---- Testimonials Slider ----
const testimonials = document.querySelectorAll('.testimonial');
let tIdx = 0;
setInterval(() => {
  testimonials[tIdx].classList.remove('active');
  tIdx = (tIdx + 1) % testimonials.length;
  testimonials[tIdx].classList.add('active');
}, 5000);

// ---- Contact Form ----
document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  alert('Thank you! We\'ll be in touch.');
  e.target.reset();
});

// ---- Newsletter Form ----
document.getElementById('newsletter-form').addEventListener('submit', e => {
  e.preventDefault();
  alert('Subscribed!');
  e.target.reset();
});

// ---- Cookie Consent ----
const banner = document.getElementById('cookie-banner');
if (!localStorage.getItem('cookiesAccepted')) {
  banner.classList.add('show');
}
document.getElementById('accept-cookies').addEventListener('click', () => {
  localStorage.setItem('cookiesAccepted', 'yes');
  banner.classList.remove('show');
});
