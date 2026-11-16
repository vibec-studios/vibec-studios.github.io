// Mod-Seite: rendert eine Mod vollständig aus ihrer Inhaltsdatei (js/content/<id>.js).
import { $, $$, t, tx, esc, pixelURL, tipFor, openLightbox, lang } from '../core.js';
import { heroScene, itemShowcase, bossViewer } from '../views.js';

const L = (de, en) => ({ de, en });

function badges(mod) {
  const list = [
    mod.version && `v${esc(mod.version)}`,
    `Minecraft ${esc(mod.mc || '1.21.11')}`,
    esc(mod.loader || 'Fabric'),
    mod.status && t(mod.status),
  ].filter(Boolean);
  return `<ul class="badges">${list.map((b) => `<li>${b}</li>`).join('')}</ul>`;
}

function iconHTML(base, path, frames, cls = '') {
  if (!path) return '';
  const f = frames || 1;
  return `<span class="px-icon ${f > 1 ? 'frames' + f : ''} ${cls}" style="background-image:url(${base}/${path})"></span>`;
}

function itemTooltip(item, color) {
  const lines = (item.lore || []).map((l) => `<div class="${l.set ? 'mc-blue' : 'mc-gray'}">${t(l)}</div>`).join('');
  return `<div class="tt-name" style="color:${color}">${t(item.name)}</div>${lines}`;
}

function inventory(base, items) {
  return `<div class="inventory">${items.map((it, i) => `<button type="button" class="slot" data-item="${i}" aria-label="${esc(tx(it.name))}">${iconHTML(base, `item/${it.tex}.png`, it.frames, 'icon')}</button>`).join('')}</div>`;
}

// ------------------------------------------------------------ Abschnitte

