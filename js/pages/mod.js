// Mod-Seite: kurze Vorstellungsseite aus der Inhaltsdatei (js/content/<id>.js). Details wie Werte, Befehle und
// Einstellungen bleiben bewusst draußen; gezeigt wird, was die Mod ausmacht.
import { $, $$, t, tx, esc, short, onColor, openLightbox, animateIcons } from '../core.js';
import { stageScene, bossViewer, linkStage, lyricsStage } from '../views.js';
import { heldItem } from '../items.js';
import { latestRelease } from '../downloads.js';
import { fetchStatus, POLL_MS } from '../status-api.js';

const L = (de, en) => ({ de, en });
const hex = (c) => parseInt(String(c).slice(1), 16);
// Neuere der beiden Versionen: Inhaltsdatei (Stand der Seite) oder letztes GitHub-Release.
const parts = (v) => String(v).split(/[.-]/).map((n) => parseInt(n, 10) || 0);
function newer(a, b) {
  if (!a || !b) return a || b;
  const x = parts(a), y = parts(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0) ? a : b;
  return a;
}

function icon(base, path, cls = '') {
  if (!path) return '';
  return `<span class="px-icon ${cls}" data-src="${base}/${path}"></span>`;
}

function itemRow(base, items) {
  return `<ul class="item-row">${items.map((it) => `<li>${icon(base, `item/${it.tex}.png`)}<span>${t(it.name)}</span></li>`).join('')}</ul>`;
}

function weaponOf(group) {
  if (group.weapon) return group.weapon;
  const names = [...(group.showcase || []), ...(group.items || []).map((i) => i.tex)];
  return names.find((n) => /sword|blade|scythe|klinge/.test(n)) || names.find((n) => /mace/.test(n)) || null;
}

// ------------------------------------------------------------ Abschnitte (nur was eine Vorstellungsseite braucht)

