// js/contactForm.js
/**
 * @module contactForm
 * Purpose: Validate form fields, handle honeypot, and simulate submission.
 */
export function handleForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Clear previous errors
    form.querySelectorAll('.error').forEach(el => el.textContent = '');
    let hasError = false;
    // Validate required fields
    form.querySelectorAll('[required]').forEach(input => {
      if (!input.checkValidity() || (input.name === 'address' && input.value !== '')) {
        const errorEl = document.getElementById(`${input.id}-error`);
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
      alert('Thank you! Your request has been submitted.');
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
    }
  });
}
