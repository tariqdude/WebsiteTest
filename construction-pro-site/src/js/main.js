// Lottie Loader
if (window.lottie) {
  lottie.loadAnimation({
    container: document.getElementById('hero-lottie'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: './assets/lottie/loader.json'
  });
}

// GSAP Animations
window.addEventListener('load', () => {
  if (window.gsap) {
    gsap.from('.hero-content h1', { duration: 1, y: 30, opacity: 0, ease: 'power3.out' });
    gsap.from('.hero-content p', { duration: 1, y: 30, opacity: 0, delay: 0.3, ease: 'power3.out' });
    gsap.from('.cta-btn', { duration: 1, y: 30, opacity: 0, delay: 0.6, ease: 'power3.out' });
  }
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
