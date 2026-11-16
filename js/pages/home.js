// Startseite des Studios: Vorstellung der Mods im Stil einer Produktseite.
import { $, $$, t, esc, short, onColor } from '../core.js';
import { stageScene } from '../views.js';
import { heldItem } from '../items.js';

const L = (de, en) => ({ de, en });
const hex = (c) => parseInt(String(c).slice(1), 16);

export const STUDIO = {
  accent: '#8b6cff', accent2: '#3fe0c5',
  github: 'https://github.com/vibec-studios',
};

function count(mods) {
  let bosses = 0;
  const models = new Set();
  for (const m of mods) for (const s of m.sections) if (s.type === 'boss') for (const b of s.bosses) {
    bosses += 1;
    if (b.model) models.add(m.id + ':' + b.model);
  }
  return { mods: mods.length, bosses, models: models.size };
}

/** Rüstungen der Mod als Figuren: [{ set, color, weapon }] */
function armorsOf(m) {
  const sec = m.sections.find((s) => s.type === 'versus' || s.type === 'armor');
  if (!sec) return [];
  const weapon = (g) => {
    const names = [...(g.showcase || []), ...(g.items || []).map((i) => i.tex)];
    return names.find((n) => /sword|blade|scythe|klinge/.test(n)) || names.find((n) => /mace/.test(n)) || null;
  };
  if (sec.type === 'versus') return sec.sides.map((s) => ({ set: s.armor || s.name.toLowerCase(), name: s.name, color: s.color, weapon: weapon(s) }));
  return sec.armor ? [{ set: sec.armor, name: m.name.replace(/^HHA\s+/, ''), color: m.accent2 || m.accent, weapon: weapon(sec) }] : [];
}

function bossOf(m) {
  const model = m.card?.model || (m.hero?.kind === 'boss' ? m.hero.model : null);
  const sec = m.sections.find((s) => s.type === 'boss');
  const entry = sec?.bosses.find((b) => b.model === model) || sec?.bosses.find((b) => b.model);
  return entry ? { model: entry.model, texture: entry.texture, name: entry.name, yaw: m.card?.yaw } : (model ? { model, name: null } : null);
}

