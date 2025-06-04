// footer year
document.getElementById('year').textContent = new Date().getFullYear();

// mobile nav toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// theme toggle with localStorage
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
if (localStorage.theme === 'dark') {
  root.classList.add('dark');
}
themeToggle.addEventListener('click', () => {
  root.classList.toggle('dark');
  localStorage.theme = root.classList.contains('dark') ? 'dark' : 'light';
});

// back to top button
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 300);
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

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

// contact form validation
const contactForm = document.querySelector("#contact form");
if (contactForm) {
  contactForm.addEventListener("submit", e => {
    const emailInput = contactForm.querySelector("input[type=email]");
    const messageInput = contactForm.querySelector("textarea[name=message]");
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) {
      e.preventDefault();
      alert("Please enter a valid email.");
      emailInput.focus();
      return;
    }
    if (message.length < 10) {
      e.preventDefault();
      alert("Message must be at least 10 characters.");
      messageInput.focus();
    }
  });
}

