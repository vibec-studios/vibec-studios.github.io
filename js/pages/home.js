// Startseite des Studios: das Studio und seine Projekte im Stil einer Produktseite. Die HHA-Reihe ist das erste
// Projekt, nicht das einzige: Texte bleiben allgemein, Reihe und Rolle kommen aus den Inhaltsdateien (series, role).
import { $, $$, t, esc, short, onColor } from '../core.js';
import { stageScene, linkStage } from '../views.js';
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

/** „HHA · Hauptmod“, „HHA · Addon“ oder einfach „Mod“ für eigenständige Projekte. */
function role(m) {
  const r = m.role === 'core' ? t(L('Hauptmod', 'Core mod')) : m.role === 'addon' ? 'Addon' : 'Mod';
  return m.series ? `${esc(m.series)} · ${r}` : r;
}

/** Projekt-Kacheln; die Kachel „Was als Nächstes kommt“ nur, wenn sie das Raster füllt statt eine Lücke zu lassen. */
function projectTiles(mods) {
  const tiles = mods.map((m) => `<a class="tile link" href="${m.path}" data-link style="--accent:${m.accent}">
          <span class="tile-tag mono">${role(m)}</span>
          <h3>${esc(m.name)}</h3><p>${t(short(m.tagline || m.short, 1))}</p><span class="tile-go">→</span></a>`);
  const next = `<a class="tile ghost link" href="${STUDIO.github}" target="_blank" rel="noopener"><span class="tile-tag mono">${t(L('Demnächst', 'Coming up'))}</span><h3>${t(L('Was als Nächstes kommt', 'What comes next'))}</h3><p>${t(L('Neue Mods erscheinen zuerst hier und im Download-Center. Folge uns auf GitHub, dann verpasst du nichts.', 'New mods show up here and in the download center first. Follow us on GitHub so you miss nothing.'))}</p><span class="tile-go">↗</span></a>`;
  const n = tiles.length;
  const cols = (n + 1) % 4 === 0 || n % 4 === 0 ? 4 : 3;
  if ((n + 1) % cols === 0) tiles.push(next);
  return `<div class="tiles${cols === 4 ? ' four' : ''}" data-reveal>${tiles.join('')}</div>`;
}

