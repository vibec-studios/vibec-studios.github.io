// Launcher-Seite: Vibe Launcher (Windows). Download über den stabilen GitHub-Link, Version, Datum und Größe live aus der
// GitHub-API. Aufbau wie ein Handbuch: was er kann, nach Bereichen, jeweils mit echtem Screenshot.
// Quelle: vibec-studios/vibe-launcher (README, docs/images, UI-Texte). Über das Vibe-Backend nur, was öffentlich ist.
import { $, $$, t, tx, esc, openLightbox, animateIcons } from '../core.js';
import { sealStage } from '../views.js';

const L = (de, en) => ({ de, en });
export const ACCENT = '#3b82f6';
const REPO = 'vibec-studios/vibe-launcher';
const STABLE = `https://github.com/${REPO}/releases/latest/download/Vibe-Launcher-Setup.exe`;
const RELEASES = `https://github.com/${REPO}/releases`;
const BASE = '/assets/launcher';

const SHOT_NAMES = {
  home: L('Startseite mit Hotbar und „Direkt in die Welt“', 'Home screen with hotbar and Quick Play'),
  instance: L('Instanz mit Mods, Updates und Filtern', 'Instance with mods, updates and filters'),
  discover: L('Mods entdecken auf Modrinth, CurseForge und im Vibe-Craft-Store', 'Discover mods on Modrinth, CurseForge and the Vibe Craft store'),
  project: L('Projektseite mit Versionen und Galerie', 'Project page with versions and gallery'),
  skins: L('Skins und Capes mit 3D-Vorschau und Bibliothek', 'Skins and capes with 3D preview and library'),
  library: L('Bibliothek aller Instanzen', 'Library of all instances'),
};