const R = {
  versus(s, mod) {
    return `<div class="sides">${s.sides.map((side, i) => `
      ${i === 1 ? '<div class="versus" aria-hidden="true">VS</div>' : ''}
      <article class="side ${side.tone || ''}" style="--side:${side.color}" data-side="${i}">
        <header><h3>${esc(side.name)}</h3><p>${t(side.desc)}</p></header>
        <canvas class="item-canvas" data-showcase="${i}"></canvas>
        ${inventory(mod.base, side.items)}
      </article>`).join('')}</div>
      ${s.bonus ? `<div class="set-bonus mc-panel"><p>${t(s.bonus)}</p></div>` : ''}`;
  },
  armor(s, mod) {
    return `<div class="armor-block">
      <canvas class="item-canvas tall" data-showcase="0"></canvas>
      <div>${inventory(mod.base, s.items)}
        <p class="hint">${t(L('Fahr über einen Slot oder tippe darauf, um den Tooltip zu sehen.', 'Hover or tap a slot to see its tooltip.'))}</p>
      </div></div>
      <div class="lore-list">${s.items.map((it) => `<article class="lore-card">
        ${iconHTML(mod.base, `item/${it.tex}.png`, it.frames)}
        <div><h4 style="color:${mod.accent2 || mod.accent}">${t(it.name)}</h4>
        <ul>${(it.lore || []).map((l) => `<li class="${l.set ? 'set' : ''}">${t(l)}</li>`).join('')}</ul></div></article>`).join('')}</div>`;
  },
  abilities(s, mod) {
    return `<div class="ability-grid">${s.items.map((a) => `<article class="ability">
      <header>${a.icon ? iconHTML(mod.base, a.icon, a.frames) : ''}<div><h4>${t(a.name)}</h4>${a.key ? `<span class="key">${t(a.key)}</span>` : ''}</div></header>
      <p>${t(a.desc)}</p>
      ${a.stats?.length ? `<dl class="stats">${a.stats.map((x) => `<div><dt>${t(x.k)}</dt><dd>${t(x.v)}</dd></div>`).join('')}</dl>` : ''}
    </article>`).join('')}</div>`;
  },
  path(s, mod) {
    return `<ol class="adv-tree">${s.items.map((a) => `<li class="adv" data-color="${a.color || 'gold'}">
      <span class="adv-icon">${iconHTML(mod.base, a.icon, a.frames)}</span>
      <span class="adv-title">${t(a.title)}</span><span class="adv-desc">${t(a.desc)}</span></li>`).join('')}</ol>`;
  },
  steps(s) {
    return `<ol class="steps">${s.items.map((x, i) => `<li><span class="step-n">${i + 1}</span><p>${t(x)}</p></li>`).join('')}</ol>`;
  },
  recipes(s, mod) {
    return `<div class="recipes">${s.items.map((r) => {
      const keys = Object.keys(r.legend);
      const cells = r.grid.join('').split('').map((k) => `<span class="slot cslot">${k.trim() ? `<b>${esc(k)}</b>` : ''}</span>`).join('');
      return `<article class="recipe mc-panel">
        <h4>${t(r.name)}</h4>
        <div class="craft"><div class="craft-grid">${cells}</div><span class="arrow" aria-hidden="true">➜</span>
        <span class="slot result">${iconHTML(mod.base, r.result, r.resultFrames, 'icon')}</span></div>
        <ul class="legend">${keys.map((k) => `<li><b>${esc(k)}</b> ${t(r.legend[k])}</li>`).join('')}</ul></article>`;
    }).join('')}</div>`;
  },
  boss(s) {
    return `<div class="viewer" data-viewer>
      <div class="stage">
        <div class="bossbar"><div class="bb-name"></div><div class="bb-bar"></div></div>
        <canvas aria-label="3D"></canvas>
        <div class="stage-loading">${t(L('Lade Modelle …', 'Loading models …'))}</div>
        <div class="stage-tools">
          <button class="mc-btn small btn-rotate" aria-pressed="true">${t(L('Drehen', 'Spin'))}</button>
          <button class="mc-btn small btn-reset">${t(L('Ansicht', 'Reset view'))}</button>
        </div>
        <div class="stage-hint">${t(L('Ziehen: drehen · Scrollen: zoomen', 'Drag: rotate · Scroll: zoom'))}</div>
      </div>
      <aside class="tooltip boss-info" aria-live="polite"></aside>
      <div class="hotbar" role="tablist"></div>
    </div>`;
  },
  world(s) {
    return `<div class="biomes">${s.cards.map((b, i) => `<article class="biome">
      <div class="biome-tex" style="background-image:${pixelURL(b.colors, 16, 31 + i * 7)}"></div>
      <div class="biome-body"><h4>${t(b.name)}</h4><p>${t(b.desc)}</p></div></article>`).join('')}</div>`;
  },
  gallery(s, mod) {
    return `<div class="gallery">${s.items.map((g, i) => `<figure class="shot${i === 0 ? ' wide' : ''}">
      <button type="button" data-shot="${i}"><img src="${mod.base}/${g.img}" alt="${esc(tx(g.name))}" loading="lazy"></button>
      <figcaption><b>${t(g.name)}</b><span>${t(g.desc)}</span></figcaption></figure>`).join('')}</div>`;
  },
  features(s, mod) {
    return `<div class="feature-grid">${s.items.map((f) => `<article class="feature mc-panel">
      ${iconHTML(mod.base, f.icon, f.frames)}<h4>${t(f.name)}</h4><p>${t(f.desc)}</p></article>`).join('')}</div>`;
  },
  list(s) {
    return `<ul class="check-list">${s.items.map((x) => `<li>${t(x)}</li>`).join('')}</ul>`;
  },
  text(s) {
    return `<div class="prose mc-panel dark">${t(s.body)}</div>`;
  },
  commands(s) {
    return `<div class="chat">${s.items.map((c) => `<div class="chat-line"><code>${esc(c.cmd)}</code> <span>${t(c.desc)}</span></div>`).join('')}
      <div class="chat-input">&gt; <span class="caret">_</span></div></div>`;
  },
  config(s) {
    return `<div class="table-wrap"><table class="cfg"><thead><tr><th>${t(L('Schlüssel', 'Key'))}</th><th>${t(L('Standard', 'Default'))}</th><th>${t(L('Bedeutung', 'Meaning'))}</th></tr></thead>
      <tbody>${s.rows.map((r) => `<tr><td><code>${esc(r.key)}</code></td><td>${esc(r.def)}</td><td>${t(r.desc)}</td></tr>`).join('')}</tbody></table></div>`;
  },
  install(s, mod) {
    return `<div class="install-grid"><div class="toasts">${s.steps.map((x, i) => `<div class="toast">
      <span class="toast-num">${i + 1}</span><span class="toast-text"><b>${t(L('Schritt', 'Step'))} ${i + 1}</b><span>${t(x)}</span></span></div>`).join('')}</div>
      <div class="req mc-panel dark"><h4>${t(L('Voraussetzungen', 'Requirements'))}</h4>
      <ul>${[`Minecraft ${esc(mod.mc || '1.21.11')}`, esc(mod.loader || 'Fabric') + ' Loader', ...(mod.requires || []).map(esc)].map((r) => `<li>${r}</li>`).join('')}</ul>
      ${mod.download ? `<a class="mc-btn big wide" href="${mod.download}" target="_blank" rel="noopener">${t(L('Zu den Downloads', 'Go to downloads'))}</a>` : `<p class="mc-gray">${t(L('Noch kein öffentlicher Download. Folge dem Studio auf GitHub, um nichts zu verpassen.', 'No public download yet. Follow the studio on GitHub so you don\'t miss it.'))}</p>`}
      </div></div>`;
  },
};

