// Mod-Seite: kurze Vorstellungsseite aus der Inhaltsdatei (js/content/<id>.js). Details wie Werte, Befehle und
// Einstellungen bleiben bewusst draußen; gezeigt wird, was die Mod ausmacht.
import { $, $$, t, tx, esc, short, onColor, pixelURL, openLightbox, animateIcons } from '../core.js';
import { stageScene, bossViewer } from '../views.js';
import { heldItem } from '../items.js';

const L = (de, en) => ({ de, en });
const hex = (c) => parseInt(String(c).slice(1), 16);

function icon(base, path, cls = '') {
  if (!path) return '';
  return `<span class="px-icon ${cls}" data-src="${base}/${path}"></span>`;
}

function itemRow(base, items) {
  return `<ul class="item-row">${items.map((it) => `<li>${icon(base, `item/${it.tex}.png`)}<span>${t(it.name)}</span></li>`).join('')}</ul>`;
}

function weaponOf(group) {
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
    return `<div class="tiles">${s.items.slice(0, 9).map((a) => `<article class="tile">
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
      <div class="world-tex" style="background-image:${pixelURL(b.colors, 16, 31 + i * 7)}"></div>
      <h3>${t(b.name)}</h3><p>${t(short(b.desc, 1))}</p></article>`).join('')}</div>`;
  },
  gallery(s, mod) {
    return `<div class="gallery">${s.items.slice(0, 7).map((g, i) => `<figure class="shot${i === 0 ? ' wide' : ''}">
      <button type="button" data-shot="${i}"><img src="${mod.base}/${g.img}" alt="${esc(tx(g.name))}" loading="lazy"></button>
      <figcaption>${t(g.name)}</figcaption></figure>`).join('')}</div>`;
  },
};

const SHOWN = new Set(Object.keys(R));
const LABEL = {
  versus: L('Rüstung', 'Armor'), armor: L('Rüstung', 'Armor'), abilities: L('Fähigkeiten', 'Abilities'),
  boss: L('Bosse', 'Bosses'), world: L('Welt', 'World'), gallery: L('Bauwerke', 'Structures'),
};

// ------------------------------------------------------------ Seite

export function title(mod) { return `${mod.name} · Vibe Craft Studios`; }

