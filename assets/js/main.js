(() => {
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.body.setAttribute('data-theme', saved);
  }
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
      localStorage.setItem('theme', theme);
    });
  }

  const form = document.querySelector('#contact form');
  if (form) {
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    const validators = {
      email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: value => value.trim().length > 0
    };

    const showError = (input, el, msg) => {
      if (el) el.textContent = msg;
      input.setAttribute('aria-invalid', 'true');
    };

    const clearError = (input, el) => {
      if (el) el.textContent = '';
      input.removeAttribute('aria-invalid');
    };

    form.addEventListener('submit', e => {
      let valid = true;
      if (!validators.email(emailInput.value)) {
        showError(emailInput, emailError, 'Please enter a valid email.');
        valid = false;
      }
      if (!validators.message(messageInput.value)) {
        showError(messageInput, messageError, 'Message is required.');
        valid = false;
      }
      if (!valid) e.preventDefault();
    });

    [emailInput, messageInput].forEach(input => {
      const errEl = input.id === 'email' ? emailError : messageError;
      input.addEventListener('input', () => {
        const isValid = validators[input.id](input.value);
        if (isValid) clearError(input, errEl);
      });
    });
  }

  const featureContainer = document.getElementById('feature-anim');
  if (featureContainer && window.lottie) {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const anim = lottie.loadAnimation({
      container: featureContainer,
      renderer: 'svg',
      loop: true,
      autoplay: !motionQuery.matches,
      path: '/assets/js/HamburgerArrow.json'
    });
    if (motionQuery.matches) {
      anim.goToAndStop(0, true);
    }
    motionQuery.addEventListener('change', e => {
      if (e.matches) {
        anim.pause();
      } else {
        anim.play();
      }
    });
  }
})();
