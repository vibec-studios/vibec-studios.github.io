// Alle Mods des Studios in Anzeigereihenfolge. Fehlt eine Inhaltsdatei, wird die Mod einfach ausgelassen.
const IDS = ['hha', 'blood', 'void'];

function normalize(m) {
  const used = new Set();
  const sections = m.sections.map((s, i) => {
    let id = s.id || `${s.type}-${i}`;
    while (used.has(id)) id += '-' + i;
    used.add(id);
    return { ...s, id };
  });
  return { ...m, sections, base: `/assets/mods/${m.id}`, path: `/mods/${m.id}/` };
}

let cache = null;
export async function loadMods() {
  if (!cache) {
    cache = Promise.all(IDS.map((id) => import(`./${id}.js`).then((m) => m.default).catch((e) => { console.warn('Mod fehlt:', id, e); return null; })))
      .then((list) => list.filter(Boolean).map(normalize));
  }
  return cache;
}