// ------------------------------------------------------------ Seite

export function title(mod) { return `${mod.name} · Vibe Craft Studios`; }

export function render(mod) {
  const sections = mod.sections.filter((s) => R[s.type]);
  const toc = sections.map((s, i) => `<a href="#${s.id || 's' + i}" data-anchor>${t(s.title)}</a>`).join('');
  const hero = `<section class="mod-hero" style="--accent:${mod.accent};--accent2:${mod.accent2 || mod.accent}">
    <div class="mod-hero-sky" aria-hidden="true"></div>
    <div class="hero-grid">
      <div class="hero-text">
        <a class="back" href="/" data-link>← ${t(L('Alle Mods', 'All mods'))}</a>
        <h1 class="mod-logo" data-text="${esc(mod.name)}">${esc(mod.name)}</h1>
        <p class="tagline">${t(mod.tagline)}</p>
        <p class="intro">${t(mod.intro)}</p>
        ${badges(mod)}
        <div class="cta">
          ${mod.download ? `<a class="mc-btn big" href="${mod.download}" target="_blank" rel="noopener">${t(L('Herunterladen', 'Download'))}</a>` : ''}
          ${mod.source ? `<a class="mc-btn big" href="${mod.source}" target="_blank" rel="noopener">GitHub</a>` : ''}
          <a class="mc-btn big" href="#${sections[0]?.id || 's0'}" data-anchor>${t(L('Alles ansehen', 'See everything'))}</a>
        </div>
      </div>
      <div class="hero-stage"><canvas class="hero-canvas" aria-hidden="true"></canvas></div>
    </div>
  </section>`;
  const body = sections.map((s, i) => `<section class="section sec-${s.type}" id="${s.id || 's' + i}" data-reveal>
    <div class="wrap"><h2 class="sec-title">${t(s.title)}</h2>${s.lead ? `<p class="sec-lead">${t(s.lead)}</p>` : ''}${R[s.type](s, mod)}</div></section>`).join('');
  return `<div class="mod-page" style="--accent:${mod.accent};--accent2:${mod.accent2 || mod.accent}">
    ${hero}<nav class="toc" aria-label="${esc(tx(L('Inhalt', 'Contents')))}"><div class="toc-inner">${toc}</div></nav>${body}</div>`;
}

