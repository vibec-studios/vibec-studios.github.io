"""Sammelt die Downloads aller Mods für das Download-Center und lässt neue Dateien von VirusTotal prüfen.

Aufruf (aus dem Repo-Ordner, nur Python-Standardbibliothek):
    python tools/downloads.py

- Welche Mods es gibt, steht in js/content/index.js (IDS); das GitHub-Repo jeder Mod kommt aus `source:` ihrer
  Inhaltsdatei. Eine neue Mod mit Repo taucht also von selbst im Download-Center auf, sobald sie ein Release hat.
- Je Release zählen die .jar-Dateien (ohne -sources/-dev). Die SHA-256 liefert GitHub mit (`digest`), sonst wird die
  Datei geladen und selbst gerechnet.
- VirusTotal nur mit Umgebungsvariable VT_API_KEY (in der GitHub Action ein Repo-Secret, nie in Dateien schreiben):
  Erst wird per Prüfsumme nachgesehen; kennt VirusTotal die Datei nicht, wird sie hochgeladen (nur für die neuesten
  UPLOAD_LATEST Releases je Mod) und auf das Ergebnis gewartet. Fertige Ergebnisse werden nach REFRESH_DAYS neu
  abgefragt. Die kostenlose API erlaubt 4 Anfragen pro Minute, deshalb der Abstand zwischen den Aufrufen.
- Optional GITHUB_TOKEN für ein höheres Anfragelimit bei GitHub.

Ergebnis: data/downloads.json. Ändert sich nichts, bleibt die Datei unverändert (kein leerer Commit).
"""
import datetime
import hashlib
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
import uuid

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, 'data', 'downloads.json')
VT = 'https://www.virustotal.com/api/v3'
UPLOAD_LATEST = 3
REFRESH_DAYS = 14
VT_GAP = 15.5  # Sekunden zwischen zwei VirusTotal-Aufrufen (4/min)
POLL_TRIES = 12
UA = 'vibec-studios-downloads'


def now_iso():
    return datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')


def log(*a):
    print(*a, flush=True)


# ------------------------------------------------------------------ Mods und Repos

def mod_repos():
    registry = open(os.path.join(HERE, 'js', 'content', 'index.js'), encoding='utf8').read()
    ids = re.findall(r"'([a-z0-9_-]+)'", re.search(r'const IDS = \[(.*?)\]', registry).group(1))
    out = []
    for mod in ids:
        path = os.path.join(HERE, 'js', 'content', f'{mod}.js')
        if not os.path.exists(path):
            continue
        src = re.search(r"source:\s*'https://github\.com/([^/']+/[^/']+?)/?'", open(path, encoding='utf8').read())
        if src:
            out.append((mod, src.group(1)))
        else:
            log(f'{mod}: kein GitHub-Repo in source, übersprungen')
    return out


# ------------------------------------------------------------------ HTTP

def request(url, headers=None, data=None, method=None, timeout=120):
    req = urllib.request.Request(url, data=data, method=method, headers={'User-Agent': UA, **(headers or {})})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.status, r.read()


def gh_json(url):
    headers = {'Accept': 'application/vnd.github+json'}
    token = os.environ.get('GITHUB_TOKEN')
    if token:
        headers['Authorization'] = f'Bearer {token}'
    _, body = request(url, headers)
    return json.loads(body)


def fetch_bytes(url):
    _, body = request(url, timeout=300)
    return body


class VirusTotal:
    def __init__(self, key):
        self.key = key
        self.last = 0.0
        self.calls = 0

    def _wait(self):
        gap = VT_GAP - (time.time() - self.last)
        if gap > 0:
            time.sleep(gap)
        self.last = time.time()
        self.calls += 1

    def _call(self, path_or_url, data=None, headers=None, method=None):
        self._wait()
        url = path_or_url if path_or_url.startswith('http') else VT + path_or_url
        try:
            _, body = request(url, {'x-apikey': self.key, 'accept': 'application/json', **(headers or {})}, data, method, timeout=300)
            return json.loads(body)
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            raise

    def report(self, sha):
        data = self._call(f'/files/{sha}')
        if not data:
            return None
        attr = data['data']['attributes']
        stats = attr.get('last_analysis_stats') or {}
        if not attr.get('last_analysis_date'):
            return {'status': 'pending', 'checked': now_iso()}
        return summary(stats, attr['last_analysis_date'])

    def upload(self, name, blob):
        boundary = uuid.uuid4().hex
        body = (f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="{name}"\r\n'
                f'Content-Type: application/java-archive\r\n\r\n').encode() + blob + f'\r\n--{boundary}--\r\n'.encode()
        url = VT + '/files'
        if len(blob) > 32 * 1024 * 1024:
            url = self._call('/files/upload_url')['data']
        data = self._call(url, body, {'Content-Type': f'multipart/form-data; boundary={boundary}'}, 'POST')
        return data['data']['id']

    def wait_analysis(self, analysis_id):
        for _ in range(POLL_TRIES):
            data = self._call(f'/analyses/{analysis_id}')
            attr = data['data']['attributes']
            if attr.get('status') == 'completed':
                return summary(attr.get('stats') or {}, attr.get('date') or int(time.time()))
        return {'status': 'pending', 'checked': now_iso()}


