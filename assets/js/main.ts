(() => {
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
    const inputToggle = toggle as HTMLInputElement;
    inputToggle.addEventListener('change', () => {
      document.querySelectorAll('[data-price]').forEach(el => {
        const base = parseInt(el.getAttribute('data-price') || '0', 10);
        el.textContent = inputToggle.checked ? '$' + base * 10 : '$' + base;
      });
    });
  }

  document.querySelectorAll('[aria-controls]').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', (!expanded).toString());
      const panel = document.getElementById(btn.getAttribute('aria-controls') || '');
      if (panel) {
        panel.style.maxHeight = expanded ? '0' : panel.scrollHeight + 'px';
      }
    });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear().toString();

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const theme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', theme);
    });
  }
})();
