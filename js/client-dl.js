// Download des Vibey Client: live aus der öffentlichen Vibe-API (GET /api/v1/client/latest, CORS *, kein Login).
// Wird bei jedem Seitenaufruf geprüft. Solange es keinen Release gibt (404) oder die API ausfällt, bleibt der statische
// „Bald verfügbar“-Inhalt stehen. Keine Links auf das private vibey-client-Repo: Dateien kommen nur von vibe.henny.dev.
import { t, esc } from './core.js';

const L = (de, en) => ({ de, en });
const API = 'https://vibe.henny.dev';
export const LAUNCHER_EXE = 'https://github.com/vibec-studios/vibe-launcher/releases/latest/download/Vibe-Launcher-Setup.exe';
const LOADERS = { fabric: 'Fabric', neoforge: 'NeoForge', forge: 'Forge', quilt: 'Quilt' };
const KEY = 'vcs-dl-vibey-client';

const store = {
  get() { try { return JSON.parse(localStorage.getItem(KEY) || 'null') || {}; } catch (e) { return {}; } },
  set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* privat */ } },
};
const size = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const sizeEn = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const sizeT = (b) => t(L(size(b), sizeEn(b)));
function date(iso) {
  const d = new Date(iso);
  if (!iso || Number.isNaN(+d)) return '';
  const f = (l) => d.toLocaleDateString(l === 'de' ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  return t(L(f('de'), f('en')));
}
const mcKey = (mc) => { const p = String(mc).split('.').map(Number); return (p[0] || 0) * 1e6 + (p[1] || 0) * 1e3 + (p[2] || 0); };
// Nur https-Links übernehmen (Dateien von vibe.henny.dev, Abhängigkeiten von Modrinth)
const safeUrl = (u) => { try { const x = new URL(u, API); return x.protocol === 'https:' ? x.href : null; } catch (e) { return null; } };

/** Kleiner, sicherer Markdown-Renderer für den Changelog (Überschriften, Listen, fett, Code, Links). */
function markdown(src) {
  const inline = (s) => esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<i>$2</i>')
    .replace(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g, (m, txt, href) => `<a href="${href}" target="_blank" rel="noopener">${txt}</a>`);
  const out = [];
  let list = false;
  for (const raw of String(src || '').split(/\r?\n/)) {
    const line = raw.trimEnd();
    const li = line.match(/^\s*[-*+]\s+(.*)$/);
    if (li) { if (!list) { out.push('<ul>'); list = true; } out.push(`<li>${inline(li[1])}</li>`); continue; }
    if (list) { out.push('</ul>'); list = false; }
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) out.push(`<p class="md-h">${inline(h[2])}</p>`);
    else if (line.trim()) out.push(`<p>${inline(line)}</p>`);
  }
  if (list) out.push('</ul>');
  return out.join('');
}

/** Neuesten Release holen; null, wenn es (noch) keinen gibt oder die API nicht antwortet. */
export async function fetchClientRelease(signal) {
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 8000);
    signal?.addEventListener('abort', () => ctl.abort(), { once: true });
    const r = await fetch(`${API}/api/v1/client/latest`, { cache: 'no-cache', signal: ctl.signal });
    clearTimeout(timer);
    if (!r.ok) return null;
    const rel = await r.json();
    const files = (rel.files || []).filter((f) => f && safeUrl(f.url) && Array.isArray(f.mcVersions) && f.mcVersions.length);
    if (!rel.version || !files.length) return null;
    return { ...rel, files };
  } catch (e) {
    return null;
  }
}

/**
 * Download-Auswahl in `host` zeichnen: Loader, Minecraft-Version, Button mit Version und Größe, Abhängigkeiten,
 * ausklappbarer Changelog und der Hinweis auf den Vibe Launcher. opts.changelog = false lässt den Changelog weg.
 */
