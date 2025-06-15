// Header scroll effect
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// Loading Spinner
window.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('loadingOverlay');
  setTimeout(() => overlay.classList.add('hidden'), 700);
  setTimeout(() => overlay.style.display = 'none', 1200);
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
function setDarkMode(on) {
  document.body.classList.toggle('dark-mode', on);
  localStorage.setItem('darkMode', on ? '1' : '0');
  darkModeToggle.querySelector('.dark-icon').innerHTML = on ? '&#9790;' : '&#9788;';
}
const darkPref = localStorage.getItem('darkMode');
setDarkMode(darkPref === null ? prefersDark : darkPref === '1');
darkModeToggle.onclick = () => setDarkMode(!document.body.classList.contains('dark-mode'));

// Responsive Nav Hamburger
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.onclick = () => {
  navToggle.classList.toggle('active');
  mainNav.classList.toggle('open');
  const expanded = navToggle.classList.contains('active');
  navToggle.setAttribute('aria-expanded', expanded);
  if (expanded) mainNav.querySelector('a').focus();
};
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    mainNav.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', false);
  }
});

// Keyboard nav for hamburger
navToggle.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') navToggle.click();
});

// Smooth scroll for nav links and scroll-down
document.querySelectorAll('nav a, .cta-btn, .scroll-down, #scrollToTop').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
      if (mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', false);
      }
    }
  });
});

// Keyboard nav for scroll-to-top
const scrollBtn = document.getElementById('scrollToTop');
if (scrollBtn) {
  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  scrollBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') scrollBtn.click();
  });
}

// Projects slider logic
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const leftBtn = document.querySelector('.slider-btn.left');
const rightBtn = document.querySelector('.slider-btn.right');
function showSlide(idx) {
  slides.forEach((s, i) => s.classList.toggle('active', i === idx));
}
function nextSlide() {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
}
function prevSlide() {
  slideIndex = (slideIndex - 1 + slides.length) % slides.length;
  showSlide(slideIndex);
}
if (leftBtn && rightBtn && slides.length) {
  leftBtn.addEventListener('click', prevSlide);
  rightBtn.addEventListener('click', nextSlide);
  let sliderInterval = setInterval(nextSlide, 6000);
  document.querySelector('.project-slider').addEventListener('mouseover', () => clearInterval(sliderInterval));
  document.querySelector('.project-slider').addEventListener('mouseout', () => sliderInterval = setInterval(nextSlide, 6000));
}

// Intersection Observer for reveal animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.15 });
document.querySelectorAll('.feature, .service-card, .team-card').forEach(el => observer.observe(el));

// Partners/Clients Carousel (auto-scroll)
const partnersCarousel = document.querySelector('.partners-carousel');
if (partnersCarousel) {
  let scrollAmount = 0;
  setInterval(() => {
    if (partnersCarousel.scrollWidth > partnersCarousel.clientWidth) {
      scrollAmount += 160;
      if (scrollAmount > partnersCarousel.scrollWidth - partnersCarousel.clientWidth) scrollAmount = 0;
      partnersCarousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  }, 3500);
}

// Video Lightbox Modal
const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const closeVideoModal = document.getElementById('closeVideoModal');
document.querySelectorAll('.media-embed').forEach(iframe => {
  iframe.addEventListener('click', function(e) {
    // Only open modal if not already in modal
    if (!videoModal.classList.contains('active')) {
      e.preventDefault();
      modalVideo.src = this.src + (this.src.includes('?') ? '&' : '?') + 'autoplay=1';
      videoModal.classList.add('active');
      modalVideo.focus();
    }
  });
});
closeVideoModal.onclick = () => {
  videoModal.classList.remove('active');
  modalVideo.src = '';
};
videoModal.addEventListener('click', e => {
  if (e.target === videoModal) closeVideoModal.click();
});
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && videoModal.classList.contains('active')) closeVideoModal.click();
});

// Section Builder (unchanged, but move addSectionBtn to floating button)
const sectionsRoot = document.getElementById('sectionsRoot');
const addSectionBtn = document.getElementById('addSectionBtn');
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

let sections = [];

