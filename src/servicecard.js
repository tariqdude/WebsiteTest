// js/serviceCard.js
/**
 * @module serviceCard
 * Purpose: Define <service-card> web component with flip and ARIA support.
 */
class ServiceCard extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById('service-card-template').content;
    this.attachShadow({ mode: 'open' }).append(template.cloneNode(true));
    this.innerTitle = this.getAttribute('service');
    this.iconId = this.getAttribute('icon-id');
  }
  connectedCallback() {
    const front = this.shadowRoot.querySelector('.service-title');
    front.textContent = this.innerTitle;
    const svgUse = this.shadowRoot.querySelector('use');
    svgUse.setAttribute('href', `#icon-${this.iconId}`);
    this.shadowRoot.querySelector('.service-card')
      .setAttribute('aria-labelledby', `title-${this.iconId}`);
    this.shadowRoot.querySelector('.service-title').id = `title-${this.iconId}`;
    // Toggle flip on focus/hover
    const inner = this.shadowRoot.querySelector('.card-inner');
    this.shadowRoot.querySelector('.service-card').addEventListener('focusin', () => {
      inner.style.transform = 'rotateY(180deg)';
      this.setAttribute('aria-expanded', 'true');
    });
    this.shadowRoot.querySelector('.service-card').addEventListener('focusout', () => {
      inner.style.transform = '';
      this.setAttribute('aria-expanded', 'false');
    });
    this.shadowRoot.querySelector('.service-card').addEventListener('mouseenter', () => {
      inner.style.transform = 'rotateY(180deg)';
      this.setAttribute('aria-expanded', 'true');
    });
    this.shadowRoot.querySelector('.service-card').addEventListener('mouseleave', () => {
      inner.style.transform = '';
      this.setAttribute('aria-expanded', 'false');
    });
  }
}
customElements.define('service-card', ServiceCard);
