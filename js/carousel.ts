// Testimonial carousel logic

function initCarousel(): void {
  const track = document.querySelector<HTMLElement>('.carousel__track')!;
  if (!track) return;
  const slides: HTMLElement[] = Array.from(track.children) as HTMLElement[];
  const prevButton = document.querySelector<HTMLButtonElement>('.carousel__prev')!;
  const nextButton = document.querySelector<HTMLButtonElement>('.carousel__next')!;
  const indicatorsContainer = document.querySelector<HTMLElement>('.carousel__indicators')!;
  const indicators: HTMLElement[] = Array.from(indicatorsContainer.children) as HTMLElement[];
  let currentIndex = 0;
  let autoRotate: number;

  function updateSlide(index: number): void {
    slides.forEach((slide: HTMLElement, i: number) => {
      slide.classList.toggle('carousel__slide--active', i === index);
      slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
    indicators.forEach((dot: HTMLElement, i: number) => {
      dot.classList.toggle('carousel__indicator--active', i === index);
    });
  }

  function goToNext() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlide(currentIndex);
  }
  function goToPrev() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlide(currentIndex);
  }

  nextButton.addEventListener('click', () => {
    goToNext();
    resetAutoRotate();
  });
  prevButton.addEventListener('click', () => {
    goToPrev();
    resetAutoRotate();
  });
  indicators.forEach((dot: HTMLElement, idx: number) => {
    dot.addEventListener('click', () => {
      currentIndex = idx;
      updateSlide(currentIndex);
      resetAutoRotate();
    });
  });

  function startAutoRotate(): void {
    autoRotate = setInterval(goToNext, 5000);
  }
  function resetAutoRotate(): void {
    clearInterval(autoRotate);
    startAutoRotate();
  }

  const carouselRegion = document.querySelector<HTMLElement>('.testimonials__carousel')!;
  carouselRegion.addEventListener('mouseenter', () => clearInterval(autoRotate));
  carouselRegion.addEventListener('mouseleave', () => startAutoRotate());
  carouselRegion.addEventListener('focusin', () => clearInterval(autoRotate));
  carouselRegion.addEventListener('focusout', () => startAutoRotate());

  carouselRegion.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      goToNext();
      resetAutoRotate();
    } else if (e.key === 'ArrowLeft') {
      goToPrev();
      resetAutoRotate();
    }
  });

  updateSlide(currentIndex);
  startAutoRotate();
}

document.addEventListener('DOMContentLoaded', initCarousel);
