// Vorschau von `.vibey`-Bundles (Vibey Client) in three.js, am neutralen Referenz-Spieler.
// Portiert aus dem Software-Renderer des vibey-client-Repos (content/tools/render/renderer.mjs), damit Geometrie,
// UVs und Animationen exakt den Regeln aus SPEC §5 folgen:
// - `.vibey` liegt im Blockbench-Raum (Füße im Ursprung, +Y oben, Spieler schaut nach −Z, rechter Arm bei +X);
//   Modellraum wie Vanilla: x' = −x, y' = 24 − y, z' = z; Rotationen −rx, −ry, rz in Z·Y·X-Reihenfolge.
// - Keyframes nach Blockbench (linear, step, catmullrom mit Split-Keys `pre` und Umbruch bei Schleifen).
// - Animierte Texturen wie .mcmeta (frameTime in Ticks, Reihenfolge, optional überblendet).
// Welt: Modellraum → (x, 24 − y, −z) in Pixeln, die Gruppe wird auf Blöcke skaliert (1/16). Der Spieler schaut nach +Z.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { playerSkin } from './mc3d.js';
import { makeView } from './views.js';
import { reduceMotion } from './core.js';

// ------------------------------------------------------------------------------------------------ Mathematik (zeilenweise 4×4)
const mul = (a, b) => {
  const o = new Array(16).fill(0);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) for (let k = 0; k < 4; k++) o[r * 4 + c] += a[r * 4 + k] * b[k * 4 + c];
  return o;
};
const T = (x, y, z) => [1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1];
const S = (x, y = x, z = x) => [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
const Rx = (a) => { const c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1]; };
const Ry = (a) => { const c = Math.cos(a), s = Math.sin(a); return [c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1]; };
const Rz = (a) => { const c = Math.cos(a), s = Math.sin(a); return [c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; };
const Rzyx = (x, y, z) => mul(mul(Rz(z), Ry(y)), Rx(x));
const apply = (m, p) => [0, 1, 2].map((r) => m[r * 4] * p[0] + m[r * 4 + 1] * p[1] + m[r * 4 + 2] * p[2] + m[r * 4 + 3]);
const applyDir = (m, p) => [0, 1, 2].map((r) => m[r * 4] * p[0] + m[r * 4 + 1] * p[1] + m[r * 4 + 2] * p[2]);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const deg = (d) => (d * Math.PI) / 180;

const WORLD = [1, 0, 0, 0, 0, -1, 0, 24, 0, 0, -1, 0, 0, 0, 0, 1];
const mcPos = (p) => [-p[0], 24 - p[1], p[2]];
const mcOff = (p) => [-p[0], -p[1], p[2]];
const mcRot = (r) => [deg(-r[0]), deg(-r[1]), deg(r[2])];

/** Referenz-Spieler in Blockbench-Koordinaten (SPEC §5), Skin im modernen 64×64-Layout. */
const PLAYER_PARTS = [
  { name: 'head', pivot: [0, 24, 0], from: [-4, 24, -4], to: [4, 32, 4], uv: [0, 0] },
  { name: 'body', pivot: [0, 24, 0], from: [-4, 12, -2], to: [4, 24, 2], uv: [16, 16] },
  { name: 'right_arm', pivot: [5, 22, 0], from: [4, 12, -2], to: [8, 24, 2], uv: [40, 16] },
  { name: 'left_arm', pivot: [-5, 22, 0], from: [-8, 12, -2], to: [-4, 24, 2], uv: [32, 48] },
  { name: 'right_leg', pivot: [1.9, 12, 0], from: [-0.1, 0, -2], to: [3.9, 12, 2], uv: [0, 16] },
  { name: 'left_leg', pivot: [-1.9, 12, 0], from: [-3.9, 0, -2], to: [0.1, 12, 2], uv: [16, 48] },
];
const PLAYER_NAMES = PLAYER_PARTS.map((p) => p.name);

// ------------------------------------------------------------------------------------------------ Animation
function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

/** Kanal abtasten nach Blockbench-Regeln (wie renderer.mjs sampleChannel). */
function sampleChannel(keys, t, loop = false) {
  if (!keys?.length) return null;
  const n = keys.length;
  const pre = (k) => k.pre ?? k.v;
  if (t < keys[0].t) return pre(keys[0]);
  if (t >= keys[n - 1].t) return keys[n - 1].v;
  let k = 0;
  while (k < n - 1 && keys[k + 1].t <= t) k++;
  const a = keys[k], b = keys[k + 1];
  const f = (t - a.t) / (b.t - a.t || 1);
  const ia = a.i ?? 'linear', ib = b.i ?? 'linear';
  const end = pre(b);
  if (ia === 'step') return a.v;
  if (ia === 'catmullrom' || ib === 'catmullrom') {
    const wrap = loop && n >= 3;
    const before = keys[k - 1] ?? (wrap ? keys[n - 2] : null);
    const after = keys[k + 2] ?? (wrap ? keys[1] : null);
    const p0 = before && !a.pre ? before.v : a.v;
    const p3 = after && !b.pre ? pre(after) : end;
    return [0, 1, 2].map((c) => catmull(p0[c], a.v[c], end[c], p3[c], f));
  }
  return [0, 1, 2].map((c) => a.v[c] + (end[c] - a.v[c]) * f);
}

function localTime(anim, t) {
  if (anim.loop) return ((t % anim.length) + anim.length) % anim.length;
  return Math.min(Math.max(t, 0), anim.length);
}

function evalAnim(anim, t) {
  const lt = localTime(anim, t);
  const pose = {};
  for (const [name, ch] of Object.entries(anim.bones ?? {})) {
    const lp = !!anim.loop;
    pose[name] = { rot: sampleChannel(ch.rotation, lt, lp), pos: sampleChannel(ch.position, lt, lp), scale: sampleChannel(ch.scale, lt, lp) };
  }
  const vis = new Map();
  for (const e of [...(anim.events ?? [])].sort((a, b) => a.t - b.t)) if (e.type === 'visibility' && e.t <= lt + 1e-9) vis.set(e.bone, e.visible);
  return { pose, vis };
}

function mergePoses(list) {
  const pose = {};
  const vis = new Map();
  for (const p of list) {
    for (const [k, v] of Object.entries(p.pose)) {
      const o = (pose[k] ??= { rot: null, pos: null, scale: null });
      if (v.rot) o.rot = o.rot ? o.rot.map((x, i) => x + v.rot[i]) : v.rot;
      if (v.pos) o.pos = o.pos ? o.pos.map((x, i) => x + v.pos[i]) : v.pos;
      if (v.scale) o.scale = o.scale ? o.scale.map((x, i) => x * v.scale[i]) : v.scale;
    }
    for (const [k, v] of p.vis) vis.set(k, v);
  }
  return { pose, vis };
}

function childNode(parent, pivotSpec, restRot, anim) {
  const piv = mcPos(pivotSpec);
  const off = anim?.pos ? mcOff(anim.pos) : [0, 0, 0];
  const rot = [0, 1, 2].map((i) => (restRot?.[i] ?? 0) + (anim?.rot?.[i] ?? 0));
  const sc = anim?.scale ?? [1, 1, 1];
  const M = mul(mul(mul(parent.M, T(piv[0] - parent.pivot[0] + off[0], piv[1] - parent.pivot[1] + off[1], piv[2] - parent.pivot[2] + off[2])), Rzyx(...mcRot(rot))), S(sc[0], sc[1], sc[2]));
  return { M, pivot: piv };
}

/** Alle Knoten (Spielerteile + Bones des Bundles) zu einem Zeitpunkt. opts: { anims, worldOffset, petScale } */
function computeNodes(B, opts = {}) {
  const anims = (opts.anims ?? []).filter((a) => B?.json.animations?.[a.name]).map((a) => evalAnim(B.json.animations[a.name], a.t));
  const { pose, vis } = mergePoses(anims);
  const nodes = new Map();
  const root = childNode({ M: WORLD, pivot: [0, 0, 0] }, [0, 0, 0], [0, 0, 0], pose.root);
  nodes.set('root', root);
  for (const p of PLAYER_PARTS) nodes.set(p.name, childNode(root, p.pivot, [0, 0, 0], pose[p.name]));
  const s = opts.petScale ?? 1;
  nodes.set('world', { M: mul(mul(mul(mul(WORLD, T(...mcOff(opts.worldOffset ?? [0, 0, 0]))), T(0, 24, 0)), S(s)), T(0, -24, 0)), pivot: [0, 0, 0] });
  const hidden = new Set();
  if (B) {
    const done = new Set();
    const visit = (b) => {
      if (!b || done.has(b.name)) return;
      done.add(b.name);
      let parent;
      if (b.parent) {
        visit(B.bones.get(b.parent));
        parent = nodes.get('bone:' + b.parent);
        if (hidden.has(b.parent)) hidden.add(b.name);
      } else parent = nodes.get(b.attach ?? 'body');
      nodes.set('bone:' + b.name, childNode(parent, b.pivot ?? [0, 0, 0], b.rotation, pose[b.name]));
      if (vis.get(b.name) === false) hidden.add(b.name);
    };
    for (const b of B.bones.values()) visit(b);
  }
  return { nodes, hidden };
}

// ------------------------------------------------------------------------------------------------ Geometrie
// Ecken der Flächen im Modellraum (y unten): [Ecke (xMax?, yMax?, zMax?), UV-Ecke (u2?, v2?)]
const FACE_DEF = {
  west: { n: [-1, 0, 0], c: [[[0, 0, 0], [1, 0]], [[0, 0, 1], [0, 0]], [[0, 1, 1], [0, 1]], [[0, 1, 0], [1, 1]]] },
  north: { n: [0, 0, -1], c: [[[1, 0, 0], [1, 0]], [[0, 0, 0], [0, 0]], [[0, 1, 0], [0, 1]], [[1, 1, 0], [1, 1]]] },
  east: { n: [1, 0, 0], c: [[[1, 0, 1], [1, 0]], [[1, 0, 0], [0, 0]], [[1, 1, 0], [0, 1]], [[1, 1, 1], [1, 1]]] },
  south: { n: [0, 0, 1], c: [[[0, 0, 1], [1, 0]], [[1, 0, 1], [0, 0]], [[1, 1, 1], [0, 1]], [[0, 1, 1], [1, 1]]] },
  up: { n: [0, -1, 0], c: [[[1, 0, 1], [1, 0]], [[0, 0, 1], [0, 0]], [[0, 0, 0], [0, 1]], [[1, 0, 0], [1, 1]]] },
  down: { n: [0, 1, 0], c: [[[1, 1, 1], [1, 0]], [[0, 1, 1], [0, 0]], [[0, 1, 0], [0, 1]], [[1, 1, 0], [1, 1]]] },
};
function boxRects(u, v, w, h, d) {
  return {
    up: [u + d, v, u + d + w, v + d], down: [u + d + w, v, u + d + 2 * w, v + d],
    west: [u, v + d, u + d, v + d + h], north: [u + d, v + d, u + d + w, v + d + h],
    east: [u + d + w, v + d, u + 2 * d + w, v + d + h], south: [u + 2 * d + w, v + d, u + 2 * d + 2 * w, v + d + h],
  };
}
// Blockbench-Fläche → Modellraum-Fläche, mit Umrechnung der Per-Face-UV-Ausrichtung (wie renderer.mjs)
const BB_FACE = {
  north: ['north', (r) => r], south: ['south', (r) => r], east: ['west', (r) => r], west: ['east', (r) => r],
  up: ['up', ([a, b, c, d]) => [c, d, a, b]], down: ['down', ([a, b, c, d]) => [c, b, a, d]],
};
function cubeFaces(c, size) {
  if (c.uv?.box) return Object.fromEntries(Object.entries(boxRects(c.uv.box[0], c.uv.box[1], ...size)).map(([k, r]) => [k, { rect: r }]));
  const out = {};
  for (const [f, [mf, xf]] of Object.entries(BB_FACE)) {
    const fv = c.uv?.[f];
    if (fv) out[mf] = { rect: xf(Array.isArray(fv) ? fv : fv.uv), texture: Array.isArray(fv) ? null : fv.texture };
  }
  return out;
}
function specCube(c) {
  const a = mcPos(c.from), b = mcPos(c.to);
  return { min: [0, 1, 2].map((i) => Math.min(a[i], b[i])), max: [0, 1, 2].map((i) => Math.max(a[i], b[i])) };
}

/** Quader in Puffer schreiben (lokal zum Knoten-Pivot). out: { pos, uv, nrm }; tex: { w, h } UV-Raum; texScale für Cape/Schild. */
function pushCube(out, cube, pivot, faces, tex, texScale = [1, 1]) {
  const inf = cube.inflate ?? 0;
  const mn = cube.min.map((v) => v - inf), mx = cube.max.map((v) => v + inf);
  const corner = (sel) => {
    let p = [sel[0] ? mx[0] : mn[0], sel[1] ? mx[1] : mn[1], sel[2] ? mx[2] : mn[2]];
    if (cube.mirror) p[0] = mn[0] + mx[0] - p[0];
    if (cube.cubeM) p = apply(cube.cubeM, p);
    return sub(p, pivot);
  };
  for (const [face, def] of Object.entries(FACE_DEF)) {
    const f = faces[face];
    if (!f) continue;
    let n = cube.mirror && (face === 'east' || face === 'west') ? [-def.n[0], 0, 0] : def.n;
    if (cube.cubeM) n = applyDir(cube.cubeM, n);
    const [u1, v1, u2, v2] = f.rect.map((x, i) => x * texScale[i % 2]);
    if (Math.abs(u2 - u1) < 1e-6 || Math.abs(v2 - v1) < 1e-6) continue;
    const pts = def.c.map(([sel, [su, sv]]) => {
      let uu = su ? u2 : u1;
      if (cube.mirror) uu = su ? u1 : u2;
      return { p: corner(sel), uv: [uu / tex.w, (sv ? v2 : v1) / tex.h] };
    });
    for (const i of [0, 1, 2, 0, 2, 3]) {
      out.pos.push(...pts[i].p);
      out.uv.push(...pts[i].uv);
      out.nrm.push(...n);
    }
  }
}

function geometry(out) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(out.pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(out.uv, 2));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(out.nrm, 3));
  return g;
}

