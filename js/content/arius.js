// HHA Arius – The White Blade: Inhalte der Mod-Seite (Quelle: vibec-studios/hha-arius, Version 1.6.2, Stand 18.11.2026).
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
  version: '1.6.2',
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
    S('Ein Duell in fünf Akten im Schneesturm, filmisch inszeniert vom Klingengrab bis zum Hochlandfeld', 'A duel in five acts in a snowstorm, staged like a film from the Blade Grave to the highland field'),
    S('Solvane: Das Schwert wird zur Drachin und windet sich um den Gipfel eines Felshorns', 'Solvane: the sword becomes a dragon and coils around the summit of a rock horn'),
    S('Der Schnitt: Arius lädt eine riesige Lichtklinge auf und spaltet damit einen Berg der Länge nach', 'The Cut: Arius charges a giant blade of light and splits a mountain lengthwise with it'),
    S('Die Drachenherz-Wacht, Solvane, Kampfhandschuhe mit Zauberrad und der Frostspeicher', 'The Dragonheart Watch, Solvane, gauntlets with a spell wheel and the Frost Bank'),
  ],
  sections: [
    // ------------------------------------------------------------------ Changelog (neueste Version zuerst, ältere aufklappbar)
    {
      type: 'changes', id: 'neu', toc: S('Neu in 1.6', 'New in 1.6'), title: S('Neu in 1.6', 'New in 1.6'),
      lead: S('Der Schnitt spaltet jetzt einen Berg, Solvane kämpft in der Luft, über allem liegt ein Wolkenmeer, und das erste Anlegen der Ausrüstung läuft ohne Ruckeln.', 'The Cut now splits a mountain, Solvane fights in the air, a sea of clouds lies over everything, and putting on the gear for the first time no longer stutters.'),
      versions: [{
        version: '1.6.2',
        groups: [
          {
            name: S('Fehlerbehebungen', 'Fixes'),
            items: [
              S('Handschuhe in der Ego-Sicht: flimmernde, gestreifte Texturen behoben.', 'Gauntlets in first person: flickering, striped textures fixed.'),
              S('Das Abklingzeit-Icon der Hose zeigt jetzt den Drachenschweif.', 'The leggings’ cooldown icon now shows Dragon Tail.'),
            ],
          },
        ],
      }, {
        version: '1.6.1', open: true,
        groups: [
          {
            name: S('Leistung', 'Performance'),
            items: [
              S('Kein Ruckeln und keine hakenden Sounds mehr, wenn man das Rüstungs-Kit bekommt oder die Ausrüstung zum ersten Mal anlegt bzw. in die Hand nimmt. Modelle und Texturen werden beim Betreten der Welt vorgeladen, Soundeffekte schon beim Laden der Ressourcen.', 'No more stutter or hitching sounds when you receive the armor kit or put on or pick up the gear for the first time. Models and textures are preloaded when you enter the world, sound effects as soon as resources load.'),
            ],
          },
        ],
      }, {
        version: '1.6.0', open: true,
        groups: [
          {
            name: S('Duell', 'Duel'),
            items: [
              S('Der Schnitt: Arius lädt eine riesige Lichtklinge auf und spaltet damit den Berg im Süden der Länge nach. Das Heiligtum wird nicht mehr geteilt.', 'The Cut: Arius charges a giant blade of light and splits the mountain in the south lengthwise. The Sanctum is no longer cut in two.'),
              S('Solvane bewegt sich fließend, dringt nicht mehr in Wände ein und hat bessere Hitboxen.', 'Solvane moves fluidly, no longer clips through walls and has better hitboxes.'),
              S('Luftkampf im Stil von Kang-Jin Loong: Himmelssturz mit Eisdornenringen, Eisregen und Tiefflug.', 'Air combat in the style of Kang-Jin Loong: sky dive with rings of ice thorns, ice rain and low flight.'),
              S('Cutscenes: Die Kamera landet nie mehr im Berg.', 'Cutscenes: the camera never ends up inside the mountain anymore.'),
            ],
          },
          {
            name: S('Welt', 'World'),
            items: [
              S('Der Berg ist viel größer, mit einem Kletterweg aus 27 Felsstufen mit Ranken, etwa drei Umläufe.', 'The mountain is much bigger, with a climbing path of 27 rock steps with vines, about three loops.'),
              S('Am Horizont liegt ein Wolkenmeer, wie ein Schlachtfeld über den Wolken.', 'A sea of clouds lies on the horizon, like a battlefield above the clouds.'),
            ],
          },
          {
            name: S('Ausrüstung', 'Gear'),
            items: [
              S('Der Eispanzer funktioniert richtig.', 'Ice Armor works properly.'),
              S('Der Wirbelsturm ist deutlich größer.', 'The tornado is much bigger.'),
              S('Weißes Loch im Gargantua-Stil.', 'White Hole in the style of Gargantua.'),
              S('Neues Icon für den Drachenschweif.', 'New icon for Dragon Tail.'),
            ],
          },
        ],
      }, {
        version: '1.5.0',
        groups: [
        {
          name: S('Welt', 'World'),
          items: [
            S('Die Arena ist ein endloses Schneefeld ohne ansteigende Ränder.', 'The arena is an endless snowfield without rising edges.'),
            S('Ein riesiges Bergmassiv mit einem Spiralweg von rund 650 Blöcken, gesäumt von Laternen, bis zur Schulter, darüber das Felshorn.', 'A huge mountain massif with a spiral path of about 650 blocks, lined with lanterns, up to its shoulder, the rock horn above.'),
            S('Phase I spielt im Klingengrab, einer offenen Terrasse mit Steinklingen und der großen Ordensklinge hinter dem Thron. Den Kuppeltempel gibt es nicht mehr.', 'Phase I takes place in the Blade Grave, an open terrace with stone blades and the great order blade behind the throne. The domed temple is gone.'),
            S('Von Phase II zu III ohne Einsturz: Solvane trägt alle aufs Feld.', 'From phase II to III without a collapse: Solvane carries everyone to the field.'),
          ],
        },
        {
          name: S('Kampf', 'Fight'),
          items: [
            S('Das QTE funktioniert.', 'The QTE works.'),
            S('Der Drachenkörper knickt und faltet sich nicht mehr.', 'The dragon’s body no longer kinks or folds.'),
            S('Arius hat neue Haare und einen neuen Kopf.', 'Arius has new hair and a new head.'),
          ],
        },
        {
          name: S('Ausrüstung', 'Gear'),
          items: [
            S('Drachenatem: Solvanes Geisterkopf speit Frost.', 'Dragon Breath: Solvane’s ghostly head breathes frost.'),
            S('Der Drachenschweif ersetzt den Schwingensprung.', 'Dragon Tail replaces Wing Leap.'),
            S('Weißes Loch neu gebaut, die Yang-Kugel wirkt lebendig.', 'White Hole rebuilt, the Yang orb feels alive.'),
            S('Die Yang-Brücke ist eine Bogenbrücke aus Yang-Licht, Länge (bis 50) und Breite per Mausrad.', 'The Yang bridge is an arched bridge of Yang light, length (up to 50) and width by mouse wheel.'),
            S('Neue Icons für Solvane und die Handschuhe, schlankeres Handschuhmodell.', 'New icons for Solvane and the gauntlets, a slimmer gauntlet model.'),
          ],
        },
        {
          name: S('Frostspeicher und Baupläne', 'Frost Bank and blueprints'),
          items: [
            S('Der Frostspeicher sammelt Resonanz aus Kills, auch an der Mobfarm, und aus Überschuss.', 'The Frost Bank collects resonance from kills, mob farms included, and from surplus.'),
            S('Litematica-Baupläne: <code>.litematic</code>-Dateien lassen sich mit Resonanz aus dem Frostspeicher in echten Blöcken bauen (<code>/ariusc schematic …</code>).', 'Litematica blueprints: <code>.litematic</code> files can be built in real blocks with resonance from the Frost Bank (<code>/ariusc schematic …</code>).'),
          ],
        },
        ],
      }],
    },

    // ------------------------------------------------------------------ Trailer (Gameplay, HHA_Arius/tmp/trailer/out)
    {
      type: 'video', id: 'trailer', toc: S('Trailer', 'Trailer'), title: S('Das Duell in Bewegung', 'The duel in motion'),
      lead: S('Aufnahmen aus einer früheren Version: Arius im Tempel, deine Ausrüstung im Einsatz und Solvane, die sich als weißer Drache um den Gipfel windet.',
        'Footage from an earlier version: Arius in the temple, your gear in action and Solvane coiling around the summit as a white dragon.'),
      webm: 'video/trailer.webm', mp4: 'video/trailer.mp4', poster: 'video/trailer-poster.webp',
      label: S('Gameplay-Trailer von HHA Arius', 'HHA Arius gameplay trailer'),
      // Musik ist CC0 (keine Namensnennung nötig), die Zeile ist eine freiwillige Geste
      credit: S('Musik: „Fall of Nightmares“ und „Production Theme Intro“ von nene (Stimmen: Helena Kesti, Matias Lindgren), „Cinematic percussion loop“ von Marwan Antonios, alle CC0 via <a href="https://opengameart.org/content/fall-of-nightmares-epic-orchestral" target="_blank" rel="noopener">OpenGameArt</a>',
        'Music: “Fall of Nightmares” and “Production Theme Intro” by nene (vocals: Helena Kesti, Matias Lindgren), “Cinematic percussion loop” by Marwan Antonios, all CC0 via <a href="https://opengameart.org/content/fall-of-nightmares-epic-orchestral" target="_blank" rel="noopener">OpenGameArt</a>'),
    },

    // ------------------------------------------------------------------ Leaks / Gameplay (echte Aufnahmen aus v1.4.1,
    // Quelle HHA_Arius/tmp/shots/leaks, als WebP unter leaks/ und leaks/thumb/; Reihenfolge wie captions.tsv)
    {
      type: 'leaks', id: 'leaks', toc: S('Leaks / Gameplay', 'Leaks / Gameplay'), title: S('Leaks aus dem Spiel', 'Leaks from the game'),
      lead: S('Schauplätze, Arius’ Formen, der Bosskampf, die Rüstung und alle Fähigkeiten, so wie sie im Spiel aussehen. Klicken zum Vergrößern.',
        'Locations, Arius’ forms, the boss fight, the armor and every ability, just as they look in game. Click to enlarge.'),
      badge: S('Echte Ingame-Aufnahmen aus v1.4.1 · offener Schneesturm · Testmodus · neue Aufnahmen von 1.5.0 folgen', 'Real in-game captures from v1.4.1 · open snowstorm · test mode · new captures from 1.5.0 to follow'),
      oldLabel: S('Frühere Version', 'Earlier version'),
      dir: 'leaks',
      groups: [
        {
          name: S('Schauplätze', 'Locations'),
          items: [
            { img: '01-landschaft-totale', name: S('Die Hochebene im Schneesturm mit dem Felshorn', 'The high plateau in the snowstorm with the rock horn') },
            { img: '02-felshorn', name: S('Das Felshorn: Grate, Gesteinsschichten, Eisrinnen', 'The rock horn: ridges, rock strata, ice gullies') },
            { img: '03-heiligtum-aussen', old: true, name: S('Heiligtum der Weißen Klinge von außen', 'The Sanctum of the White Blade from outside') },
            { img: '04-heiligtum-innen', old: true, name: S('Die Säulenhalle zum Thron', 'The pillared hall leading to the throne') },
            { img: '05-plateau', name: S('Das Plateau mit Obelisken und Ruinenbogen', 'The plateau with obelisks and a ruined arch') },
            { img: '06-hochland', name: S('Das offene Hochland ab dem Drachenkampf', 'The open highland from the dragon fight on') },
          ],
        },
        {
          name: S('Arius’ Formen', 'Arius’ forms'),
          items: [
            { img: '07-arius-dunkel', name: S('Arius in seiner dunklen Form', 'Arius in his dark form') },
            { img: '08-arius-ernst', name: S('Arius, ernste Form', 'Arius, serious form') },
            { img: '09-arius-weiss', name: S('Arius, Erbe des Weißen Drachen', 'Arius, Heir of the White Dragon') },
          ],
        },
        {
          name: S('Bosskampf: Phase I, Solvane, Phase III und Finale', 'Boss fight: phase I, Solvane, phase III and finale'),
          items: [
            { img: '10-einzug', old: true, name: S('Einzug in die Halle', 'Entering the hall') },
            { img: '11-phase1-bannkreis', old: true, name: S('Phase I: Arius’ goldener Bannkreis', 'Phase I: Arius’ golden binding circle') },
            { img: '12-phase1-schlagabtausch', old: true, name: S('Phase I: Schlagabtausch im Heiligtum', 'Phase I: trading blows in the Sanctum') },
            { img: '13-phase1-klingenbogen', old: true, name: S('Klingenbogen im Bannkreis', 'Blade arc in the binding circle') },
            { img: '14-solvane-auftritt', name: S('Solvane, das Schwert in Drachenform', 'Solvane, the sword in dragon form') },
            { img: '15-solvane-am-horn', name: S('Solvane windet sich um das Felshorn', 'Solvane coils around the rock horn') },
            { img: '16-solvane-ruf', name: S('Arius ruft Solvane', 'Arius calls Solvane') },
            { img: '17-solvane-ueber-dem-heiligtum', name: S('Solvane über dem Heiligtum', 'Solvane above the Sanctum') },
            { img: '18-phase3-klingenprall', name: S('Phase III auf dem Hochland: Klingenprall', 'Phase III on the highland: blade clash') },
            { img: '18b-hochlandfeld', name: S('Das Feld für Phase III und das Finale', 'The field for phase III and the finale') },
            { img: '19-phase3-hochland', name: S('Phase III: Das offene Feld', 'Phase III: the open field') },
            { img: '20-finale', name: S('Finale im Schneesturm', 'Finale in the snowstorm') },
            { img: '21-ende', name: S('Nach dem Kampf', 'After the fight') },
          ],
        },
        {
          name: S('Rüstung', 'Armor'),
          items: [
            { img: '22-ruestung', name: S('Drachenherz-Wacht, die Rüstung', 'The Dragonheart Watch, the armor') },
            { img: '23-ruestung-nah', name: S('Rüstung und Solvane aus der Nähe', 'Armor and Solvane up close') },
          ],
        },
        {
          name: S('Handschuh- und Rüstungsfähigkeiten', 'Gauntlet and armor abilities'),
          items: [
            { img: '24-zauberrad', name: S('Das Zauberrad der Handschuhe', 'The gauntlets’ spell wheel') },
            { img: '25-klarer-schnitt', name: S('Klarer Schnitt', 'Clear Cut') },
            { img: '26-windklinge', name: S('Windklinge', 'Wind Blade') },
            { img: '27-frostsplitter', name: S('Frostsplitter', 'Frost Shards') },
            { img: '28-gletscherlanze', name: S('Gletscherlanze', 'Glacier Lance') },
            { img: '29-wirbelsturm', old: true, name: S('Wirbelsturm', 'Tornado') },
            { img: '30-eiswand', name: S('Eiswand', 'Ice Wall') },
            { img: '31-eisplattform', name: S('Eisplattform', 'Ice Platform') },
            { img: '32-yang-bruecke', old: true, name: S('Yang-Brücke', 'Yang Bridge') },
            { img: '33-gleiten', name: S('Gleiten über dem Heiligtum', 'Gliding above the Sanctum') },
            { img: '34-drachenatem', name: S('Brustpanzer: Drachenatem', 'Chestplate: Dragon Breath') },
            { img: '35-schwingensprung', old: true, name: S('Beinschutz: Schwingensprung', 'Leggings: Wing Leap') },
            { img: '36-weisses-loch', old: true, name: S('Setfähigkeit: Weißes Loch', 'Set ability: White Hole') },
            { img: '37-yang-kugel', old: true, name: S('Yang-Kugel, jetzt weiß', 'Yang orb, now white') },
            { img: '38-boe', name: S('Böe', 'Gust') },
            { img: '39-windzug', name: S('Windzug', 'Wind Pull') },
          ],
        },
      ],
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
        { tex: 'frost_bank', name: S('Frostspeicher', 'Frost Bank') },
      ],
    },

    // ------------------------------------------------------------------ Fähigkeiten
    {
      type: 'abilities',
      title: S('Fähigkeiten', 'Abilities'),
      items: [
        {
          name: S('Drachenatem', 'Dragon Breath'), icon: 'hud/dragon_breath.png',
          desc: S('Solvanes Geisterkopf erscheint über dir und speit einen Kegel aus Frost.', 'Solvane’s ghostly head appears above you and breathes a cone of frost.'),
        },
        {
          name: S('Drachenschweif', 'Dragon Tail'), icon: 'hud/dragon_tail.png',
          desc: S('Solvanes Geisterschwanz peitscht einmal um dich herum.', 'Solvane’s ghostly tail whips once around you.'),
        },
        {
          name: S('Weißes Loch', 'White Hole'), icon: 'hud/art_white_hole.png',
          desc: S('Mit vollem Set öffnest du ein weißes Loch im Gargantua-Stil: Es reißt Blöcke aus dem Boden, lässt sie kreisen und schleudert sie beim Kollaps davon.', 'With the full set you open a Gargantua-style white hole: it tears blocks out of the ground, spins them around and hurls them away as it collapses.'),
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
          desc: S('Windklingen, Sturmstöße, ein großer, wandernder Wirbelsturm und Sprünge, die dich hoch und weit tragen.', 'Wind blades, gusts, a huge roaming tornado and leaps that carry you high and far.'),
        },
        {
          name: S('Eis', 'Ice'), icon: 'hud/art_glacier_lance.png',
          desc: S('Frostsplitter, Eiswände, eine Gletscherlanze und ein Panzer aus Eis, der Treffer abfängt.', 'Frost shards, ice walls, a glacier lance and a shell of ice that catches hits.'),
        },
        {
          name: S('Yang', 'Yang'), icon: 'hud/art_school_yang.png',
          desc: S('Weißes Licht als Werkzeug: eine lebendige Yang-Kugel, eine Bogenbrücke aus Yang-Licht, deren Länge und Breite du per Mausrad einstellst, dazu Plattformen, ein Schild und ein Gleiter.', 'White light as a tool: a living Yang orb, an arched bridge of Yang light whose length and width you set with the mouse wheel, plus platforms, a shield and a glider.'),
        },
        {
          name: S('Frostresonanz', 'Frost resonance'), icon: null,
          desc: S('Rüstung, Handschuhe und Solvane teilen sich eine Kraft, die nur durch gutes Kämpfen wächst.', 'Armor, gauntlets and Solvane share one power that only grows when you fight well.'),
        },
        {
          name: S('Frostspeicher', 'Frost Bank'), icon: 'item/frost_bank.png',
          desc: S('Eine Manabank: Sie sammelt Resonanz aus Kills, auch an der Mobfarm, und aus Überschuss, und du ziehst sie bei Bedarf wieder heraus.', 'A mana bank: it collects resonance from kills, mob farms included, and from surplus, and you draw it back out when you need it.'),
        },
        {
          name: S('Baupläne', 'Blueprints'), icon: null,
          desc: S('Litematica-Dateien als echte Blöcke bauen, bezahlt mit Resonanz aus dem Frostspeicher. Vorher zeigt ein Umriss, was entsteht.', 'Build Litematica files as real blocks, paid for with resonance from the Frost Bank. An outline shows what will appear first.'),
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
          sub: S('Das Klingengrab', 'The Blade Grave'),
          color: '#6cc4ff',
          segments: 2,
          desc: S(
            'Ein Schwertkämpfer mit lesbaren Haltungen, Windschritten und einer Parade, die gierige Angriffe bestraft. Lässt er die Klinge los, wirbelt sie allein durch die Luft und jagt dich, während er mit Tritten nachsetzt.',
            'A swordsman with readable stances, wind steps and a parry that punishes greedy attacks. When he lets go of his blade, it whirls through the air on its own and hunts you while he follows up with kicks.',
          ),
          trick: S(
            'Nicht immer dasselbe tun: Er passt sich an wiederholte Taktiken an.',
            'Don’t repeat yourself: he adapts to tactics you use again and again.',
          ),
          where: S(
            'Im Klingengrab, einer offenen Terrasse mit Steinklingen und der großen Ordensklinge hinter dem Thron, gerufen mit dem Siegel der Weißen Klinge in einem kalten Biom.',
            'In the Blade Grave, an open terrace with stone blades and the great order blade behind the throne, called with the Seal of the White Blade in a cold biome.',
          ),
          loot: S('Am Ende des Duells: Solvane, die Kampfhandschuhe, Herzfrost und die Schmiedevorlage Drachenherz.', 'At the end of the duel: Solvane, the gauntlets, Heartfrost and the Dragonheart smithing template.'),
          phases: [
            { name: S('I · Das Klingengrab', 'I · The Blade Grave'), desc: S('Arius allein im Schneesturm: Schwertkombos, Klingenflug, Frostdornen aus dem Boden und Frostwände, die Fluchtwege schließen.', 'Arius alone in the snowstorm: sword combos, the flying blade, frost thorns from the ground and frost walls that close escape routes.') },
            { name: S('II · Der Schnitt', 'II · The Cut'), desc: S('Arius lädt eine riesige Lichtklinge auf und spaltet damit den Berg im Süden der Länge nach. Danach trägt Solvane alle aufs Feld.', 'Arius charges a giant blade of light and splits the mountain in the south lengthwise. Then Solvane carries everyone to the field.') },
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
            'Arius lässt sein Schwert los, und es wird zu dem, was es einmal war: eine uralte weiße Drachin, gewunden um den Gipfel eines Felshorns. Sie kämpft aus der Luft, ihr langer Körper fließt in weiten Bögen über das Feld, und Arius sieht ohne Klinge zu.',
            'Arius lets go of his sword, and it becomes what it once was: an ancient white dragon coiled around the summit of a rock horn. She fights from the air, her long body flowing over the field in wide arcs, and Arius watches without a blade.',
          ),
          trick: S(
            'Lock ihren Sturzflug in einen Eisgrat, dann liegt sie am Boden. Treffer an die Kehle ersticken ihren Atem.',
            'Lure her dive into an ice ridge to bring her down. Hits to the throat choke her breath.',
          ),
          where: S('Auf dem endlosen Schneefeld unter dem Bergmassiv, wohin sie alle aus dem Klingengrab trägt.', 'On the endless snowfield below the mountain massif, where she carries everyone from the Blade Grave.'),
          loot: S('Schuppen des weißen Drachen, aus denen Solvanes Schwingenschuppe wird.', 'White dragon scales, which become Solvane’s Wingscale.'),
          phases: [
            { name: S('III · Die Gletscherschwelle', 'III · The Glacier Threshold'), desc: S('Solvane allein im Luftkampf: Himmelsstürze mit Eisdornenringen, Eisregen, Tiefflüge, Eisatem und harte Landungen, die du bestrafen kannst.', 'Solvane alone in an air fight: sky dives with rings of ice thorns, ice rain, low flights, ice breath and hard landings you can punish.') },
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
          sub: S('Das Hochlandfeld', 'The Highland Field'),
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
          where: S('Auf dem Hochlandfeld, einem endlosen, ebenen Schneefeld mit dem Bergmassiv im Rücken und einem Wolkenmeer am Horizont.', 'On the highland field, an endless, flat snowfield with the mountain massif behind it and a sea of clouds on the horizon.'),
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
          name: S('Das Klingengrab', 'The Blade Grave'),
          desc: S('Eine offene Terrasse mit Steinklingen und der großen Ordensklinge hinter dem Thron. Hier beginnt das Duell.', 'An open terrace with stone blades and the great order blade behind the throne. This is where the duel begins.'),
          colors: ['#2b3446', '#5d6b82', '#a9bad0', '#e6eef7', '#c9a24e'],
        },
        {
          name: S('Bergmassiv und Felshorn', 'Mountain massif and rock horn'),
          desc: S('Ein gewaltiges Bergmassiv mit einem Kletterweg aus Felsstufen und Ranken, der sich etwa dreimal um den Berg windet, darüber das Felshorn. Im Duell spaltet Arius es mit dem Schnitt der Länge nach.', 'A massive mountain with a climbing path of rock steps and vines that winds around it about three times, the rock horn above. In the duel Arius splits it lengthwise with the Cut.'),
          colors: ['#4a4e57', '#6d717a', '#9a9ea6', '#e9eef4', '#a9c9e6'],
        },
        {
          name: S('Das Hochlandfeld', 'The Highland Field'),
          desc: S('Ein endloses, ebenes Schneefeld, dahinter das Bergmassiv und am Horizont ein Wolkenmeer, wie ein Schlachtfeld über den Wolken. Hier fällt die Entscheidung.', 'An endless, flat snowfield, the mountain massif behind it and a sea of clouds on the horizon, like a battlefield above the clouds. This is where it ends.'),
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
