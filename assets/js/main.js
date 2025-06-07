// Initialize AOS animations
AOS.init();

// Scroll progress indicator
window.addEventListener('scroll', () => {
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / docHeight) * 100;
  document.getElementById('progressBar').style.width = scrolled + '%';
});

// SimpleLightbox gallery
document.addEventListener('DOMContentLoaded', () => {
  if (window.SimpleLightbox) {
    new SimpleLightbox('.gallery');
  }
});

// Service Worker registration for Workbox
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
