// js/contactForm.js
/**
 * @module contactForm
 * Purpose: Validate form fields, handle honeypot, and simulate submission.
 */
import { qs, qsa } from './utils.js';

export function handleForm() {
  const form = qs('#contact-form');
  const submitBtn = qs('#submit-btn');
  const msgBox = qs('#form-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Clear previous errors and message
    qsa('.error', form).forEach(el => (el.textContent = ''));
    msgBox.textContent = '';
    msgBox.classList.remove('success', 'error');
    let hasError = false;
    // Validate required fields
    qsa('[required]', form).forEach(input => {
      if (!input.checkValidity() || (input.name === 'address' && input.value !== '')) {
        const errorEl = qs(`#${input.id}-error`);
        if (input.validity.valueMissing) {
          errorEl.textContent = 'This field is required.';
        } else if (input.validity.typeMismatch) {
          errorEl.textContent = 'Please enter a valid value.';
        } else if (input.validity.patternMismatch) {
          errorEl.textContent = 'Invalid format.';
        }
        hasError = true;
      }
    });
    if (hasError) return;
    // Disable submit, show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    try {
      // Simulated API delay
      await new Promise(r => setTimeout(r, 1500));
      form.reset();
      msgBox.textContent = 'Thank you! Your request has been submitted.';
      msgBox.classList.add('success');
    } catch {
      msgBox.textContent = 'Something went wrong. Please try again.';
      msgBox.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
    }
  });
}
