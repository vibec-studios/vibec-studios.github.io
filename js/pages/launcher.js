// Launcher-Seite: Vibe Launcher (Windows), Download über den stabilen GitHub-Link, Version live aus der GitHub-API.
// Quelle: vibec-studios/vibe-launcher (README, docs/images, branding). Hero: die Robbe als 3D-Modell (seal3d.js).
import { $, $$, t, tx, esc, openLightbox, animateIcons } from '../core.js';
import { sealStage } from '../views.js';

const L = (de, en) => ({ de, en });
export const ACCENT = '#8b6cff';
const REPO = 'vibec-studios/vibe-launcher';
const STABLE = `https://github.com/${REPO}/releases/latest/download/Vibe-Launcher-Setup.exe`;
const RELEASES = `https://github.com/${REPO}/releases`;
const BASE = '/assets/launcher';

const FEATURES = [
  { n: L('Instanzen', 'Instances'), d: L('Vanilla, Fabric, Quilt, Forge und NeoForge, jede Instanz mit eigenem Ordner, Arbeitsspeicher und Java. Java lädt der Launcher selbst.', 'Vanilla, Fabric, Quilt, Forge and NeoForge, every instance with its own folder, memory and Java. The launcher fetches Java itself.') },
  { n: L('Entdecken', 'Discover'), d: L('Mods, Modpacks, Resource- und Shaderpacks von Modrinth, CurseForge und eigenen Stores, samt Abhängigkeiten.', 'Mods, modpacks, resource and shader packs from Modrinth, CurseForge and custom stores, dependencies included.') },
  { n: L('Mod-Updates', 'Mod updates'), d: L('Updates mit einem Klick einspielen oder automatisch vor jedem Start. Einzelne Versionen lassen sich fixieren.', 'Apply updates in one click or automatically before every launch. Single versions can be pinned.') },
  { n: L('Import und Export', 'Import and export'), d: L('Modrinth-Packs, CurseForge-ZIPs, Prism und MultiMC, und direkt aus Modrinth App, Prism, CurseForge App oder ATLauncher.', 'Modrinth packs, CurseForge ZIPs, Prism and MultiMC, and straight from the Modrinth App, Prism, CurseForge App or ATLauncher.') },
  { n: L('Hotbar und direkt in die Welt', 'Hotbar and straight into the world'), d: L('Die Startseite ist eine Minecraft-Hotbar. Ein Klick auf eine Welt startet das Spiel direkt darin.', 'The home screen is a Minecraft hotbar. Click a world and the game starts right inside it.') },
  { n: L('Skins und Capes', 'Skins and capes'), d: L('Vorschau in 3D, eigene Skin-Bibliothek, Skins per Datei oder Spielername, Capes umschalten.', '3D preview, your own skin library, skins from a file or a player name, switch capes.') },
  { n: L('Screenshots', 'Screenshots'), d: L('Alle Screenshots aller Instanzen an einem Ort, mit Großansicht, Kopieren und Löschen.', 'All screenshots of all instances in one place, with a large view, copy and delete.') },
  { n: L('Logs', 'Logs'), d: L('Live-Konsole mit Filtern und Suche, Crash-Erkennung und Upload zu mclo.gs mit einem Klick.', 'Live console with filters and search, crash detection and upload to mclo.gs in one click.') },
  { n: L('Konten und Updates', 'Accounts and updates'), d: L('Microsoft-Login mit mehreren Konten, Tokens sicher im Windows-Tresor. Der Launcher aktualisiert sich selbst.', 'Microsoft login with several accounts, tokens kept safe in the Windows vault. The launcher updates itself.') },
];

const SHOTS = [
  { img: 'instance', n: L('Instanz mit Mods', 'Instance with mods') },
  { img: 'discover', n: L('Mods entdecken', 'Discover mods') },
  { img: 'project', n: L('Projektseite', 'Project page') },
  { img: 'skins', n: L('Skins und Capes', 'Skins and capes') },
];

export function title() { return 'Vibe Launcher · Vibe Craft Studios'; }

