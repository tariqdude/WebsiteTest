// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', !expanded);
  navMenu.classList.toggle('show');
});

// Dark mode toggle
const modeToggle = document.querySelector('.mode-toggle');

// Apply saved preference on load
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark-mode');
}

modeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Intersection animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {threshold: 0.1});

document.querySelectorAll('.card, .about, .testimonial-grid figure, .contact form').forEach(el => {
  observer.observe(el);
});

if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js');}

