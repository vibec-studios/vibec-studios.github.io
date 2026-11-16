// Startseite des Studios.
import { $, $$, t, tx, esc } from '../core.js';
import { heroScene, thumbnails } from '../views.js';

const L = (de, en) => ({ de, en });

export const STUDIO = {
  accent: '#b86cff', accent2: '#3fe0c5',
  github: 'https://github.com/vibec-studios',
};

function count(mods) {
  let bosses = 0, models = new Set();
  for (const m of mods) for (const s of m.sections) if (s.type === 'boss') for (const b of s.bosses) {
    bosses += 1;
    if (b.model) models.add(m.id + ':' + b.model);
  }
  return { mods: mods.length, bosses, models: models.size };
}

function cardArt(m) {
  const armorItem = m.sections.find((s) => s.type === 'armor' || s.type === 'versus');
  const items = armorItem ? (armorItem.items || armorItem.sides?.[0]?.items || []) : [];
  const chest = items.find((i) => /chest/.test(i.tex)) || items[0];
  return chest ? `<span class="px-icon big ${chest.frames > 1 ? 'frames' + chest.frames : ''}" style="background-image:url(${m.base}/item/${chest.tex}.png)"></span>` : '';
}

export function render(mods) {
  const c = count(mods);
  const cards = mods.map((m, i) => `<a class="mod-card" href="${m.path}" data-link data-accent="${m.accent}" style="--accent:${m.accent};--accent2:${m.accent2 || m.accent}" data-reveal>
      <div class="card-art">
        <img class="card-thumb" alt="" hidden>
        <span class="card-fallback">${cardArt(m)}</span>
        <span class="card-status">${t(m.status)}</span>
      </div>
      <div class="card-body">
        <h3>${esc(m.name)}</h3>
        <p>${t(m.short)}</p>
        <ul>${(m.highlights || []).slice(0, 4).map((h) => `<li>${t(h)}</li>`).join('')}</ul>
        <span class="mc-btn">${t(L('Zur Mod', 'Open mod'))} ➜</span>
      </div>
    </a>`).join('');

  const addons = mods.filter((m) => m.id !== 'hha');
  return `<div class="home">
  <section class="studio-hero">
    <div class="studio-sky" aria-hidden="true"></div>
    <div class="hero-grid">
      <div class="hero-text">
        <h1 class="studio-logo">
          <span class="row1">VIBE CRAFT</span>
          <span class="row2">STUDIOS</span>
          <span class="splash" id="splash"></span>
        </h1>
        <p class="tagline">${t(L('Wir bauen Minecraft-Mods, die sich wie ein eigenes Spiel anfühlen: Bosskämpfe mit Geschichte, eigene Welten und echte 3D-Effekte.', 'We build Minecraft mods that feel like a game of their own: boss fights with a story, worlds of their own and real 3D effects.'))}</p>
        <div class="cta">
          <a class="mc-btn big" href="#mods" data-anchor>${t(L('Mods entdecken', 'Explore mods'))}</a>
          <a class="mc-btn big" href="${STUDIO.github}" target="_blank" rel="noopener">GitHub</a>
        </div>
        <ul class="badges"><li>Minecraft 1.21.11</li><li>Fabric</li><li>Kotlin</li><li>${t(L('Deutsch & Englisch', 'German & English'))}</li></ul>
      </div>
      <div class="hero-stage"><canvas class="hero-canvas" aria-hidden="true"></canvas></div>
    </div>
    <a class="scroll-hint" href="#mods" data-anchor aria-label="${esc(tx(L('Weiter', 'Next')))}">▼</a>
  </section>

  <section class="section stats-strip" data-reveal>
    <div class="wrap stat-row">
      <div><b data-count="${c.mods}">${c.mods}</b><span>${t(L('Mods', 'Mods'))}</span></div>
      <div><b data-count="${c.bosses}">${c.bosses}</b><span>${t(L('Bosse & Wächter', 'Bosses & guardians'))}</span></div>
      <div><b data-count="${c.models}">${c.models}</b><span>${t(L('eigene 3D-Modelle', 'custom 3D models'))}</span></div>
      <div><b>2</b><span>${t(L('Sprachen, voll vertont', 'languages, fully voiced'))}</span></div>
    </div>
  </section>

  <section class="section mods" id="mods">
    <div class="wrap">
      <h2 class="sec-title">${t(L('Unsere Mods', 'Our mods'))}</h2>
      <p class="sec-lead">${t(L('Jede Mod hat ihre eigene Seite mit allem, was drin ist: Rüstungen, Fähigkeiten mit echten Zahlen, Bosse in 3D, Welten, Befehle und Einstellungen.', 'Every mod has its own page with everything inside: armor, abilities with real numbers, bosses in 3D, worlds, commands and settings.'))}</p>
      <div class="mod-grid">${cards}</div>
    </div>
  </section>

  <section class="section universe" data-reveal>
    <div class="wrap">
      <h2 class="sec-title">${t(L('Ein Universum, viele Seiten', 'One universe, many sides'))}</h2>
      <p class="sec-lead">${t(L('H&H Armors ist das Herz: Sets, Fähigkeiten, Lore, Cooldown-Leiste und Events stehen Addons über eine eigene API offen. So fühlen sich neue Rüstungen an, als wären sie schon immer da gewesen.', 'H&H Armors is the heart: sets, abilities, lore, the cooldown bar and events are open to addons through their own API. That way new armor feels like it has always been there.'))}</p>
      <div class="graph">
        <a class="node core" href="/mods/hha/" data-link style="--accent:#ffd75e"><span class="node-title">H&amp;H Armors</span><span class="node-sub">Core · API</span></a>
        <div class="links" aria-hidden="true">${addons.map(() => '<i></i>').join('')}<i class="dashed"></i></div>
        <div class="addons">
          ${addons.map((m) => `<a class="node" href="${m.path}" data-link style="--accent:${m.accent}"><span class="node-title">${esc(m.name)}</span><span class="node-sub">Addon</span></a>`).join('')}
          <span class="node ghost"><span class="node-title">${t(L('Dein Addon?', 'Your addon?'))}</span><span class="node-sub"><code>hha</code> · <code>hha_client</code></span></span>
        </div>
      </div>
    </div>
  </section>

  <section class="section values" data-reveal>
    <div class="wrap">
      <h2 class="sec-title">${t(L('Woran wir glauben', 'What we believe in'))}</h2>
      <div class="value-grid">
        <article class="mc-panel"><h3>${t(L('Fair statt frustrierend', 'Fair, not frustrating'))}</h3><p>${t(L('Jeder Angriff wird angesagt, jeder Boss hat einen Trick, und wer verliert, behält sein Inventar.', 'Every attack is announced, every boss has a trick, and losing never costs your inventory.'))}</p></article>
        <article class="mc-panel"><h3>${t(L('Geschichten, nicht nur Gegner', 'Stories, not just enemies'))}</h3><p>${t(L('Bosse aus der Mythologie, vertonte Cutscenes und Bauwerke, deren Stelen erzählen, was dort passiert ist.', 'Bosses from mythology, voiced cutscenes and structures whose steles tell what happened there.'))}</p></article>
        <article class="mc-panel"><h3>${t(L('Handgemacht', 'Handmade'))}</h3><p>${t(L('Eigene Modelle, eigene Animationen, eigene Effekte. Gebaut wird nur mit Vanilla-Blöcken, damit alles nach Minecraft aussieht.', 'Our own models, animations and effects. Worlds use vanilla blocks only, so everything still looks like Minecraft.'))}</p></article>
      </div>
    </div>
  </section>
</div>`;
}

