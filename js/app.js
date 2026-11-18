// Router, Seitenübergänge und gemeinsame Seitenlogik.
import { $, $$, t, tx, esc, lang, setLang, onLang, onColor, initTooltip, initLightbox, hideTip, pixelURL, reduceMotion, animateIcons } from './core.js';
import { disposeViews } from './views.js';
import { loadMods } from './content/index.js';
import * as Home from './pages/home.js';
import * as Mod from './pages/mod.js';
import * as Downloads from './pages/downloads.js';
import * as Status from './pages/status.js';
import * as Launcher from './pages/launcher.js';
import * as Client from './pages/client.js';
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
  if (/^\/status\/?$/i.test(path)) return { kind: 'status', accent: Status.ACCENT, path: '/status/' };
  if (/^\/downloads\/?$/i.test(path)) return { kind: 'downloads', accent: Downloads.ACCENT, path: '/downloads/' };
  if (/^\/launcher\/?$/i.test(path)) return { kind: 'launcher', accent: Launcher.ACCENT, path: '/launcher/' };
  if (/^\/client\/?$/i.test(path)) return { kind: 'client', accent: Client.ACCENT, path: '/client/' };
  const m = path.match(/^\/mods\/([a-z0-9_-]+)\/?$/i);
  if (m) {
    const mod = mods.find((x) => x.id === m[1].toLowerCase());
    if (mod) return { kind: 'mod', mod, accent: mod.accent, path: mod.path };
  }
  return { kind: 'home', accent: Home.STUDIO.accent, path: '/' };
}

