// footer year
document.getElementById('year').textContent = new Date().getFullYear();

// pricing-toggle web component
class PricingToggle extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <label>
        <input type="checkbox" id="toggle">
        <span>Annual Billing</span>
      </label>
      <div id="price">$10/mo</div>`;
    this.querySelector('#toggle').addEventListener('change', e => {
      this.querySelector('#price').textContent = e.target.checked ? '$100/yr' : '$10/mo';
    });
  }
}
customElements.define('pricing-toggle', PricingToggle);

// reveal on intersect
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('.card').forEach(el => observer.observe(el));

// simple 3D tilt effect on cards
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `rotateX(${(-y / 20)}deg) rotateY(${(x / 20)}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0) rotateY(0)';
  });
});

// Lottie hero animation
if (window.lottie) {
  lottie.loadAnimation({
    container: document.getElementById('hero-animation'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'https://assets6.lottiefiles.com/packages/lf20_touohxv0.json'
  });
}

// Utterances comments
const comments = document.getElementById('comments');
const script = document.createElement('script');
script.src = 'https://utteranc.es/client.js';
script.setAttribute('repo', 'example/repo');
script.setAttribute('issue-term', 'pathname');
script.setAttribute('theme', 'github-light');
script.crossOrigin = 'anonymous';
script.async = true;
comments.appendChild(script);
