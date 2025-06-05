// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const spinner = document.getElementById('spinner');

// Hero media setup
const heroMedia = document.getElementById('hero-media');
const videoMuteBtn = document.querySelector('.video-mute');
let heroVideo = null;
let heroYTPlayer = null;

function loadYouTubeAPI(){
  const tag=document.createElement('script');
  tag.src='https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

function initHeroMedia(){
  if(!heroMedia) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    heroMedia.style.display='none';
    if(videoMuteBtn) videoMuteBtn.style.display='none';
    return;
  }
  if(heroMedia.dataset.youtube){
    loadYouTubeAPI();
  }else if(heroMedia.dataset.video){
    heroVideo=document.createElement('video');
    heroVideo.className='hero-video';
    heroVideo.autoplay=true;
    heroVideo.loop=true;
    heroVideo.playsInline=true;
    heroVideo.muted=true;
    heroVideo.innerHTML=`<source src="${heroMedia.dataset.video}" type="${heroMedia.dataset.type||'video/mp4'}">`;
    heroMedia.appendChild(heroVideo);
  }
}

window.initHeroMedia=initHeroMedia;
document.addEventListener('DOMContentLoaded',initHeroMedia);

function onYouTubeIframeAPIReady(){
  if(!heroMedia||!heroMedia.dataset.youtube) return;
  const id=heroMedia.dataset.youtube;
  heroYTPlayer=new YT.Player(heroMedia,{videoId:id,playerVars:{autoplay:1,loop:1,playlist:id,controls:0,playsinline:1,modestbranding:1,showinfo:0,mute:1},events:{onReady:e=>e.target.playVideo()}});
}
window.onYouTubeIframeAPIReady=onYouTubeIframeAPIReady;

if(videoMuteBtn){
  videoMuteBtn.addEventListener('click',()=>{
    if(heroVideo){
      heroVideo.muted=!heroVideo.muted;
      const muted=heroVideo.muted;
      videoMuteBtn.textContent=muted?'🔇':'🔊';
      videoMuteBtn.setAttribute('aria-pressed',muted);
    }else if(heroYTPlayer){
      if(heroYTPlayer.isMuted()){
        heroYTPlayer.unMute();
        videoMuteBtn.textContent='🔊';
        videoMuteBtn.setAttribute('aria-pressed','false');
      }else{
        heroYTPlayer.mute();
        videoMuteBtn.textContent='🔇';
        videoMuteBtn.setAttribute('aria-pressed','true');
      }
    }
  });
}
document.addEventListener('DOMContentLoaded', ()=> spinner.hidden=false);
window.addEventListener('load', ()=> spinner.hidden=true);
navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  const newExpanded = !expanded;
  navToggle.setAttribute('aria-expanded', newExpanded);
  navMenu.classList.toggle('show');
  navMenu.setAttribute('aria-hidden', !newExpanded);
});

// Close mobile nav when a link is clicked
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('show');
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
  });
});

// Theme toggle with high contrast option
const modeToggle = document.querySelector('.mode-toggle');
const themes = ['light','dark','contrast'];
let themeIndex = themes.indexOf(localStorage.getItem('theme'));
if(themeIndex === -1) themeIndex = 0;
applyTheme(themeIndex);

function applyTheme(i){
  document.documentElement.classList.toggle('dark-mode', themes[i]==='dark');
  document.documentElement.classList.toggle('high-contrast', themes[i]==='contrast');
}

modeToggle.addEventListener('click', () => {
  themeIndex = (themeIndex + 1) % themes.length;
  applyTheme(themeIndex);
  localStorage.setItem('theme', themes[themeIndex]);
  lottieAnim && lottieAnim.goToAndPlay(0,true);
});

// Intersection animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      if(entry.target.classList.contains('skill-progress')){
        entry.target.style.width = entry.target.dataset.value + '%';
      }
    }
  });
}, {threshold: 0.1});

document.querySelectorAll('.card, .about, .testimonial-grid figure, .contact form, .team-grid figure, .newsletter form').forEach(el => {
  observer.observe(el);
});

// Lazy load images
const lazyImages = document.querySelectorAll('img[data-src]');
const imgObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      imgObserver.unobserve(img);
    }
  });
});
lazyImages.forEach(img => imgObserver.observe(img));

// Animate skill bars
document.querySelectorAll('.skill-progress').forEach(bar => {
  observer.observe(bar);
});
let swRegister;
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js").then(reg=>{
    swRegister=reg;
    setupPush(reg);
  });
}

// Collapse sticky nav on scroll down
const navBar = document.querySelector(".nav");
let lastScrollY = window.scrollY;
if(navBar){
  window.addEventListener("scroll", () => {
    if(window.scrollY > lastScrollY && window.scrollY > 50){
      navBar.classList.add("nav-collapsed");
    } else {
      navBar.classList.remove("nav-collapsed");
    }
    lastScrollY = window.scrollY;
  });
}

// Parallax hero background
const hero = document.querySelector(".hero");
if(hero){
  window.addEventListener("scroll", () => {
    const offset = window.scrollY * 0.5;
    hero.style.backgroundPositionY = `-${offset}px`;
  });
}