// Was er kann, nach Bereichen. Jede Zeile: Begriff und ein Satz.
const GROUPS = [
  {
    id: 'mods', shot: 'instance', toc: L('Mods', 'Mods'),
    title: L('Instanzen und Mods', 'Instances and mods'),
    rows: [
      [L('Instanzen', 'Instances'), L('Vanilla, Fabric, Quilt, Forge und NeoForge, jede mit eigenem Ordner, Arbeitsspeicher und Java. Java lädt der Launcher selbst.', 'Vanilla, Fabric, Quilt, Forge and NeoForge, each with its own folder, memory and Java. The launcher fetches Java itself.')],
      [L('Entdecken', 'Discover'), L('Mods, Modpacks, Resource- und Shaderpacks von Modrinth, CurseForge und eigenen Stores. Der Vibe-Craft-Store ist von Anfang an drin.', 'Mods, modpacks, resource and shader packs from Modrinth, CurseForge and custom stores. The Vibe Craft store is built in from the start.')],
      [L('Updates', 'Updates'), L('Mod- und Modpack-Updates mit einem Klick oder automatisch vor dem Start. Einzelne Versionen lassen sich fixieren.', 'Mod and modpack updates in one click or automatically before launch. Single versions can be pinned.')],
      [L('Abhängigkeiten', 'Dependencies'), L('Fehlende Abhängigkeiten werden erkannt und auf Wunsch gleich installiert. Mods lassen sich nach Client, beiden Seiten oder Server filtern.', 'Missing dependencies are detected and can be installed right away. Mods can be filtered by client, both sides or server.')],
      [L('Mod-Sets und Presets', 'Mod sets and presets'), L('Gruppen von Mods gemeinsam an- und ausschalten. Performance-Presets installieren passende Mods für mehr Leistung.', 'Switch groups of mods on and off together. Performance presets install matching mods for better performance.')],
      [L('Config-Editor', 'Config editor'), L('Die Einstellungsdateien der Mods direkt im Launcher bearbeiten.', 'Edit the mods’ config files right in the launcher.')],
      [L('Import und Export', 'Import and export'), L('Modrinth-Packs, CurseForge-ZIPs, eigene .vlpack-Dateien, Prism und MultiMC, und direkt aus Modrinth App, Prism, CurseForge App oder ATLauncher.', 'Modrinth packs, CurseForge ZIPs, our own .vlpack files, Prism and MultiMC, and straight from the Modrinth App, Prism, CurseForge App or ATLauncher.')],
    ],
  },
  {
    id: 'spielen', shot: 'home', toc: L('Spielen', 'Playing'),
    title: L('Spielen', 'Playing'),
    rows: [
      [L('Hotbar', 'Hotbar'), L('Die Startseite ist eine Minecraft-Hotbar mit deinen Instanzen. Ein Klick auf eine Welt startet das Spiel direkt darin.', 'The home screen is a Minecraft hotbar with your instances. Click a world and the game starts right inside it.')],
      [L('Server-Liste', 'Server list'), L('Gespeicherte Server je Instanz, mit Direct Join aus dem Launcher.', 'Saved servers per instance, with direct join from the launcher.')],
      [L('Backups', 'Backups'), L('Welt- und Instanz-Backups anlegen und wiederherstellen. Selbst erstellte Backups werden nie automatisch gelöscht.', 'Create and restore world and instance backups. Backups you make yourself are never deleted automatically.')],
      [L('Crash-Analyse und Logs', 'Crash analysis and logs'), L('Nach einem Absturz wertet der Launcher Crash-Report und Log aus und nennt die wahrscheinlichste Ursache. Dazu eine Live-Konsole und Upload zu mclo.gs.', 'After a crash the launcher reads the crash report and log and names the most likely cause. Plus a live console and upload to mclo.gs.')],
      [L('Kleinigkeiten', 'Small things'), L('Spielzeit-Statistik, Discord-Status, Desktop-Verknüpfungen, Deep Links und Optionen-Sync, der Spieleinstellungen über ein gemeinsames Profil abgleicht.', 'Playtime stats, Discord status, desktop shortcuts, deep links and options sync, which keeps game settings in line through a shared profile.')],
    ],
  },
  {
    id: 'server', shot: null, toc: L('Server', 'Servers'),
    title: L('Eigene Server', 'Your own servers'),
    lead: L('Ein Minecraft-Server auf deinem PC, ohne Router-Einstellungen.', 'A Minecraft server on your PC, without touching your router.'),
    rows: [
      [L('Erstellen', 'Create'), L('Einen lokalen Server aus einem bestehenden Profil anlegen oder ganz neu, mit Konsole und Verwaltung im Launcher.', 'Create a local server from an existing profile or from scratch, with a console and management in the launcher.')],
      [L('Vibey-Relay', 'Vibey relay'), L('Freunde verbinden sich über eine feste Adresse auf vibey.henny.dev. Keine Portfreigabe, die Adresse bleibt gleich.', 'Friends connect through a fixed address on vibey.henny.dev. No port forwarding, and the address stays the same.')],
      [L('playit.gg', 'playit.gg'), L('Alternativ ein kostenloser Tunnel über einen playit.gg-Agent, einmal im Browser bestätigt.', 'Alternatively a free tunnel through a playit.gg agent, confirmed once in the browser.')],
    ],
  },
  {
    id: 'dienste', shot: null, toc: L('Dienste', 'Services'),
    title: L('Vibe-Dienste', 'Vibe services'),
    lead: L('Optional und in den Einstellungen abschaltbar. Sie laufen über unser Backend auf vibe.henny.dev.', 'Optional and can be turned off in the settings. They run on our backend at vibe.henny.dev.'),
    rows: [
      [L('Freunde und Presence', 'Friends and presence'), L('Freundesliste, und Freunde sehen auf Wunsch, ob du online bist und was du spielst.', 'A friends list, and if you like, friends see whether you are online and what you play.')],
      [L('Chats', 'Chats'), L('Nachrichten an Freunde direkt im Launcher.', 'Messages to friends right in the launcher.')],
      [L('Einladungen', 'Invites'), L('Freunde mit einem Klick in eine gehostete Welt oder auf deinen Server einladen.', 'Invite friends to a hosted world or your server in one click.')],
      [L('Geteilte Modpacks', 'Shared modpacks'), L('Eine Instanz als Link teilen: <code>vibe.henny.dev/p/&lt;code&gt;</code>. Wer ihn öffnet, bekommt dieselben Mods und Einstellungen.', 'Share an instance as a link: <code>vibe.henny.dev/p/&lt;code&gt;</code>. Whoever opens it gets the same mods and settings.')],
    ],
  },
  {
    id: 'profil', shot: 'skins', toc: L('Konto', 'Account'),
    title: L('Konto, Skins und Updates', 'Account, skins and updates'),
    rows: [
      [L('Skins und Capes', 'Skins and capes'), L('Vorschau in 3D, eigene Skin-Bibliothek, Skins per Datei oder Spielername, Capes umschalten.', '3D preview, your own skin library, skins from a file or a player name, switch capes.')],
      [L('Screenshots', 'Screenshots'), L('Alle Screenshots aller Instanzen an einem Ort, mit Großansicht, Kopieren und Löschen.', 'All screenshots of all instances in one place, with a large view, copy and delete.')],
      [L('Konten', 'Accounts'), L('Microsoft-Login mit mehreren Konten. Die Tokens liegen im Windows-Tresor, nie im Klartext.', 'Microsoft login with several accounts. Tokens are kept in the Windows vault, never in plain text.')],
      [L('Selbst-Updates', 'Self-updates'), L('Der Launcher aktualisiert sich selbst, im Release-Kanal oder im Dev-Kanal mit jedem neuen Stand.', 'The launcher updates itself, on the release channel or on the dev channel with every new build.')],
    ],
  },
];

