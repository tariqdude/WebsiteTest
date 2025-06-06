// Navigation related interactions

  }
  window.addEventListener('scroll', debounce(handleScrollUI, 20));
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

export default initNavigation;
