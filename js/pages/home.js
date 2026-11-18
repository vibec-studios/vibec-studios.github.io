// Startseite des Studios als Landingpage: großer Hero, Kennzahlen, die HHA-Reihe als Tabs, eigenständige Mods als
// Bänder in ihrer Farbe, Vibey Client, Vibe Launcher zum Durchklicken, FAQ und Download-Abschluss.
// Reihe und Rolle kommen aus den Inhaltsdateien (series, role), neue Mods erscheinen von selbst.
import { $, $$, t, tx, esc, short, onColor, animateIcons } from '../core.js';
import { stageScene, linkStage, lyricsStage } from '../views.js';
import { heldItem } from '../items.js';
import { latestRelease, releasesOf } from '../downloads.js';
import { fetchStatus } from '../status-api.js';
import { fetchClientRelease } from '../client-dl.js';

const L = (de, en) => ({ de, en });
const hex = (c) => parseInt(String(c).slice(1), 16);

export const STUDIO = {
  accent: '#3b82f6', accent2: '#3b82f6',
  github: 'https://github.com/vibec-studios',
};

function count(mods, dl) {
  let bosses = 0;
  const models = new Set();
  for (const m of mods) for (const s of m.sections) if (s.type === 'boss') for (const b of s.bosses) {
    bosses += 1;
    if (b.model) models.add(m.id + ':' + b.model);
  }
  const releases = mods.reduce((n, m) => n + releasesOf(dl, m.id).length, 0);
  return { mods: mods.length, bosses, models: models.size, releases };
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

function bossOf(m) {
  const model = m.card?.model || (m.hero?.kind === 'boss' ? m.hero.model : null);
  const sec = m.sections.find((s) => s.type === 'boss');
  const entry = sec?.bosses.find((b) => b.model === model) || sec?.bosses.find((b) => b.model);
  return entry ? { model: entry.model, texture: entry.texture, name: entry.name, yaw: m.card?.yaw } : (model ? { model, name: null } : null);
}

function role(m) {
  const r = m.role === 'core' ? t(L('Hauptmod', 'Core mod')) : m.role === 'addon' ? 'Addon' : 'Mod';
  return m.series ? `${esc(m.series)} · ${r}` : r;
}

// Datum und Größe in beiden Sprachen (die Seite schaltet die Sprache ohne neues Rendern um)
const fmtDate = (iso) => t(L(new Date(iso).toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' }), new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })));
const fmtSize = (b) => {
  const s = b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`;
  return t(L(s.replace('.', ','), s));
};

/** Version, Minecraft und Loader als Hinweiszeile unter einem Download-Knopf. */
function factLine(m, dl) {
  const rel = latestRelease(dl, m.id);
  const parts = [rel ? `v${esc(rel.version)}` : (m.version ? `v${esc(m.version)}` : ''), `Minecraft ${esc(m.mc || '1.21.11')}`, esc(m.loader || 'Fabric')];
  if (rel?.assets?.[0]?.size) parts.push(fmtSize(rel.assets[0].size));
  return parts.filter(Boolean).join(' · ');
}

// ------------------------------------------------------------ Hero

// Bei jedem Laden eine zufällige Mod im Hero, nie zweimal hintereinander dieselbe.
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

function heroScene(canvas, m, signal, { zoomBoss = 0.9 } = {}) {
  if (m.hero?.kind === 'lyrics') return lyricsStage(canvas, { accent: m.accent, signal });
  if (m.hero?.kind === 'link') return linkStage(canvas, { glow: hex(m.accent), cable: hex(m.accent), zoom: 1.2, signal });
  const armors = armorsOf(m);
  if (armors.length) {
    const figures = armors.map((a, i) => ({ base: m.base, armor: a.set, armor3d: a.armor3d, eye: a.color, held: a.weapon ? heldItem(m, a.weapon) : null,
      glow: armors.length > 1 ? hex(a.color) : undefined, stance: armors.length > 1 ? (i ? 1 : 0) : 1 }));
    return stageScene(canvas, { figures, glow: hex(m.accent2 || m.accent), yaw: figures.length > 1 ? 0 : 0.3, zoom: figures.length > 1 ? 1.25 : 1.4, signal });
  }
  const boss = bossOf(m);
  return stageScene(canvas, { boss: { base: m.base, model: boss.model, texture: boss.texture, yaw: boss.yaw ?? 0.5 }, glow: hex(m.accent2 || m.accent), zoom: zoomBoss, signal });
}

function hero(mods, dl) {
  const hm = heroMod;
  const c = count(mods, dl);
  const mcs = [...new Set(mods.flatMap((m) => String(m.mc || '1.21.11').split(/\s*[–-]\s*/)))].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  return `<section class="hero home-hero">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <p class="kicker">Vibe Craft Studios</p>
        <h1 class="display xl">${t(L('Bosse, Welten und', 'Bosses, worlds and'))}<br><span class="hl">${t(L('Werkzeuge für Minecraft.', 'tools for Minecraft.'))}</span></h1>
        <p class="lead">${t(L('Wir bauen die HHA-Reihe mit Bosskämpfen in eigenen Dimensionen und Werkzeuge fürs gemeinsame Spielen: Vibey Multiplayer, Vibey Lyrics, den Vibey Client und den Vibe Launcher.', 'We make the HHA series with boss fights in dimensions of their own, plus tools for playing together: Vibey Multiplayer, Vibey Lyrics, the Vibey Client and the Vibe Launcher.'))}</p>
        <div class="cta">
          <a class="btn primary lg" href="#reihe" data-anchor>${t(L('Projekte ansehen', 'Explore projects'))}</a>
          <a class="btn lg" href="/downloads/" data-link>Downloads</a>
        </div>
        <p class="anno"><i aria-hidden="true"></i>${t(L('Kostenlos · Fabric & NeoForge · Deutsch & Englisch', 'Free · Fabric & NeoForge · German & English'))}</p>
      </div>
      <div class="hero-art">
        <canvas class="hero-canvas" aria-hidden="true"></canvas>
        <a class="callout hero-pick" href="${hm.path}" data-link><i aria-hidden="true"></i>${esc(hm.name)}</a>
      </div>
    </div>
    <div class="wrap hero-foot">
      <span>Minecraft ${esc(mcs[0])} – ${esc(mcs[mcs.length - 1])}</span>
      <a href="/downloads/" data-link>${t(L('Alle Versionen', 'All versions'))}</a>
      <a class="live" href="/status/" data-link data-live hidden><i aria-hidden="true"></i><span></span></a>
    </div>
  </section>
  <section class="stats-band">
    <div class="wrap stats">
      <div><b>${c.mods}</b><span>${t(L('Mods', 'Mods'))}</span></div>
      <div><b>${c.bosses}</b><span>${t(L('Bosse & Wächter', 'Bosses & guardians'))}</span></div>
      <div><b>${c.models}</b><span>${t(L('eigene 3D-Modelle', 'custom 3D models'))}</span></div>
      <div><b>${c.releases || '–'}</b><span>${t(L('Releases auf GitHub', 'releases on GitHub'))}</span></div>
    </div>
  </section>`;
}

// ------------------------------------------------------------ HHA-Reihe als Tabs

function seriesBand(mods, dl) {
  const list = mods.filter((m) => m.series);
  if (!list.length) return '';
  const addons = list.filter((m) => m.role === 'addon').length;
  const numDe = ['keine', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs'], numEn = ['no', 'one', 'two', 'three', 'four', 'five', 'six'];
  const tabs = list.map((m, i) => `<button class="tab" role="tab" id="tab-${m.id}" aria-controls="pane-${m.id}" aria-selected="${i === 0}" style="--accent:${m.accent}"><span class="px-icon" data-src="${m.base}/${m.icon || 'icon.png'}"></span>${esc(m.name)}</button>`).join('');
  const panes = list.map((m, i) => {
    const rel = latestRelease(dl, m.id);
    const armors = armorsOf(m);
    const label = armors.length ? esc(armors.map((a) => a.name).join(' & ')) : (bossOf(m)?.name ? t(bossOf(m).name) : '');
    return `<div class="pane" role="tabpanel" id="pane-${m.id}" aria-labelledby="tab-${m.id}"${i ? ' hidden' : ''} style="--accent:${m.accent};--on-accent:${onColor(m.accent)}">
      <a class="pane-stage card" href="${m.path}" data-link tabindex="-1" aria-hidden="true"><canvas data-series="${m.id}"></canvas>${label ? `<span class="callout"><i></i>${label}</span>` : ''}</a>
      <div class="pane-copy">
        <p class="kicker">${role(m)} · ${t(m.status)}</p>
        <h3 class="display">${esc(m.name)}</h3>
        <p class="lead strong">${t(m.tagline)}</p>
        <p class="lead">${t(short(m.short, 1))}</p>
        ${(m.highlights || []).length ? `<ul class="ticks">${m.highlights.slice(0, 3).map((h) => `<li>${t(h)}</li>`).join('')}</ul>` : ''}
        <div class="cta"><a class="btn primary" href="${m.path}" data-link>${t(L('Zur Seite', 'View page'))}</a>${rel ? `<a class="btn" href="/downloads/#${m.id}" data-link>↓ Download</a>` : ''}</div>
        <p class="anno"><i aria-hidden="true"></i>${factLine(m, dl)}</p>
      </div>
    </div>`;
  }).join('');
  return `<section class="band series-band" id="reihe" style="--accent:${list[0].accent}">
    <div class="wrap">
      <header class="band-head center" data-reveal>
        <p class="kicker">${t(L('Die HHA-Reihe', 'The HHA series'))}</p>
        <h2 class="display lg">${t(L('Eine Hauptmod,', 'One core mod,'))}<br><span class="hl">${t(L(`${numDe[addons] ?? addons} Addons.`, `${numEn[addons] ?? addons} addons.`))}</span></h2>
        <p class="lead">${t(L('H&H Armors legt die Grundlage mit zwei Endgame-Rüstungen, Olymp und Tartaros. Die Addons hängen sich über eine eigene API ein und bringen neue Welten, Bosse und Ausrüstung mit.', 'H&H Armors lays the groundwork with two endgame armor sets, Olympus and Tartarus. The addons plug in through its own API and bring new worlds, bosses and gear.'))}</p>
      </header>
      <div class="tabs" role="tablist" aria-label="HHA" data-reveal>${tabs}</div>
      <div class="panes" data-reveal>${panes}</div>
    </div>
  </section>`;
}

// ------------------------------------------------------------ Eigenständige Mods als Bänder

function spotBand(m, dl, i) {
  const rel = latestRelease(dl, m.id);
  const spot = m.spot;
  const media = spot
    ? `<a class="spot-shot card" href="${m.path}" data-link><img src="${m.base}/${spot.img}" alt="${esc(tx(spot.alt || m.tagline))}" width="1280" height="${spot.h || 720}" loading="lazy"></a>`
    : `<a class="spot-shot card spot-3d" href="${m.path}" data-link aria-hidden="true" tabindex="-1"><canvas data-spot="${m.id}"></canvas></a>`;
  const notes = (m.highlights || []).slice(0, 3).map((h) => `<li><i aria-hidden="true"></i>${t(h)}</li>`).join('');
  return `<section class="band spot-band${i % 2 ? ' flip' : ''}" id="mod-${m.id}" style="--accent:${m.accent};--on-accent:${onColor(m.accent)}">
    <div class="wrap">
      <header class="band-head split" data-reveal>
        <div>
          <p class="kicker"><span class="px-icon" data-src="${m.base}/${m.icon || 'icon.png'}"></span>${esc(m.name)}</p>
          <h2 class="display lg">${t(m.tagline)}</h2>
        </div>
        <div>
          <p class="lead">${t(short(m.short, 2))}</p>
          <div class="cta"><a class="btn primary" href="${m.path}" data-link>${t(L('Mehr erfahren', 'Learn more'))}</a>${rel ? `<a class="btn" href="/downloads/#${m.id}" data-link>↓ Download</a>` : ''}</div>
          <p class="anno"><i aria-hidden="true"></i>${factLine(m, dl)}</p>
        </div>
      </header>
      <div class="spot-media" data-reveal>${media}${notes ? `<ul class="anno-list">${notes}</ul>` : ''}</div>
    </div>
  </section>`;
}

// ------------------------------------------------------------ Vibey Client

const CLIENT_CARDS = [
  { img: 'cosmetics-wings-crown', name: L('Cosmetics', 'Cosmetics'), desc: L('Umhänge, Flügel, Auren, Hüte und Begleiter.', 'Capes, wings, auras, hats and pets.') },
  { img: 'emote-wheel', name: L('Emotes', 'Emotes'), desc: L('Ein Rad mit Emotes, sichtbar für alle mit dem Client.', 'A wheel of emotes, visible to everyone with the client.') },
  { img: 'social-03-friends-world', name: L('Freunde', 'Friends'), desc: L('Freundesliste mit Chats und Anfragen.', 'Friends list with chats and requests.') },
  { img: 'social-09-invite-toast-game', name: L('Einladungen', 'Invites'), desc: L('Freunde mit einem Klick in deine Welt holen.', 'Bring friends into your world in one click.') },
];

function clientBand() {
  return `<section class="band client-band" id="client" style="--accent:#8b5cf6;--on-accent:#fff">
    <div class="wrap">
      <header class="band-head split" data-reveal>
        <div>
          <p class="kicker">Vibey Client</p>
          <h2 class="display lg">${t(L('Cosmetics, Emotes', 'Cosmetics, emotes'))}<br><span class="hl">${t(L('und Freunde.', 'and friends.'))}</span></h2>
        </div>
        <div>
          <p class="lead">${t(L('Unsere Client-Mod für Fabric und NeoForge. Alles darin ist kostenlos, es gibt nichts zu kaufen.', 'Our client mod for Fabric and NeoForge. Everything in it is free, there is nothing to buy.'))}</p>
          <div class="cta" data-home-cl-cta><a class="btn primary" href="/client/" data-link>${t(L('Zur Garderobe', 'Open the wardrobe'))}</a></div>
          <p class="anno" data-home-cl-note><i aria-hidden="true"></i>${t(L('Bald verfügbar · Fabric & NeoForge', 'Coming soon · Fabric & NeoForge'))}</p>
        </div>
      </header>
      <div class="feature-cards" data-reveal>${CLIENT_CARDS.map((c) => `<a class="fcard" href="/client/" data-link>
        <span class="fcard-img"><img src="/assets/client/img/${c.img}.webp" alt="" loading="lazy" width="1280" height="720"></span>
        <b>${t(c.name)}</b><span>${t(c.desc)}</span></a>`).join('')}</div>
    </div>
  </section>`;
}

// ------------------------------------------------------------ Vibe Launcher zum Durchklicken

const LAUNCHER_VIEWS = [
  { img: 'home', name: L('Startseite', 'Home'), desc: L('Zuletzt gespielte Instanzen in einer Hotbar, ein Klick startet direkt in die Welt.', 'Recent instances in a hotbar, one click starts straight into your world.') },
  { img: 'discover', name: L('Mods entdecken', 'Discover mods'), desc: L('Modrinth, CurseForge und unser eigener Store in einer Suche.', 'Modrinth, CurseForge and our own store in one search.') },
  { img: 'instance', name: L('Instanzen', 'Instances'), desc: L('Fabric, Quilt, Forge oder NeoForge, jede Instanz mit eigenen Mods und Einstellungen.', 'Fabric, Quilt, Forge or NeoForge, each instance with its own mods and settings.') },
  { img: 'skins', name: L('Skins und Capes', 'Skins and capes'), desc: L('Skins mit 3D-Vorschau wechseln und in einer Bibliothek sammeln.', 'Switch skins with a 3D preview and keep them in a library.') },
];

function launcherBand() {
  return `<section class="band launcher-band" id="launcher" style="--accent:#3b82f6;--on-accent:#fff">
    <div class="wrap lb-grid" data-reveal>
      <div class="lb-copy">
        <p class="kicker">Vibe Launcher · Windows</p>
        <h2 class="display lg">${t(L('Der Launcher.', 'The launcher.'))}<br><span class="hl">${t(L('Schau rein.', 'Take a look.'))}</span></h2>
        <div class="lb-list" role="tablist" aria-label="Vibe Launcher">${LAUNCHER_VIEWS.map((v, i) => `<button class="lb-item" role="tab" aria-selected="${i === 0}" data-lview="${i}">
          <b>${t(v.name)}</b><span>${t(v.desc)}</span></button>`).join('')}</div>
        <div class="cta"><a class="btn primary" href="/launcher/" data-link>${t(L('Zum Launcher', 'View the launcher'))}</a></div>
      </div>
      <div class="lb-window card">
        <div class="lb-bar" aria-hidden="true"><i></i><i></i><i></i><span>Vibe Launcher</span></div>
        <div class="lb-screen">${LAUNCHER_VIEWS.map((v, i) => `<img src="/assets/launcher/img/${v.img}.webp" alt="${esc(tx(L(`Vibe Launcher: ${v.name.de}`, `Vibe Launcher: ${v.name.en}`)))}" width="1280" height="800"${i ? ' loading="lazy" hidden' : ''} data-lshot="${i}">`).join('')}</div>
      </div>
    </div>
  </section>`;
}

// ------------------------------------------------------------ FAQ und Abschluss

function faq(mods) {
  const byMc = new Map();
  for (const m of mods) {
    const k = `Minecraft ${m.mc || '1.21.11'} · ${m.loader || 'Fabric'}`;
    if (!byMc.has(k)) byMc.set(k, []);
    byMc.get(k).push(m.name);
  }
  const versions = [...byMc].map(([k, names]) => `<li><b>${esc(names.join(', '))}</b>: ${esc(k)}</li>`).join('');
  const items = [
    [L('Kostet etwas davon Geld?', 'Does any of it cost money?'),
      L('Nein. Alle Mods, der Vibe Launcher und der Vibey Client sind kostenlos. Im Client gibt es keinen Shop.', 'No. Every mod, the Vibe Launcher and the Vibey Client are free. There is no shop in the client.')],
    [L('Welche Minecraft-Version brauche ich?', 'Which Minecraft version do I need?'),
      L(`Das hängt von der Mod ab:<ul class="faq-list">${versions}</ul>`, `It depends on the mod:<ul class="faq-list">${versions}</ul>`)],
    [L('Wie installiere ich eine Mod?', 'How do I install a mod?'),
      L('Am einfachsten im Vibe Launcher: Store öffnen, Mod wählen, installieren. Von Hand: Fabric Loader installieren, die <code>.jar</code> in den <code>mods</code>-Ordner legen und Minecraft starten.', 'The easiest way is the Vibe Launcher: open the store, pick a mod, install. By hand: install Fabric Loader, drop the <code>.jar</code> into your <code>mods</code> folder and start Minecraft.')],
    [L('Woher kommen die Downloads?', 'Where do the downloads come from?'),
      L('Direkt aus den GitHub-Releases der Projekte. Im <a href="/downloads/" data-link>Download-Center</a> steht zu jeder Datei die SHA-256-Prüfsumme und das Ergebnis von VirusTotal.', 'Straight from the projects’ GitHub releases. The <a href="/downloads/" data-link>download center</a> lists the SHA-256 checksum and the VirusTotal result for every file.')],
    [L('Wo melde ich Fehler oder Wünsche?', 'Where do I report bugs or ideas?'),
      L('Auf GitHub unter <a href="https://github.com/vibec-studios" target="_blank" rel="noopener">vibec-studios</a>, im Repository der jeweiligen Mod unter „Issues“.', 'On GitHub at <a href="https://github.com/vibec-studios" target="_blank" rel="noopener">vibec-studios</a>, under “Issues” in the mod’s repository.')],
    [L('Ist das ein offizielles Minecraft-Produkt?', 'Is this an official Minecraft product?'),
      L('Nein. Vibe Craft Studios ist ein unabhängiges Studio und nicht mit Mojang oder Microsoft verbunden.', 'No. Vibe Craft Studios is an independent studio and not associated with Mojang or Microsoft.')],
  ];
  return `<section class="band faq-band" id="faq">
    <div class="wrap faq-grid">
      <header class="band-head" data-reveal>
        <p class="kicker">FAQ</p>
        <h2 class="display lg">${t(L('Häufige', 'Common'))}<br><span class="hl">${t(L('Fragen.', 'questions.'))}</span></h2>
        <p class="lead">${t(L('Etwas fehlt? Schreib uns auf GitHub.', 'Something missing? Ask us on GitHub.'))}</p>
      </header>
      <div class="faq" data-reveal>${items.map(([q, a], i) => `<details class="faq-item"${i === 0 ? ' open' : ''}><summary>${t(q)}</summary><div class="faq-a">${t(a)}</div></details>`).join('')}</div>
    </div>
  </section>`;
}

function finale(mods, dl) {
  // Neuestes Release über alle Mods: zeigt, dass hier gearbeitet wird
  let newest = null;
  for (const m of mods) {
    const r = latestRelease(dl, m.id);
    if (r && (!newest || r.date > newest.r.date)) newest = { m, r };
  }
  return `<section class="band finale">
    <div class="wrap finale-grid" data-reveal>
      <div>
        <h2 class="display lg">${t(L('Alle Downloads', 'Every download'))}<br><span class="hl">${t(L('an einem Ort.', 'in one place.'))}</span></h2>
        <p class="lead">${t(L('Jede Version jeder Mod, direkt aus GitHub, mit Changelog und Prüfsumme.', 'Every version of every mod, straight from GitHub, with changelog and checksum.'))}</p>
      </div>
      <div>
        <a class="btn primary lg" href="/downloads/" data-link>${t(L('Zum Download-Center', 'Open download center'))}</a>
        ${newest ? `<p class="anno"><i aria-hidden="true"></i>${t(L('Zuletzt erschienen', 'Latest release'))}: <a href="${newest.m.path}" data-link>${esc(newest.m.name)} ${esc(newest.r.version)}</a> · ${fmtDate(newest.r.date)}</p>` : ''}
      </div>
    </div>
  </section>`;
}

export function render(mods, dl) {
  heroMod = pickHeroMod(mods);
  const solo = mods.filter((m) => !m.series);
  return `<div class="home">
    ${hero(mods, dl)}
    ${seriesBand(mods, dl)}
    ${solo.map((m, i) => spotBand(m, dl, i)).join('')}
    ${clientBand()}
    ${launcherBand()}
    ${faq(mods)}
    ${finale(mods, dl)}
  </div>`;
}

// ------------------------------------------------------------ Leben

function liveLine(root, signal) {
  const el = $('[data-live]', root);
  if (!el) return;
  fetchStatus(signal).then((res) => {
    if (signal.aborted || res.state !== 'ok') return;
    const p = res.data?.players ?? 0, w = res.data?.worlds ?? 0;
    $('span', el).innerHTML = p > 0
      ? t(L(`${p} Spieler gerade über Vibey online`, `${p} ${p === 1 ? 'player' : 'players'} online through Vibey right now`))
      : w > 0 ? t(L(`${w} ${w === 1 ? 'Welt' : 'Welten'} gerade über Vibey gehostet`, `${w} ${w === 1 ? 'world' : 'worlds'} hosted through Vibey right now`))
        : t(L('Vibey-Relay online', 'Vibey relay online'));
    el.hidden = false;
  }).catch(() => {});
}

function seriesTabs(root, mods, signal) {
  const tabs = $$('.series-band .tab', root);
  if (!tabs.length) return;
  const started = new Set();
  const start = (id) => {
    if (started.has(id)) return;
    started.add(id);
    const m = mods.find((x) => x.id === id);
    const c = $(`canvas[data-series="${id}"]`, root);
    if (m && c) heroScene(c, m, signal, { zoomBoss: 0.85 }).catch(console.error);
  };
  const select = (tab, focus) => {
    tabs.forEach((b) => {
      const on = b === tab;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      $(`#${b.getAttribute('aria-controls')}`, root).hidden = !on;
    });
    if (focus) tab.focus();
    start(tab.id.slice(4));
  };
  tabs.forEach((b, i) => {
    b.tabIndex = i ? -1 : 0;
    b.addEventListener('click', () => select(b), { signal });
    b.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      select(tabs[(i + d + tabs.length) % tabs.length], true);
    }, { signal });
  });
  // Erste 3D-Bühne erst laden, wenn der Abschnitt in Sicht kommt
  const band = $('.series-band', root);
  const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { io.disconnect(); start(tabs.find((b) => b.getAttribute('aria-selected') === 'true').id.slice(4)); } }, { rootMargin: '400px' });
  io.observe(band);
  signal.addEventListener('abort', () => io.disconnect());
}

