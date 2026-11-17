"""Erzeugt data/store.json im Format „Vibe Store v1“ für den Vibe Launcher (Spezifikation: docs/STORE.md im Launcher-Repo).

Aufruf (aus dem Repo-Ordner, nur Python-Standardbibliothek, Python ≥ 3.11 wegen tomllib):
    python tools/store.py

- Projekte: alle Mods aus js/content/index.js (IDS). Titel, Kurzbeschreibung, Beschreibung (Markdown), Icon,
  Kategorien, Galerie und Links kommen aus der Inhaltsdatei js/content/<id>.js. Die Datei wird nicht ausgeführt,
  sondern ihr `export default { … }` als JS-Literal gelesen (Strings, Zahlen, Arrays, Objekte, S('de', 'en')).
  Texte sind deutsch (de); Mods ohne Release fehlen im Store, weil es nichts zu installieren gibt.
- Versionen: eine Store-Version je .jar eines GitHub-Releases. Minecraft-Versionen, Loader und Abhängigkeiten stehen
  in der Jar selbst (fabric.mod.json, quilt.mod.json, META-INF/neoforge.mods.toml, META-INF/mods.toml); Bereiche wie
  ">=1.21 <1.21.2", "~1.21.11", "1.21.x" oder "[1.21.6,1.21.9)" werden mit der Versionsliste von Mojang zu exakten
  Release-Versionen aufgelöst. Nach oben offene Bereiche (">=1.21.9", "[1.21,)", "^1.21") bleiben in der Versionslinie
  der Untergrenze (1.21.x), damit eine alte Jar nicht für jede künftige Minecraft-Version gilt. Ohne Angaben in der
  Jar gilt der Dateiname (…-fabric-1.21.2-1.21.3-1.0.0.jar), zuletzt `mc`/`loader` der Inhaltsdatei.
- Jede Jar wird genau einmal geladen: SHA-1/SHA-256 und die gelesenen Metadaten landen in data/store-cache.json
  (Schlüssel: Asset-ID, gültig solange Größe und updated_at gleich bleiben). Die Jars werden nur als Zip gelesen,
  nie ausgeführt.
- Optional GITHUB_TOKEN für ein höheres Anfragelimit bei GitHub.

Ergebnis: data/store.json und data/store-cache.json. Ändert sich inhaltlich nichts, bleiben beide Dateien unverändert.
"""
import hashlib
import io
import json
import os
import re
import sys
import urllib.error
import zipfile

try:
    import tomllib
except ImportError:  # Python < 3.11: mods.toml wird dann per Regex gelesen
    tomllib = None

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import downloads as dl  # noqa: E402  (mod_repos, gh_json, fetch_bytes, wanted_asset, now_iso, log)

HERE = dl.HERE
SITE = 'https://vibec-studios.github.io'
OUT = os.path.join(HERE, 'data', 'store.json')
CACHE = os.path.join(HERE, 'data', 'store-cache.json')
CACHE_SCHEMA = 1
MANIFEST = 'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json'
AUTHOR = 'Vibe Craft Studios'
log = dl.log

STORE_META = {
    'format': 'vibe-store',
    'version': 1,
    'id': 'vibe-craft-studios',
    'name': 'Vibe Craft Studios',
    'icon': f'{SITE}/favicon.svg',
    'homepage': f'{SITE}/',
    'description': 'Mods von Vibe Craft Studios',
}

# Mod-IDs aus den Jar-Metadaten → Projekte auf Modrinth (ID oder Slug, beides versteht der Launcher)
MODRINTH = {
    'fabric-api': 'P7dR8mSH', 'fabric': 'P7dR8mSH',
    'fabric-language-kotlin': 'Ha28R6CL',
    'cloth-config': '9s6osm5g', 'cloth-config2': '9s6osm5g', 'cloth_config': '9s6osm5g',
    'modmenu': 'mOgUt4GM',
    'quilted_fabric_api': 'qsl', 'qsl': 'qsl',
    'kotlinforforge': 'kotlin-for-forge',
    'yet_another_config_lib_v3': 'yacl', 'yacl': 'yacl',
    'architectury': 'architectury-api',
    'geckolib': 'geckolib',
}
# Laufzeit und Loader selbst sind keine Abhängigkeiten im Store
NOT_DEPS = {'minecraft', 'java', 'fabricloader', 'fabric-loader', 'quilt_loader', 'quilt_base', 'neoforge', 'forge',
            'javafml', 'kotlin', 'mixinextras'}
# Fallback, wenn eine Jar keine lesbaren Abhängigkeiten hat: Einträge aus `requires:` der Inhaltsdatei
REQUIRES_TEXT = {'fabric api': 'fabric-api', 'fabric language kotlin': 'fabric-language-kotlin',
                 'cloth config': 'cloth-config', 'mod menu': 'modmenu', 'modmenu': 'modmenu'}
