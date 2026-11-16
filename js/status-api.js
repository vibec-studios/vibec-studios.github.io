// Live-Status des Vibey-Relays (Backend: Dokploy-App „Status“, gecacht ~5 s). Wird von /status/ und der Vibey-Seite genutzt.

export const STATUS_URL = 'https://vibey-status.henny.dev/status';
export const POLL_MS = 15000;

/**
 * Holt den Status. Ergebnis immer ein Objekt:
 *   { state: 'ok' | 'down', data, error, at }
 * 503 vom Backend (Relay weg) und Netzwerkfehler (API weg) zählen beide als Störung.
 */
export async function fetchStatus(signal) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 8000);
  const stop = () => ctl.abort();
  signal?.addEventListener('abort', stop);
  try {
    const r = await fetch(STATUS_URL, { cache: 'no-store', signal: ctl.signal });
    let data = null;
    try { data = await r.json(); } catch (e) { data = null; }
    const ok = r.ok && data?.ok === true && data?.health?.relay === 'ok';
    return { state: ok ? 'ok' : 'down', data, error: ok ? null : (data?.health?.error || `HTTP ${r.status}`), at: new Date() };
  } catch (e) {
    if (signal?.aborted) throw e;
    return { state: 'down', data: null, error: e.name === 'AbortError' ? 'Timeout' : (e.message || 'Netzwerkfehler'), at: new Date() };
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', stop);
  }
}

/** Dauer in Sekunden kurz und lesbar: 45 s, 12 min, 3 h 4 min, 2 Tage 5 h. */
export function duration(sec, l = 'de') {
  sec = Math.max(0, Math.floor(sec || 0));
  const d = Math.floor(sec / 86400), h = Math.floor(sec % 86400 / 3600), m = Math.floor(sec % 3600 / 60);
  const day = l === 'de' ? (d === 1 ? 'Tag' : 'Tage') : (d === 1 ? 'day' : 'days');
  if (d) return h ? `${d} ${day} ${h} h` : `${d} ${day}`;
  if (h) return m ? `${h} h ${m} min` : `${h} h`;
  if (m) return `${m} min`;
  return `${sec} s`;
}
