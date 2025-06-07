function calculatePrice(base, yearly) {
  return '$' + (yearly ? base * 10 : base);
}

function getToggledTheme(currentTheme) {
  return currentTheme === 'dark' ? 'light' : 'dark';
}

function init() {
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (prefersReduce) observer.unobserve(entry.target);
      }
    });
  });
  document.querySelectorAll('.fade-target').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  const toggle = document.getElementById('billing-toggle');
  if (toggle) {
    toggle.addEventListener('change', () => {
      document.querySelectorAll('[data-price]').forEach(el => {
        const base = parseInt(el.getAttribute('data-price'), 10);
        el.textContent = calculatePrice(base, toggle.checked);
      });
    });
  }

  document.querySelectorAll('[aria-controls]').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (panel) {
        panel.style.maxHeight = expanded ? '0' : panel.scrollHeight + 'px';
      }
    });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const theme = getToggledTheme(document.body.getAttribute('data-theme'));
      document.body.setAttribute('data-theme', theme);
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculatePrice, getToggledTheme };
} else {
  init();
}
