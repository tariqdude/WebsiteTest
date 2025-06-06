// Testimonial carousel logic

  const track = document.querySelector('.carousel__track');
  if (!track)
    return;
  const slides = Array.from(track.children);
  const prevButton = document.querySelector('.carousel__prev');
  const nextButton = document.querySelector('.carousel__next');
  const indicatorsContainer = document.querySelector('.carousel__indicators');
  const indicators = Array.from(indicatorsContainer.children);
  let currentIndex = 0;
  let autoRotate;
  function updateSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('carousel__slide--active', i === index);
      slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
    indicators.forEach((dot, i) => {
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
  indicators.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      currentIndex = idx;
      updateSlide(currentIndex);
      resetAutoRotate();
    });
  });
  function startAutoRotate() {
    autoRotate = setInterval(goToNext, 5000);
  }
  function resetAutoRotate() {
    clearInterval(autoRotate);
    startAutoRotate();
  }
  const carouselRegion = document.querySelector('.testimonials__carousel');
  carouselRegion.addEventListener('mouseenter', () => clearInterval(autoRotate));
  carouselRegion.addEventListener('mouseleave', () => startAutoRotate());
  carouselRegion.addEventListener('focusin', () => clearInterval(autoRotate));
  carouselRegion.addEventListener('focusout', () => startAutoRotate());
  carouselRegion.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      goToNext();
      resetAutoRotate();
    }
    else if (e.key === 'ArrowLeft') {
      goToPrev();
      resetAutoRotate();
    }
  });
  updateSlide(currentIndex);
  startAutoRotate();
}