LOADER_NAMES = {'fabric': 'Fabric', 'quilt': 'Quilt', 'neoforge': 'NeoForge', 'forge': 'Forge'}


# ------------------------------------------------------------------ Inhaltsdateien (JS-Literal lesen, nicht ausführen)

class JsLiteral:
    """Liest das Objekt hinter `export default`. Unbekannte Ausdrücke (Konstanten, Funktionsaufrufe außer S(),
    Spread) werden übersprungen und als None geliefert."""

    def __init__(self, src):
        self.s = src
        self.i = 0

    def ws(self):
        s = self.s
        while self.i < len(s):
            c = s[self.i]
            if c.isspace():
                self.i += 1
            elif s.startswith('//', self.i):
                j = s.find('\n', self.i)
                self.i = len(s) if j < 0 else j + 1
            elif s.startswith('/*', self.i):
                j = s.find('*/', self.i + 2)
                self.i = len(s) if j < 0 else j + 2
            else:
                break

    def peek(self):
        self.ws()
        return self.s[self.i] if self.i < len(self.s) else ''

    def string(self):
        q = self.s[self.i]
        self.i += 1
        out = []
        esc = {'n': '\n', 't': '\t', 'r': '\r', 'b': '\b', 'f': '\f', 'v': '\v', '0': '\0'}
        while self.i < len(self.s):
            c = self.s[self.i]
            if c == '\\':
                n = self.s[self.i + 1]
                if n == 'u':
                    if self.s[self.i + 2] == '{':
                        j = self.s.index('}', self.i)
                        out.append(chr(int(self.s[self.i + 3:j], 16)))
                        self.i = j + 1
                    else:
                        out.append(chr(int(self.s[self.i + 2:self.i + 6], 16)))
                        self.i += 6
                    continue
                if n == 'x':
                    out.append(chr(int(self.s[self.i + 2:self.i + 4], 16)))
                    self.i += 4
                    continue
                if n == '\n':
                    self.i += 2
                    continue
                out.append(esc.get(n, n))
                self.i += 2
                continue
            self.i += 1
            if c == q:
                return ''.join(out)
            out.append(c)
        raise ValueError('String ohne Ende')

    def skip_expr(self):
        """Überspringt einen beliebigen Ausdruck bis zum nächsten , ] } ) auf gleicher Ebene."""
        depth = 0
        s = self.s
        while self.i < len(s):
            self.ws()
            if self.i >= len(s):
                break
            c = s[self.i]
            if c in '\'"`':
                self.string()
                continue
            if c in '([{':
                depth += 1
            elif c in ')]}':
                if depth == 0:
                    return None
                depth -= 1
            elif c == ',' and depth == 0:
                return None
            self.i += 1
        return None

    def ident(self):
        m = re.compile(r'[A-Za-z_$][\w$]*').match(self.s, self.i)
        return m.group(0) if m else None

    def value(self):
        c = self.peek()
        if c in '\'"`':
            return self.string()
        if c == '[':
            return self.array()
        if c == '{':
            return self.obj()
        m = re.compile(r'-?(0x[0-9a-fA-F]+|\d+(\.\d+)?([eE][-+]?\d+)?)(?=[\s,\]})])').match(self.s, self.i)
        if m:
            self.i = m.end()
            t = m.group(0)
            return int(t, 16) if 'x' in t.lower() else (float(t) if re.search(r'[.eE]', t) else int(t))
        name = self.ident()
        if name in ('true', 'false', 'null', 'undefined'):
            after = self.i + len(name)
            if re.compile(r'\s*[,\]})]').match(self.s, after):
                self.i = after
                return {'true': True, 'false': False}.get(name)
        if name == 'S':
            save = self.i
            self.i += 1
            if self.peek() == '(':
                self.i += 1
                de = self.value()
                en = None
                if self.peek() == ',':
                    self.i += 1
                    if self.peek() != ')':
                        en = self.value()
                if self.peek() == ',':
                    self.i += 1
                if self.peek() == ')':
                    self.i += 1
                    if self.peek() in (',', ']', '}', ')', ''):
                        return {'de': de, 'en': en}
            self.i = save
        return self.skip_expr()

    def array(self):
        self.i += 1
        out = []
        while True:
            c = self.peek()
            if c == ']':
                self.i += 1
                return out
            if c == ',':
                self.i += 1
                continue
            if self.s.startswith('...', self.i):
                self.i += 3
                self.skip_expr()
                continue
            out.append(self.value())

    def obj(self):
        self.i += 1
        out = {}
        while True:
            c = self.peek()
            if c == '}':
                self.i += 1
                return out
            if c == ',':
                self.i += 1
                continue
            if self.s.startswith('...', self.i):
                self.i += 3
                self.skip_expr()
                continue
            if c in '\'"':
                key = self.string()
            else:
                key = self.ident()
                if key is None:
                    raise ValueError(f'Unerwartetes Zeichen {c!r} an Position {self.i}')
                self.i += len(key)
            if self.peek() == ':':
                self.i += 1
                out[key] = self.value()
            elif self.peek() == '(':  # Methode: überspringen
                self.skip_expr()
            else:  # Kurzschreibweise { key }
                out[key] = None


