// Studio-Logo: die Robbe im Minecraft-Stil, aus Quadern mit Pixel-Texturen (1 Texel = 1 Einheit).
// Portiert aus dem Vibe Launcher (src/components/seal3d.ts), damit Seite und Launcher dieselbe Robbe zeigen.
import * as THREE from 'three';

export const SEAL_COLORS = {
  body: '#8f9aa6', back: '#7d8894', belly: '#cdd4db', spot: '#68737f', snout: '#e8ecf0', flipper: '#707b87',
  eye: '#141418', shine: '#ffffff', nose: '#2a2a30', whisker: '#a3acb5', cheek: '#ff9db8',
  ice: '#e3f0f9', iceLight: '#f6fbff', iceSide: '#bcd9ee', iceDark: '#9cc4e2',
};
const C = SEAL_COLORS;

function rng(seed) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}
function rgb(c) {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
/** Grundfarbe mit ganz leichtem Pixelrauschen. */
function noisy(base, amount = 0.018, seed = 1) {
  return (g, w, h) => {
    const r = rng(seed);
    const [R, G, B] = rgb(base);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const f = 1 + (r() - 0.5) * 2 * amount;
        g.fillStyle = `rgb(${Math.min(255, R * f) | 0},${Math.min(255, G * f) | 0},${Math.min(255, B * f) | 0})`;
        g.fillRect(x, y, 1, 1);
      }
    }
  };
}
const px = (color, list) => (g) => { g.fillStyle = color; for (const [x, y] of list) g.fillRect(x, y, 1, 1); };
const rows = (color, y, h) => (g, w) => { g.fillStyle = color; g.fillRect(0, y, w, h); };
const all = (...ps) => (g, w, h) => { for (const p of ps) p(g, w, h); };