function launcherViews(root, signal) {
  const items = $$('.lb-item', root);
  const shots = $$('.lb-screen img', root);
  let timer = 0, user = false, cur = 0;
  const show = (i) => {
    cur = i;
    items.forEach((b, k) => b.setAttribute('aria-selected', String(k === i)));
    shots.forEach((s, k) => { s.hidden = k !== i; });
  };
  items.forEach((b, i) => b.addEventListener('click', () => { user = true; clearInterval(timer); show(i); }, { signal }));
  // Ohne Klick wechselt die Ansicht von selbst, solange der Abschnitt sichtbar ist
  const band = $('.launcher-band', root);
  if (!band) return;
  const io = new IntersectionObserver((es) => {
    clearInterval(timer);
    if (es[0].isIntersecting && !user && !matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => show((cur + 1) % items.length), 5000);
  }, { threshold: 0.4 });
  io.observe(band);
  signal.addEventListener('abort', () => { io.disconnect(); clearInterval(timer); });
}

export async function mount(root, mods, signal) {
  animateIcons(root);
  liveLine(root, signal);
  seriesTabs(root, mods, signal);
  launcherViews(root, signal);
  // Vibey Client: sobald die API ein Release meldet, führt der Knopf zum Download auf der Client-Seite
  fetchClientRelease(signal).then((rel) => {
    if (!rel || signal?.aborted) return;
    const loaders = [...new Set(rel.files.map((f) => f.loader))].map((l) => (l === 'neoforge' ? 'NeoForge' : l.charAt(0).toUpperCase() + l.slice(1)));
    $('[data-home-cl-cta]', root).innerHTML = `<a class="btn primary" href="/client/#download" data-link>↓ Download</a><a class="btn" href="/client/#garderobe" data-link>${t(L('Zur Garderobe', 'Open the wardrobe'))}</a>`;
    $('[data-home-cl-note]', root).innerHTML = `<i aria-hidden="true"></i>v${esc(rel.version)} · ${esc(loaders.join(' & '))}`;
  });
  heroScene($('.hero-canvas', root), heroMod || mods[0], signal).catch(console.error);
  // Bänder ohne Screenshot zeigen ihre 3D-Bühne
  $$('canvas[data-spot]', root).forEach((c) => {
    const m = mods.find((x) => x.id === c.dataset.spot);
    if (m) heroScene(c, m, signal).catch(console.error);
  });
}
