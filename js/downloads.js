// Download-Daten: data/downloads.json, erzeugt von tools/downloads.py (GitHub-Releases + VirusTotal, siehe dort).

let cache = null;

/** Einmal laden; ohne Datei oder bei Fehlern null (die Seite zeigt dann „noch kein Release“). */
export function loadDownloads() {
  if (!cache) {
    cache = fetch('/data/downloads.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
  }
  return cache;
}

export function releasesOf(dl, id) {
  return dl?.mods?.[id]?.releases || [];
}

/** Neuestes Release mit Datei (Vorabversionen nur, wenn es nichts anderes gibt). */
export function latestRelease(dl, id) {
  const list = releasesOf(dl, id).filter((r) => r.assets?.length);
  return list.find((r) => !r.prerelease) || list[0] || null;
}

export const vtLink = (sha) => `https://www.virustotal.com/gui/file/${sha}`;
