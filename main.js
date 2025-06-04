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