const R = {
  versus(s, mod) {
    return `<div class="duo">${s.sides.map((side, i) => `
      <article class="duo-card" style="--side:${side.color}">
        <div class="duo-stage"><canvas data-figure="${i}" aria-hidden="true"></canvas></div>
        <div class="duo-copy">
          <p class="eyebrow">${esc(side.name)}</p>
          <p class="duo-desc">${t(short(side.desc, 1))}</p>
          ${itemRow(mod.base, side.items)}
        </div>
      </article>`).join('')}</div>`;
  },
  armor(s, mod) {
    return `<div class="armor-split">
      <div class="armor-stage"><canvas data-figure="0" aria-hidden="true"></canvas></div>
      <div class="armor-copy">${itemRow(mod.base, s.items)}</div>
    </div>`;
  },
  abilities(s, mod) {
    const n = Math.min(s.items.length, 9);
    return `<div class="tiles${n === 4 ? ' four' : ''}">${s.items.slice(0, 9).map((a) => `<article class="tile">
      ${a.icon ? icon(mod.base, a.icon, 'tile-icon') : ''}
      <h3>${t(a.name)}</h3>
      <p>${t(short(a.desc, 1))}</p>
    </article>`).join('')}</div>`;
  },
  boss() {
    return `<div class="viewer" data-viewer>
      <div class="stage">
        <div class="bossbar"><div class="bb-name"></div><div class="bb-bar"></div></div>
        <canvas aria-label="3D"></canvas>
        <div class="stage-loading">${t(L('Lade Modell …', 'Loading model …'))}</div>
        <div class="stage-tools">
          <button class="icon-btn btn-rotate" aria-pressed="true" title="${esc(tx(L('Drehen', 'Spin')))}">⟳</button>
          <button class="icon-btn btn-reset" title="${esc(tx(L('Ansicht zurücksetzen', 'Reset view')))}">⌖</button>
        </div>
        <div class="stage-hint">${t(L('Ziehen zum Drehen · Strg + Mausrad zum Zoomen', 'Drag to rotate · Ctrl + wheel to zoom'))}</div>
      </div>
      <aside class="boss-info" aria-live="polite"></aside>
      <div class="hotbar" role="tablist"></div>
    </div>`;
  },
  world(s) {
    return `<div class="tiles worlds">${s.cards.map((b, i) => `<article class="tile world">
      <h3>${t(b.name)}</h3><p>${t(short(b.desc, 1))}</p></article>`).join('')}</div>`;
  },
  flow(s) {
    return `<ol class="flow">${s.items.map((f, i) => `<li class="flow-step">
      <span class="flow-num">${String(i + 1).padStart(2, '0')}</span>
      <h3>${t(f.title)}</h3><p>${t(f.desc)}</p></li>`).join('')}</ol>`;
  },
  gallery(s, mod) {
    // Vier Bilder als 2 × 2, sonst ein großes Bild vorn
    const items = s.items.slice(0, 9);
    const even = items.length === 4 || items.length === 2;
    return `<div class="gallery${even ? ' two' : ''}">${items.map((g, i) => `<figure class="shot${i === 0 && !even ? ' wide' : ''}">
      <button type="button" data-shot="${i}"><img src="${mod.base}/${g.img}" alt="${esc(tx(g.name))}" loading="lazy"></button>
      <figcaption>${t(g.name)}</figcaption></figure>`).join('')}</div>`;
  },
  leaks(s, mod) {
    // Viele echte Aufnahmen in Gruppen: Vorschaubilder (thumb/) im Raster, die Lightbox blättert durch alle
    let k = 0;
    return `${s.badge ? `<p class="pill leak-badge"><i aria-hidden="true"></i>${t(s.badge)}</p>` : ''}${s.groups.map((g) => `<div class="leak-group">
      <h3 class="leak-h">${t(g.name)}<i class="leak-n">${g.items.length}</i></h3>
      <div class="leak-grid">${g.items.map((it) => `<figure class="shot leak">
        <button type="button" data-leak="${k++}"><img src="${mod.base}/${s.dir}/thumb/${it.img}.webp" alt="${esc(tx(it.name))}" loading="lazy" width="640" height="283">${it.old ? `<span class="pill warn leak-old">${t(s.oldLabel || L('Frühere Version', 'Earlier version'))}</span>` : ''}</button>
        <figcaption>${t(it.name)}</figcaption></figure>`).join('')}</div></div>`).join('')}`;
  },
  changes(s, mod) {
    // Changelog einer Version: Gruppen als Flächen mit Punktliste (Text darf <code> enthalten, kommt nur aus der Inhaltsdatei)
    return `<div class="changes">${s.groups.map((g) => `<article class="change-group">
      <h3>${t(g.name)}</h3>
      <ul class="ticks">${g.items.map((it) => `<li>${t(it)}</li>`).join('')}</ul></article>`).join('')}</div>
      ${s.version ? `<p class="small changes-note">${t(L(`Alle Änderungen im <a href="${mod.source}/releases/tag/v${s.version}" target="_blank" rel="noopener">Release v${s.version}</a> auf GitHub.`, `Full list in the <a href="${mod.source}/releases/tag/v${s.version}" target="_blank" rel="noopener">v${s.version} release</a> on GitHub.`))}</p>` : ''}`;
  },
  video(s, mod) {
    // Trailer: lädt erst beim Abspielen (preload none), WebM zuerst, MP4 als Ausweichquelle
    return `<figure class="video-frame">
      <video controls playsinline preload="none" poster="${mod.base}/${s.poster}" aria-label="${esc(tx(s.label || s.title))}">
        ${s.webm ? `<source src="${mod.base}/${s.webm}" type="video/webm">` : ''}
        ${s.mp4 ? `<source src="${mod.base}/${s.mp4}" type="video/mp4">` : ''}
      </video></figure>${s.credit ? `<p class="video-credit">${t(s.credit)}</p>` : ''}`;
  },
};

const SHOWN = new Set(Object.keys(R));
const LABEL = {
  versus: L('Rüstung', 'Armor'), armor: L('Rüstung', 'Armor'), abilities: L('Fähigkeiten', 'Abilities'), flow: L('So geht’s', 'How it works'),
  boss: L('Bosse', 'Bosses'), world: L('Welt', 'World'), gallery: L('Bauwerke', 'Structures'), video: L('Trailer', 'Trailer'),
  leaks: L('Leaks / Gameplay', 'Leaks / Gameplay'), changes: L('Neu', 'New'),
};

// ------------------------------------------------------------ Seite