def read_content(mod):
    src = open(os.path.join(HERE, 'js', 'content', f'{mod}.js'), encoding='utf8').read()
    m = re.search(r'export\s+default\s*', src)
    if not m:
        raise ValueError('kein export default')
    p = JsLiteral(src)
    p.i = m.end()
    data = p.value()
    if not isinstance(data, dict):
        raise ValueError('export default ist kein Objekt')
    return data


def tx(v, lang='de'):
    """Text aus einem String oder {de, en}; HTML wird zu Markdown/Text."""
    if isinstance(v, dict):
        v = v.get(lang) or v.get('en') or v.get('de')
    if not isinstance(v, str):
        return ''
    v = re.sub(r'<code>(.*?)</code>', r'`\1`', v)
    v = re.sub(r'<(b|strong)>(.*?)</\1>', r'**\2**', v)
    v = re.sub(r'<(i|em)>(.*?)</\1>', r'*\2*', v)
    v = re.sub(r'<br\s*/?>', ' ', v)
    v = re.sub(r'<[^>]+>', '', v)
    return v.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').strip()


def asset_url(mod, rel):
    """Absolute URL einer Datei unter assets/mods/<id>/, nur wenn es sie gibt."""
    if not isinstance(rel, str) or not rel:
        return None
    if rel.startswith('https://'):
        return rel
    rel = rel.lstrip('/')
    path = rel if rel.startswith('assets/') else f'assets/mods/{mod}/{rel}'
    return f'{SITE}/{path}' if os.path.isfile(os.path.join(HERE, *path.split('/'))) else None


def item_lines(items):
    out = []
    for it in items or []:
        if isinstance(it, str) or (isinstance(it, dict) and 'de' in it):  # reiner Text
            if tx(it):
                out.append(f'- {tx(it)}')
            continue
        if not isinstance(it, dict):
            continue
        name = tx(it.get('name') or it.get('title') or it.get('n'))
        desc = tx(it.get('desc') or it.get('text'))
        line = f'**{name}**' if name else ''
        if desc:
            line = f'{line}: {desc}' if line else desc
        if line:
            out.append(f'- {line}')
        for lore in it.get('lore') or []:
            if tx(lore):
                out.append(f'  - {tx(lore)}')
    return out


def body_markdown(c):
    parts = []
    if tx(c.get('intro')):
        parts.append(tx(c['intro']))
    hl = [f'- {tx(h)}' for h in c.get('highlights') or [] if tx(h)]
    if hl:
        parts.append('\n'.join(hl))
    for s in c.get('sections') or []:
        if not isinstance(s, dict) or s.get('type') in ('gallery', 'video'):
            continue
        block = []
        title = tx(s.get('title')) or tx(s.get('toc'))
        if title:
            block.append(f'## {title}')
        for key in ('lead', 'text', 'body'):
            if tx(s.get(key)):
                block.append(tx(s[key]))
        lines = []
        for side in s.get('sides') or []:
            if isinstance(side, dict) and tx(side.get('name')):
                lines.append(f'- **{tx(side["name"])}**' + (f': {tx(side.get("desc"))}' if tx(side.get('desc')) else ''))
        for key in ('items', 'cards', 'bosses', 'commands', 'options'):
            if isinstance(s.get(key), list):
                lines += item_lines(s[key])
        steps = [tx(st) for st in s.get('steps') or [] if tx(st)]
        lines += [f'{i}. {st}' for i, st in enumerate(steps, 1)]
        if lines:
            block.append('\n'.join(lines))
        if len(block) > 1:
            parts.append('\n\n'.join(block))
    req = [tx(r) for r in c.get('requires') or [] if tx(r)]
    if req:
        parts.append('## Voraussetzungen\n\n' + '\n'.join(f'- {r}' for r in req))
    return '\n\n'.join(parts)


def gallery(mod, c):
    out = []
    for s in c.get('sections') or []:
        if not isinstance(s, dict) or s.get('type') != 'gallery':
            continue
        for it in s.get('items') or []:
            url = asset_url(mod, it.get('img')) if isinstance(it, dict) else None
            if url:
                g = {'url': url}
                if tx(it.get('name')):
                    g['title'] = tx(it['name'])
                if tx(it.get('desc')):
                    g['description'] = tx(it['desc'])
                out.append(g)
    return out


