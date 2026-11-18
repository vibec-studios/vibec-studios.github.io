// Startseite des Studios: das Studio und seine Projekte im Stil einer Produktseite. Die HHA-Reihe ist das erste
// Projekt, nicht das einzige: Texte bleiben allgemein, Reihe und Rolle kommen aus den Inhaltsdateien (series, role).
import { $, $$, t, tx, esc, short, onColor, animateIcons } from '../core.js';
import { stageScene, linkStage, lyricsStage } from '../views.js';
import { heldItem } from '../items.js';
import { fetchClientRelease, renderClientDownload } from '../client-dl.js';

const L = (de, en) => ({ de, en });
const hex = (c) => parseInt(String(c).slice(1), 16);

export const STUDIO = {
  accent: '#3b82f6', accent2: '#3b82f6',
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

/** Projekte als Karten wie Fenster im Spiel: 3D-Bühne oder Screenshot, Name, Kurztext, Stand und Minecraft-Version. */
function projectCards(mods) {
  return `<div class="proj-grid">${mods.map((m, i) => {
    const boss = bossOf(m);
    const stage = m.hero?.kind === 'shot'
      ? `<img src="${m.base}/${m.hero.img}" alt="" loading="lazy">`
      : `<canvas data-boss="${i}" aria-hidden="true"></canvas>`;
    return `<article class="proj card" style="--accent:${m.accent};--on-accent:${onColor(m.accent)}" id="mod-${m.id}" data-reveal>
      <a class="proj-stage" href="${m.path}" data-link tabindex="-1" aria-hidden="true">${stage}${boss?.name ? `<span class="pill proj-callout">${t(boss.name)}</span>` : ''}</a>
      <div class="proj-body">
        <div class="proj-head"><span class="px-icon" data-src="${m.base}/${m.icon || 'icon.png'}"></span>
          <div><h3><a href="${m.path}" data-link>${esc(m.name)}</a></h3><p class="proj-role">${role(m)} · ${t(m.status)}</p></div></div>
        <p>${t(short(m.short, 1))}</p>
        <div class="proj-foot"><p class="small">Minecraft ${esc(m.mc || '1.21.11')}${m.version ? ` · v${esc(m.version)}` : ''}</p>
          <a class="btn sm" href="${m.path}" data-link>${t(L('Ansehen', 'View'))}</a></div>
      </div>
    </article>`;
  }).join('')}</div>`;
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

  return `<div class="home">
  <section class="hero home-hero">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <h1 class="display">${t(L('Minecraft-Mods mit eigenen Bossen, Welten und Werkzeugen', 'Minecraft mods with their own bosses, worlds and tools'))}</h1>
        <p class="lead">${t(L('Vibe Craft Studios ist ein kleines Studio. Wir bauen die HHA-Reihe mit Bosskämpfen in eigenen Dimensionen, dazu Werkzeuge fürs Zusammenspielen: Vibey Multiplayer, Vibey Lyrics, den Vibey Client und den Vibe Launcher.', 'Vibe Craft Studios is a small studio. We make the HHA series with boss fights in dimensions of their own, plus tools for playing together: Vibey Multiplayer, Vibey Lyrics, the Vibey Client and the Vibe Launcher.'))}</p>
        <div class="cta">
          <a class="btn primary" href="#projekte" data-anchor>${t(L('Alle Projekte', 'All projects'))}</a>
          <a class="btn" href="/downloads/" data-link>Downloads</a>
        </div>
        <p class="note">Fabric & NeoForge · ${t(L('Deutsch & Englisch', 'German & English'))} · ${t(L('jeder Download mit SHA-256 und VirusTotal', 'every download with SHA-256 and VirusTotal'))}</p>
      </div>
      <div class="hero-art">
        <canvas class="hero-canvas" aria-hidden="true"></canvas>
        <a class="pill hero-pick" href="${hm.path}" data-link>${esc(hm.name)} →</a>
      </div>
    </div>
    <div class="wrap stat-row">
      <div><b>${c.mods}</b><span>${t(L('Mods', 'Mods'))}</span></div>
      <div><b>${c.bosses}</b><span>${t(L('Bosse & Wächter', 'Bosses & guardians'))}</span></div>
      <div><b>${c.models}</b><span>${t(L('eigene 3D-Modelle', 'custom 3D models'))}</span></div>
      <div><b>2</b><span>${t(L('Sprachen', 'languages'))}</span></div>
    </div>
  </section>

  <section class="section" id="projekte">
    <div class="wrap">
      <header class="sec-head" data-reveal>
        <h2 class="display sm">${t(L('Projekte', 'Projects'))}</h2>
        <p class="lead">${t(projectsLead(mods))}</p>
      </header>
      ${projectCards(mods)}
    </div>
  </section>

  <section class="section home-client">
    <div class="wrap hl-grid hl-flip" data-reveal>
      <div class="hl-shots">
        <a class="hl-shot" href="/client/" data-link><img src="/assets/client/img/cosmetics-wings-crown.webp" alt="${esc(tx(L('Vibey Client: Kristall-Eisflügel und Eiskrone im Spiel', 'Vibey Client: crystal ice wings and ice crown in game')))}" loading="lazy"></a>
        <a class="hl-shot" href="/client/#garderobe" data-link><img src="/assets/client/img/wardrobe.webp" alt="${esc(tx(L('Vibey Client: die Garderobe im Spiel', 'Vibey Client: the wardrobe in game')))}" loading="lazy"></a>
      </div>
      <div>
        <p class="eyebrow">Vibey Client · Fabric · NeoForge</p>
        <h2 class="display sm">${t(L('Cosmetics, Emotes und Freunde im Spiel', 'Cosmetics, emotes and friends in game'))}</h2>
        <p class="lead">${t(L('Unsere Client-Mod: Umhänge, Flügel, Auren, Begleiter und Emotes, dazu Freundesliste und Einladungen. Alles kostenlos, nichts zu kaufen.', 'Our client mod: capes, wings, auras, pets and emotes, plus a friends list and invites. All free, nothing to buy.'))}</p>
        <div class="home-cdl" data-home-cdl><span class="pill cl-soon">${t(L('Bald verfügbar', 'Coming soon'))}</span></div>
        <div class="cta" data-home-cl-cta><a class="btn primary" href="/client/" data-link>${t(L('Zur Garderobe', 'Open the wardrobe'))}</a></div>
      </div>
    </div>
  </section>

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

  <section class="section values">
    <div class="wrap values-grid" data-reveal>
      <div>
        <h2 class="display sm">${t(L('So arbeiten wir', 'How we work'))}</h2>
        <p class="lead">${t(L('Drei Regeln, an die sich jede Mod hält.', 'Three rules every mod follows.'))}</p>
      </div>
      <div class="values-list">
        <article><h3>${t(L('Angriffe werden angesagt', 'Attacks are announced'))}</h3><p>${t(L('Jeder Bossangriff hat eine sichtbare Ankündigung am Boden, jeder Boss einen Trick. Wer verliert, behält sein Inventar.', 'Every boss attack shows a warning on the ground, every boss has a trick. Losing never costs your inventory.'))}</p></article>
        <article><h3>${t(L('Eigene Modelle, Vanilla-Blöcke', 'Our own models, vanilla blocks'))}</h3><p>${t(L('Modelle, Animationen und Effekte bauen wir selbst. Welten und Arenen bestehen aus Vanilla-Blöcken.', 'We make our own models, animations and effects. Worlds and arenas are built from vanilla blocks.'))}</p></article>
        <article><h3>${t(L('Offen und geprüft', 'Open and checked'))}</h3><p>${t(L('Der Quellcode der Mods liegt auf GitHub. Jede Datei im Download-Center hat eine Prüfsumme und einen VirusTotal-Scan.', 'The mods’ source code is on GitHub. Every file in the download center has a checksum and a VirusTotal scan.'))}</p></article>
      </div>
    </div>
  </section>

  <section class="section dl-teaser">
    <div class="wrap">
      <div class="card dl-teaser-grid" data-reveal>
        <div>
          <h2 class="display sm">${t(L('Download-Center', 'Download center'))}</h2>
          <p class="lead">${t(L('Alle Versionen aller Mods direkt aus GitHub, mit SHA-256-Prüfsumme und dem VirusTotal-Ergebnis jeder Datei.', 'Every version of every mod straight from GitHub, with the SHA-256 checksum and the VirusTotal result of each file.'))}</p>
        </div>
        <div class="cta"><a class="btn primary" href="/downloads/" data-link>${t(L('Zum Download-Center', 'Open download center'))}</a></div>
      </div>
    </div>
  </section>
</div>`;
}

export async function mount(root, mods, signal) {
  animateIcons(root);
  // Vibey Client: Download erscheint, sobald die API einen Release meldet (bei jedem Aufruf live geprüft)
  fetchClientRelease(signal).then((rel) => {
    const host = $('[data-home-cdl]', root);
    if (!rel || !host || signal?.aborted) return;
    renderClientDownload(host, rel, { changelog: false });
    $('[data-home-cl-cta]', root).innerHTML = `<a class="btn" href="/client/" data-link>${t(L('Alle Cosmetics ansehen', 'See all cosmetics'))}</a>`;
  });
  heroScene($('.hero-canvas', root), heroMod || mods[0], signal).catch(console.error);

  $$('canvas[data-boss]', root).forEach((c) => {
    const m = mods[+c.dataset.boss];
    const boss = bossOf(m);
    if (!boss && m.hero?.kind === 'lyrics') lyricsStage(c, { accent: m.accent, signal }).catch(console.error);
    if (!boss && m.hero?.kind === 'link') linkStage(c, { glow: hex(m.accent), cable: hex(m.accent), zoom: 1.1, signal }).catch(console.error);
    if (boss) stageScene(c, { boss: { base: m.base, model: boss.model, texture: boss.texture, yaw: boss.yaw ?? 0.5 }, glow: hex(m.accent2 || m.accent), zoom: 0.86, signal }).catch(console.error);
  });
}
