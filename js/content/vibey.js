// Vibey Multiplayer: erste eigenständige Mod außerhalb der HHA-Reihe (Quelle: vibec-studios/vibey-multiplayer, README,
// Screenshots aus dem automatischen Client-Test). Bewusst kurz gehalten: drei Schritte, vier Features, drei Bilder.
// Seit 17.11.2026 veröffentlicht (v1.0.0, 20 Jars); Downloads kommen über data/downloads.json und den Auswahl-Dialog.
const S = (de, en) => ({ de, en });

export default {
  id: 'vibey',
  name: 'Vibey Multiplayer',
  short: S('Hoste deine Singleplayer-Welt für Freunde, von überall. Eine feste Adresse, keine Portfreigabe, kein Server.',
    'Host your singleplayer world for friends, from anywhere. One fixed address, no port forwarding, no server.'),
  tagline: S('Deine Welt. Deine Adresse. Deine Freunde.', 'Your world. Your address. Your friends.'),
  accent: '#3b82f6', accent2: '#8b5cf6',
  version: '1.0.0', mc: '1.21 – 26.3', loader: 'Fabric / NeoForge',
  requires: [S('Fabric API (nur Fabric)', 'Fabric API (Fabric only)'), S('Nur im Client, Gäste brauchen nichts', 'Client only, guests need nothing')],
  status: S('Veröffentlicht', 'Released'),
  outroTitle: S('Bereit zum Hosten?', 'Ready to host?'),
  source: 'https://github.com/vibec-studios/vibey-multiplayer',
  icon: 'icon.png',
  statusPage: '/status/',
  band: false,
  hero: { kind: 'link' }, // zwei Spieler, verbunden mit einem blauen Pixelkabel (views.js linkStage)
  intro: S('Welt im Pausenmenü öffnen, Adresse kopieren, Freunde einladen. Sie spielen mit ganz normalem Minecraft mit.',
    'Open your world from the pause menu, copy your address, invite your friends. They join with plain Minecraft.'),
  highlights: [
    S('Eine feste Adresse, die bei jedem Hosting gleich bleibt', 'One fixed address that stays the same every time you host'),
    S('Keine Portfreigabe, kein eigener Server', 'No port forwarding, no server of your own'),
    S('Fabric und NeoForge, von 1.21 bis 26.3', 'Fabric and NeoForge, from 1.21 to 26.3'),
  ],
  sections: [
    {
      type: 'flow', id: 'so-gehts', toc: S('So geht’s', 'How it works'), title: S('Drei Klicks bis zum Multiplayer', 'Three clicks to multiplayer'),
      items: [
        { title: S('Welt hosten', 'Host World'), desc: S('Im Pausenmenü steht „Welt hosten“, wo sonst „Im LAN öffnen“ steht.', 'The pause menu shows “Host World” where “Open to LAN” used to be.') },
        { title: S('Adresse kopieren', 'Copy your address'), desc: S('Deine eigene Adresse wie <code>giant-fox-65.vibey.henny.dev</code>. Sie bleibt bei jedem Hosting gleich.', 'Your own address like <code>giant-fox-65.vibey.henny.dev</code>. It stays the same every time you host.') },
        { title: S('Freunde verbinden sich', 'Friends join'), desc: S('Mehrspieler, Direkt verbinden, Adresse einfügen. Ohne Mod, ohne Portfreigabe.', 'Multiplayer, Direct Connection, paste the address. No mod, no port forwarding.') },
      ],
    },
    {
      type: 'abilities', id: 'features', toc: S('Features', 'Features'), title: S('Du hast alles im Griff', 'You stay in control'),
      lead: S('Das Hauptfenster bleibt minimal, alles Weitere liegt im Menü „Verwalten“. Verbindungen sind Ende-zu-Ende verschlüsselt.',
        'The main window stays minimal, everything else lives in the “Manage” menu. Connections are end-to-end encrypted.'),
      items: [
        { name: S('Feste Adresse', 'Fixed address'), desc: S('Bleibt gleich, bis du sie erneuerst; dann ist die alte sofort tot.', 'Stays the same until you renew it; then the old one dies right away.') },
        { name: S('Spieler verwalten', 'Manage players'), desc: S('OP geben, rauswerfen, bannen und Abgewiesene mit einem Klick reinlassen.', 'Give OP, kick, ban and let turned-away players in with one click.') },
        { name: S('Sperren im Netz', 'Blocked at the network'), desc: S('Whitelist und Bannliste nach Name oder IP: Der Relay blockt Gesperrte, bevor sie deinen Rechner erreichen.', 'Whitelist and ban list by name or IP: the relay stops blocked players before they reach your computer.') },
        { name: S('Mods erzwingen', 'Force mods'), desc: S('Wem eine Mod fehlt, bekommt eine klare Liste statt einer kryptischen Fehlermeldung.', 'Anyone missing a mod gets a clear list instead of a cryptic error.') },
      ],
    },
    {
      type: 'gallery', id: 'screenshots', toc: S('Screenshots', 'Screenshots'), title: S('So sieht es im Spiel aus', 'How it looks in game'),
      lead: S('Echte Screenshots aus dem automatischen Client-Test. Klicken zum Vergrößern.', 'Real screenshots from the automated client test. Click to enlarge.'),
      items: [
        { img: 'img/admin-access.webp', name: S('Zugang', 'Access'), desc: S('Whitelist und Bannliste nach Name oder IP.', 'Whitelist and ban list by name or IP.') },
        { img: 'img/host-online.webp', name: S('Welt gehostet', 'World hosted'), desc: S('Adresse, Status, Verwalten und Hosting beenden.', 'Address, status, manage and stop hosting.') },
        { img: 'img/admin-players.webp', name: S('Spieler', 'Players'), desc: S('Wer online ist und wer zuletzt abgewiesen wurde.', 'Who is online and who was turned away recently.') },
      ],
    },
  ],
};
