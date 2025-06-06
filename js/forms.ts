// Contact form validation and submission

function showError(input: HTMLInputElement | HTMLTextAreaElement, message: string): void {
  const errorEl = document.getElementById(`${input.id}Error`) as HTMLElement;
  errorEl.textContent = message;
  input.setAttribute('aria-invalid', 'true');
}

function clearError(input: HTMLInputElement | HTMLTextAreaElement): void {
  const errorEl = document.getElementById(`${input.id}Error`) as HTMLElement;
  errorEl.textContent = '';
  input.removeAttribute('aria-invalid');
}

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

async function handleSubmit(e: Event): Promise<void> {
  e.preventDefault();
  const contactForm = e.target as HTMLFormElement;
  const formMessage = document.getElementById('formMessage') as HTMLElement;
  let valid = true;

  const name = contactForm.querySelector<HTMLInputElement>('#name')!;
  const email = contactForm.querySelector<HTMLInputElement>('#email')!;
  const phone = contactForm.querySelector<HTMLInputElement>('#phone')!;
  const details = contactForm.querySelector<HTMLTextAreaElement>('#details')!;

  [name, email, phone, details].forEach(clearError);
  formMessage.textContent = '';
  formMessage.className = 'form__message';

  if (!name.value.trim()) {
    showError(name, 'Please enter your name.');
    valid = false;
  }

  if (!email.value.trim()) {
    showError(email, 'Please enter your email.');
    valid = false;
  } else if (!validateEmail(email.value.trim())) {
    showError(email, 'Please enter a valid email address.');
    valid = false;
  }

  if (phone.value.trim()) {
    const phoneRe = /^[0-9\-+()\s]{7,20}$/;
    if (!phoneRe.test(phone.value.trim())) {
      showError(phone, 'Please enter a valid phone number.');
      valid = false;
    }
  }

  if (!details.value.trim()) {
    showError(details, 'Please provide project details.');
    valid = false;
  }

  if (!valid) return;

  const formData = {
    name: name.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    details: details.value.trim()
  };

  try {
    const response = await fetch('https://formspree.io/f/mayvklpw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      formMessage.textContent = 'Thank you! Your message has been sent.';
      formMessage.classList.add('success');
      contactForm.reset();
      name.focus();
    } else {
      throw new Error('Network response was not OK');
    }
  } catch (err) {
    formMessage.textContent = 'Oops! Something went wrong. Please try again later.';
    formMessage.classList.add('error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleSubmit);
  }
});
