// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
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

// Dark mode toggle
const modeToggle = document.querySelector('.mode-toggle');

// Apply saved preference on load
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark-mode');
}

modeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Intersection animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {threshold: 0.1});

document.querySelectorAll('.card, .about, .testimonial-grid figure, .contact form, .team-grid figure, .newsletter form').forEach(el => {
  observer.observe(el);
});

let swRegister;
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js').then(reg=>{
    swRegister=reg;
    setupPush(reg);
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

const contactForm = document.querySelector('#contact form');
if(contactForm){
  contactForm.addEventListener('submit',e=>{
    e.preventDefault();
    const data=new FormData(contactForm);
    if(navigator.onLine){
      fetch(contactForm.action,{method:'POST',body:data});
    }else{
      saveRecord(formDB,'forms',{url:contactForm.action,data:Object.fromEntries(data)});
      swRegister && swRegister.sync && swRegister.sync.register('sync-forms');
      alert('Message saved and will be sent when online.');
    }
    contactForm.reset();
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

