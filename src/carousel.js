// js/carousel.js
/**
 * @module carousel
 * Purpose: Initialize Ken Burns testimonials carousel with keyboard & swipe support.
 */
export function initCarousel() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const announcer = document.getElementById('testimonial-announcer');
  let currentIndex = 0;
  let timer;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    const name = slides[index].querySelector('figcaption cite').textContent;
    announcer.textContent = `Testimonial by ${name}`;
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }

  function startCarousel() {
    timer = setInterval(nextSlide, +slides[currentIndex].dataset.delay);
  }

  function pauseCarousel() {
    clearInterval(timer);
  }

  slides.forEach(slide => {
    slide.addEventListener('mouseenter', pauseCarousel);
    slide.addEventListener('mouseleave', startCarousel);
    slide.addEventListener('focusin', pauseCarousel);
    slide.addEventListener('focusout', startCarousel);
  });

  document.getElementById('next-testimonial').addEventListener('click', () => {
    pauseCarousel();
    nextSlide();
    startCarousel();
  });
  document.getElementById('prev-testimonial').addEventListener('click', () => {
    pauseCarousel();
    prevSlide();
    startCarousel();
  });

  document.addEventListener('keydown', (e) => {
    if (document.activeElement.closest('#testimonials')) {
      if (e.key === 'ArrowRight') { nextSlide(); pauseCarousel(); startCarousel(); }
      if (e.key === 'ArrowLeft')  { prevSlide(); pauseCarousel(); startCarousel(); }
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    showSlide(0);
    startCarousel();
  });
}