def summary(stats, when):
    bad = int(stats.get('malicious', 0))
    sus = int(stats.get('suspicious', 0))
    clean = int(stats.get('harmless', 0)) + int(stats.get('undetected', 0))
    total = bad + sus + clean
    date = datetime.datetime.fromtimestamp(int(when), datetime.timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')
    return {'status': 'done', 'malicious': bad, 'suspicious': sus, 'clean': clean, 'total': total, 'date': date, 'checked': now_iso()}


def age_days(iso):
    try:
        t = datetime.datetime.fromisoformat(iso.replace('Z', '+00:00'))
    except (AttributeError, ValueError):
        return 1e9
    return (datetime.datetime.now(datetime.timezone.utc) - t).total_seconds() / 86400


# ------------------------------------------------------------------ Sammeln

def wanted_asset(name):
    n = name.lower()
    return n.endswith('.jar') and not re.search(r'-(sources|dev|javadoc)\.jar$', n)


def collect(mod, repo, old):
    previous = {a['sha256']: a.get('vt') for r in (old or {}).get('releases', []) for a in r.get('assets', []) if a.get('vt')}
    releases = []
    page = 1
    while True:
        batch = gh_json(f'https://api.github.com/repos/{repo}/releases?per_page=100&page={page}')
        if not batch:
            break
        releases += batch
        page += 1
    out = []
    for rel in releases:
        if rel.get('draft'):
            continue
        assets = []
        for a in rel.get('assets', []):
            if not wanted_asset(a['name']):
                continue
            digest = a.get('digest') or ''
            sha = digest.split(':', 1)[1] if digest.startswith('sha256:') else hashlib.sha256(fetch_bytes(a['browser_download_url'])).hexdigest()
            entry = {'name': a['name'], 'size': a['size'], 'url': a['browser_download_url'], 'sha256': sha}
            if previous.get(sha):
                entry['vt'] = previous[sha]
            assets.append(entry)
        tag = rel.get('tag_name') or ''
        out.append({
            'tag': tag,
            'version': re.sub(r'^[vV]', '', tag),
            'name': rel.get('name') or tag,
            'date': rel.get('published_at') or rel.get('created_at'),
            'prerelease': bool(rel.get('prerelease')),
            'url': rel.get('html_url'),
            'assets': assets,
        })
    out.sort(key=lambda r: r['date'] or '', reverse=True)
    return {'repo': repo, 'releases': out}


def scan(vt, data):
    for mod, info in data.items():
        for i, rel in enumerate(info['releases']):
            for a in rel['assets']:
                cur = a.get('vt') or {}
                if cur.get('status') == 'done' and age_days(cur.get('checked')) < REFRESH_DAYS:
                    continue
                if cur.get('status') == 'unknown' and i >= UPLOAD_LATEST and age_days(cur.get('checked')) < REFRESH_DAYS:
                    continue
                log(f'VirusTotal: {mod} {a["name"]}')
                rep = vt.report(a['sha256'])
                if rep is None and i < UPLOAD_LATEST:
                    log('  unbekannt, wird hochgeladen')
                    analysis = vt.upload(a['name'], fetch_bytes(a['url']))
                    rep = vt.wait_analysis(analysis)
                elif rep is None:
                    rep = {'status': 'unknown', 'checked': now_iso()}
                a['vt'] = rep
                log(f'  {rep.get("status")} {rep.get("malicious", "")}/{rep.get("total", "")}')


def main():
    old = {}
    if os.path.exists(OUT):
        old = json.load(open(OUT, encoding='utf8'))
    data = {}
    for mod, repo in mod_repos():
        try:
            data[mod] = collect(mod, repo, old.get('mods', {}).get(mod))
            log(f'{mod}: {repo}, {len(data[mod]["releases"])} Releases')
        except urllib.error.HTTPError as e:
            log(f'{mod}: {repo} nicht lesbar ({e.code}), alter Stand bleibt')
            if old.get('mods', {}).get(mod):
                data[mod] = old['mods'][mod]
    key = os.environ.get('VT_API_KEY', '').strip()
    if key:
        try:
            scan(VirusTotal(key), data)
        except urllib.error.HTTPError as e:
            log(f'VirusTotal-Fehler {e.code}: {e.read()[:300]!r}; bisherige Ergebnisse bleiben, Rest beim nächsten Lauf')
    else:
        log('Kein VT_API_KEY: VirusTotal wird übersprungen')

    if old and data == old.get('mods', {}):
        log('Keine inhaltliche Änderung')
        return
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf8', newline='\n') as f:
        json.dump({'updated': now_iso(), 'mods': data}, f, indent=1, ensure_ascii=False)
        f.write('\n')
    log('Geschrieben:', os.path.relpath(OUT, HERE))


if __name__ == '__main__':
    sys.exit(main())
