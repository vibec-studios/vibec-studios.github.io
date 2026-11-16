// Router, Seitenübergänge (Block-Wipe) und gemeinsame Seitenlogik.
import { $, $$, t, tx, esc, lang, setLang, onLang, initTooltip, initLightbox, hideTip, pixelURL, reduceMotion } from './core.js';
import { disposeViews } from './views.js';
import { loadMods } from './content/index.js';
import * as Home from './pages/home.js';
import * as Mod from './pages/mod.js';

const app = $('#app');
const SPLASH = {
  de: ['Jetzt mit Kronos!', 'Fang den Boten!', 'Blut fließt!', 'Ins Nichts!', 'Nur Vanilla-Blöcke!', 'Bitte hier unterschreiben.', 'Goldene Rune = zuschlagen!', '100 % handgebaut!', 'Wähle deine Seite!'],
  en: ['Now with Kronos!', 'Catch the messenger!', 'Blood flows!', 'Into the void!', 'Vanilla blocks only!', 'Please sign here.', 'Golden rune = strike!', '100% handmade!', 'Choose your side!'],
};

// ============================================================ Block-Wipe

const warp = (() => {
  const el = $('#warp');
  const grid = $('.warp-grid', el);
  const label = $('.warp-label', el);
  const bar = $('.warp-bar i', el);
  let cells = [], cols = 0, rows = 0, size = 0;

  function build() {
    const w = innerWidth, h = innerHeight;
    size = Math.ceil(Math.max(w, h) / (w < 700 ? 8 : 14));
    cols = Math.ceil(w / size) + 1; rows = Math.ceil(h / size) + 1;
    grid.innerHTML = '';
    cells = [];
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const c = document.createElement('i');
      c.style.cssText = `left:${x * size}px;top:${y * size}px;width:${size + 1}px;height:${size + 1}px;background-size:${size}px`;
      c.dataset.x = x; c.dataset.y = y;
      grid.appendChild(c);
      cells.push(c);
    }
  }

  function paint(accent) {
    const n = parseInt(accent.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const tone = (f) => `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`;
    const palettes = [0, 1, 2, 3].map((i) => pixelURL([tone(0.22), tone(0.18), tone(0.26 + i * 0.02), tone(0.15), tone(0.3)], 16, 101 + i * 13));
    const edge = tone(0.55);
    cells.forEach((c, i) => {
      c.style.backgroundImage = palettes[(i * 7 + (i >> 3)) % 4];
      c.style.boxShadow = `inset 2px 2px 0 ${edge}55, inset -2px -2px 0 #0008`;
    });
    el.style.setProperty('--accent', accent);
  }

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  async function cover(origin, accent, text) {
    if (!cells.length || el.dataset.size !== `${innerWidth}x${innerHeight}`) { build(); el.dataset.size = `${innerWidth}x${innerHeight}`; }
    paint(accent);
    label.innerHTML = text || '';
    el.hidden = false;
    el.classList.add('on');
    if (reduceMotion) {
      await el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, fill: 'forwards' }).finished;
      cells.forEach((c) => { c.style.transform = 'none'; c.style.opacity = 1; });
      return;
    }
    el.style.opacity = 1;
    const ox = origin ? origin.x / size : cols / 2, oy = origin ? origin.y / size : rows / 2;
    let maxEnd = 0;
    cells.forEach((c) => {
      const d = Math.hypot(+c.dataset.x + 0.5 - ox, +c.dataset.y + 0.5 - oy);
      const delay = d * 26 + Math.random() * 50;
      const rot = (Math.random() - 0.5) * 50;
      maxEnd = Math.max(maxEnd, delay + 280);
      c.animate([
        { transform: `scale(0) rotate(${rot}deg)`, opacity: 0 },
        { transform: 'scale(1.08) rotate(0deg)', opacity: 1, offset: 0.75 },
        { transform: 'scale(1) rotate(0deg)', opacity: 1 },
      ], { duration: 280, delay, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
    });
    $('.warp-center', el).animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 200, delay: maxEnd * 0.55, fill: 'forwards' });
    bar.animate([{ width: '0%' }, { width: '70%' }], { duration: maxEnd, easing: 'ease-out', fill: 'forwards' });
    await wait(maxEnd);
  }

  async function reveal() {
    if (reduceMotion) {
      await el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' }).finished;
      el.hidden = true; el.classList.remove('on');
      return;
    }
    bar.animate([{ width: '70%' }, { width: '100%' }], { duration: 160, fill: 'forwards' });
    await wait(170);
    $('.warp-center', el).animate([{ opacity: 1 }, { opacity: 0, transform: 'scale(.96)' }], { duration: 160, fill: 'forwards' });
    const cx = cols / 2, cy = rows / 2;
    let maxEnd = 0;
    cells.forEach((c) => {
      const d = Math.hypot(+c.dataset.x + 0.5 - cx, +c.dataset.y + 0.5 - cy);
      const delay = 60 + d * 30 + Math.random() * 70;
      const rot = (Math.random() - 0.5) * 70;
      const fall = 40 + Math.random() * 90;
      maxEnd = Math.max(maxEnd, delay + 360);
      c.animate([
        { transform: 'translateY(0) scale(1) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${fall}px) scale(0.2) rotate(${rot}deg)`, opacity: 0 },
      ], { duration: 360, delay, easing: 'cubic-bezier(.5,0,.9,.6)', fill: 'forwards' });
    });
    await wait(maxEnd);
    el.hidden = true;
    el.classList.remove('on');
  }

  return { cover, reveal };
})();

