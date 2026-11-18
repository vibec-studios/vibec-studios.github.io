"""Vibey-Client-Cosmetics für die Website übernehmen.

Die öffentliche Katalog-API (https://vibe.henny.dev/api/v1/cosmetics/catalog) sendet keine CORS-Header für
vibec-studios.github.io, die Seite kann sie also nicht live laden. Dieses Skript holt Katalog, `.vibey`-Dateien und
Vorschaubilder und legt sie neben die Seite:

    data/cosmetics.json                       gekürzter Katalog (Namen, Slot, Seltenheit, Tags, Pfade)
    assets/client/items/<name>.vibey          die Bundles unverändert (Prüfsumme wird kontrolliert)
    assets/client/thumbs/<name>.png           Vorschaubilder aus der API

Aufruf: python tools/cosmetics.py   (ohne Login; nur öffentliche Endpunkte)
"""
import hashlib
import json
import os
import sys
import urllib.request

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API = 'https://vibe.henny.dev'
OUT_ITEMS = os.path.join(HERE, 'assets', 'client', 'items')
OUT_THUMBS = os.path.join(HERE, 'assets', 'client', 'thumbs')
UA = {'User-Agent': 'vibec-studios-website/1.0 (+https://vibec-studios.github.io/)'}


def get(url):
    req = urllib.request.Request(url if url.startswith('http') else API + url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def main():
    catalog = json.loads(get('/api/v1/cosmetics/catalog'))
    os.makedirs(OUT_ITEMS, exist_ok=True)
    os.makedirs(OUT_THUMBS, exist_ok=True)
    items = []
    for it in sorted(catalog['items'], key=lambda x: (x.get('kind') != 'cosmetic', x.get('sort', 0))):
        name = it['id'].split(':', 1)[1].replace('/', '_')
        data = get(it['asset']['url'])
        digest = hashlib.sha256(data).hexdigest()
        if digest != it['asset']['hash']:
            sys.exit(f'Prüfsumme passt nicht: {it["id"]}')
        with open(os.path.join(OUT_ITEMS, f'{name}.vibey'), 'wb') as f:
            f.write(data)
        thumb = None
        if it.get('thumbnailUrl'):
            with open(os.path.join(OUT_THUMBS, f'{name}.png'), 'wb') as f:
                f.write(get(it['thumbnailUrl']))
            thumb = f'/assets/client/thumbs/{name}.png'
        items.append({
            'id': it['id'], 'kind': it['kind'], 'slot': it.get('slot'),
            'name': it['name'], 'description': it.get('description'),
            'rarity': it.get('rarity', 'common'), 'tags': it.get('tags', []), 'author': it.get('author'),
            'file': f'/assets/client/items/{name}.vibey', 'thumb': thumb, 'hash': digest, 'size': len(data),
        })
        print(f'{it["id"]:32s} {len(data) // 1024:4d} KB')
    with open(os.path.join(HERE, 'data', 'cosmetics.json'), 'w', encoding='utf8', newline='\n') as f:
        json.dump({'source': f'{API}/api/v1/cosmetics/catalog', 'version': catalog.get('version'), 'items': items},
                  f, ensure_ascii=False, indent=1)
    print(len(items), 'Einträge')


if __name__ == '__main__':
    main()
