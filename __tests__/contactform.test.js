import { jest } from '@jest/globals';
import { handleForm } from '../contactform.js';

describe('contact form validation', () => {
  let form;
  let nameInput;
  let emailInput;
  let phoneInput;
  let detailsInput;
  let submitBtn;
  let msgBox;

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="contact-form" novalidate>
        <input type="text" id="name" name="name" required />
        <span class="error" id="name-error"></span>
        <input type="email" id="email" name="email" required />
        <span class="error" id="email-error"></span>
        <input type="tel" id="phone" name="phone" required pattern="^\\+?\\d{10,15}$" />
        <span class="error" id="phone-error"></span>
        <textarea id="details" name="details" required></textarea>
        <span class="error" id="details-error"></span>
        <input type="text" id="address" name="address" />
        <span class="error" id="address-error"></span>
        <button id="submit-btn" type="submit">Submit</button>
        <div id="form-message"></div>
      </form>`;

    form = document.getElementById('contact-form');
    nameInput = document.getElementById('name');
    emailInput = document.getElementById('email');
    phoneInput = document.getElementById('phone');
    detailsInput = document.getElementById('details');
    submitBtn = document.getElementById('submit-btn');
    msgBox = document.getElementById('form-message');

    handleForm();
  });

  test('shows error when required field missing', () => {
    form.dispatchEvent(new Event('submit'));
    expect(document.getElementById('name-error').textContent).toBe(
      'This field is required.',
    );
    expect(msgBox.textContent).toBe('');
  });

  test('submits successfully with valid fields', async () => {
    jest.useFakeTimers();
    nameInput.value = 'John';
    emailInput.value = 'john@example.com';
    phoneInput.value = '+12345678901';
    detailsInput.value = 'Hello world';

    form.dispatchEvent(new Event('submit'));

    // run the simulated async delay
    await jest.runAllTimers();

    expect(msgBox.textContent).toBe(
      'Thank you! Your request has been submitted.',
    );
    expect(msgBox.classList.contains('success')).toBe(true);
    jest.useRealTimers();
  });
});
