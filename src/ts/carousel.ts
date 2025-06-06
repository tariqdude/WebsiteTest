export function initCarousel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;
  let index = 0;
  const slides = carousel.querySelectorAll<HTMLElement>('.slide');
  const next = carousel.querySelector<HTMLButtonElement>('.next');
  const prev = carousel.querySelector<HTMLButtonElement>('.prev');
  function show(i: number) {
    slides.forEach((s, idx) => {
      s.style.display = idx === i ? 'block' : 'none';
    });
  }
  next?.addEventListener('click', () => {
    index = (index + 1) % slides.length;
    show(index);
  });
  prev?.addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    show(index);
  });
  show(index);
}
