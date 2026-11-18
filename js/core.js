// Gemeinsame Helfer: DOM, Sprache, Tooltip, Lightbox, Pixeltexturen.

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ------------------------------------------------------------ Sprache

export function lang() { return document.documentElement.dataset.lang || 'de'; }

/** Zweisprachiger Text als zwei Spans; CSS blendet die andere Sprache aus. Texte dürfen einfaches HTML enthalten. */
export function t(o) {
  if (o == null) return '';
  if (typeof o !== 'object') return String(o);
  if (o.de === o.en || o.en == null) return o.de ?? '';
  return `<span class="de">${o.de ?? ''}</span><span class="en">${o.en ?? ''}</span>`;
}
/** Nur die aktuelle Sprache als reiner Text (für Attribute). */
export function tx(o) {
  if (o == null) return '';
  if (typeof o !== 'object') return String(o);
  return String(o[lang()] ?? o.de ?? '').replace(/<[^>]+>/g, '');
}

/** Lesbare Schriftfarbe auf einer Leitfarbe (schwarz auf hellen, weiß auf dunklen Farben). */
export function onColor(hex) {
  const n = parseInt(String(hex).slice(1), 16);
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const l = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  return l > 0.22 ? '#000' : '#fff';
}

/**
 * Vorstellungstext: die ersten n Sätze (je Sprache) ohne Detailsätze. Sätze mit Zahlen (Haltbarkeit, Schaden,
 * Abklingzeiten, Koordinaten) oder Tastenbelegung fallen weg; die stehen im Spiel, nicht auf der Werbeseite.
 */
const DETAIL = /\d|Ability|\bTasten?\b|\bkeys?\b|Steuerung|controls|\bconfig/i;
export function short(o, n = 1) {
  if (o == null) return o;
  const cut = (s) => {
    if (typeof s !== 'string') return s;
    const parts = s.replace(/<br\s*\/?>/g, ' ').split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ„"(<])/);
    const merged = [];
    for (const p of parts) {
      if (merged.length && merged[merged.length - 1].replace(/<[^>]+>/g, '').length < 22) merged[merged.length - 1] += ' ' + p;
      else merged.push(p);
    }
    // „3D“ ist ein Wort, keine Zahl: Sätze mit „3D-Flug“ & Co. bleiben stehen
    return merged.filter((p) => !DETAIL.test(p.replace(/<[^>]+>/g, '').replace(/\b3D\b/g, ''))).slice(0, n).join(' ');
  };
  if (typeof o !== 'object') return cut(String(o));
  return { de: cut(o.de), en: cut(o.en ?? o.de) };
}

/** Pixel-Icons: animierte Streifen (Höhe > Breite) automatisch erkennen und abspielen, wie im Spiel. */
const frameCache = new Map();
export function animateIcons(root) {
  $$('.px-icon[data-src]', root).forEach((el) => {
    const src = el.dataset.src;
    el.style.backgroundImage = `url(${src})`;
    if (!frameCache.has(src)) {
      frameCache.set(src, new Promise((res) => {
        const img = new Image();
        img.onload = () => res(Math.max(1, Math.round(img.height / img.width)));
        img.onerror = () => res(1);
        img.src = src;
      }));
    }
    frameCache.get(src).then((n) => {
      if (n < 2) return;
      el.style.setProperty('--n', n);
      el.style.backgroundSize = `100% ${n * 100}%`;
      el.classList.add('anim');
    });
  });
}

const langListeners = new Set();
export function onLang(fn) { langListeners.add(fn); return () => langListeners.delete(fn); }
export function setLang(l) {
  document.documentElement.dataset.lang = l;
  document.documentElement.lang = l;
  try { localStorage.setItem('vcs-lang', l); } catch (e) { /* privat */ }
  $$('[data-set-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setLang === l)));
  langListeners.forEach((f) => f(l));
}

// ------------------------------------------------------------ Pixeltexturen (eigene, prozedural)

export function pixelCanvas(colors, size = 16, seed = 7) {
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const g = c.getContext('2d');
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    g.fillStyle = colors[Math.floor(rnd() * colors.length)];
    g.fillRect(x, y, 1, 1);
  }
  return c;
}
const urlCache = new Map();
export function pixelURL(colors, size = 16, seed = 7) {
  const key = colors.join() + size + ':' + seed;
  if (!urlCache.has(key)) urlCache.set(key, `url(${pixelCanvas(colors, size, seed).toDataURL()})`);
  return urlCache.get(key);
}