/** Hero für Mods ohne 3D-Modell: echter Screenshot im Rahmen, davor die Adresse als Karte. */
function heroShot(mod) {
  const h = mod.hero;
  return `<figure class="hero-shot">
    <div class="hero-shot-frame"><img src="${mod.base}/${h.img}" alt="${esc(tx(mod.tagline))}" width="1280" height="${h.play ? 720 : 800}">
    ${h.play ? `<a class="btn hero-play" href="#${h.play}" data-anchor data-play="${h.play}"><i aria-hidden="true"></i>${t(L('Trailer ansehen', 'Watch the trailer'))}</a>` : ''}</div>
    ${h.address ? `<figcaption class="addr-card"><span class="small">${t(L('Deine Adresse', 'Your address'))}</span><b>${esc(h.address)}</b><span class="addr-copy">${t(L('Kopieren', 'Copy'))}</span></figcaption>` : ''}
  </figure>`;
}

/** Kleiner Live-Hinweis im Hero (Vibey): Relay-Zustand, Welten und Spieler, verlinkt auf die Statusseite. */
function liveStrip(root, signal) {
  const el = $('.live-strip', root);
  if (!el) return;
  let timer = null;
  const poll = async () => {
    let res;
    try { res = await fetchStatus(signal); } catch (e) { return; }
    const d = res.data || {};
    el.dataset.state = res.state;
    $('span', el).innerHTML = res.state === 'ok'
      ? t(L(`Relay betriebsbereit · ${d.worlds ?? 0} ${d.worlds === 1 ? 'Welt' : 'Welten'} · ${d.players ?? 0} Spieler online`, `Relay operational · ${d.worlds ?? 0} ${d.worlds === 1 ? 'world' : 'worlds'} · ${d.players ?? 0} ${d.players === 1 ? 'player' : 'players'} online`))
      : t(L('Relay gestört · Details auf der Statusseite', 'Relay outage · details on the status page'));
    if (!signal.aborted) timer = setTimeout(poll, POLL_MS * 2);
  };
  signal.addEventListener('abort', () => clearTimeout(timer));
  poll();
}

export function title(mod) { return `${mod.name} · Vibe Craft Studios`; }

