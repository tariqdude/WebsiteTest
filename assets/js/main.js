// Initialize AOS animations
AOS.init();

// Scroll progress indicator
window.addEventListener('scroll', () => {
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / docHeight) * 100;
  document.getElementById('progressBar').style.width = scrolled + '%';
});

// SimpleLightbox gallery
document.addEventListener('DOMContentLoaded', () => {
  if (window.SimpleLightbox) {
    new SimpleLightbox('.gallery');
  }

  if (window.Typed) {
    new Typed('#hero-headline', {
      strings: ['Crafting the Future of Construction', 'Building Dreams Into Reality'],
      typeSpeed: 50,
      backSpeed: 25,
      loop: true
    });
  }

  const header = document.querySelector('header');
  if (header) {
    header.classList.add('py-4');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('py-2', 'bg-white/90', 'backdrop-blur');
        header.classList.remove('py-4');
      } else {
        header.classList.remove('py-2', 'bg-white/90', 'backdrop-blur');
        header.classList.add('py-4');
      }
    });
  }

  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        const target = parseInt(entry.target.dataset.target, 10);
        let count = 0;
        const step = Math.max(1, Math.floor(target / 100));
        function update() {
          count += step;
          if (count < target) {
            entry.target.textContent = count;
            requestAnimationFrame(update);
          } else {
            entry.target.textContent = target;
          }
        }
        update();
        entry.target.classList.add('counted');
      }
    });
  }, { threshold: 1 });
  counters.forEach(el => observer.observe(el));
});

// Service Worker registration for Workbox
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