export function renderClientDownload(host, rel, { changelog = true } = {}) {
  const saved = store.get();
  const pick = { loader: saved.loader, mc: saved.mc };
  const loaders = [...new Set(rel.files.map((f) => f.loader))].sort((a, b) => (a === 'fabric' ? -1 : b === 'fabric' ? 1 : String(a).localeCompare(b)));
  const versions = [...new Set(rel.files.flatMap((f) => f.mcVersions))].sort((a, b) => mcKey(b) - mcKey(a));

  host.classList.add('cdl');
  host.innerHTML = `
    <p class="cdl-ver mono"><span class="cdl-live"></span>Vibey Client v${esc(rel.version)}${rel.publishedAt ? ` · ${date(rel.publishedAt)}` : ''}${rel.channel && rel.channel !== 'release' ? ` · ${esc(rel.channel)}` : ''}</p>
    <div class="cdl-easy">
      <p><b>${t(L('Am einfachsten über den Vibe Launcher', 'Easiest with the Vibe Launcher'))}</b><br>
        <span>${t(L('Der Launcher installiert den Client samt Abhängigkeiten automatisch.', 'The launcher installs the client and its dependencies automatically.'))}</span></p>
      <a class="btn ghost" href="${LAUNCHER_EXE}">${t(L('Launcher laden', 'Get the launcher'))}</a>
    </div>
    <p class="cdl-or mono">${t(L('Oder das Jar selbst installieren', 'Or install the jar yourself'))}</p>
    <div class="cdl-step"${loaders.length > 1 ? '' : ' hidden'}><p class="k mono">Loader</p><div class="dlg-seg" role="radiogroup" data-group="loader"></div></div>
    <div class="cdl-step"><p class="k mono">${t(L('Minecraft-Version', 'Minecraft version'))}</p><div class="dlg-mc" role="radiogroup" data-group="mc"></div></div>
    <div class="cdl-result"></div>
    ${changelog && rel.changelog ? `<details class="cdl-log"><summary>${t(L('Was ist neu in', "What's new in"))} v${esc(rel.version)}</summary><div class="md">${markdown(rel.changelog)}</div></details>` : ''}`;

  const paint = () => {
    if (!loaders.includes(pick.loader)) pick.loader = loaders[0];
    const forLoader = rel.files.filter((f) => f.loader === pick.loader);
    const has = (mc) => forLoader.some((f) => f.mcVersions.includes(mc));
    if (!has(pick.mc)) pick.mc = versions.find(has);
    host.querySelector('[data-group="loader"]').innerHTML = loaders.map((l) =>
      `<button type="button" role="radio" aria-checked="${l === pick.loader}" data-loader="${esc(l)}">${LOADERS[l] || esc(l)}</button>`).join('');
    host.querySelector('[data-group="mc"]').innerHTML = versions.map((mc) =>
      `<button type="button" role="radio" aria-checked="${mc === pick.mc}" data-mc="${esc(mc)}"${has(mc) ? '' : ' disabled'}>${esc(mc)}</button>`).join('');
    const f = forLoader.find((x) => x.mcVersions.includes(pick.mc)) || forLoader[0];
    const req = (f?.requires || []).filter((r) => r?.modrinth && /^[\w-]+$/.test(r.modrinth));
    host.querySelector('.cdl-result').innerHTML = f ? `
      <a class="btn primary cdl-get" href="${esc(safeUrl(f.url))}" download="${esc(f.file || '')}">${t(L('Herunterladen', 'Download'))} <span class="cdl-meta mono">v${esc(rel.version)} · ${sizeT(f.size || 0)}</span></a>
      <p class="small cdl-file mono">${esc(f.file || '')} · ${LOADERS[f.loader] || esc(f.loader)} · Minecraft ${esc(pick.mc)}</p>
      ${req.map((r) => `<p class="cdl-req">${t(L('Benötigt', 'Requires'))} <a href="https://modrinth.com/mod/${esc(r.modrinth)}" target="_blank" rel="noopener">${esc(r.name || r.modrinth)} ↗</a></p>`).join('')}` : '';
  };
  host.addEventListener('click', (e) => {
    const b = e.target.closest('[data-loader],[data-mc]');
    if (!b || b.disabled) return;
    if (b.dataset.loader) pick.loader = b.dataset.loader;
    if (b.dataset.mc) pick.mc = b.dataset.mc;
    store.set(pick);
    paint();
  });
  paint();
}

/** Blockbench-Plugin des Releases als Link (oder null). */
export function blockbenchLink(rel) {
  const bb = rel?.blockbench;
  const url = bb && safeUrl(bb.url);
  if (!url) return '';
  return `<a class="btn ghost" href="${esc(url)}" download="${esc(bb.file || 'vibey.js')}">${t(L('Blockbench-Plugin laden', 'Get the Blockbench plugin'))} <span class="cdl-meta mono">v${esc(bb.version || rel.version)}${bb.size ? ` · ${sizeT(bb.size)}` : ''}</span></a>`;
}
