// HHA Arius – The White Blade: Inhalte der Mod-Seite (Quelle: vibec-studios/hha-arius, Version 1.1.0, Stand 17.11.2026).
// Modelle: HHA/tmp/studio/tools/export_arius_models.py (arius, arius_white, nivaris als zusammengerollter Schlangendrache).
const S = (de, en) => ({ de, en });

export default {
  id: 'arius',
  name: 'HHA Arius',
  short: S(
    'Die weiße Klinge: ein Duell gegen Arius und die alte weiße Drachin Nivaris, dazu die Frostrüstung von Eirholm.',
    'The White Blade: a duel against Arius and the old white dragon Nivaris, plus the Eirholm frost armor.',
  ),
  tagline: S('Eine Linie. Ein Schnitt. Dann Stille.', 'One line. One cut. Then silence.'),
  accent: '#6cc4ff',
  accent2: '#d6f0ff',
  version: '1.1.0',
  mc: '1.21.11',
  loader: 'Fabric',
  requires: ['H&H Armors 0.8.0', 'Fabric API', 'Fabric Language Kotlin'],
  status: S('Veröffentlicht', 'Released'),
  source: 'https://github.com/vibec-studios/hha-arius',
  series: 'HHA', role: 'addon', icon: 'icon.png',
  card: { model: 'arius' },
  hero: { kind: 'boss', model: 'arius' },
  intro: S(
    'HHA Arius ist ein Endgame-Addon für H&H Armors. Arius ist der Held unserer eigenen Light Novel „The White Blade“, die Mod ist eine freie Umsetzung davon. Brich das Siegel von Eirholm in der Kälte, und der Schnee fällt nach oben: Du stehst im Heiligtum von Eirholm, vor einem Schwertkämpfer, der jeden Fehler sieht, und einer Drachin, die älter ist als das Eis.',
    'HHA Arius is an endgame addon for H&H Armors. Arius is the hero of our own light novel “The White Blade”, and the mod is a free adaptation of it. Break the Seal of Eirholm somewhere cold and the snow starts falling upward: you stand in the Sanctum of Eirholm, facing a swordsman who sees every mistake and a dragon older than the ice.',
  ),
  highlights: [
    S('Ein Duell in fünf Akten, vom Tempel bis zum letzten klaren Moment', 'A duel in five acts, from the temple to the last clear moment'),
    S('Nivaris: eine riesige Schlangendrachin, gewunden um eine Nadel aus Eis', 'Nivaris: a giant serpent dragon coiled around a needle of ice'),
    S('Der Schnitt: eine Linie durch den Tempel, dann gleitet er auseinander', 'The Cut: one line through the temple, then it slides apart'),
    S('Solvane, Kampfhandschuhe mit Zauberrad und die Rüstung von Eirholm', 'Solvane, gauntlets with a spell wheel and the Eirholm armor'),
  ],
  sections: [
    // ------------------------------------------------------------------ Rüstung und Waffen
    {
      type: 'armor',
      title: S('Die Rüstung von Eirholm', 'The Eirholm armor'),
      lead: S(
        'Netherit in Anthrazit und Stahlblau, mit altgoldenen Sternen und Nähten, die eisblau leuchten. Dazu Solvane und die Kampfhandschuhe von Arius.',
        'Netherite in anthracite and steel blue, with old-gold stars and seams that glow ice blue. Plus Solvane and Arius’ gauntlets.',
      ),
      armor: 'eirholm',
      weapon: 'solvane',
      items: [
        { tex: 'eirholm_helmet', name: S('Arius’ Helm', 'Arius’ Helmet') },
        { tex: 'eirholm_chestplate', name: S('Arius’ Brustpanzer', 'Arius’ Chestplate') },
        { tex: 'eirholm_leggings', name: S('Arius’ Beinschienen', 'Arius’ Leggings') },
        { tex: 'eirholm_boots', name: S('Arius’ Stiefel', 'Arius’ Boots') },
        { tex: 'solvane', name: S('Solvane', 'Solvane') },
        { tex: 'arius_gauntlets', name: S('Arius’ Kampfhandschuhe', 'Arius’ Gauntlets') },
        { tex: 'heartfrost', name: S('Herzfrost', 'Heartfrost') },
        { tex: 'nivaris_scale', name: S('Nivaris-Schuppe', 'Nivaris scale') },
      ],
    },

    // ------------------------------------------------------------------ Fähigkeiten
    {
      type: 'abilities',
      title: S('Fähigkeiten', 'Abilities'),
      items: [
        {
          name: S('Weißer Kern', 'White Core'), icon: 'hud/white_core.png',
          desc: S('Ein Kern aus weißem Licht stößt alles von dir weg und zerschlägt anfliegende Geschosse.', 'A core of white light pushes everything away from you and shatters incoming projectiles.'),
        },
        {
          name: S('Frostschritt', 'Frost Step'), icon: 'hud/frost_step.png',
          desc: S('Ein Schritt durch den Frost, kurz unberührbar im Nahkampf, über Wasser bleibt Eis zurück.', 'A step through the frost, briefly untouchable in melee, leaving ice on the water behind you.'),
        },
        {
          name: S('Weißes Loch', 'White Hole'), icon: 'hud/art_white_hole.png',
          desc: S('Mit vollem Set öffnest du ein weißes Loch, einen Kern, der drückt statt zieht.', 'With the full set you open a white hole, a core that pushes instead of pulls.'),
        },
        {
          name: S('Klare Schneide', 'Clear Cut'), icon: 'hud/art_clear_cut.png',
          desc: S('Solvane laden, die Schnittebene ausrichten, loslassen: ein sauberer Schnitt, der sogar Holz und Stein teilt.', 'Charge Solvane, aim the cutting plane, release: a clean cut that splits even wood and stone.'),
        },
        {
          name: S('Nahkampf', 'Melee'), icon: 'hud/art_mode_melee.png',
          desc: S('Mit den Kampfhandschuhen kämpfst du mit Fäusten und Tritten, inklusive Parade mit Konter.', 'The gauntlets let you fight with fists and kicks, including a parry with a counter.'),
        },
        {
          name: S('Wind', 'Wind'), icon: 'hud/art_school_wind.png',
          desc: S('Windklingen, Sturmstöße und Sprünge, die dich hoch und weit tragen.', 'Wind blades, gusts and leaps that carry you high and far.'),
        },
        {
          name: S('Eis', 'Ice'), icon: 'hud/art_school_ice.png',
          desc: S('Frostsplitter, Eiswände und ein Panzer aus Eis, der Treffer abfängt.', 'Frost shards, ice walls and a shell of ice that catches hits.'),
        },
        {
          name: S('Yang', 'Yang'), icon: 'hud/art_school_yang.png',
          desc: S('Licht als Werkzeug: Plattformen, Brücken, ein Schild und ein Gleiter.', 'Light as a tool: platforms, bridges, a shield and a glider.'),
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
      title: S('Das Duell von Eirholm', 'The duel of Eirholm'),
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
          sub: S('Der Tempel von Eirholm', 'The Temple of Eirholm'),
          color: '#6cc4ff',
          segments: 2,
          desc: S(
            'Ein Schwertkämpfer mit lesbaren Haltungen, Windschritten und einer Parade, die gierige Angriffe bestraft. Je länger der Kampf dauert, desto ernster nimmt er dich.',
            'A swordsman with readable stances, wind steps and a parry that punishes greedy attacks. The longer the fight lasts, the more seriously he takes you.',
          ),
          trick: S(
            'Nicht immer dasselbe tun: Er passt sich an wiederholte Taktiken an. Und wenn eine Linie durch den Tempel läuft, nicht darauf stehen.',
            'Don’t repeat yourself: he adapts to tactics you use again and again. And when a line runs through the temple, don’t stand on it.',
          ),
          where: S(
            'Im Heiligtum von Eirholm, gerufen mit dem Siegel von Eirholm in einem kalten Biom.',
            'In the Sanctum of Eirholm, called with the Seal of Eirholm in a cold biome.',
          ),
          loot: S('Am Ende des Duells: Solvane, die Kampfhandschuhe, Herzfrost und die Schmiedevorlage von Eirholm.', 'At the end of the duel: Solvane, the gauntlets, Heartfrost and the Eirholm smithing template.'),
          phases: [
            { name: S('I · Der Tempel', 'I · The Temple'), desc: S('Arius allein: Schwertkombos, Windschritte, Frostwände, die Fluchtwege schließen.', 'Arius alone: sword combos, wind steps, frost walls that close escape routes.') },
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
          id: 'nivaris',
          model: 'nivaris',
          texture: null,
          name: S('Nivaris', 'Nivaris'),
          sub: S('Die Alte vom Eirgletscher', 'The Old One of the Eir Glacier'),
          color: '#bfe6ff',
          segments: 1,
          desc: S(
            'Eine uralte weiße Schlangendrachin, gewunden um eine Nadel aus Eis. Ihr Atem lässt Eisgrate zurück, und Arius sieht zu.',
            'An ancient white serpent dragon coiled around a needle of ice. Her breath leaves ridges of ice behind, and Arius watches.',
          ),
          trick: S(
            'Lock ihren Sturzflug in einen Eisgrat, dann liegt sie am Boden. Treffer an die Kehle ersticken ihren Atem.',
            'Lure her dive into an ice ridge to bring her down. Hits to the throat choke her breath.',
          ),
          where: S('An der Gletscherschwelle, gleich hinter dem gebrochenen Tor.', 'At the Glacier Threshold, right behind the broken gate.'),
          loot: S('Nivaris-Schuppen, aus denen sich Schwingenschuppen machen lassen.', 'Nivaris scales, which can be turned into wing scales.'),
          phases: [
            { name: S('III · Die Gletscherschwelle', 'III · The Glacier Threshold'), desc: S('Nivaris allein: Eisatem, Sturzflüge und harte Landungen, die du bestrafen kannst.', 'Nivaris alone: ice breath, dives and hard landings you can punish.') },
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
          name: S('Arius in Weiß', 'Arius in White'),
          sub: S('Das Herz des Gletschers', 'The Heart of the Glacier'),
          color: '#ffffff',
          segments: 2,
          desc: S(
            'Er legt die dunkle Rüstung ab und kämpft in Weiß, Seite an Seite mit Nivaris. Die beiden kämpfen im Takt: einer führt, der andere stützt.',
            'He sheds his dark armor and fights in white, side by side with Nivaris. The two fight in rhythm: one leads, the other supports.',
          ),
          trick: S(
            'Brich den Takt, dann steht der Partner offen. Resonanzangriffe haben immer einen klaren sicheren Weg.',
            'Break the rhythm and the partner is open. Resonance attacks always have a clear safe path.',
          ),
          where: S('Im Herzen des Gletschers, nachdem Nivaris durch das Eis gebrochen ist.', 'In the heart of the glacier, after Nivaris has crashed through the ice.'),
          loot: S('Wer ohne K. o. gewinnt, bekommt die Schmiedevorlage „Weiße Klinge“.', 'Win without anyone getting knocked out and you get the “White Blade” smithing template.'),
          phases: [
            { name: S('IV · Im Takt', 'IV · In Rhythm'), desc: S('Arius und Nivaris gemeinsam, und einmal im Kampf: das weiße Loch.', 'Arius and Nivaris together, and once per fight: the white hole.') },
            { name: S('V · Der letzte klare Moment', 'V · The Last Clear Moment'), desc: S('Kein Sturm, keine Drachin. Drei Wechsel gegen seinen Schnitt aus der Scheide.', 'No storm, no dragon. Three exchanges against his cut from the sheath.') },
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
      title: S('Das Heiligtum von Eirholm', 'The Sanctum of Eirholm'),
      lead: S(
        'Eine eigene Dimension, für jeden Versuch neu aus Vanilla-Blöcken gebaut. In deiner Welt geht nie etwas kaputt.',
        'A dimension of its own, rebuilt from vanilla blocks for every attempt. Nothing in your world ever breaks.',
      ),
      cards: [
        {
          name: S('Der Tempel', 'The Temple'),
          desc: S('Eine stille Halle aus Eis und altem Stein, bis eine Linie sie in zwei Hälften teilt.', 'A silent hall of ice and old stone, until a line splits it in two.'),
          colors: ['#2b3446', '#5d6b82', '#a9bad0', '#e6eef7', '#c9a24e'],
        },
        {
          name: S('Die Nadel', 'The Needle'),
          desc: S('Eine gewaltige Eisspitze über einer tiefen Schlucht, Nivaris um sie gewunden.', 'A huge spire of ice above a deep canyon, with Nivaris coiled around it.'),
          colors: ['#7fa3c8', '#a9c9e6', '#d2e4f4', '#f8f9fb', '#4f5663'],
        },
        {
          name: S('Das Herz des Gletschers', 'The Heart of the Glacier'),
          desc: S('Tief im Eis, wo weißes Licht und blaue Resonanz den Takt vorgeben.', 'Deep in the ice, where white light and blue resonance set the rhythm.'),
          colors: ['#0e1a2e', '#24497a', '#4ee0f5', '#c4fbff', '#ffffff'],
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
