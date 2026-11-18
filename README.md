# Vibe Craft Studios · Website

Statische Seite des Studios unter https://vibec-studios.github.io/ (GitHub Pages, keine Build-Stufe außer `build.py`).

- `index.html`: gemeinsame Hülle aller Seiten; `python build.py` kopiert sie nach `mods/<id>/index.html` und `404.html`.
- `js/app.js`: Router mit Block-Übergängen, `js/pages/`: Startseite und Mod-Seite, `js/content/<id>.js`: Inhalte je Mod (Deutsch/Englisch).
- `js/mc3d.js`, `js/views.js`: 3D-Modelle wie im Spiel (three.js). Die Boss-Modelle kommen aus den Exportskripten der Mods,
  bei H&H Armors aus `tools/hha_assets/export_web.py`.
- Neue Mod: Inhaltsdatei anlegen, Assets unter `assets/mods/<id>/`, ID in `js/content/index.js` eintragen, `python build.py`.

## Lizenz / License

**Code** (HTML-Gerüst, CSS, JavaScript, `build.py`, `tools/`, Workflows): [Apache License 2.0](LICENSE).
Forken, ändern und weitergeben ist erlaubt.

**Nicht** von der Code-Lizenz erfasst (gilt für alle Repos von Vibe Craft Studios,
[LICENSING.md](https://github.com/vibec-studios/.github/blob/main/LICENSING.md)):

- **Namen und Logos** („Vibe“, „Vibey“, „H&H Armors“, „Vibe Craft Studios“, die Robbe): ein Fork der Seite braucht
  einen eigenen Namen und eigene Logos – [TRADEMARKS.md](https://github.com/vibec-studios/.github/blob/main/TRADEMARKS.md).
- **Inhalte der Website**: Texte, Bilder, Renders, Videos, 3D-Modelle und Cosmetics: alle Rechte vorbehalten –
  [ASSETS-POLICY.md](https://github.com/vibec-studios/.github/blob/main/ASSETS-POLICY.md); Pfade in [NOTICE](NOTICE). Bilder und Modelle der
  Mods von bzw. mit Crix05z (Arius, Blood, Void) gehören ihren Autoren.
- **Vibe-Dienste** (Backend und Katalog-API `vibe.henny.dev`, Relay `vibey.henny.dev`): nur für offizielle Builds
  und diese Seite – [SERVICES.md](https://github.com/vibec-studios/.github/blob/main/SERVICES.md).

*English:* the code is Apache-2.0. The website's texts, images, renders, videos, 3D models and cosmetics, our names
and logos, and the Vibe online services are not included. See the linked policies.

Kein offizielles Minecraft-Produkt. Nicht von Mojang oder Microsoft genehmigt oder mit ihnen verbunden.
