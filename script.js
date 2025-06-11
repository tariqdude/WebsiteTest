// Header scroll effect
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// Smooth scroll for nav links
document.querySelectorAll('nav a, .cta-btn, .scroll-down').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Projects slider logic
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const leftBtn = document.querySelector('.slider-btn.left');
const rightBtn = document.querySelector('.slider-btn.right');

function showSlide(idx) {
  slides.forEach((s, i) => {
    s.classList.toggle('active', i === idx);
  });
}
function nextSlide() {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
}
function prevSlide() {
  slideIndex = (slideIndex - 1 + slides.length) % slides.length;
  showSlide(slideIndex);
}
if (leftBtn && rightBtn && slides.length) {
  leftBtn.addEventListener('click', prevSlide);
  rightBtn.addEventListener('click', nextSlide);
  // Auto-slide every 6 seconds
  let sliderInterval = setInterval(nextSlide, 6000);
  document.querySelector('.project-slider').addEventListener('mouseover', () => clearInterval(sliderInterval));
  document.querySelector('.project-slider').addEventListener('mouseout', () => sliderInterval = setInterval(nextSlide, 6000));
}

// Scroll-to-top button
const scrollBtn = document.getElementById('scrollToTop');
if (scrollBtn) {
  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Intersection Observer for reveal animations (optional, example for .feature)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.15 });
document.querySelectorAll('.feature, .service-card, .team-card').forEach(el => observer.observe(el));
