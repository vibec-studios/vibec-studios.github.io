// HHA Blood: Inhalte der Mod-Seite (Quelle: vibec-studios/hha-blood v0.13.0, Config-Defaults aus BloodAddon.kt).
export default {
  id: 'blood',
  name: 'HHA Blood',
  short: {
    de: 'Blood’s Armor für H&H Armors: Bluten, Nihil, Blutsägen, Bluttornado und ein Bosskampf gegen Cerberus und Minotaurus tief unter dem Nether.',
    en: 'Blood’s Armor for H&H Armors: bleeding, Nihil, Bloodsaws, the Blood Cyclone and a boss fight against Cerberus and the Minotaur deep below the Nether.',
  },
  tagline: {
    de: 'Eine Rüstung, die blutet. Eine Grube, die nie satt wird.',
    en: 'Armour that bleeds. A pit that is never full.',
  },
  accent: '#d81e26',
  accent2: '#ff5e4a',
  version: '0.13.0',
  mc: '1.21.11',
  loader: 'Fabric',
  requires: ['H&H Armors ≥ 0.6.0', 'Fabric API', 'Fabric Language Kotlin'],
  status: { de: 'In Entwicklung', en: 'In development' },
  source: 'https://github.com/vibec-studios/hha-blood',
  series: 'HHA', role: 'addon', icon: 'item/blood_sword.png',
  categories: ['adventure', 'equipment', 'mobs'], // Modrinth-Kategorien für den Vibe Store (tools/store.py)
  hero: { kind: 'boss', model: 'minotaur' },
  intro: {
    de: 'HHA Blood ist ein Addon für H&H Armors. Es bringt <b>Blood’s Armor</b>, ein purpurnes Endgame-Set mit echter Blutung, Lebensraub und Unsichtbarkeit, dazu Blutschwert und Blutstreitkolben. Unter dem Lavameer des Nether liegen die <b>Aderngrotten</b>, ein eigenes Höhlenbiom mit lebenden Blöcken, und in ihrer Mitte die <b>Schlachtgrube</b>: ein Bosskampf in fünf Phasen gegen den Blood Cerberus und den Crimson Minotaur, mit Zwischensequenzen, eigener Musik und einem Labyrinth, in dem du dich im Blut versteckst.',
    en: 'HHA Blood is an addon for H&H Armors. It adds <b>Blood’s Armor</b>, a crimson endgame set with real bleeding, lifesteal and invisibility, plus the Blood Sword and the Blood Mace. Below the Nether’s lava sea lie the <b>Vein Hollows</b>, a cave biome of its own with living blocks, and at their heart the <b>Slaughter Pit</b>: a five-phase boss fight against the Blood Cerberus and the Crimson Minotaur, with cutscenes, its own music and a labyrinth where you hide in the blood.',
  },
  highlights: [
    { de: 'Bluten als echter Statuseffekt: Schaden über Zeit, doppelter Schaden mit Blutsturz', en: 'Bleeding as a real status effect: damage over time, double damage with Hemorrhage' },
    { de: 'Nihil: Gegner schweben, werden ausgesaugt und von einem Blutdorn aufgespießt', en: 'Nihil: enemies float, get drained and impaled on a blood thorn' },
    { de: 'Blutsägen und Bluttornado auf Rechtsklick', en: 'Bloodsaws and the Blood Cyclone on right-click' },
    { de: 'Aderngrotten: ein Höhlenbiom aus Blut unter dem Nether-Lavameer', en: 'Vein Hollows: a cave biome of blood below the Nether lava sea' },
    { de: 'Bosskampf in fünf Phasen: Köpfe brechen, Labyrinth, Faustkampf', en: 'Five-phase boss fight: break heads, a labyrinth, a fist fight' },
  ],
  sections: [
    // ------------------------------------------------------------------ Rüstung und Waffen
    {
      type: 'armor',
      title: { de: 'Blood’s Armor', en: 'Blood’s Armor' },
      lead: {
        de: 'Dunkles Netherit mit leuchtenden Redstone-Zierlinien, die rot pulsieren. Schutzwerte wie Netherit (3/8/6/3), dazu Härte 3,5 und Rückstoßresistenz 0,1; Haltbarkeit 440/640/600/520, feuerfest. Wer ein Teil trägt, blutet sichtbar: Tropfen fallen von den Platten, Schwert und Streitkolben tropfen in der Hand. Blutschwert: 11 Angriffsschaden, Tempo 1,6. Blutstreitkolben: 8 Angriffsschaden, Tempo 1,2. Beide halten 2531 Treffer aus und sind feuerfest. Die Werte im Tooltip folgen live der Server-Config.',
        en: 'Dark netherite with glowing redstone trims that pulse red. Protection like netherite (3/8/6/3), plus toughness 3.5 and knockback resistance 0.1; durability 440/640/600/520, fireproof. Whoever wears a piece bleeds visibly: drops fall off the plates, sword and mace drip in your hand. Blood Sword: 11 attack damage, speed 1.6. Blood Mace: 8 attack damage, speed 1.2. Both last 2531 uses and are fireproof. Tooltip values follow the server config live.',
      },
      armor: 'blood',
      items: [
        {
          tex: 'blood_helmet', frames: 2,
          name: { de: 'Bluthelm', en: 'Blood Helmet' },
          lore: [
            { de: 'Regeneration I', en: 'Regeneration I' },
            { de: 'Blutspürer [Ability 4]: wähle einen Spieler im Umkreis von 250 Blöcken. Eine Blutader, die nur du siehst, führt dich zu ihm', en: 'Blood Tracker [Ability 4]: pick a player within 250 blocks. A vein of blood only you can see leads you to them' },
            { de: 'Jagd dauert 300s, danach 600s Abklingzeit (auch bei vorzeitigem Ende). Die Beute spürt, dass sie gejagt wird', en: 'Hunt lasts 300s, then 600s cooldown (also when ended early). The prey feels that it is hunted' },
          ],
        },
        {
          tex: 'blood_chestplate', frames: 2,
          name: { de: 'Brustplatte des Blutes', en: 'Blood Chestplate' },
          lore: [
            { de: 'Feuerresistenz', en: 'Fire Resistance' },
            { de: 'Ausdauernde Effekte: alle positiven Effekte halten x5 länger. Weben hält immer 480s, Turtle Master (Resistenz) 60s, seine Langsamkeit dauert nur halb so lang', en: 'Enduring Effects: all beneficial effects last x5 longer. Weaving always lasts 480s, Turtle Master (Resistance) 60s and its Slowness only lasts half as long' },
            { set: true, de: 'Set: Ability 1 Nihil. Gegner im Umkreis von 15 Blöcken schweben langsam in die Luft wie nach einem Shulker-Treffer, sind betäubt und werden 3s lang ausgesaugt (Lebensraub) (45s Abklingzeit)', en: 'Set: Ability 1 Nihil. Enemies within 15 blocks float slowly into the air like after a shulker hit, are stunned and drained for 3s (lifesteal) (45s cooldown)' },
            { set: true, de: 'Beim dritten Schlag bricht unter jedem Gegner ein riesiger Blutdorn aus dem Boden und spießt ihn auf (8 Schaden), dann rollt eine Blut-Nova los: 8 Schaden und Blutung für alle', en: 'On the third beat a giant blood thorn bursts out of the ground under every enemy and impales it (8 damage), then a Blood Nova rolls out: 8 damage and bleeding for everyone' },
          ],
        },
        {
          tex: 'blood_leggings', frames: 2,
          name: { de: 'Blutbeinschutz', en: 'Blood Leggings' },
          lore: [
            { de: 'Infektion: 15% Chance beim Treffen, das Ziel bluten zu lassen (15s Abklingzeit)', en: 'Infection: 15% chance on hit to make the target bleed (15s cooldown)' },
            { de: 'Blutspur [Ability 2]: tauche in Blut ein und sei 7s komplett unsichtbar, auch Rüstung und Items in der Hand (60s Abklingzeit)', en: 'Blood Trail [Ability 2]: dive into blood, fully invisible for 7s, armour and held items included (60s cooldown)' },
            { de: 'Gegner in 5 Blöcken nehmen 6 Schaden, bluten und bekommen 4s Langsamkeit VI', en: 'Enemies within 5 blocks take 6 damage, bleed and get 4s of Slowness VI' },
          ],
        },
        {
          tex: 'blood_boots', frames: 2,
          name: { de: 'Blutstiefel', en: 'Blood Boots' },
          lore: [
            { de: 'Fallschadenimmunität & Geschwindigkeit I', en: 'Fall damage immunity & Speed I' },
            { de: 'Blutrausch: einen blutenden Gegner zu treffen gibt 3s lang Geschwindigkeit II', en: 'Blood Rush: hitting a bleeding enemy grants Speed II for 3s' },
          ],
        },
        {
          tex: 'blood_sword', frames: 16,
          name: { de: 'Blutschwert', en: 'Blood Sword' },
          lore: [
            { de: 'Blutsturz: blutende Gegner nehmen x2 Schaden von allen Treffern', en: 'Hemorrhage: bleeding enemies take x2 damage from all hits' },
            { de: 'Rechtsklick: Blutsägen. 2 kreisende Sägeblätter, die an Wänden abprallen und von Gegner zu Gegner springen, nie zu dir zurück (6 Schaden, 20s Abklingzeit)', en: 'Right-click: Bloodsaws. 2 spinning saw blades that bounce off walls and ricochet from enemy to enemy, never back to you (6 dmg, 20s cooldown)' },
            { de: 'Beide Sägen treffen gemeinsam: Blutfontäne (Blutung + 8 Schaden in 5 Blöcken)', en: 'Both saws hit together: Blood Fountain (bleed + 8 dmg in 5 blocks)' },
          ],
        },
        {
          tex: 'blood_mace', frames: 17,
          name: { de: 'Blutstreitkolben', en: 'Blood Mace' },
          lore: [
            { de: 'Volle Mace-Schmettermechanik inklusive', en: 'Full mace smash mechanics included' },
            { de: 'Rechtsklick: Bluttornado. Der Streitkolben schwebt kreiselnd über der Stelle und beschießt alles im markierten Kreis von 10 Blöcken mit Blutgeschossen (5 Schaden + Infektion, 40s Abklingzeit)', en: 'Right-click: Blood Cyclone. The mace hovers spinning above the spot and shoots blood bolts at everything inside the marked circle of 10 blocks (5 dmg + Infection, 40s cooldown)' },
          ],
        },
        {
          tex: 'blood_ingot', frames: 14,
          name: { de: 'Blutbarren', en: 'Blood Ingot' },
          lore: [
            { de: 'Purpurne Legierung zum Schmieden von Blood’s Armor', en: 'Crimson alloy for smithing Blood’s Armor' },
          ],
        },
        {
          tex: 'blood_offering', frames: 1,
          name: { de: 'Blutopfer', en: 'Blood Offering' },
          lore: [
            { de: 'Auf den Opferaltar in der Schlachtgrube legen, um den Minotaurus und seinen Cerberus erneut herauszufordern', en: 'Place it on the Sanguine Altar in the Slaughter Pit to challenge the Minotaur and his Cerberus again' },
          ],
        },
        {
          tex: 'blood_crystal_shard', frames: 1,
          name: { de: 'Blutkristallsplitter', en: 'Blood Crystal Shard' },
          lore: [],
        },
      ],
      showcase: ['blood_sword', 'blood_mace', 'blood_ingot'],
    },

    // ------------------------------------------------------------------ Herstellung
    {
      type: 'features',
      title: { de: 'Herstellung', en: 'Crafting' },
      items: [
        {
          icon: 'item/blood_ingot.png',
          name: { de: 'Blutbarren', en: 'Blood Ingot' },
          desc: { de: 'Werkbank: 1 Netheritbarren in der Mitte, 4 Redstoneblöcke in den Ecken, 4 Netherwarzenblöcke an den Seiten.', en: 'Crafting table: 1 netherite ingot in the centre, 4 blocks of redstone in the corners, 4 nether wart blocks on the sides.' },
        },
        {
          icon: 'item/blood_chestplate.png',
          name: { de: 'Rüstung', en: 'Armour' },
          desc: { de: 'Schmiedetisch: Netherit-Aufwertung + Netherit-Helm, -Brustplatte, -Hose oder -Stiefel + Blutbarren.', en: 'Smithing table: netherite upgrade + netherite helmet, chestplate, leggings or boots + Blood Ingot.' },
        },
        {
          icon: 'item/blood_sword.png',
          name: { de: 'Blutschwert', en: 'Blood Sword' },
          desc: { de: 'Schmiedetisch: Netherit-Aufwertung + Netheritschwert + Blutbarren.', en: 'Smithing table: netherite upgrade + netherite sword + Blood Ingot.' },
        },
        {
          icon: 'item/blood_mace.png',
          name: { de: 'Blutstreitkolben', en: 'Blood Mace' },
          desc: { de: 'Schmiedetisch: Netherit-Aufwertung + Streitkolben + Blutbarren.', en: 'Smithing table: netherite upgrade + mace + Blood Ingot.' },
        },
        {
          icon: 'item/blood_crystal_shard.png',
          name: { de: 'Blutkristallsplitter', en: 'Blood Crystal Shard' },
          desc: { de: 'Fallen aus Blutkristallhaufen und kleinen Blutkristallen in den Aderngrotten (mit Behutsamkeit bekommst du den Kristall selbst). 4 Splitter ergeben einen Blutkristallblock.', en: 'Drop from blood crystal clusters and small blood crystals in the Vein Hollows (Silk Touch gives you the crystal itself). 4 shards make a block of blood crystal.' },
        },
        {
          icon: 'item/blood_offering.png',
          name: { de: 'Blutopfer', en: 'Blood Offering' },
          desc: { de: 'Werkbank: 1 Ghast-Träne in der Mitte, 4 Blutkristallsplitter an den Seiten, 4 Netherwarzen in den Ecken.', en: 'Crafting table: 1 ghast tear in the centre, 4 blood crystal shards on the sides, 4 nether wart in the corners.' },
        },
      ],
    },

    // ------------------------------------------------------------------ Fähigkeiten
    {
      type: 'abilities',
      title: { de: 'Fähigkeiten', en: 'Abilities' },
      lead: {
        de: 'Die Tasten sind die von H&H Armors (Steuerung, Kategorie HHA): <b>Ability 1 (G)</b> = Nihil, <b>Ability 2 (H)</b> = Blutspur, <b>Ability 4</b> = Blutspürer. Ability 4 ist in HHA ab Werk nicht belegt, die Taste musst du selbst setzen. Ability 3 (U) bleibt HHAs Ultra-Modus. Blutsägen und Bluttornado liegen auf der rechten Maustaste. Abklingzeiten zeigt HHAs HUD mit eigenen Icons.',
        en: 'Keys are those of H&H Armors (Controls, category HHA): <b>Ability 1 (G)</b> = Nihil, <b>Ability 2 (H)</b> = Blood Trail, <b>Ability 4</b> = Blood Tracker. HHA leaves Ability 4 unbound, so bind it yourself. Ability 3 (U) stays HHA’s Ultra mode. Bloodsaws and the Blood Cyclone are on the right mouse button. Cooldowns show up in HHA’s HUD with their own icons.',
      },
      items: [
        {
          name: { de: 'Bluten', en: 'Bleeding' },
          key: null,
          icon: 'hud/bleeding.png',
          desc: {
            de: 'Der Kern des Sets. Bluten ist ein echter Statuseffekt mit Icon: Die Wunde reißt mit einem Spritzerring und eigenem Geräusch auf, jede Sekunde spritzt eine Arterie zur Seite und das Opfer nimmt Schaden, ständig läuft Blut am Körper herunter. Wer blutet, gibt dem Angreifer den Kill und die Todesnachricht. Milch oder alles, was den Effekt entfernt, stoppt auch die Blutung. Ausgelöst wird es durch Infektion, Blutspur, Blutsägen und Bluttornado; die Blut-Nova blutet 7 Sekunden mit 1,25 Schaden pro Sekunde, die Blutfontäne 8 Sekunden mit 1,5.',
            en: 'The core of the set. Bleeding is a real status effect with an icon: the wound tears open with a ring of splatter and its own sound, every second an artery spurts to one side and the victim takes damage, blood keeps running down the body. Whoever made the target bleed gets the kill and the death message. Milk, or anything that removes the effect, also stops the bleeding. It is caused by Infection, Blood Trail, Bloodsaws and the Blood Cyclone; the Blood Nova bleeds for 7 seconds at 1.25 damage per second, the Blood Fountain for 8 seconds at 1.5.',
          },
          stats: [
            { k: { de: 'Dauer', en: 'Duration' }, v: '5 s' },
            { k: { de: 'Schaden', en: 'Damage' }, v: '1/s (½ ♥)' },
          ],
        },
        {
          name: { de: 'Nihil (Set-Bonus)', en: 'Nihil (set bonus)' },
          key: 'Ability 1',
          icon: 'hud/nihil.png',
          desc: {
            de: 'Nur mit allen vier Teilen. Alle Gegner im Umkreis werden gefangen: Sie steigen langsam senkrecht auf (Schwebe-Effekt), sind blind, gelähmt und können nichts abbauen, ein rotierender Sägering schließt sich um jeden. Blutadern ziehen ihnen das Leben heraus und heilen dich. Drei „Nihil“-Schläge mit Glocke, Druckwelle und Blutflammen: Beim dritten hält jedes Opfer in der Luft an, ein riesiger Blutdorn bricht in drei Stößen aus dem Boden und spießt es auf. Dann rollt die Blut-Nova los und lässt alle bluten. Das Aussaugen dauert 3 Sekunden, mit dem Dorn mindestens 4,5. Ohne Gegner in Reichweite passiert nichts und es gibt keine Abklingzeit.',
            en: 'Full set only. Every enemy in range is caught: they rise slowly straight up (Levitation), are blinded, frozen and cannot mine, a spinning saw ring closes around each of them. Veins of blood drain their life and heal you. Three “Nihil” beats with bell, shock wave and blood flames: on the third every victim stops in mid-air, a giant blood thorn bursts out of the ground in three thrusts and impales it. Then the Blood Nova rolls out and makes everyone bleed. The drain lasts 3 seconds, at least 4.5 with the thorn. With no enemy in range nothing happens and there is no cooldown.',
          },
          stats: [
            { k: { de: 'Reichweite', en: 'Range' }, v: '15' },
            { k: { de: 'Aussaugen', en: 'Drain' }, v: '10 (5 ♥) / Ziel' },
            { k: { de: 'Lebensraub', en: 'Lifesteal' }, v: '60 %' },
            { k: { de: 'Dauer', en: 'Duration' }, v: '3 s' },
            { k: { de: 'Blutdorn', en: 'Blood thorn' }, v: '8' },
            { k: { de: 'Blut-Nova', en: 'Blood Nova' }, v: '8 + Bluten' },
            { k: { de: 'Abklingzeit', en: 'Cooldown' }, v: '45 s' },
          ],
        },
        {
          name: { de: 'Blutspur', en: 'Blood Trail' },
          key: 'Ability 2',
          icon: 'hud/trail.png',
          desc: {
            de: 'Ein Blutbad öffnet sich unter dir. Alle anderen sehen deinen Doppelgänger in die Lache sinken, du selbst bist komplett unsichtbar: Andere Spieler bekommen leere Ausrüstung geschickt, also verschwinden auch Rüstung und Items in der Hand, selbst Sprint-Partikel fehlen. Dazu bekommst du Geschwindigkeit II. Gegner um dich nehmen Schaden, bluten und kriechen mit Langsamkeit VI; wer in der Lache bleibt, wird weiter gebremst. Kurz vor Ende öffnet sich am neuen Standort ein Bad und du steigst daraus auf.',
            en: 'A pool of blood opens beneath you. Everyone else sees your double sink into it while you are fully invisible: other players are sent empty equipment, so armour and held items vanish too, even sprint particles are gone. You also get Speed II. Enemies around you take damage, bleed and crawl with Slowness VI; whoever stays in the pool keeps being slowed. Shortly before the end a pool opens where you stand and you rise out of it.',
          },
          stats: [
            { k: { de: 'Unsichtbar', en: 'Invisible' }, v: '7 s' },
            { k: { de: 'Radius', en: 'Radius' }, v: '5' },
            { k: { de: 'Schaden', en: 'Damage' }, v: '6 + Bluten' },
            { k: { de: 'Langsamkeit VI', en: 'Slowness VI' }, v: '4 s' },
            { k: { de: 'Abklingzeit', en: 'Cooldown' }, v: '60 s' },
          ],
        },
        {
          name: { de: 'Blutspürer', en: 'Blood Tracker' },
          key: 'Ability 4',
          icon: 'hud/tracker.png',
          desc: {
            de: 'Öffnet eine Liste der Spieler in Reichweite. Wählst du jemanden, führt dich eine pulsierende Blutader zu ihm, die nur du siehst, über ihm steht ein purpurnes Leuchtfeuer, eine Zeile im HUD zeigt Richtung, Entfernung und Restzeit. Die Beute merkt es: eine Meldung, alle 4 Sekunden ein Herzschlag und ein pulsierender roter Bildschirmrand. Wer sie jagt, erfährt sie nicht. Die Jagd lässt sich vorzeitig beenden, die volle Abklingzeit läuft trotzdem ab dem Ende.',
            en: 'Opens a list of the players in range. Pick someone and a pulsing vein of blood that only you can see leads you there, a crimson beacon stands above them and a line in the HUD shows direction, distance and time left. The prey notices: a message, a heartbeat every 4 seconds and a pulsing red screen edge. They never learn who hunts them. You can end a hunt early, the full cooldown still runs from that moment.',
          },
          stats: [
            { k: { de: 'Auswahl', en: 'Range' }, v: '250 (0 = Dimension)' },
            { k: { de: 'Jagd', en: 'Hunt' }, v: '5 min' },
            { k: { de: 'Abklingzeit', en: 'Cooldown' }, v: '10 min' },
          ],
        },
        {
          name: { de: 'Infektion', en: 'Infection' },
          key: null,
          icon: null,
          desc: {
            de: 'Passiv mit dem Blutbeinschutz. Ein voll aufgeladener Nahkampftreffer kann das Ziel bluten lassen; die Wunde öffnet sich mit Schnittspuren, Blutfontäne und Herzschlag. Im Ultra-Modus von HHA entfällt die Abklingzeit.',
            en: 'Passive with the Blood Leggings. A fully charged melee hit can make the target bleed; the wound opens with slash marks, a burst of blood and a heartbeat. In HHA’s Ultra mode there is no cooldown.',
          },
          stats: [
            { k: { de: 'Chance', en: 'Chance' }, v: '15 %' },
            { k: { de: 'Abklingzeit', en: 'Cooldown' }, v: '15 s' },
          ],
        },
        {
          name: { de: 'Ausdauernde Effekte', en: 'Enduring Effects' },
          key: null,
          icon: null,
          desc: {
            de: 'Passiv mit der Brustplatte. Jeder positive Effekt, der dich trifft, hält fünfmal so lange, höchstens 20 Minuten. Weben hält immer 8 Minuten, die Resistenz aus Turtle Master 1 Minute, seine Langsamkeit nur halb so lang. Resistenz aus (verzauberten) Goldäpfeln wird nicht verlängert, die übrigen Apfel-Effekte schon. Die Effekte der Rüstung selbst werden nicht gestreckt.',
            en: 'Passive with the chestplate. Every beneficial effect that reaches you lasts five times as long, at most 20 minutes. Weaving always lasts 8 minutes, Turtle Master’s Resistance 1 minute and its Slowness only half as long. Resistance from (enchanted) golden apples is not extended, the other apple effects are. The armour’s own effects are not stretched.',
          },
          stats: [
            { k: { de: 'Faktor', en: 'Factor' }, v: '×5' },
            { k: { de: 'Obergrenze', en: 'Cap' }, v: '20 min' },
          ],
        },
        {
          name: { de: 'Blutrausch', en: 'Blood Rush' },
          key: null,
          icon: null,
          desc: {
            de: 'Passiv mit den Blutstiefeln. Triffst du einen Gegner, der schon blutet, bekommst du Geschwindigkeit II. Eine Wunde, die erst dieser Treffer öffnet, zählt noch nicht. Die Stiefel geben außerdem dauerhaft Geschwindigkeit I und verhindern jeden Fallschaden.',
            en: 'Passive with the Blood Boots. Hit an enemy who is already bleeding and you get Speed II. A wound opened by that very hit does not count yet. The boots also give permanent Speed I and prevent all fall damage.',
          },
          stats: [{ k: { de: 'Geschwindigkeit II', en: 'Speed II' }, v: '3 s' }],
        },
        {
          name: { de: 'Blutsturz', en: 'Hemorrhage' },
          key: null,
          icon: null,
          desc: {
            de: 'Die Passive des Blutschwerts: Blutende Gegner nehmen doppelten Schaden von allen Treffern. Blutungen, die ein Boss der Schlachtgrube verursacht, zählen nicht, sonst würde er seinen eigenen Schaden verdoppeln.',
            en: 'The Blood Sword’s passive: bleeding enemies take double damage from all hits. Bleeding caused by a Slaughter Pit boss does not count, otherwise it would double the boss’ own damage.',
          },
          stats: [{ k: { de: 'Multiplikator', en: 'Multiplier' }, v: '×2' }],
        },
        {
          name: { de: 'Blutsägen', en: 'Bloodsaws' },
          key: null,
          icon: 'hud/saws.png',
          desc: {
            de: 'Rechtsklick mit dem Blutschwert. Zwei breite, leuchtende 3D-Sägeblätter fliegen wie Frisbees, leicht gespreizt. Sie schneiden durch Gegner und lassen sie bluten, prallen an Wänden ab und springen von Gegner zu Gegner, nie zurück zu dir. Nach 3,5 Sekunden lösen sie sich auf. Treffen beide Sägen innerhalb von 0,6 Sekunden denselben Gegner, bricht eine <b>Blutfontäne</b> aus.',
            en: 'Right-click with the Blood Sword. Two wide, glowing 3D saw blades fly like frisbees, slightly spread. They cut through enemies and make them bleed, bounce off walls and ricochet from enemy to enemy, never back to you. They dissolve after 3.5 seconds. If both saws hit the same enemy within 0.6 seconds, a <b>Blood Fountain</b> erupts.',
          },
          stats: [
            { k: { de: 'Schaden', en: 'Damage' }, v: '6 + Bluten' },
            { k: { de: 'Abpraller', en: 'Bounces' }, v: '5' },
            { k: { de: 'Blutfontäne', en: 'Blood Fountain' }, v: '8, Radius 5' },
            { k: { de: 'Abklingzeit', en: 'Cooldown' }, v: '20 s' },
          ],
        },
        {
          name: { de: 'Bluttornado (Blood Cyclone)', en: 'Blood Cyclone' },
          key: null,
          icon: 'hud/cyclone.png',
          desc: {
            de: 'Rechtsklick mit dem Blutstreitkolben. Der Streitkolben fliegt hoch und bleibt über der Wurfstelle stehen, 17 Blöcke hoch (unter einer Decke 2 Blöcke darunter), und kreiselt schräg wie ein Kreisel. Ein gestrichelter Blutring mit Flammen markiert am Boden genau die Trefferzone. Er feuert Wellen von Blutgeschossen in den Kreis und zielsuchende Geschosse auf jeden Gegner darin; jeder Treffer löst Infektion aus. Danach fliegt er zurück in deine Hand. Das echte Item bleibt die ganze Zeit in deinem Inventar.',
            en: 'Right-click with the Blood Mace. The mace flies up and stays above the spot, 17 blocks high (2 blocks below a ceiling), spinning tilted like a top. A dashed ring of blood and flames on the ground marks exactly where you can be hit. It fires volleys of blood bolts into the circle and homing bolts at every enemy inside it; every hit triggers Infection. Then it flies back into your hand. The real item stays in your inventory the whole time.',
          },
          stats: [
            { k: { de: 'Radius', en: 'Radius' }, v: '10' },
            { k: { de: 'Schaden', en: 'Damage' }, v: '5 + Infektion' },
            { k: { de: 'Dauer', en: 'Duration' }, v: '4 s' },
            { k: { de: 'Abklingzeit', en: 'Cooldown' }, v: '40 s' },
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Welt
    {
      type: 'world',
      title: { de: 'Die Aderngrotten', en: 'The Vein Hollows' },
      lead: {
        de: 'Pro Welt gibt es genau eine Region, im Nether 10 000 bis 15 000 Blöcke vom Nullpunkt entfernt, rund einen Kilometer groß und unter Y 64. Die Lage folgt aus dem Welt-Seed. Nur neu erzeugte Nether-Chunks bekommen das Biom. Arenen aus älteren Versionen der Mod baut sie beim ersten Besuch automatisch auf den neuen Stand um.',
        en: 'There is exactly one region per world, in the Nether 10,000 to 15,000 blocks from 0/0, about a kilometre across and below Y 64. Its position comes from the world seed. Only newly generated Nether chunks get the biome. Arenas from older versions of the mod are rebuilt to the current design on the first visit.',
      },
      cards: [
        {
          name: { de: 'Aderngrotten', en: 'Vein Hollows' },
          desc: {
            de: 'Ein Höhlenbiom aus Blutstein unter dem Nether-Lavameer. Große Kavernen sind durch gewundene Galerien verbunden, mit Terrassen, ausgestellten Säulen, Stalaktiten und Seen aus <b>Blut</b>, einer eigenen Flüssigkeit: Man schwimmt und ertrinkt darin wie in Wasser, aber kein Eimer kann es aufnehmen. Leuchtende Adern ziehen sich über Wände und Decken, Blutkristalle wachsen aus dem Fels, halb vergrabene Rippenkäfige liegen auf ebenem Boden. Roter Nebel und ein Herzschlag aus der Tiefe.',
            en: 'A cave biome of blood stone below the Nether’s lava sea. Big caverns are linked by winding galleries, with terraces, flared pillars, stalactites and lakes of <b>blood</b>, a fluid of its own: you swim and drown in it like water, but no bucket can take it. Glowing arteries run over walls and ceilings, blood crystals grow out of the rock, half-buried rib cages lie on level ground. Red fog and a heartbeat from the deep.',
          },
          colors: ['#4b1119', '#811415', '#620d18', '#62020c', '#e0303a', '#ff6e3d'],
        },
        {
          name: { de: 'Die Schlachtgrube', en: 'The Slaughter Pit' },
          desc: {
            de: 'Das Kolosseum des Minotaurus: eine Kuppel mit 44 Blöcken Radius und 42 Blöcken Höhe. In der Mitte ein Labyrinth-Muster im Boden, ein Ring aus acht Säulen als Deckung, Tribünen mit Feuerschalen und einem Skelett-Publikum, der Thronbalkon im Norden mit dem Opferaltar davor, darunter der Zwinger des Cerberus hinter einem Fallgitter. Unter der Kuppel schlägt ein riesiges Herz, Augen in den Wänden folgen dir. Die Arena lässt sich weder abbauen noch sprengen; alles, was der Kampf verändert, wird danach wiederhergestellt.',
            en: 'The Minotaur’s colosseum: a dome with a radius of 44 blocks and a height of 42. A labyrinth pattern in the middle of the floor, a ring of eight pillars as cover, stands with braziers and an audience of skeletons, the throne balcony in the north with the offering altar in front of it and the Cerberus’ kennel behind a portcullis below. A giant heart beats under the dome, eyes in the walls follow you. The arena cannot be mined or blown up; everything the fight changes is restored afterwards.',
          },
          colors: ['#481018', '#4f121a', '#4c1018', '#c0161f', '#983434', '#ff6e3d'],
        },
        {
          name: { de: 'Der Weg zur Grube', en: 'The way to the pit' },
          desc: {
            de: 'Über dem Lavameer steht <b>Das Gerippe</b>: ein riesiger Brustkorb aus Knochen auf einem Platz, mit leuchtenden Adern und zwei Geysiren aus aufsteigendem Blut. Darunter führt <b>Der Abstieg</b>, ein Treppenturm mit Wendeltreppe um einen Blut-Aufzug, in die Tiefe. Von dort zieht sich der geschlossene <b>Schlachtweg</b> rund 66 Blöcke zur Grube: Gang der Gefesselten, Halle der Hörner, die Knochenbrücke über den Blutschlund, die große Treppe und das Schädeltor. Der Herzschlag wird mit jedem Schritt lauter. Ein beleuchteter Prozessionsring umläuft die Arena, in neuen Welten führen fünf Straßen mit leuchtenden Pfeilen vom Rand der Region dorthin.',
            en: 'Above the lava sea stands <b>the Rib Cage</b>: a giant ribcage of bone on a plaza, with glowing veins and two geysers of rising blood. Below it <b>the Descent</b>, a stair tower with a spiral stair around a blood elevator, leads down. From there the closed <b>Slaughter Road</b> runs about 66 blocks to the pit: the Hall of the Chained, the Hall of Horns, the bone bridge over the Blood Gorge, the great stair and the Skull Gate. The heartbeat grows louder with every step. A lit procession ring runs around the arena, and in new worlds five roads with glowing chevrons lead there from the edge of the region.',
          },
          colors: ['#481018', '#4b1119', '#811415', '#62020c', '#ff6e3d'],
        },
        {
          name: { de: 'Lebende Blöcke', en: 'Living blocks' },
          desc: {
            de: '<b>Wachendes Auge</b>: ein Fleischblock, dessen Auge dir folgt und blinzelt. <b>Strömendes Blut</b>: ein Vorhang aus fallendem Blut; die aufsteigende Variante trägt dich wie ein Aufzug nach oben, Schleichen lässt dich langsam sinken. <b>Blutschlot</b>: schleudert dich in die Luft. <b>Blutglut</b>: ein leuchtender Blutklumpen mit Lichtstufe 15. <b>Geronnenes Blut</b>: bremst wie Honig. <b>Aderstein</b>: pulsiert im Herzschlag. Dazu Blutstein mit polierter, Ziegel- und gemeißelter Variante samt Treppe, Stufe und Mauer, Blutkristallblock, Blutkristallhaufen und der Opferaltar.',
            en: '<b>Watching Eye</b>: a flesh block whose eye follows you and blinks. <b>Pouring Blood</b>: a curtain of falling blood; the rising kind carries you up like an elevator, sneak to sink slowly. <b>Blood Vent</b>: hurls you into the air. <b>Blood Glow</b>: a glowing clot of blood with light level 15. <b>Clotted Blood</b>: slows you like honey. <b>Vein Stone</b>: pulses with a heartbeat. Plus blood stone with polished, brick and chiseled variants including stairs, slab and wall, the block of blood crystal, blood crystal clusters and the Sanguine Altar.',
          },
          colors: ['#983434', '#a3141e', '#ff6e3d', '#7e1620', '#9a1b1a', '#c0161f'],
        },
      ],
    },

    // ------------------------------------------------------------------ Bosskampf
    {
      type: 'boss',
      title: { de: 'Die Schlachtgrube', en: 'The Slaughter Pit' },
      lead: {
        de: 'Fünf Phasen, zwei Bosse. Asterion, den Theseus einst in seinem Labyrinth erschlug, bekam von Hades eine neue Grube und den Hund von seinem Tor. Zuerst kämpfst du gegen den Blood Cerberus, dann steigt der Crimson Minotaur von seinem Balkon. Boss-Treffer durchdringen Rüstung größtenteils (sie zieht höchstens 35 % ab), Schutz und Resistenz wirken normal; ein erhobener Schild blockt Nahkampfhiebe, bis er gebrochen wird.',
        en: 'Five phases, two bosses. Asterion, once slain by Theseus in his labyrinth, was given a new pit by Hades, and the hound from his gate. First you fight the Blood Cerberus, then the Crimson Minotaur jumps down from his balcony. Boss hits mostly pierce armour (it takes off at most 35 %), Protection and Resistance work as usual; a raised shield blocks melee blows until it is broken.',
      },
      bosses: [
        {
          id: 'cerberus',
          model: 'cerberus',
          texture: null,
          name: { de: 'Blood Cerberus', en: 'Blood Cerberus' },
          sub: { de: 'Der dreiköpfige Wächter', en: 'The Three-Headed Guardian' },
          color: '#f0602a',
          segments: 2,
          desc: {
            de: 'Der Höllenhund vom Tor der Toten, seit dreihundert Jahren Wächter der Grube. Jeder Kopf hat eine eigene Gabe und eine eigene Lebensleiste: <b>Der Reißer</b> (rechts) beißt Wunden, die bluten, <b>Der Flammenschlund</b> (Mitte) speit Feuer, <b>Der Heuler</b> (links) lähmt mit seinem Heulen jeden, der ihn sehen kann. Er verkettet seine Angriffe: Auf ein Heulen folgt ein Sprung auf den, der erstarrt ist, auf einen Sprung ein Biss aller drei Köpfe. Wer Abstand hält, wird mit zielsuchenden Höllenfeuerkugeln beschossen.',
            en: 'The hellhound from the gate of the dead, guardian of the pit for three hundred years. Each head has its own gift and its own health bar: <b>the Render</b> (right) bites wounds that bleed, <b>the Furnace Maw</b> (middle) breathes fire, <b>the Howler</b> (left) paralyses everyone who can see it. It chains its attacks: a howl is followed by a pounce on whoever froze, a pounce by a snap of all three heads. Whoever keeps their distance is shot at with homing hellfire orbs.',
          },
          trick: {
            de: 'Ziel auf die Köpfe: Körpertreffer zählen nur zu 30 %. Ein gebrochener Kopf hängt schlaff herab und sein Angriff fällt weg: ohne Reißer keine blutigen Bisse, ohne Flammenschlund kein Feuer und kein Feuerkreis, ohne Heuler keine Lähmung. Gegen das Heulen hilft eine Säule oder Wand zwischen dir und dem Heuler. Über Schockringe springst du, aus einem Feuerkreis kommst du durch die Lücke, solange er offen ist, oder hinter den Cerberus.',
            en: 'Aim for the heads: body hits only count 30 %. A broken head hangs limp and its attack is gone: without the Render no bleeding bites, without the Furnace Maw no fire and no ring of fire, without the Howler no paralysis. A pillar or wall between you and the Howler protects you from the howl. Jump over shock rings, and leave a ring of fire through its gap while it is open, or get behind the Cerberus.',
          },
          where: {
            de: 'Im Zwinger hinter dem Fallgitter unter dem Thronbalkon der Schlachtgrube. Der Minotaurus ruft ihn im Intro heraus.',
            en: 'In the kennel behind the portcullis below the throne balcony of the Slaughter Pit. The Minotaur calls it out in the intro.',
          },
          loot: {
            de: 'Er selbst lässt nichts fallen. Nach dem Sieg über den Minotaurus bekommt jeder Spieler beim ersten Mal die drei Köpfe als Trophäen: Der Reißer, Der Flammenschlund und Der Heuler.',
            en: 'It drops nothing itself. After the Minotaur is beaten, every player gets the three heads as trophies on their first victory: the Ripper, the Flame Maw and the Howler.',
          },
          phases: [
            {
              name: { de: 'I · Der Wächter', en: 'I · The Guardian' },
              desc: {
                de: 'Jeder Kopf hat 110 Lebenspunkte. Die Phase endet, sobald zwei Köpfe gebrochen sind. Biss, Dreifachbiss, Feueratem mit brennenden Flächen, Heulen, Sprung, Ansturm und Höllenfeuerkugeln. Der Minotaurus sieht vom Balkon zu und spottet. Dann bricht der Cerberus zusammen, sein Herr befiehlt ihm aufzustehen und lässt ihn das Blut der Grube trinken.',
                en: 'Each head has 110 health. The phase ends as soon as two heads are broken. Bite, triple bite, fire breath with burning patches, howl, pounce, charge and hellfire orbs. The Minotaur watches from his balcony and mocks you. Then the Cerberus collapses, its master orders it to rise and makes it drink the blood of the pit.',
              },
            },
            {
              name: { de: 'II · Entfesselt', en: 'II · Unleashed' },
              desc: {
                de: 'Alle drei Köpfe glühen wieder, jeder mit 125 Lebenspunkten, und alle drei müssen brechen. Er greift ein Viertel schneller an, zieht beim Ansturm eine Feuerspur, schlägt beim Landen Schockringe und bekommt neue Angriffe: Feuer-Nova, Blutgeysire mit Warnkreisen, Dreifach-Odem und den Feuerkreis. Sein Heulen lähmt länger.',
                en: 'All three heads burn again, each with 125 health, and all three have to break. It attacks a quarter faster, leaves a fire trail when it charges, sends out shock rings when it lands and gains new attacks: fire nova, blood geysers with warning circles, triple breath and the ring of fire. Its howl paralyses for longer.',
              },
            },
          ],
          moves: [
            { n: { de: 'Biss (Bluten, Feuer oder Langsamkeit je nach Kopf)', en: 'Bite (bleeding, fire or slowness depending on the head)' }, p: ['idle', 'bite_draw', 'bite', 'idle'] },
            { n: { de: 'Dreifachbiss', en: 'Triple snap' }, p: ['bite_draw', 'snap_bleed', 'snap_flame', 'snap_howl'] },
            { n: { de: 'Feueratem', en: 'Fire breath' }, p: ['idle', 'breath_rear', 'breath', 'idle'] },
            { n: { de: 'Lähmendes Heulen', en: 'Paralysing howl' }, p: ['idle', 'howl_gather', 'howl', 'idle'] },
            { n: { de: 'Sprung', en: 'Pounce' }, p: ['pounce_coil', 'pounce_launch', 'pounce_fall', 'pounce_land'] },
            { n: { de: 'Ansturm', en: 'Charge' }, p: ['charge_wind', 'charge', 'charge_skid', 'idle'] },
            { n: { de: 'Höllenfeuerkugeln', en: 'Hellfire orbs' }, p: ['idle', 'orb_draw', 'orb_spit', 'idle'] },
            { n: { de: 'Feuer-Nova (Phase II)', en: 'Fire nova (phase II)' }, p: ['idle', 'nova_rear', 'nova_slam', 'growl'] },
            { n: { de: 'Blutgeysire (Phase II)', en: 'Blood geysers (phase II)' }, p: ['idle', 'howl_gather', 'geysers', 'idle'] },
            { n: { de: 'Dreifach-Odem (Phase II)', en: 'Triple breath (phase II)' }, p: ['triple_rear', 'triple_left', 'triple_right', 'idle'] },
            { n: { de: 'Feuerkreis (Phase II)', en: 'Ring of fire (phase II)' }, p: ['ring_summon', 'pounce_coil', 'ring_launch', 'nova_slam'] },
            { n: { de: 'Zusammenbruch und Erwachen', en: 'Collapse and rise' }, p: ['lying', 'pounce_coil', 'rise_howl', 'nova_slam'] },
          ],
        },
        {
          id: 'minotaur',
          model: 'minotaur',
          texture: null,
          name: { de: 'Crimson Minotaur', en: 'Crimson Minotaur' },
          sub: { de: 'Der Schlächter', en: 'The Butcher' },
          color: '#e02010',
          segments: 3,
          desc: {
            de: 'Asterion, ein riesiger Stierkrieger mit Zweihandaxt. Er spaltet den Boden (Blutspalten), fegt, stößt mit den Hörnern und stürmt vor allem durch die Arena: Schilde brechen, Labyrinthmauern bersten. Jeder Treffer, den er landet, macht ihn schneller (Raserei bis Stufe 10); trifft er eine Weile nicht, kühlt er ab. Er hat 1024 Lebenspunkte, das Maximum von Minecraft, nimmt aber nur halben Schaden, dazu 14 Rüstung und 8 Härte. Er spricht und spottet, und ob du Blood’s Armor trägst oder eine Hermesfeder bei dir hast, merkt er sofort.',
            en: 'Asterion, a giant bull warrior with a two-handed axe. He splits the floor (blood fissures), sweeps, gores with his horns and above all charges through the arena: shields break, labyrinth walls burst. Every hit he lands makes him faster (fury up to level 10); if he misses for a while he cools down. He has 1024 health, Minecraft’s maximum, but only takes half damage, plus 14 armour and 8 toughness. He talks and mocks, and he notices at once whether you wear Blood’s Armor or carry a feather of Hermes.',
          },
          trick: {
            de: 'Lock seinen Ansturm in eine Säule: Sie zerbricht, er ist 2,75 Sekunden betäubt und nimmt solange 1,5-fachen Schaden (gegen eine Wand 1,9 Sekunden). Weich dem Spaltschlag aus: Verfehlt er, steckt die Axt im Boden und er zerrt 2,3 Sekunden daran, auch das gibt freie Treffer. Hat er dich gepackt, befreien 35 Schaden auf ihn dich. Im Labyrinth: schleichen, nicht rennen, im Blut verschwinden und von hinten zuschlagen.',
            en: 'Lure his charge into a pillar: it shatters, he is stunned for 2.75 seconds and takes 1.5× damage meanwhile (into a wall, 1.9 seconds). Dodge the cleave: if he misses, the axe is stuck in the floor and he tugs at it for 2.3 seconds, free hits again. If he grabs you, 35 damage on him sets you free. In the labyrinth: sneak, do not run, vanish into the blood and strike from behind.',
          },
          where: {
            de: 'Auf seinem Thron auf dem Balkon im Norden der Schlachtgrube. Er erhebt sich, sobald jemand die Kuppel betritt.',
            en: 'On his throne on the balcony in the north of the Slaughter Pit. He rises as soon as someone enters the dome.',
          },
          loot: {
            de: 'Direkt ins Inventar. Erster Sieg je Spieler: 6 Blutbarren, 2 Netheritbarren, 2 Netherit-Aufwertungen, 12 Blutkristallsplitter und die drei Köpfe des Cerberus. Jeder weitere Sieg: zu 50 % 1 Blutbarren und 3 bis 6 Splitter. Zum Abschluss stellt Hermes einen Brief von Hades zu. Danach lässt sich der Kampf mit einem Blutopfer am Opferaltar neu starten.',
            en: 'Straight into your inventory. First victory per player: 6 Blood Ingots, 2 netherite ingots, 2 netherite upgrade templates, 12 blood crystal shards and the three heads of the Cerberus. Every later victory: a 50 % chance of 1 Blood Ingot plus 3 to 6 shards. Finally Hermes delivers a letter from Hades. Afterwards a Blood Offering on the Sanguine Altar starts the fight again.',
          },
          phases: [
            {
              name: { de: 'III · Der Schlächter', en: 'III · The Butcher' },
              desc: {
                de: 'Bis 66 % seiner Lebenspunkte. Spaltschlag, Fegen, Hornstoß, Packen und der Ansturm ab 14 Blöcken Abstand (höchstens zweimal am Stück). Aus 12 bis 26 Blöcken wirft er die Axt wie einen Bumerang. Schlägt er einen Spaltschlag ins Leere, steckt die Axt fest.',
                en: 'Down to 66 % of his health. Cleave, sweep, gore, grab and the charge from 14 blocks away (at most twice in a row). From 12 to 26 blocks he throws his axe like a boomerang. If a cleave hits nothing, the axe gets stuck.',
              },
            },
            {
              name: { de: 'IV · Das Labyrinth', en: 'IV · The Labyrinth' },
              desc: {
                de: 'Bis 33 %. Ein Irrgarten wächst in Wellen aus dem Boden: 229 verbundene Zellen, 3 Blöcke breite Gänge, 7 Blöcke hohe Mauern, Sackgassen und lange Wege; nur der Hort in der Mitte bleibt offen. Die Spieler landen weit verteilt in den Gängen. Jeder bekommt Blutspur auf Ability 2, auch ohne Blood-Rüstung: 10 Sekunden unsichtbar, 19 Sekunden Abklingzeit. Im Blut sieht er dich nicht, aber er hört dich: Sprinten bis 13 Blöcke, Gehen 4,5, Landen 6, Schleichen und Stehen gar nicht. Er schnüffelt, folgt Geräuschen, bricht mit Anstürmen durch die Mauern und redet ständig. Ein Treffer aus dem Blut ist ein Hinterhalt: dreifacher Schaden, er taumelt.',
                en: 'Down to 33 %. A maze grows out of the floor in waves: 229 connected cells, corridors 3 blocks wide, walls 7 blocks high, dead ends and long paths; only the lair in the middle stays open. The players end up spread far apart in the corridors. Everyone gets Blood Trail on Ability 2, even without Blood armour: 10 seconds invisible, 19 seconds cooldown. In the blood he cannot see you, but he hears you: sprinting up to 13 blocks, walking 4.5, landing 6, sneaking and standing not at all. He sniffs, follows sounds, charges through the walls and never stops talking. A hit out of the blood is an ambush: triple damage, and he reels.',
              },
            },
            {
              name: { de: 'V · Der letzte Stier', en: 'V · The Last Bull' },
              desc: {
                de: 'Bis zum Ende. Er nimmt das Höllenfeuer seines Cerberus in sich auf, sprengt das Labyrinth, wirft die Axt weg und kämpft mit Fäusten, Hörnern und seinem ganzen Gewicht. Er wählt immer den Angriff, den er am längsten nicht benutzt hat; Schilde beantwortet er mit Packen. Blutspur bleibt allen erhalten. Unter 15 % rast er dauerhaft mit voller Raserei.',
                en: 'To the end. He takes in his Cerberus’ hellfire, blows the labyrinth apart, throws his axe away and fights with fists, horns and his whole weight. He always picks the attack he has not used for the longest; shields are answered with a grab. Blood Trail stays with everyone. Below 15 % he stays in full fury for good.',
              },
            },
          ],
          moves: [
            { n: { de: 'Spaltschlag', en: 'Cleave' }, p: ['cleave_raise', 'cleave_peak', 'cleave_hit', 'cleave_deep'] },
            { n: { de: 'Axt steckt fest', en: 'Axe stuck' }, p: ['cleave_deep', 'stuck', 'cleave_deep', 'stuck'] },
            { n: { de: 'Fegen', en: 'Sweep' }, p: ['sweep_wind', 'sweep_coil', 'sweep_mid', 'sweep_end'] },
            { n: { de: 'Hornstoß', en: 'Gore' }, p: ['idle', 'gore_low', 'gore_thrust', 'idle'] },
            { n: { de: 'Ansturm in eine Säule', en: 'Charge into a pillar' }, p: ['charge_windup', 'charge', 'stunned', 'dazed'] },
            { n: { de: 'Packen', en: 'Grab' }, p: ['grab_reach', 'grab_hold', 'grab_high', 'grab_slam'] },
            { n: { de: 'Wirbel (Phase IV)', en: 'Whirlwind (phase IV)' }, p: ['idle', 'whirl_coil', 'whirl_spin', 'idle'] },
            { n: { de: 'Axtwurf', en: 'Axe throw' }, p: ['idle', 'throw_back', 'throw_release', 'idle'] },
            { n: { de: 'Sprungschlag (Phase IV)', en: 'Leap slam (phase IV)' }, p: ['leap_crouch', 'leap_air', 'leap_descend', 'leap_land'] },
            { n: { de: 'Faustkombo (Phase V)', en: 'Fist combo (phase V)' }, p: ['punch_left_back', 'punch_left', 'punch_right_back', 'punch_right'] },
            { n: { de: 'Hammerfaust (Phase V)', en: 'Hammer fist (phase V)' }, p: ['brawl', 'hammer_up', 'hammer_down', 'brawl'] },
            { n: { de: 'Aufwärtshaken (Phase V)', en: 'Uppercut (phase V)' }, p: ['brawl', 'uppercut_coil', 'uppercut', 'brawl'] },
            { n: { de: 'Stampfkette (Phase V)', en: 'Stomp chain (phase V)' }, p: ['brawl', 'stomp_lift', 'stomp', 'brawl'] },
            { n: { de: 'Schulterrempler (Phase V)', en: 'Shoulder tackle (phase V)' }, p: ['brawl', 'tackle_coil', 'tackle', 'brawl'] },
            { n: { de: 'Bodenaufreißen (Phase V)', en: 'Earth rip (phase V)' }, p: ['brawl', 'split_up', 'split_down', 'split_up'] },
            { n: { de: 'Kriegssprung (Phase V)', en: 'War leap (phase V)' }, p: ['slam_crouch', 'slam_air', 'slam_land', 'brawl'] },
            { n: { de: 'Suplex (Phase V)', en: 'Suplex (phase V)' }, p: ['suplex_reach', 'suplex_lift', 'suplex_crash', 'brawl'] },
            { n: { de: 'Wutschrei (Phase V)', en: 'Rage roar (phase V)' }, p: ['brawl', 'rage_inhale', 'rage', 'brawl'] },
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Ablauf
    {
      type: 'steps',
      title: { de: 'So kommst du in die Grube', en: 'How to reach the pit' },
      items: [
        { de: 'Reise in den Nether, 10 000 bis 15 000 Blöcke vom Nullpunkt. Operatoren finden die Arena mit <code>/locate structure hha_blood:single_arena</code>.', en: 'Travel into the Nether, 10,000 to 15,000 blocks from 0/0. Operators find the arena with <code>/locate structure hha_blood:single_arena</code>.' },
        { de: 'Halte nach dem Gerippe Ausschau, dem Brustkorb aus Knochen über dem Lavameer, oder folge in den Grotten den Straßen mit den leuchtenden Pfeilen.', en: 'Look out for the Rib Cage, the ribcage of bone above the lava sea, or follow the roads with the glowing chevrons in the caves.' },
        { de: 'Steig im Treppenturm hinab (oder lass dich vom aufsteigenden Blut tragen, Schleichen zum Sinken) und geh den Schlachtweg bis zum Schädeltor.', en: 'Go down the stair tower (or ride the rising blood, sneak to sink) and walk the Slaughter Road to the Skull Gate.' },
        { de: 'Betritt die Kuppel. Der Minotaurus erhebt sich vom Thron und ruft seinen Hund. Zwischensequenzen überspringst du, indem alle Spieler die Leertaste 3 Sekunden halten.', en: 'Enter the dome. The Minotaur rises from his throne and calls his hound. Skip cutscenes by having every player hold Space for 3 seconds.' },
        { de: 'Nach dem Sieg schweigt die Grube. Für eine Revanche legst du ein Blutopfer auf den Opferaltar vor dem Thronbalkon.', en: 'After the victory the pit falls silent. For a rematch, place a Blood Offering on the Sanguine Altar in front of the throne balcony.' },
      ],
    },
    {
      type: 'text',
      title: { de: 'Faire Regeln', en: 'Fair play' },
      body: {
        de: '<p>Ein Totem der Unsterblichkeit wirkt wie überall. Ohne Totem stirbst du wirklich und bist für diesen Kampf raus, die anderen kämpfen weiter. Mit der Config <code>hha_blood.boss_safe_knockout</code> gehst du stattdessen k.o. und wachst im Eingangstunnel auf, ohne etwas zu verlieren.</p><p>Während der Zwischensequenzen ist niemand verwundbar und alle Eingaben sind gesperrt. Wer 10 Sekunden außerhalb der Arena bleibt, verlässt den Kampf; sind alle 10 Sekunden weg, setzt sich die Grube zurück und beide Bosse gehen wieder auf ihre Plätze. Die Arena ist unzerstörbar (Kreativmodus ausgenommen).</p><p>Mit jedem weiteren Spieler bekommen die Bosse 50 % mehr Lebenspunkte und 15 % mehr Schaden. Ein einzelner Treffer auf einen Boss zählt höchstens 30 Punkte.</p>',
        en: '<p>A Totem of Undying works as everywhere. Without one you really die and are out of this fight, the others fight on. With the config <code>hha_blood.boss_safe_knockout</code> you are knocked out instead and wake up in the entrance tunnel without losing anything.</p><p>During cutscenes nobody can be hurt and all input is locked. Whoever stays outside the arena for 10 seconds leaves the fight; if everyone is gone for 10 seconds the pit resets and both bosses return to their places. The arena is indestructible (creative mode excepted).</p><p>Every extra player gives the bosses 50 % more health and 15 % more damage. A single hit on a boss counts for at most 30 points.</p>',
      },
    },

    // ------------------------------------------------------------------ Befehle
    {
      type: 'commands',
      title: { de: 'Befehle', en: 'Commands' },
      items: [
        { cmd: '/hha list', desc: { de: 'Zeigt alle Config-Werte, auch die von HHA Blood (Schlüssel beginnen mit <code>hha_blood.</code>). Operator.', en: 'Lists every config value, including HHA Blood’s (keys start with <code>hha_blood.</code>). Operator.' } },
        { cmd: '/hha set hha_blood.<key> <wert>', desc: { de: 'Setzt einen Zahlenwert, die Tooltips passen sich sofort an.', en: 'Sets a number; tooltips update right away.' } },
        { cmd: '/hha toggle hha_blood.<key> <true|false>', desc: { de: 'Schaltet eine Fähigkeit ein oder aus.', en: 'Turns an ability on or off.' } },
        { cmd: '/hha get hha_blood.<key>', desc: { de: 'Zeigt einen einzelnen Wert.', en: 'Shows a single value.' } },
        { cmd: '/locate structure hha_blood:single_arena', desc: { de: 'Findet die Schlachtgrube (Vanilla-Befehl).', en: 'Finds the Slaughter Pit (vanilla command).' } },
        { cmd: '/hhablood boss tp', desc: { de: 'Teleportiert vor die Kuppel der Schlachtgrube. Alle <code>/hhablood</code>-Befehle sind Testbefehle für Operatoren.', en: 'Teleports you in front of the Slaughter Pit’s dome. All <code>/hhablood</code> commands are test commands for operators.' } },
        { cmd: '/hhablood boss info', desc: { de: 'Zeigt Phase, Zwischensequenz, Teilnehmer und Leben beider Bosse.', en: 'Shows phase, cutscene, participants and the health of both bosses.' } },
        { cmd: '/hhablood boss skip', desc: { de: 'Beendet die laufende Phase.', en: 'Ends the current phase.' } },
        { cmd: '/hhablood boss breakhead', desc: { de: 'Bricht einen Kopf des Cerberus.', en: 'Breaks one of the Cerberus’ heads.' } },
        { cmd: '/hhablood boss reset', desc: { de: 'Setzt den Kampf zurück.', en: 'Resets the fight.' } },
        { cmd: '/hhablood boss rebuild', desc: { de: 'Baut die Arena neu auf.', en: 'Rebuilds the arena.' } },
        { cmd: '/hhablood boss pose <aktion> [entfesselt] [gebrochen]', desc: { de: 'Spielt eine Animation des ruhenden Cerberus ab (gebrochen: Bitmaske 0 bis 7 der Köpfe).', en: 'Plays an animation on the resting Cerberus (broken: bit mask 0 to 7 of the heads).' } },
        { cmd: '/hhablood boss mpose <aktion> [raserei] [brennend]', desc: { de: 'Spielt eine Animation des Minotaurus außerhalb des Kampfs ab.', en: 'Plays an animation on the Minotaur outside the fight.' } },
        { cmd: '/hhablood boss walk <tempo> [blöcke]', desc: { de: 'Lässt den nächsten Boss außerhalb des Kampfs geradeaus gehen, um die Laufanimation zu prüfen (Tempo in Blöcken pro Tick, 0 stoppt).', en: 'Makes the nearest boss walk straight ahead outside the fight to check the gait (speed in blocks per tick, 0 stops).' } },
        { cmd: '/hhablood hollows stats | slice <y> [radius] | cut [radius]', desc: { de: 'Statistik und Schnittbilder der Aderngrotten als PNG (Entwicklung).', en: 'Statistics and cross-section images of the Vein Hollows as PNG (development).' } },
      ],
    },

    // ------------------------------------------------------------------ Config
    {
      type: 'config',
      title: { de: 'Konfiguration', en: 'Configuration' },
      lead: {
        de: 'Alle Werte liegen in HHAs Config (<code>config/hha/hha.json</code>) und lassen sich im Spiel mit <code>/hha set</code> und <code>/hha toggle</code> ändern. Zeiten in Ticks (20 Ticks = 1 Sekunde), Schaden in Lebenspunkten (2 = 1 Herz). HHA speichert jeden Wert; ein geänderter Standard greift erst, wenn der gespeicherte Wert fehlt.',
        en: 'All values live in HHA’s config (<code>config/hha/hha.json</code>) and can be changed in game with <code>/hha set</code> and <code>/hha toggle</code>. Times in ticks (20 ticks = 1 second), damage in health points (2 = 1 heart). HHA saves every value; a changed default only applies when no saved value exists.',
      },
      rows: [
        { key: 'hha_blood.blood_tracker', def: 'true', desc: { de: 'Blutspürer an/aus', en: 'Blood Tracker on/off' } },
        { key: 'hha_blood.tracker_select_range', def: '250', desc: { de: 'Auswahlradius in Blöcken (0 = ganze Dimension)', en: 'Selection range in blocks (0 = whole dimension)' } },
        { key: 'hha_blood.tracker_duration', def: '6000', desc: { de: 'Dauer einer Jagd (5 min)', en: 'Duration of a hunt (5 min)' } },
        { key: 'hha_blood.tracker_cooldown', def: '12000', desc: { de: 'Abklingzeit ab Ende der Jagd (10 min)', en: 'Cooldown from the end of a hunt (10 min)' } },
        { key: 'hha_blood.enduring_effects', def: 'true', desc: { de: 'Ausdauernde Effekte an/aus', en: 'Enduring Effects on/off' } },
        { key: 'hha_blood.enduring_multiplier', def: '5', desc: { de: 'Faktor für positive Effekte', en: 'Factor for beneficial effects' } },
        { key: 'hha_blood.enduring_max_ticks', def: '24000', desc: { de: 'Obergrenze verlängerter Effekte (20 min)', en: 'Cap for extended effects (20 min)' } },
        { key: 'hha_blood.enduring_weaving_ticks', def: '9600', desc: { de: 'Feste Dauer von Weben (8 min)', en: 'Fixed duration of Weaving (8 min)' } },
        { key: 'hha_blood.enduring_turtle_ticks', def: '1200', desc: { de: 'Resistenz aus Turtle Master (1 min)', en: 'Resistance from Turtle Master (1 min)' } },
        { key: 'hha_blood.enduring_turtle_slow_factor', def: '0.5', desc: { de: 'Dauer der Turtle-Master-Langsamkeit (1 = Vanilla)', en: 'Duration of Turtle Master’s Slowness (1 = vanilla)' } },
        { key: 'hha_blood.boss_safe_knockout', def: 'false', desc: { de: 'Tödliche Treffer in der Grube schlagen k.o. statt zu töten (ein Totem greift immer zuerst)', en: 'Lethal hits in the pit knock you out instead of killing you (a totem always pops first)' } },
        { key: 'hha_blood.boss_damage', def: '1.0', desc: { de: 'Multiplikator für allen Boss-Schaden', en: 'Multiplier for all boss damage' } },
        { key: 'hha_blood.boss_max_hit', def: '30', desc: { de: 'Höchstschaden eines Treffers auf einen Boss', en: 'Most damage one hit can deal to a boss' } },
        { key: 'hha_blood.boss_health_per_player', def: '0.5', desc: { de: '+50 % effektive Lebenspunkte je weiterem Spieler', en: '+50 % effective health per extra player' } },
        { key: 'hha_blood.boss_damage_per_player', def: '0.15', desc: { de: '+15 % Boss-Schaden je weiterem Spieler', en: '+15 % boss damage per extra player' } },
        { key: 'hha_blood.infection', def: 'true', desc: { de: 'Infektion an/aus', en: 'Infection on/off' } },
        { key: 'hha_blood.infection_chance', def: '15', desc: { de: 'Chance in Prozent', en: 'Chance in percent' } },
        { key: 'hha_blood.infection_cooldown', def: '300', desc: { de: 'Abklingzeit (15 s)', en: 'Cooldown (15 s)' } },
        { key: 'hha_blood.blood_trail', def: 'true', desc: { de: 'Blutspur an/aus', en: 'Blood Trail on/off' } },
        { key: 'hha_blood.blood_trail_cooldown', def: '1200', desc: { de: 'Abklingzeit (60 s)', en: 'Cooldown (60 s)' } },
        { key: 'hha_blood.blood_trail_duration', def: '140', desc: { de: 'Unsichtbarkeit samt Ab- und Auftauchen (7 s)', en: 'Invisibility including dive and rise (7 s)' } },
        { key: 'hha_blood.blood_trail_range', def: '5', desc: { de: 'Radius in Blöcken', en: 'Radius in blocks' } },
        { key: 'hha_blood.blood_trail_damage', def: '6', desc: { de: 'Schaden an Gegnern', en: 'Damage to enemies' } },
        { key: 'hha_blood.blood_trail_slow', def: '80', desc: { de: 'Dauer von Langsamkeit VI (4 s)', en: 'Duration of Slowness VI (4 s)' } },
        { key: 'hha_blood.fall_immunity', def: 'true', desc: { de: 'Kein Fallschaden mit den Blutstiefeln', en: 'No fall damage with the Blood Boots' } },
        { key: 'hha_blood.blood_rush', def: 'true', desc: { de: 'Blutrausch an/aus', en: 'Blood Rush on/off' } },
        { key: 'hha_blood.blood_rush_duration', def: '60', desc: { de: 'Dauer von Geschwindigkeit II (3 s)', en: 'Duration of Speed II (3 s)' } },
        { key: 'hha_blood.bleed_duration', def: '100', desc: { de: 'Dauer einer Blutung (5 s)', en: 'Duration of a bleed (5 s)' } },
        { key: 'hha_blood.bleed_dps', def: '1.0', desc: { de: 'Schaden pro Sekunde', en: 'Damage per second' } },
        { key: 'hha_blood.hemorrhage', def: 'true', desc: { de: 'Blutsturz an/aus', en: 'Hemorrhage on/off' } },
        { key: 'hha_blood.hemorrhage_multiplier', def: '2.0', desc: { de: 'Schadensfaktor gegen Blutende', en: 'Damage factor against bleeding targets' } },
        { key: 'hha_blood.bloodsaws', def: 'true', desc: { de: 'Blutsägen an/aus', en: 'Bloodsaws on/off' } },
        { key: 'hha_blood.bloodsaws_cooldown', def: '400', desc: { de: 'Abklingzeit (20 s)', en: 'Cooldown (20 s)' } },
        { key: 'hha_blood.bloodsaws_damage', def: '6', desc: { de: 'Schaden je Säge', en: 'Damage per saw' } },
        { key: 'hha_blood.bloodsaws_speed', def: '1.15', desc: { de: 'Fluggeschwindigkeit (Blöcke pro Tick)', en: 'Flight speed (blocks per tick)' } },
        { key: 'hha_blood.bloodsaws_spread', def: '0.18', desc: { de: 'Spreizung der beiden Sägen', en: 'Spread of the two saws' } },
        { key: 'hha_blood.bloodsaws_width', def: '1.6', desc: { de: 'Breite der Sägen in Blöcken', en: 'Width of the saws in blocks' } },
        { key: 'hha_blood.bloodsaws_bounces', def: '5', desc: { de: 'Abpraller an Wänden und Gegnern', en: 'Bounces off walls and enemies' } },
        { key: 'hha_blood.bloodsaws_life', def: '70', desc: { de: 'Flugzeit (3,5 s)', en: 'Lifetime (3.5 s)' } },
        { key: 'hha_blood.fountain_window', def: '12', desc: { de: 'Zeitfenster für beide Treffer (0,6 s)', en: 'Window for both hits (0.6 s)' } },
        { key: 'hha_blood.fountain_range', def: '5', desc: { de: 'Radius der Blutfontäne', en: 'Radius of the Blood Fountain' } },
        { key: 'hha_blood.fountain_damage', def: '8', desc: { de: 'Schaden der Blutfontäne', en: 'Damage of the Blood Fountain' } },
        { key: 'hha_blood.blood_cyclone', def: 'true', desc: { de: 'Bluttornado an/aus', en: 'Blood Cyclone on/off' } },
        { key: 'hha_blood.cyclone_cooldown', def: '800', desc: { de: 'Abklingzeit (40 s)', en: 'Cooldown (40 s)' } },
        { key: 'hha_blood.cyclone_range', def: '10', desc: { de: 'Radius des Trefferkreises', en: 'Radius of the target circle' } },
        { key: 'hha_blood.cyclone_damage', def: '5', desc: { de: 'Schaden je Geschoss', en: 'Damage per bolt' } },
        { key: 'hha_blood.cyclone_duration', def: '80', desc: { de: 'Dauer (4 s)', en: 'Duration (4 s)' } },
        { key: 'hha_blood.cyclone_height', def: '17', desc: { de: 'Schwebehöhe über der Wurfstelle', en: 'Hover height above the spot' } },
        { key: 'hha_blood.nihil', def: 'true', desc: { de: 'Nihil an/aus', en: 'Nihil on/off' } },
        { key: 'hha_blood.nihil_cooldown', def: '900', desc: { de: 'Abklingzeit (45 s)', en: 'Cooldown (45 s)' } },
        { key: 'hha_blood.nihil_range', def: '15', desc: { de: 'Radius in Blöcken', en: 'Radius in blocks' } },
        { key: 'hha_blood.nihil_duration', def: '60', desc: { de: 'Dauer des Aussaugens (3 s; wird für den Dorn auf mindestens 4,5 s gestreckt)', en: 'Duration of the drain (3 s; stretched to at least 4.5 s for the thorn)' } },
        { key: 'hha_blood.nihil_drain', def: '10', desc: { de: 'Ausgesaugter Schaden je Gegner', en: 'Drained damage per enemy' } },
        { key: 'hha_blood.nihil_lifesteal', def: '0.6', desc: { de: 'Anteil, der dich heilt', en: 'Share that heals you' } },
        { key: 'hha_blood.nihil_nova_damage', def: '8', desc: { de: 'Schaden der Blut-Nova', en: 'Damage of the Blood Nova' } },
        { key: 'hha_blood.nihil_spike_damage', def: '8', desc: { de: 'Schaden des Blutdorns', en: 'Damage of the blood thorn' } },
        { key: 'hha_blood.nihil_lift_level', def: '3', desc: { de: 'Schwebe-Stufe der Opfer (3 ≈ 5 Blöcke hoch)', en: 'Levitation level of the victims (3 ≈ 5 blocks up)' } },
        { key: 'hha_blood.nihil_voice', def: 'false', desc: { de: 'Spielt den Sound <code>hha_blood:nihil_voice</code>; er ist leer und muss per Ressourcenpaket kommen', en: 'Plays the sound <code>hha_blood:nihil_voice</code>; it is empty and has to come from a resource pack' } },
      ],
    },

    // ------------------------------------------------------------------ Installation
    {
      type: 'install',
      title: { de: 'Installation', en: 'Installation' },
      steps: [
        { de: 'Minecraft <b>1.21.11</b> mit <b>Fabric Loader</b> 0.19.3 oder neuer.', en: 'Minecraft <b>1.21.11</b> with <b>Fabric Loader</b> 0.19.3 or newer.' },
        { de: '<b>Fabric API</b> und <b>Fabric Language Kotlin</b> (1.13.13 oder neuer) in den Ordner <code>mods</code> legen.', en: 'Put <b>Fabric API</b> and <b>Fabric Language Kotlin</b> (1.13.13 or newer) into the <code>mods</code> folder.' },
        { de: '<b>H&H Armors</b> 0.6.0 oder neuer dazulegen; gebaut und getestet ist HHA Blood mit 0.8.0.', en: 'Add <b>H&H Armors</b> 0.6.0 or newer; HHA Blood is built and tested with 0.8.0.' },
        { de: '<code>HHA_Blood-0.13.0.jar</code> daneben legen. Die Mod muss auf Server und Client installiert sein.', en: 'Put <code>HHA_Blood-0.13.0.jar</code> next to them. The mod has to be installed on both server and client.' },
        { de: 'In den Steuerungseinstellungen unter HHA die Taste für <b>Ability 4</b> (Blutspürer) belegen.', en: 'In the controls, under HHA, bind a key for <b>Ability 4</b> (Blood Tracker).' },
        { de: 'Die Aderngrotten entstehen nur in neuen Nether-Chunks. In einer bestehenden Welt also weit genug in unerforschtes Gebiet reisen.', en: 'The Vein Hollows only generate in new Nether chunks. In an existing world, travel far enough into unexplored land.' },
      ],
    },
  ],
};
