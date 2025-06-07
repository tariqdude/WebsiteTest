// Initialize AOS animations
AOS.init();

// Service Worker registration for Workbox
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
