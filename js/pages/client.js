// Seite des Vibey Client: Garderobe mit allen Cosmetics und Emotes, 3D-Vorschau am Referenz-Spieler (vibey3d.js).
// Daten: live aus der öffentlichen Katalog-API (vibe.henny.dev, CORS für GET erlaubt). Fällt sie aus, nimmt die Seite
// das gebündelte Paket aus tools/cosmetics.py (data/cosmetics.json + assets/client/). Kein Shop, keine Preise: alles kostenlos,
// die Seltenheit ist nur ein Label. Download live über /api/v1/client/latest (client-dl.js), sonst „Bald verfügbar“.
// Das Repo ist privat: keine Links darauf.
import { $, $$, t, tx, esc, openLightbox } from '../core.js';
import { wardrobeViewer, planFor } from '../vibey3d.js';
import { fetchClientRelease, renderClientDownload, blockbenchLink } from '../client-dl.js';

const L = (de, en) => ({ de, en });
export const ACCENT = '#3b82f6';
const BASE = '/assets/client';
const API = 'https://vibe.henny.dev';
const abs = (u) => (u && !/^https?:/.test(u) ? API + u : u);

/** Katalog live laden (ohne eigene Header, also ohne Preflight); bei Fehler oder nach 6 s das gebündelte Paket. */
async function loadCatalog(signal) {
  const local = fetch('/data/cosmetics.json', { cache: 'no-cache', signal }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 6000);
    signal?.addEventListener('abort', () => ctl.abort(), { once: true });
    const r = await fetch(`${API}/api/v1/cosmetics/catalog`, { signal: ctl.signal });
    clearTimeout(timer);
    if (!r.ok) throw new Error(`catalog ${r.status}`);
    const cat = await r.json();
    const bundled = new Map(((await local)?.items ?? []).map((it) => [it.id, it]));
    const items = cat.items.filter((it) => it.asset?.url)
      .sort((a, b) => (a.kind !== 'cosmetic') - (b.kind !== 'cosmetic') || (a.sort ?? 0) - (b.sort ?? 0))
      .map((it) => {
        const b = bundled.get(it.id);
        return {
          id: it.id, kind: it.kind, slot: it.slot, name: it.name, description: it.description, rarity: it.rarity ?? 'common',
          tags: it.tags ?? [], author: it.author, file: abs(it.asset.url), fallback: b?.file ?? null,
          thumb: abs(it.thumbnailUrl) ?? b?.thumb ?? null, thumbFallback: b?.thumb ?? null,
        };
      });
    if (!items.length) throw new Error('catalog empty');
    return items;
  } catch (e) {
    if (signal?.aborted) throw e;
    const l = await local;
    if (!l) throw e;
    return l.items;
  }
}

const SLOTS = [
  ['cape', L('Umhänge', 'Capes'), L('Umhang', 'Cape')],
  ['wings', L('Flügel', 'Wings'), L('Flügel', 'Wings')],
  ['aura', L('Auren', 'Auras'), L('Aura', 'Aura')],
  ['pet', L('Begleiter', 'Pets'), L('Begleiter', 'Pet')],
  ['shield', L('Schilde', 'Shields'), L('Schild', 'Shield')],
  ['hat', L('Hüte', 'Hats'), L('Hut', 'Hat')],
  ['back', L('Rücken', 'Back'), L('Rücken', 'Back')],
  ['emote', L('Emotes', 'Emotes'), L('Emote', 'Emote')],
];
const RARITY = {
  common: [L('Gewöhnlich', 'Common'), '#a1a1aa'], rare: [L('Selten', 'Rare'), '#3fe0c5'],
  epic: [L('Episch', 'Epic'), '#8b6cff'], legendary: [L('Legendär', 'Legendary'), '#ffb547'],
};
const MODES = { idle: L('Ruhe', 'Idle'), fly: L('Fliegen', 'Flying'), walk: L('Laufen', 'Walking') };
const catOf = (it) => (it.kind === 'emote' ? 'emote' : it.slot);
const slotLabel = (it) => t((SLOTS.find((s) => s[0] === catOf(it)) || [])[2] || L('Cosmetic', 'Cosmetic'));
const name = (it) => t(L(it.name.de || it.name.en, it.name.en));