# ------------------------------------------------------------------ Minecraft-Versionen

def release_list(cache):
    """Release-Versionen von Mojang, neueste zuerst; ohne Netz die zuletzt gesehene Liste."""
    try:
        data = json.loads(dl.request(MANIFEST)[1])
        out = [v['id'] for v in data['versions'] if v.get('type') == 'release']
        if out:
            cache['mc_releases'] = out
            return out
    except (urllib.error.URLError, OSError, ValueError, KeyError) as e:
        log(f'Mojang-Versionsliste nicht lesbar ({e}), nehme die gespeicherte')
    return cache.get('mc_releases') or []


def vkey(v):
    """Vergleichsschlüssel: Zahlenteile auf 4 Stellen, Vorabversion (1.21-beta) kleiner als das Release."""
    v = v.strip().split('+', 1)[0]
    core, _, pre = v.partition('-')
    nums = []
    for p in core.split('.'):
        m = re.match(r'\d+', p)
        nums.append(int(m.group(0)) if m else 0)
    nums = (nums + [0, 0, 0, 0])[:4]
    return (tuple(nums), 0 if (pre or v.endswith('-')) else 1)


def line_of(v):
    return tuple(vkey(v)[0][:2])


def bump(v, idx):
    nums = list(vkey(v)[0])
    nums[idx] += 1
    for k in range(idx + 1, 4):
        nums[k] = 0
    return (tuple(nums), 0)  # "-" = kleiner als jede Vorabversion dieser Nummer


def fabric_term(term):
    """Ein Fabric-Prädikat ohne Leerzeichen → (Bedingungen, Untergrenze für offene Bereiche oder None, exakt)."""
    m = re.match(r'^(>=|<=|>|<|=|\^|~)?\s*(.+)$', term)
    op, ver = (m.group(1) or ''), m.group(2).strip()
    if ver in ('*', 'x', 'X') and not op:
        return [], None, None, True
    if re.search(r'(^|\.)[xX*](\.|$)', ver):  # 1.21.x
        prefix = re.split(r'\.[xX*]', ver)[0]
        n = len(prefix.split('.'))
        return [('>=', vkey(prefix + '-')), ('<', bump(prefix, n - 1))], None, None, False
    if op in ('', '='):
        return [('==', vkey(ver))], None, ver, False
    if op == '~':
        n = len(ver.split('-')[0].split('.'))
        return [('>=', vkey(ver)), ('<', bump(ver, 1 if n >= 2 else 0))], None, None, False
    if op == '^':
        return [('>=', vkey(ver)), ('<', bump(ver, 0))], ver, None, False
    return [(op, vkey(ver))], (ver if op in ('>=', '>') else None), None, False


def check(k, conds):
    for op, b in conds:
        if op == '==' and k[0] != b[0]:
            return False
        if op == '>=' and not k >= b:
            return False
        if op == '>' and not k > b:
            return False
        if op == '<=' and not k <= b:
            return False
        if op == '<' and not k < b:
            return False
    return True


def expand(alternatives, releases):
    """alternatives: Liste von (Bedingungen, offene Untergrenze, exakte Version). Liefert exakte Releases (neueste zuerst)
    oder None, wenn das Prädikat nichts eingrenzt (z. B. "*")."""
    found = []
    anything = False
    for conds, lower, exact, wildcard in alternatives:
        if wildcard:
            continue
        anything = True
        has_upper = any(op in ('<', '<=', '==') for op, _ in conds)
        hits = [r for r in releases if check(vkey(r), conds)]
        if not has_upper and lower:
            hits = [r for r in hits if line_of(r) == line_of(lower)]
        if not hits and exact:
            hits = [exact]  # z. B. Snapshot oder Liste nicht verfügbar
        found += [h for h in hits if h not in found]
    if not anything:
        return None
    order = {r: i for i, r in enumerate(releases)}
    return sorted(found, key=lambda r: (order.get(r, -1), r))


def fabric_alts(pred):
    preds = pred if isinstance(pred, list) else [pred]
    alts = []
    for p in preds:
        if not isinstance(p, str):
            continue
        for alt in p.split('||'):
            conds, lower, exact, wild = [], None, None, False
            terms = re.findall(r'(?:>=|<=|>|<|=|\^|~)?\s*[^\s<>=^~]+', alt.strip())
            if not terms:
                continue
            for t in terms:
                c, lo, ex, w = fabric_term(t.strip())
                conds += c
                lower = lower or lo
                exact = ex if len(terms) == 1 else None
                wild = wild or w
            alts.append((conds, lower, exact, wild and not conds))
    return alts