// ------------------------------------------------------------------------------------------------ Texturen
const loadImage = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });

/** Textur eines Bundles: Leinwand mit dem aktuellen Bild, animiert wie .mcmeta. */
async function bundleTexture(t) {
  const img = await loadImage(`data:image/png;base64,${t.png}`);
  const pxW = img.width, pxH = Math.round(img.width * (t.height / t.width));
  const frames = t.animation ? Math.max(1, Math.floor(img.height / pxH)) : 1;
  const c = document.createElement('canvas');
  c.width = pxW; c.height = pxH;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.drawImage(img, 0, 0, pxW, pxH, 0, 0, pxW, pxH);
  const tex = new THREE.CanvasTexture(c);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  const order = t.animation?.frames ?? [...Array(frames).keys()];
  const frameTime = t.animation?.frameTime ?? 1;
  let last = '';
  const tick = (time) => {
    if (frames < 2 || !order.length) return;
    const f = (time * 20) / frameTime;
    const i = Math.floor(f) % order.length;
    const k = t.animation?.interpolate ? f - Math.floor(f) : 0;
    const key = `${i}:${Math.round(k * 16)}`;
    if (key === last) return;
    last = key;
    g.globalAlpha = 1;
    g.clearRect(0, 0, pxW, pxH);
    g.drawImage(img, 0, order[i] * pxH, pxW, pxH, 0, 0, pxW, pxH);
    if (k > 0.02) { g.globalAlpha = k; g.drawImage(img, 0, order[(i + 1) % order.length] * pxH, pxW, pxH, 0, 0, pxW, pxH); }
    tex.needsUpdate = true;
  };
  return { id: t.id, w: t.width, h: t.height, img, pxW, pxH, tex, tick };
}