const SHOTS = [
  ['cosmetics-all', L('Flügel, Hut, Aura und Begleiter gleichzeitig im Spiel', 'Wings, hat, aura and pet at once in game')],
  ['emote-guitar', L('Emote „Gitarre“ mit Noten', 'The “Guitar” emote with notes')],
  ['wardrobe', L('Die Garderobe im Spiel', 'The wardrobe in game')],
  ['emote-wheel', L('Emote-Rad: halten, wählen, loslassen', 'Emote wheel: hold, pick, release')],
  ['cosmetics-wings-crown', L('Kristall-Eisflügel und Eiskrone', 'Crystal ice wings and ice crown')],
  ['cosmetics-aura-penguin', L('Aura mit Pixel-Pinguin als Begleiter', 'Aura with the pixel penguin as a pet')],
];

export function title() { return 'Vibey Client · Vibe Craft Studios'; }

export function render() {
  const shot = (k, cap, cls = '') => `<figure class="shot${cls}"><button type="button" data-cshot="${k}"><img src="${BASE}/img/${k}.webp" alt="${esc(tx(cap))}" loading="lazy"></button><figcaption>${t(cap)}</figcaption></figure>`;
  return `<div class="client-page" style="--accent:${ACCENT};--on-accent:#fff">
  <section class="hero mod-hero lp-hero">
    <div class="wrap lp-hero-grid">
      <div class="hero-copy">
        <div class="lp-brand"><img class="cl-icon" src="${BASE}/icon.png" alt="" width="104" height="104">
          <div><h1 class="display">Vibey Client</h1><p class="lp-sub" data-cl-sub>${t(L('Client-Mod für Minecraft · in Arbeit', 'Client mod for Minecraft · in the works'))}</p></div></div>
        <p class="lead strong">${t(L('Cosmetics, Emotes und Freunde direkt im Spiel. Alles kostenlos.', 'Cosmetics, emotes and friends right in the game. All free.'))}</p>
        <p class="lead">${t(L('Umhänge, Flügel, Auren, Begleiter, Schilde, Hüte und Rucksäcke, dazu Emotes über ein Rad. Es gibt nichts zu kaufen: Die Seltenheit ist nur ein Label.', 'Capes, wings, auras, pets, shields, hats and backpacks, plus emotes from a wheel. There is nothing to buy: rarity is only a label.'))}</p>
        <div class="lp-download cl-status" id="download" data-cdl>
          <span class="pill cl-soon">${t(L('Bald verfügbar', 'Coming soon'))}</span>
          <p class="lp-file">${t(L('Noch kein Download. Sobald es eine Version gibt, erscheint sie hier und im Vibe Launcher.', 'No download yet. As soon as there is a version, it will show up here and in the Vibe Launcher.'))}</p>
        </div>
        <div class="cta" data-cl-cta><a class="btn primary" href="#garderobe" data-anchor>${t(L('Zur Garderobe', 'Open the wardrobe'))}</a><a class="btn" href="/launcher/" data-link>Vibe Launcher</a></div>
      </div>
      <div class="lp-hero-shots">
        <figure class="lp-hero-shot"><button type="button" data-cshot="title-preview"><img src="${BASE}/img/title-preview.webp" alt="${esc(tx(L('Titelbildschirm mit Vibey Client', 'Title screen with Vibey Client')))}" width="854" height="480"></button></figure>
        <figure class="lp-hero-shot"><button type="button" data-cshot="social-09-invite-toast-game"><img src="${BASE}/img/social-09-invite-toast-game.webp" alt="${esc(tx(L('Einladung eines Freundes als Hinweis im Spiel', 'A friend’s invite as a notice in game')))}" loading="lazy"></button></figure>
      </div>
    </div>
  </section>
  <nav class="toc" aria-label="${esc(tx(L('Inhalt', 'Contents')))}"><div class="wrap toc-inner">
    <a href="#garderobe" data-anchor>${t(L('Garderobe', 'Wardrobe'))}</a><a href="#im-spiel" data-anchor>${t(L('Im Spiel', 'In game'))}</a>
    <a href="#freunde" data-anchor>${t(L('Freunde', 'Friends'))}</a><a href="#creator" data-anchor>${t(L('Für Creator', 'For creators'))}</a>
    <a href="#status" data-anchor class="toc-cta">${t(L('Verfügbarkeit', 'Availability'))}</a></div></nav>

  <section class="section" id="garderobe"><div class="wrap">
    <header class="sec-head">
      <h2 class="display sm">${t(L('Alle Cosmetics und Emotes', 'All cosmetics and emotes'))}</h2>
      <p class="lead">${t(L('Wähle eine Karte, dann erscheint sie in 3D am Spieler. Ziehen dreht die Ansicht, das Mausrad zoomt. Animationen laufen wie im Spiel.', 'Pick a card and it appears in 3D on the player. Drag to turn the view, scroll to zoom. Animations play like in game.'))}</p></header>
    <div class="wardrobe card">
      <nav class="wr-cats" aria-label="${esc(tx(L('Kategorien', 'Categories')))}"></nav>
      <div class="wr-grid" role="list"></div>
      <div class="wr-stage">
        <div class="wr-canvas"><canvas aria-label="${esc(tx(L('3D-Vorschau', '3D preview')))}"></canvas>
          <div class="wr-tools">
            <button type="button" class="chip" data-view="front">${t(L('Vorne', 'Front'))}</button>
            <button type="button" class="chip" data-view="back">${t(L('Hinten', 'Back'))}</button>
            <button type="button" class="chip" data-view="side">${t(L('Seite', 'Side'))}</button>
            <span class="wr-modes"></span>
          </div>
          <p class="wr-hint mono">${t(L('Ziehen zum Drehen', 'Drag to rotate'))}</p>
        </div>
        <div class="wr-info" aria-live="polite"></div>
      </div>
    </div>
    <p class="small cl-note">${t(L('Vorschau mit dem neutralen Referenz-Spieler. Im Spiel trägt jeder höchstens ein Teil pro Slot, Emotes spielen am eigenen Skin.', 'Preview on the neutral reference player. In game everyone wears at most one item per slot, emotes play on your own skin.'))}</p>
  </div></section>

  <section class="section" id="im-spiel"><div class="wrap">
    <header class="sec-head">
      <h2 class="display sm">${t(L('So sieht es in Minecraft aus', 'How it looks in Minecraft'))}</h2>
      <p class="lead">${t(L('Screenshots aus dem automatischen Spieltest. Klicken zum Vergrößern.', 'Screenshots from the automated game test. Click to enlarge.'))}</p></header>
    <div class="gallery">${SHOTS.map(([k, c]) => shot(k, c)).join('')}</div>
  </div></section>

  <section class="section lp-group" id="freunde"><div class="wrap lp-group-grid">
    <div>
      <h2 class="display sm">${t(L('Zusammen spielen', 'Playing together'))}</h2>
      <p class="lead">${t(L('Mit den Vibe-Diensten, optional und abschaltbar, wie im Vibe Launcher.', 'With the Vibe services, optional and switchable, just like in the Vibe Launcher.'))}</p>
      <dl class="specs">
        <div><dt>${t(L('Freundesliste', 'Friends list'))}</dt><dd>${t(L('Anfragen, wer online ist und wo jemand gerade spielt, direkt im Spiel.', 'Requests, who is online and where someone is playing, right in the game.'))}</dd></div>
        <div><dt>${t(L('Chats', 'Chats'))}</dt><dd>${t(L('Nachrichten an einzelne Freunde und Gruppen, auch im Vollbild.', 'Messages to single friends and groups, full screen too.'))}</dd></div>
        <div><dt>${t(L('Einladungen', 'Invites'))}</dt><dd>${t(L('Freunde in deine Welt einladen. Gehostet wird über Vibey Multiplayer mit fester Adresse.', 'Invite friends to your world. Hosting goes through Vibey Multiplayer with a fixed address.'))}</dd></div>
      </dl>
    </div>
    <figure class="lp-shot"><button type="button" data-cshot="social-03-friends-world"><img src="${BASE}/img/social-03-friends-world.webp" alt="${esc(tx(L('Freundesliste mit Einladung in eine Welt', 'Friends list with an invite to a world')))}" loading="lazy"></button><figcaption>${t(L('Freundesliste mit Einladung in eine Welt', 'Friends list with an invite to a world'))}</figcaption></figure>
  </div></section>

  <section class="section lp-group no-shot" id="creator"><div class="wrap lp-group-grid">
    <div>
      <h2 class="display sm">${t(L('Eigene Cosmetics bauen', 'Build your own cosmetics'))}</h2>
      <dl class="specs">
        <div><dt>${t(L('Eine Datei', 'One file'))}</dt><dd>${t(L('Jedes Cosmetic und jedes Emote ist eine <code>.vibey</code>-Datei mit Modell, Texturen, Animationen, Partikeln und Sounds.', 'Every cosmetic and emote is one <code>.vibey</code> file with model, textures, animations, particles and sounds.'))}</dd></div>
        <div><dt>Blockbench</dt><dd>${t(L('Modellieren und animieren in Blockbench, exportieren mit dem Vibey-Plugin. Was am Referenz-Spieler in Blockbench stimmt, stimmt auch im Spiel.', 'Model and animate in Blockbench, export with the Vibey plugin. What looks right on the reference player in Blockbench looks right in game.'))}</dd></div>
        <div><dt>${t(L('Live testen', 'Test live'))}</dt><dd>${t(L('Im Creator-Modus schiebt Blockbench Änderungen direkt ins laufende Spiel.', 'In creator mode, Blockbench pushes changes straight into the running game.'))}</dd></div>
        <div><dt>${t(L('Keine Preise', 'No prices'))}</dt><dd>${t(L('Felder für Preise werden beim Prüfen abgelehnt. Alles bleibt kostenlos.', 'Price fields are rejected by the validator. Everything stays free.'))}</dd></div>
      </dl>
      <div class="cta cl-bb" data-bb hidden></div>
    </div>
  </div></section>

  <section class="outro" id="status"><div class="wrap"><div class="card outro-grid">
    <div>
      <h2 class="display sm" data-out-h>${t(L('Vibey Client: bald verfügbar', 'Vibey Client: coming soon'))}</h2>
      <p class="lead" data-out-p>${t(L('Der Client ist fast fertig. Sobald die erste Version erscheint, gibt es sie oben auf dieser Seite für Fabric und NeoForge, und der Vibe Launcher installiert sie mit einem Klick.', 'The client is almost done. As soon as the first version is out, it will be at the top of this page for Fabric and NeoForge, and the Vibe Launcher installs it in one click.'))}</p>
      <div class="cta" data-out-cta><a class="btn primary" href="/launcher/" data-link>Vibe Launcher</a></div>
    </div>
    <ul class="req"><li>${t(L('Kostenlos, keine Käufe', 'Free, no purchases'))}</li><li>${t(L('Deutsch und Englisch', 'German and English'))}</li><li>${t(L('Cosmetics und Emotes', 'Cosmetics and emotes'))}</li><li>${t(L('Freunde über die Vibe-Dienste (optional)', 'Friends through the Vibe services (optional)'))}</li></ul>
  </div></div></section>
</div>`;
}