def maven_alts(rng):
    rng = (rng or '').strip()
    if not rng or rng == '*':
        return [([], None, None, True)]
    alts = []
    for m in re.finditer(r'([\[(])\s*([^,\])]*?)\s*(?:(,)\s*([^\])]*?)\s*)?([\])])', rng):
        lo_b, lo, comma, hi, hi_b = m.groups()
        hi = hi or ''
        if lo and not comma:
            alts.append(([('==', vkey(lo))], None, lo, False))  # [1.20.1]
            continue
        conds = []
        if lo:
            conds.append(('>=' if lo_b == '[' else '>', vkey(lo)))
        if hi:
            conds.append(('<=' if hi_b == ']' else '<', vkey(hi)))
        alts.append((conds, lo if not hi else None, None, not conds))
    if not alts and re.match(r'^[\w.\-]+$', rng):
        alts.append(([('==', vkey(rng))], None, rng, False))
    return alts


def filename_guess(name):
    """…-fabric-1.21.2-1.21.3-1.0.0.jar → ('fabric', ['1.21.2', '1.21.3'])"""
    stem = re.sub(r'\.jar$', '', name, flags=re.I)
    m = re.search(r'(?:^|[-_+])(fabric|quilt|neoforge|forge)(?:[-_+]|$)', stem, re.I)
    loader = m.group(1).lower() if m else None
    mcs = []
    m2 = re.search(r'(?:mc|minecraft)[-_]?(\d+\.\d+(?:\.\d+)?)', stem, re.I)
    if m2:
        mcs = [m2.group(1)]
    elif m:
        toks = stem[m.end():].split('-')
        vers = [t for t in toks if re.fullmatch(r'\d+\.\d+(?:\.\d+)?', t)]
        if len(vers) >= 2:
            mcs = vers[:-1][:2]  # letzte Nummer ist die Mod-Version
    return loader, mcs


def mc_text_alts(text):
    """`mc` aus der Inhaltsdatei: '1.21.11' oder '1.21 – 26.3' (Bereich inklusive)."""
    vers = re.findall(r'\d+\.\d+(?:\.\d+)?', text or '')
    if len(vers) == 1:
        return [([('==', vkey(vers[0]))], None, vers[0], False)]
    if len(vers) >= 2:
        return [([('>=', vkey(vers[0])), ('<=', vkey(vers[1]))], None, None, False)]
    return []


# ------------------------------------------------------------------ Jar-Metadaten

def parse_toml(text):
    if tomllib:
        try:
            return tomllib.loads(text)
        except tomllib.TOMLDecodeError:
            pass
    # Notbehelf: nur [[dependencies.x]]-Blöcke und modId/license
    out = {'mods': [], 'dependencies': {}}
    m = re.search(r'^\s*license\s*=\s*"([^"]*)"', text, re.M)
    if m:
        out['license'] = m.group(1)
    for mid in re.findall(r'^\s*modId\s*=\s*"([^"]+)"', text.split('[[dependencies', 1)[0], re.M):
        out['mods'].append({'modId': mid})
    for owner, block in re.findall(r'\[\[dependencies\.([\w-]+)\]\]([^\[]*)', text):
        dep = dict(re.findall(r'^\s*(\w+)\s*=\s*"?([^"\n]*)"?', block, re.M))
        if 'mandatory' in dep:
            dep['mandatory'] = dep['mandatory'].strip() == 'true'
        out['dependencies'].setdefault(owner, []).append(dep)
    return out