export async function mount(root, mod, signal) {
  const base = mod.base;
  // Tooltips im Inventar
  const itemsOf = (s) => (s.type === 'versus' ? s.sides : [s]);
  $$('.sec-versus, .sec-armor', root).forEach((secEl) => {
    const s = mod.sections.find((x) => (x.id || '') === secEl.id) || mod.sections.find((x) => x.type === (secEl.classList.contains('sec-versus') ? 'versus' : 'armor'));
    const groups = itemsOf(s);
    $$('.inventory', secEl).forEach((inv, gi) => {
      const g = groups[gi];
      $$('.slot', inv).forEach((slot) => {
        const it = g.items[+slot.dataset.item];
        tipFor(slot, () => itemTooltip(it, g.color || mod.accent2 || mod.accent), signal);
      });
    });
    $$('canvas[data-showcase]', secEl).forEach((c) => {
      const g = groups[+c.dataset.showcase];
      const urls = (g.showcase || g.items.slice(0, 3).map((x) => x.tex)).map((n) => `${base}/item/${n}.png`);
      itemShowcase(c, urls, g.particle || parseInt((g.color || mod.accent).slice(1), 16)).catch(console.error);
    });
  });
  // Galerie
  $$('.sec-gallery', root).forEach((secEl) => {
    const s = mod.sections.find((x) => x.id === secEl.id);
    $$('[data-shot]', secEl).forEach((b) => b.addEventListener('click', () => {
      const g = s.items[+b.dataset.shot];
      openLightbox(`${base}/${g.img}`, `<b>${t(g.name)}</b> · ${t(g.desc)}`);
    }, { signal }));
  });
  // Hero
  const heroCanvas = $('.hero-canvas', root);
  const h = mod.hero || {};
  const zone = (hex) => ({ side: shadesOf(hex, 0.55), top: shadesOf(hex, 0.75), edge: hex });
  if (h.kind === 'duo') {
    heroScene(heroCanvas, {
      figures: [
        { base, armor: 'heaven', eye: '#ffd75e', sword: `${base}/item/heavens_sword.png` },
        { base, armor: 'hell', eye: '#39d5ff', sword: `${base}/item/hells_sword.png` },
      ],
      zones: [{ side: ['#ece8df', '#e2ddd2', '#f4f1ea', '#d8d2c6'], top: ['#ece8df', '#f4f1ea', '#f1c94e', '#e2ddd2'], edge: '#e5b93d' },
        { side: ['#2b2630', '#25212a', '#312b36', '#1f1b23'], top: ['#2b2630', '#25212a', '#312b36', '#2fbfe8'], edge: '#1f8fbf' }],
      glow: [0xffd36a, 0x3fd8ff], signal,
    }).catch(console.error);
  } else if (h.kind === 'boss') {
    heroScene(heroCanvas, { boss: { base, model: h.model, texture: h.texture, scale: h.scale }, zones: [zone(mod.accent)], glow: [parseInt(mod.accent2.slice(1), 16)], signal }).catch(console.error);
  } else if (h.kind === 'armor') {
    heroScene(heroCanvas, { figures: [{ base, armor: h.armor, eye: mod.accent2 || mod.accent, sword: h.sword ? `${base}/item/${h.sword}.png` : null }], zones: [zone(mod.accent)], glow: [parseInt((mod.accent2 || mod.accent).slice(1), 16)], signal }).catch(console.error);
  }
  // Bestiarium
  $$('[data-viewer]', root).forEach((el) => {
    const s = mod.sections.find((x) => x.id === el.closest('section').id);
    const start = () => bossViewer(el, base, s.bosses, signal).catch(console.error);
    if (location.hash.startsWith('#boss-')) start();
    else {
      const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { io.disconnect(); start(); } }, { rootMargin: '600px' });
      io.observe(el);
      signal.addEventListener('abort', () => io.disconnect());
    }
  });
}

function shadesOf(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const c = (f) => `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`;
  return [c(k * 0.8), c(k * 0.7), c(k * 0.9), c(k * 0.6), c(k * 0.75)];
}
