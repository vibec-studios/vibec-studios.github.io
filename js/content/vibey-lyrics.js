// Vibey Lyrics: zweite eigenständige Mod (Quelle: vibec-studios/vibey-lyrics, README, Stand v1.1.0 / Commit dd1c852, 10 Fabric-Jars).
// Bilder: nur docs/screenshots aus dem automatischen Client-Test, überall mit dem eigenen Demo-Song „Pixel Skies“
// (keine fremden Songtexte). Trailer (Demo-Song, MIT) liegt als WebM + MP4 unter assets/mods/vibey-lyrics/video/.
// Die Mod verlinkt https://vibec-studios.github.io/mods/vibey-lyrics/ als Homepage: id nicht ändern.
// Hero bleibt bewusst eine 3D-Szene (Wunsch des Nutzers), seit 1.1 im Stil des 3D-Flugs (views.js lyricsStage).
const S = (de, en) => ({ de, en });

export default {
  id: 'vibey-lyrics',
  name: 'Vibey Lyrics',
  short: S('Synchrone Songtexte im TikTok-Stil: als 3D-Wörter durch den Himmel fliegend, schwebend vor dir, fest in der Welt oder im HUD.',
    'Synced lyrics, TikTok-style: 3D words flying through the sky, floating in front of you, pinned in the world or on the HUD.'),
  tagline: S('Deine Musik. Dein Himmel. Deine Zeilen.', 'Your music. Your sky. Your lines.'),
  accent: '#d946ef', accent2: '#8b5cf6',
  version: '1.1.0', mc: '1.21 – 26.3', loader: 'Fabric',
  requires: ['Fabric API', S('Nur im Client', 'Client only')],
  status: S('Veröffentlicht', 'Released'),
  source: 'https://github.com/vibec-studios/vibey-lyrics',
  icon: 'icon.png',
  categories: ['social', 'utility'], // Modrinth-Kategorien für den Vibe Store (tools/store.py)
  band: false,
  spot: { img: 'img/flight-sunset.webp', h: 720, alt: S('Vibey Lyrics: Songzeile fliegt über den Abendhimmel', 'Vibey Lyrics: a lyric line flying across the sunset sky') }, // Screenshot im Band auf der Startseite
  hero: { kind: 'lyrics' }, // 3D-Flug: Wörter mit Tiefe bauen sich als Band im Himmel auf und fliegen dann auf dich zu
  intro: S('Drück K, wähl einen Song und sing mit. Jedes Wort ist ein eigenes 3D-Objekt: Die Zeile baut sich im Himmel auf, und wenn die nächste beginnt, fliegt die alte an dir vorbei.',
    'Press K, pick a song and sing along. Every word is its own 3D object: the line builds up in the sky, and when the next one starts, the old one flies past you.'),
  highlights: [
    S('3D-Flug: Wörter mit Tiefe, die an dir vorbeifliegen', '3D flight: words with depth that fly past you'),
    S('Eigene Himmel von Abendrot bis Saturn, nur für dich', 'Custom skies from sunset to Saturn, just for you'),
    S('Folgt der Musik auf deinem PC, Lyrics kommen automatisch', 'Follows the music on your PC, lyrics load by themselves'),
  ],
  sections: [
    {
      type: 'video', id: 'trailer', toc: S('Trailer', 'Trailer'), title: S('Sieh es dir an', 'See it in action'),
      lead: S('Im Spiel aufgenommen vom automatischen Client-Test, mit dem eigenen Demo-Song „Pixel Skies“.',
        'Recorded in game by the automated client test, with our own demo song “Pixel Skies”.'),
      webm: 'video/trailer.webm', mp4: 'video/trailer.mp4', poster: 'video/trailer-poster.webp',
      label: S('Trailer von Vibey Lyrics', 'Vibey Lyrics trailer'),
    },
    {
      type: 'abilities', id: 'neu', toc: S('3D-Flug', '3D flight'), title: S('Songtexte, die fliegen', 'Lyrics that fly'),
      lead: S('Zeilen bauen sich Wort für Wort als schräges Band im Himmel auf und fliegen dann auf dich zu. Dazu ein Himmel, der zum Song passt.',
        'Lines build up word by word as a tilted ribbon in the sky, then fly towards you. Plus a sky that fits the song.'),
      items: [
        { name: S('3D-Flug', '3D flight'), desc: S('Jedes Wort ist ein eigenes 3D-Objekt, lang gehaltene Wörter wachsen, und die alte Zeile fliegt an dir vorbei.', 'Every word is its own 3D object, held notes grow, and the old line flies past you.') },
        { name: S('3D-Schweben', '3D drift'), desc: S('Die ruhige Variante: Die Wörter schweben sanft im Raum statt zu fliegen.', 'The calm version: the words drift gently in space instead of flying.') },
        { name: S('Eigene Himmel', 'Custom skies'), desc: S('Von Abendrot und Zuckerwatte bis Polarlicht, Saturn und Blutmond. Nachthimmel drehen sich langsam und haben Sternschnuppen.', 'From sunset and cotton candy to aurora, Saturn and blood moon. Night skies turn slowly and have shooting stars.') },
        { name: S('Buchstaben mit Tiefe', 'Letters with depth'), desc: S('Echte 3D-Buchstaben, deren Farben sich auf Wunsch nach dem Himmel richten.', 'Real 3D letters whose colors can follow the sky.') },
        { name: S('Läuft gerade', 'Now playing'), desc: S('Eine schmale Leiste oben im Bild mit der aktuellen Zeile, kleinem Equalizer und Fortschritt.', 'A slim bar at the top of the screen with the current line, a small equalizer and progress.') },
        { name: S('Mehr Looks und Fonts', 'More looks and fonts'), desc: S('Neue Looks wie Lavendel, Feuer, Eis, Comic und Royal, dazu neue Schriften von Poppins bis Unbounded.', 'New looks like Lavender, Fire, Ice, Comic and Royal, plus new fonts from Poppins to Unbounded.') },
      ],
    },
    {
      type: 'gallery', id: 'himmel', toc: S('Himmel', 'Skies'), title: S('Ein Himmel für jeden Song', 'A sky for every song'),
      lead: S('Echte Screenshots aus dem automatischen Client-Test mit dem Demo-Song. Klicken zum Vergrößern. Den Himmel siehst nur du.',
        'Real screenshots from the automated client test with the demo song. Click to enlarge. Only you see the sky.'),
      items: [
        { img: 'img/flight-sunset.webp', name: S('3D-Flug im Abendrot', '3D flight at sunset'), desc: S('Die Zeile baut sich Wort für Wort als Band im Himmel auf.', 'The line builds up word by word as a ribbon in the sky.') },
        { img: 'img/flight-flyby.webp', name: S('Vorbeiflug', 'Fly-by'), desc: S('Die alte Zeile fliegt auf dich zu, während die neue beginnt.', 'The old line flies towards you while the new one begins.') },
        { img: 'img/saturn.webp', name: S('Saturn', 'Saturn'), desc: S('Ein Ringplanet über der Landschaft.', 'A ringed planet above the land.') },
        { img: 'img/galaxy.webp', name: S('Galaxie', 'Galaxy'), desc: S('Die Milchstraße dreht sich langsam über dir.', 'The Milky Way turns slowly above you.') },
        { img: 'img/aurora.webp', name: S('Polarlicht', 'Aurora'), desc: S('Grüne Lichtvorhänge über dem Meer.', 'Green curtains of light above the sea.') },
        { img: 'img/synthwave.webp', name: S('Synthwave', 'Synthwave'), desc: S('Pinker Himmel mit Retro-Sonne.', 'Pink sky with a retro sun.') },
        { img: 'img/drift-nebula.webp', name: S('Sternennebel', 'Nebula'), desc: S('Ruhiges Schweben in violetten Wolken.', 'Calm drift in violet clouds.') },
        { img: 'img/bar.webp', name: S('Läuft gerade', 'Now playing'), desc: S('Die Leiste oben zeigt Zeile, Equalizer und Fortschritt.', 'The bar at the top shows the line, equalizer and progress.') },
        { img: 'img/menu-skies.webp', name: S('Himmel wählen', 'Pick a sky'), desc: S('Look und Himmel mit einem Klick im Menü.', 'Look and sky in one click in the menu.') },
      ],
    },
    {
      type: 'flow', id: 'so-gehts', toc: S('So geht’s', 'How it works'), title: S('Drei Schritte zum Mitsingen', 'Three steps to sing along'),
      items: [
        { title: S('Menü öffnen', 'Open the menu'), desc: S('Taste <code>K</code> drücken oder „♪ Lyrics“ im Pausenmenü wählen.', 'Press <code>K</code> or pick “♪ Lyrics” in the pause menu.') },
        { title: S('Song wählen', 'Pick a song'), desc: S('Musik vom PC einschalten oder einen eigenen Song aus deinem Ordner starten.', 'Turn on music from your PC or start one of your own songs from your folder.') },
        { title: S('Platz, Look und Himmel', 'Place, look and sky'), desc: S('3D-Flug, Himmel, vor dir, in der Welt oder im HUD, dazu Look und Himmel mit einem Klick.', '3D flight, sky, in front of you, in the world or on the HUD, plus a look and a sky in one click.') },
      ],
    },
    {
      type: 'abilities', id: 'features', toc: S('Features', 'Features'), title: S('Alles für die perfekte Zeile', 'Everything for the perfect line'),
      items: [
        { name: S('Musik vom PC', 'Music from your PC'), desc: S('Folgt Spotify, YouTube im Browser oder deinem Player und lädt die passenden Lyrics von LRCLIB, immer im Takt.', 'Follows Spotify, YouTube in a browser or your player and loads the matching lyrics from LRCLIB, always in time.') },
        { name: S('Eigene Songs', 'Your own songs'), desc: S('Lieder mit LRC-Datei in den Ordner legen, und fehlt der Text, sucht die Mod ihn für dich.', 'Drop songs with an LRC file into the folder, and if the lyrics are missing, the mod finds them for you.') },
        { name: S('Karaoke-Look', 'Karaoke look'), desc: S('Wörter leuchten auf, sobald sie gesungen werden, mit Glühen, Funkeln und einer Vorschau der nächsten Zeile.', 'Words light up the moment they are sung, with glow, sparkles and a preview of the next line.') },
        { name: S('Animationen', 'Animations'), desc: S('Pop, Blende, Gleiten, Zoom, Welle, Hüpfen, Schreibmaschine, Glitch und Regenbogen.', 'Pop, fade, slide, zoom, wave, bounce, typewriter, glitch and rainbow.') },
        { name: S('Schriften und Looks', 'Fonts and looks'), desc: S('Von Minecraft über Poppins bis Pacifico, dazu fertige Looks wie Neon, Sunset oder Eis mit einem Klick.', 'From Minecraft and Poppins to Pacifico, plus ready-made looks like Neon, Sunset or Ice in one click.') },
        { name: S('Fair zu deinen Daten', 'Fair with your data'), desc: S('Es werden nur Künstler, Titel, Album und Länge an LRCLIB geschickt, nichts über dich oder dein Spiel.', 'Only artist, title, album and length go to LRCLIB, nothing about you or your game.') },
      ],
    },
    {
      type: 'gallery', id: 'positionen', toc: S('Positionen', 'Positions'), title: S('Wo deine Zeilen stehen', 'Where your lines go'),
      lead: S('Neben dem 3D-Flug gibt es weiter die klassischen Plätze. Klicken zum Vergrößern.', 'Next to the 3D flight the classic places are still there. Click to enlarge.'),
      items: [
        { img: 'img/sky-ocean.webp', name: S('Himmel', 'Sky'), desc: S('Riesig hoch oben, und Berge verdecken die Zeilen wie einen echten Himmel.', 'Huge and high up, and mountains hide the lines like a real sky.') },
        { img: 'img/front.webp', name: S('Vor dir', 'In front'), desc: S('Schwebt vor dir und folgt deinem Blick.', 'Floats in front of you and follows your view.') },
        { img: 'img/world.webp', name: S('In der Welt', 'In world'), desc: S('Fest an einem Ort, dreht sich zu dir oder steht wie ein Schild.', 'Pinned to a spot, turns towards you or stays put like a sign.') },
        { img: 'img/hud.webp', name: S('HUD', 'HUD'), desc: S('Als Untertitel direkt auf dem Bildschirm.', 'As a caption right on your screen.') },
      ],
    },
  ],
};