export async function mount(root, mods, signal) {
  const byId = Object.fromEntries(mods.map((m) => [m.id, m]));
  const figures = [];
  const hha = byId.hha;
  if (hha) {
    figures.push({ base: hha.base, armor: 'heaven', eye: '#ffd75e', sword: `${hha.base}/item/heavens_sword.png` });
    figures.push({ base: hha.base, armor: 'hell', eye: '#39d5ff', sword: `${hha.base}/item/hells_sword.png` });
  }
  for (const m of mods) {
    if (m.id === 'hha') continue;
    const armor = m.sections.find((s) => s.type === 'armor');
    if (armor?.armor) {
      const sword = (armor.showcase || []).find((n) => /sword|blade|scythe|sense|klinge/.test(n)) || armor.showcase?.[0];
      figures.push({ base: m.base, armor: armor.armor, eye: m.accent2 || m.accent, sword: sword ? `${m.base}/item/${sword}.png` : null });
    }
  }
  const zoneOf = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const c = (f) => `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`;
    return { side: [c(0.32), c(0.28), c(0.36), c(0.25)], top: [c(0.42), c(0.36), c(0.5), c(0.3)], edge: hex };
  };
  const zones = [
    { side: ['#ece8df', '#e2ddd2', '#f4f1ea', '#d8d2c6'], top: ['#ece8df', '#f4f1ea', '#f1c94e', '#e2ddd2'], edge: '#e5b93d' },
    { side: ['#2b2630', '#25212a', '#312b36', '#1f1b23'], top: ['#2b2630', '#25212a', '#312b36', '#2fbfe8'], edge: '#1f8fbf' },
    ...mods.filter((m) => m.id !== 'hha').map((m) => zoneOf(m.accent)),
  ].slice(0, Math.max(1, figures.length));
  const glow = [0xffd36a, 0x3fd8ff, ...mods.filter((m) => m.id !== 'hha').map((m) => parseInt((m.accent2 || m.accent).slice(1), 16))].slice(0, Math.max(1, figures.length));
  heroScene($('.hero-canvas', root), { figures, zones, glow, wide: true, signal }).catch(console.error);

  // Kartenbilder: Bossmodell der Mod rendern
  const cards = $$('.mod-card', root);
  const list = mods.map((m) => ({ model: m.card?.model || (m.hero?.kind === 'boss' ? m.hero.model : null), texture: m.card?.texture, thumbYaw: -0.5 }));
  for (let i = 0; i < mods.length; i++) {
    if (!list[i].model) continue;
    const img = $('.card-thumb', cards[i]);
    thumbnails(mods[i].base, [list[i]], [img], () => signal.aborted, 360)
      .then(() => { if (!img.hidden) $('.card-fallback', cards[i]).hidden = true; })
      .catch(() => {});
  }
}