// Neutraler Referenz-Spieler: eigener Skin (Kapuzenpulli in Grau), modernes Layout mit eigenen linken Gliedmaßen
let SKIN = null;
function referenceSkin() {
  if (SKIN) return SKIN;
  const src = playerSkin({ skin: '#e2b28c', hair: '#3b3f4c', eyes: '#2c3140', shirt: '#566074', pants: '#2f3442', shoes: '#2a2d36', fringe: [2, 5], seed: 7 });
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  g.drawImage(src, 0, 0);
  g.drawImage(src, 40, 16, 16, 16, 32, 48, 16, 16); // linker Arm
  g.drawImage(src, 0, 16, 16, 16, 16, 48, 16, 16); // linkes Bein
  const tex = new THREE.CanvasTexture(c);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  SKIN = tex;
  return tex;
}

// ------------------------------------------------------------------------------------------------ Partikel
const VANILLA_PARTICLES = {
  'minecraft:note': { life: 0.6, color: null, glyph: 'note', size: 0.25, emissive: true },
  'minecraft:snowflake': { life: 1.2, color: '#ffffff', glyph: 'flake', size: 0.1, gravity: 0.0025 },
  'minecraft:heart': { life: 0.8, color: '#ff4d6d', glyph: 'heart', size: 0.25 },
  'minecraft:end_rod': { life: 1.5, color: '#fffbe8', glyph: 'dot', size: 0.12, emissive: true },
  'minecraft:happy_villager': { life: 0.8, color: '#5dd36b', glyph: 'dot', size: 0.12 },
  'minecraft:firework': { life: 1.0, color: '#ffffff', glyph: 'dot', size: 0.12, emissive: true },
  'minecraft:cloud': { life: 1.0, color: '#f0f0f0', glyph: 'puff', size: 0.3 },
  'minecraft:poof': { life: 0.5, color: '#f0f0f0', glyph: 'puff', size: 0.25 },
  'minecraft:bubble_pop': { life: 0.4, color: '#bfe8ff', glyph: 'ring', size: 0.15 },
  'minecraft:splash': { life: 0.6, color: '#6fb7ff', glyph: 'dot', size: 0.1, gravity: 0.04 },
};
const NOTE_COLORS = ['#5dd36b', '#3fe0c5', '#8b6cff', '#ff6fae', '#ffd25a'];
const GLYPHS = {
  note: ['..##', '..#.', '..#.', '###.', '##..'], flake: ['#.#.#', '.###.', '##.##', '.###.', '#.#.#'],
  heart: ['.#.#.', '#####', '#####', '.###.', '..#..'], dot: ['##', '##'], puff: ['.##.', '####', '####', '.##.'],
  ring: ['.##.', '#..#', '#..#', '.##.'],
};
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function locatorWorld(B, locName, te, opts, animName) {
  const loc = B.locators[locName];
  if (!loc) return [0, 12, 0];
  const anims = (opts.anims ?? []).map((a) => (a.name === animName ? { ...a, t: te } : a));
  const { nodes } = computeNodes(B, { ...opts, anims });
  const node = PLAYER_NAMES.includes(loc.bone) || loc.bone === 'root' ? nodes.get(loc.bone) : nodes.get('bone:' + loc.bone);
  if (!node) return [0, 12, 0];
  return apply(node.M, sub(mcPos(loc.position), node.pivot));
}