export function render(mod) {
  const sections = mod.sections.filter((s) => SHOWN.has(s.type));
  const install = mod.sections.find((s) => s.type === 'install');
  const accent = mod.accent, accent2 = mod.accent2 || mod.accent;
  const meta = [mod.status && t(mod.status), mod.version && `v${esc(mod.version)}`, `Minecraft ${esc(mod.mc || '1.21.11')}`, esc(mod.loader || 'Fabric')].filter(Boolean);
  const cta = [
    mod.download ? `<a class="btn primary" href="${mod.download}" target="_blank" rel="noopener">↓ ${t(L('Herunterladen', 'Download'))}</a>` : '',
    `<a class="btn ${mod.download ? 'ghost' : 'primary'}" href="#${sections[0]?.id || ''}" data-anchor>${t(L('Ansehen', 'Take a look'))}</a>`,
    mod.source ? `<a class="btn ghost" href="${mod.source}" target="_blank" rel="noopener">GitHub</a>` : '',
  ].join('');

  const hero = `<section class="hero mod-hero">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <a class="back mono" href="/" data-link>← ${t(L('Alle Mods', 'All mods'))}</a>
        <h1 class="display">${esc(mod.name)}</h1>
        <p class="lead strong">${t(mod.tagline)}</p>
        <p class="lead">${t(short(mod.intro, 2))}</p>
        <div class="cta">${cta}</div>
        <p class="note mono">${meta.join(' <i>·</i> ')}</p>
      </div>
      <div class="hero-art"><canvas class="hero-canvas" aria-hidden="true"></canvas></div>
    </div>
  </section>
  <section class="band">
    <div class="wrap highlight-row">${(mod.highlights || []).slice(0, 4).map((h, i) => `<div><span class="mono">0${i + 1}</span><p>${t(h)}</p></div>`).join('')}</div>
  </section>`;

  const toc = sections.map((s) => `<a href="#${s.id}" data-anchor>${t(LABEL[s.type] || s.title)}</a>`).join('');
  const body = sections.map((s, i) => `<section class="section sec-${s.type}" id="${s.id}">
    <div class="wrap">
      <header class="sec-head" data-reveal>
        <p class="eyebrow">${String(i + 1).padStart(2, '0')} · ${t(LABEL[s.type] || s.title)}</p>
        <h2 class="display sm">${t(s.title)}</h2>
        ${s.lead ? `<p class="lead">${t(short(s.lead, 2))}</p>` : ''}
      </header>
      <div data-reveal>${R[s.type](s, mod)}</div>
    </div></section>`).join('');

  const reqs = [`Minecraft ${esc(mod.mc || '1.21.11')}`, `${esc(mod.loader || 'Fabric')} Loader`, ...(mod.requires || []).map(esc)];
  const outro = `<section class="section outro" id="${install?.id || 'download'}">
    <div class="wrap outro-grid" data-reveal>
      <div>
        <p class="eyebrow">${t(L('Los geht’s', 'Get started'))}</p>
        <h2 class="display sm">${mod.download ? t(L('Bereit für den Kampf?', 'Ready to fight?')) : t(L('Bald spielbar.', 'Coming soon.'))}</h2>
        <p class="lead">${mod.download
          ? t(L('Mod herunterladen, in den <code>mods</code>-Ordner legen, Minecraft mit Fabric starten. Fertig.', 'Download the mod, drop it into your <code>mods</code> folder, start Minecraft with Fabric. Done.'))
          : t(L('Noch kein öffentlicher Download. Folge dem Studio auf GitHub, dann verpasst du den Start nicht.', 'No public download yet. Follow the studio on GitHub so you don’t miss the launch.'))}</p>
        <div class="cta">${mod.download ? `<a class="btn primary" href="${mod.download}" target="_blank" rel="noopener">↓ ${t(L('Herunterladen', 'Download'))}</a>` : `<a class="btn primary" href="https://github.com/vibec-studios" target="_blank" rel="noopener">${t(L('Studio auf GitHub', 'Studio on GitHub'))}</a>`}</div>
      </div>
      <ul class="req mono">${reqs.map((r) => `<li>${r}</li>`).join('')}</ul>
    </div>
  </section>`;

  return `<div class="mod-page" style="--accent:${accent};--accent2:${accent2};--on-accent:${onColor(accent)}">
    ${hero}<nav class="toc" aria-label="${esc(tx(L('Inhalt', 'Contents')))}"><div class="wrap toc-inner">${toc}<a href="#${install?.id || 'download'}" data-anchor class="toc-cta">${mod.download ? t(L('Download', 'Download')) : t(L('Status', 'Status'))}</a></div></nav>${body}${outro}</div>`;
}

function figureFor(mod, group, i, extra = {}) {
  const set = group.armor || extra.armor;
  const weapon = weaponOf(group);
  return { base: mod.base, armor: set, eye: group.color || mod.accent2 || mod.accent, held: weapon ? heldItem(mod, weapon) : null, stance: i, ...extra };
}

export async function mount(root, mod, signal) {
  const base = mod.base;
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

  // Galerie
  $$('.sec-gallery', root).forEach((secEl) => {
    const s = mod.sections.find((x) => x.id === secEl.id);
    $$('[data-shot]', secEl).forEach((b) => b.addEventListener('click', () => {
      const g = s.items[+b.dataset.shot];
      openLightbox(`${base}/${g.img}`, `<b>${t(g.name)}</b> · ${t(short(g.desc, 1))}`);
    }, { signal }));
  });

  // Hero: die Rüstung(en) der Mod
  const heroCanvas = $('.hero-canvas', root);
  const armorSec = mod.sections.find((s) => s.type === 'versus' || s.type === 'armor');
  let figures = [];
  if (armorSec?.type === 'versus') figures = armorSec.sides.map((side, i) => figureFor(mod, side, i, { armor: side.armor || side.name.toLowerCase(), glow: hex(side.color), stance: i ? 1 : 0 }));
  else if (armorSec?.armor) figures = [figureFor(mod, armorSec, 0, { stance: 1 })];
  if (figures.length) stageScene(heroCanvas, { figures, glow: accent, yaw: figures.length > 1 ? 0 : 0.3, zoom: figures.length > 1 ? 1.3 : 1.45, signal }).catch(console.error);
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