export function render(mods) {
  const storeMods = mods.filter((m) => m.source);
  return `<div class="launcher-page" style="--accent:${ACCENT};--accent2:#3fe0c5;--on-accent:#fff">
  <section class="hero mod-hero lp-hero">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">${t(L('Vibe Launcher · Windows', 'Vibe Launcher · Windows'))}</p>
        <h1 class="display">Vibe Launcher</h1>
        <p class="lead strong">${t(L('Der Minecraft-Launcher von Vibe Craft Studios.', 'The Minecraft launcher by Vibe Craft Studios.'))}</p>
        <p class="lead">${t(L('Instanzen, Mods, Modpacks und Skins: schnell, aufgeräumt und ohne Schnickschnack. Unsere eigenen Mods sind direkt drin.', 'Instances, mods, modpacks and skins: fast, tidy and no frills. Our own mods are built right in.'))}</p>
        <div class="cta">
          <a class="btn primary lp-get" href="${STABLE}" rel="noopener">↓ ${t(L('Für Windows herunterladen', 'Download for Windows'))}</a>
          <a class="btn ghost" href="${RELEASES}" target="_blank" rel="noopener">${t(L('Alle Versionen', 'All versions'))} ↗</a>
        </div>
        <p class="note mono lp-meta" aria-live="polite">${t(L('Windows 10 und 11', 'Windows 10 and 11'))} · ${t(L('kostenlos', 'free'))} · ${t(L('ohne Admin-Rechte', 'no admin rights'))} · ${t(L('aktualisiert sich selbst', 'updates itself'))}</p>
      </div>
      <div class="hero-art"><canvas class="hero-canvas" aria-hidden="true"></canvas></div>
    </div>
  </section>

  <section class="section lp-shot-sec"><div class="wrap">
    <figure class="lp-main-shot"><button type="button" data-lshot="home"><img src="${BASE}/img/home.webp" alt="${esc(tx(L('Startseite mit Hotbar', 'Home screen with hotbar')))}" width="1280" height="800"></button></figure>
  </div></section>

  <section class="section" id="features"><div class="wrap">
    <header class="sec-head" data-reveal><p class="eyebrow">${t(L('Was er kann', 'What it does'))}</p>
      <h2 class="display sm">${t(L('Alles für dein Minecraft', 'Everything for your Minecraft'))}</h2></header>
    <div class="tiles" data-reveal>${FEATURES.map((f) => `<article class="tile"><h3>${t(f.n)}</h3><p>${t(f.d)}</p></article>`).join('')}</div>
  </div></section>

  <section class="section lp-store"><div class="wrap lp-store-grid" data-reveal>
    <div>
      <p class="eyebrow">${t(L('Vibe-Craft-Store', 'Vibe Craft store'))}</p>
      <h2 class="display sm">${t(L('Unsere Mods mit einem Klick', 'Our mods in one click'))}</h2>
      <p class="lead">${t(L('Der Store von Vibe Craft Studios ist im Launcher schon eingetragen. Alles aus dem Download-Center lässt sich dort direkt suchen und in eine Instanz installieren.', 'The Vibe Craft Studios store is already set up in the launcher. Everything from the download center can be found there and installed into an instance right away.'))}</p>
    </div>
    <ul class="lp-store-mods">${storeMods.map((m) => `<li><a href="${m.path}" data-link style="--accent:${m.accent}"><span class="px-icon" data-src="${m.base}/${m.icon || 'icon.png'}"></span><span>${esc(m.name)}</span></a></li>`).join('')}</ul>
  </div></section>

  <section class="section"><div class="wrap">
    <header class="sec-head" data-reveal><p class="eyebrow">${t(L('Screenshots', 'Screenshots'))}</p>
      <h2 class="display sm">${t(L('So sieht er aus', 'How it looks'))}</h2>
      <p class="lead">${t(L('Mit Beispieldaten. Klicken zum Vergrößern.', 'With demo data. Click to enlarge.'))}</p></header>
    <div class="gallery two" data-reveal>${SHOTS.map((s) => `<figure class="shot"><button type="button" data-lshot="${s.img}"><img src="${BASE}/img/${s.img}.webp" alt="${esc(tx(s.n))}" loading="lazy"></button><figcaption>${t(s.n)}</figcaption></figure>`).join('')}</div>
  </div></section>

  <section class="section lp-install" id="installation"><div class="wrap lp-install-grid" data-reveal>
    <div>
      <p class="eyebrow">${t(L('Installation', 'Installation'))}</p>
      <h2 class="display sm">${t(L('In einer Minute startklar', 'Ready in a minute'))}</h2>
      <ol class="steps">
        <li>${t(L(`<a href="${STABLE}" class="lp-get-link">Vibe-Launcher-Setup.exe</a> herunterladen und starten. Admin-Rechte braucht es nicht.`, `Download and run <a href="${STABLE}" class="lp-get-link">Vibe-Launcher-Setup.exe</a>. No admin rights needed.`))}</li>
        <li>${t(L('Mit dem Microsoft-Konto anmelden, mit dem du Minecraft: Java Edition gekauft hast.', 'Sign in with the Microsoft account you bought Minecraft: Java Edition with.'))}</li>
        <li>${t(L('Instanz anlegen oder importieren und spielen. Updates holt sich der Launcher von selbst.', 'Create or import an instance and play. The launcher fetches its own updates.'))}</li>
      </ol>
    </div>
    <aside class="lp-note">
      <h3>${t(L('Windows warnt beim ersten Start?', 'Windows warns on first start?'))}</h3>
      <p>${t(L('Der Installer hat noch kein gekauftes Code-Signing-Zertifikat. Darum zeigt Windows eventuell „Der Computer wurde durch Windows geschützt“. Klick auf <b>Weitere Informationen</b> und dann auf <b>Trotzdem ausführen</b>.', 'The installer does not have a paid code signing certificate yet, so Windows may show “Windows protected your PC”. Click <b>More info</b>, then <b>Run anyway</b>.'))}</p>
      <p class="small">${t(L('Der Quellcode liegt offen auf GitHub.', 'The source code is open on GitHub.'))} <a href="https://github.com/${REPO}" target="_blank" rel="noopener">${REPO} ↗</a></p>
    </aside>
  </div></section>
</div>`;
}