/** Farbpalette rund um eine Leitfarbe (für Blöcke und Hintergründe). */
export function shades(hex, spread = 0.18) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const out = [];
  for (const k of [-spread, -spread / 2, 0, spread / 3, -spread / 4]) {
    const f = (v) => Math.max(0, Math.min(255, Math.round(v * (1 + k))));
    out.push(`rgb(${f(r)},${f(g)},${f(b)})`);
  }
  return out;
}

// ------------------------------------------------------------ Tooltip

let tipEl = null, tipOwner = null;
export function initTooltip() {
  tipEl = $('#mc-tooltip');
  document.addEventListener('scroll', hideTip, { passive: true });
  document.addEventListener('pointerdown', (e) => { if (tipOwner && !tipOwner.contains(e.target)) hideTip(); });
}
export function showTip(html, x, y, owner) {
  tipEl.innerHTML = html;
  tipEl.hidden = false;
  tipOwner = owner;
  moveTip(x, y);
}
export function moveTip(x, y) {
  const r = tipEl.getBoundingClientRect();
  let left = x + 16, top = y - 12;
  if (left + r.width > innerWidth - 8) left = x - r.width - 16;
  if (left < 8) left = 8;
  if (top + r.height > innerHeight - 8) top = innerHeight - r.height - 8;
  if (top < 8) top = 8;
  tipEl.style.left = left + 'px';
  tipEl.style.top = top + 'px';
}
export function hideTip() { if (tipEl) tipEl.hidden = true; tipOwner = null; }
export function tipFor(el, html, signal) {
  const show = (e) => showTip(html(), e.clientX, e.clientY, el);
  el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') show(e); }, { signal });
  el.addEventListener('pointermove', (e) => { if (tipOwner === el) moveTip(e.clientX, e.clientY); }, { signal });
  el.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') hideTip(); }, { signal });
  el.addEventListener('click', (e) => {
    const r = el.getBoundingClientRect();
    if (tipOwner === el) hideTip(); else showTip(html(), r.right, r.top + 10, el);
    e.stopPropagation();
  }, { signal });
  el.addEventListener('focus', () => { const r = el.getBoundingClientRect(); showTip(html(), r.right, r.top + 10, el); }, { signal });
  el.addEventListener('blur', hideTip, { signal });
}

// ------------------------------------------------------------ Lightbox

// nav = { list: [{ src, caption }], index }: Blättern mit Pfeilen, Pfeiltasten und Wischen
let lbNav = null;
function lbShow(src, captionHTML) {
  const lb = $('#lightbox');
  $('img', lb).src = src;
  $('.lb-caption', lb).innerHTML = captionHTML + (lbNav ? ` <span class="lb-count mono">${lbNav.index + 1} / ${lbNav.list.length}</span>` : '');
}
function lbStep(d) {
  if (!lbNav) return;
  const n = lbNav.list.length;
  lbNav.index = (lbNav.index + d + n) % n;
  const it = lbNav.list[lbNav.index];
  lbShow(it.src, it.caption);
  new Image().src = lbNav.list[(lbNav.index + d + n) % n].src; // nächstes Bild vorladen
}
export function openLightbox(src, captionHTML, nav = null) {
  const lb = $('#lightbox');
  lbNav = nav && nav.list?.length > 1 ? nav : null;
  lb.classList.toggle('has-nav', !!lbNav);
  lbShow(src, captionHTML);
  lb.hidden = false;
  $('.lb-close', lb).focus();
  if (lbNav) new Image().src = lbNav.list[(lbNav.index + 1) % lbNav.list.length].src;
}
export function initLightbox() {
  const lb = $('#lightbox');
  if (!$('.lb-prev', lb)) {
    lb.insertAdjacentHTML('beforeend', '<button class="icon-btn lb-nav lb-prev" aria-label="Zurück / Previous">‹</button><button class="icon-btn lb-nav lb-next" aria-label="Weiter / Next">›</button>');
  }
  lb.addEventListener('click', (e) => {
    if (e.target.closest('.lb-prev')) return lbStep(-1);
    if (e.target.closest('.lb-next')) return lbStep(1);
    if (e.target === lb || e.target.closest('.lb-close')) lb.hidden = true;
  });
  let x0 = null;
  lb.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) lbStep(dx < 0 ? 1 : -1);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { lb.hidden = true; hideTip(); }
    if (!lb.hidden && lbNav && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); lbStep(e.key === 'ArrowLeft' ? -1 : 1); }
  });
}
