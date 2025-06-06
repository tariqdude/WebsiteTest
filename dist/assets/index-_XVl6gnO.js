(function () {
  const e = document.createElement('link').relList;
  if (e && e.supports && e.supports('modulepreload')) return;
  for (const t of document.querySelectorAll('link[rel="modulepreload"]')) c(t);
  new MutationObserver((t) => {
    for (const r of t)
      if (r.type === 'childList')
        for (const s of r.addedNodes)
          s.tagName === 'LINK' && s.rel === 'modulepreload' && c(s);
  }).observe(document, { childList: !0, subtree: !0 });
  function o(t) {
    const r = {};
    return (
      t.integrity && (r.integrity = t.integrity),
      t.referrerPolicy && (r.referrerPolicy = t.referrerPolicy),
      t.crossOrigin === 'use-credentials'
        ? (r.credentials = 'include')
        : t.crossOrigin === 'anonymous'
          ? (r.credentials = 'omit')
          : (r.credentials = 'same-origin'),
      r
    );
  }
  function c(t) {
    if (t.ep) return;
    t.ep = !0;
    const r = o(t);
    fetch(t.href, r);
  }
})();
function u() {
  const n = document.querySelector('.menu-toggle'),
    e = document.querySelector('nav');
  !n ||
    !e ||
    n.addEventListener('click', () => {
      e.classList.toggle('open');
    });
}
function a() {
  const n = document.querySelector('.carousel');
  if (!n) return;
  let e = 0;
  const o = n.querySelectorAll('.slide'),
    c = n.querySelector('.next'),
    t = n.querySelector('.prev');
  function r(s) {
    o.forEach((i, l) => {
      i.style.display = l === s ? 'block' : 'none';
    });
  }
  c?.addEventListener('click', () => {
    (e = (e + 1) % o.length), r(e);
  }),
    t?.addEventListener('click', () => {
      (e = (e - 1 + o.length) % o.length), r(e);
    }),
    r(e);
}
function d() {
  document.querySelectorAll('[data-count]').forEach((e) => {
    const o = Number(e.dataset.count);
    let c = 0;
    const t = Math.ceil(o / 100),
      r = setInterval(() => {
        (c += t),
          c >= o
            ? ((e.textContent = o.toString()), clearInterval(r))
            : (e.textContent = c.toString());
      }, 20);
  });
}
function f() {
  const n = document.querySelector('form');
  n &&
    n.addEventListener('submit', async (e) => {
      e.preventDefault();
      const o = new FormData(n),
        c = n.querySelector('[type=submit]');
      c.disabled = !0;
      try {
        await fetch('/api/sendMail', { method: 'POST', body: o }),
          n.reset(),
          alert('Success');
      } catch {
        alert('Error');
      } finally {
        c.disabled = !1;
      }
    });
}
document.addEventListener('DOMContentLoaded', () => {
  u(), a(), d(), f();
});