def jar_meta(blob):
    """Loader, Minecraft-Prädikate und Abhängigkeiten aus einer Jar (nur gelesen, nie ausgeführt)."""
    z = zipfile.ZipFile(io.BytesIO(blob))
    names = set(z.namelist())
    meta = {'mod_id': None, 'loaders': [], 'mc': [], 'deps': [], 'license': None}

    def read(n):
        return z.read(n).decode('utf-8-sig', 'replace')

    if 'fabric.mod.json' in names:
        j = json.loads(read('fabric.mod.json'), strict=False)
        meta['mod_id'] = j.get('id')
        meta['version'] = j.get('version')
        meta['loaders'].append('fabric')
        lic = j.get('license')
        meta['license'] = lic if isinstance(lic, str) else (lic[0] if isinstance(lic, list) and lic else None)
        for key, kind in (('depends', 'required'), ('recommends', 'optional'), ('suggests', 'optional'), ('breaks', 'incompatible')):
            for dep, pred in (j.get(key) or {}).items():
                if dep == 'minecraft' and key == 'depends':
                    meta['mc'].append({'kind': 'fabric', 'pred': pred})
                else:
                    meta['deps'].append({'id': dep, 'kind': kind, 'loader': 'fabric'})
    if 'quilt.mod.json' in names:
        q = (json.loads(read('quilt.mod.json'), strict=False).get('quilt_loader') or {})
        meta['mod_id'] = meta['mod_id'] or q.get('id')
        meta['loaders'].append('quilt')
        for key, kind in (('depends', 'required'), ('breaks', 'incompatible')):
            for d in q.get(key) or []:
                did = d if isinstance(d, str) else (d.get('id') or '')
                did = did.split(':')[-1]
                pred = '*' if isinstance(d, str) else d.get('versions', '*')
                if did == 'minecraft' and key == 'depends':
                    if not any(m['kind'] == 'fabric' for m in meta['mc']):
                        meta['mc'].append({'kind': 'fabric', 'pred': pred if not isinstance(pred, dict) else pred.get('any', '*')})
                elif not (isinstance(d, dict) and d.get('optional')):
                    meta['deps'].append({'id': did, 'kind': kind, 'loader': 'quilt'})
                else:
                    meta['deps'].append({'id': did, 'kind': 'optional', 'loader': 'quilt'})
    for fname, loader in (('META-INF/neoforge.mods.toml', 'neoforge'), ('META-INF/mods.toml', 'forge')):
        if fname not in names:
            continue
        t = parse_toml(read(fname))
        meta['loaders'].append(loader)
        mods = t.get('mods') or []
        own = mods[0].get('modId') if mods and isinstance(mods[0], dict) else None
        meta['mod_id'] = meta['mod_id'] or own
        if mods and isinstance(mods[0], dict):
            meta['version'] = meta.get('version') or mods[0].get('version')
        meta['license'] = meta['license'] or t.get('license')
        for owner, deps in (t.get('dependencies') or {}).items():
            if own and owner != own:
                continue
            for d in deps if isinstance(deps, list) else []:
                did = d.get('modId')
                if not did:
                    continue
                typ = str(d.get('type', '')).lower()
                if not typ:
                    typ = 'required' if d.get('mandatory', True) is True else 'optional'
                kind = {'required': 'required', 'optional': 'optional', 'incompatible': 'incompatible',
                        'discouraged': None}.get(typ, 'required')
                if did == 'minecraft':
                    meta['mc'].append({'kind': 'maven', 'range': d.get('versionRange', ''), 'loader': loader})
                elif kind:
                    meta['deps'].append({'id': did, 'kind': kind, 'loader': loader})
    return meta


# ------------------------------------------------------------------ Cache

def load_cache():
    try:
        c = json.load(open(CACHE, encoding='utf8'))
        if c.get('schema') == CACHE_SCHEMA:
            return c
    except (OSError, ValueError):
        pass
    return {'schema': CACHE_SCHEMA, 'assets': {}}


def asset_info(cache, a, stats):
    key = str(a['id'])
    stats['seen'].add(key)
    hit = cache['assets'].get(key)
    if hit and hit.get('size') == a['size'] and hit.get('updated_at') == a.get('updated_at'):
        stats['cached'] += 1
        return hit
    log(f'  lade {a["name"]} ({a["size"] / 1e6:.1f} MB)')
    blob = dl.fetch_bytes(a['browser_download_url'])
    stats['downloaded'] += 1
    info = {
        'name': a['name'], 'url': a['browser_download_url'], 'size': a['size'], 'updated_at': a.get('updated_at'),
        'sha1': hashlib.sha1(blob).hexdigest(), 'sha256': hashlib.sha256(blob).hexdigest(),
    }
    if len(blob) != a['size']:
        raise OSError(f'Größe {len(blob)} statt {a["size"]}')
    try:
        info['meta'] = jar_meta(blob)
    except (zipfile.BadZipFile, ValueError, KeyError, UnicodeError) as e:
        log(f'  Metadaten nicht lesbar: {e}')
        info['meta'] = None
    cache['assets'][key] = info
    return info


# ------------------------------------------------------------------ Store bauen

def releases_of(repo):
    out, page = [], 1
    while True:
        batch = dl.gh_json(f'https://api.github.com/repos/{repo}/releases?per_page=100&page={page}')
        if not batch:
            return out
        out += batch
        page += 1


def map_dep(dep_id, kind, self_ids, own_project):
    if dep_id in NOT_DEPS or not dep_id:
        return None
    if dep_id in self_ids:
        pid = self_ids[dep_id]
        return None if pid == own_project else {'source': 'self', 'project_id': pid, 'kind': kind}
    if dep_id in MODRINTH:
        return {'source': 'modrinth', 'project_id': MODRINTH[dep_id], 'kind': kind}
    return 'unknown'


def requires_fallback(content, self_names, loader):
    out = []
    for r in content.get('requires') or []:
        t = tx(r).lower()
        for name, pid in self_names.items():
            if t.startswith(name.lower()):
                out.append({'source': 'self', 'project_id': pid, 'kind': 'required'})
                break
        else:
            for text, dep in REQUIRES_TEXT.items():
                if t.startswith(text) and (loader in ('fabric', 'quilt') or 'fabric' not in dep):
                    out.append({'source': 'modrinth', 'project_id': MODRINTH[dep], 'kind': 'required'})
    return out


