// Vibey Lyrics: zweite eigenständige Mod (Quelle: vibec-studios/vibey-lyrics, README, v1.0.0 seit 17.11.2026, 10 Fabric-Jars).
// Bilder: nur docs/screenshots aus dem automatischen Client-Test, überall mit dem eigenen Demo-Song „Pixel Skies“
// (keine fremden Songtexte). Trailer liegt als WebM + MP4 unter assets/mods/vibey-lyrics/video/.
// Die Mod verlinkt https://vibec-studios.github.io/mods/vibey-lyrics/ als Homepage: id nicht ändern.
const S = (de, en) => ({ de, en });

export default {
  id: 'vibey-lyrics',
  name: 'Vibey Lyrics',
  short: S('Synchrone Songtexte im TikTok-Stil: riesig am Himmel, schwebend vor dir, fest in der Welt oder im HUD.',
    'Synced lyrics, TikTok-style: huge in the sky, floating in front of you, pinned in the world or on the HUD.'),
  tagline: S('Deine Musik. Dein Himmel. Deine Zeilen.', 'Your music. Your sky. Your lines.'),
  accent: '#d946ef', accent2: '#8b5cf6',
  version: '1.0.0', mc: '1.21 – 26.3', loader: 'Fabric',
  requires: ['Fabric API', S('Nur im Client', 'Client only')],
  status: S('Veröffentlicht', 'Released'),
  outroTitle: S('Bereit zum Mitsingen?', 'Ready to sing along?'),
  source: 'https://github.com/vibec-studios/vibey-lyrics',
  icon: 'icon.png',
  band: false,
  hero: { kind: 'lyrics' }, // Spieler von hinten, Songtext des Demo-Songs am Himmel (views.js lyricsStage)
  intro: S('Drück K, wähl einen Song und sing mit. Die Zeilen erscheinen Wort für Wort im Takt, mit Glühen, Funkeln und Animationen.',
    'Press K, pick a song and sing along. The lines show up word by word in time, with glow, sparkles and animations.'),
  highlights: [
    S('Folgt der Musik auf deinem PC, Lyrics kommen automatisch', 'Follows the music on your PC, lyrics load by themselves'),
    S('Himmel, vor dir, in der Welt oder im HUD', 'Sky, in front of you, in the world or on the HUD'),
    S('Karaoke-Look mit Animationen, Schriften und Looks per Klick', 'Karaoke look with animations, fonts and one-click looks'),
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
      type: 'flow', id: 'so-gehts', toc: S('So geht’s', 'How it works'), title: S('Drei Schritte zum Mitsingen', 'Three steps to sing along'),
      items: [
        { title: S('Menü öffnen', 'Open the menu'), desc: S('Taste <code>K</code> drücken oder „♪ Lyrics“ im Pausenmenü wählen.', 'Press <code>K</code> or pick “♪ Lyrics” in the pause menu.') },
        { title: S('Song wählen', 'Pick a song'), desc: S('Musik vom PC einschalten oder einen eigenen Song aus deinem Ordner starten.', 'Turn on music from your PC or start one of your own songs from your folder.') },
        { title: S('Platz und Look wählen', 'Pick a place and a look'), desc: S('Himmel, vor dir, in der Welt oder im HUD, dazu ein Look mit einem Klick.', 'Sky, in front of you, in the world or on the HUD, plus a look in one click.') },
      ],
    },
    {
      type: 'abilities', id: 'features', toc: S('Features', 'Features'), title: S('Alles für die perfekte Zeile', 'Everything for the perfect line'),
      items: [
        { name: S('Musik vom PC', 'Music from your PC'), desc: S('Folgt Spotify, YouTube im Browser oder deinem Player und lädt die passenden Lyrics von LRCLIB, immer im Takt.', 'Follows Spotify, YouTube in a browser or your player and loads the matching lyrics from LRCLIB, always in time.') },
        { name: S('Eigene Songs', 'Your own songs'), desc: S('Lieder mit LRC-Datei in den Ordner legen, und fehlt der Text, sucht die Mod ihn für dich.', 'Drop songs with an LRC file into the folder, and if the lyrics are missing, the mod finds them for you.') },
        { name: S('Karaoke-Look', 'Karaoke look'), desc: S('Wörter leuchten auf, sobald sie gesungen werden, mit Glühen, Funkeln und einer Vorschau der nächsten Zeile.', 'Words light up the moment they are sung, with glow, sparkles and a preview of the next line.') },
        { name: S('Animationen', 'Animations'), desc: S('Pop, Blende, Gleiten, Zoom, Welle, Hüpfen, Schreibmaschine, Glitch und Regenbogen.', 'Pop, fade, slide, zoom, wave, bounce, typewriter, glitch and rainbow.') },
        { name: S('Schriften und Looks', 'Fonts and looks'), desc: S('Von Minecraft bis Pacifico, dazu fertige Looks wie Neon, Sunset oder Arcade mit einem Klick.', 'From Minecraft to Pacifico, plus ready-made looks like Neon, Sunset or Arcade in one click.') },
        { name: S('Fair zu deinen Daten', 'Fair with your data'), desc: S('Es werden nur Künstler, Titel, Album und Länge an LRCLIB geschickt, nichts über dich oder dein Spiel.', 'Only artist, title, album and length go to LRCLIB, nothing about you or your game.') },
      ],
    },
    {
      type: 'gallery', id: 'positionen', toc: S('Positionen', 'Positions'), title: S('Vier Plätze für deine Zeilen', 'Four places for your lines'),
      lead: S('Echte Screenshots aus dem automatischen Client-Test mit dem Demo-Song. Klicken zum Vergrößern.', 'Real screenshots from the automated client test with the demo song. Click to enlarge.'),
      items: [
        { img: 'img/sky-ocean.webp', name: S('Himmel', 'Sky'), desc: S('Riesig hoch oben, und Berge verdecken die Zeilen wie einen echten Himmel.', 'Huge and high up, and mountains hide the lines like a real sky.') },
        { img: 'img/front.webp', name: S('Vor dir', 'In front'), desc: S('Schwebt vor dir und folgt deinem Blick.', 'Floats in front of you and follows your view.') },
        { img: 'img/world.webp', name: S('In der Welt', 'In world'), desc: S('Fest an einem Ort, dreht sich zu dir oder steht wie ein Schild.', 'Pinned to a spot, turns towards you or stays put like a sign.') },
        { img: 'img/hud.webp', name: S('HUD', 'HUD'), desc: S('Als Untertitel direkt auf dem Bildschirm.', 'As a caption right on your screen.') },
      ],
    },
    {
      type: 'gallery', id: 'looks', toc: S('Looks', 'Looks'), title: S('Ein Klick, ein neuer Look', 'One click, a new look'),
      items: [
        { img: 'img/sky-sunset.webp', name: S('Sunset', 'Sunset'), desc: S('Pacifico mit Zoom.', 'Pacifico with zoom.') },
        { img: 'img/sky-retro.webp', name: S('Retro', 'Retro'), desc: S('Monoton im Regenbogen.', 'Monoton in rainbow.') },
        { img: 'img/sky-arcade.webp', name: S('Arcade', 'Arcade'), desc: S('Pixelschrift mit Glitch.', 'Pixel font with glitch.') },
        { img: 'img/menu.webp', name: S('Das Menü', 'The menu'), desc: S('Song, Position und Look an einem Ort.', 'Song, position and look in one place.') },
      ],
    },
  ],
};
