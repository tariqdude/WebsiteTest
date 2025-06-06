import { initMenu } from './menu';
import { initCarousel } from './carousel';
import { initCounters } from './counters';
import { initForm } from './form';

document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initCarousel();
  initCounters();
  initForm();
});