/** Deterministische Partikel aller laufenden Animationen (wie renderer.mjs simulateParticles). */
function simulateParticles(B, opts) {
  const out = [];
  for (const a of opts.anims ?? []) {
    const anim = B.json.animations?.[a.name];
    if (!anim?.events?.length) continue;
    const loops = anim.loop ? Math.ceil(3 / anim.length) + 1 : 0;
    anim.events.forEach((ev, ei) => {
      if (ev.type !== 'particle') return;
      const vp = ev.particle ? VANILLA_PARTICLES[ev.particle] ?? { life: 1, color: '#ffffff', glyph: 'dot', size: 0.12 } : null;
      const life = ev.lifetime ?? vp?.life ?? 1;
      for (let k = 0; k <= loops; k++) {
        const te = ev.t + (anim.loop ? Math.floor(a.t / anim.length) * anim.length - k * anim.length : 0);
        const age = a.t - te;
        if (age < 0 || age > life) continue;
        if (!anim.loop && te > anim.length) continue;
        const origin = locatorWorld(B, ev.locator, te, opts, a.name);
        const r = rng(1000 + ei * 7919 + Math.round(te * 1000));
        const n = Math.round(ev.count ?? 1);
        for (let i = 0; i < n; i++) {
          const sp = ev.spread ?? [0, 0, 0];
          const vel = ev.velocity ?? [0, 0, 0];
          const off = [(r() * 2 - 1) * sp[0], (r() * 2 - 1) * sp[1], (r() * 2 - 1) * sp[2]];
          const v = vel.map((x, c) => (c === 0 ? -x : x) * (1 + (r() * 2 - 1) * 0.3));
          const drift = [(r() * 2 - 1) * Math.abs(vel[1]) * 0.35, 0, (r() * 2 - 1) * Math.abs(vel[1]) * 0.35];
          const g = ev.gravity ?? vp?.gravity ?? 0;
          const ticks = age * 20;
          const lifeFrac = age / life;
          let color = vp?.color ?? '#ffffff';
          if (vp?.glyph === 'note') color = NOTE_COLORS[(ei + i) % NOTE_COLORS.length];
          out.push({
            p: [origin[0] + (off[0] + (v[0] + drift[0]) * ticks) * 16, origin[1] + (off[1] + v[1] * ticks - 0.5 * g * ticks * ticks) * 16, origin[2] - (off[2] + (v[2] + drift[2]) * ticks) * 16],
            size: (ev.size ?? vp?.size ?? 0.15) * 16 * (lifeFrac > 0.7 ? 1 - ((lifeFrac - 0.7) / 0.3) * 0.6 : 1),
            sprite: ev.sprite ?? null, glyph: vp?.glyph, color,
            emissive: ev.emissive ?? vp?.emissive ?? false,
            alpha: lifeFrac > 0.75 ? 1 - (lifeFrac - 0.75) / 0.25 : 1,
          });
        }
      }
    });
  }
  return out;
}