function renderSections() {
  sectionsRoot.innerHTML = '';
  sections.forEach((section, idx) => {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'section';

    // Controls
    const controls = document.createElement('div');
    controls.className = 'section-controls';
    controls.innerHTML = `
      <button title="Edit" onclick="editSection(${idx})">&#9998;</button>
      <button title="Delete" onclick="deleteSection(${idx})">&#128465;</button>
      <button title="Move Up" onclick="moveSection(${idx}, -1)" ${idx === 0 ? 'disabled' : ''}>&uarr;</button>
      <button title="Move Down" onclick="moveSection(${idx}, 1)" ${idx === sections.length-1 ? 'disabled' : ''}>&darr;</button>
    `;
    sectionDiv.appendChild(controls);

    // Title
    if (section.title) {
      const title = document.createElement('div');
      title.className = 'section-title';
      title.textContent = section.title;
      sectionDiv.appendChild(title);
    }

    // Content
    if (section.content) {
      const content = document.createElement('div');
      content.className = 'section-content';
      content.innerHTML = section.content.replace(/\n/g, '<br>');
      sectionDiv.appendChild(content);
    }

    // Media
    if (section.media && section.media.length) {
      const mediaDiv = document.createElement('div');
      mediaDiv.className = 'section-media';
      section.media.forEach(m => {
        if (m.type === 'image') {
          const img = document.createElement('img');
          img.src = m.url;
          img.alt = m.alt || '';
          mediaDiv.appendChild(img);
        } else if (m.type === 'video') {
          if (m.url.includes('youtube.com') || m.url.includes('youtu.be')) {
            const iframe = document.createElement('iframe');
            iframe.src = m.url.replace('watch?v=', 'embed/');
            iframe.frameBorder = 0;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.className = 'media-embed';
            mediaDiv.appendChild(iframe);
          } else {
            const video = document.createElement('video');
            video.src = m.url;
            video.controls = true;
            mediaDiv.appendChild(video);
          }
        }
      });
      sectionDiv.appendChild(mediaDiv);
    }

    // Links
    if (section.links && section.links.length) {
      const linksDiv = document.createElement('div');
      linksDiv.className = 'section-links';
      section.links.forEach(l => {
        const a = document.createElement('a');
        a.href = l.url;
        a.textContent = l.text || l.url;
        a.target = '_blank';
        linksDiv.appendChild(a);
      });
      sectionDiv.appendChild(linksDiv);
    }

    sectionsRoot.appendChild(sectionDiv);
  });
}

function addSection() {
  showSectionEditor();
}

function editSection(idx) {
  showSectionEditor(sections[idx], idx);
}

function deleteSection(idx) {
  if (confirm('Delete this section?')) {
    sections.splice(idx, 1);
    renderSections();
  }
}

function moveSection(idx, dir) {
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= sections.length) return;
  [sections[idx], sections[newIdx]] = [sections[newIdx], sections[idx]];
  renderSections();
}

function showSectionEditor(section = {}, idx = null) {
  // Modal-like overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(0,0,0,0.25)';
  overlay.style.zIndex = 1000;
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';

  // Editor form
  const editor = document.createElement('div');
  editor.style.background = '#fff';
  editor.style.padding = '2rem';
  editor.style.borderRadius = '8px';
  editor.style.minWidth = '320px';
  editor.style.maxWidth = '95vw';
  editor.style.boxShadow = '0 2px 16px rgba(0,0,0,0.15)';
  editor.innerHTML = `
    <div class="editor-row">
      <label>Section Title
        <input type="text" id="editTitle" value="${section.title ? escapeHtml(section.title) : ''}">
      </label>
    </div>
    <div class="editor-row">
      <label>Content (supports line breaks)
        <textarea id="editContent" rows="4">${section.content ? escapeHtml(section.content) : ''}</textarea>
      </label>
    </div>
    <div class="editor-row">
      <label>Links (one per line, format: text|url)
        <textarea id="editLinks" rows="2">${section.links ? section.links.map(l => `${l.text||''}|${l.url}`).join('\n') : ''}</textarea>
      </label>
    </div>
    <div class="editor-row">
      <label>Media (one per line, format: type|url|alt)
        <textarea id="editMedia" rows="2">${section.media ? section.media.map(m => `${m.type||''}|${m.url||''}|${m.alt||''}`).join('\n') : ''}</textarea>
        <small>type: image or video. For YouTube, paste the full URL.</small>
      </label>
    </div>
    <div class="editor-actions">
      <button id="saveSectionBtn">${idx === null ? 'Add' : 'Save'}</button>
      <button class="cancel" id="cancelSectionBtn">Cancel</button>
    </div>
  `;
  overlay.appendChild(editor);
  document.body.appendChild(overlay);

  document.getElementById('cancelSectionBtn').onclick = () => document.body.removeChild(overlay);
  document.getElementById('saveSectionBtn').onclick = () => {
    const newSection = {
      title: document.getElementById('editTitle').value.trim(),
      content: document.getElementById('editContent').value.trim(),
      links: parseLinks(document.getElementById('editLinks').value),
      media: parseMedia(document.getElementById('editMedia').value)
    };
    if (idx === null) {
      sections.push(newSection);
    } else {
      sections[idx] = newSection;
    }
    document.body.removeChild(overlay);
    renderSections();
  };
}

function parseLinks(val) {
  return val.split('\n').map(l => {
    const [text, url] = l.split('|').map(s => s && s.trim());
    if (url) return { text, url };
    if (text && text.startsWith('http')) return { text: text, url: text };
    return null;
  }).filter(Boolean);
}

function parseMedia(val) {
  return val.split('\n').map(l => {
    const [type, url, alt] = l.split('|').map(s => s && s.trim());
    if (type && url) return { type, url, alt };
    return null;
  }).filter(Boolean);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m];
  });
}

// Expose for inline event handlers
window.editSection = editSection;
window.deleteSection = deleteSection;
window.moveSection = moveSection;

addSectionBtn.onclick = addSection;
renderSections();
