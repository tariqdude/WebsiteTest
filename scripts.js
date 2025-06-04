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

// Contact form submission via Fetch
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('.contact form');
  if (!contactForm) return;
  const statusEl = contactForm.querySelector('.form-status');
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if(statusEl){
      statusEl.textContent = 'Sending...';
      statusEl.classList.remove('error', 'success');
    }
    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        if(statusEl){
          statusEl.textContent = 'Thanks for your message!';
          statusEl.classList.add('success');
        }
        contactForm.reset();
      } else {
        const data = await response.json();
        const msg = data.errors ? data.errors.map(err => err.message).join(', ') : 'Submission failed';
        throw new Error(msg);
      }
    } catch(err) {
      if(statusEl){
        statusEl.textContent = 'Error: ' + err.message;
        statusEl.classList.add('error');
      }
    }
  });
});

