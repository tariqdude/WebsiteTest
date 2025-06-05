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
