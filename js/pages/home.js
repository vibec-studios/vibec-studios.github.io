// Startseite des Studios: das Studio und seine Projekte im Stil einer Produktseite. Die HHA-Reihe ist das erste
// Projekt, nicht das einzige: Texte bleiben allgemein, Reihe und Rolle kommen aus den Inhaltsdateien (series, role).
import { $, $$, t, tx, esc, short, onColor, animateIcons } from '../core.js';
import { stageScene, linkStage, lyricsStage } from '../views.js';
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
    if (g.weapon) return g.weapon;
    const names = [...(g.showcase || []), ...(g.items || []).map((i) => i.tex)];
    return names.find((n) => /sword|blade|scythe|klinge/.test(n)) || names.find((n) => /mace/.test(n)) || null;
  };
  if (sec.type === 'versus') return sec.sides.map((s) => ({ set: s.armor || s.name.toLowerCase(), name: s.name, color: s.color, weapon: weapon(s) }));
  return sec.armor ? [{ set: sec.armor, armor3d: !!sec.armor3d, name: m.name.replace(/^HHA\s+/, ''), color: m.accent2 || m.accent, weapon: weapon(sec) }] : [];
}

/** „HHA · Hauptmod“, „HHA · Addon“ oder einfach „Mod“ für eigenständige Projekte. */
function role(m) {
  const r = m.role === 'core' ? t(L('Hauptmod', 'Core mod')) : m.role === 'addon' ? 'Addon' : 'Mod';
  return m.series ? `${esc(m.series)} · ${r}` : r;
}

/** Projekte als Katalog: eine Zeile je Mod mit Icon, Name, Kurztext, Rolle, Stand und Minecraft-Version. */
function projectList(mods, dl) {
  return `<ul class="catalog" data-reveal>${mods.map((m) => `<li><a href="${m.path}" data-link style="--accent:${m.accent}">
      <span class="px-icon" data-src="${m.base}/${m.icon || 'icon.png'}"></span>
      <span class="cat-name"><b>${esc(m.name)}</b><span>${t(short(m.short, 1))}</span></span>
      <span class="cat-meta mono">${role(m)}</span>
      <span class="cat-meta mono">${t(m.status)}</span>
      <span class="cat-meta mono">MC ${esc(m.mc || '1.21.11')}</span>
      <span class="cat-go" aria-hidden="true">→</span></a></li>`).join('')}</ul>`;
}

