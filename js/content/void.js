// HHA Void: Inhalte aus dem Quellcode von vibec-studios/HHA_void (Stand 59da0fd, Version 0.0.1).
// Zahlen stammen aus den Config-Defaults (VoidAddon.registerConfig) und den Konstanten im Code.
export default {
  id: 'void',
  name: 'HHA Void',
  short: {
    de: 'Void-Rüstung mit schwarzem Loch, Meteoren und Teleports, dazu Vael, der Letzte Gläubiger, als Endboss in vier Phasen.',
    en: 'Void armor with a black hole, meteors and teleports, plus Vael, the Last Creditor, as a four-phase End boss.',
  },
  tagline: {
    de: 'Alles, was ist, hat sich vom Nichts geliehen.',
    en: 'Everything that is has borrowed from the void.',
  },
  accent: '#924cff',
  accent2: '#d082ff',
  version: '0.0.1',
  mc: '1.21.11',
  loader: 'Fabric',
  requires: ['H&H Armors ≥ 0.6.0', 'Fabric API', 'Fabric Language Kotlin'],
  status: { de: 'In Entwicklung', en: 'In development' },
  source: null,
  hero: { kind: 'boss', model: 'void_boss' },
  intro: {
    de: 'HHA Void ist ein Addon für H&H Armors. Es bringt ein Rüstungsset aus dem Nichts mit Teleports, zielsuchenden Meteoren und einem echten schwarzen Loch als Ultra-Fähigkeit. Dazu kommt Vael, der Letzte Gläubiger: ein Koloss, der in einem schwebenden Gerichtssaal im End wartet, um die Schuld allen Lebens einzutreiben. Sein Kampf hat vier Phasen, eigene Cutscenes und eine Schuld-Mechanik, die dich zum Angreifen zwingt.',
    en: 'HHA Void is an add-on for H&H Armors. It adds an armor set made of nothing, with teleports, homing meteors and a real black hole as its ultra ability. On top of that comes Vael, the Last Creditor: a colossus waiting in a floating courtroom in the End to collect the debt of all life. His fight has four phases, its own cutscenes and a debt mechanic that forces you to keep attacking.',
  },
  highlights: [
    { de: 'Vier Rüstungsteile, Schwert und Mace mit sechs aktiven Fähigkeiten', en: 'Four armor pieces, a sword and a mace with six active abilities' },
    { de: 'Void Collapse: ein schwarzes Loch mit echter Lichtablenkung', en: 'Void Collapse: a black hole that really bends light' },
    { de: 'Vael, der Letzte Gläubiger: vier Phasen, 13 Angriffe und ein falscher Tod', en: 'Vael, the Last Creditor: four phases, 13 attacks and a false death' },
    { de: 'Schuld-System: Wer nicht zurückschlägt, zahlt', en: 'Debt system: if you do not hit back, you pay' },
    { de: 'Filmkamera-Cutscenes und ein Himmel, der aufreißt', en: 'Cinematic cutscenes and a sky that tears open' },
    { de: 'Das Tribunal: eine schwebende Arena über den End-Inseln', en: 'The Tribunal: a floating arena above the End islands' },
  ],
  sections: [
    // ------------------------------------------------------------------ Rüstung und Waffen
    {
      type: 'armor',
      title: { de: 'Void’s Armor', en: 'Void\'s Armor' },
      lead: {
        de: 'Vier Rüstungsteile und zwei Waffen, alle feuerfest und episch. Die Lore im Spiel zeigt deine echten Tasten und die aktuellen Config-Werte; hier stehen die Standardwerte mit Standardtasten.',
        en: 'Four armor pieces and two weapons, all fireproof and epic. The in-game lore shows your real key bindings and the current config values; this page shows the defaults with default keys.',
      },
      armor: 'void',
      items: [
        {
          tex: 'void_helmet', frames: 3,
          name: { de: 'Void-Helm', en: 'Void Helmet' },
          lore: [
            { de: 'Regeneration I', en: 'Regeneration I' },
            { set: true, de: 'Kind der Nacht: nachts und im End Unsichtbarkeit, Nachtsicht, Regeneration', en: 'Child of the Night: at night and in the End invisibility, night vision, regeneration' },
            { set: true, de: 'Notriss: unter 3 Herzen Teleport von allen weg + Full-Invis 30s (60s Abklingzeit)', en: 'Emergency Rift: below 3 hearts teleport away from everyone + full invis 30s (60s cooldown)' },
            { set: true, de: 'Full-Invis: Unsichtbarkeit versteckt auch deine Rüstung', en: 'Full Invis: invisibility hides your armor too' },
          ],
        },
        {
          tex: 'void_chestplate', frames: 3,
          name: { de: 'Void-Brustplatte', en: 'Void Chestplate' },
          lore: [
            { de: 'Feuerresistenz', en: 'Fire Resistance' },
            { de: 'Meteor Strike [G]: zielsuchende Meteore + Void-Komet (35s Abklingzeit)', en: 'Meteor Strike [G]: homing meteors + void comet (35s cooldown)' },
            { set: true, de: 'Void Link: jeder Treffer springt mit 1/3 bis 3/3 Stärke auf die Verbündeten des Ziels über', en: 'Void Link: every hit arcs at 1/3 to 3/3 strength to the target’s allies' },
            { set: true, de: 'Void Collapse [U]: saugt alle Gegner in 40 Blöcken an, schleudert sie hoch und schmettert sie nieder; du bekommst Stärke + Unsichtbarkeit (120s Abklingzeit)', en: 'Void Collapse [U]: drags every enemy within 40 blocks in, flings them up and slams them down; you gain Strength + Invisibility (120s cooldown)' },
          ],
        },
        {
          tex: 'void_leggings', frames: 3,
          name: { de: 'Void-Beinschutz', en: 'Void Leggings' },
          lore: [
            { de: 'Void Pounce [H]: Teleport über das schwächste Wesen in 12 Blöcken + Schub nach oben (10s Abklingzeit)', en: 'Void Pounce [H]: teleport above the weakest creature within 12 blocks + upward boost (10s cooldown)' },
            { set: true, de: 'Geteilte Gaben: deine positiven Effekte springen auf Trusted in 70 Blöcken über', en: 'Shared Gifts: your positive effects arc to trusted players within 70 blocks' },
            { set: true, de: 'Der Void fängt dich: ein Sturz ins Void teleportiert dich zum Spawnpunkt statt dich zu töten', en: 'The Void catches you: falling into the void teleports you to your spawn point instead of killing you' },
          ],
        },
        {
          tex: 'void_boots', frames: 3,
          name: { de: 'Void-Stiefel', en: 'Void Boots' },
          lore: [
            { de: 'Kein Fallschaden', en: 'No fall damage' },
            { de: 'Geschwindigkeit I', en: 'Speed I' },
            { de: 'Void Step [2× Leertaste]: Teleport in Blickrichtung durch Wände (8 Blöcke), nie abwärts (4s Abklingzeit)', en: 'Void Step [2× Space]: teleport where you look, through walls (8 blocks), never downward (4s cooldown)' },
          ],
        },
        {
          tex: 'void_sword', frames: 3,
          name: { de: 'Void Sword', en: 'Void Sword' },
          lore: [
            { de: '9 Schaden', en: '9 damage' },
            { de: 'Void Shards [Rechte Maustaste]: wirft einen von 6 kreisenden Splittern; er springt von Gegner zu Gegner und kommt zurück, 7 Schaden pro Treffer', en: 'Void Shards [Right Button]: throws one of 6 orbiting shards; it jumps from enemy to enemy and returns, 7 damage per hit' },
          ],
        },
        {
          tex: 'void_mace', frames: 3,
          name: { de: 'Void Mace', en: 'Void Mace' },
          lore: [
            { de: 'Sky Launch [Rechte Maustaste]: die Mace reißt dich in den Himmel (8s Abklingzeit)', en: 'Sky Launch [Right Button]: the mace hurls you skyward (8s cooldown)' },
            { de: 'Danach Schockwelle: der nächste Mace-Hit trifft alle Gegner in 6 Blöcken mit vollem Schaden', en: 'Then shockwave: your next mace hit strikes all enemies within 6 blocks at full damage' },
          ],
        },
        {
          tex: 'void_ingot', frames: 1,
          name: { de: 'Void-Barren', en: 'Void Ingot' },
          lore: [],
        },
      ],
      showcase: ['void_sword', 'void_mace', 'void_ingot'],
    },

    // ------------------------------------------------------------------ Aktive Fähigkeiten
    {
      type: 'abilities',
      title: { de: 'Fähigkeiten', en: 'Abilities' },
      lead: {
        de: 'Jedes Teil bringt eine eigene Fähigkeit mit. Die Abklingzeiten erscheinen in der Cooldown-Leiste von H&H Armors. Fähigkeiten, die ein Ziel brauchen, verbrauchen ohne Ziel keine Abklingzeit („Kein Ziel in Reichweite“).',
        en: 'Every piece brings its own ability. Cooldowns show up in the H&H Armors cooldown bar. Abilities that need a target cost no cooldown when nothing is in range (“No target in range”).',
      },
      items: [
        {
          name: { de: 'Meteor Strike (Brustplatte)', en: 'Meteor Strike (Chestplate)' },
          key: 'Ability 1', icon: 'hud/meteor.png',
          desc: {
            de: 'Ruft 12 Meteore auf alle Gegner in 24 Blöcken herab, einer alle 0,15 s. Jeder dritte ist ein großer Brocken, der beim Einschlag explodiert. Die Meteore korrigieren jeden Tick ihre Flugbahn und verfolgen ihr Ziel. Zum Schluss erscheint über dem Gegner mit den meisten Leben eine Void-Säule, 0,9 s später schlägt der Void-Komet ein: 16 Schaden (8 Herzen) im Umkreis von 4,5 Blöcken, 4 s Feuer und Rückstoß. In der Nähe von Vael sprengen die Explosionen keine Blöcke.',
            en: 'Calls 12 meteors down on every enemy within 24 blocks, one every 0.15 s. Every third one is a big rock that explodes on impact. The meteors correct their course every tick and chase their target. To finish, a void pillar appears above the enemy with the most health and 0.9 s later the void comet hits: 16 damage (8 hearts) within 4.5 blocks, 4 s of fire and knockback. Near Vael the explosions do not break blocks.',
          },
          stats: [
            { k: { de: 'Reichweite', en: 'Range' }, v: '24' },
            { k: { de: 'Meteore', en: 'Meteors' }, v: '12' },
            { k: { de: 'Explosionsstärke', en: 'Explosion power' }, v: '2' },
            { k: { de: 'Komet', en: 'Comet' }, v: '16' },
            { k: { de: 'Abklingzeit', en: 'Cooldown' }, v: '35 s' },
          ],
        },
        {
          name: { de: 'Void Pounce (Beinschutz)', en: 'Void Pounce (Leggings)' },
          key: 'Ability 2', icon: 'hud/pounce.png',
          desc: {
            de: 'Teleportiert dich 5 Blöcke über das Wesen mit den wenigsten Leben im Umkreis von 12 Blöcken. Ist dort kein Platz, geht es Block für Block tiefer, mindestens 2 Blöcke. Du bekommst einen kleinen Schub nach oben, blickst direkt auf das Ziel und hast mehr Fallhöhe für einen Mace-Smash. An Start und Ziel öffnet sich ein Void-Portal.',
            en: 'Teleports you 5 blocks above the creature with the least health within 12 blocks. If there is no room, it tries one block lower at a time, down to 2 blocks. You get a small upward boost, look straight at the target and gain extra height for a mace smash. A void portal opens at both ends.',
          },
          stats: [
            { k: { de: 'Radius', en: 'Radius' }, v: '12' },
            { k: { de: 'Höhe über dem Ziel', en: 'Height above target' }, v: '5' },
            { k: { de: 'Abklingzeit', en: 'Cooldown' }, v: '10 s' },
          ],
        },
        {
          name: { de: 'Void Step (Stiefel)', en: 'Void Step (Boots)' },
          key: null, icon: 'hud/dash.png',
          desc: {
            de: 'Zweimal kurz hintereinander springen (innerhalb von 0,35 s): Du teleportierst dich bis zu 8 Blöcke in Blickrichtung, auch durch Wände, und bekommst Schwung nach vorn. Abwärts geht es nie; schaust du nach unten, bleibt der Teleport auf Starthöhe. Funktioniert nicht beim Fliegen und Reiten.',
            en: 'Tap jump twice quickly (within 0.35 s): you teleport up to 8 blocks where you look, even through walls, and get a forward boost. It never goes downward; if you look down, the teleport stays at your starting height. Does not work while flying or riding.',
          },
          stats: [
            { k: { de: 'Sprungtaste', en: 'Jump key' }, v: '2×' },
            { k: { de: 'Reichweite', en: 'Range' }, v: '8' },
            { k: { de: 'Abklingzeit', en: 'Cooldown' }, v: '4 s' },
          ],
        },
        {
          name: { de: 'Void Collapse (volles Set)', en: 'Void Collapse (full set)' },
          key: 'Ability 3', icon: 'hud/collapse.png',
          desc: {
            de: 'Mit vollem Set ersetzt der Void Collapse die Ultra-Fähigkeit von H&H Armors. Sechs Blöcke über dir öffnet sich ein schwarzes Loch. Alle Gegner in 40 Blöcken werden langsam und unaufhaltsam zu der Stelle gesogen, an der du ihn ausgelöst hast, bis zu 6 s lang, blind und mit 2,5 Schaden pro Sekunde. Dann fliegen sie hoch ins Loch und werden zu Boden geschmettert: 15 Schaden plus Fallschaden aus 16 zusätzlichen Blöcken, danach 5 s Langsamkeit IV und Schwäche sowie 6 s Blindheit. Du bekommst 30 s Stärke I und 60 s Unsichtbarkeit.',
            en: 'With the full set, Void Collapse replaces the H&H Armors ultra ability. A black hole opens six blocks above you. Every enemy within 40 blocks is slowly and unstoppably dragged to the spot where you cast it for up to 6 s, blinded and taking 2.5 damage per second. Then they are flung up into the hole and slammed into the ground: 15 damage plus fall damage from 16 extra blocks, followed by 5 s of Slowness IV and Weakness and 6 s of Blindness. You gain 30 s of Strength I and 60 s of Invisibility.',
          },
          stats: [
            { k: { de: 'Reichweite', en: 'Range' }, v: '40' },
            { k: { de: 'Sog', en: 'Pull' }, v: '2.5/s' },
            { k: { de: 'Aufprall', en: 'Slam' }, v: '15' },
            { k: { de: 'Abklingzeit', en: 'Cooldown' }, v: '120 s' },
          ],
        },
        {
          name: { de: 'Void Shards (Schwert)', en: 'Void Shards (Sword)' },
          key: null, icon: 'hud/shards.png',
          desc: {
            de: 'Solange du das Schwert hältst, kreisen sechs Splitter um dich. Rechtsklick wirft den vordersten zum Fadenkreuz (bis 22 Blöcke, bis zur ersten Wand). Er durchbohrt alles auf dem Weg, springt bis zu sechsmal zum nächsten Gegner in 10 Blöcken und fliegt dann zu dir zurück; auf dem Rückweg trifft er dieselben Gegner noch einmal. Jeder Treffer: 7 Schaden und 1,5 s Langsamkeit. Ein Splitter ist erst nach seiner Rückkehr wieder bereit.',
            en: 'While you hold the sword, six shards orbit you. Right-click throws the front one toward your crosshair (up to 22 blocks, up to the first wall). It pierces everything on its way, jumps up to six times to the next enemy within 10 blocks and then flies back to you; on the way back it can hit the same enemies again. Every hit: 7 damage and 1.5 s of Slowness. A shard is only ready again once it has returned.',
          },
          stats: [
            { k: { de: 'Schaden', en: 'Damage' }, v: '7' },
            { k: { de: 'Sprünge', en: 'Jumps' }, v: '6' },
            { k: { de: 'Reichweite', en: 'Range' }, v: '22' },
            { k: { de: 'Wurf-Abklingzeit', en: 'Throw cooldown' }, v: '0.3 s' },
          ],
        },
        {
          name: { de: 'Sky Launch und Schockwelle (Mace)', en: 'Sky Launch and Shockwave (Mace)' },
          key: null, icon: 'hud/launch.png',
          desc: {
            de: 'Die Void Mace ist eine echte Mace, der Smash-Angriff bleibt erhalten. Rechtsklick reißt dich steil in den Himmel, mit etwas Schwung nach vorn. Danach ist dein nächster Mace-Treffer 10 s lang aufgeladen: Sein voller Schaden trifft zugleich alle anderen Gegner im Umkreis von 6 Blöcken und stößt sie weg.',
            en: 'The Void Mace is a real mace and keeps its smash attack. Right-click hurls you steeply into the sky with a little forward momentum. Afterwards your next mace hit is charged for 10 s: its full damage also strikes every other enemy within 6 blocks at the same time and knocks them away.',
          },
          stats: [
            { k: { de: 'Startkraft', en: 'Launch power' }, v: '2.4' },
            { k: { de: 'Schockwelle', en: 'Shockwave' }, v: '6' },
            { k: { de: 'Fenster', en: 'Window' }, v: '10 s' },
            { k: { de: 'Abklingzeit', en: 'Cooldown' }, v: '8 s' },
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Set-Boni
    {
      type: 'abilities',
      title: { de: 'Set-Boni', en: 'Set bonuses' },
      lead: {
        de: 'Diese Effekte wirken nur mit allen vier Teilen. Dazu kommen die Boni der einzelnen Teile: Helm Regeneration I, Brustplatte Feuerresistenz, Stiefel Geschwindigkeit I und kein Fallschaden.',
        en: 'These effects only work with all four pieces. On top come the per-piece bonuses: helmet Regeneration I, chestplate Fire Resistance, boots Speed I and no fall damage.',
      },
      items: [
        {
          name: { de: 'Void Link', en: 'Void Link' }, key: null, icon: null,
          desc: {
            de: 'Jeder deiner Treffer hallt durch das Nichts: Ein geschwungener Energiestrom fliegt vom Opfer nacheinander durch bis zu 4 weitere Gegner in 8 Blöcken und richtet bei jedem einen Teil deines Schadens an. Die Stärke wird jedes Mal ausgewürfelt und ist an der Bahn ablesbar: 1/3 (45 %), 2/3 (35 %) oder der volle Schaden (20 %, mit Schallknall).',
            en: 'Every hit of yours echoes through the void: a curved energy stream flies from the victim through up to 4 more enemies within 8 blocks, one after another, dealing part of your damage to each. The strength is rolled every time and shows in the trail: 1/3 (45 %), 2/3 (35 %) or full damage (20 %, with a sonic boom).',
          },
          stats: [
            { k: { de: 'Reichweite', en: 'Range' }, v: '8' },
            { k: { de: 'Ziele', en: 'Targets' }, v: '4' },
            { k: { de: 'Voller Schaden', en: 'Full damage' }, v: '20 %' },
          ],
        },
        {
          name: { de: 'Kind der Nacht', en: 'Child of the Night' }, key: null, icon: null,
          desc: {
            de: 'Nachts und im End wird das Set eins mit der Dunkelheit: Du bist dauerhaft unsichtbar, hast Nachtsicht und Regeneration I.',
            en: 'At night and in the End the set becomes one with the dark: you are permanently invisible and have Night Vision and Regeneration I.',
          },
          stats: [],
        },
        {
          name: { de: 'Full-Invis', en: 'Full Invis' }, key: null, icon: null,
          desc: {
            de: 'Bist du unsichtbar, egal ob durch Trank, Nacht, Void Collapse oder Notriss, verschwindet auch deine Rüstung. Sie bleibt angelegt, andere Spieler sehen sie nur nicht mehr.',
            en: 'Whenever you are invisible, whether from a potion, the night, Void Collapse or the Emergency Rift, your armor vanishes too. It stays equipped, other players just cannot see it.',
          },
          stats: [],
        },
        {
          name: { de: 'Notriss', en: 'Emergency Rift' }, key: null, icon: null,
          desc: {
            de: 'Fällst du unter 3 Herzen, reißt dich das Nichts weg: Teleport bis zu 14 Blöcke weg von allen Wesen in der Nähe, dazu 30 s Unsichtbarkeit (samt Rüstung) und 5 s Geschwindigkeit II.',
            en: 'When you drop below 3 hearts, the void tears you away: a teleport up to 14 blocks away from every creature nearby, plus 30 s of Invisibility (armor included) and 5 s of Speed II.',
          },
          stats: [
            { k: { de: 'Schwelle', en: 'Threshold' }, v: '3 ♥' },
            { k: { de: 'Distanz', en: 'Distance' }, v: '14' },
            { k: { de: 'Abklingzeit', en: 'Cooldown' }, v: '60 s' },
          ],
        },
        {
          name: { de: 'Geteilte Gaben', en: 'Shared Gifts' }, key: null, icon: null,
          desc: {
            de: 'Alle 2 s springen deine positiven Effekte auf vertraute Spieler (Trust-Liste von H&H Armors) in 70 Blöcken über, jeweils für bis zu 5 s.',
            en: 'Every 2 s your positive effects arc to trusted players (H&H Armors trust list) within 70 blocks, for up to 5 s each.',
          },
          stats: [{ k: { de: 'Reichweite', en: 'Range' }, v: '70' }],
        },
        {
          name: { de: 'Der Void fängt dich', en: 'The Void catches you' }, key: null, icon: null,
          desc: {
            de: 'Stürzt du ins Void, verschluckt es dich und spuckt dich an deinem Spawnpunkt wieder aus, mit 5 s Resistenz V statt des Todes.',
            en: 'If you fall into the void, it swallows you and spits you out at your spawn point with 5 s of Resistance V instead of killing you.',
          },
          stats: [],
        },
      ],
    },

    // ------------------------------------------------------------------ Herstellung und Werte
    {
      type: 'text',
      title: { de: 'Herstellung und Werte', en: 'Crafting and stats' },
      body: {
        de: '<p><b>Void-Barren</b>: in der Werkbank aus 4 Weinendem Obsidian (Ecken), 4 Echosplittern (Seiten) und 1 Netheritbarren (Mitte). Vael lässt außerdem 8 bis 14 Stück fallen.</p>'
          + '<p><b>Rüstung und Waffen</b>: im Schmiedetisch aus <i>Jötunheims Schmiedevorlage</i> (aus H&H Armors), dem passenden Netherit-Teil bzw. Netheritschwert und einem Void-Barren. Die Void Mace entsteht aus einem normalen Streitkolben.</p>'
          + '<p><b>Rüstungswerte</b>: Helm 3, Brustplatte 8, Beinschutz 6, Stiefel 3 Rüstungspunkte, je Teil 3,5 Härte und 10 % Rückstoßresistenz. Haltbarkeit 440 / 640 / 600 / 520, Verzauberbarkeit 17.<br>'
          + '<b>Waffen</b>: Material mit 2531 Haltbarkeit und Verzauberbarkeit 17.<br>'
          + '<b>Reparatur</b>: mit Netheritbarren oder Void-Barren. Alle Teile sind feuerfest.</p>',
        en: '<p><b>Void Ingot</b>: crafted from 4 Crying Obsidian (corners), 4 Echo Shards (sides) and 1 Netherite Ingot (center). Vael also drops 8 to 14 of them.</p>'
          + '<p><b>Armor and weapons</b>: in the smithing table from <i>Jötunheim’s Upgrade Smithing Template</i> (from H&H Armors), the matching netherite piece or netherite sword and one Void Ingot. The Void Mace is made from a regular mace.</p>'
          + '<p><b>Armor stats</b>: helmet 3, chestplate 8, leggings 6, boots 3 armor points, each piece 3.5 toughness and 10 % knockback resistance. Durability 440 / 640 / 600 / 520, enchantability 17.<br>'
          + '<b>Weapons</b>: material with 2531 durability and enchantability 17.<br>'
          + '<b>Repair</b>: with Netherite Ingots or Void Ingots. Every piece is fireproof.</p>',
      },
    },

    // ------------------------------------------------------------------ Bosskampf
    {
      type: 'boss',
      title: { de: 'Bosskampf: Vael', en: 'Boss fight: Vael' },
      lead: {
        de: 'Vael sieht sich nicht als Feind, sondern als Gläubiger: Alles, was existiert, hat sich vom Nichts geliehen, und er ist gekommen, um zu kassieren. Der Kampf läuft in vier Phasen, jeder Phasenwechsel startet eine kurze Cutscene.',
        en: 'Vael does not see himself as an enemy but as a creditor: everything that exists has borrowed from the void, and he has come to collect. The fight runs in four phases, and every phase change starts a short cutscene.',
      },
      bosses: [
        {
          id: 'vael',
          model: 'void_boss',
          texture: null,
          name: { de: 'Vael, der Letzte Gläubiger', en: 'Vael, the Last Creditor' },
          sub: { de: 'Phase I bis III · 300 Herzen', en: 'Phases I to III · 300 hearts' },
          color: '#a46cff',
          segments: 3,
          desc: {
            de: 'Ein steinerner Koloss mit offener Herzkammer, Gelenken aus Licht, Kristallen auf dem Rücken und einem Hauptbuch, das um ihn kreist. Er hat 600 Lebenspunkte (300 Herzen), 12 Rüstung und lässt sich nicht zurückstoßen. Seine Regeln:<br>'
              + '<b>Schuld</b>: Jeder Treffer von ihm erhöht deine Schuld um 1 (Anzeige über der Hotbar). Bei 5 wird sie fällig: 16 Schaden (8 Herzen) und 3 s Blindheit, danach beginnt sie bei 0.<br>'
              + '<b>Abzahlung</b>: Je 30 Schaden, die du ihm zufügst, tilgen eine Schuld.<br>'
              + '<b>Raten</b>: Er nimmt pro Treffer höchstens 30 Schaden an.<br>'
              + 'Feuer, Wither und Ersticken schaden ihm nicht, ins Void gestürzt kehrt er zurück. Ist 30 s lang niemand in 64 Blöcken, heilt er sich voll und beginnt wieder bei Phase I.',
            en: 'A stone colossus with an open heart chamber, joints of light, crystals on his back and a ledger orbiting him. He has 600 health (300 hearts), 12 armor and cannot be knocked back. His rules:<br>'
              + '<b>Debt</b>: every hit he lands raises your debt by 1 (shown above the hotbar). At 5 it comes due: 16 damage (8 hearts) and 3 s of Blindness, then it starts over at 0.<br>'
              + '<b>Repayment</b>: every 30 damage you deal to him pays off one debt.<br>'
              + '<b>Installments</b>: he accepts at most 30 damage per hit.<br>'
              + 'Fire, wither and suffocation do not hurt him, and if he falls into the void he comes back. If nobody is within 64 blocks for 30 s, he heals fully and starts over at phase I.',
          },
          trick: {
            de: 'Bleib am Ball: Wer ihm regelmäßig Schaden macht, baut Schuld ab, bevor sie fällig wird. Ein einzelner Riesentreffer bringt wenig, er nimmt höchstens 30 pro Schlag an. Beim Tilgungsstrahl springen, beim Erlass hinter eine der Säulen stellen: Er trifft nur, wer freie Sicht auf Vael hat. Seine Säulen und Faustschläge zielen dorthin, wohin du gerade läufst, also Haken schlagen. Und bei 0 Leben ist es noch nicht vorbei.',
            en: 'Keep up the pressure: dealing damage regularly pays off debt before it comes due. One giant hit does little, he accepts at most 30 per blow. Jump over the Erasure Sweep and get behind one of the pillars for the Remission: it only hits those with a clear line of sight to Vael. His pillars and fists aim where you are running, so change direction. And at 0 health it is not over yet.',
          },
          where: {
            de: 'Im Tribunal, einem schwebenden Gerichtssaal über den äußeren Inseln des End. Tritt man auf 22 Blöcke an das Pult des Gläubigers in der Mitte heran, erwacht es. Operatoren können mit <code>/voidboss place</code> ein Tribunal bauen.',
            en: 'In the Tribunal, a floating courtroom above the outer islands of the End. Step within 22 blocks of the Creditor’s Lectern in the middle and it awakens. Operators can build a Tribunal with <code>/voidboss place</code>.',
          },
          loot: {
            de: 'Noch keine: Beim ersten Tod bricht er nur zusammen. Die Beute gibt es erst nach Phase IV.',
            en: 'None yet: at his first death he only collapses. The loot comes after phase IV.',
          },
          phases: [
            {
              name: { de: 'I · Die Mahnung', en: 'I · The Reminder' },
              desc: {
                de: 'Ab 100 % Leben. Vael stürzt in einer Cutscene aus einem Riss im Himmel und brüllt. Angriffe: Faustschlag, Schuldsäulen (3 Wellen), Rissalve (6 Splitter), Inkasso und Rissgriff. Zwischen zwei Angriffen ruht er 2,3 s.',
                en: 'From 100 % health. Vael falls out of a rift in the sky in a cutscene and roars. Attacks: Fist Strike, Debt Pillars (3 waves), Rift Volley (6 shards), Collection and Rift Grasp. He rests 2.3 s between attacks.',
              },
            },
            {
              name: { de: 'II · Die Pfändung', en: 'II · The Seizure' },
              desc: {
                de: 'Unter 66 % Leben. „Mahnungen sind vorbei. Du hast Zeit geliehen, und ich pfände sie.“ Drei Schuldner tauchen auf, am Himmel öffnen sich die ersten Risse. Neu: Rissschritt, Pfändung, Tilgungsstrahl und Singularität. Schuldsäulen kommen mit einer zweiten Säule daneben, die Rissalve mit 8 Splittern. Pause 1,7 s.',
                en: 'Below 66 % health. “The reminders are over. You borrowed time, and I am seizing it.” Three debtors appear and the first rifts open in the sky. New: Rift Step, Seizure, Erasure Sweep and Singularity. Debt Pillars come with a second pillar next to them, the Rift Volley with 8 shards. Rest 1.7 s.',
              },
            },
            {
              name: { de: 'III · Die Tilgung', en: 'III · The Repayment' },
              desc: {
                de: 'Unter 33 % Leben. „Vergebung ist das letzte Geschenk.“ Fünf Schuldner, mehr Risse am Himmel. Schuldsäulen in 5 Wellen, Rissalve mit 10 Splittern, Tilgungsstrahl mit 4 Balken und schnellerer Drehung. Unter 20 % Leben kommt alle 70 s Der Erlass. Pause nur noch 1,1 s.',
                en: 'Below 33 % health. “Forgiveness is the final gift.” Five debtors and more rifts in the sky. Debt Pillars in 5 waves, Rift Volley with 10 shards, Erasure Sweep with 4 beams that turn faster. Below 20 % health The Remission comes every 70 s. Rest only 1.1 s.',
              },
            },
          ],
          moves: [
            { n: { de: 'Faustschlag', en: 'Fist Strike' }, p: ['punch_wind', 'punch_hit'] },
            { n: { de: 'Schuldsäulen', en: 'Debt Pillars' }, p: ['verdict_raise', 'verdict_slam'] },
            { n: { de: 'Rissalve', en: 'Rift Volley' }, p: ['volley_right', 'volley_left', 'volley_right'] },
            { n: { de: 'Inkasso', en: 'Collection' }, p: ['collect_reach', 'collect_pull'] },
            { n: { de: 'Rissgriff', en: 'Rift Grasp' }, p: ['reach_wind', 'reach_thrust'] },
            { n: { de: 'Rissschritt', en: 'Rift Step' }, p: ['rift_tear', 'vanished', 'rift_exit', 'rift_slam'] },
            { n: { de: 'Pfändung', en: 'Seizure' }, p: ['seizure_reach', 'seizure_snap'] },
            { n: { de: 'Tilgungsstrahl', en: 'Erasure Sweep' }, p: ['sweep_open', 'sweep_spin'] },
            { n: { de: 'Singularität', en: 'Singularity' }, p: ['singularity_raise', 'singularity'] },
            { n: { de: 'Der Erlass', en: 'The Remission' }, p: ['remission_charge', 'remission_peak'] },
            { n: { de: 'Auftritt', en: 'Entrance' }, p: ['fall', 'land', 'roar_a', 'roar_b'] },
            { n: { de: 'Falscher Tod', en: 'False death' }, p: ['kneel', 'collapsed'] },
          ],
        },
        {
          id: 'vael_reborn',
          model: 'void_boss_reborn',
          texture: null,
          name: { de: 'Vael, der Unbezahlbare', en: 'Vael, the Unpayable' },
          sub: { de: 'Phase IV · 175 Herzen', en: 'Phase IV · 175 hearts' },
          color: '#f046ff',
          segments: 1,
          desc: {
            de: 'Beim ersten Tod bricht Vael zusammen: „Du glaubst, du hättest bezahlt...“ Es erscheint KONTO AUSGEGLICHEN, ein Erfolgston spielt, die Risse am Himmel schließen sich, alle Schuldner sterben und deine Schuld ist gelöscht. Nach rund 6 Sekunden Ruhe schlägt ein Herz. Der Himmel reißt auf, Strahlen setzen die Trümmer wieder zusammen, und er kehrt zurück: mit glühenden Rissen im Körper, Dornen auf dem Rücken, rotem Bossbalken und 350 Lebenspunkten (175 Herzen). Vier Schuldner begleiten ihn.',
            en: 'At his first death Vael collapses: “You think you have paid...” ACCOUNT SETTLED appears, a success jingle plays, the rifts in the sky close, every debtor dies and your debt is wiped. After about 6 seconds of calm a heart beats. The sky tears open, beams pull the rubble back together and he returns: with glowing cracks in his body, spikes on his back, a red boss bar and 350 health (175 hearts). Four debtors come with him.',
          },
          trick: {
            de: 'Nutze die Ruhe nach dem falschen Tod zum Heilen. In Phase IV kommen Himmelsschlag, Riss und Rissregen doppelt so oft wie die alten Angriffe, und alle drei zielen dorthin, wohin du läufst: Haken schlagen statt geradeaus rennen. Der Erlass kommt jetzt schon unter 50 % Leben und alle 35 s, also nie weit von einer Säule entfernt kämpfen.',
            en: 'Use the calm after the false death to heal. In phase IV, Sky Strike, Fissure and Rift Rain come twice as often as the old attacks, and all three aim where you are running: change direction instead of running straight. The Remission now comes below 50 % health and every 35 s, so never fight far from a pillar.',
          },
          where: {
            de: 'Direkt nach dem falschen Tod, an derselben Stelle.',
            en: 'Right after the false death, in the same place.',
          },
          loot: {
            de: '8 bis 14 Void-Barren, ein Netherstern, 500 Erfahrungspunkte und das geschriebene Buch <i>Das Hauptbuch der Leere</i> von Vael (5 Seiten). Wer es liest, hat seine Forderungen geerbt.',
            en: '8 to 14 Void Ingots, a Nether Star, 500 experience and the written book <i>Das Hauptbuch der Leere</i> (The Ledger of the Void) by Vael (5 pages). Whoever reads it has inherited his claims.',
          },
          phases: [
            {
              name: { de: 'IV · Der Bankrott', en: 'IV · Bankruptcy' },
              desc: {
                de: '„Das Nichts hat keine Gläubiger. Es hat nur mich. Und jetzt wird alles fällig, auch der Himmel.“ Alle bisherigen Angriffe bleiben, neu kommen Himmelsschlag, Riss und Rissregen. Er läuft schneller und ruht zwischen Angriffen nur 0,8 s. Am Ende kniet er, blickt auf und zerbröckelt in einer letzten Cutscene: KONTO GESCHLOSSEN.',
                en: '“The void has no creditors. It only has me. And now everything comes due, even the sky.” All previous attacks remain, joined by Sky Strike, Fissure and Rift Rain. He walks faster and rests only 0.8 s between attacks. At the end he kneels, looks up and crumbles in a final cutscene: ACCOUNT CLOSED.',
              },
            },
          ],
          moves: [
            { n: { de: 'Auferstehung', en: 'Rebirth' }, p: ['collapsed', 'roar_a', 'roar_b'] },
            { n: { de: 'Himmelsschlag', en: 'Sky Strike' }, p: ['sky_raise', 'sky_pull'] },
            { n: { de: 'Riss', en: 'Fissure' }, p: ['fissure_lift', 'fissure_stomp'] },
            { n: { de: 'Rissregen', en: 'Rift Rain' }, p: ['sky_raise', 'sky_pull', 'sky_raise', 'sky_pull'] },
            { n: { de: 'Der Erlass', en: 'The Remission' }, p: ['remission_charge', 'remission_peak'] },
            { n: { de: 'Rissschritt', en: 'Rift Step' }, p: ['rift_tear', 'vanished', 'rift_exit', 'rift_slam'] },
            { n: { de: 'Das Ende', en: 'The end' }, p: ['death_kneel', 'death_crumbled'] },
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Angriffe im Detail
    {
      type: 'abilities',
      title: { de: 'Vaels Angriffe', en: 'Vael’s attacks' },
      lead: {
        de: 'Alle Werte in Schaden (2 = 1 Herz). Jeder Treffer, der dich verletzt, erhöht deine Schuld um 1, der Erlass um 2. Während Cutscenes kann niemand getroffen werden.',
        en: 'All values in damage (2 = 1 heart). Every hit that hurts you raises your debt by 1, the Remission by 2. Nobody can be hit during cutscenes.',
      },
      items: [
        {
          name: { de: 'Faustschlag', en: 'Fist Strike' }, key: null, icon: null,
          desc: {
            de: 'Kommst du ihm näher als etwa 6,5 Blöcke, schlägt er zu und schleudert dich weg. Läuft neben allen anderen Angriffen her.',
            en: 'Get closer than about 6.5 blocks and he punches you away. Runs alongside all other attacks.',
          },
          stats: [{ k: { de: 'Schaden', en: 'Damage' }, v: '12' }, { k: { de: 'Takt', en: 'Every' }, v: '1.8 s' }, { k: { de: 'Phase', en: 'Phase' }, v: 'I+' }],
        },
        {
          name: { de: 'Schuldsäulen', en: 'Debt Pillars' }, key: null, icon: null,
          desc: {
            de: 'Er holt mit der Faust aus und rammt sie in den Boden. Unter jedem Spieler, dort wo er in 0,6 s sein wird, kündigt sich ein Kreis an; 0,8 s später bricht eine Kristallsäule heraus und wirft dich hoch. 3 Wellen im Abstand von 0,7 s, in Phase III 5. Ab Phase II kommt je eine zweite Säule 4 Blöcke daneben.',
            en: 'He raises his fist and drives it into the ground. Under every player, where they will be in 0.6 s, a circle appears; 0.8 s later a crystal pillar bursts out and throws you up. 3 waves 0.7 s apart, 5 in phase III. From phase II each comes with a second pillar 4 blocks away.',
          },
          stats: [{ k: { de: 'Schaden', en: 'Damage' }, v: '12' }, { k: { de: 'Warnung', en: 'Warning' }, v: '0.8 s' }, { k: { de: 'Phase', en: 'Phase' }, v: 'I+' }],
        },
        {
          name: { de: 'Rissalve', en: 'Rift Volley' }, key: null, icon: null,
          desc: {
            de: 'Hinter ihm reißt die Luft an drei Stellen auf. Abwechselnd aus den Fäusten schleudert er lenkende Splitter, alle 0,25 s einen, reihum auf alle Spieler: 6 in Phase I, 8 in Phase II, 10 in Phase III. Ein Splitter verfolgt sein Ziel bis zu 6 s.',
            en: 'The air tears open in three places behind him. Alternating fists, he hurls homing shards, one every 0.25 s, taking turns on all players: 6 in phase I, 8 in phase II, 10 in phase III. A shard chases its target for up to 6 s.',
          },
          stats: [{ k: { de: 'Schaden', en: 'Damage' }, v: '7' }, { k: { de: 'Splitter', en: 'Shards' }, v: '6/8/10' }, { k: { de: 'Phase', en: 'Phase' }, v: 'I+' }],
        },
        {
          name: { de: 'Inkasso', en: 'Collection' }, key: null, icon: null,
          desc: {
            de: 'Eine Kette zerrt dich 2,2 s lang zu ihm. Dreimal zieht sie dir Leben ab, das Vael sich gutschreibt: je 4 Schaden für dich und 10 Leben (5 Herzen) für ihn.',
            en: 'A chain drags you toward him for 2.2 s. Three times it drains life that Vael credits to himself: 4 damage to you and 10 health (5 hearts) for him each time.',
          },
          stats: [{ k: { de: 'Schaden', en: 'Damage' }, v: '3× 4' }, { k: { de: 'Heilung', en: 'Heal' }, v: '3× 10' }, { k: { de: 'Phase', en: 'Phase' }, v: 'I+' }],
        },
        {
          name: { de: 'Rissgriff', en: 'Rift Grasp' }, key: null, icon: null,
          desc: {
            de: 'Er rammt den Arm in einen Riss vor sich. 17 Blöcke über dir öffnet sich ein zweiter, und 0,75 s später schlägt seine Faust daraus auf den Boden: Treffer im Umkreis von gut 3,5 Blöcken mit Wurf. Zielt auf deine Laufrichtung.',
            en: 'He drives his arm into a rift in front of him. A second rift opens 17 blocks above you and 0.75 s later his fist slams down out of it: hits within about 3.5 blocks and throws you. Aims at where you are running.',
          },
          stats: [{ k: { de: 'Schaden', en: 'Damage' }, v: '15' }, { k: { de: 'Warnung', en: 'Warning' }, v: '0.75 s' }, { k: { de: 'Phase', en: 'Phase' }, v: 'I+' }],
        },
        {
          name: { de: 'Rissschritt', en: 'Rift Step' }, key: null, icon: null,
          desc: {
            de: 'Er greift mit offenen Händen in die Luft, reißt sie auseinander und verschwindet. Solange er im Riss steckt, ist er nicht zu treffen. 5 Blöcke hinter dir warnt eine Lichtsäule, gut 1 s später bricht er mit erhobenen Fäusten hervor und schlägt auf: Treffer im Umkreis von etwa 6,5 Blöcken.',
            en: 'He reaches into the air with open hands, tears it apart and vanishes. While he is inside the rift he cannot be hit. A pillar of light warns 5 blocks behind you; a little over 1 s later he bursts out with raised fists and slams down: hits within about 6.5 blocks.',
          },
          stats: [{ k: { de: 'Schaden', en: 'Damage' }, v: '13' }, { k: { de: 'Warnung', en: 'Warning' }, v: '1.1 s' }, { k: { de: 'Phase', en: 'Phase' }, v: 'II+' }],
        },
        {
          name: { de: 'Pfändung', en: 'Seizure' }, key: null, icon: null,
          desc: {
            de: '„Das gehört nicht dir. Es hat nie dir gehört.“ Ketten zu allen Spielern: Der Gegenstand in deiner Haupthand ist 6 s gesperrt, dazu 6 s Schwäche II und Abbaulähmung II und eine Schuld.',
            en: '“That is not yours. It never was.” Chains to every player: the item in your main hand is locked for 6 s, plus 6 s of Weakness II and Mining Fatigue II and one debt.',
          },
          stats: [{ k: { de: 'Sperre', en: 'Lock' }, v: '6 s' }, { k: { de: 'Schuld', en: 'Debt' }, v: '+1' }, { k: { de: 'Phase', en: 'Phase' }, v: 'II+' }],
        },
        {
          name: { de: 'Tilgungsstrahl', en: 'Erasure Sweep' }, key: null, icon: null,
          desc: {
            de: '„Heb die Füße, solange du noch welche hast.“ Er geht zur Arenamitte und dreht sich mit ausgebreiteten Armen. Von dort kreisen 2 Balken (Phase III: 4) knapp über dem Boden, 30 Blöcke lang, 7,5 s lang, nach 1,3 s Vorwarnung. Wer nicht springt, wird getroffen und weggeschleudert.',
            en: '“Lift your feet while you still have them.” He walks to the middle of the arena and spins with outstretched arms. From there 2 beams (phase III: 4) sweep just above the ground, 30 blocks long, for 7.5 s, after a 1.3 s warning. Whoever does not jump gets hit and flung away.',
          },
          stats: [{ k: { de: 'Schaden', en: 'Damage' }, v: '14' }, { k: { de: 'Dauer', en: 'Duration' }, v: '7.5 s' }, { k: { de: 'Phase', en: 'Phase' }, v: 'II+' }],
        },
        {
          name: { de: 'Singularität', en: 'Singularity' }, key: null, icon: null,
          desc: {
            de: 'Er reißt beide Arme hoch: 8 Blöcke über der Arenamitte öffnet sich ein schwarzes Loch und zieht 7,5 s lang alle Spieler in 42 Blöcken an. Wer näher als 6 Blöcke herankommt, nimmt jede Sekunde Schaden. Am Ende schleudert es alle nach außen. Höchstens alle 26 s.',
            en: 'He throws both arms up: a black hole opens 8 blocks above the middle of the arena and pulls every player within 42 blocks for 7.5 s. Getting closer than 6 blocks hurts every second. At the end it flings everyone outward. At most every 26 s.',
          },
          stats: [{ k: { de: 'Schaden', en: 'Damage' }, v: '7/s' }, { k: { de: 'Dauer', en: 'Duration' }, v: '7.5 s' }, { k: { de: 'Phase', en: 'Phase' }, v: 'II+' }],
        },
        {
          name: { de: 'Der Erlass', en: 'The Remission' }, key: null, icon: null,
          desc: {
            de: 'Der Titel DER ERLASS erscheint: „Geh hinter eine Säule!“ Vael geht zur Mitte, stemmt sich breit auf und lädt 5,5 s lang, immer stärker bebend. Dann trifft die Tilgung jeden, der freie Sicht auf ihn hat: 34 Schaden (17 Herzen) und 2 Schuld. Ohne Tribunal (per Befehl gerufen) sind es 20. Hinter einer Säule: „Der Erlass ging an dir vorbei. Vorerst.“',
            en: 'The title THE REMISSION appears: “Get behind a pillar!” Vael walks to the middle, braces himself and charges for 5.5 s, shaking harder and harder. Then the repayment strikes everyone with a clear line of sight: 34 damage (17 hearts) and 2 debt. Without a Tribunal (summoned by command) it is 20. Behind a pillar: “The Remission passed you by. For now.”',
          },
          stats: [{ k: { de: 'Schaden', en: 'Damage' }, v: '34' }, { k: { de: 'Ladezeit', en: 'Charge' }, v: '5.5 s' }, { k: { de: 'Phase', en: 'Phase' }, v: 'III < 20 %, IV < 50 %' }],
        },
        {
          name: { de: 'Himmelsschlag', en: 'Sky Strike' }, key: null, icon: null,
          desc: {
            de: '„Selbst das da oben war nur geliehen.“ Er reckt die Faust zum Zenit und reißt sie nieder, dreimal in 3,3 s. Jedes Mal erscheint unter jedem Spieler (dort, wohin er läuft) ein Kreis, 0,9 s später fährt ein Strahl aus dem Riss darüber herab: Treffer im Umkreis von 3 Blöcken.',
            en: '“Even that up there was only borrowed.” He raises his fist to the zenith and tears it down, three times in 3.3 s. Each time a circle appears under every player (where they are heading), and 0.9 s later a beam strikes down from the rift above: hits within 3 blocks.',
          },
          stats: [{ k: { de: 'Schaden', en: 'Damage' }, v: '13' }, { k: { de: 'Warnung', en: 'Warning' }, v: '0.9 s' }, { k: { de: 'Phase', en: 'Phase' }, v: 'IV' }],
        },
        {
          name: { de: 'Riss', en: 'Fissure' }, key: null, icon: null,
          desc: {
            de: 'Er hebt den Fuß und stampft. Drei Linien aus je 9 Kristallsäulen laufen fächerförmig über den Boden auf dich zu, jede Säule mit eigener Warnung.',
            en: 'He lifts his foot and stomps. Three lines of 9 crystal pillars each fan out across the ground toward you, every pillar with its own warning.',
          },
          stats: [{ k: { de: 'Schaden', en: 'Damage' }, v: '12' }, { k: { de: 'Säulen', en: 'Pillars' }, v: '27' }, { k: { de: 'Phase', en: 'Phase' }, v: 'IV' }],
        },
        {
          name: { de: 'Rissregen', en: 'Rift Rain' }, key: null, icon: null,
          desc: {
            de: '„Auch der Himmel war nur Kredit. Er stürzt jetzt ein.“ 3,3 s lang fällt alle 0,25 s für jeden Spieler ein Felsbrocken aus einem Spalt im Himmel, jeder dritte genau auf dich, die anderen 3 bis 9 Blöcke daneben. 1 s Vorwarnung, Treffer im Umkreis von gut 2,5 Blöcken.',
            en: '“Even the sky was on credit. It is falling due.” For 3.3 s a rock falls from a crack in the sky for every player every 0.25 s, every third one right on you, the others 3 to 9 blocks away. 1 s warning, hits within about 2.5 blocks.',
          },
          stats: [{ k: { de: 'Schaden', en: 'Damage' }, v: '8' }, { k: { de: 'Warnung', en: 'Warning' }, v: '1 s' }, { k: { de: 'Phase', en: 'Phase' }, v: 'IV' }],
        },
        {
          name: { de: 'Schuldner', en: 'Debtors' }, key: null, icon: null,
          desc: {
            de: 'Frühere Konten Vaels, die für ihn eintreiben: eine kleine Ausgabe seines Modells, die dich im Nahkampf angreift. 3 erscheinen zu Beginn von Phase II, 5 zu Beginn von Phase III, 4 nach der Wiedergeburt. Sie lassen mit 1/3 Chance eine Enderperle fallen.',
            en: 'Vael’s former accounts collecting on his behalf: a small version of his model that attacks you in melee. 3 appear at the start of phase II, 5 at the start of phase III, 4 after the rebirth. They have a 1/3 chance to drop an Ender Pearl.',
          },
          stats: [{ k: { de: 'Leben', en: 'Health' }, v: '15 ♥' }, { k: { de: 'Schaden', en: 'Damage' }, v: '7' }, { k: { de: 'XP', en: 'XP' }, v: '10' }],
        },
      ],
    },

    // ------------------------------------------------------------------ Kampf starten
    {
      type: 'steps',
      title: { de: 'So startest du den Kampf', en: 'How to start the fight' },
      items: [
        { de: 'Finde ein Tribunal: einen runden, schwebenden Gerichtssaal aus Schwarzstein und Obsidian über den äußeren Inseln des End (End-Hochland und End-Mittelland).', en: 'Find a Tribunal: a round, floating courtroom of blackstone and obsidian above the outer islands of the End (End Highlands and End Midlands).' },
        { de: 'Geh auf die Plattform. Sobald du 22 Blöcke an das Pult des Gläubigers in der Mitte herankommst, öffnet es die Akte und läutet 4,5 s lang.', en: 'Step onto the platform. As soon as you come within 22 blocks of the Creditor’s Lectern in the middle, it opens the file and tolls for 4.5 s.' },
        { de: 'Über der Arena reißt der Himmel auf, Vael stürzt heraus, schlägt ein und brüllt. Die Cutscene dauert 9,5 s und lässt sich durch Halten von Shift überspringen; währenddessen bist du geschützt.', en: 'The sky tears open above the arena, Vael falls out, crashes down and roars. The cutscene lasts 9.5 s and can be skipped by holding Shift; you are protected while it runs.' },
        { de: 'Kämpfe im Tribunal: Vael greift nur Spieler bis 64 Blöcke um die Mitte an und verlässt selbst einen Kreis von 21 Blöcken nicht. Die Säulen sind deine Deckung.', en: 'Fight inside the Tribunal: Vael only targets players up to 64 blocks from the middle and never leaves a 21-block circle himself. The pillars are your cover.' },
        { de: 'Danach ist das Pult verbraucht. Rechtsklick mit einem Void-Barren erkennt deine Schuld erneut an und stellt es wieder scharf.', en: 'Afterwards the lectern is spent. Right-click it with a Void Ingot to acknowledge your debt once more and re-arm it.' },
      ],
    },

    // ------------------------------------------------------------------ Welt
    {
      type: 'world',
      title: { de: 'Das Tribunal', en: 'The Tribunal' },
      lead: {
        de: 'Die Arena entsteht rein prozedural, darum liefern Weltgenerierung und <code>/voidboss place</code> denselben Bau. Sie besteht nur aus Vanilla-Blöcken; einziger eigener Block ist das Pult.',
        en: 'The arena is built procedurally, so world generation and <code>/voidboss place</code> produce the same structure. It uses vanilla blocks only; the lectern is the one custom block.',
      },
      cards: [
        {
          name: { de: 'Tribunal', en: 'Tribunal' },
          desc: {
            de: 'Ein runder, schwebender Gerichtssaal mit 28 Blöcken Radius, 9 Blöcke über dem Boden der äußeren End-Inseln. Der Boden aus polierten Schwarzsteinziegeln trägt Ringe aus Amethyst und Speichen aus weinendem Obsidian, darunter hängt ein zerklüfteter Sockel aus Obsidian und Endstein. In der Mitte steht das Pult auf einem Podest mit Endstäben. Acht dreifach breite Säulen dienen als Deckung vor dem Erlass, am Rand läuft ein Rang mit Aktenregalen, durchbrochen von Toren. Über allem schwebt ein Lichtkranz aus violettem Glas. Das Tribunal erscheint wie Endstädte nur auf den äußeren Inseln mit genug Boden.',
            en: 'A round, floating courtroom with a 28-block radius, 9 blocks above the ground of the outer End islands. The floor of polished blackstone bricks carries rings of amethyst and spokes of crying obsidian, with a jagged base of obsidian and end stone hanging below. The lectern stands on a dais with end rods in the middle. Eight triple-wide pillars serve as cover from the Remission, and a gallery with chiseled bookshelves, broken by gates, runs along the edge. A halo of purple glass floats above it all. Like End cities, it only appears on the outer islands with enough ground.',
          },
          colors: ['#302a32', '#100c1a', '#2a0e4f', '#8661c1', '#dadda0', '#7f3fb2'],
        },
      ],
    },

    // ------------------------------------------------------------------ Effekte
    {
      type: 'features',
      title: { de: 'Besondere Effekte', en: 'Special effects' },
      items: [
        {
          icon: 'hud/collapse.png',
          name: { de: 'Schwarzes Loch mit Linse', en: 'Black hole with lensing' },
          desc: {
            de: 'Ein Vollbild-Shader raymarcht das Loch und biegt das Licht um den Horizont. Drumherum: echte Blöcke, die aus dem Boden gerissen werden, kreisende Brocken, Materieströme, Polar-Jets und Energie-Fesseln zu den Opfern. Am Ende fällt es in einer knappen Sekunde zusammen.',
            en: 'A full-screen shader raymarches the hole and bends light around its horizon. Around it: real blocks torn from the ground, orbiting rocks, matter streams, polar jets and energy tethers to the victims. At the end it collapses in under a second.',
          },
        },
        {
          icon: 'hud/meteor.png',
          name: { de: '3D-Meteore und Void-Komet', en: '3D meteors and void comet' },
          desc: {
            de: 'Die Meteore sind echte Feuerbälle, deren flaches Sprite durch einen Fels mit Plasma-Mantel, Schweif und Leuchtspur ersetzt wird. Der Komet bringt eine Zielmarkierung, eine Pilz-Kuppel, zwei Stoßringe und fliegende Brocken mit.',
            en: 'The meteors are real fireballs whose flat sprite is replaced by a rock with a plasma mantle, tail and glowing trail. The comet comes with a target marker, a mushroom dome, two shock rings and flying debris.',
          },
        },
        {
          icon: 'hud/dash.png',
          name: { de: 'Void-Portale', en: 'Void portals' },
          desc: {
            de: 'Void Step und Void Pounce öffnen an Start und Ziel ein rundes Portal mit dunklem Wirbel und leuchtendem Ring, verbunden durch einen Energiestreifen.',
            en: 'Void Step and Void Pounce open a round portal with a dark vortex and a glowing ring at both ends, linked by an energy streak.',
          },
        },
        {
          icon: 'hud/shards.png',
          name: { de: 'Kreisende Splitter', en: 'Orbiting shards' },
          desc: {
            de: 'Die sechs Splitter des Schwerts kreisen für alle sichtbar um den Träger, Server und Client rechnen dieselbe Bahn. Geworfene Splitter fehlen im Ring, bis sie zurück sind.',
            en: 'The sword’s six shards orbit the wielder visibly for everyone; server and client compute the same path. Thrown shards are missing from the ring until they return.',
          },
        },
        {
          icon: 'hud/launch.png',
          name: { de: 'Sky Launch und Schockwelle', en: 'Sky Launch and shockwave' },
          desc: {
            de: 'Beim Start steigt ein Wirbel aus Energie auf, darunter ein Stoßring. Die Schockwelle der Mace zeigt Bodenring, Kuppel und Risse über den Boden.',
            en: 'The launch sends up a vortex of energy with a shock ring below. The mace shockwave shows a ground ring, a dome and cracks across the floor.',
          },
        },
        {
          icon: 'item/void_chestplate.png',
          name: { de: 'Void-Link-Bögen', en: 'Void Link arcs' },
          desc: {
            de: 'Der Void Link fliegt als geschwungener, zuckender Energiebogen durch alle Ziele. Dicke und Farbe verraten, ob 1/3, 2/3 oder der volle Schaden übertragen wird.',
            en: 'Void Link flies through every target as a curved, flickering arc of energy. Its thickness and color reveal whether 1/3, 2/3 or full damage is passed on.',
          },
        },
        {
          icon: 'item/void_helmet.png',
          name: { de: 'Filmkamera-Cutscenes', en: 'Cinematic cutscenes' },
          desc: {
            de: 'Sechs Szenen: Auftritt, Phase II, Phase III, Zusammenbruch, Wiedergeburt und das Ende. Die Kamera fährt um Vael, filmt nie durch Säulen, Balken und Schreibmaschinen-Untertitel ersetzen die Anzeige, Titelkarten kündigen die Phasen an. Eingaben sind gesperrt; Shift halten überspringt.',
            en: 'Six scenes: entrance, phase II, phase III, collapse, rebirth and the end. The camera moves around Vael, never films through pillars, letterbox bars and typewriter captions replace the HUD, and title cards announce the phases. Input is locked; hold Shift to skip.',
          },
        },
        {
          icon: 'item/void_sword.png',
          name: { de: 'Risse im Himmel', en: 'Rifts in the sky' },
          desc: {
            de: 'Ab Phase II tauchen Risse im Himmel auf, in Phase III mehr. Beim falschen Tod schließen sie sich, damit der Sieg echt wirkt. In Phase IV reißt alles auf, und je weniger Leben Vael hat, desto weiter klaffen sie; aus den offenen Rissen fällt Glut.',
            en: 'From phase II rifts appear in the sky, more in phase III. At the false death they close so the victory feels real. In phase IV everything tears open, and the less health Vael has, the wider they gape; embers fall from the open rifts.',
          },
        },
        {
          icon: 'item/void_leggings.png',
          name: { de: 'Schwere Schritte', en: 'Heavy footsteps' },
          desc: {
            de: 'Vael geht wie ein Golem: Jeder Schritt rüttelt an der Kamera, Landungen werfen Staubringe, Einschläge lassen sternförmige Sprünge über den Boden laufen.',
            en: 'Vael walks like a golem: every step shakes the camera, landings throw up dust rings and impacts send star-shaped cracks across the ground.',
          },
        },
      ],
    },

    // ------------------------------------------------------------------ Befehle
    {
      type: 'commands',
      title: { de: 'Befehle', en: 'Commands' },
      items: [
        { cmd: '/voidboss place', desc: { de: 'Baut ein Tribunal mit dem Block unter dir als Arenaboden und setzt dich 16 Blöcke neben die Mitte. Das Pult erwacht, sobald jemand davor steht. Nur für Operatoren.', en: 'Builds a Tribunal with the block below you as the arena floor and puts you 16 blocks from the middle. The lectern wakes as soon as someone stands before it. Operators only.' } },
        { cmd: '/voidboss spawn', desc: { de: 'Ruft Vael 8 Blöcke vor dir herbei, ohne Tribunal. Der Erlass macht dann 20 statt 34 Schaden. Nur für Operatoren.', en: 'Summons Vael 8 blocks in front of you, without a Tribunal. The Remission then deals 20 instead of 34 damage. Operators only.' } },
        { cmd: '/voidboss remove', desc: { de: 'Entfernt Vael und alle Schuldner in der Dimension. Nur für Operatoren.', en: 'Removes Vael and every debtor in the dimension. Operators only.' } },
        { cmd: '/hha set hha_void.<key> <wert>', desc: { de: 'Ändert einen Zahlenwert aus der Tabelle unten (Befehl von H&H Armors, für Operatoren).', en: 'Changes a number from the table below (H&H Armors command, for operators).' } },
        { cmd: '/hha toggle hha_void.<key> true|false', desc: { de: 'Schaltet eine Fähigkeit oder einen Set-Bonus an oder aus.', en: 'Turns an ability or set bonus on or off.' } },
        { cmd: '/hha get hha_void.<key>', desc: { de: 'Zeigt den aktuellen Wert eines Schlüssels.', en: 'Shows the current value of a key.' } },
      ],
    },

    // ------------------------------------------------------------------ Config
    {
      type: 'config',
      title: { de: 'Config', en: 'Config' },
      lead: {
        de: 'HHA Void trägt seine Schlüssel in die Config von H&H Armors ein (<code>hha.json</code>), alle mit dem Präfix <code>hha_void.</code>. Abklingzeiten und Dauern stehen in Ticks (20 Ticks = 1 s), Schaden in halben Herzen. Die Werte des Bosskampfs sind fest eingebaut.',
        en: 'HHA Void adds its keys to the H&H Armors config (<code>hha.json</code>), all prefixed with <code>hha_void.</code>. Cooldowns and durations are in ticks (20 ticks = 1 s), damage in half hearts. The boss fight values are built in.',
      },
      rows: [
        { key: 'hha_void.boots_fall_immunity', def: 'true', desc: { de: 'Stiefel: kein Fallschaden', en: 'Boots: no fall damage' } },
        { key: 'hha_void.dash', def: 'true', desc: { de: 'Void Step an/aus', en: 'Void Step on/off' } },
        { key: 'hha_void.dash_range', def: '8.0', desc: { de: 'Void Step: Reichweite in Blöcken (2 bis 24)', en: 'Void Step: range in blocks (2 to 24)' } },
        { key: 'hha_void.dash_boost', def: '1.1', desc: { de: 'Void Step: Schwung nach vorn', en: 'Void Step: forward boost' } },
        { key: 'hha_void.dash_cooldown', def: '80.0', desc: { de: 'Void Step: Abklingzeit (4 s)', en: 'Void Step: cooldown (4 s)' } },
        { key: 'hha_void.pounce', def: 'true', desc: { de: 'Void Pounce an/aus', en: 'Void Pounce on/off' } },
        { key: 'hha_void.pounce_radius', def: '12.0', desc: { de: 'Void Pounce: Suchradius', en: 'Void Pounce: search radius' } },
        { key: 'hha_void.pounce_height', def: '5.0', desc: { de: 'Void Pounce: Höhe über dem Ziel', en: 'Void Pounce: height above the target' } },
        { key: 'hha_void.pounce_cooldown', def: '200.0', desc: { de: 'Void Pounce: Abklingzeit (10 s)', en: 'Void Pounce: cooldown (10 s)' } },
        { key: 'hha_void.collapse', def: 'true', desc: { de: 'Void Collapse an/aus', en: 'Void Collapse on/off' } },
        { key: 'hha_void.collapse_range', def: '40.0', desc: { de: 'Void Collapse: Reichweite', en: 'Void Collapse: range' } },
        { key: 'hha_void.collapse_pull_damage', def: '2.5', desc: { de: 'Void Collapse: Schaden pro Sekunde im Sog', en: 'Void Collapse: damage per second while pulled' } },
        { key: 'hha_void.collapse_damage', def: '15.0', desc: { de: 'Void Collapse: Schaden beim Aufprall', en: 'Void Collapse: slam damage' } },
        { key: 'hha_void.collapse_bonus_fall', def: '16.0', desc: { de: 'Void Collapse: zusätzliche Fallhöhe in Blöcken', en: 'Void Collapse: extra fall distance in blocks' } },
        { key: 'hha_void.collapse_cooldown', def: '2400.0', desc: { de: 'Void Collapse: Abklingzeit (120 s)', en: 'Void Collapse: cooldown (120 s)' } },
        { key: 'hha_void.full_invis', def: 'true', desc: { de: 'Full-Invis an/aus', en: 'Full Invis on/off' } },
        { key: 'hha_void.share_effects', def: 'true', desc: { de: 'Geteilte Gaben an/aus', en: 'Shared Gifts on/off' } },
        { key: 'hha_void.share_range', def: '70.0', desc: { de: 'Geteilte Gaben: Reichweite', en: 'Shared Gifts: range' } },
        { key: 'hha_void.void_rescue', def: 'true', desc: { de: 'Der Void fängt dich an/aus', en: 'The Void catches you on/off' } },
        { key: 'hha_void.escape', def: 'true', desc: { de: 'Notriss an/aus', en: 'Emergency Rift on/off' } },
        { key: 'hha_void.escape_health', def: '6.0', desc: { de: 'Notriss: Schwelle in Lebenspunkten (3 Herzen)', en: 'Emergency Rift: threshold in health (3 hearts)' } },
        { key: 'hha_void.escape_distance', def: '14.0', desc: { de: 'Notriss: Teleport-Distanz', en: 'Emergency Rift: teleport distance' } },
        { key: 'hha_void.escape_invis', def: '600.0', desc: { de: 'Notriss: Dauer der Unsichtbarkeit (30 s)', en: 'Emergency Rift: invisibility duration (30 s)' } },
        { key: 'hha_void.escape_cooldown', def: '1200.0', desc: { de: 'Notriss: Abklingzeit (60 s)', en: 'Emergency Rift: cooldown (60 s)' } },
        { key: 'hha_void.meteor', def: 'true', desc: { de: 'Meteor Strike an/aus', en: 'Meteor Strike on/off' } },
        { key: 'hha_void.meteor_range', def: '24.0', desc: { de: 'Meteor Strike: Reichweite', en: 'Meteor Strike: range' } },
        { key: 'hha_void.meteor_count', def: '12.0', desc: { de: 'Meteor Strike: Anzahl Meteore (1 bis 32)', en: 'Meteor Strike: number of meteors (1 to 32)' } },
        { key: 'hha_void.meteor_speed', def: '1.3', desc: { de: 'Meteor Strike: Fluggeschwindigkeit', en: 'Meteor Strike: flight speed' } },
        { key: 'hha_void.meteor_explosion_power', def: '2.0', desc: { de: 'Meteor Strike: Explosionsstärke der großen Brocken (0 bis 3)', en: 'Meteor Strike: explosion power of the big rocks (0 to 3)' } },
        { key: 'hha_void.meteor_comet_damage', def: '16.0', desc: { de: 'Meteor Strike: Schaden des Void-Kometen', en: 'Meteor Strike: void comet damage' } },
        { key: 'hha_void.meteor_cooldown', def: '700.0', desc: { de: 'Meteor Strike: Abklingzeit (35 s)', en: 'Meteor Strike: cooldown (35 s)' } },
        { key: 'hha_void.night_passive', def: 'true', desc: { de: 'Kind der Nacht an/aus', en: 'Child of the Night on/off' } },
        { key: 'hha_void.void_link', def: 'true', desc: { de: 'Void Link an/aus', en: 'Void Link on/off' } },
        { key: 'hha_void.link_chance_full', def: '0.2', desc: { de: 'Void Link: Chance auf vollen Schaden', en: 'Void Link: chance for full damage' } },
        { key: 'hha_void.link_chance_two', def: '0.35', desc: { de: 'Void Link: Chance auf 2/3 (der Rest ist 1/3)', en: 'Void Link: chance for 2/3 (the rest is 1/3)' } },
        { key: 'hha_void.link_range', def: '8.0', desc: { de: 'Void Link: Reichweite um das Opfer', en: 'Void Link: range around the victim' } },
        { key: 'hha_void.link_max_targets', def: '4.0', desc: { de: 'Void Link: höchstens so viele Ziele (1 bis 8)', en: 'Void Link: maximum targets (1 to 8)' } },
        { key: 'hha_void.shards', def: 'true', desc: { de: 'Void Shards an/aus', en: 'Void Shards on/off' } },
        { key: 'hha_void.shard_throw_damage', def: '7.0', desc: { de: 'Void Shards: Schaden pro Treffer', en: 'Void Shards: damage per hit' } },
        { key: 'hha_void.shard_throw_speed', def: '1.6', desc: { de: 'Void Shards: Fluggeschwindigkeit', en: 'Void Shards: flight speed' } },
        { key: 'hha_void.shard_range', def: '22.0', desc: { de: 'Void Shards: Wurfweite', en: 'Void Shards: throw range' } },
        { key: 'hha_void.shard_chain_range', def: '10.0', desc: { de: 'Void Shards: Sprungweite zum nächsten Gegner', en: 'Void Shards: jump range to the next enemy' } },
        { key: 'hha_void.shard_max_jumps', def: '6.0', desc: { de: 'Void Shards: Anzahl Sprünge', en: 'Void Shards: number of jumps' } },
        { key: 'hha_void.shard_throw_cooldown', def: '6.0', desc: { de: 'Void Shards: Abklingzeit zwischen Würfen (0,3 s)', en: 'Void Shards: cooldown between throws (0.3 s)' } },
        { key: 'hha_void.mace_launch', def: 'true', desc: { de: 'Sky Launch an/aus', en: 'Sky Launch on/off' } },
        { key: 'hha_void.mace_launch_power', def: '2.4', desc: { de: 'Sky Launch: Startkraft nach oben', en: 'Sky Launch: upward launch power' } },
        { key: 'hha_void.mace_launch_cooldown', def: '160.0', desc: { de: 'Sky Launch: Abklingzeit (8 s)', en: 'Sky Launch: cooldown (8 s)' } },
        { key: 'hha_void.mace_shock', def: 'true', desc: { de: 'Mace-Schockwelle an/aus', en: 'Mace shockwave on/off' } },
        { key: 'hha_void.mace_shock_range', def: '6.0', desc: { de: 'Mace-Schockwelle: Radius', en: 'Mace shockwave: radius' } },
        { key: 'hha_void.mace_shock_window', def: '200.0', desc: { de: 'Mace-Schockwelle: Zeitfenster nach dem Start (10 s)', en: 'Mace shockwave: window after the launch (10 s)' } },
      ],
    },

    // ------------------------------------------------------------------ Installation
    {
      type: 'install',
      title: { de: 'Installation', en: 'Installation' },
      steps: [
        { de: 'Fabric Loader (ab 0.19.3) für Minecraft 1.21.11 installieren.', en: 'Install Fabric Loader (0.19.3 or newer) for Minecraft 1.21.11.' },
        { de: 'Fabric API, Fabric Language Kotlin und H&H Armors (ab 0.6.0) in den <code>mods</code>-Ordner legen.', en: 'Put Fabric API, Fabric Language Kotlin and H&H Armors (0.6.0 or newer) into the <code>mods</code> folder.' },
        { de: 'Die HHA-Void-Jar dazulegen. Ein öffentliches Release gibt es noch nicht.', en: 'Add the HHA Void jar. There is no public release yet.' },
        { de: 'Auf Servern gehört die Mod auf den Server und auf jeden Client: Modelle, Effekte und Cutscenes laufen auf dem Client.', en: 'On servers, the mod goes on the server and on every client: models, effects and cutscenes run on the client.' },
        { de: 'Im Spiel findest du alles im Kreativ-Tab „Void’s Armor“, im Überlebensmodus über Void-Barren und Schmiedetisch.', en: 'In game you find everything in the “Void\'s Armor” creative tab, in survival via Void Ingots and the smithing table.' },
      ],
    },
  ],
};