export function render(mod, dl) {
  // Download nur, wenn es auf GitHub ein Release gibt; dann führt der Knopf ins Download-Center.
  const rel = latestRelease(dl, mod.id);
  const download = rel ? `/downloads/#${mod.id}` : null;
  const dlLink = (cls) => `<a class="btn ${cls}" href="${download}" data-link>↓ ${t(L('Herunterladen', 'Download'))}</a>`;
  const sections = mod.sections.filter((s) => SHOWN.has(s.type));
  const install = mod.sections.find((s) => s.type === 'install');
  const accent = mod.accent, accent2 = mod.accent2 || mod.accent;
  const meta = [mod.status && t(mod.status), newer(rel?.version, mod.version) && `v${esc(newer(rel?.version, mod.version))}`, `Minecraft ${esc(mod.mc || '1.21.11')}`, esc(mod.loader || 'Fabric')].filter(Boolean);
  const cta = [
    download ? dlLink('primary') : '',
    `<a class="btn${download ? '' : ' primary'}" href="#${sections[0]?.id || ''}" data-anchor>${t(L('Ansehen', 'Take a look'))}</a>`,
    mod.source ? `<a class="btn" href="${mod.source}" target="_blank" rel="noopener">GitHub ↗</a>` : '',
  ].join('');

  const hero = `<section class="hero mod-hero">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <a class="back" href="/#projekte" data-link>← ${t(L('Alle Projekte', 'All projects'))}</a>
        <h1 class="display">${esc(mod.name)}</h1>
        <p class="lead strong">${t(mod.tagline)}</p>
        <p class="lead">${t(short(mod.intro, 2))}</p>
        ${(mod.highlights || []).length ? `<ul class="ticks">${mod.highlights.slice(0, 3).map((h) => `<li>${t(h)}</li>`).join('')}</ul>` : ''}
        <div class="cta">${cta}</div>
        <ul class="pills mod-meta">${meta.map((m) => `<li class="pill">${m}</li>`).join('')}</ul>
        ${mod.statusPage ? `<a class="pill live-strip" href="${mod.statusPage}" data-link data-state="wait"><i aria-hidden="true"></i><span>${t(L('Relay wird geprüft …', 'Checking relay …'))}</span><b>→</b></a>` : ''}
      </div>
      <div class="hero-art">${mod.hero?.kind === 'shot' ? heroShot(mod) : '<canvas class="hero-canvas" aria-hidden="true"></canvas>'}</div>
    </div>
  </section>`;

  const toc = sections.map((s) => `<a href="#${s.id}" data-anchor>${t(s.toc || LABEL[s.type] || s.title)}</a>`).join('');
  const body = sections.map((s) => `<section class="section sec-${s.type}" id="${s.id}">
    <div class="wrap">
      <header class="sec-head" data-reveal>
        <h2 class="display sm">${t(s.title)}</h2>
        ${s.lead ? `<p class="lead">${t(short(s.lead, 2))}</p>` : ''}
      </header>
      <div data-reveal>${R[s.type](s, mod)}</div>
    </div></section>`).join('');

  const reqs = [`Minecraft ${esc(mod.mc || '1.21.11')}`, `${esc(mod.loader || 'Fabric')} Loader`, ...(mod.requires || []).map((r) => (typeof r === 'object' ? t(r) : esc(r)))];
  const outro = `<section class="outro" id="${install?.id || 'download'}">
    <div class="wrap"><div class="card outro-grid" data-reveal>
      <div>
        <h2 class="display sm">${download
          ? t(L(`${esc(mod.name)} ${rel ? `v${esc(rel.version)} ` : ''}herunterladen`, `Download ${esc(mod.name)}${rel ? ` v${esc(rel.version)}` : ''}`))
          : t(L(`${esc(mod.name)}: noch kein Release`, `${esc(mod.name)}: no release yet`))}</h2>
        <p class="lead">${download
          ? t(L(`Mod herunterladen, in den <code>mods</code>-Ordner legen, Minecraft mit ${esc(mod.loader || 'Fabric')} starten. Fertig.`, `Download the mod, drop it into your <code>mods</code> folder, start Minecraft with ${esc(mod.loader || 'Fabric')}. Done.`))
          : `${mod.downloadNote ? `${t(mod.downloadNote)} ` : ''}${t(L('Folge dem Projekt auf GitHub, dann verpasst du den Start nicht.', 'Follow the project on GitHub so you don’t miss the launch.'))}`}</p>
        <div class="cta">${download ? `${dlLink('primary')}<a class="btn" href="/downloads/" data-link>${t(L('Download-Center', 'Download center'))}</a>` : `<a class="btn primary" href="${mod.source || 'https://github.com/vibec-studios'}" target="_blank" rel="noopener">${mod.source ? t(L('Zum Repository', 'View repository')) : t(L('Studio auf GitHub', 'Studio on GitHub'))} ↗</a>`}</div>
      </div>
      <ul class="req">${reqs.map((r) => `<li>${r}</li>`).join('')}</ul>
    </div></div>
  </section>`;

  return `<div class="mod-page" style="--accent:${accent};--accent2:${accent2};--on-accent:${onColor(accent)}">
    ${hero}<nav class="toc" aria-label="${esc(tx(L('Inhalt', 'Contents')))}"><div class="wrap toc-inner">${toc}<a href="#${install?.id || 'download'}" data-anchor class="toc-cta">${download ? t(L('Download', 'Download')) : t(L('Verfügbarkeit', 'Availability'))}</a></div></nav>${body}${outro}</div>`;
}

function figureFor(mod, group, i, extra = {}) {
  const set = group.armor || extra.armor;
  const weapon = weaponOf(group);
  return { base: mod.base, armor: set, armor3d: !!group.armor3d, eye: group.color || mod.accent2 || mod.accent, held: weapon ? heldItem(mod, weapon) : null, stance: i, ...extra };
}

