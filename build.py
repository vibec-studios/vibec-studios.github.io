"""Legt für jede Route eine Kopie der Startseite an (GitHub Pages kennt keine SPA-Fallbacks).

Aufruf: python build.py   (nach Änderungen an index.html oder neuen Mods)
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
shell = open(os.path.join(HERE, 'index.html'), encoding='utf8').read()
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
with open(os.path.join(HERE, '404.html'), 'w', encoding='utf8', newline='\n') as f:
    f.write(shell)
print('Routen:', ', '.join(built), '+ 404.html')