export function title() { return 'Vibe Launcher · Vibe Craft Studios'; }

function group(g) {
  const rows = `<dl class="specs">${g.rows.map(([k, v]) => `<div><dt>${t(k)}</dt><dd>${t(v)}</dd></div>`).join('')}</dl>`;
  return `<section class="section lp-group${g.shot ? '' : ' no-shot'}" id="${g.id}"><div class="wrap lp-group-grid" data-reveal>
    <div>
      <h2 class="display sm">${t(g.title)}</h2>
      ${g.lead ? `<p class="lead">${t(g.lead)}</p>` : ''}
      ${rows}
    </div>
    ${g.shot ? `<figure class="lp-shot"><button type="button" data-lshot="${g.shot}"><img src="${BASE}/img/${g.shot}.webp" alt="${esc(tx(SHOT_NAMES[g.shot]))}" width="1280" height="800" loading="lazy"></button><figcaption>${t(SHOT_NAMES[g.shot])}</figcaption></figure>` : ''}
  </div></section>`;
}

export function render(mods) {
  const storeMods = mods.filter((m) => m.source);
  const toc = GROUPS.map((g) => `<a href="#${g.id}" data-anchor>${t(g.toc || g.title)}</a>`).join('');
  return `<div class="launcher-page" style="--accent:${ACCENT};--on-accent:#fff">
  <section class="hero mod-hero lp-hero">
    <div class="wrap lp-hero-grid">
      <div class="hero-copy">
        <div class="lp-brand"><div class="lp-seal"><canvas class="lp-seal-canvas" aria-hidden="true"></canvas></div>
          <div><h1 class="display">Vibe Launcher</h1><p class="lp-sub">Windows 10 / 11 · ${t(L('kostenlos', 'free'))} · ${t(L('Quellcode auf GitHub', 'source on GitHub'))}</p></div></div>
        <p class="lead strong">${t(L('Der Minecraft-Launcher von Vibe Craft Studios.', 'The Minecraft launcher by Vibe Craft Studios.'))}</p>
        <p class="lead">${t(L('Instanzen, Mods, Modpacks, Server und Skins in einem Programm. Unsere eigenen Mods sind über den Vibe-Craft-Store direkt installierbar.', 'Instances, mods, modpacks, servers and skins in one program. Our own mods install straight from the Vibe Craft store.'))}</p>
        <div class="lp-download">
          <a class="btn primary lp-get" href="${STABLE}" rel="noopener">↓ ${t(L('Für Windows herunterladen', 'Download for Windows'))}</a>
          <p class="lp-file"><span class="lp-ver">Vibe-Launcher-Setup.exe</span><br><span class="lp-meta">${t(L('Installation ohne Admin-Rechte, aktualisiert sich selbst', 'Installs without admin rights, updates itself'))}</span></p>
        </div>
        <p class="note"><a href="${RELEASES}" target="_blank" rel="noopener">${t(L('Alle Versionen', 'All versions'))} ↗</a> · <a href="https://github.com/${REPO}" target="_blank" rel="noopener">${t(L('Quellcode', 'Source code'))} ↗</a> · <a href="#installation" data-anchor>${t(L('Hinweis zu Windows SmartScreen', 'About Windows SmartScreen'))}</a></p>
      </div>
      <figure class="lp-hero-shot"><button type="button" data-lshot="home"><img src="${BASE}/img/home.webp" alt="${esc(tx(SHOT_NAMES.home))}" width="1280" height="800"></button></figure>
    </div>
  </section>
  <nav class="toc" aria-label="${esc(tx(L('Inhalt', 'Contents')))}"><div class="wrap toc-inner">${toc}<a href="#store" data-anchor>${t(L('Store', 'Store'))}</a><a href="#installation" data-anchor class="toc-cta">${t(L('Installation', 'Installation'))}</a></div></nav>

  ${GROUPS.map(group).join('')}

  <section class="section lp-store" id="store"><div class="wrap lp-store-grid" data-reveal>
    <div>
      <p class="eyebrow">${t(L('Vibe-Craft-Store', 'Vibe Craft store'))}</p>
      <h2 class="display sm">${t(L('Unsere Mods im Launcher', 'Our mods in the launcher'))}</h2>
      <p class="lead">${t(L('Der Store von Vibe Craft Studios ist im Launcher schon eingetragen. Alles aus dem Download-Center lässt sich dort suchen und mit einem Klick in eine Instanz installieren.', 'The Vibe Craft Studios store is already set up in the launcher. Everything from the download center can be found there and installed into an instance in one click.'))}</p>
    </div>
    <ul class="lp-store-mods">${storeMods.map((m) => `<li><a href="${m.path}" data-link style="--accent:${m.accent}"><span class="px-icon" data-src="${m.base}/${m.icon || 'icon.png'}"></span><span>${esc(m.name)}</span></a></li>`).join('')}</ul>
  </div></section>

  <section class="section"><div class="wrap">
    <header class="sec-head" data-reveal>
      <h2 class="display sm">${t(L('Weitere Ansichten', 'More views'))}</h2>
      <p class="lead">${t(L('Mit Beispieldaten. Klicken zum Vergrößern.', 'With demo data. Click to enlarge.'))}</p></header>
    <div class="gallery" data-reveal>${['discover', 'project', 'library'].map((k) => `<figure class="shot"><button type="button" data-lshot="${k}"><img src="${BASE}/img/${k}.webp" alt="${esc(tx(SHOT_NAMES[k]))}" loading="lazy"></button><figcaption>${t(SHOT_NAMES[k])}</figcaption></figure>`).join('')}</div>
  </div></section>

  <section class="section lp-install" id="installation"><div class="wrap lp-install-grid" data-reveal>
    <div>
      <h2 class="display sm">${t(L('In einer Minute startklar', 'Ready in a minute'))}</h2>
      <ol class="steps">
        <li>${t(L(`<a href="${STABLE}" class="lp-get-link">Vibe-Launcher-Setup.exe</a> herunterladen und starten. Admin-Rechte braucht es nicht.`, `Download and run <a href="${STABLE}" class="lp-get-link">Vibe-Launcher-Setup.exe</a>. No admin rights needed.`))}</li>
        <li>${t(L('Mit dem Microsoft-Konto anmelden, mit dem du Minecraft: Java Edition gekauft hast.', 'Sign in with the Microsoft account you bought Minecraft: Java Edition with.'))}</li>
        <li>${t(L('Instanz anlegen oder importieren und spielen. Updates holt sich der Launcher von selbst.', 'Create or import an instance and play. The launcher fetches its own updates.'))}</li>
      </ol>
      <p class="small lp-req">${t(L('Voraussetzung: Windows 10 oder 11, 64 Bit. Die Daten liegen unter <code>%APPDATA%\\VibeLauncher</code>.', 'Requires Windows 10 or 11, 64-bit. Data lives in <code>%APPDATA%\\VibeLauncher</code>.'))}</p>
    </div>
    <aside class="lp-note card">
      <h3>${t(L('Windows warnt beim ersten Start?', 'Windows warns on first start?'))}</h3>
      <p>${t(L('Der Installer hat noch kein gekauftes Code-Signing-Zertifikat. Darum zeigt Windows eventuell „Der Computer wurde durch Windows geschützt“. Klick auf <b>Weitere Informationen</b> und dann auf <b>Trotzdem ausführen</b>.', 'The installer does not have a paid code signing certificate yet, so Windows may show “Windows protected your PC”. Click <b>More info</b>, then <b>Run anyway</b>.'))}</p>
      <p class="small">${t(L('Der Quellcode liegt offen auf GitHub.', 'The source code is open on GitHub.'))} <a href="https://github.com/${REPO}" target="_blank" rel="noopener">${REPO} ↗</a></p>
    </aside>
  </div></section>

  <section class="section lp-next"><div class="wrap"><div class="card lp-next-grid" data-reveal>
    <div>
      <p class="eyebrow">${t(L('Passt dazu', 'Goes with it'))}</p>
      <h2 class="display sm"><a href="/client/" data-link>Vibey Client</a></h2>
      <p class="lead">${t(L('Unsere Client-Mod mit Cosmetics, Emotes und Freunden im Spiel. Der Launcher installiert sie samt Abhängigkeiten mit einem Klick.', 'Our client mod with cosmetics, emotes and friends in game. The launcher installs it with its dependencies in one click.'))}</p>
    </div>
    <a class="btn primary" href="/client/" data-link>${t(L('Zum Vibey Client', 'View Vibey Client'))}</a>
  </div></div></section>
</div>`;
}