export async function mount(root, mod, signal) {
  const base = mod.base;
  liveStrip(root, signal);
  animateIcons(root);
  const accent = hex(mod.accent2 || mod.accent);

  // Rüstung: freigestellte Figuren mit der echten Waffe
  $$('.sec-versus', root).forEach((secEl) => {
    const s = mod.sections.find((x) => x.id === secEl.id);
    $$('canvas[data-figure]', secEl).forEach((c) => {
      const i = +c.dataset.figure;
      const side = s.sides[i];
      const set = side.armor || side.name.toLowerCase();
      stageScene(c, { figures: [figureFor(mod, side, i, { armor: set, stance: i ? 3 : 0 })], glow: hex(side.color), yaw: i ? -0.35 : 0.35, signal }).catch(console.error);
    });
  });
  $$('.sec-armor', root).forEach((secEl) => {
    const s = mod.sections.find((x) => x.id === secEl.id);
    const c = $('canvas[data-figure]', secEl);
    if (c && s.armor) stageScene(c, { figures: [figureFor(mod, s, 0, { stance: 3 })], glow: accent, yaw: 0.4, signal }).catch(console.error);
  });

  // Hero-Knopf „Trailer ansehen“: springt zum Trailer und startet ihn (der Klick zählt als Nutzergeste)
  $$('[data-play]', root).forEach((a) => a.addEventListener('click', () => {
    const v = $(`#${a.dataset.play} video`, root);
    if (v) setTimeout(() => v.play().catch(() => {}), 350);
  }, { signal }));

  // Galerie
  $$('.sec-gallery', root).forEach((secEl) => {
    const s = mod.sections.find((x) => x.id === secEl.id);
    $$('[data-shot]', secEl).forEach((b) => b.addEventListener('click', () => {
      const g = s.items[+b.dataset.shot];
      openLightbox(`${base}/${g.img}`, `<b>${t(g.name)}</b> · ${t(short(g.desc, 1))}`);
    }, { signal }));
  });

  // Leaks: Lightbox mit Blättern durch alle Aufnahmen der Seite
  $$('.sec-leaks', root).forEach((secEl) => {
    const s = mod.sections.find((x) => x.id === secEl.id);
    const list = s.groups.flatMap((g) => g.items.map((it) => ({ src: `${base}/${s.dir}/${it.img}.webp`, caption: `<b>${t(it.name)}</b> · ${t(g.name)}${it.old ? ` · ${t(s.oldLabel || L('Frühere Version', 'Earlier version'))}` : ''}` })));
    $$('[data-leak]', secEl).forEach((b) => b.addEventListener('click', () => {
      const i = +b.dataset.leak;
      openLightbox(list[i].src, list[i].caption, { list, index: i });
    }, { signal }));
  });

  // Hero: die Rüstung(en) der Mod
  const heroCanvas = $('.hero-canvas', root);
  const armorSec = mod.sections.find((s) => s.type === 'versus' || s.type === 'armor');
  let figures = [];
  if (armorSec?.type === 'versus') figures = armorSec.sides.map((side, i) => figureFor(mod, side, i, { armor: side.armor || side.name.toLowerCase(), glow: hex(side.color), stance: i ? 1 : 0 }));
  else if (armorSec?.armor) figures = [figureFor(mod, armorSec, 0, { stance: 1 })];
  if (figures.length) stageScene(heroCanvas, { figures, glow: accent, yaw: figures.length > 1 ? 0 : 0.3, zoom: figures.length > 1 ? 1.3 : 1.45, signal }).catch(console.error);
  else if (mod.hero?.kind === 'lyrics') lyricsStage(heroCanvas, { accent: mod.accent, signal }).catch(console.error);
  else if (mod.hero?.kind === 'link') linkStage(heroCanvas, { glow: hex(mod.accent), cable: hex(mod.accent), signal }).catch(console.error);
  else if (mod.hero?.kind === 'boss') stageScene(heroCanvas, { boss: { base, model: mod.hero.model, texture: mod.hero.texture }, glow: accent, signal }).catch(console.error);

  // Bosse
  $$('[data-viewer]', root).forEach((el) => {
    const s = mod.sections.find((x) => x.id === el.closest('section').id);
    const start = () => bossViewer(el, base, s.bosses, signal, accent).catch(console.error);
    if (location.hash.startsWith('#boss-')) start();
    else {
      const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { io.disconnect(); start(); } }, { rootMargin: '600px' });
      io.observe(el);
      signal.addEventListener('abort', () => io.disconnect());
    }
  });
}
