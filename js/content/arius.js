// HHA Arius – The White Blade: Inhalte der Mod-Seite (Quelle: vibec-studios/hha-arius, Version 1.4.0, Stand 17.11.2026).
// Seit 1.2.0 heißt die Drachin Solvane (Drachenform von Arius' Schwert, im Code weiter `nivaris`), die Rüstung ist die
// Rüstung seit 1.2.2: Netherite-Form (armor/eirholm_armor_base*.png) plus 3D-Akzente (armor/eirholm_armor.json, armor3d).
// Modelle: HHA/tmp/studio/tools/export_arius_models.py (arius, arius_white, nivaris als zusammengerollter Schlangendrache, Rüstung).
const S = (de, en) => ({ de, en });

export default {
  id: 'arius',
  name: 'HHA Arius',
  short: S(
    'Die weiße Klinge: ein Duell gegen Arius und Solvane, die weiße Drachin, die in seinem Schwert lebt, dazu die Drachenherz-Wacht.',
    'The White Blade: a duel against Arius and Solvane, the white dragon that lives in his sword, plus the Dragonheart Watch.',
  ),
  tagline: S('Eine Linie. Ein Schnitt. Dann Stille.', 'One line. One cut. Then silence.'),
  accent: '#6cc4ff',
  accent2: '#d6f0ff',
  version: '1.4.0',
  mc: '1.21.11',
  loader: 'Fabric',
  requires: ['H&H Armors 0.8.0', 'Fabric API', 'Fabric Language Kotlin'],
  status: S('Veröffentlicht', 'Released'),
  source: 'https://github.com/vibec-studios/hha-arius',
  series: 'HHA', role: 'addon', icon: 'icon.png',
  categories: ['adventure', 'equipment', 'mobs'], // Modrinth-Kategorien für den Vibe Store (tools/store.py)
  card: { model: 'arius' },
  hero: { kind: 'boss', model: 'arius' },
  intro: S(
    'HHA Arius ist ein Endgame-Addon für H&H Armors. Arius ist der Held unserer eigenen Light Novel „The White Blade“, die Mod ist eine freie Umsetzung davon. Brich das Siegel der Weißen Klinge in der Kälte, und der Schnee fällt nach oben: Du stehst im Heiligtum der Weißen Klinge, vor einem Schwertkämpfer, der jeden Fehler sieht. Sein Schwert Solvane wurde aus dem Herzen eines uralten weißen Drachen geschmiedet, und wenn er es loslässt, wird es wieder zu ihr.',
    'HHA Arius is an endgame addon for H&H Armors. Arius is the hero of our own light novel “The White Blade”, and the mod is a free adaptation of it. Break the Seal of the White Blade somewhere cold and the snow starts falling upward: you stand in the Sanctum of the White Blade, facing a swordsman who sees every mistake. His sword Solvane was forged from the heart of an ancient white dragon, and when he lets go, it becomes her again.',
  ),
  highlights: [
    S('Ein Duell in fünf Akten im Schneesturm, filmisch inszeniert vom Tempel bis zum Himmelsbalkon', 'A duel in five acts in a snowstorm, staged like a film from the temple to the Sky Balcony'),
    S('Solvane: Das Schwert wird zur Drachin und windet sich um den Gipfel eines Felshorns', 'Solvane: the sword becomes a dragon and coils around the summit of a rock horn'),
    S('Der Schnitt: eine Linie durch den Tempel, dann gleitet er auseinander', 'The Cut: one line through the temple, then it slides apart'),
    S('Die Drachenherz-Wacht, Solvane und Kampfhandschuhe mit Zauberrad', 'The Dragonheart Watch, Solvane and gauntlets with a spell wheel'),
  ],
  sections: [
    // ------------------------------------------------------------------ Trailer (Gameplay, HHA_Arius/tmp/trailer/out)
    {
      type: 'video', id: 'trailer', toc: S('Trailer', 'Trailer'), title: S('Das Duell in Bewegung', 'The duel in motion'),
      lead: S('Vom Gletscher bis zum Gipfel: Arius im Tempel, deine Ausrüstung im Einsatz und Solvane, die sich als weißer Drache um den Gipfel windet.',
        'From the glacier to the summit: Arius in the temple, your gear in action and Solvane coiling around the summit as a white dragon.'),
      webm: 'video/trailer.webm', mp4: 'video/trailer.mp4', poster: 'video/trailer-poster.webp',
      label: S('Gameplay-Trailer von HHA Arius', 'HHA Arius gameplay trailer'),
      // Musik ist CC0 (keine Namensnennung nötig), die Zeile ist eine freiwillige Geste
      credit: S('Musik: „Fall of Nightmares“ und „Production Theme Intro“ von nene (Stimmen: Helena Kesti, Matias Lindgren), „Cinematic percussion loop“ von Marwan Antonios, alle CC0 via <a href="https://opengameart.org/content/fall-of-nightmares-epic-orchestral" target="_blank" rel="noopener">OpenGameArt</a>',
        'Music: “Fall of Nightmares” and “Production Theme Intro” by nene (vocals: Helena Kesti, Matias Lindgren), “Cinematic percussion loop” by Marwan Antonios, all CC0 via <a href="https://opengameart.org/content/fall-of-nightmares-epic-orchestral" target="_blank" rel="noopener">OpenGameArt</a>'),
    },

    // ------------------------------------------------------------------ Rüstung und Waffen
    {
      type: 'armor',
      title: S('Die Drachenherz-Wacht', 'The Dragonheart Watch'),
      lead: S(
        'Arius’ Rüstung in Netherite-Form, perlweiß mit Altgold und eisblauen Fugen, dazu eine Krone aus Eishörnern, Schwingenplatten an den Schultern und ein Herz-Juwel, das pulsiert. Dazu Solvane und die Kampfhandschuhe von Arius.',
        'Arius’ armor in netherite form, pearl white with old gold and ice-blue seams, plus a crown of ice horns, wing plates on the shoulders and a pulsing heart gem. Plus Solvane and Arius’ gauntlets.',
      ),
      armor: 'eirholm_armor', armor3d: true,
      weapon: 'solvane',
      items: [
        { tex: 'eirholm_helmet', name: S('Arius’ Helm', 'Arius’ Helmet') },
        { tex: 'eirholm_chestplate', name: S('Arius’ Brustpanzer', 'Arius’ Chestplate') },
        { tex: 'eirholm_leggings', name: S('Arius’ Beinschienen', 'Arius’ Leggings') },
        { tex: 'eirholm_boots', name: S('Arius’ Stiefel', 'Arius’ Boots') },
        { tex: 'solvane', name: S('Solvane', 'Solvane') },
        { tex: 'arius_gauntlets', name: S('Arius’ Kampfhandschuhe', 'Arius’ Gauntlets') },
        { tex: 'heartfrost', name: S('Herzfrost', 'Heartfrost') },
        { tex: 'nivaris_scale', name: S('Schuppe des weißen Drachen', 'White dragon scale') },
      ],
    },

    // ------------------------------------------------------------------ Fähigkeiten
    {
      type: 'abilities',
      title: S('Fähigkeiten', 'Abilities'),
      items: [
        {
          name: S('Drachenatem', 'Dragon Breath'), icon: 'hud/dragon_breath.png',
          desc: S('Die Rüstung atmet einen Kegel aus Frost, genau wie Solvane.', 'The armor breathes a cone of frost, just like Solvane.'),
        },
        {
          name: S('Schwingensprung', 'Wing Leap'), icon: 'hud/wing_leap.png',
          desc: S('Ein weiter Sprung auf Lichtschwingen, und bei der Landung rollt eine Frost-Schockwelle über den Boden.', 'A long leap on wings of light, and when you land a frost shockwave rolls across the ground.'),
        },
        {
          name: S('Weißes Loch', 'White Hole'), icon: 'hud/art_white_hole.png',
          desc: S('Mit vollem Set öffnest du ein weißes Loch: Es reißt Blöcke aus dem Boden, lässt sie kreisen und schleudert sie beim Kollaps davon.', 'With the full set you open a white hole: it tears blocks out of the ground, spins them around and hurls them away as it collapses.'),
        },
        {
          name: S('Klare Schneide', 'Clear Cut'), icon: 'hud/art_clear_cut.png',
          desc: S('Solvane laden, die Schnittebene ausrichten, loslassen: ein sauberer Schnitt, der sogar Holz und Stein teilt.', 'Charge Solvane, aim the cutting plane, release: a clean cut that splits even wood and stone.'),
        },
        {
          name: S('Nahkampf', 'Melee'), icon: 'hud/art_mode_melee.png',
          desc: S('Kampfhandschuhe mit Drachenschwingen, Dornen und leuchtendem Eisband: Fäuste und Tritte, vom Aufwärtshaken bis zum Axttritt mit Frostwelle.', 'Gauntlets with dragon wings, spikes and a glowing ice band: fists and kicks, from an uppercut to an axe kick with a frost wave.'),
        },
        {
          name: S('Wind', 'Wind'), icon: 'hud/art_tornado.png',
          desc: S('Windklingen, Sturmstöße, ein wandernder Wirbelsturm und Sprünge, die dich hoch und weit tragen.', 'Wind blades, gusts, a roaming tornado and leaps that carry you high and far.'),
        },
        {
          name: S('Eis', 'Ice'), icon: 'hud/art_glacier_lance.png',
          desc: S('Frostsplitter, Eiswände, eine Gletscherlanze und ein Panzer aus Eis, der Treffer abfängt.', 'Frost shards, ice walls, a glacier lance and a shell of ice that catches hits.'),
        },
        {
          name: S('Yang', 'Yang'), icon: 'hud/art_school_yang.png',
          desc: S('Licht als Werkzeug: Plattformen, eine echte Brücke aus Licht mit Geländer, ein Schild und ein Gleiter.', 'Light as a tool: platforms, a real bridge of light with railings, a shield and a glider.'),
        },
        {
          name: S('Frostresonanz', 'Frost resonance'), icon: null,
          desc: S('Rüstung, Handschuhe und Solvane teilen sich eine Kraft, die nur durch gutes Kämpfen wächst.', 'Armor, gauntlets and Solvane share one power that only grows when you fight well.'),
        },
      ],
    },

    // ------------------------------------------------------------------ Bosskampf
    {
      type: 'boss',
      title: S('Das Duell im Heiligtum', 'The duel in the Sanctum'),
      lead: S(
        'Jeder Angriff wird am Boden angekündigt, und Gold heißt immer sicher. Vanilla-Bewegung, Schild und Bogen reichen zum Sieg. Wer fällt, verliert nichts und steigt im nächsten Teil wieder ein.',
        'Every attack is announced on the ground, and gold always means safe. Vanilla movement, shield and bow are enough to win. Whoever falls loses nothing and rejoins in the next part.',
      ),
      bosses: [
        {
          id: 'arius',
          model: 'arius',
          texture: null,
          name: S('Arius', 'Arius'),
          sub: S('Der Tempel der Weißen Klinge', 'The Temple of the White Blade'),
          color: '#6cc4ff',
          segments: 2,
          desc: S(
            'Ein Schwertkämpfer mit lesbaren Haltungen, Windschritten und einer Parade, die gierige Angriffe bestraft. Lässt er die Klinge los, wirbelt sie allein durch die Luft und jagt dich, während er mit Tritten nachsetzt.',
            'A swordsman with readable stances, wind steps and a parry that punishes greedy attacks. When he lets go of his blade, it whirls through the air on its own and hunts you while he follows up with kicks.',
          ),
          trick: S(
            'Nicht immer dasselbe tun: Er passt sich an wiederholte Taktiken an. Und wenn eine Linie durch den Tempel läuft, nicht darauf stehen.',
            'Don’t repeat yourself: he adapts to tactics you use again and again. And when a line runs through the temple, don’t stand on it.',
          ),
          where: S(
            'Im Heiligtum der Weißen Klinge, gerufen mit dem Siegel der Weißen Klinge in einem kalten Biom.',
            'In the Sanctum of the White Blade, called with the Seal of the White Blade in a cold biome.',
          ),
          loot: S('Am Ende des Duells: Solvane, die Kampfhandschuhe, Herzfrost und die Schmiedevorlage Drachenherz.', 'At the end of the duel: Solvane, the gauntlets, Heartfrost and the Dragonheart smithing template.'),
          phases: [
            { name: S('I · Der Tempel', 'I · The Temple'), desc: S('Arius allein im Schneesturm: Schwertkombos, Klingenflug, Frostdornen aus dem Boden und Frostwände, die Fluchtwege schließen.', 'Arius alone in the snowstorm: sword combos, the flying blade, frost thorns from the ground and frost walls that close escape routes.') },
            { name: S('II · Der Schnitt', 'II · The Cut'), desc: S('Der Wind dreht, die Halle wird still, eine einzige Linie kreuzt den Tempel. Dann tritt er dich durch das brechende Tor.', 'The wind turns, the hall goes silent, a single line crosses the temple. Then he kicks you through the breaking gate.') },
          ],
          moves: [
            { n: S('Haltung', 'Stance'), p: ['guard', 'idle'] },
            { n: S('Schwertkombo', 'Sword combo'), p: ['c1_wind', 'c1_hit', 'c1_follow', 'c2_wind', 'c2_hit', 'c2_follow'] },
            { n: S('Schwerer Hieb', 'Heavy strike'), p: ['c3_wind', 'c3_hit', 'c3_hold'] },
            { n: S('Windschritt', 'Wind step'), p: ['lunge_crouch', 'lunge_sprint', 'lunge_slide'] },
            { n: S('Parade und Konter', 'Parry and counter'), p: ['pk_deflect', 'pk_turn', 'pk_kick'] },
            { n: S('Frostwand', 'Frost wall'), p: ['wall_crouch', 'wall_press', 'wall_rise'] },
            { n: S('Der Schnitt', 'The Cut'), p: ['cut_charge', 'cut_top', 'cut_strike', 'cut_low'] },
            { n: S('Tritt durchs Tor', 'Kick through the gate'), p: ['gk_parry', 'gk_load', 'gk_knee', 'gk_kick'] },
          ],
        },
        {
          id: 'solvane',
          model: 'nivaris',
          texture: null,
          name: S('Solvane', 'Solvane'),
          sub: S('Herz des weißen Drachen', 'Heart of the White Dragon'),
          color: '#bfe6ff',
          segments: 1,
          desc: S(
            'Arius lässt sein Schwert los, und es wird zu dem, was es einmal war: eine uralte weiße Drachin, gewunden um den Gipfel eines Felshorns. Im Kampf fließt ihr langer Körper in weiten Bögen durch die Luft, und Arius sieht ohne Klinge zu.',
            'Arius lets go of his sword, and it becomes what it once was: an ancient white dragon coiled around the summit of a rock horn. In the fight her long body flows through the air in wide arcs, and Arius watches without a blade.',
          ),
          trick: S(
            'Lock ihren Sturzflug in einen Eisgrat, dann liegt sie am Boden. Treffer an die Kehle ersticken ihren Atem.',
            'Lure her dive into an ice ridge to bring her down. Hits to the throat choke her breath.',
          ),
          where: S('Hinter dem gebrochenen Tor, auf einem weiten, offenen Hochland unter dem Felshorn.', 'Behind the broken gate, on a wide open highland below the rock horn.'),
          loot: S('Schuppen des weißen Drachen, aus denen Solvanes Schwingenschuppe wird.', 'White dragon scales, which become Solvane’s Wingscale.'),
          phases: [
            { name: S('III · Die Gletscherschwelle', 'III · The Glacier Threshold'), desc: S('Solvane allein: Eisatem, Sturzflüge und harte Landungen, die du bestrafen kannst.', 'Solvane alone: ice breath, dives and hard landings you can punish.') },
          ],
          moves: [
            { n: S('Schwingen spannen', 'Spread wings'), p: ['spread', 'wings_up', 'wings_down', 'spread'] },
            { n: S('Brüllen', 'Roar'), p: ['roar', 'idle'] },
            { n: S('Eisatem', 'Ice breath'), p: ['breath', 'roar', 'idle'] },
            { n: S('Anlegen', 'Fold'), p: ['fold_tight', 'idle'] },
          ],
        },
        {
          id: 'arius_white',
          model: 'arius_white',
          texture: null,
          name: S('Arius, Erbe des Weißen Drachen', 'Arius, Heir of the White Dragon'),
          sub: S('Der Himmelsbalkon', 'The Sky Balcony'),
          color: '#ffffff',
          segments: 2,
          desc: S(
            'Er legt die dunkle Rüstung ab und kämpft in Weiß, Seite an Seite mit Solvane. Die beiden kämpfen im Takt: einer führt, der andere stützt.',
            'He sheds his dark armor and fights in white, side by side with Solvane. The two fight in rhythm: one leads, the other supports.',
          ),
          trick: S(
            'Brich den Takt, dann steht der Partner offen. Resonanzangriffe haben immer einen klaren sicheren Weg.',
            'Break the rhythm and the partner is open. Resonance attacks always have a clear safe path.',
          ),
          where: S('Auf dem Himmelsbalkon, einem Felsschelf hoch am Horn. Beim Gletschersturz trägt Solvanes Lichtstrom alle hinauf.', 'On the Sky Balcony, a rock shelf high on the horn. When the glacier collapses, Solvane’s stream of light carries everyone up.'),
          loot: S('Wer ohne K. o. gewinnt, bekommt die Schmiedevorlage „Weiße Klinge“.', 'Win without anyone getting knocked out and you get the “White Blade” smithing template.'),
          phases: [
            { name: S('IV · Im Takt', 'IV · In Rhythm'), desc: S('Arius mit einer Klinge aus Eislicht und Solvane gemeinsam, dazu ein Kranz aus Frostdornen und einmal im Kampf das weiße Loch.', 'Arius with a blade of ice light and Solvane together, plus a ring of frost thorns and, once per fight, the white hole.') },
            { name: S('V · Der letzte klare Moment', 'V · The Last Clear Moment'), desc: S('Die Drachin kehrt als Licht in die Scheide zurück. Der letzte Austausch läuft in Zeitlupe: ausweichen, die Klingen binden, kontern und Arius entwaffnen.', 'The dragon returns to the scabbard as light. The last exchange plays in slow motion: dodge, bind the blades, counter and disarm Arius.') },
          ],
          moves: [
            { n: S('White Null', 'White Null'), p: ['null_wind', 'null_hit', 'null_follow'] },
            { n: S('Weißes Loch', 'White hole'), p: ['core_raise', 'idle'] },
            { n: S('Luftkombo', 'Air combo'), p: ['launch_wind', 'launch_hit', 'launch_follow', 'air_tuck', 'air_kick', 'air_land'] },
            { n: S('Spaltschlag', 'Splitting strike'), p: ['split_raise', 'split_hit', 'split_low'] },
            { n: S('Wirbel', 'Spin'), p: ['spin_wind', 'spin_hit', 'spin_end'] },
            { n: S('Schnitt aus der Scheide', 'Cut from the sheath'), p: ['iai_stance', 'iai_mid', 'iai_hit', 'iai_end'] },
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Welt
    {
      type: 'world',
      title: S('Das Heiligtum der Weißen Klinge', 'The Sanctum of the White Blade'),
      lead: S(
        'Eine eigene Dimension, für jeden Versuch neu aus Vanilla-Blöcken gebaut und von einem Schneesturm umtost, der nie aufhört, auch mit Shaderpacks: Böen bis zum Whiteout, treibender Schnee und Frost am Bildrand.',
        'A dimension of its own, rebuilt from vanilla blocks for every attempt and lashed by a snowstorm that never stops, even with shader packs: gusts up to a whiteout, drifting snow and frost at the edge of the screen.',
      ),
      cards: [
        {
          name: S('Der Tempel', 'The Temple'),
          desc: S('Eine stille Halle aus Eis und altem Stein, bis eine Linie sie in zwei Hälften teilt.', 'A silent hall of ice and old stone, until a line splits it in two.'),
          colors: ['#2b3446', '#5d6b82', '#a9bad0', '#e6eef7', '#c9a24e'],
        },
        {
          name: S('Das Felshorn', 'The Rock Horn'),
          desc: S('Ein alpines Horn aus Fels mit Graten, Schneebändern und Eisrinnen, darunter ein weites, offenes Hochland mit Obelisken und Ruinenbögen.', 'An alpine horn of rock with ridges, snow bands and ice gullies, below it a wide open highland with obelisks and ruined arches.'),
          colors: ['#4a4e57', '#6d717a', '#9a9ea6', '#e9eef4', '#a9c9e6'],
        },
        {
          name: S('Der Himmelsbalkon', 'The Sky Balcony'),
          desc: S('Ein weites Felsschelf hoch über der Schlucht, mit Kristallsäulen und Eiszapfen. Hier fällt die Entscheidung.', 'A wide rock shelf high above the canyon, with crystal pillars and icicles. This is where it ends.'),
          colors: ['#3a3f48', '#62676f', '#a8b3c2', '#e3ebf4', '#7fd6f0'],
        },
      ],
    },

    // ------------------------------------------------------------------ Installation
    {
      type: 'install',
      title: S('Installation', 'Installation'),
      steps: [
        S('Fabric Loader für Minecraft 1.21.11 mit Fabric API, Fabric Language Kotlin und H&H Armors installieren.', 'Install Fabric Loader for Minecraft 1.21.11 with Fabric API, Fabric Language Kotlin and H&H Armors.'),
        S('Die HHA-Arius-Jar aus dem Download-Center in den <code>mods</code>-Ordner legen, auf Servern auch bei jedem Spieler.', 'Put the HHA Arius jar from the download center into the <code>mods</code> folder, on servers for every player too.'),
      ],
    },
  ],
};
