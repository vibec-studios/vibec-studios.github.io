// HHA Void: Inhalte der Mod-Seite (Quelle: vibec-studios/HHA_void, Version 0.1.1, Stand 16.11.2026).
// Modelle: tools/export_void_models.py (oruun, oruun_p3, star_core).
export default {
  id: 'void',
  name: 'HHA Void',
  short: {
    de: 'Void’s Armor für H&H Armors: Teleports, Meteore und ein schwarzes Loch, dazu Oruun, ein Leviathan aus Sternen, der dich verschlingt.',
    en: 'Void’s Armor for H&H Armors: teleports, meteors and a black hole, plus Oruun, a leviathan made of stars that swallows you whole.',
  },
  tagline: {
    de: 'Was du Void nennst, war einmal sein Schweigen.',
    en: 'What you call the void was once his silence.',
  },
  accent: '#924cff',
  accent2: '#d082ff',
  version: '0.1.1',
  mc: '1.21.11',
  loader: 'Fabric',
  requires: ['H&H Armors ≥ 0.6.0', 'Fabric API', 'Fabric Language Kotlin'],
  status: { de: 'In Entwicklung', en: 'In development' },
  source: 'https://github.com/vibec-studios/HHA_void',
  series: 'HHA', role: 'addon', icon: 'item/void_sword.png',
  categories: ['adventure', 'equipment', 'mobs'], // Modrinth-Kategorien für den Vibe Store (tools/store.py)
  card: { model: 'oruun' },
  hero: { kind: 'boss', model: 'oruun' },
  intro: {
    de: 'HHA Void ist ein Addon für H&H Armors. Es bringt eine Rüstung aus dem Nichts, mit der du durch Wände springst, Meteore herabrufst und ein schwarzes Loch öffnest. Über den End-Inseln wartet Oruun, ein uralter Leviathan von fast 60 Blöcken Länge, auf dem du stehen kannst, der dich verschlingt und den du am Ende von innen bekämpfst.',
    en: 'HHA Void is an addon for H&H Armors. It adds armor made of nothing that lets you blink through walls, call down meteors and open a black hole. Above the End islands waits Oruun, an ancient leviathan almost 60 blocks long that you can stand on, that swallows you, and that you end up fighting from the inside.',
  },
  highlights: [
    { de: 'Void Collapse: ein echtes schwarzes Loch als Ultra-Fähigkeit', en: 'Void Collapse: a real black hole as your ultra ability' },
    { de: 'Oruun: ein fliegender Leviathan, auf dessen Rücken du kämpfst', en: 'Oruun: a flying leviathan you fight on top of' },
    { de: 'Verschlungen: kämpf dich durch seinen Bauch bis zum Herzen', en: 'Swallowed: fight your way through his belly to his heart' },
    { de: 'Harpunen-Geschütze, die den Riesen zu Boden zerren', en: 'Harpoon guns that drag the giant to the ground' },
  ],
  sections: [
    // ------------------------------------------------------------------ Rüstung und Waffen
    {
      type: 'armor',
      title: { de: 'Void’s Armor', en: 'Void’s Armor' },
      lead: {
        de: 'Netherit in den Farben des End-Portals, mit Amethyst-Zierlinien, die nachts leuchten. Dazu ein Katana und ein Kriegshammer.',
        en: 'Netherite in the colors of the End portal, with amethyst trims that glow at night. Plus a katana and a war hammer.',
      },
      armor: 'void',
      items: [
        { tex: 'void_helmet', frames: 4, name: { de: 'Void-Helm', en: 'Void Helmet' }, lore: [{ de: 'Notriss: reißt dich in letzter Sekunde weg', en: 'Emergency Rift: tears you away at the last second' }] },
        { tex: 'void_chestplate', frames: 4, name: { de: 'Void-Brustplatte', en: 'Void Chestplate' }, lore: [{ de: 'Meteor Strike und Void Collapse', en: 'Meteor Strike and Void Collapse' }] },
        { tex: 'void_leggings', frames: 4, name: { de: 'Void-Beinschutz', en: 'Void Leggings' }, lore: [{ de: 'Void Pounce: von oben auf den Schwächsten', en: 'Void Pounce: drop onto the weakest from above' }] },
        { tex: 'void_boots', frames: 4, name: { de: 'Void-Stiefel', en: 'Void Boots' }, lore: [{ de: 'Void Step: zweimal springen, durch Wände', en: 'Void Step: double jump, through walls' }] },
        { tex: 'void_sword', frames: 8, name: { de: 'Void Sword', en: 'Void Sword' }, lore: [{ de: 'Sechs Splitter kreisen um dich', en: 'Six shards orbit around you' }] },
        { tex: 'void_mace', frames: 8, name: { de: 'Void Mace', en: 'Void Mace' }, lore: [{ de: 'Sky Launch, dann Schockwelle', en: 'Sky Launch, then shockwave' }] },
        { tex: 'void_ingot', frames: 18, name: { de: 'Void-Barren', en: 'Void Ingot' }, lore: [] },
      ],
      showcase: ['void_sword', 'void_mace', 'void_ingot'],
    },

    // ------------------------------------------------------------------ Fähigkeiten
    {
      type: 'abilities',
      title: { de: 'Fähigkeiten', en: 'Abilities' },
      items: [
        {
          name: { de: 'Meteor Strike', en: 'Meteor Strike' }, key: 'Ability 1', icon: 'hud/meteor.png',
          desc: { de: 'Zielsuchende Meteore regnen auf alle Gegner, zum Schluss schlägt ein Void-Komet ein.', en: 'Homing meteors rain down on every enemy, and a void comet strikes last.' },
        },
        {
          name: { de: 'Void Pounce', en: 'Void Pounce' }, key: 'Ability 2', icon: 'hud/pounce.png',
          desc: { de: 'Teleportiert dich über das schwächste Wesen in der Nähe, perfekt für einen Mace-Smash.', en: 'Teleports you above the weakest creature nearby, perfect for a mace smash.' },
        },
        {
          name: { de: 'Void Step', en: 'Void Step' }, key: null, icon: 'hud/dash.png',
          desc: { de: 'Zweimal springen und du teleportierst dich ein Stück in Blickrichtung, auch durch Wände.', en: 'Double-tap jump to blink ahead where you look, even through walls.' },
        },
        {
          name: { de: 'Void Collapse', en: 'Void Collapse' }, key: 'Ability 3', icon: 'hud/collapse.png',
          desc: { de: 'Mit vollem Set öffnet sich ein schwarzes Loch, saugt alle Gegner an und schmettert sie zu Boden.', en: 'With the full set a black hole opens, drags every enemy in and slams them into the ground.' },
        },
        {
          name: { de: 'Void Shards', en: 'Void Shards' }, key: null, icon: 'hud/shards.png',
          desc: { de: 'Das Schwert wirft kreisende Splitter, die von Gegner zu Gegner springen und zurückkehren.', en: 'The sword throws orbiting shards that bounce from enemy to enemy and come back.' },
        },
        {
          name: { de: 'Sky Launch', en: 'Sky Launch' }, key: null, icon: 'hud/launch.png',
          desc: { de: 'Die Mace reißt dich in den Himmel, dein nächster Treffer wird zur Schockwelle.', en: 'The mace hurls you into the sky, and your next hit becomes a shockwave.' },
        },
        {
          name: { de: 'Void Link', en: 'Void Link' }, key: null, icon: null,
          desc: { de: 'Mit vollem Set springt jeder Treffer als Energiebogen auf weitere Gegner über.', en: 'With the full set every hit arcs on to more enemies as a bolt of energy.' },
        },
        {
          name: { de: 'Kind der Nacht', en: 'Child of the Night' }, key: null, icon: null,
          desc: { de: 'Nachts und im End wird das Set eins mit der Dunkelheit und macht dich unsichtbar.', en: 'At night and in the End the set becomes one with the dark and turns you invisible.' },
        },
      ],
    },

    // ------------------------------------------------------------------ Bosskampf
    {
      type: 'boss',
      title: { de: 'Oruun, der Leviathan', en: 'Oruun, the Leviathan' },
      lead: {
        de: 'Älter als die Sterne, frisst er das Licht erloschener Sonnen. Wer Void trägt, trägt ein Stück seiner Stille, und er kommt, um sie heimzusingen.',
        en: 'Older than the stars, he feeds on the light of dead suns. Whoever wears the void carries a piece of his silence, and he comes to sing it home.',
      },
      bosses: [
        {
          id: 'oruun',
          model: 'oruun',
          texture: null,
          name: { de: 'Oruun, der Leviathan', en: 'Oruun, the Leviathan' },
          sub: { de: 'Phase I und II', en: 'Phases I and II' },
          color: '#8f6bff',
          segments: 2,
          desc: {
            de: 'Ein fast 60 Blöcke langer Sternenwal, der über der Arena kreist. Du kannst auf seinem Rücken stehen, also versucht er, dich abzuschütteln.',
            en: 'A star whale almost 60 blocks long that circles the arena. You can stand on his back, so he tries to shake you off.',
          },
          trick: {
            de: 'Bei der Bruchlandung liegt sein Sternenherz offen, dann über die Fluke auf den Rücken und zuschlagen.',
            en: 'When he crash-lands his star heart lies open, so run up the fluke onto his back and strike.',
          },
          where: {
            de: 'In der Sternentiefe hoch über den äußeren End-Inseln, gerufen vom Ruf der Tiefe in ihrer Mitte.',
            en: 'In the Star Deep high above the outer End islands, summoned by the Call of the Deep at its center.',
          },
          loot: {
            de: 'Erst nach Phase III: Void-Barren, ein Netherstern und das Buch „Das Lied des Sternenwals“.',
            en: 'Only after phase III: Void Ingots, a Nether Star and the book “The Song of the Star Whale”.',
          },
          phases: [
            {
              name: { de: 'I · Der Gesang', en: 'I · The Song' },
              desc: { de: 'Er bricht aus einem Riss im Himmel und greift mit Fluke, Sternenatem, Rammstoß und Kiefer an.', en: 'He bursts from a rift in the sky and attacks with fluke, star breath, ramming and jaws.' },
            },
            {
              name: { de: 'II · Die Tiefe erwacht', en: 'II · The Deep Awakens' },
              desc: { de: 'Der Boden reißt, er bricht von unten durch die Arena, und am Ende verschlingt er alle.', en: 'The ground splits, he breaches up through the arena, and in the end he swallows everyone.' },
            },
          ],
          moves: [
            { n: { de: 'Brüllen', en: 'Roar' }, p: ['roar_coil', 'roar'] },
            { n: { de: 'Flukenschlag', en: 'Fluke Slam' }, p: ['slam_lift', 'slam_hit', 'slam_ring'] },
            { n: { de: 'Sternenatem', en: 'Star Breath' }, p: ['breath_charge', 'breath_fire'] },
            { n: { de: 'Sternenregen', en: 'Star Rain' }, p: ['debris'] },
            { n: { de: 'Rammstoß mit Bruchlandung', en: 'Ram and crash landing' }, p: ['ram', 'beached', 'beached_push'] },
            { n: { de: 'Kieferschnappen', en: 'Jaw Snap' }, p: ['snap_open', 'snap_bite'] },
            { n: { de: 'Blasloch-Geysir', en: 'Blowhole Geyser' }, p: ['blow_charge', 'blow_burst'] },
            { n: { de: 'Mahlstrom', en: 'Maelstrom' }, p: ['inhale'] },
            { n: { de: 'Durchbruch', en: 'Breach' }, p: ['dive', 'breach_rise', 'breach_apex', 'breach_tip'] },
            { n: { de: 'Flutwelle', en: 'Flood Wave' }, p: ['flood_lift', 'flood_swing'] },
            { n: { de: 'Fassrolle', en: 'Barrel Roll' }, p: ['roll_warn', 'roll_side', 'roll_top'] },
            { n: { de: 'Rückenbeben', en: 'Back Quake' }, p: ['quake_dip', 'quake_jump'] },
            { n: { de: 'Schwanzpeitsche', en: 'Tail Sweep' }, p: ['sweep_rise', 'sweep_mid', 'sweep_end'] },
            { n: { de: 'Verschlingen', en: 'Devour' }, p: ['devour_open', 'devour_snap', 'gorged'] },
            { n: { de: 'Ausbruch', en: 'Breakout' }, p: ['breakout_bulge', 'breakout_tear'] },
          ],
        },
        {
          id: 'oruun_belly',
          model: 'star_core',
          texture: null,
          name: { de: 'Im Bauch des Leviathans', en: 'Inside the Leviathan' },
          sub: { de: 'Bauch-Phase', en: 'Belly phase' },
          color: '#ff5fc8',
          segments: 5,
          desc: {
            de: 'Verschlungen kämpft ihr euch gemeinsam durch seinen ganzen Körper. Jedes zerstörte Organ reißt ihm ein Stück Leben heraus.',
            en: 'Once swallowed, you fight together through his entire body. Every organ you destroy tears out a piece of his life.',
          },
          trick: {
            de: 'Das Sternenherz bleibt geschützt, bis alle Herzklappen zerstört sind.',
            en: 'The star heart stays shielded until every heart valve is destroyed.',
          },
          where: {
            de: 'Nach dem Verschlingen am Ende von Phase II.',
            en: 'After being devoured at the end of phase II.',
          },
          loot: {
            de: 'Der Ausweg: Die Flanke reißt auf und ihr fliegt ins Freie.',
            en: 'The way out: his flank tears open and you fly free.',
          },
          phases: [
            { name: { de: 'Schlund', en: 'Gullet' }, desc: { de: 'Würgknoten an den Wänden, Schluckreflexe werfen zurück.', en: 'Gag knots on the walls, swallowing reflexes throw you back.' } },
            { name: { de: 'Magen', en: 'Stomach' }, desc: { de: 'Magenkerne auf Fleischhügeln, während die Säure steigt.', en: 'Stomach cores on mounds of flesh while the acid rises.' } },
            { name: { de: 'Gedärme', en: 'Intestines' }, desc: { de: 'Enge Gänge mit Säuretümpeln, Ganglien in den Seitentaschen.', en: 'Narrow passages with acid pools, ganglia in the side pockets.' } },
            { name: { de: 'Lunge', en: 'Lung' }, desc: { de: 'Eine Wendelrampe hinauf, jeder Atemzug saugt und trägt.', en: 'Up a spiral ramp, every breath pulls and lifts.' } },
            { name: { de: 'Herzkammer', en: 'Heart chamber' }, desc: { de: 'Herzklappen schützen das Sternenherz, jeder Schlag ist eine Schockwelle.', en: 'Heart valves guard the star heart, every beat is a shockwave.' } },
          ],
          moves: [
            { n: { de: 'Herzschlag', en: 'Heartbeat' }, p: ['beat', 'idle', 'beat'] },
            { n: { de: 'Zerbersten', en: 'Shatter' }, p: ['open', 'burst'] },
          ],
        },
        {
          id: 'oruun_p3',
          model: 'oruun_p3',
          texture: null,
          name: { de: 'Oruun in Raserei', en: 'Oruun Enraged' },
          sub: { de: 'Phase III', en: 'Phase III' },
          color: '#ff4fd8',
          segments: 1,
          desc: {
            de: 'Verwundet und rasend bricht das Licht aus seiner aufgerissenen Haut. Er fliegt tiefer, ist nach Angriffen oft erschöpft und ruft die Supernova.',
            en: 'Wounded and enraged, light bursts from his torn skin. He flies lower, is often exhausted after attacks and calls the supernova.',
          },
          trick: {
            de: 'Vor der Supernova hinter einen Monolithen, und mit den Harpunen-Geschützen nagelt ihr ihn am Boden fest.',
            en: 'Get behind a monolith before the supernova, and pin him to the ground with the harpoon guns.',
          },
          where: {
            de: 'Direkt nach dem Ausbruch aus seinem Bauch.',
            en: 'Right after you break out of his belly.',
          },
          loot: {
            de: 'Void-Barren, ein Netherstern, viel Erfahrung und „Das Lied des Sternenwals“. Am Himmel erscheint ein neues Sternbild.',
            en: 'Void Ingots, a Nether Star, lots of experience and “The Song of the Star Whale”. A new constellation appears in the sky.',
          },
          phases: [
            {
              name: { de: 'III · Raserei', en: 'III · Frenzy' },
              desc: { de: 'Nach dem Ausbruch taumelt er, dann greift er wilder an als je zuvor, bis das Lied verklingt.', en: 'After the breakout he reels, then attacks more wildly than ever until the song fades.' },
            },
          ],
          moves: [
            { n: { de: 'Taumeln', en: 'Reeling' }, p: ['reeling'] },
            { n: { de: 'Supernova', en: 'Supernova' }, p: ['nova_fold', 'nova_burst'] },
            { n: { de: 'Festgenagelt', en: 'Pinned' }, p: ['dive', 'beached', 'beached_push'] },
            { n: { de: 'Rammstoß', en: 'Ram' }, p: ['ram'] },
            { n: { de: 'Leere-Eruption', en: 'Void Eruption' }, p: ['roar_coil', 'roar'] },
            { n: { de: 'Das Lied verklingt', en: 'The song fades' }, p: ['death_roar', 'death_rear', 'death_roll'] },
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Welt
    {
      type: 'world',
      title: { de: 'Die Sternentiefe', en: 'The Star Deep' },
      cards: [
        {
          name: { de: 'Die Sternentiefe', en: 'The Star Deep' },
          desc: {
            de: 'Eine riesige Himmelsarena über den End-Inseln mit Sternenkarte im Boden, Monolithen als Deckung, Walrippen-Bögen und schwebenden Trümmerinseln.',
            en: 'A huge sky arena above the End islands with a star map in the floor, monoliths for cover, whale-rib arches and floating debris islands.',
          },
          colors: ['#36363b', '#302a32', '#2a0e4f', '#8661c1', '#a77aa7', '#dbde9e'],
        },
        {
          name: { de: 'Harpunen-Plattformen', en: 'Harpoon platforms' },
          desc: {
            de: 'Sechs Außenplattformen mit Harpunen-Geschützen, über Sprungpfade erreichbar.',
            en: 'Six outer platforms with harpoon guns, reached by jumping paths.',
          },
          colors: ['#3a3a3d', '#302a32', '#dbde9e', '#8661c1', '#c9b8d8'],
        },
        {
          name: { de: 'Der Bauch', en: 'The belly' },
          desc: {
            de: 'Fleisch, leuchtende Adern, Rippenbögen und steigende Säure: der Weg durch sein Inneres bis zum Herzen.',
            en: 'Flesh, glowing veins, rib arches and rising acid: the path through his insides up to the heart.',
          },
          colors: ['#4a1a2e', '#d23cc8', '#3cd2e6', '#d8cdb0', '#a6d22e', '#d98aa8'],
        },
      ],
    },

    // ------------------------------------------------------------------ Installation
    {
      type: 'install',
      title: { de: 'Installation', en: 'Installation' },
      steps: [
        { de: 'Fabric Loader für Minecraft 1.21.11 mit Fabric API, Fabric Language Kotlin und H&H Armors installieren.', en: 'Install Fabric Loader for Minecraft 1.21.11 with Fabric API, Fabric Language Kotlin and H&H Armors.' },
        { de: 'Die HHA-Void-Jar in den <code>mods</code>-Ordner legen, auf Servern auch bei jedem Spieler. Ein öffentliches Release gibt es noch nicht.', en: 'Put the HHA Void jar into the <code>mods</code> folder, on servers for every player too. There is no public release yet.' },
      ],
    },
  ],
};
