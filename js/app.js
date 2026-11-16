// Router, Seitenübergänge und gemeinsame Seitenlogik.
import { $, $$, t, tx, esc, lang, setLang, onLang, onColor, initTooltip, initLightbox, hideTip, pixelURL, reduceMotion } from './core.js';
import { disposeViews } from './views.js';
import { loadMods } from './content/index.js';
import * as Home from './pages/home.js';
import * as Mod from './pages/mod.js';
import * as Downloads from './pages/downloads.js';
import { loadDownloads } from './downloads.js';

const app = $('#app');
const SPLASH = {
  de: ['Mehr kommt!', 'Jetzt mit Zeus!', 'Fang den Boten!', 'Blut fließt!', 'Ins Nichts!', 'Nur Vanilla-Blöcke!', 'Bitte hier unterschreiben.', 'Goldene Rune = zuschlagen!', '100 % handgebaut!', 'Wähle deine Seite!'],
  en: ['More to come!', 'Now with Zeus!', 'Catch the messenger!', 'Blood flows!', 'Into the void!', 'Vanilla blocks only!', 'Please sign here.', 'Golden rune = strike!', '100% handmade!', 'Choose your side!'],
};

// ============================================================ Seitenwechsel

// Ruhiger Übergang: der Inhalt unter der Navigation blendet kurz ab, oben läuft eine dünne Leiste in der Farbe des Ziels,
// die neue Seite gleitet sanft herein. Beim ersten Laden steht ein schwarzer Schirm mit Schriftzug und blendet aus.
const warp = (() => {
  const el = $('#warp');
  const bar = $('.warp-bar i', el);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  let barAnim = null;

  async function cover(accent) {
    el.style.setProperty('--accent', accent);
    el.hidden = false;
    el.classList.add('on');
    barAnim?.cancel();
    barAnim = bar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(.75)' }], { duration: 900, easing: 'cubic-bezier(.1,.7,.3,1)', fill: 'forwards' });
    await el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reduceMotion ? 80 : 200, easing: 'ease-out', fill: 'forwards' }).finished;
  }

  async function reveal() {
    barAnim?.cancel();
    barAnim = bar.animate([{ transform: 'scaleX(.75)', opacity: 1 }, { transform: 'scaleX(1)', opacity: 1, offset: 0.6 }, { transform: 'scaleX(1)', opacity: 0 }], { duration: 380, easing: 'ease-out', fill: 'forwards' });
    if (!reduceMotion) app.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' });
    await wait(60);
    await el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduceMotion ? 80 : 280, easing: 'ease-in', fill: 'forwards' }).finished;
    el.hidden = true;
    el.classList.remove('on', 'boot');
  }

  return { cover, reveal };
})();

// ============================================================ Seiten

let mods = [];
let dl = null;
let pageAbort = null;
let navigating = false;

function routeOf(path) {
  if (/^\/downloads\/?$/i.test(path)) return { kind: 'downloads', accent: Downloads.ACCENT, path: '/downloads/' };
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
    app.innerHTML = Mod.render(route.mod, dl);
    document.title = Mod.title(route.mod);
    setMeta(tx(route.mod.short));
    Mod.mount(app, route.mod, signal).catch(console.error);
    initToc(signal);
  } else if (route.kind === 'downloads') {
    app.innerHTML = Downloads.render(mods, dl);
    document.title = Downloads.title();
    setMeta(tx({ de: 'Alle Mods von Vibe Craft Studios zum Herunterladen, mit SHA-256-Prüfsumme und VirusTotal-Scan.', en: 'Download every Vibe Craft Studios mod, with SHA-256 checksum and VirusTotal scan.' }));
    Downloads.mount(app, mods, dl, signal).catch(console.error);
  } else {
    app.innerHTML = Home.render(mods);
    document.title = 'Vibe Craft Studios · Minecraft Mods';
    setMeta(tx({ de: 'Vibe Craft Studios ist ein kleines Studio für Minecraft-Mods mit eigenen Modellen, Welten und Bosskämpfen.', en: 'Vibe Craft Studios is a small studio making Minecraft mods with their own models, worlds and boss fights.' }));
    Home.mount(app, mods, signal).catch(console.error);
    splash();
  }
  setActiveNav(route);
  initReveal(signal);
  document.body.dataset.route = route.kind;
  document.documentElement.style.setProperty('--route-accent', route.accent);
  document.documentElement.style.setProperty('--route-on', onColor(route.accent));
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
  try {
    await warp.cover(route.accent);
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
      if (a) {
        a.classList.add('on');
        // Nur die Leiste seitlich verschieben: scrollIntoView würde bei der klebenden Leiste die ganze Seite nach oben ziehen.
        const bar = a.parentElement;
        const left = a.offsetLeft - (bar.clientWidth - a.offsetWidth) / 2;
        bar.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('section[id]', app).forEach((s) => io.observe(s));
  signal.addEventListener('abort', () => io.disconnect());
}

function buildNav() {
  const links = $('.nav-links');
  links.innerHTML = `<a href="/" data-link>${t({ de: 'Start', en: 'Home' })}</a>` +
    mods.map((m) => `<a href="${m.path}" data-link style="--accent:${m.accent}">${esc(m.name)}</a>`).join('') +
    `<a href="/downloads/" data-link>Downloads</a>`;
  const foot = $('.foot-mods');
  if (foot) foot.innerHTML = mods.map((m) => `<a href="${m.path}" data-link>${esc(m.name)}</a>`).join('');
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
  [mods, dl] = await Promise.all([loadMods(), loadDownloads()]);
  buildNav();
  const route = routeOf(location.pathname);
  // Der Startschirm steht schon (HTML) und blendet nach dem ersten Rendern aus.
  renderRoute(route);
  if (location.hash) scrollToHash(location.hash, true);
  await new Promise((r) => setTimeout(r, reduceMotion ? 0 : 250));
  await warp.reveal();
})();
