export const qs = (selector, ctx = document) => ctx.querySelector(selector);
export const qsa = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));
export const throttle = (fn, limit = 100) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
};
export const rafThrottle = (fn) => {
  let ticking = false;
  return (...args) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        fn(...args);
        ticking = false;
      });
      ticking = true;
    }
  };
};