// ============================================================ Seiten

let mods = [];
let pageAbort = null;
let navigating = false;

function routeOf(path) {
  const m = path.match(/^\/mods\/([a-z0-9_-]+)\/?$/i);
  if (m) {
    const mod = mods.find((x) => x.id === m[1].toLowerCase());
    if (mod) return { kind: 'mod', mod, accent: mod.accent, path: mod.path };
  }
  return { kind: 'home', accent: Home.STUDIO.accent, path: '/' };
}

function setActiveNav(route) {
  $$('.nav-links a').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === route.path));
}

function renderRoute(route) {
  if (pageAbort) pageAbort.abort();
  disposeViews();
  hideTip();
  pageAbort = new AbortController();
  const signal = pageAbort.signal;
  if (route.kind === 'mod') {
    app.innerHTML = Mod.render(route.mod);
    document.title = Mod.title(route.mod);
    setMeta(tx(route.mod.short));
    Mod.mount(app, route.mod, signal).catch(console.error);
    initToc(signal);
  } else {
    app.innerHTML = Home.render(mods);
    document.title = 'Vibe Craft Studios · Minecraft Mods';
    setMeta(tx({ de: 'Vibe Craft Studios baut Minecraft-Mods mit Bosskämpfen, eigenen Welten und echten 3D-Effekten.', en: 'Vibe Craft Studios builds Minecraft mods with boss fights, worlds of their own and real 3D effects.' }));
    Home.mount(app, mods, signal).catch(console.error);
    splash();
  }
  setActiveNav(route);
  initReveal(signal);
  document.body.dataset.route = route.kind;
  document.documentElement.style.setProperty('--route-accent', route.accent);
}

function setMeta(text) { $('meta[name="description"]').setAttribute('content', text); }

async function navigate(url, { push = true, origin = null } = {}) {
  const target = new URL(url, location.href);
  const sameDoc = target.pathname === location.pathname;
  if (sameDoc && target.hash) {
    if (push) history.pushState(null, '', target.hash);
    scrollToHash(target.hash);
    return;
  }
  if (navigating) return;
  navigating = true;
  const route = routeOf(target.pathname);
  const label = route.kind === 'mod'
    ? `${esc(route.mod.name)}<small>${t({ de: 'Welt wird geladen …', en: 'Loading world …' })}</small>`
    : `Vibe Craft Studios<small>${t({ de: 'Zurück zum Hauptmenü …', en: 'Back to the title screen …' })}</small>`;
  try {
    await warp.cover(origin, route.accent, label);
    if (push) history.pushState(null, '', route.path + (target.hash || ''));
    renderRoute(route);
    if (target.hash) scrollToHash(target.hash, true); else window.scrollTo({ top: 0, behavior: 'instant' });
    await warp.reveal();
  } finally {
    navigating = false;
  }
}

function scrollToHash(hash, instant) {
  if (hash.startsWith('#boss-')) hash = '#' + ($('[data-viewer]')?.closest('section')?.id || '');
  const el = hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
  if (el) el.scrollIntoView({ behavior: instant || reduceMotion ? 'instant' : 'smooth', block: 'start' });
}

// ============================================================ Kleinkram

function splash() {
  const el = $('#splash');
  if (!el) return;
  const list = SPLASH[lang()];
  el.textContent = list[Math.floor(Math.random() * list.length)];
}

function initReveal(signal) {
  const els = $$('[data-reveal]', app);
  if (reduceMotion) { els.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  els.forEach((e) => io.observe(e));
  signal.addEventListener('abort', () => io.disconnect());
}

function initToc(signal) {
  const links = $$('.toc a', app);
  if (!links.length) return;
  const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.remove('on'));
      const a = map.get(e.target.id);
      if (a) { a.classList.add('on'); a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'auto' }); }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('section[id]', app).forEach((s) => io.observe(s));
  signal.addEventListener('abort', () => io.disconnect());
}

function buildNav() {
  const links = $('.nav-links');
  links.innerHTML = `<a href="/" data-link>${t({ de: 'Start', en: 'Home' })}</a>` +
    mods.map((m) => `<a href="${m.path}" data-link style="--accent:${m.accent}">${esc(m.name)}</a>`).join('') +
    `<a href="https://github.com/vibec-studios" target="_blank" rel="noopener">GitHub</a>`;
}

document.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const href = a.getAttribute('href');
  if (!href) return;
  if (a.hasAttribute('data-anchor') || href.startsWith('#')) {
    e.preventDefault();
    history.replaceState(null, '', href);
    scrollToHash(href);
    return;
  }
  if (a.target === '_blank' || !a.hasAttribute('data-link')) return;
  e.preventDefault();
  navigate(href, { origin: { x: e.clientX, y: e.clientY } });
});

addEventListener('popstate', () => navigate(location.href, { push: false }));

$$('[data-set-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.setLang)));
onLang(() => { splash(); });

// ============================================================ Start

(async function boot() {
  initTooltip();
  initLightbox();
  setLang(lang());
  mods = await loadMods();
  buildNav();
  const route = routeOf(location.pathname);
  // Der Ladebildschirm steht schon (HTML), die Blöcke brechen nach dem ersten Rendern auf.
  renderRoute(route);
  if (location.hash) scrollToHash(location.hash, true);
  await new Promise((r) => setTimeout(r, reduceMotion ? 0 : 450));
  await warp.cover(null, route.accent, $('#warp .warp-label').innerHTML);
  $('#warp').classList.toggle('boot', false);
  await warp.reveal();
})();