/** Baut die Robbe auf ihrer Eisscholle. 1 Einheit = 1 Pixel, Kopf zeigt nach +X, Unterseite der Robbe bei y = 0. */
export function buildSeal() {
  const tex = (w, h, paint) => {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w));
    c.height = Math.max(1, Math.round(h));
    paint(c.getContext('2d'), c.width, c.height);
    const t = new THREE.CanvasTexture(c);
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.generateMipmaps = false;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  // Quader w (x) × h (y) × d (z); Flächenreihenfolge wie BoxGeometry: +x, -x, +y, -y, +z, -z
  const box = (w, h, d, faces, fallback) => {
    const dims = { px: [d, h], nx: [d, h], py: [w, d], ny: [w, d], pz: [w, h], nz: [w, h] };
    const mats = ['px', 'nx', 'py', 'ny', 'pz', 'nz'].map((k) => new THREE.MeshLambertMaterial({ map: tex(dims[k][0], dims[k][1], faces[k] || fallback) }));
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats);
    mesh.castShadow = true;
    return mesh;
  };

  const group = new THREE.Group();
  const seal = new THREE.Group();
  group.add(seal);

  // Körper (liegend) und Schwanzansatz
  const body = box(16, 7, 10, {
    py: all(noisy(C.back, 0.018, 3), px(C.spot, [[3, 2], [4, 2], [9, 6], [12, 3]])),
    ny: noisy(C.belly, 0.018, 4),
    pz: all(noisy(C.body, 0.018, 5), rows(C.belly, 5, 2)),
    nz: all(noisy(C.body, 0.018, 6), rows(C.belly, 5, 2)),
    px: all(noisy(C.body, 0.018, 7), rows(C.belly, 5, 2)),
  }, noisy(C.body, 0.018, 8));
  body.position.set(0, 3.5, 0);
  seal.add(body);
  const tail = box(4, 4, 6, { py: noisy(C.back, 0.018, 9), ny: noisy(C.belly, 0.018, 10) }, all(noisy(C.body, 0.018, 11), rows(C.belly, 3, 1)));
  tail.position.set(-10, 2, 0);
  seal.add(tail);

  // Kopf (erhoben, dreht um den Hals), Gesicht mit offenen und geschlossenen Augen
  const eyes = [[1, 3], [2, 3], [1, 4], [2, 4], [5, 3], [6, 3], [5, 4], [6, 4]];
  const faceBase = all(noisy(C.body, 0.015, 20), px(C.cheek, [[0, 6], [7, 6]]));
  const faceOpen = tex(8, 8, all(faceBase, px(C.eye, eyes), px(C.shine, [[1, 3], [5, 3]])));
  const faceShut = tex(8, 8, all(faceBase, px(C.eye, [[1, 4], [2, 4], [5, 4], [6, 4]])));
  const headMesh = box(8, 8, 8, { py: all(noisy(C.back, 0.018, 21), px(C.spot, [[5, 2]])), ny: noisy(C.belly, 0.018, 22) }, noisy(C.body, 0.018, 23));
  const faceMat = headMesh.material[0];
  faceMat.map.dispose();
  faceMat.map = faceOpen;
  const head = new THREE.Group();
  head.position.set(6, 6.5, 0);
  headMesh.position.set(3, 2.5, 0);
  head.add(headMesh);
  const snout = box(3, 3, 6, {
    px: all(noisy(C.snout, 0.012, 30), px(C.nose, [[2, 0], [3, 0]]), px(C.whisker, [[1, 1], [4, 1], [0, 2], [5, 2]])),
  }, noisy(C.snout, 0.012, 31));
  snout.position.set(8.5, 0, 0);
  head.add(snout);
  seal.add(head);

  // Flossen (Drehpunkt am Ansatz)
  const fin = (seed) => box(5, 1, 3, {}, noisy(C.flipper, 0.02, seed));
  const fins = [], tailFins = [];
  for (const s of [-1, 1]) {
    const g = new THREE.Group();
    g.position.set(4, 1, s * 5);
    const m = fin(40 + s);
    m.position.set(1.5, -0.5, s * 1);
    g.add(m);
    g.rotation.y = -s * 0.45;
    seal.add(g);
    fins.push(g);
  }
  for (const s of [-1, 1]) {
    const g = new THREE.Group();
    g.position.set(-12, 1, s * 1.2);
    const m = fin(50 + s);
    m.position.set(-2, -0.5, s * 1);
    g.add(m);
    g.rotation.y = -s * 0.5;
    seal.add(g);
    tailFins.push(g);
  }

  // Eisscholle
  const ice = new THREE.Group();
  const iceTop = all(noisy(C.ice, 0.015, 60), px(C.iceLight, [[3, 3], [4, 3], [24, 5], [27, 14], [8, 15], [15, 2], [20, 17]]));
  const iceSide = all(noisy(C.iceSide, 0.02, 62), rows(C.iceLight, 0, 1), rows(C.iceDark, 2, 1));
  const block = box(32, 3, 20, { py: iceTop, ny: noisy(C.iceDark, 0.02, 63) }, iceSide);
  block.position.set(0, -1.5, 0);
  block.receiveShadow = true;
  ice.add(block);
  group.add(ice);

  const setBlink = (closed) => {
    const next = closed ? faceShut : faceOpen;
    if (faceMat.map !== next) { faceMat.map = next; faceMat.needsUpdate = true; }
  };
  return { group, seal, ice, head, fins, tailFins, setBlink };
}

/** Pose aus Zeit und „Freude“ (0 ruhig, 1 Hover): Kopf nickt, Flossen klatschen, Schwanz wedelt, kleiner Hüpfer. */
export function poseSeal(p, t, joy, blink) {
  const flap = Math.sin(t * 14) * joy;
  p.head.rotation.z = 0.12 * joy + Math.sin(t * 7) * 0.08 * joy + Math.sin(t * 1.3) * 0.025;
  p.head.rotation.y = Math.sin(t * 3.5) * 0.12 * joy + Math.sin(t * 0.7) * 0.06;
  p.fins[0].rotation.x = -0.15 - flap * 0.55;
  p.fins[1].rotation.x = 0.15 + flap * 0.55;
  p.tailFins[0].rotation.y = 0.5 + Math.sin(t * 10) * 0.35 * joy;
  p.tailFins[1].rotation.y = -0.5 - Math.sin(t * 10) * 0.35 * joy;
  p.seal.position.y = Math.abs(Math.sin(t * 7)) * 1.2 * joy;
  p.setBlink(blink);
}