// ------------------------------------------------------------------------------------------------ Bundle laden
const bundleCache = new Map();
export function loadBundle(url) {
  if (!bundleCache.has(url)) {
    bundleCache.set(url, fetch(url).then((r) => { if (!r.ok) throw new Error(url); return r.json(); }).then(async (json) => {
      const tex = new Map();
      for (const t of json.textures ?? []) tex.set(t.id, await bundleTexture(t));
      return {
        json, tex,
        bones: new Map((json.model?.bones ?? []).map((b) => [b.name, b])),
        sprites: new Map((json.sprites ?? []).map((s) => [s.id, s])),
        locators: json.model?.locators ?? {},
      };
    }));
  }
  return bundleCache.get(url);
}

const toMatrix = (m, target) => target.set(...m);

/**
 * Szene eines Bundles: Meshes je Bone und Textur, deren Matrizen jedes Bild aus computeNodes kommen.
 * Gibt { group, update(time) } zurück; group liegt in Weltpixeln (vor der Skalierung auf Blöcke).
 */
function buildBundleScene(B, opts) {
  const group = new THREE.Group();
  const drawables = []; // { mesh, node: 'bone:x' | Spielerteil | M-Funktion, pivot }
  const matCache = new Map();
  const material = (texEntry, flags = {}) => {
    const key = `${texEntry.id ?? 'skin'}|${flags.emissive ? 1 : 0}|${flags.translucent ? 1 : 0}`;
    if (!matCache.has(key)) {
      const map = texEntry.tex ?? texEntry;
      const m = flags.emissive
        ? new THREE.MeshBasicMaterial({ map, side: THREE.DoubleSide, transparent: !!flags.translucent, alphaTest: flags.translucent ? 0.02 : 0.5, depthWrite: !flags.translucent, toneMapped: false })
        : new THREE.MeshLambertMaterial({ map, side: THREE.DoubleSide, transparent: !!flags.translucent, alphaTest: flags.translucent ? 0.02 : 0.5, depthWrite: !flags.translucent });
      matCache.set(key, m);
    }
    return matCache.get(key);
  };
  const addMesh = (out, mat, nodeRef, pivot, bone = null) => {
    if (!out.pos.length) return;
    const mesh = new THREE.Mesh(geometry(out), mat);
    mesh.matrixAutoUpdate = false;
    group.add(mesh);
    drawables.push({ mesh, nodeRef, pivot, bone });
  };
  const slot = B?.json.cosmetic?.slot;

  // Spieler
  if (opts.player !== false) {
    const skin = { id: '__skin', tex: referenceSkin(), w: 64, h: 64 };
    for (const p of PLAYER_PARTS) {
      const m = specCube(p);
      const size = [0, 1, 2].map((i) => m.max[i] - m.min[i]);
      const out = { pos: [], uv: [], nrm: [] };
      const pivot = mcPos(p.pivot);
      pushCube(out, m, pivot, Object.fromEntries(Object.entries(boxRects(p.uv[0], p.uv[1], ...size)).map(([k, r]) => [k, { rect: r }])), skin);
      addMesh(out, material(skin), p.name, pivot);
    }
  }
  if (B) {
    // Cape aus Textur: Vanilla-Cape am Rücken
    if (slot === 'cape' && B.json.cosmetic.cape?.texture && B.tex.get(B.json.cosmetic.cape.texture)) {
      const t = B.tex.get(B.json.cosmetic.cape.texture);
      const sc = t.w / 64;
      const out = { pos: [], uv: [], nrm: [] };
      pushCube(out, { min: [-5, 0, -1], max: [5, 16, 0] }, [0, 0, 0], Object.fromEntries(Object.entries(boxRects(0, 0, 10, 16, 1)).map(([k, r]) => [k, { rect: r }])), t, [sc, sc]);
      addMesh(out, material(t), (nodes) => mul(mul(mul(nodes.get('body').M, T(0, 0, 2)), Rx(deg(opts.capeAngle ?? 6))), Ry(Math.PI)), [0, 0, 0]);
    }
    // Schild aus Textur: Vanilla-Schild, links vorn neben dem Spieler (ohne Spieler mittig)
    if (slot === 'shield' && B.json.cosmetic.shield?.texture && B.tex.get(B.json.cosmetic.shield.texture)) {
      const t = B.tex.get(B.json.cosmetic.shield.texture);
      const sc = t.w / 64;
      const M = opts.player === false ? mul(WORLD, T(0, 8, 0)) : mul(mul(WORLD, T(11, 9, -5)), Ry(deg(-12)));
      for (const [mn, mx, rects] of [[[-6, -11, -2], [6, 11, -1], boxRects(0, 0, 12, 22, 1)], [[-1, -3, -1], [1, 3, 5], boxRects(26, 0, 2, 6, 6)]]) {
        const out = { pos: [], uv: [], nrm: [] };
        pushCube(out, { min: mn, max: mx }, [0, 0, 0], Object.fromEntries(Object.entries(rects).map(([k, r]) => [k, { rect: r }])), t, [sc, sc]);
        addMesh(out, material(t), () => M, [0, 0, 0]);
      }
    }
    // Bones des Modells
    const defTex = B.json.model?.texture ?? B.json.textures?.[0]?.id;
    for (const b of B.bones.values()) {
      const pivot = mcPos(b.pivot ?? [0, 0, 0]);
      const perTex = new Map();
      for (const c of b.cubes ?? []) {
        const m = specCube(c);
        const size = [0, 1, 2].map((i) => Math.abs(c.to[i] - c.from[i]));
        let cubeM = null;
        if (c.rotation && c.rotation.some((v) => v)) {
          const cp = mcPos(c.pivot ?? [0, 0, 0]);
          cubeM = mul(mul(T(...cp), Rzyx(...mcRot(c.rotation))), T(-cp[0], -cp[1], -cp[2]));
        }
        const faces = cubeFaces(c, size);
        // Flächen nach Textur gruppieren (Fläche → Quader → Modell → erste Textur)
        const byTex = new Map();
        for (const [f, val] of Object.entries(faces)) {
          const id = val.texture ?? c.texture ?? defTex;
          if (!byTex.has(id)) byTex.set(id, {});
          byTex.get(id)[f] = val;
        }
        for (const [id, fs] of byTex) {
          const t = B.tex.get(id);
          if (!t) continue;
          if (!perTex.has(id)) perTex.set(id, { pos: [], uv: [], nrm: [] });
          pushCube(perTex.get(id), { ...m, inflate: c.inflate, mirror: c.mirror, cubeM }, pivot, fs, t);
        }
      }
      for (const [id, out] of perTex) addMesh(out, material(B.tex.get(id), { emissive: !!b.emissive, translucent: !!b.translucent }), 'bone:' + b.name, pivot, b.name);
    }
  }

  // Partikel als Sprites (Pool)
  const spriteTex = new Map();
  const particleTexture = (pa) => {
    const key = pa.sprite ? `s:${pa.sprite}` : `g:${pa.glyph}:${pa.color}`;
    if (spriteTex.has(key)) return spriteTex.get(key);
    const c = document.createElement('canvas');
    const g = c.getContext('2d');
    if (pa.sprite) {
      const s = B.sprites.get(pa.sprite);
      const t = s && B.tex.get(s.texture);
      const [u1, v1, u2, v2] = s?.uv ?? [0, 0, 1, 1];
      const k = t ? t.pxW / t.w : 1;
      c.width = Math.max(1, Math.round((u2 - u1) * k)); c.height = Math.max(1, Math.round((v2 - v1) * k));
      if (t) { g.imageSmoothingEnabled = false; g.drawImage(t.img, u1 * k, v1 * k, c.width, c.height, 0, 0, c.width, c.height); }
    } else {
      const gl = GLYPHS[pa.glyph ?? 'dot'];
      c.width = gl[0].length; c.height = gl.length;
      g.fillStyle = pa.color;
      gl.forEach((row, y) => [...row].forEach((ch, x) => { if (ch === '#') g.fillRect(x, y, 1, 1); }));
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.magFilter = tex.minFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    spriteTex.set(key, tex);
    return tex;
  };
  const pool = [];
  const sprite = (i) => {
    if (!pool[i]) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false, toneMapped: false }));
      group.add(s);
      pool[i] = s;
    }
    return pool[i];
  };

  const update = (time, anims) => {
    const o = { ...opts, anims };
    const { nodes, hidden } = computeNodes(B, o);
    for (const d of drawables) {
      const M = typeof d.nodeRef === 'function' ? d.nodeRef(nodes) : nodes.get(d.nodeRef).M;
      toMatrix(M, d.mesh.matrix);
      d.mesh.visible = !(d.bone && hidden.has(d.bone));
      d.mesh.matrixWorldNeedsUpdate = true;
    }
    if (B) for (const t of B.tex.values()) t.tick(time);
    const parts = B && opts.particles !== false ? simulateParticles(B, o) : [];
    parts.forEach((pa, i) => {
      const s = sprite(i);
      s.visible = true;
      s.position.set(pa.p[0], pa.p[1], pa.p[2]);
      s.scale.setScalar(Math.max(0.5, pa.size));
      const tex = particleTexture(pa);
      if (s.material.map !== tex) { s.material.map = tex; s.material.needsUpdate = true; }
      s.material.opacity = pa.alpha;
      s.material.blending = pa.emissive ? THREE.AdditiveBlending : THREE.NormalBlending;
    });
    for (let i = parts.length; i < pool.length; i++) pool[i].visible = false;
  };
  return { group, update };
}

