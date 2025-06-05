/**
 * Main script placeholder
 * Initializes carousel, form handling, map drawing, analytics (stubs)
 */
import { initCarousel } from "carousel/carousel.js";
import { handleForm } from "forms/contactForm.js";
import { drawMap } from "maps/mapCanvas.js";
import { initAnalytics } from "analytics/analytics.js";

document.addEventListener("DOMContentLoaded", () => {
  initCarousel();
  handleForm();
  drawMap();
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initAnalytics);
  } else {
    setTimeout(initAnalytics, 2000);
  }
});

// Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered', reg))
      .catch(err => console.warn('SW registration failed', err));
  });
}