function card(it) {
  const [rl, rc] = RARITY[it.rarity] || RARITY.common;
  return `<button type="button" class="wr-card" role="listitem" data-id="${esc(it.id)}" style="--rc:${rc}">
    <span class="wr-thumb">${it.thumb ? `<img src="${esc(it.thumb)}" alt="" loading="lazy" width="256" height="256"${it.thumbFallback && it.thumbFallback !== it.thumb ? ` data-fb="${esc(it.thumbFallback)}"` : ''}>` : ''}</span>
    <span class="wr-name">${name(it)}</span>
    <span class="wr-meta mono">${slotLabel(it)} · <b>${t(rl)}</b></span></button>`;
}

function info(it) {
  const [rl, rc] = RARITY[it.rarity] || RARITY.common;
  return `<p class="wr-kicker mono">${slotLabel(it)}</p>
    <h3>${name(it)}</h3>
    <p class="wr-rarity mono" style="--rc:${rc}">${t(rl)}</p>
    ${it.description ? `<p class="wr-desc">${t(L(it.description.de || it.description.en, it.description.en))}</p>` : ''}
    <p class="wr-tags mono">${(it.tags || []).filter((x) => x !== 'starter').map((x) => `<span>${esc(x)}</span>`).join('')}</p>`;
}

/** Live-Prüfung bei jedem Aufruf: gibt es einen Release, ersetzen Download-Auswahl und Texte das „Bald verfügbar“. */
async function mountDownload(root, signal) {
  const rel = await fetchClientRelease(signal);
  if (!rel || signal?.aborted) return;
  const v = `v${esc(rel.version)}`;
  const set = (sel, html) => { const el = $(sel, root); if (el) el.innerHTML = html; };
  set('[data-cl-sub]', `${t(L('Client-Mod für Minecraft', 'Client mod for Minecraft'))} · ${v}`);
  renderClientDownload($('[data-cdl]', root), rel);
  $('[data-cdl]', root).classList.remove('cl-status');
  set('[data-cl-cta]', `<a class="btn ghost" href="#garderobe" data-anchor>${t(L('Zur Garderobe', 'Open the wardrobe'))}</a>`);
  const bb = blockbenchLink(rel);
  if (bb) { const el = $('[data-bb]', root); el.innerHTML = bb; el.hidden = false; }
  set('[data-out-h]', `${t(L('Vibey Client herunterladen', 'Download Vibey Client'))} ${v}`);
  set('[data-out-p]', t(L('Am einfachsten installierst du den Client über den Vibe Launcher, der Fabric API und Co. gleich mitbringt. Das Jar für Fabric oder NeoForge gibt es oben auch direkt.', 'The easiest way to install the client is the Vibe Launcher, which brings Fabric API and friends along. The jar for Fabric or NeoForge is also available directly above.')));
  set('[data-out-cta]', `<a class="btn primary" href="#download" data-anchor>${t(L('Zum Download', 'Go to download'))}</a><a class="btn ghost" href="/launcher/" data-link>Vibe Launcher</a>`);
}