// Scroll progress indicator
const progressBar = document.querySelector(".scroll-progress");
if(progressBar){
  window.addEventListener("scroll", () => {
    const max = document.body.scrollHeight - window.innerHeight;
    const percent = Math.min(100, (window.scrollY / max) * 100);
    progressBar.style.width = `${percent}%`;
  });
}



// Scroll to top button
const scrollBtn = document.querySelector('.scroll-top');
if(scrollBtn){
  window.addEventListener('scroll', () => {
    if(window.pageYOffset > 300){
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  });
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  });
}

// Newsletter signup
const newsletterForm = document.getElementById('newsletter-form');
if(newsletterForm){
  const msg = document.getElementById('newsletter-message');
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(newsletterForm);
    if(navigator.onLine){
      fetch('/newsletter', {method:'POST', body:data});
      msg.textContent = 'Thank you for subscribing!';
    }else{
      saveRecord(formDB,'forms',{url:'/newsletter',data:Object.fromEntries(data)});
      swRegister && swRegister.sync && swRegister.sync.register('sync-forms');
      msg.textContent = 'Saved offline. We\'ll subscribe you when back online.';
    }
    newsletterForm.reset();
    msg.hidden = false;
  });
}

const contactForm = document.getElementById('contact-form');
if(contactForm){
  const steps = contactForm.querySelectorAll('.form-step');
  const nextBtn = contactForm.querySelector('.next');
  const prevBtn = contactForm.querySelector('.prev');
  const progress = contactForm.querySelector('.form-progress');
  let current = 0;
  function showStep(i){
    steps.forEach((s,idx)=>{s.hidden = idx!==i;});
    progress.value = i+1;
  }
  showStep(0);
  nextBtn.addEventListener('click',()=>{
    const valid=[...steps[0].querySelectorAll('input')].every(i=>i.reportValidity());
    if(valid){ current=1; showStep(1); }
  });
  prevBtn.addEventListener('click',()=>{current=0;showStep(0);});
  contactForm.addEventListener('submit',e=>{
    e.preventDefault();
    const data=new FormData(contactForm);
    const msg=document.getElementById('contact-message');
    if(navigator.onLine){
      fetch(contactForm.action,{method:'POST',body:data});
      msg.textContent='Message sent!';
    }else{
      saveRecord(formDB,'forms',{url:contactForm.action,data:Object.fromEntries(data)});
      swRegister && swRegister.sync && swRegister.sync.register('sync-forms');
      msg.textContent='Saved offline and will send later.';
    }
    contactForm.reset();
    showStep(0);
    msg.hidden=false;
  });
  contactForm.querySelectorAll('input,textarea,select').forEach(el=>{
    el.addEventListener('invalid',()=>el.classList.add('invalid'));
    el.addEventListener('input',()=>el.classList.remove('invalid'));
  });
}

// Install banner
let deferredPrompt;
const installBanner=document.getElementById('install-banner');
const installBtn=document.getElementById('install-btn');
window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();
  deferredPrompt=e;
  installBanner.hidden=false;
});
installBtn.addEventListener('click',()=>{
  if(deferredPrompt){
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(()=>{
      installBanner.hidden=true;
      deferredPrompt=null;
    });
  }
});

// Network status UI
const networkStatus=document.getElementById('network-status');
function updateStatus(){
  networkStatus.hidden=navigator.onLine;
}
window.addEventListener('online',updateStatus);
window.addEventListener('offline',updateStatus);
updateStatus();

// IndexedDB helpers
function openDB(name,store){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(name,1);
    req.onupgradeneeded=()=>req.result.createObjectStore(store,{autoIncrement:true});
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
const formDB=openDB('form-store','forms');
const analyticsDB=openDB('analytics-store','events');
function saveRecord(dbPromise,store,data){
  dbPromise.then(db=>{
    const tx=db.transaction(store,'readwrite');
    tx.objectStore(store).add(data);
  });
}

// Background analytics
function sendAnalytics(data){
  if(navigator.onLine){
    fetch('/analytics',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  }else{
    saveRecord(analyticsDB,'events',data);
    swRegister && swRegister.sync && swRegister.sync.register('sync-analytics');
  }
}
sendAnalytics({event:'pageview',url:location.href});

// Lottie animation for theme toggle
const lottieContainer=document.getElementById('theme-lottie');
let lottieAnim=null;
if(lottieContainer && window.lottie){
  lottieAnim=window.lottie.loadAnimation({
    container:lottieContainer,
    renderer:'svg',
    loop:false,
    autoplay:false,
    path:'https://assets9.lottiefiles.com/temp/lf20_oGlWy5.json'
  });
}

// Push notifications
function setupPush(reg){
  if(!('PushManager' in window))return;
  Notification.requestPermission().then(per=>{
    if(per==='granted'){
      reg.pushManager.subscribe({userVisibleOnly:true}).then(sub=>{
        fetch('/subscribe',{method:'POST',body:JSON.stringify(sub)});
      });
    }
  });
}

