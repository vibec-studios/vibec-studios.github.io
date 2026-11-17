// Download-Center: alle Mods mit ihren GitHub-Releases, Prüfsumme und VirusTotal-Ergebnis (Daten: data/downloads.json).
import { $, $$, t, tx, esc, animateIcons, onColor } from '../core.js';
import { releasesOf, latestRelease, vtLink } from '../downloads.js';

const L = (de, en) => ({ de, en });
export const ACCENT = '#3fe0c5';

const REQ_LINKS = {
  'fabric api': 'https://modrinth.com/mod/fabric-api',
  'fabric language kotlin': 'https://modrinth.com/mod/fabric-language-kotlin',
};

function size(bytes) {
  return bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
function date(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const f = (l) => d.toLocaleDateString(l === 'de' ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  return t(L(f('de'), f('en')));
}

/** VirusTotal-Ergebnis als Abzeichen; ohne Ergebnis ein Link zum Nachsehen per Prüfsumme. */
function vtBadge(asset, compact = false) {
  const v = asset.vt || {};
  const href = vtLink(asset.sha256);
  let cls = 'none', label, detail = '';
  if (v.status === 'done') {
    const hits = v.malicious + v.suspicious;
    cls = hits ? 'warn' : 'ok';
    label = hits ? t(L(`${hits} von ${v.total} melden etwas`, `${hits} of ${v.total} flag it`)) : t(L('Sauber', 'Clean'));
    detail = hits ? '' : t(L(`0 / ${v.total} Virenscanner`, `0 / ${v.total} engines`));
  } else if (v.status === 'pending') {
    cls = 'wait'; label = t(L('Scan läuft', 'Scan running'));
  } else {
    label = t(L('Auf VirusTotal prüfen', 'Check on VirusTotal'));
  }
  return `<a class="vt ${cls}${compact ? ' compact' : ''}" href="${href}" target="_blank" rel="noopener" title="VirusTotal">
    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1 2 3.5v4C2 11 4.6 13.9 8 15c3.4-1.1 6-4 6-7.5v-4L8 1Z"/>${cls === 'ok' ? '<path class="tick" d="m5 8 2 2 4-4"/>' : ''}</svg>
    <span><b>${label}</b>${!compact && detail ? `<i>${detail}</i>` : ''}</span></a>`;
}

function reqList(mod) {
  return (mod.requires || []).map((r) => {
    const label = typeof r === 'object' ? t(r) : esc(r);
    const key = String(typeof r === 'object' ? r.en : r).toLowerCase().replace(/\s*([≥>]|\().*$/, '').trim();
    if (key === 'h&h armors') return `<a href="/downloads/#hha" data-open="hha">${label}</a>`;
    const href = REQ_LINKS[key];
    return href ? `<a href="${href}" target="_blank" rel="noopener">${label} ↗</a>` : `<span>${label}</span>`;
  }).join('');
}

function tagOf(mod) {
  return mod.series ? `${esc(mod.series)} · ${mod.role === 'core' ? t(L('Hauptmod', 'Core mod')) : mod.role === 'addon' ? 'Addon' : 'Mod'}` : t(L('Eigenständige Mod', 'Standalone mod'));
}
const iconOf = (mod, cls = '') => `<span class="px-icon dl-icon ${cls}" data-src="${mod.base}/${mod.icon || 'icon.png'}"></span>`;

/** Kompakte Kachel je Mod: alles Wichtige auf einen Blick, die Details stehen im Dialog. */
function tile(mod, dl) {
  const rel = latestRelease(dl, mod.id);
  const head = `<header class="dl-tile-head">${iconOf(mod)}<div><p class="eyebrow">${tagOf(mod)}</p>
      <h2><a href="${mod.path}" data-link>${esc(mod.name)}</a></h2></div></header>
    <p class="dl-tag">${t(mod.tagline)}</p>`;
  if (!rel) {
    return `<article class="dl-tile soon" id="${mod.id}" style="--accent:${mod.accent}">${head}
      <p class="mono small dl-meta">Minecraft ${esc(mod.mc || '1.21.11')} · ${esc(mod.loader || 'Fabric')}</p>
      <div class="dl-tile-foot"><span class="mono small dl-soon-label">${t(L('Bald verfügbar', 'Coming soon'))}</span>
        <a class="btn ghost" href="${mod.path}" data-link>${t(L('Zur Mod', 'View mod'))}</a></div></article>`;
  }
  const v = rel.assets.length > 1 ? variants(rel) : null;
  const loaders = v ? v.loaders.map((l) => LOADERS[l] || l).join(' & ') : esc(mod.loader || 'Fabric');
  const files = v ? t(L(`${rel.assets.length} Dateien`, `${rel.assets.length} files`)) : size(rel.assets[0].size);
  return `<article class="dl-tile" id="${mod.id}" style="--accent:${mod.accent};--on-accent:${onColor(mod.accent)}">${head}
    <p class="mono small dl-meta"><b>v${esc(rel.version)}</b> · ${date(rel.date)}<br>${loaders} · Minecraft ${esc(mod.mc || '1.21.11')} · ${files}</p>
    <div class="dl-tile-foot">${v ? vtSummary(rel.assets, true) : vtBadge(rel.assets[0], true)}
      <button type="button" class="btn accent" data-open="${mod.id}">↓ ${t(L('Herunterladen', 'Download'))}</button></div>
  </article>`;
}

// ------------------------------------------------------------ Viele Dateien: Auswahl-Dialog (Loader → Minecraft-Version)

const LOADERS = { fabric: 'Fabric', neoforge: 'NeoForge', forge: 'Forge', quilt: 'Quilt' };

/** „vibey-multiplayer-neoforge-1.21-1.21.1-1.0.0.jar“ → { loader: 'neoforge', mc: '1.21-1.21.1' } (null, wenn das Muster nicht passt) */
export function parseJar(name) {
  const m = name.match(/^.+?-(fabric|neoforge|forge|quilt)-(.+)-(\d+\.\d+(?:\.\d+)?(?:[-+][0-9A-Za-z.]+)?)\.jar$/i);
  return m ? { loader: m[1].toLowerCase(), mc: m[2] } : null;
}
const mcLabel = (mc) => mc.replace(/-/g, ' – ');
/** Sortierschlüssel: höchste Version im Bereich, neueste zuerst. */
function mcKey(mc) {
  const top = mc.split('-').pop().split('.').map(Number);
  return top[0] * 1e6 + (top[1] || 0) * 1e3 + (top[2] || 0);
}
/** Gruppiert die Jars eines Releases; null, wenn sie sich nicht nach Loader/Version zuordnen lassen. */
function variants(rel) {
  const files = rel.assets.map((a) => ({ ...a, ...parseJar(a.name) })).filter((a) => a.loader);
  if (files.length < 2) return null;
  const loaders = [...new Set(files.map((f) => f.loader))].sort((a, b) => (a === 'fabric' ? -1 : b === 'fabric' ? 1 : a.localeCompare(b)));
  const versions = [...new Set(files.map((f) => f.mc))].sort((a, b) => mcKey(b) - mcKey(a));
  return { files, loaders, versions };
}

function vtSummary(assets, compact = false) {
  const done = assets.filter((x) => x.vt?.status === 'done');
  const hits = done.filter((x) => x.vt.malicious + x.vt.suspicious).length;
  if (done.length === assets.length && !hits) {
    if (compact) return `<span class="vt ok compact"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1 2 3.5v4C2 11 4.6 13.9 8 15c3.4-1.1 6-4 6-7.5v-4L8 1Z"/><path class="tick" d="m5 8 2 2 4-4"/></svg><span><b>${t(L('Alle sauber', 'All clean'))}</b></span></span>`;
    return `<span class="vt ok"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1 2 3.5v4C2 11 4.6 13.9 8 15c3.4-1.1 6-4 6-7.5v-4L8 1Z"/><path class="tick" d="m5 8 2 2 4-4"/></svg><span><b>${t(L('Alle Dateien sauber', 'All files clean'))}</b><i>${t(L(`${assets.length} von ${assets.length} gescannt`, `${assets.length} of ${assets.length} scanned`))}</i></span></span>`;
  }
  if (hits) return `<span class="vt warn"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1 2 3.5v4C2 11 4.6 13.9 8 15c3.4-1.1 6-4 6-7.5v-4L8 1Z"/></svg><span><b>${t(L(`${hits} Dateien gemeldet`, `${hits} files flagged`))}</b><i>${t(L('Details im Dialog', 'Details in the dialog'))}</i></span></span>`;
  return `<span class="vt wait"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1 2 3.5v4C2 11 4.6 13.9 8 15c3.4-1.1 6-4 6-7.5v-4L8 1Z"/></svg><span><b>${t(L(`${done.length} von ${assets.length} gescannt`, `${done.length} of ${assets.length} scanned`))}</b><i>${t(L('der Rest folgt automatisch', 'the rest follows automatically'))}</i></span></span>`;
}

const DIALOG = `<dialog class="dl-dialog" aria-labelledby="dlg-title">
  <form method="dialog"><button class="icon-btn dlg-close" aria-label="${esc(tx(L('Schließen', 'Close')))}">✕</button></form>
  <header class="dlg-head"><span class="px-icon dl-icon dlg-icon"></span><div><p class="eyebrow dlg-tag"></p><h2 id="dlg-title"></h2><p class="mono small dlg-ver"></p></div></header>
  <div class="dlg-body"></div></dialog>`;

const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* privat */ } },
};

