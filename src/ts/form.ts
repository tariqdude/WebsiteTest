export function initForm() {
  const form = document.querySelector<HTMLFormElement>('form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const submit = form.querySelector<HTMLButtonElement>('[type=submit]');
    submit!.disabled = true;
    try {
      await fetch('/api/sendMail', {
        method: 'POST',
        body: data,
      });
      form.reset();
      alert('Success');
    } catch (err) {
      alert('Error');
    } finally {
      submit!.disabled = false;
    }
  });
}