function size(bytes) {
  const mb = (bytes / 1048576).toFixed(1);
  return bytes >= 1048576 ? t(L(`${mb.replace('.', ',')} MB`, `${mb} MB`)) : `${Math.round(bytes / 1024)} KB`;
}
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
  const setup = (x) => x.assets?.find((a) => /^Vibe-Launcher-Setup\.exe$/i.test(a.name)) || x.assets?.find((a) => /setup\.exe$/i.test(a.name));
  return list.find((x) => !x.prerelease && setup(x)) || list.find((x) => setup(x)) || null;
}

export async function mount(root, mods, signal) {
  animateIcons(root);
  sealStage($('.lp-seal-canvas', root), { hoverEl: $('.lp-brand', root), signal, compact: true }).catch(console.error);
  $$('[data-lshot]', root).forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.lshot;
    openLightbox(`${BASE}/img/${k}.webp`, `<b>${t(SHOT_NAMES[k] || L('Vibe Launcher', 'Vibe Launcher'))}</b>`);
  }, { signal }));

  try {
    const rel = await latest(signal);
    if (!rel) {
      // Noch kein Release mit Installer: der stabile Link liefe ins Leere, also auf die Release-Seite zeigen
      $$('.lp-get, .lp-get-link', root).forEach((a) => { a.href = RELEASES; a.target = '_blank'; });
      $('.lp-meta', root).innerHTML = t(L('Erste Version in Kürze', 'First version coming soon'));
      return;
    }
    const exe = rel.assets.find((a) => /^Vibe-Launcher-Setup\.exe$/i.test(a.name)) || rel.assets.find((a) => /setup\.exe$/i.test(a.name));
    // Ist die neueste Version eine Vorabversion, zeigt /releases/latest nicht darauf: dann direkt auf ihre Datei verlinken
    if (rel.prerelease) $$('.lp-get, .lp-get-link', root).forEach((a) => { a.href = exe.browser_download_url; });
    const ver = String(rel.tag_name || rel.name).replace(/^v/i, '');
    $('.lp-meta', root).innerHTML = `${t(L('Version', 'Version'))} <b>${esc(ver)}</b> · ${day(rel.published_at)} · ${size(exe.size)}`;
  } catch (e) {
    if (e.name !== 'AbortError') console.warn('Launcher-Version nicht abrufbar:', e.message);
  }
}