/** Dateien eines Releases mit Loader und Minecraft-Version; Jars ohne Muster im Namen gelten für Loader/Version der Mod. */
function filesOf(mod, rel) {
  const fallbackLoader = String(mod.loader || 'Fabric').split('/')[0].trim().toLowerCase();
  return rel.assets.map((a) => {
    const p = parseJar(a.name);
    return { ...a, loader: p?.loader || fallbackLoader, mc: p?.mc || mod.mc || '1.21.11', guessed: !p };
  });
}

const step = (n, label, group, extra = '') => `<div class="dlg-step" data-step="${group}"><p class="k mono"><span class="dlg-n">${n}</span> · ${label}</p>
  <div class="${group === 'loader' ? 'dlg-seg' : 'dlg-mc'}" role="radiogroup" data-group="${group}"></div>${extra}</div>`;

/**
 * Ein Dialog für alle Mods: Mod-Version, Loader und Minecraft-Version wählen, dann die passende Datei mit Virenscan,
 * Prüfsumme und Download. Schritte mit nur einer Möglichkeit werden ausgeblendet.
 */
function openDialog(dialog, mod, dl, onOpen) {
  const releases = releasesOf(dl, mod.id).filter((r) => r.assets?.length);
  const latest = latestRelease(dl, mod.id);
  if (!latest || !releases.length) return;
  dialog.style.setProperty('--accent', mod.accent);
  dialog.style.setProperty('--on-accent', onColor(mod.accent));
  dialog.querySelector('.dlg-tag').innerHTML = tagOf(mod);
  dialog.querySelector('#dlg-title').textContent = mod.name;
  const icon = dialog.querySelector('.dlg-icon');
  icon.dataset.src = `${mod.base}/${mod.icon || 'icon.png'}`;
  icon.style.backgroundImage = `url(${icon.dataset.src})`;
  animateIcons(dialog);

  const body = dialog.querySelector('.dlg-body');
  body.innerHTML = step('', t(L('Version', 'Version')), 'rel')
    + step('', 'Loader', 'loader')
    + step('', t(L('Minecraft-Version', 'Minecraft version')), 'mc', `<p class="small dlg-hint">${t(L('Deine Version steht unten links im Hauptmenü von Minecraft.', 'Your version is shown bottom left in the Minecraft main menu.'))}</p>`)
    + '<div class="dlg-result"></div>';

  const key = `vcs-dl-${mod.id}`;
  const saved = store.get(key) || {};
  const pick = { rel: latest.tag, loader: saved.loader, mc: saved.mc };
  const relOf = () => releases.find((r) => r.tag === pick.rel) || latest;

  function paint() {
    const rel = relOf();
    const files = filesOf(mod, rel);
    const loaders = [...new Set(files.map((f) => f.loader))].sort((a, b) => (a === 'fabric' ? -1 : b === 'fabric' ? 1 : a.localeCompare(b)));
    if (!loaders.includes(pick.loader)) pick.loader = loaders[0];
    const forLoader = files.filter((f) => f.loader === pick.loader);
    const versions = [...new Set(files.map((f) => f.mc))].sort((a, b) => mcKey(b) - mcKey(a));
    if (!forLoader.some((f) => f.mc === pick.mc)) pick.mc = versions.find((mc) => forLoader.some((f) => f.mc === mc));

    // Schritte: nur zeigen, was es zu wählen gibt; Nummern laufen mit
    let n = 0;
    const show = (group, visible) => {
      const el = body.querySelector(`[data-step="${group}"]`);
      el.hidden = !visible;
      if (visible) el.querySelector('.dlg-n').textContent = String(++n);
    };
    show('rel', releases.length > 1);
    show('loader', loaders.length > 1);
    show('mc', versions.length > 1);

    body.querySelector('[data-group="rel"]').innerHTML = releases.map((r) =>
      `<button type="button" role="radio" aria-checked="${r.tag === rel.tag}" data-rel="${esc(r.tag)}">v${esc(r.version)}${r === latest ? ` <small>${t(L('aktuell', 'latest'))}</small>` : ''}</button>`).join('');
    body.querySelector('[data-group="loader"]').innerHTML = loaders.map((l) =>
      `<button type="button" role="radio" aria-checked="${l === pick.loader}" data-loader="${esc(l)}">${LOADERS[l] || esc(l)}</button>`).join('');
    body.querySelector('[data-group="mc"]').innerHTML = versions.map((mc) => {
      const has = forLoader.some((f) => f.mc === mc);
      return `<button type="button" role="radio" aria-checked="${mc === pick.mc}" data-mc="${esc(mc)}"${has ? '' : ' disabled'}>${esc(mcLabel(mc))}</button>`;
    }).join('');

    dialog.querySelector('.dlg-ver').innerHTML = `v${esc(rel.version)} · ${date(rel.date)}${rel.prerelease ? ` · ${t(L('Vorabversion', 'Pre-release'))}` : ''}`;
    const f = forLoader.find((x) => x.mc === pick.mc) || forLoader[0];
    const req = reqList(mod);
    body.querySelector('.dlg-result').innerHTML = f ? `
      <div class="dlg-file">
        <p class="mono dlg-name">${esc(f.name)}</p>
        <p class="small">${size(f.size)} · ${LOADERS[f.loader] || esc(f.loader)} · Minecraft ${esc(mcLabel(f.mc))} · ${date(rel.date)}</p>
      </div>
      <div class="dlg-facts">
        ${vtBadge(f)}
        <button type="button" class="sha small" data-copy="${f.sha256}" title="SHA-256"><code>SHA-256 ${f.sha256.slice(0, 16)}…</code><span class="copied mono">${t(L('Kopiert', 'Copied'))}</span></button>
      </div>
      ${req ? `<div class="dlg-req"><p class="k mono">${t(L('Benötigt', 'Requires'))}</p><div class="req-links">${req}</div></div>` : ''}
      <div class="dlg-actions"><a class="btn accent dlg-get" href="${f.url}" download>↓ ${t(L('Herunterladen', 'Download'))}</a>
        <a class="btn ghost" href="${rel.url}" target="_blank" rel="noopener">${t(L('Änderungen', 'Changelog'))} ↗</a></div>` : '';
    store.set(key, { loader: pick.loader, mc: pick.mc });
  }

  dialog.onclick = (e) => {
    if (e.target === dialog) { dialog.close(); return; }
    const r = e.target.closest('[data-rel]');
    const l = e.target.closest('[data-loader]');
    const mc = e.target.closest('[data-mc]');
    const other = e.target.closest('[data-open]');
    const copy = e.target.closest('[data-copy]');
    if (r) { pick.rel = r.dataset.rel; paint(); }
    else if (l) { pick.loader = l.dataset.loader; paint(); }
    else if (mc && !mc.disabled) { pick.mc = mc.dataset.mc; paint(); }
    else if (other) { e.preventDefault(); onOpen(other.dataset.open); }
    else if (copy) {
      navigator.clipboard?.writeText(copy.dataset.copy).then(() => { copy.classList.add('done'); setTimeout(() => copy.classList.remove('done'), 1400); }).catch(() => {});
    }
  };
  paint();
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  dialog.querySelector('.dlg-get')?.focus();
}

