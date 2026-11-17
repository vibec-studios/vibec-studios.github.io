"""Baut die Seiten-Hülle für alle Routen und versioniert Skripte und CSS.

Aufruf: python build.py   (nach jeder Änderung an HTML, CSS, JS oder neuen Mods, vor dem Push)

- Jede JS-Datei bekommt über die Import-Map eine Prüfsumme (?v=…), CSS und app.js direkt im HTML. So lädt der
  Browser nach einem Update sofort die neuen Dateien statt bis zu 10 Minuten alte aus dem Cache.
- index.html wird nach mods/<id>/index.html, downloads/index.html und 404.html kopiert (GitHub Pages kennt keine SPA-Fallbacks).
"""
import glob
import hashlib
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
THREE = 'https://cdn.jsdelivr.net/npm/three@0.160.0'


def digest(path):
    with open(path, 'rb') as f:
        return hashlib.sha1(f.read()).hexdigest()[:10]


def url(path):
    return '/' + os.path.relpath(path, HERE).replace(os.sep, '/')


index_path = os.path.join(HERE, 'index.html')
shell = open(index_path, encoding='utf8').read()

imports = {'three': f'{THREE}/build/three.module.js', 'three/addons/': f'{THREE}/examples/jsm/'}
for js in sorted(glob.glob(os.path.join(HERE, 'js', '**', '*.js'), recursive=True)):
    imports[url(js)] = f'{url(js)}?v={digest(js)}'
importmap = '<script type="importmap">\n' + json.dumps({'imports': imports}, indent=1) + '\n</script>'
shell = re.sub(r'<script type="importmap">.*?</script>', lambda _: importmap, shell, flags=re.S)
shell = re.sub(r'href="/css/style\.css(\?v=[0-9a-f]+)?"', f'href="/css/style.css?v={digest(os.path.join(HERE, "css", "style.css"))}"', shell)
shell = re.sub(r'src="/js/app\.js(\?v=[0-9a-f]+)?"', f'src="/js/app.js?v={digest(os.path.join(HERE, "js", "app.js"))}"', shell)
with open(index_path, 'w', encoding='utf8', newline='\n') as f:
    f.write(shell)

registry = open(os.path.join(HERE, 'js', 'content', 'index.js'), encoding='utf8').read()
ids = re.findall(r"'([a-z0-9_-]+)'", re.search(r'const IDS = \[(.*?)\]', registry).group(1))
built = []
for mod in ids:
    if not os.path.exists(os.path.join(HERE, 'js', 'content', f'{mod}.js')):
        continue
    out = os.path.join(HERE, 'mods', mod)
    os.makedirs(out, exist_ok=True)
    with open(os.path.join(out, 'index.html'), 'w', encoding='utf8', newline='\n') as f:
        f.write(shell)
    built.append(mod)
for page in ('downloads', 'status', 'launcher'):  # feste Seiten neben den Mods
    os.makedirs(os.path.join(HERE, page), exist_ok=True)
    with open(os.path.join(HERE, page, 'index.html'), 'w', encoding='utf8', newline='\n') as f:
        f.write(shell)
    built.append(page)
with open(os.path.join(HERE, '404.html'), 'w', encoding='utf8', newline='\n') as f:
    f.write(shell)
print('Routen:', ', '.join(built), '+ 404.html ·', len(imports) - 2, 'Module versioniert')
