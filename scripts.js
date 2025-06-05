// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  const newExpanded = !expanded;
  navToggle.setAttribute('aria-expanded', newExpanded);
  navMenu.classList.toggle('show');
  navMenu.setAttribute('aria-hidden', !newExpanded);
});

// Close mobile nav when a link is clicked
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('show');
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
  });
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

document.querySelectorAll('.card, .about, .testimonial-grid figure, .contact form, .team-grid figure, .newsletter form').forEach(el => {
  observer.observe(el);
});

if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js');}

// Scroll to top button
const scrollBtn = document.querySelector('.scroll-top');
if(scrollBtn){
  window.addEventListener('scroll', () => {
    if(window.pageYOffset > 300){
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  });
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  });
}

// Newsletter signup
const newsletterForm = document.getElementById('newsletter-form');
if(newsletterForm){
  const msg = document.getElementById('newsletter-message');
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    newsletterForm.reset();
    msg.hidden = false;
  });
}

