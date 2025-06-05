// js/analytics.js
/**
 * @module analytics
 * Purpose: Initialize analytics beacon via navigator.sendBeacon after idle.
 */
export function initAnalytics() {
  if (navigator.sendBeacon) {
    const data = JSON.stringify({ page: "/", ts: Date.now() });
    navigator.sendBeacon("/analytics", data);
  }
}
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            heroTitle.classList.add("visible");
            rotatingPhrase.classList.add("visible");
            heroCtaPrimary.classList.add("visible");
            rotatingObserver.unobserve(rotatingPhrase);
        }
        });
    }, { threshold: 0.1 });