export function title() { return 'Downloads · Vibe Craft Studios'; }

export function render(mods, dl) {
  const files = mods.reduce((n, m) => n + releasesOf(dl, m.id).length, 0);
  const updated = dl?.updated ? date(dl.updated) : '–';
  return `<div class="dl-page" style="--accent:${ACCENT};--on-accent:#000">
  <section class="hero dl-hero">
    <div class="wrap">
      <p class="eyebrow">${t(L('Download-Center', 'Download center'))}</p>
      <h1 class="display">${t(L('Alle Mods.<br>Geprüft und sicher.', 'Every mod.<br>Checked and safe.'))}</h1>
      <p class="lead">${t(L('Jede Datei kommt direkt aus unseren GitHub-Releases. Zu jeder Version gibt es die Prüfsumme und einen Scan mit rund 70 Virenscannern auf VirusTotal, damit du weißt, was du installierst.',
        'Every file comes straight from our GitHub releases. Each version comes with its checksum and a scan by about 70 antivirus engines on VirusTotal, so you know what you install.'))}</p>
      <ul class="dl-trust mono">
        <li>${t(L('Direkt von GitHub', 'Straight from GitHub'))}</li>
        <li>SHA-256</li>
        <li>VirusTotal</li>
        <li>${t(L('Stand', 'Updated'))} ${updated}</li>
      </ul>
    </div>
  </section>
  <section class="section dl-list"><div class="wrap">
    <div class="dl-grid">${mods.map((m) => tile(m, dl)).join('')}</div>
    ${files ? '' : `<p class="small">${t(L('Gerade sind keine Download-Daten erreichbar.', 'Download data is not available right now.'))}</p>`}
  </div></section>
  <section class="section dl-info"><div class="wrap">
    <header class="sec-head"><p class="eyebrow">${t(L('Gut zu wissen', 'Good to know'))}</p><h2 class="display sm">${t(L('Installieren und prüfen', 'Install and verify'))}</h2></header>
    <div class="tiles">
      <article class="tile"><span class="tile-tag mono">01 · ${t(L('Installation', 'Installation'))}</span>
        <h3>${t(L('In drei Schritten', 'In three steps'))}</h3>
        <ol class="steps">
          <li>${t(L('<a href="https://fabricmc.net/use/installer/" target="_blank" rel="noopener">Fabric Loader</a> für die passende Minecraft-Version installieren.', 'Install the <a href="https://fabricmc.net/use/installer/" target="_blank" rel="noopener">Fabric Loader</a> for the matching Minecraft version.'))}</li>
          <li>${t(L('Fabric API, Fabric Language Kotlin und bei Addons H&H Armors in den <code>mods</code>-Ordner legen.', 'Put Fabric API, Fabric Language Kotlin and, for addons, H&H Armors into your <code>mods</code> folder.'))}</li>
          <li>${t(L('Die heruntergeladene Jar dazu und Minecraft mit Fabric starten.', 'Add the downloaded jar and start Minecraft with Fabric.'))}</li>
        </ol>
      </article>
      <article class="tile"><span class="tile-tag mono">02 · SHA-256</span>
        <h3>${t(L('Datei selbst prüfen', 'Verify the file yourself'))}</h3>
        <p>${t(L('Die Prüfsumme deiner Datei muss genau der hier angezeigten entsprechen. So siehst du sie:', 'The checksum of your file must match the one shown here exactly. This is how you get it:'))}</p>
        <pre class="cmd"><span class="small">Windows</span>certutil -hashfile HHA.jar SHA256
<span class="small">macOS / Linux</span>shasum -a 256 HHA.jar</pre>
      </article>
      <article class="tile"><span class="tile-tag mono">03 · VirusTotal</span>
        <h3>${t(L('Was der Scan bedeutet', 'What the scan means'))}</h3>
        <p>${t(L('Jede neue Version wird automatisch bei VirusTotal hochgeladen und dort von rund 70 Virenscannern geprüft. Ein Klick auf das Abzeichen öffnet den vollständigen Bericht. Meldet einmal ein einzelner Scanner etwas, ist das bei neuen Dateien meist ein Fehlalarm; im Zweifel frag uns auf GitHub.',
          'Every new version is uploaded to VirusTotal automatically and checked by about 70 antivirus engines. Click the badge to open the full report. If a single engine ever flags something, it is usually a false positive for new files; if in doubt, ask us on GitHub.'))}</p>
      </article>
    </div>
  </div></section>
  ${DIALOG}
</div>`;
}

export async function mount(root, mods, dl, signal) {
  animateIcons(root);
  // Ein Dialog für alle Mods; über #<mod> (z. B. vom Download-Knopf der Mod-Seite) öffnet er sich direkt
  const dialog = $('.dl-dialog', root);
  const open = (id) => {
    const mod = mods.find((m) => m.id === id);
    if (mod && latestRelease(dl, id)) openDialog(dialog, mod, dl, open);
  };
  $$('[data-open]', root).forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); open(b.dataset.open); }, { signal }));
  dialog.addEventListener('close', () => { if (location.hash) history.replaceState(null, '', location.pathname); }, { signal });
  signal.addEventListener('abort', () => { if (dialog.open) dialog.close(); });
  const fromHash = location.hash.slice(1);
  if (fromHash && mods.some((m) => m.id === fromHash)) setTimeout(() => open(fromHash), 450);
}
