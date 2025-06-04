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
modeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark-mode');
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