export function render(mods) {
  const c = count(mods);
  const lineup = mods.flatMap((m) => armorsOf(m).map((a) => ({ ...a, mod: m })));

  const features = mods.map((m, i) => {
    const boss = bossOf(m);
    return `<section class="feature-sec" style="--accent:${m.accent};--accent2:${m.accent2 || m.accent};--on-accent:${onColor(m.accent)}" id="mod-${m.id}">
      <div class="wrap feature-grid ${i % 2 ? 'flip' : ''}">
        <div class="feature-copy" data-reveal>
          <p class="eyebrow">${String(i + 1).padStart(2, '0')} · ${m.id === 'hha' ? t(L('Hauptmod', 'Core mod')) : 'Addon'} · ${t(m.status)}</p>
          <h2 class="display accent">${esc(m.name)}.</h2>
          <p class="lead">${t(m.short)}</p>
          <ul class="ticks">${(m.highlights || []).slice(0, 3).map((h) => `<li>${t(h)}</li>`).join('')}</ul>
          <div class="cta"><a class="btn accent" href="${m.path}" data-link>${t(L('Mod ansehen', 'View mod'))} →</a></div>
        </div>
        <div class="feature-art" data-reveal>
          <canvas data-boss="${i}" aria-hidden="true"></canvas>
          ${boss?.name ? `<span class="callout mono">└─ ${t(boss.name)}</span>` : ''}
        </div>
      </div>
    </section>`;
  }).join('');

  return `<div class="home">
  <section class="hero home-hero">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <h1 class="display">${t(L('Mods, die sich wie ein eigenes Spiel anfühlen.', 'Mods that feel like a game of their own.'))}</h1>
        <p class="lead">${t(L('Bosskämpfe mit Geschichte, eigene Welten und Rüstungen, die man sich verdienen muss. Für Minecraft mit Fabric.', 'Boss fights with a story, worlds of their own and armor you have to earn. For Minecraft on Fabric.'))}</p>
        <div class="cta">
          <a class="btn primary" href="#mod-${mods[0]?.id || 'hha'}" data-anchor>${t(L('Mods entdecken', 'Explore mods'))}</a>
          <a class="btn ghost" href="${STUDIO.github}" target="_blank" rel="noopener">GitHub</a>
        </div>
        <p class="note mono">└─ Minecraft 1.21.11 · Fabric · ${t(L('Deutsch & Englisch', 'German & English'))}</p>
      </div>
      <div class="hero-art">
        <canvas class="hero-canvas" aria-hidden="true"></canvas>
        <div class="lineup-labels mono" aria-hidden="true">${lineup.map((a) => `<span style="--c:${a.color}">${esc(a.name)}</span>`).join('')}</div>
      </div>
    </div>
    <div class="wrap stat-row">
      <div><b>${c.mods}</b><span>${t(L('Mods', 'Mods'))}</span></div>
      <div><b>${c.bosses}</b><span>${t(L('Bosse & Wächter', 'Bosses & guardians'))}</span></div>
      <div><b>${c.models}</b><span>${t(L('eigene 3D-Modelle', 'custom 3D models'))}</span></div>
      <div><b>2</b><span>${t(L('Sprachen, voll vertont', 'languages, fully voiced'))}</span></div>
    </div>
  </section>

  ${features}

  <section class="section universe">
    <div class="wrap">
      <header class="sec-head center" data-reveal>
        <p class="eyebrow">${t(L('Ein Universum', 'One universe'))}</p>
        <h2 class="display sm">${t(L('Alles passt zusammen.', 'Everything fits together.'))}</h2>
        <p class="lead">${t(L('H&H Armors ist das Herz. Addons hängen sich über eine eigene API ein und fühlen sich an, als wären sie schon immer da gewesen.', 'H&H Armors is the heart. Addons plug in through their own API and feel like they have always been there.'))}</p>
      </header>
      <div class="tiles four" data-reveal>
        ${mods.map((m) => `<a class="tile link" href="${m.path}" data-link style="--accent:${m.accent}">
          <span class="tile-tag mono">${m.id === 'hha' ? 'Core · API' : 'Addon'}</span>
          <h3>${esc(m.name)}</h3><p>${t(short(m.tagline || m.short, 1))}</p><span class="tile-go">→</span></a>`).join('')}
        <div class="tile ghost"><span class="tile-tag mono">API</span><h3>${t(L('Dein Addon?', 'Your addon?'))}</h3><p>${t(L('Sets, Fähigkeiten, Lore und die Cooldown-Leiste stehen offen.', 'Sets, abilities, lore and the cooldown bar are open to you.'))}</p></div>
      </div>
    </div>
  </section>

  <section class="section values">
    <div class="wrap values-grid" data-reveal>
      <h2 class="display">${t(L('Fair.<br>Erzählt.<br>Handgemacht.', 'Fair.<br>Told.<br>Handmade.'))}</h2>
      <div class="values-list">
        <article><h3>${t(L('Fair statt frustrierend', 'Fair, not frustrating'))}</h3><p>${t(L('Jeder Angriff wird angesagt, jeder Boss hat einen Trick, und wer verliert, behält sein Inventar.', 'Every attack is announced, every boss has a trick, and losing never costs your inventory.'))}</p></article>
        <article><h3>${t(L('Geschichten statt Gegner', 'Stories, not just enemies'))}</h3><p>${t(L('Bosse aus der Mythologie, vertonte Cutscenes und Orte, die erzählen, was dort passiert ist.', 'Bosses from mythology, voiced cutscenes and places that tell what happened there.'))}</p></article>
        <article><h3>${t(L('Alles selbst gebaut', 'Built by hand'))}</h3><p>${t(L('Eigene Modelle, Animationen und Effekte. Welten nur aus Vanilla-Blöcken, damit alles nach Minecraft aussieht.', 'Our own models, animations and effects. Worlds use vanilla blocks only, so everything still looks like Minecraft.'))}</p></article>
      </div>
    </div>
  </section>
</div>`;
}

export async function mount(root, mods, signal) {
  const figures = [];
  for (const m of mods) {
    for (const a of armorsOf(m)) {
      figures.push({ base: m.base, armor: a.set, eye: a.color, held: a.weapon ? heldItem(m, a.weapon) : null, glow: hex(a.color), stance: figures.length });
    }
  }
  stageScene($('.hero-canvas', root), { figures, glow: hex(STUDIO.accent), zoom: 1.0, signal }).catch(console.error);

  $$('canvas[data-boss]', root).forEach((c) => {
    const m = mods[+c.dataset.boss];
    const boss = bossOf(m);
    if (boss) stageScene(c, { boss: { base: m.base, model: boss.model, texture: boss.texture, yaw: boss.yaw ?? 0.5 }, glow: hex(m.accent2 || m.accent), zoom: 0.86, signal }).catch(console.error);
  });
}
