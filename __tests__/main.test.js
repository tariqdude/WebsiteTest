/** @jest-environment jsdom */
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

document.documentElement.innerHTML = html;

// mock IntersectionObserver
global.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Import the script after setting up DOM
require('../main.js');

describe('interactive elements', () => {
  beforeEach(() => {
    document.body.innerHTML = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    // Re-import script to attach event listeners and web components
    jest.resetModules();
    require('../main.js');
  });

  test('pricing toggle switches price', () => {
    const pricing = document.querySelector('pricing-toggle');
    const checkbox = pricing.querySelector('#toggle');
    const price = pricing.querySelector('#price');

    expect(price.textContent).toBe('$10/mo');
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    expect(price.textContent).toBe('$100/yr');
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));
    expect(price.textContent).toBe('$10/mo');
  });

  test('theme toggle switches dark class', () => {
    const root = document.documentElement;
    const toggle = document.getElementById('theme-toggle');
    expect(root.classList.contains('dark')).toBe(false);
    toggle.click();
    expect(root.classList.contains('dark')).toBe(true);
  });

  test('menu toggle shows nav links', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    expect(navLinks.classList.contains('open')).toBe(false);
    menuToggle.click();
    expect(navLinks.classList.contains('open')).toBe(true);
  });
});