function setActiveNav(route) {
  $$('.nav-links a, .mods-panel a').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === route.path));
  $('.nav-menu-btn')?.classList.toggle('active', route.kind === 'mod');
  closeModsMenu();
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
  } else if (route.kind === 'status') {
    app.innerHTML = Status.render();
    document.title = Status.title();
    setMeta(tx({ de: 'Live-Status von Vibey Multiplayer: Relay, gehostete Welten und verbundene Spieler.', en: 'Live status of Vibey Multiplayer: relay, hosted worlds and connected players.' }));
    Status.mount(app, mods, signal);
  } else if (route.kind === 'client') {
    app.innerHTML = Client.render();
    document.title = Client.title();
    setMeta(tx({ de: 'Vibey Client: Cosmetics, Emotes und Freunde für Minecraft, alles kostenlos. Alle Cosmetics in 3D am Spieler ansehen.', en: 'Vibey Client: cosmetics, emotes and friends for Minecraft, all free. See every cosmetic in 3D on the player.' }));
    Client.mount(app, signal).catch(console.error);
  } else if (route.kind === 'launcher') {
    app.innerHTML = Launcher.render(mods);
    document.title = Launcher.title();
    setMeta(tx({ de: 'Vibe Launcher: der Minecraft-Launcher von Vibe Craft Studios für Windows, mit Instanzen, Mods, Modpacks und Skins.', en: 'Vibe Launcher: the Minecraft launcher for Windows by Vibe Craft Studios, with instances, mods, modpacks and skins.' }));
    Launcher.mount(app, mods, signal).catch(console.error);
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

// Topbar: Start, ein Mods-Menü (Reihen und eigenständige Mods mit Icon) sowie Downloads und Status.
// So bleibt die Leiste gleich lang, egal wie viele Mods dazukommen.
const ROLE = { core: { de: 'Hauptmod', en: 'Core mod' }, addon: { de: 'Addon', en: 'Addon' } };

function modsPanel() {
  const groups = [];
  for (const m of mods) {
    const key = m.series || '';
    let g = groups.find((x) => x.key === key);
    if (!g) groups.push(g = { key, items: [] });
    g.items.push(m);
  }
  groups.sort((a, b) => (a.key ? 0 : 1) - (b.key ? 0 : 1));
  const item = (m) => `<a class="mp-item" href="${m.path}" data-link style="--accent:${m.accent}">
      <span class="px-icon" data-src="${m.base}/${m.icon || 'icon.png'}"></span>
      <span class="mp-text"><b>${esc(m.name)}</b><small>${t(ROLE[m.role] || { de: 'Mod', en: 'Mod' })} · ${t(m.status)}</small></span></a>`;
  const head = (g) => g.key ? t({ de: `${g.key}-Reihe`, en: `${g.key} series` }) : t({ de: 'Eigenständig', en: 'Standalone' });
  return `<div class="mods-panel-inner">${groups.map((g) => `<div class="mp-group${g.items.length > 2 ? ' wide' : ''}">
      <p class="mp-head mono">${head(g)}</p><div class="mp-list">${g.items.map(item).join('')}</div></div>`).join('')}
    <div class="mp-group mp-side"><p class="mp-head mono">${t({ de: 'Mehr', en: 'More' })}</p>
      <a class="mp-link" href="/launcher/" data-link>Vibe Launcher <span>→</span></a>
      <a class="mp-link" href="/client/" data-link>Vibey Client <span>→</span></a>
      <a class="mp-link" href="/downloads/" data-link>${t({ de: 'Download-Center', en: 'Download center' })} <span>→</span></a>
      <a class="mp-link" href="/status/" data-link>${t({ de: 'Vibey-Status', en: 'Vibey status' })} <span>→</span></a>
      <a class="mp-link" href="https://github.com/vibec-studios" target="_blank" rel="noopener">GitHub <span>↗</span></a></div></div>`;
}

let menuHover = 0;
function openModsMenu(open, focus = false) {
  const btn = $('.nav-menu-btn');
  const panel = $('.mods-panel');
  if (!btn || !panel) return;
  btn.setAttribute('aria-expanded', String(open));
  panel.classList.toggle('open', open);
  panel.toggleAttribute('inert', !open);
  if (open && focus) $('.mp-item', panel)?.focus({ preventScroll: true });
}
function closeModsMenu() { openModsMenu(false); }

function buildNav() {
  const links = $('.nav-links');
  links.innerHTML = `<a href="/" data-link>${t({ de: 'Start', en: 'Home' })}</a>` +
    `<button class="nav-menu-btn" type="button" aria-expanded="false" aria-controls="mods-panel">Mods <span class="caret" aria-hidden="true"></span></button>` +
    `<a href="/launcher/" data-link>Launcher</a><a href="/downloads/" data-link>Downloads</a><a href="/status/" data-link>Status</a>`;
  let panel = $('.mods-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.className = 'mods-panel';
    panel.id = 'mods-panel';
    $('header.nav').append(panel);
  }
  panel.innerHTML = modsPanel();
  panel.setAttribute('inert', '');
  animateIcons(panel);
  const btn = $('.nav-menu-btn');
  btn.addEventListener('click', (e) => {
    if (performance.now() - menuHover < 450) return; // gerade per Maus geöffnet: der Klick schließt nicht gleich wieder
    openModsMenu(btn.getAttribute('aria-expanded') !== 'true', e.detail === 0);
  });
  // Maus: öffnen beim Drüberfahren, schließen kurz nach dem Verlassen von Knopf und Menü
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let timer = 0;
    const enter = () => {
      clearTimeout(timer);
      if (btn.getAttribute('aria-expanded') !== 'true') { menuHover = performance.now(); openModsMenu(true); }
    };
    const leave = () => { clearTimeout(timer); timer = setTimeout(closeModsMenu, 220); };
    for (const el of [btn, panel]) { el.addEventListener('mouseenter', enter); el.addEventListener('mouseleave', leave); }
  }
  const foot = $('.foot-mods');
  if (foot) foot.innerHTML = mods.map((m) => `<a href="${m.path}" data-link>${esc(m.name)}</a>`).join('');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && $('.mods-panel.open')) { closeModsMenu(); $('.nav-menu-btn')?.focus(); }
});
document.addEventListener('pointerdown', (e) => {
  if ($('.mods-panel.open') && !e.target.closest('.mods-panel, .nav-menu-btn')) closeModsMenu();
});

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
