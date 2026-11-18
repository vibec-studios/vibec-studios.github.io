// Statusseite für Vibey Multiplayer: Relay-Zustand, gehostete Welten, Spieler und Zähler, alle 15 s neu.
// Die Liste ist bewusst anonym (keine Namen, keine Adressen); so liefert sie auch das Backend.
import { $, t, esc } from '../core.js';
import { fetchStatus, duration, POLL_MS } from '../status-api.js';

const L = (de, en) => ({ de, en });
export const ACCENT = '#3b82f6';
const HISTORY = 40;

export function title() { return 'Status · Vibey Multiplayer · Vibe Craft Studios'; }

export function render() {
  return `<div class="status-page" style="--accent:${ACCENT};--on-accent:#fff">
  <section class="hero st-hero">
    <div class="wrap">
      <a class="back" href="/mods/vibey/" data-link>← Vibey Multiplayer</a>
      <p class="eyebrow">${t(L('Live-Status des Vibey-Relays', 'Live status of the Vibey relay'))}</p>
      <div class="st-state" data-state="wait">
        <span class="st-light" aria-hidden="true"></span>
        <h1 class="display st-title">${t(L('Wird geprüft …', 'Checking …'))}</h1>
      </div>
      <p class="lead st-sub">${t(L('Der Relay verbindet gehostete Welten mit ihren Gästen. Hier siehst du, ob er läuft und wie viel gerade los ist.', 'The relay connects hosted worlds with their guests. Here you can see whether it is running and how busy it is right now.'))}</p>
      <p class="note st-meta">&nbsp;</p>
    </div>
  </section>

  <section class="section st-numbers">
    <div class="wrap">
      <div class="st-tiles">
        <div class="st-tile"><span class="k mono">${t(L('Gehostete Welten', 'Hosted worlds'))}</span><b data-k="worlds">–</b></div>
        <div class="st-tile"><span class="k mono">${t(L('Spieler verbunden', 'Players connected'))}</span><b data-k="players">–</b></div>
        <div class="st-tile"><span class="k mono">${t(L('Relay läuft seit', 'Relay up for'))}</span><b data-k="uptime">–</b></div>
        <div class="st-tile"><span class="k mono">${t(L('Latenz', 'Latency'))}</span><b data-k="latency">–</b></div>
      </div>
      <div class="st-minor">
        <div><span>${t(L('Feste Adressen', 'Fixed addresses'))}</span><b data-k="addresses">–</b></div>
        <div><span>${t(L('Joins seit Start', 'Joins since start'))}</span><b data-k="joins">–</b></div>
        <div><span>${t(L('Server-Listen-Pings', 'Server list pings'))}</span><b data-k="pings">–</b></div>
        <div><span>${t(L('Abgewiesen', 'Blocked'))}</span><b data-k="blocked">–</b></div>
        <div><span>${t(L('Speicher', 'Memory'))}</span><b data-k="memory">–</b></div>
        <div><span>Relay</span><b data-k="version">–</b></div>
      </div>
    </div>
  </section>

  <section class="section st-worlds">
    <div class="wrap">
      <header class="sec-head">
        <h2 class="display sm">${t(L('Gehostete Welten', 'Hosted worlds'))}</h2>
        <p class="lead">${t(L('Anonym: Die Liste zeigt nur, wie viele in einer Welt spielen, mit welcher Version und seit wann. Keine Namen, keine Adressen.', 'Anonymous: the list only shows how many people play in a world, on which version and since when. No names, no addresses.'))}</p>
      </header>
      <div class="st-list card" aria-live="polite"></div>
    </div>
  </section>

  <section class="section st-history-sec">
    <div class="wrap st-history-grid">
      <div>
        <h2 class="display sm">${t(L('Letzte Prüfungen', 'Recent checks'))}</h2>
        <p class="small">${t(L(`Alle ${POLL_MS / 1000} Sekunden, solange diese Seite offen ist. Jeder Block ist eine Prüfung.`, `Every ${POLL_MS / 1000} seconds while this page is open. Every block is one check.`))}</p>
      </div>
      <div class="st-history" aria-label="${t(L('Verlauf', 'History'))}"></div>
    </div>
  </section>
</div>`;
}

function setText(root, key, html) {
  const el = $(`[data-k="${key}"]`, root);
  if (el) el.innerHTML = html;
}

function ago(iso, now) {
  const sec = Math.max(0, (now - new Date(iso).getTime()) / 1000);
  return t(L(`seit ${duration(sec, 'de')}`, `for ${duration(sec, 'en')}`));
}

