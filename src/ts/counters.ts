export function initCounters() {
  const counters = document.querySelectorAll<HTMLSpanElement>('[data-count]');
  counters.forEach((counter) => {
    const target = Number(counter.dataset.count);
    let current = 0;
    const step = Math.ceil(target / 100);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        counter.textContent = target.toString();
        clearInterval(interval);
      } else {
        counter.textContent = current.toString();
      }
    }, 20);
  });
}