/** Text zu den Projekten: Reihen mit Hauptmod und Addons, dazu eigenständige Mods. */
function projectsLead(mods) {
  const solo = mods.filter((m) => !m.series).map((m) => m.name);
  const list = (arr, and) => arr.length > 1 ? `${arr.slice(0, -1).join(', ')} ${and} ${arr[arr.length - 1]}` : arr[0];
  const de = 'Die HHA-Reihe besteht aus H&H Armors und Addons, die sich über eine eigene API einhängen.';
  const en = 'The HHA series is H&H Armors plus addons that plug in through its own API.';
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

// Hero der Startseite: bei jedem Laden eine zufällige Mod, nie zweimal hintereinander dieselbe.
let heroMod = null;
function pickHeroMod(mods) {
  const usable = mods.filter((m) => m.hero?.kind === 'link' || m.hero?.kind === 'lyrics' || armorsOf(m).length || bossOf(m));
  let last = null;
  try { last = localStorage.getItem('vcs-hero'); } catch (e) { /* privat */ }
  const pool = usable.length > 1 ? usable.filter((m) => m.id !== last) : usable;
  const m = pool[Math.floor(Math.random() * pool.length)] || mods[0];
  try { localStorage.setItem('vcs-hero', m.id); } catch (e) { /* privat */ }
  return m;
}

function heroScene(canvas, m, signal) {
  if (m.hero?.kind === 'lyrics') return lyricsStage(canvas, { accent: m.accent, signal });
  if (m.hero?.kind === 'link') return linkStage(canvas, { glow: hex(m.accent), cable: hex(m.accent), zoom: 1.2, signal });
  const armors = armorsOf(m);
  if (armors.length) {
    const figures = armors.map((a, i) => ({ base: m.base, armor: a.set, armor3d: a.armor3d, eye: a.color, held: a.weapon ? heldItem(m, a.weapon) : null,
      glow: armors.length > 1 ? hex(a.color) : undefined, stance: armors.length > 1 ? (i ? 1 : 0) : 1 }));
    return stageScene(canvas, { figures, glow: hex(m.accent2 || m.accent), yaw: figures.length > 1 ? 0 : 0.3, zoom: figures.length > 1 ? 1.25 : 1.4, signal });
  }
  const boss = bossOf(m);
  return stageScene(canvas, { boss: { base: m.base, model: boss.model, texture: boss.texture, yaw: boss.yaw ?? 0.5 }, glow: hex(m.accent2 || m.accent), zoom: 0.9, signal });
}

export function render(mods) {
  const c = count(mods);
  heroMod = pickHeroMod(mods);
  const hm = heroMod;

  const features = mods.map((m, i) => {
    const boss = bossOf(m);
    return `<section class="feature-sec" style="--accent:${m.accent};--accent2:${m.accent2 || m.accent};--on-accent:${onColor(m.accent)}" id="mod-${m.id}">
      <div class="wrap feature-grid ${i % 2 ? 'flip' : ''}">
        <div class="feature-copy" data-reveal>
          <p class="eyebrow">${role(m)} · ${t(m.status)}</p>
          <h2 class="display">${esc(m.name)}</h2>
          <p class="lead">${t(m.short)}</p>
          <ul class="ticks">${(m.highlights || []).slice(0, 3).map((h) => `<li>${t(h)}</li>`).join('')}</ul>
          <div class="cta"><a class="btn accent" href="${m.path}" data-link>${t(L('Zur Mod', 'View mod'))} →</a></div>
        </div>
        <div class="feature-art" data-reveal>
          ${m.hero?.kind === 'shot' ? `<img class="feature-shot" src="${m.base}/${m.hero.img}" alt="" loading="lazy">` : `<canvas data-boss="${i}" aria-hidden="true"></canvas>`}
          ${boss?.name ? `<span class="callout mono">${t(boss.name)}</span>` : ''}
        </div>
      </div>
    </section>`;
  }).join('');

  return `<div class="home">
  <section class="hero home-hero">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <h1 class="display">${t(L('Minecraft-Mods mit eigenen Bossen, Welten und Werkzeugen.', 'Minecraft mods with their own bosses, worlds and tools.'))}</h1>
        <p class="lead">${t(L('Vibe Craft Studios ist ein kleines Studio. Wir bauen die HHA-Reihe mit Bosskämpfen in eigenen Dimensionen, dazu Werkzeuge fürs Zusammenspielen: Vibey Multiplayer, Vibey Lyrics und den Vibe Launcher.', 'Vibe Craft Studios is a small studio. We make the HHA series with boss fights in dimensions of their own, plus tools for playing together: Vibey Multiplayer, Vibey Lyrics and the Vibe Launcher.'))}</p>
        <div class="cta">
          <a class="btn primary" href="#projekte" data-anchor>${t(L('Alle Projekte', 'All projects'))}</a>
          <a class="btn ghost" href="/launcher/" data-link>Vibe Launcher</a>
        </div>
        <p class="note mono">Fabric & NeoForge · ${t(L('Deutsch & Englisch', 'German & English'))} · ${t(L('jeder Download mit SHA-256 und VirusTotal', 'every download with SHA-256 and VirusTotal'))}</p>
      </div>
      <div class="hero-art">
        <canvas class="hero-canvas" aria-hidden="true"></canvas>
        <a class="hero-pick mono" href="${hm.path}" data-link>${esc(hm.name)} →</a>
      </div>
    </div>
    <div class="wrap stat-row">
      <div><b>${c.mods}</b><span>${t(L('Mods', 'Mods'))}</span></div>
      <div><b>${c.bosses}</b><span>${t(L('Bosse & Wächter', 'Bosses & guardians'))}</span></div>
      <div><b>${c.models}</b><span>${t(L('eigene 3D-Modelle', 'custom 3D models'))}</span></div>
      <div><b>2</b><span>${t(L('Sprachen: Deutsch & Englisch', 'languages: German & English'))}</span></div>
    </div>
  </section>

  <section class="section" id="projekte">
    <div class="wrap">
      <header class="sec-head" data-reveal>
        <p class="eyebrow">${t(L('Projekte', 'Projects'))}</p>
        <h2 class="display sm">${t(L('Alle Projekte', 'All projects'))}</h2>
        <p class="lead">${t(projectsLead(mods))}</p>
      </header>
      ${projectList(mods)}
    </div>
  </section>

  ${features}

  <section class="section home-launcher">
    <div class="wrap hl-grid" data-reveal>
      <div>
        <p class="eyebrow">Vibe Launcher · Windows</p>
        <h2 class="display sm">${t(L('Unser Launcher für Minecraft', 'Our launcher for Minecraft'))}</h2>
        <p class="lead">${t(L('Instanzen mit Fabric, Quilt, Forge oder NeoForge, Mods von Modrinth, CurseForge und unserem eigenen Store, lokale Server über den Vibey-Relay und auf Wunsch Freunde und Einladungen über die Vibe-Dienste.', 'Instances with Fabric, Quilt, Forge or NeoForge, mods from Modrinth, CurseForge and our own store, local servers through the Vibey relay and, if you like, friends and invites through the Vibe services.'))}</p>
        <div class="cta"><a class="btn primary" href="/launcher/" data-link>${t(L('Zum Launcher', 'View the launcher'))}</a></div>
      </div>
      <a class="hl-shot" href="/launcher/" data-link><img src="/assets/launcher/img/home.webp" alt="${esc(tx(L('Vibe Launcher: Startseite mit Hotbar', 'Vibe Launcher: home screen with hotbar')))}" width="1280" height="800" loading="lazy"></a>
    </div>
  </section>

  <section class="section dl-teaser">
    <div class="wrap dl-teaser-grid" data-reveal>
      <div>
        <p class="eyebrow">${t(L('Download-Center', 'Download center'))}</p>
        <h2 class="display sm">${t(L('Jede Datei direkt aus GitHub', 'Every file straight from GitHub'))}</h2>
        <p class="lead">${t(L('Alle Versionen aller Mods, mit SHA-256-Prüfsumme und dem VirusTotal-Ergebnis jeder Datei.', 'Every version of every mod, with the SHA-256 checksum and the VirusTotal result of each file.'))}</p>
      </div>
      <div class="cta"><a class="btn ghost" href="/downloads/" data-link>${t(L('Zum Download-Center', 'Open download center'))} →</a></div>
    </div>
  </section>

  <section class="section values">
    <div class="wrap values-grid" data-reveal>
      <div>
        <p class="eyebrow">Studio</p>
        <h2 class="display sm">${t(L('So arbeiten wir', 'How we work'))}</h2>
      </div>
      <div class="values-list">
        <article><h3>${t(L('Angriffe werden angesagt', 'Attacks are announced'))}</h3><p>${t(L('Jeder Bossangriff hat eine sichtbare Ankündigung am Boden, jeder Boss einen Trick. Wer verliert, behält sein Inventar.', 'Every boss attack shows a warning on the ground, every boss has a trick. Losing never costs your inventory.'))}</p></article>
        <article><h3>${t(L('Eigene Modelle, Vanilla-Blöcke', 'Our own models, vanilla blocks'))}</h3><p>${t(L('Modelle, Animationen und Effekte bauen wir selbst. Welten und Arenen bestehen aus Vanilla-Blöcken.', 'We make our own models, animations and effects. Worlds and arenas are built from vanilla blocks.'))}</p></article>
        <article><h3>${t(L('Offen und geprüft', 'Open and checked'))}</h3><p>${t(L('Der Quellcode liegt auf GitHub. Jede Datei im Download-Center hat eine Prüfsumme und einen VirusTotal-Scan.', 'The source code is on GitHub. Every file in the download center has a checksum and a VirusTotal scan.'))}</p></article>
      </div>
    </div>
  </section>
</div>`;
}

export async function mount(root, mods, signal) {
  animateIcons(root);
  heroScene($('.hero-canvas', root), heroMod || mods[0], signal).catch(console.error);

  $$('canvas[data-boss]', root).forEach((c) => {
    const m = mods[+c.dataset.boss];
    const boss = bossOf(m);
    if (!boss && m.hero?.kind === 'lyrics') lyricsStage(c, { accent: m.accent, signal }).catch(console.error);
    if (!boss && m.hero?.kind === 'link') linkStage(c, { glow: hex(m.accent), cable: hex(m.accent), zoom: 1.1, signal }).catch(console.error);
    if (boss) stageScene(c, { boss: { base: m.base, model: boss.model, texture: boss.texture, yaw: boss.yaw ?? 0.5 }, glow: hex(m.accent2 || m.accent), zoom: 0.86, signal }).catch(console.error);
  });
}