/** Text zu den Projekten: Reihen mit Hauptmod und Addons, dazu eigenständige Mods. */
function projectsLead(mods) {
  const solo = mods.filter((m) => !m.series).map((m) => m.name);
  const list = (arr, and) => arr.length > 1 ? `${arr.slice(0, -1).join(', ')} ${and} ${arr[arr.length - 1]}` : arr[0];
  const de = 'Die HHA-Reihe ist unser erstes Universum: H&H Armors ist das Herz, die Addons hängen sich über eine eigene API ein.';
  const en = 'The HHA series is our first universe: H&H Armors is the heart, the addons plug in through their own API.';
  return solo.length
    ? L(`${de} ${list(solo, 'und')} ${solo.length > 1 ? 'stehen' : 'steht'} für sich, und weitere Projekte kommen dazu, sobald sie bereit sind.`,
      `${en} ${list(solo, 'and')} ${solo.length > 1 ? 'stand' : 'stands'} on ${solo.length > 1 ? 'their' : 'its'} own, and more projects join once they are ready.`)
    : L(`${de} Weitere Projekte, auch abseits von HHA, kommen dazu, sobald sie bereit sind.`, `${en} More projects, beyond HHA too, will join once they are ready.`);
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
          <p class="eyebrow">${String(i + 1).padStart(2, '0')} · ${role(m)} · ${t(m.status)}</p>
          <h2 class="display accent">${esc(m.name)}.</h2>
          <p class="lead">${t(m.short)}</p>
          <ul class="ticks">${(m.highlights || []).slice(0, 3).map((h) => `<li>${t(h)}</li>`).join('')}</ul>
          <div class="cta"><a class="btn accent" href="${m.path}" data-link>${t(L('Mod ansehen', 'View mod'))} →</a></div>
        </div>
        <div class="feature-art" data-reveal>
          ${m.hero?.kind === 'shot' ? `<img class="feature-shot" src="${m.base}/${m.hero.img}" alt="" loading="lazy">` : `<canvas data-boss="${i}" aria-hidden="true"></canvas>`}
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
        <p class="lead">${t(L('Vibe Craft Studios ist ein kleines Studio für Minecraft-Mods. Wir bauen Bosskämpfe mit Geschichte, eigene Welten und Ausrüstung, die man sich verdienen muss, und Werkzeuge, die das Zusammenspielen leichter machen.', 'Vibe Craft Studios is a small studio for Minecraft mods. We build boss fights with a story, worlds of their own and gear you have to earn, plus tools that make playing together easier.'))}</p>
        <div class="cta">
          <a class="btn primary" href="#mod-${mods[0]?.id || 'hha'}" data-anchor>${t(L('Mods entdecken', 'Explore mods'))}</a>
          <a class="btn ghost" href="/downloads/" data-link>${t(L('Downloads', 'Downloads'))}</a>
        </div>
        <p class="note mono">└─ Fabric & NeoForge · ${t(L('Deutsch & Englisch', 'German & English'))} · ${t(L('alle Downloads geprüft', 'every download checked'))}</p>
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
      <div><b>2</b><span>${t(L('Sprachen: Deutsch & Englisch', 'languages: German & English'))}</span></div>
    </div>
  </section>

  ${features}

  <section class="section universe">
    <div class="wrap">
      <header class="sec-head center" data-reveal>
        <p class="eyebrow">${t(L('Projekte', 'Projects'))}</p>
        <h2 class="display sm">${t(L('Mehr als eine Reihe.', 'More than one series.'))}</h2>
        <p class="lead">${t(projectsLead(mods))}</p>
      </header>
      ${projectTiles(mods)}
    </div>
  </section>

  <section class="section dl-teaser">
    <div class="wrap dl-teaser-grid" data-reveal>
      <div>
        <p class="eyebrow">${t(L('Download-Center', 'Download center'))}</p>
        <h2 class="display sm">${t(L('Alle Mods an einem Ort.', 'Every mod in one place.'))}</h2>
        <p class="lead">${t(L('Jede Version direkt aus GitHub, mit Prüfsumme und VirusTotal-Scan. Kein Umweg, keine fremden Spiegel.', 'Every version straight from GitHub, with checksum and VirusTotal scan. No detours, no third-party mirrors.'))}</p>
      </div>
      <div class="cta"><a class="btn primary" href="/downloads/" data-link>↓ ${t(L('Zum Download-Center', 'Open download center'))}</a></div>
    </div>
  </section>

  <section class="section values">
    <div class="wrap values-grid" data-reveal>
      <h2 class="display">${t(L('Fair.<br>Erzählt.<br>Handgemacht.', 'Fair.<br>Told.<br>Handmade.'))}</h2>
      <div class="values-list">
        <article><h3>${t(L('Fair statt frustrierend', 'Fair, not frustrating'))}</h3><p>${t(L('Jeder Angriff wird angesagt, jeder Boss hat einen Trick, und wer verliert, behält sein Inventar.', 'Every attack is announced, every boss has a trick, and losing never costs your inventory.'))}</p></article>
        <article><h3>${t(L('Geschichten statt Gegner', 'Stories, not just enemies'))}</h3><p>${t(L('Gegner mit Vorgeschichte, vertonte Cutscenes und Orte, die erzählen, was dort passiert ist.', 'Foes with a backstory, voiced cutscenes and places that tell what happened there.'))}</p></article>
        <article><h3>${t(L('Alles selbst gebaut', 'Built by hand'))}</h3><p>${t(L('Eigene Modelle, Animationen und Effekte. Gebaut wird mit Vanilla-Blöcken, damit sich alles nach Minecraft anfühlt.', 'Our own models, animations and effects. We build with vanilla blocks, so everything still feels like Minecraft.'))}</p></article>
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
    if (!boss && m.hero?.kind === 'link') linkStage(c, { glow: hex(m.accent), cable: hex(m.accent), zoom: 1.1, signal }).catch(console.error);
    if (boss) stageScene(c, { boss: { base: m.base, model: boss.model, texture: boss.texture, yaw: boss.yaw ?? 0.5 }, glow: hex(m.accent2 || m.accent), zoom: 0.86, signal }).catch(console.error);
  });
}