function renderList(root, res) {
  const box = $('.st-list', root);
  const list = res.data?.list || [];
  if (res.state !== 'ok') {
    box.innerHTML = `<p class="st-empty">${t(L('Solange der Relay gestört ist, kann niemand hosten.', 'While the relay is down, nobody can host.'))}</p>`;
    return;
  }
  if (!list.length) {
    box.innerHTML = `<p class="st-empty">${t(L('Gerade hostet niemand eine Welt.', 'Nobody is hosting a world right now.'))} <a href="/mods/vibey/" data-link>${t(L('Sei die erste Welt →', 'Be the first world →'))}</a></p>`;
    return;
  }
  const now = Date.now();
  const max = Math.max(...list.map((w) => w.players || 0), 1);
  box.innerHTML = `<div class="st-row st-head mono"><span>#</span><span>${t(L('Spieler', 'Players'))}</span><span>Minecraft</span><span>${t(L('Online', 'Online'))}</span></div>` +
    list.map((w, i) => `<div class="st-row">
      <span class="mono st-n">${String(i + 1).padStart(2, '0')}</span>
      <span class="st-players"><b>${w.players || 0}</b><i style="--w:${Math.round(((w.players || 0) / max) * 100)}%"></i></span>
      <span class="mono">${esc(w.mc || '–')}</span>
      <span class="mono small">${w.since ? ago(w.since, now) : '–'}</span>
    </div>`).join('');
}

function renderHistory(root, history) {
  const box = $('.st-history', root);
  const fmt = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const pad = Math.max(0, HISTORY - history.length);
  box.innerHTML = '<span class="st-h empty"></span>'.repeat(pad) +
    history.map((h) => `<span class="st-h ${h.state}" title="${fmt(h.at)} · ${h.state === 'ok' ? `OK · ${h.latency ?? '–'} ms` : 'Störung'}"></span>`).join('');
}

export function mount(root, mods, signal) {
  const history = [];
  let last = null;
  let timer = null;

  function paint(res) {
    last = res;
    const d = res.data || {};
    const ok = res.state === 'ok';
    const state = $('.st-state', root);
    state.dataset.state = res.state;
    $('.st-title', root).innerHTML = ok ? t(L('Betriebsbereit', 'Operational')) : t(L('Störung', 'Outage'));
    const num = (v) => (v == null ? '–' : Number(v).toLocaleString());
    setText(root, 'worlds', ok ? num(d.worlds) : '–');
    setText(root, 'players', ok ? num(d.players) : '–');
    setText(root, 'uptime', ok && d.uptime != null ? t(L(duration(d.uptime, 'de'), duration(d.uptime, 'en'))) : '–');
    setText(root, 'latency', ok && d.health?.latencyMs != null ? `${d.health.latencyMs}<small> ms</small>` : '–');
    setText(root, 'addresses', num(d.addresses));
    setText(root, 'joins', num(d.totals?.joins));
    setText(root, 'pings', num(d.totals?.pings));
    setText(root, 'blocked', num(d.totals?.blocked));
    setText(root, 'memory', d.health?.memoryMb != null ? `${d.health.memoryMb} MB` : '–');
    setText(root, 'version', d.version ? `v${esc(d.version)}` : '–');
    renderList(root, res);
    history.push({ state: res.state, at: res.at, latency: d.health?.latencyMs });
    if (history.length > HISTORY) history.shift();
    renderHistory(root, history);
    tick();
  }

  // „zuletzt geprüft“ läuft sekundengenau mit, ohne neu zu laden
  function tick() {
    if (!last) return;
    const s = Math.round((Date.now() - last.at.getTime()) / 1000);
    const err = last.state !== 'ok' ? ` · ${esc(last.error || '')}` : '';
    $('.st-meta', root).innerHTML = `${t(L(`Zuletzt geprüft vor ${s} s`, `Last checked ${s} s ago`))} · ${t(L(`nächste Prüfung in ${Math.max(0, Math.ceil((POLL_MS / 1000) - s))} s`, `next check in ${Math.max(0, Math.ceil((POLL_MS / 1000) - s))} s`))}${err}`;
  }

  async function poll() {
    clearTimeout(timer);
    try { paint(await fetchStatus(signal)); } catch (e) { return; }
    if (!signal.aborted) timer = setTimeout(poll, POLL_MS);
  }

  const clock = setInterval(tick, 1000);
  const onVisible = () => { if (!document.hidden && last && Date.now() - last.at.getTime() > POLL_MS) poll(); };
  document.addEventListener('visibilitychange', onVisible, { signal });
  signal.addEventListener('abort', () => { clearTimeout(timer); clearInterval(clock); });
  poll();
}
