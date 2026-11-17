// Welche Waffen in der Hand ein eigenes 3D-Modell haben (wie im Spiel: items/<name>.json -> models/item/<name>_3d.json).
// Dateien: assets/mods/<id>/item3d/<name>_3d.json + <name>_3d.png; frametime aus der .mcmeta der Textur.
const MODELS = {
  hha: { heavens_sword: 3, hells_sword: 3, heavens_mace: 4, hells_mace: 4 },
  blood: { blood_sword: 4, blood_mace: 4 },
  void: { void_sword: 3, void_mace: 4 },
  arius: { solvane: 4 },
};

/** Beschreibung für die Hand: 3D-Modell, falls vorhanden, sonst das flache Item (extrudiert wie im Spiel). */
export function heldItem(mod, name) {
  const url = `${mod.base}/item/${name}.png`;
  const ft = MODELS[mod.id]?.[name];
  if (ft == null) return { url };
  return { json: `${mod.base}/item3d/${name}_3d.json`, tex: `${mod.base}/item3d/${name}_3d.png`, frametime: ft, url };
}