def build(cache, problems, old_projects):
    releases_mc = release_list(cache)
    stats = {'cached': 0, 'downloaded': 0, 'seen': set(), 'complete': True}
    kept = {}
    mods = []
    for mod, repo in dl.mod_repos():
        try:
            content = read_content(mod)
        except (ValueError, IndexError) as e:
            problems.append(f'{mod}: Inhaltsdatei nicht lesbar ({e})')
            continue
        try:
            rels = releases_of(repo)
        except (urllib.error.URLError, OSError) as e:
            problems.append(f'{mod}: Releases von {repo} nicht lesbar ({e}), alter Stand bleibt')
            stats['complete'] = False
            if mod in old_projects:
                kept[mod] = old_projects[mod]
            continue
        log(f'{mod}: {repo}, {len(rels)} Releases')
        jars = []
        for rel in rels:
            if rel.get('draft'):
                continue
            for a in rel.get('assets', []):
                if not dl.wanted_asset(a['name']):
                    continue
                try:
                    jars.append((rel, a, asset_info(cache, a, stats)))
                except (urllib.error.URLError, OSError) as e:
                    problems.append(f'{mod}: {a["name"]} nicht ladbar ({e}), fehlt bis zum nächsten Lauf')
                    stats['complete'] = False
        mods.append((mod, repo, content, jars))

    # Mod-IDs der Jars (z. B. "hha", "hha_arius") → Projekt-IDs dieses Stores
    self_ids = {}
    self_names = {}
    for mod, _, content, jars in mods:
        self_ids[mod] = mod
        if tx(content.get('name')):
            self_names[tx(content['name'])] = mod
        for _, _, info in jars:
            mid = (info.get('meta') or {}).get('mod_id')
            if mid:
                self_ids[mid] = mod
    # Längere Namen zuerst, damit „HHA Blood“ nicht als „HHA“ erkannt wird
    self_names = dict(sorted(self_names.items(), key=lambda kv: -len(kv[0])))

    projects = list(kept.values())
    for mod, repo, content, jars in mods:
        if not jars:
            log(f'{mod}: keine Jar-Releases, nicht im Store')
            continue
        title = tx(content.get('name')) or mod
        versions = []
        used_ids = set()
        for rel, a, info in jars:
            meta = info.get('meta') or {}
            how = 'jar'
            loaders = list(meta.get('loaders') or [])
            guess_loader, guess_mcs = filename_guess(a['name'])
            if not loaders:
                how = 'dateiname'
                if guess_loader:
                    loaders = [guess_loader]
                else:
                    loaders = [l for l in ('fabric', 'quilt', 'neoforge', 'forge') if l in str(content.get('loader', '')).lower()]
                    how = 'inhaltsdatei'
            alts = []
            for m in meta.get('mc') or []:
                alts += fabric_alts(m['pred']) if m['kind'] == 'fabric' else maven_alts(m.get('range'))
            game = expand(alts, releases_mc) if alts else None
            if not game and guess_mcs:
                how = 'dateiname'
                if len(guess_mcs) == 2:
                    game = expand([([('>=', vkey(guess_mcs[0])), ('<=', vkey(guess_mcs[1]))], None, None, False)], releases_mc)
                else:
                    game = expand([([('==', vkey(guess_mcs[0]))], None, guess_mcs[0], False)], releases_mc)
            if not game:
                how = 'inhaltsdatei'
                game = expand(mc_text_alts(content.get('mc')), releases_mc) if content.get('mc') else None
            if how != 'jar':
                problems.append(f'{mod}: {a["name"]}: Versionen/Loader aus {how} geschätzt')
            if not game or not loaders:
                problems.append(f'{mod}: {a["name"]}: Minecraft-Version oder Loader unbekannt, ausgelassen')
                continue

            deps = []
            if meta.get('loaders'):
                for d in meta.get('deps') or []:
                    mapped = map_dep(d['id'], d['kind'], self_ids, mod)
                    if mapped == 'unknown':
                        if d['kind'] == 'required':
                            problems.append(f'{mod}: {a["name"]}: unbekannte Pflicht-Abhängigkeit „{d["id"]}“ ausgelassen')
                        continue
                    if mapped and mapped not in deps:
                        deps.append(mapped)
            else:
                deps = requires_fallback(content, {k: v for k, v in self_names.items() if v != mod}, loaders[0])

            tag = rel.get('tag_name') or ''
            number = re.sub(r'^[vV]', '', tag) or (meta.get('version') or '0')
            stem = re.sub(r'\.jar$', '', a['name'], flags=re.I)
            vid = f'{number}-{stem}'
            n = 2
            while vid in used_ids:
                vid = f'{number}-{stem}-{n}'
                n += 1
            used_ids.add(vid)
            mc_label = game[-1] if len(game) == 1 else f'{game[-1]}–{game[0]}'
            loader_label = ' / '.join(LOADER_NAMES.get(l, l) for l in loaders)
            version = {
                'id': vid,
                'version_number': number,
                'name': f'{title} {number} ({loader_label} {mc_label})',
                'release_type': 'beta' if rel.get('prerelease') else 'release',
                'date': rel.get('published_at') or rel.get('created_at'),
                'game_versions': list(reversed(game)),
                'loaders': loaders,
                'changelog': (rel.get('body') or '').strip().replace('\r\n', '\n'),
                'files': [{
                    'url': info['url'], 'filename': a['name'], 'size': info['size'],
                    'sha1': info['sha1'], 'sha256': info['sha256'], 'primary': True,
                }],
                'dependencies': deps,
            }
            if not version['changelog']:
                del version['changelog']
            versions.append((version, game, a))

        if not versions:
            problems.append(f'{mod}: keine verwertbare Jar')
            continue
        order = {r: i for i, r in enumerate(releases_mc)}
        # Neueste Releases zuerst, innerhalb eines Releases neueste Minecraft-Version zuerst
        versions.sort(key=lambda t: (t[0]['date'] or '', -min(order.get(g, 10 ** 6) for g in t[1])), reverse=True)
        dates = [v['date'] for v, _, _ in versions if v['date']]
        lic = next((((info.get('meta') or {}).get('license')) for _, _, info in jars if (info.get('meta') or {}).get('license')), None)
        source = re.sub(r'/$', '', content.get('source') or f'https://github.com/{repo}')
        project = {
            'id': mod,
            'slug': mod,
            'title': title,
            'description': tx(content.get('short')),
            'author': tx(content.get('author')) or AUTHOR,
            'icon': asset_url(mod, content.get('icon') or 'icon.png'),
            'project_type': content.get('project_type') or 'mod',
            'categories': [c for c in content.get('categories') or [] if isinstance(c, str)],
            'body': body_markdown(content),
            'gallery': gallery(mod, content),
            'links': {
                'website': f'{SITE}/mods/{mod}/' if os.path.isdir(os.path.join(HERE, 'mods', mod)) else None,
                'source': source,
                'issues': f'{source}/issues' if source.startswith('https://github.com/') else None,
            },
            'license': lic,
            'published': min(dates) if dates else None,
            'updated': max(dates) if dates else None,
            'versions': [v for v, _, _ in versions],
        }
        project['links'] = {k: v for k, v in project['links'].items() if v}
        projects.append({k: v for k, v in project.items() if v not in (None, '', [])})
    order = [m for m, _ in dl.mod_repos()]
    projects.sort(key=lambda p: order.index(p['id']) if p['id'] in order else len(order))
    log(f'Jars: {stats["cached"]} aus dem Cache, {stats["downloaded"]} geladen')
    return projects, stats


