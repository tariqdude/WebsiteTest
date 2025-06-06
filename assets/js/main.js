// Mobile navigation toggle
const toggle = document.getElementById('mobile-nav-toggle');
const menu = document.getElementById('mobile-nav-menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !expanded);
    menu.classList.toggle('hidden');
  });
}

// Smooth scroll for anchors
// TODO: implement smooth scroll if needed

// PLACEHOLDER FOR OTHER JS LOGIC
