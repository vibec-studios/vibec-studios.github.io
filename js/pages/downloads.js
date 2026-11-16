// Download-Center: alle Mods mit ihren GitHub-Releases, Prüfsumme und VirusTotal-Ergebnis (Daten: data/downloads.json).
import { $$, t, tx, esc, animateIcons } from '../core.js';
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
    const key = r.toLowerCase().replace(/\s*[≥>].*$/, '').trim();
    if (key === 'h&h armors') return `<a href="/downloads/#hha" data-anchor>${esc(r)}</a>`;
    const href = REQ_LINKS[key];
    return href ? `<a href="${href}" target="_blank" rel="noopener">${esc(r)} ↗</a>` : `<span>${esc(r)}</span>`;
  }).join('');
}

function card(mod, dl) {
  const rel = latestRelease(dl, mod.id);
  const all = releasesOf(dl, mod.id).filter((r) => r.assets?.length);
  const icon = `<span class="px-icon dl-icon" data-src="${mod.base}/${mod.icon || 'icon.png'}"></span>`;
  const tag = mod.series ? `${esc(mod.series)} · ${mod.role === 'core' ? t(L('Hauptmod', 'Core mod')) : mod.role === 'addon' ? 'Addon' : 'Mod'}` : 'Mod';
  const head = `<header class="dl-head">
      ${icon}
      <div><p class="eyebrow">${tag}</p><h2><a href="${mod.path}" data-link>${esc(mod.name)}</a></h2><p class="dl-tag">${t(mod.tagline)}</p></div>
    </header>`;

  if (!rel) {
    return `<article class="dl-card soon" id="${mod.id}" style="--accent:${mod.accent}">
      ${head}
      <div class="dl-soon">
        <p><b>${t(L('Noch kein Release.', 'No release yet.'))}</b> ${t(L('Sobald es eine Version gibt, steht sie hier mit Prüfsumme und Virenscan.', 'As soon as there is a version, it appears here with checksum and virus scan.'))}</p>
        <div class="cta"><a class="btn ghost" href="${mod.path}" data-link>${t(L('Zur Mod', 'View mod'))}</a>${mod.source ? `<a class="btn ghost" href="${mod.source}" target="_blank" rel="noopener">GitHub ↗</a>` : ''}</div>
      </div>
    </article>`;
  }

  const a = rel.assets[0];
  const older = all.filter((r) => r !== rel);
  return `<article class="dl-card" id="${mod.id}" style="--accent:${mod.accent}">
    ${head}
    <div class="dl-main">
      <div class="dl-file">
        <p class="dl-ver"><b>v${esc(rel.version)}</b>${rel.prerelease ? `<span class="pill">${t(L('Vorabversion', 'Pre-release'))}</span>` : `<span class="pill">${t(L('Aktuell', 'Latest'))}</span>`}</p>
        <p class="mono small">${esc(a.name)} · ${size(a.size)} · ${date(rel.date)}</p>
        <p class="mono small">Minecraft ${esc(mod.mc || '1.21.11')} · ${esc(mod.loader || 'Fabric')}</p>
      </div>
      <div class="dl-actions">
        <a class="btn accent" href="${a.url}" download>↓ ${t(L('Herunterladen', 'Download'))}</a>
        <a class="btn ghost" href="${rel.url}" target="_blank" rel="noopener">${t(L('Änderungen', 'Changelog'))} ↗</a>
      </div>
    </div>
    <div class="dl-facts">
      <div><p class="k">VirusTotal</p>${vtBadge(a)}</div>
      <div class="dl-sha"><p class="k">SHA-256</p><button type="button" class="sha" data-copy="${a.sha256}" title="${esc(tx(L('Kopieren', 'Copy')))}"><code>${a.sha256}</code><span class="copied mono">${t(L('Kopiert', 'Copied'))}</span></button></div>
      <div><p class="k">${t(L('Benötigt', 'Requires'))}</p><div class="req-links">${reqList(mod)}</div></div>
    </div>
    ${older.length ? `<details class="dl-older">
      <summary>${t(L(`Ältere Versionen (${older.length})`, `Older versions (${older.length})`))}</summary>
      <div class="dl-table" role="table">${older.map((r) => {
        const x = r.assets[0];
        return `<div role="row"><b class="mono">v${esc(r.version)}</b><span class="small">${date(r.date)}</span><span class="small mono">${size(x.size)}</span>
          <button type="button" class="sha small" data-copy="${x.sha256}" title="SHA-256"><code>${x.sha256.slice(0, 12)}…</code><span class="copied mono">${t(L('Kopiert', 'Copied'))}</span></button>
          ${vtBadge(x, true)}<a class="mono dl-get" href="${x.url}" download>↓ .jar</a></div>`;
      }).join('')}</div>
    </details>` : ''}
  </article>`;
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
    ${mods.map((m) => card(m, dl)).join('')}
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
</div>`;
}

export async function mount(root, mods, dl, signal) {
  animateIcons(root);
  $$('[data-copy]', root).forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch (e) { return; }
    b.classList.add('done');
    setTimeout(() => b.classList.remove('done'), 1400);
  }, { signal }));
}