def write_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf8', newline='\n') as f:
        json.dump(data, f, indent=1, ensure_ascii=False)
        f.write('\n')


def main():
    try:
        old = json.load(open(OUT, encoding='utf8'))
    except (OSError, ValueError):
        old = None
    old_projects = {p.get('id'): p for p in (old or {}).get('projects', [])}
    cache = load_cache()
    old_cache = json.loads(json.dumps(cache))
    problems = []
    projects, stats = build(cache, problems, old_projects)
    for p in problems:
        log('Hinweis:', p)

    # Cache: Einträge gelöschter Assets entfernen (nur wenn alle Repos und Jars lesbar waren)
    if stats['complete']:
        cache['assets'] = {k: v for k, v in cache['assets'].items() if k in stats['seen']}
    cache['assets'] = dict(sorted(cache['assets'].items(), key=lambda kv: int(kv[0]) if kv[0].isdigit() else 0))
    if cache != old_cache or not os.path.exists(CACHE):
        write_json(CACHE, cache)
        log('Geschrieben:', os.path.relpath(CACHE, HERE))

    if not projects:
        log('Keine Projekte, store.json bleibt unverändert')
        return 1
    store = {**STORE_META, 'updated': dl.now_iso(), 'projects': projects}
    if old and {k: v for k, v in old.items() if k != 'updated'} == {k: v for k, v in store.items() if k != 'updated'}:
        log('store.json: keine inhaltliche Änderung')
        return 0
    write_json(OUT, store)
    log('Geschrieben:', os.path.relpath(OUT, HERE))
    return 0


if __name__ == '__main__':
    sys.exit(main())