// ------------------------------------------------------------------------------------------------ Viewer

/** Welche Animationen laufen, Startansicht und Abstand je Art/Slot (wie content/tools/plans.mjs). */
export function planFor(json) {
  if (!json) return { yaw: 32, anims: [] };
  if (json.kind === 'emote') return { yaw: 28, emote: json.emote?.animation ?? 'main' };
  const slot = json.cosmetic?.slot;
  const back = ['cape', 'wings', 'back'].includes(slot);
  return {
    yaw: back ? 205 : slot === 'pet' ? 40 : 30,
    worldOffset: slot === 'pet' ? [20, 0, 6] : [0, 0, 0],
    petScale: slot === 'pet' ? json.cosmetic.pet?.scale ?? 1 : 1,
    modes: ['idle', ...(json.animations?.fly ? ['fly'] : []), ...(json.animations?.walk ? ['walk'] : [])].filter((n) => n === 'idle' || json.animations?.[n]),
  };
}

/**
 * Großer, drehbarer Viewer: Referenz-Spieler mit einem Cosmetic oder Emote. Ziehen dreht, Mausrad zoomt.
 * Rückgabe: { show(url), setMode(name), view(side), replay() }
 */
export function wardrobeViewer(canvas, { signal } = {}) {
  const view = makeView(canvas, { alpha: true, shadows: false });
  const { scene, camera } = view;
  camera.fov = 30;
  camera.near = 0.05;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x3a3a46, 1.7));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  scene.add(key);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(0.62, 48), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.002;
  scene.add(floor);
  const holder = new THREE.Group();
  holder.scale.setScalar(1 / 16);
  scene.add(holder);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.minDistance = 2;
  controls.maxDistance = 9;
  controls.target.set(0, 1.05, 0);
  view.cleanup.push(() => controls.dispose());

  let current = null; // { B, sc, plan, mode, t0 }
  let token = 0;
  const placeCamera = (yawDeg, dist = 4.6, pitchDeg = 12) => {
    const y = deg(yawDeg), p = deg(pitchDeg);
    camera.position.set(controls.target.x + Math.sin(y) * Math.cos(p) * dist, controls.target.y + Math.sin(p) * dist, controls.target.z + Math.cos(y) * Math.cos(p) * dist);
    camera.lookAt(controls.target);
    controls.update();
  };
  placeCamera(205);

  const show = async (url) => {
    const my = ++token;
    const B = url ? await loadBundle(url) : null;
    if (my !== token || signal?.aborted) return;
    const plan = planFor(B?.json);
    if (current) { holder.remove(current.sc.group); current.sc.group.traverse((o) => o.geometry?.dispose()); }
    const sc = buildBundleScene(B, { player: true, worldOffset: plan.worldOffset, petScale: plan.petScale });
    holder.add(sc.group);
    current = { B, sc, plan, mode: 'idle', t0: performance.now() };
    // Bildausschnitt aus der echten Größe (Flügel, Auren und Begleiter sind breiter als der Spieler)
    sc.update(0.3, anims(current, 0.3));
    holder.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(holder, true);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    controls.target.set(center.x, Math.max(0.9, center.y), center.z);
    const tanF = Math.tan(deg(camera.fov / 2));
    const aspect = Math.max(0.5, (view.w || canvas.clientWidth || 1) / Math.max(1, view.h || canvas.clientHeight || 1));
    const dist = Math.max(Math.max(size.y, 2.1) / 2 / tanF, (Math.hypot(size.x, size.z) * 0.85) / 2 / (tanF * aspect)) * 1.34;
    placeCamera(plan.yaw, Math.min(10, Math.max(3.6, dist)));
    return B;
  };
  const anims = (c, t) => {
    if (!c.B) return [];
    if (c.plan.emote) {
      const a = c.B.json.animations[c.plan.emote];
      if (!a) return [];
      // Emotes als Schleife: einmal abspielen, kurz stehen lassen, wieder von vorn
      const len = a.loop ? a.length : a.length + 0.8;
      return [{ name: c.plan.emote, t: a.loop ? t : Math.min(t % len, a.length) }];
    }
    const list = c.B.json.animations?.idle ? [{ name: 'idle', t }] : [];
    if (c.mode !== 'idle' && c.B.json.animations?.[c.mode]) list.push({ name: c.mode, t });
    return list;
  };
  key.position.set(-3, 5, 4);
  view.frame = (now) => {
    controls.update();
    key.position.copy(camera.position).add(new THREE.Vector3(-2, 4, 0));
    if (!current) return;
    const t = reduceMotion ? 0.3 : (now - current.t0) / 1000;
    current.sc.update(t, anims(current, t));
  };
  return {
    show,
    setMode(m) { if (current) { current.mode = m; current.t0 = performance.now(); } },
    view(side) { placeCamera(side === 'back' ? 205 : side === 'side' ? 270 : 30, camera.position.distanceTo(controls.target)); },
    replay() { if (current) current.t0 = performance.now(); },
  };
}