function size(bytes) { return bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`; }
function day(iso) {
  const d = new Date(iso);
  const f = (l) => d.toLocaleDateString(l === 'de' ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  return t(L(f('de'), f('en')));
}

/**
 * Neueste Version aus der GitHub-API: bevorzugt ein normales Release, sonst die neueste Vorabversion außer dem
 * Dev-Kanal (`dev`). Gibt es noch kein Release mit Installer, bleibt der stabile Link stehen.
 */
async function latest(signal) {
  const r = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=15`, { signal, headers: { Accept: 'application/vnd.github+json' } });
  if (!r.ok) throw new Error(`GitHub ${r.status}`);
  const list = (await r.json()).filter((x) => !x.draft && x.tag_name !== 'dev');
  const setup = (x) => x.assets?.find((a) => /setup\.exe$/i.test(a.name));
  return list.find((x) => !x.prerelease && setup(x)) || list.find((x) => setup(x)) || null;
}

export async function mount(root, mods, signal) {
  animateIcons(root);
  const art = $('.hero-art', root);
  sealStage($('.hero-canvas', root), { hoverEl: art, signal }).catch(console.error);
  $$('[data-lshot]', root).forEach((b) => b.addEventListener('click', () => {
    const s = SHOTS.find((x) => x.img === b.dataset.lshot);
    openLightbox(`${BASE}/img/${b.dataset.lshot}.webp`, `<b>${t(s ? s.n : L('Startseite mit Hotbar', 'Home screen with hotbar'))}</b>`);
  }, { signal }));

  try {
    const rel = await latest(signal);
    if (!rel) {
      // Noch kein Release mit Installer: der stabile Link liefe ins Leere, also auf die Release-Seite zeigen
      $$('.lp-get, .lp-get-link', root).forEach((a) => { a.href = RELEASES; a.target = '_blank'; });
      $('.lp-meta', root).innerHTML = `<b>${t(L('Erste Version in Kürze', 'First version coming soon'))}</b> · ${t(L('Windows 10 und 11', 'Windows 10 and 11'))} · ${t(L('ohne Admin-Rechte', 'no admin rights'))}`;
      return;
    }
    const exe = rel.assets.find((a) => /setup\.exe$/i.test(a.name));
    // Ist die neueste Version eine Vorabversion, zeigt /releases/latest nicht darauf: dann direkt auf ihre Datei verlinken
    if (rel.prerelease) $$('.lp-get, .lp-get-link', root).forEach((a) => { a.href = exe.browser_download_url; });
    const ver = rel.name || rel.tag_name;
    $('.lp-meta', root).innerHTML = `<b>${esc(ver)}</b> · ${day(rel.published_at)} · ${size(exe.size)} · ${t(L('Windows 10 und 11', 'Windows 10 and 11'))} · ${t(L('ohne Admin-Rechte', 'no admin rights'))}`;
  } catch (e) {
    if (e.name !== 'AbortError') console.warn('Launcher-Version nicht abrufbar:', e.message);
  }
}