export async function mount(root, signal) {
  mountDownload(root, signal).catch(console.error);
  $$('[data-cshot]', root).forEach((b) => b.addEventListener('click', () => {
    const img = $('img', b);
    openLightbox(img.src, `<b>${esc(img.alt)}</b>`);
  }, { signal }));

  let items;
  try {
    items = await loadCatalog(signal);
  } catch (e) {
    if (e.name !== 'AbortError') $('.wr-grid', root).innerHTML = `<p class="small">${t(L('Der Katalog ist gerade nicht erreichbar.', 'The catalog is not available right now.'))}</p>`;
    return;
  }
  const cats = $('.wr-cats', root);
  const grid = $('.wr-grid', root);
  const counts = Object.fromEntries(SLOTS.map(([k]) => [k, items.filter((it) => catOf(it) === k).length]));
  let cat = 'all';
  cats.innerHTML = [`<button type="button" class="wr-cat on" data-cat="all"><span>${t(L('Alle', 'All'))}</span><i class="wr-n">${items.length}</i></button>`,
    ...SLOTS.filter(([k]) => counts[k]).map(([k, lbl]) => `<button type="button" class="wr-cat" data-cat="${k}"><span>${t(lbl)}</span><i class="wr-n">${counts[k]}</i></button>`)].join('');
  const paint = () => {
    grid.innerHTML = items.filter((it) => cat === 'all' || catOf(it) === cat).map(card).join('');
    grid.querySelector(`[data-id="${CSS.escape(selected?.id || '')}"]`)?.classList.add('on');
  };

  const viewer = wardrobeViewer($('.wr-canvas canvas', root), { signal });
  const modes = $('.wr-modes', root);
  let selected = null;
  const select = async (it, scroll = false) => {
    selected = it;
    $$('.wr-card', grid).forEach((c) => c.classList.toggle('on', c.dataset.id === it.id));
    $('.wr-info', root).innerHTML = info(it);
    const B = await viewer.show(it.file, it.fallback).catch(() => null);
    if (!B || selected !== it) return;
    const plan = planFor(B.json);
    modes.innerHTML = plan.emote
      ? `<button type="button" class="chip" data-replay>${t(L('Nochmal', 'Replay'))}</button>`
      : (plan.modes.length > 1 ? plan.modes.map((m, i) => `<button type="button" class="chip${i ? '' : ' on'}" data-mode="${m}">${t(MODES[m] || L(m, m))}</button>`).join('') : '');
    if (scroll && matchMedia('(max-width: 960px)').matches) $('.wr-stage', root).scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  cats.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    cat = b.dataset.cat;
    $$('.wr-cat', cats).forEach((x) => x.classList.toggle('on', x === b));
    paint();
  }, { signal });
  // Vorschaubild aus der API nicht erreichbar: gebündeltes nehmen
  grid.addEventListener('error', (e) => {
    const img = e.target;
    if (img.tagName === 'IMG' && img.dataset.fb) { img.src = img.dataset.fb; delete img.dataset.fb; }
  }, { capture: true, signal });
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('[data-id]');
    if (b) select(items.find((it) => it.id === b.dataset.id), true);
  }, { signal });
  $('.wr-tools', root).addEventListener('click', (e) => {
    const v = e.target.closest('[data-view]');
    const m = e.target.closest('[data-mode]');
    if (v) viewer.view(v.dataset.view);
    if (m) { viewer.setMode(m.dataset.mode); $$('[data-mode]', modes).forEach((x) => x.classList.toggle('on', x === m)); }
    if (e.target.closest('[data-replay]')) viewer.replay();
  }, { signal });

  paint();
  select(items.find((it) => it.id === 'vibey:aurora_cape') || items[0]);
}
