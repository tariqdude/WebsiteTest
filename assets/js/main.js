(() => {
  const loadLang = lang => {
    fetch(`/assets/lang/${lang}.json`)
      .then(r => r.json())
      .then(strings => {
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
          const key = el.getAttribute('data-i18n');
          if (strings[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
              el.placeholder = strings[key];
            } else {
              el.textContent = strings[key];
            }
          }
        });
      });
  };

  const userLang = localStorage.getItem('lang') || navigator.language.slice(0,2);
  loadLang(userLang);
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
        el.textContent = toggle.checked ? '$' + base * 10 : '$' + base;
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
      const theme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', theme);
    });
  }
})();
