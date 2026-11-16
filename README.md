# Vibe Craft Studios · Website

Statische Seite des Studios unter https://vibec-studios.github.io/ (GitHub Pages, keine Build-Stufe außer `build.py`).

- `index.html`: gemeinsame Hülle aller Seiten; `python build.py` kopiert sie nach `mods/<id>/index.html` und `404.html`.
- `js/app.js`: Router mit Block-Übergängen, `js/pages/`: Startseite und Mod-Seite, `js/content/<id>.js`: Inhalte je Mod (Deutsch/Englisch).
- `js/mc3d.js`, `js/views.js`: 3D-Modelle wie im Spiel (three.js). Die Boss-Modelle kommen aus den Exportskripten der Mods,
  bei H&H Armors aus `tools/hha_assets/export_web.py`.
- Neue Mod: Inhaltsdatei anlegen, Assets unter `assets/mods/<id>/`, ID in `js/content/index.js` eintragen, `python build.py`.

Kein offizielles Minecraft-Produkt. Nicht von Mojang oder Microsoft genehmigt oder mit ihnen verbunden.
