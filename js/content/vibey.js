// Vibey Multiplayer: erste eigenständige Mod außerhalb der HHA-Reihe (Quelle: Henny263462/vibey-multiplayer, README,
// Screenshots aus dem automatischen Client-Test). Noch kein Release: Der Relay-Server wird erst noch deployt.
const S = (de, en) => ({ de, en });

export default {
  id: 'vibey',
  name: 'Vibey Multiplayer',
  short: S('Hoste deine Singleplayer-Welt für Freunde, von überall. Eine feste Adresse, keine Portfreigabe, kein Server.',
    'Host your singleplayer world for friends, from anywhere. One fixed address, no port forwarding, no server.'),
  tagline: S('Deine Welt. Deine Adresse. Deine Freunde.', 'Your world. Your address. Your friends.'),
  accent: '#3b82f6', accent2: '#8b5cf6',
  version: '1.0.0', mc: '1.21 – 1.21.11 · 26.1 – 26.3', loader: 'Fabric / NeoForge',
  requires: [S('Fabric API (nur Fabric)', 'Fabric API (Fabric only)'), S('Nur im Client, Gäste brauchen nichts', 'Client only, guests need nothing')],
  status: S('Bald verfügbar', 'Coming soon'),
  outroTitle: S('Bereit zum Hosten?', 'Ready to host?'),
  source: 'https://github.com/Henny263462/vibey-multiplayer',
  icon: 'icon.png',
  downloadNote: S('Der Download kommt, sobald der Relay-Server online ist.', 'The download arrives as soon as the relay server is online.'),
  hero: { kind: 'shot', img: 'img/host-online.webp', address: 'mossy-otter-27.vibey.henny.dev' },
  intro: S('Öffne deine Welt aus dem Pausenmenü, kopier deine Adresse und schick sie deinen Freunden. Sie verbinden sich mit ganz normalem Minecraft über „Direkt verbinden“, ohne Mod und ohne Portfreigabe.',
    'Open your world from the pause menu, copy your address and send it to your friends. They join with plain Minecraft through “Direct Connection”, no mod and no port forwarding.'),
  highlights: [
    S('Eine feste Adresse, die bei jedem Hosting gleich bleibt', 'One fixed address that stays the same every time you host'),
    S('Keine Portfreigabe, kein eigener Server', 'No port forwarding, no server of your own'),
    S('Freunde joinen mit normalem Minecraft', 'Friends join with plain Minecraft'),
    S('Fabric und NeoForge, von 1.21 bis 26.3', 'Fabric and NeoForge, from 1.21 to 26.3'),
  ],
  sections: [
    {
      type: 'flow', id: 'so-gehts', toc: S('So geht’s', 'How it works'), title: S('Drei Klicks bis zum Multiplayer', 'Three clicks to multiplayer'),
      lead: S('Kein Router, keine IP, kein Server mieten. Vibey ersetzt „Im LAN öffnen“ durch etwas, das auch übers Internet funktioniert.',
        'No router settings, no IP, no server to rent. Vibey replaces “Open to LAN” with something that works across the internet.'),
      items: [
        { title: S('Welt hosten', 'Host World'), desc: S('Im Pausenmenü steht „Welt hosten“, wo sonst „Im LAN öffnen“ steht. Spielmodus wählen, starten.', 'The pause menu shows “Host World” where “Open to LAN” used to be. Pick a game mode, start.') },
        { title: S('Adresse kopieren', 'Copy your address'), desc: S('Du bekommst deine eigene Adresse wie <code>mossy-otter-27.vibey.henny.dev</code>. Sie bleibt bei jedem Hosting dieselbe, in jeder Welt.', 'You get your own address like <code>mossy-otter-27.vibey.henny.dev</code>. It stays the same every time you host, in every world.') },
        { title: S('Freunde verbinden sich', 'Friends join'), desc: S('Mehrspieler, Direkt verbinden, Adresse einfügen. Mit normalem, unverändertem Minecraft.', 'Multiplayer, Direct Connection, paste the address. With plain, unmodded Minecraft.') },
      ],
    },
    {
      type: 'abilities', id: 'features', toc: S('Features', 'Features'), title: S('Einfach, bis du mehr willst', 'Simple until you want more'),
      lead: S('Die wichtigsten Schalter liegen vorn, alles andere ist eingeklappt. Die Oberfläche spricht Deutsch und Englisch.',
        'The important switches are up front, everything else is folded away. The interface speaks German and English.'),
      items: [
        { name: S('Deine eigene Adresse', 'Your own address'), desc: S('Bleibt gleich, bis du sie erneuerst. Dann ist die alte sofort tot.', 'Stays the same until you renew it. Then the old one dies right away.') },
        { name: S('Einfach', 'Simple'), desc: S('Spielmodus für Gäste, Cheats und Mods erzwingen. Mehr braucht es meistens nicht.', 'Game mode for guests, cheats and force mods. Usually that is all you need.') },
        { name: S('Spielerliste', 'Player list'), desc: S('Sieh, wer online ist, gib oder nimm OP mit einem Klick, wirf Leute raus.', 'See who is online, give or take OP with one click, kick people.') },
        { name: S('Mods erzwingen', 'Force mods'), desc: S('Wem eine Mod fehlt, bekommt eine klare Liste statt einer kryptischen Fehlermeldung.', 'Anyone missing a mod gets a clear list instead of a cryptic error.') },
        { name: S('Erweitert', 'Advanced'), desc: S('PvP, maximale Spielerzahl, exakte Mod-Versionen, neue Adresse und ein eigener Relay-Server.', 'PvP, max players, exact mod versions, a new address and your own relay server.') },
        { name: S('Ende-zu-Ende verschlüsselt', 'End-to-end encrypted'), desc: S('Das Relay reicht nur Bytes durch und sieht nie in deine Verbindung hinein.', 'The relay only forwards bytes and never sees inside your connection.') },
      ],
    },
    {
      type: 'gallery', id: 'screenshots', toc: S('Screenshots', 'Screenshots'), title: S('So sieht es im Spiel aus', 'How it looks in game'),
      lead: S('Echte Screenshots aus dem automatischen Client-Test. Klicken zum Vergrößern.', 'Real screenshots from the automated client test. Click to enlarge.'),
      items: [
        { img: 'img/host-online.webp', name: S('Welt gehostet', 'World hosted'), desc: S('Deine Adresse mit Kopierknopf, darunter die wichtigsten Einstellungen.', 'Your address with a copy button, the key settings below.') },
        { img: 'img/host-offline.webp', name: S('Bereit zum Hosten', 'Ready to host'), desc: S('Vor dem Start: Spielmodus, Cheats, Mods erzwingen.', 'Before you start: game mode, cheats, force mods.') },
        { img: 'img/host-advanced.webp', name: S('Erweitert', 'Advanced'), desc: S('PvP, Spielerzahl, exakte Versionen, neue Adresse, eigenes Relay.', 'PvP, player count, exact versions, new address, your own relay.') },
        { img: 'img/pause-menu.webp', name: S('Pausenmenü', 'Pause menu'), desc: S('„Welt hosten“ statt „Im LAN öffnen“.', '“Host World” instead of “Open to LAN”.') },
      ],
    },
  ],
};
