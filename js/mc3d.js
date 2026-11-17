// Minecraft-artige 3D-Bausteine für die H&H-Armors-Seite.
// Geometrie und UVs folgen ModelPart.Cuboid aus Minecraft, damit die Texturen der Mod 1:1 passen.
import * as THREE from 'three';

const loader = new THREE.TextureLoader();
const cache = new Map();

function pixelTex(tex, linear = false) {
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = linear ? THREE.LinearFilter : THREE.NearestFilter;
  tex.minFilter = linear ? THREE.LinearMipmapLinearFilter : THREE.NearestFilter;
  tex.generateMipmaps = linear;
  tex.needsUpdate = true;
  return tex;
}

export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Bild fehlt: ' + url));
    img.src = url;
  });
}

export function loadTex(url, linear = false) {
  const key = url + (linear ? '#l' : '');
  if (!cache.has(key)) {
    cache.set(key, new Promise((resolve, reject) => {
      loader.load(url, (t) => resolve(pixelTex(t, linear)), undefined, reject);
    }));
  }
  return cache.get(key);
}

/** Leuchtmaske: RGB mit Alpha vormultipliziert, damit transparente Texel nicht mitleuchten. */
export function loadGlow(url, linear = false) {
  const key = url + '#glow';
  if (!cache.has(key)) {
    cache.set(key, loadImage(url).then((img) => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const g = c.getContext('2d');
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height);
      let any = false;
      for (let i = 0; i < d.data.length; i += 4) {
        const a = d.data[i + 3] / 255;
        if (a > 0) any = true;
        d.data[i] *= a; d.data[i + 1] *= a; d.data[i + 2] *= a; d.data[i + 3] = 255;
      }
      if (!any) return null;
      g.putImageData(d, 0, 0);
      return pixelTex(new THREE.CanvasTexture(c), linear);
    }).catch(() => null));
  }
  return cache.get(key);
}

// ---------------------------------------------------------------- Quader wie ModelPart.Cuboid

function pushQuad(out, verts, u1, v1, u2, v2, tw, th) {
  // Minecraft: verts[0] -> (u2, v1), [1] -> (u1, v1), [2] -> (u1, v2), [3] -> (u2, v2)
  const uv = [[u2, v1], [u1, v1], [u1, v2], [u2, v2]];
  for (const i of [0, 1, 2, 0, 2, 3]) {
    out.pos.push(verts[i][0], verts[i][1], verts[i][2]);
    out.uv.push(uv[i][0] / tw, uv[i][1] / th);
  }
}

export function addCuboid(out, c, tw, th, mirror = false) {
  const [x, y, z, w, h, d, dil, u, v] = c;
  let x0 = x - dil, x1 = x + w + dil;
  const y0 = y - dil, y1 = y + h + dil, z0 = z - dil, z1 = z + d + dil;
  if (mirror) [x0, x1] = [x1, x0];
  const v1 = [x0, y0, z0], v2 = [x1, y0, z0], v3 = [x1, y1, z0], v4 = [x0, y1, z0];
  const v5 = [x0, y0, z1], v6 = [x1, y0, z1], v7 = [x1, y1, z1], v8 = [x0, y1, z1];
  const j = u, k = u + d, l = u + d + w, m = u + d + w + w, n = u + d + w + d, o = u + d + w + d + w;
  const p = v, q = v + d, r = v + d + h;
  pushQuad(out, [v6, v5, v1, v2], k, p, l, q, tw, th); // unten im Modellraum = oben im Bild
  pushQuad(out, [v3, v4, v8, v7], l, q, m, p, tw, th);
  // Gespiegelt (linker Arm/Bein): nur x0/x1 tauschen, UV-Bereiche bleiben wie in Cuboid(mirror = true).
  pushQuad(out, [v1, v5, v8, v4], j, q, k, r, tw, th);
  pushQuad(out, [v2, v1, v4, v3], k, q, l, r, tw, th);
  pushQuad(out, [v6, v2, v3, v7], l, q, n, r, tw, th);
  pushQuad(out, [v5, v6, v7, v8], n, q, o, r, tw, th);
}

function geometryOf(out) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(out.pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(out.uv, 2));
  if (out.col) g.setAttribute('color', new THREE.Float32BufferAttribute(out.col, 3));
  if (out.nrm) g.setAttribute('normal', new THREE.Float32BufferAttribute(out.nrm, 3));
  else g.computeVertexNormals();
  return g;
}

// ---------------------------------------------------------------- Boss-Modelle aus export_web.py

export async function loadBoss(base, name, texture) {
  const json = await (await fetch(`${base}/models/${name}.json`)).json();
  const tex = texture || json.texture;
  const ext = json.texExt || 'png'; // große Atlanten liegen als verlustfreies WebP
  const [map, glow, fMap, fGlow] = await Promise.all([
    loadTex(`${base}/tex/${tex}.${ext}`),
    loadGlow(`${base}/tex/${tex}_glow.${ext}`),
    hasPlumes(json.parts) ? loadTex(`${base}/tex/feathers.png`, true) : null,
    hasPlumes(json.parts) ? loadGlow(`${base}/tex/feathers_glow.png`, true) : null,
  ]);
  const mat = new THREE.MeshLambertMaterial({
    map, alphaTest: 0.1, side: THREE.DoubleSide,
    emissive: glow ? 0xffffff : 0x000000, emissiveMap: glow || null, emissiveIntensity: 1.35,
  });
  const fMat = fMap ? new THREE.MeshLambertMaterial({
    map: fMap, alphaTest: 0.45, side: THREE.DoubleSide, vertexColors: true,
    emissive: fGlow ? 0xffffff : 0x000000, emissiveMap: fGlow || null, emissiveIntensity: 1.2,
  }) : null;
  return new BossModel(json, mat, fMat);
}

function hasPlumes(parts) {
  return parts.some((p) => p.f || (p.k && hasPlumes(p.k)));
}

function plumeGeometry(data) {
  const out = { pos: [], uv: [], col: [], nrm: [] };
  const PER = 6, ROWS = 4, FEATHER = ROWS * 2 * PER;
  for (let i = 0; i < data.length; i += FEATHER) {
    for (let row = 0; row < ROWS - 1; row++) {
      const a = i + row * 2 * PER, b = a + PER, c = b + PER * 2, d = a + PER * 2;
      for (const at of [a, b, c, a, c, d]) {
        out.pos.push(data[at], data[at + 1], data[at + 2]);
        out.uv.push(data[at + 3], data[at + 4]);
        const s = data[at + 5];
        out.col.push(s, s, s);
        out.nrm.push(0, -1, 0);
      }
    }
  }
  return geometryOf(out);
}

export class BossModel {
  constructor(json, mat, fMat) {
    this.json = json;
    this.poses = json.poses || {};
    this.bones = new Map();
    this.inner = new THREE.Group(); // Modellraum (Einheiten, Y nach unten)
    for (const p of json.parts) this.inner.add(this._part(p, mat, fMat));
    this.inner.scale.set(-1 / 16, -1 / 16, 1 / 16); // wie LivingEntityRenderer: scale(-1, -1, 1)
    this.pivot = new THREE.Group();
    this.pivot.add(this.inner);
    this.root = new THREE.Group(); // Weltraum (Blöcke), Füße bei y = 0
    this.root.add(this.pivot);
    this.current = new Map();
    this.anim = null;
    this.restName = this.poses.idle ? 'idle' : (this.poses.rest ? 'rest' : null);
    this.setPose(this.restName);
    this._ground();
    this.root.rotation.y = Math.PI; // erst nach dem Ausrichten, damit Box und Root-Raum übereinstimmen
  }

  _part(p, mat, fMat) {
    const g = new THREE.Group();
    g.name = p.n;
    g.position.set(p.p[0], p.p[1], p.p[2]);
    g.rotation.set(p.r[0], p.r[1], p.r[2], 'ZYX');
    if (p.s) g.scale.set(p.s[0], p.s[1], p.s[2]); // Verjüngung (Glieder des Schlangendrachen)
    g.userData.base = { p: p.p.slice(), r: p.r.slice() };
    if (p.c) {
      const out = { pos: [], uv: [] };
      for (const c of p.c) addCuboid(out, c, this.json.texW, this.json.texH, !!c[9]);
      const mesh = new THREE.Mesh(geometryOf(out), mat);
      mesh.castShadow = true;
      g.add(mesh);
    }
    if (p.f && fMat) g.add(new THREE.Mesh(plumeGeometry(p.f), fMat));
    if (!this.bones.has(p.n)) this.bones.set(p.n, []);
    this.bones.get(p.n).push(g);
    if (p.k) for (const k of p.k) g.add(this._part(k, mat, fMat));
    return g;
  }

  /** Füße auf den Boden, Mitte auf die Hochachse (aus der Ruhepose, damit Animationen nicht springen). */
  _ground() {
    this.root.updateMatrixWorld(true);
    // Nur sichtbare Teile: ausgeblendete Requisiten (Feuerball, Wurfwaffe) würden die Box verschieben.
    const box = new THREE.Box3();
    const tmp = new THREE.Box3();
    const visit = (o) => {
      if (!o.visible) return;
      if (o.isMesh) {
        if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
        box.union(tmp.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld));
      }
      for (const c of o.children) visit(c);
    };
    visit(this.pivot);
    const c = box.getCenter(new THREE.Vector3());
    this.pivot.position.set(-c.x, -box.min.y, -c.z);
    this.size = box.getSize(new THREE.Vector3());
  }

  target(name) {
    const pose = (name && this.poses[name]) || {};
    const t = new Map();
    for (const [bone, groups] of this.bones) {
      const base = groups[0].userData.base;
      const v = bone in pose ? pose[bone] : undefined;
      if (v === null) t.set(bone, { r: base.r, o: [0, 0, 0], vis: 0 });
      else if (v === undefined) t.set(bone, { r: base.r, o: [0, 0, 0], vis: 1 });
      else t.set(bone, { r: [v[0], v[1], v[2]], o: v.length >= 6 ? [v[3], v[4], v[5]] : [0, 0, 0], vis: 1 });
    }
    return t;
  }

  _apply(state) {
    for (const [bone, s] of state) {
      for (const g of this.bones.get(bone)) {
        const b = g.userData.base;
        g.rotation.set(s.r[0], s.r[1], s.r[2], 'ZYX');
        g.position.set(b.p[0] + s.o[0], b.p[1] + s.o[1], b.p[2] + s.o[2]);
        g.visible = s.vis >= 0.5;
      }
    }
    this.current = state;
  }

  setPose(name) {
    this.anim = null;
    this._apply(this.target(name));
  }

  /** Spielt eine Folge von Posen ab; jede Stufe: {pose, ms (Übergang), hold}. */
  play(steps, onDone) {
    this.anim = { steps, i: 0, t0: performance.now(), from: this.current, to: this.target(steps[0].pose), onDone };
  }

  update(now) {
    const a = this.anim;
    if (!a) return;
    const step = a.steps[a.i];
    const k = Math.min(1, (now - a.t0) / Math.max(1, step.ms));
    const e = step.ease === 'snap' ? 1 - Math.pow(1 - k, 3) : k * k * (3 - 2 * k);
    const state = new Map();
    for (const [bone, to] of a.to) {
      const from = a.from.get(bone) || to;
      state.set(bone, {
        r: [0, 1, 2].map((i) => from.r[i] + (to.r[i] - from.r[i]) * e),
        o: [0, 1, 2].map((i) => from.o[i] + (to.o[i] - from.o[i]) * e),
        vis: from.vis + (to.vis - from.vis) * e,
      });
    }
    this._apply(state);
    if (now - a.t0 >= step.ms + (step.hold || 0)) {
      a.i += 1;
      if (a.i >= a.steps.length) {
        this.anim = null;
        this.current = a.to;
        if (a.onDone) a.onDone();
        return;
      }
      a.from = a.to;
      a.to = this.target(a.steps[a.i].pose);
      a.t0 = now;
    }
  }
}

// ---------------------------------------------------------------- Rüstungspuppe (Biped wie im Spiel)

function eyeTexture(eye) {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = '#1b1820'; g.fillRect(0, 0, 64, 64);
  for (let i = 0; i < 260; i++) {
    g.fillStyle = Math.random() < 0.5 ? '#221e29' : '#16131b';
    g.fillRect((Math.random() * 64) | 0, (Math.random() * 64) | 0, 1, 1);
  }
  g.fillStyle = eye; // Augen auf der Kopf-Vorderseite (u 8..16, v 8..16)
  g.fillRect(9, 12, 2, 1); g.fillRect(13, 12, 2, 1);
  return pixelTex(new THREE.CanvasTexture(c));
}

function eyeGlow(eye) {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = '#000'; g.fillRect(0, 0, 64, 64);
  g.fillStyle = eye; g.fillRect(9, 12, 2, 1); g.fillRect(13, 12, 2, 1);
  return pixelTex(new THREE.CanvasTexture(c));
}

const BIPED = {
  head: { pivot: [0, 0, 0], box: [-4, -8, -4, 8, 8, 8], uv: [0, 0] },
  body: { pivot: [0, 0, 0], box: [-4, 0, -2, 8, 12, 4], uv: [16, 16] },
  arm_r: { pivot: [-5, 2, 0], box: [-3, -2, -2, 4, 12, 4], uv: [40, 16] },
  arm_l: { pivot: [5, 2, 0], box: [-1, -2, -2, 4, 12, 4], uv: [40, 16], mirror: true },
  leg_r: { pivot: [-1.9, 12, 0], box: [-2, 0, -2, 4, 12, 4], uv: [0, 16] },
  leg_l: { pivot: [1.9, 12, 0], box: [-2, 0, -2, 4, 12, 4], uv: [0, 16], mirror: true },
};

/** Leuchtebene der Rüstung (equipment-Layer *_glow wie im Spiel): volle Helligkeit, nur wo Alpha > 0. */
function glowLayer(tex) {
  // Wie RenderLayers.eyes im Spiel: volle Helligkeit, additiv, Alpha = Leuchtstärke.
  return new THREE.MeshBasicMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1, toneMapped: false });
}
const optionalTex = (url) => loadTex(url).catch(() => null);

/** Teilbaum eines exportierten Modells (n, p, r, c, k) als Gruppen, ohne Posen. */
function modelParts(p, mat, tw, th) {
  const g = new THREE.Group();
  g.name = p.n;
  g.position.set(p.p[0], p.p[1], p.p[2]);
  g.rotation.set(p.r[0], p.r[1], p.r[2], 'ZYX');
  if (p.c) {
    const out = { pos: [], uv: [] };
    for (const c of p.c) addCuboid(out, c, tw, th, !!c[9]);
    const mesh = new THREE.Mesh(geometryOf(out), mat);
    mesh.castShadow = true;
    g.add(mesh);
  }
  if (p.k) for (const k of p.k) g.add(modelParts(k, mat, tw, th));
  return g;
}

/**
 * Rüstung als eigenes 3D-Modell (z. B. Drachenherz-Wacht aus HHA Arius): armor/<set>.json mit Teilen, die je einem
 * Biped-Knochen gehören (`bone`), Drehpunkt 0 im Knochenraum wie im Spiel. Dazu <set>.png und optional <set>_glow.png.
 */
async function loadArmorStand3d(base, set, eye) {
  const [json, map, glow] = await Promise.all([
    fetch(`${base}/armor/${set}.json`).then((r) => { if (!r.ok) throw new Error(set); return r.json(); }),
    loadTex(`${base}/armor/${set}.png`), loadGlow(`${base}/armor/${set}_glow.png`),
  ]);
  const skin = new THREE.MeshLambertMaterial({ map: eyeTexture(eye), emissive: 0xffffff, emissiveMap: eyeGlow(eye) });
  const mat = new THREE.MeshLambertMaterial({
    map, alphaTest: 0.1, side: THREE.DoubleSide,
    emissive: glow ? 0xffffff : 0x000000, emissiveMap: glow || null, emissiveIntensity: 1.3,
  });
  const parts = {};
  const inner3 = new THREE.Group();
  for (const [name, def] of Object.entries(BIPED)) {
    const g = new THREE.Group();
    g.position.set(...def.pivot);
    const out = { pos: [], uv: [] };
    addCuboid(out, [...def.box, 0, def.uv[0], def.uv[1]], 64, 64, !!def.mirror);
    const mesh = new THREE.Mesh(geometryOf(out), skin);
    mesh.castShadow = true;
    g.add(mesh);
    parts[name] = g;
    inner3.add(g);
  }
  for (const p of json.parts) parts[p.bone]?.add(modelParts(p, mat, json.texW, json.texH));
  inner3.scale.set(-1 / 16, -1 / 16, 1 / 16);
  inner3.position.y = 24 / 16;
  const root = new THREE.Group();
  root.add(inner3);
  root.rotation.y = Math.PI;
  return { root, parts };
}

export async function loadArmorStand(base, set, eye, model3d = false) {
  if (model3d) return loadArmorStand3d(base, set, eye);
  const [outer, inner, outerGlow, innerGlow] = await Promise.all([
    loadTex(`${base}/armor/${set}.png`), loadTex(`${base}/armor/${set}_legs.png`),
    optionalTex(`${base}/armor/${set}_glow.png`), optionalTex(`${base}/armor/${set}_legs_glow.png`),
  ]);
  const skin = new THREE.MeshLambertMaterial({ map: eyeTexture(eye), emissive: 0xffffff, emissiveMap: eyeGlow(eye) });
  const outerMat = new THREE.MeshLambertMaterial({ map: outer, alphaTest: 0.1, side: THREE.DoubleSide });
  const innerMat = new THREE.MeshLambertMaterial({ map: inner, alphaTest: 0.1, side: THREE.DoubleSide });
  const layers = [
    { mat: skin, dil: 0, tw: 64, th: 64, parts: Object.keys(BIPED) },
    { mat: innerMat, dil: 0.5, tw: 64, th: 32, parts: ['body', 'leg_r', 'leg_l'] },
    { mat: outerMat, dil: 1.0, tw: 64, th: 32, parts: Object.keys(BIPED) },
  ];
  if (innerGlow) layers.push({ mat: glowLayer(innerGlow), dil: 0.5, tw: 64, th: 32, parts: ['body', 'leg_r', 'leg_l'] });
  if (outerGlow) layers.push({ mat: glowLayer(outerGlow), dil: 1.0, tw: 64, th: 32, parts: Object.keys(BIPED) });
  const parts = {};
  const inner3 = new THREE.Group();
  for (const [name, def] of Object.entries(BIPED)) {
    const g = new THREE.Group();
    g.position.set(...def.pivot);
    for (const layer of layers) {
      if (!layer.parts.includes(name)) continue;
      const out = { pos: [], uv: [] };
      addCuboid(out, [...def.box, layer.dil, def.uv[0], def.uv[1]], layer.tw, layer.th, !!def.mirror);
      const mesh = new THREE.Mesh(geometryOf(out), layer.mat);
      mesh.castShadow = true;
      g.add(mesh);
    }
    parts[name] = g;
    inner3.add(g);
  }
  inner3.scale.set(-1 / 16, -1 / 16, 1 / 16);
  inner3.position.y = 24 / 16;
  const root = new THREE.Group();
  root.add(inner3);
  root.rotation.y = Math.PI;
  return { root, parts };
}

// ---------------------------------------------------------------- Spieler mit eigenem, gezeichnetem Skin (Vibey-Hero)

function shadeHex(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v * k))).toString(16).padStart(2, '0');
  return `#${f((n >> 16) & 255)}${f((n >> 8) & 255)}${f(n & 255)}`;
}

/** Zeichnet einen 64x64-Skin im Spiellayout: Haare, Gesicht, Hoodie, Hose, Schuhe (eigene Figuren, kein Standard-Skin). */
export function playerSkin(look) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  let seed = look.seed || 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const box = (u, v, w, h, d, paint) => {
    const faces = [['top', u + d, v, w, d], ['bottom', u + d + w, v, w, d], ['right', u, v + d, d, h],
      ['front', u + d, v + d, w, h], ['left', u + d + w, v + d, d, h], ['back', u + d + w + d, v + d, w, h]];
    for (const [f, fx, fy, fw, fh] of faces) {
      for (let y = 0; y < fh; y++) {
        for (let x = 0; x < fw; x++) {
          const col = paint(f, x, y, fw, fh);
          if (!col) continue;
          g.fillStyle = shadeHex(col, 0.93 + rnd() * 0.12);
          g.fillRect(fx + x, fy + y, 1, 1);
        }
      }
    }
  };
  const { skin: S, hair: H, eyes: E, shirt: T, pants: P, shoes: B } = look;
  const T2 = shadeHex(T, 0.72);
  // Kopf: Haare oben und hinten, an den Seiten bis über die Ohren
  box(0, 0, 8, 8, 8, (f, x, y) => {
    if (f === 'top') return H;
    if (f === 'bottom') return S;
    if (f === 'back') return y < 7 ? H : S;
    if (f === 'front') {
      if (y < 2 || (y === 2 && (x === 0 || x === 7 || (look.fringe || []).includes(x)))) return H;
      if (y === 4 && (x === 1 || x === 5)) return '#f4f4f5';
      if (y === 4 && (x === 2 || x === 6)) return E;
      if (y === 6 && (x === 3 || x === 4)) return shadeHex(S, 0.78);
      return S;
    }
    const back = f === 'right' ? x < 4 : x >= 4;
    return y < 3 || (back && y < 6) ? H : S;
  });
  // Rumpf: Hoodie mit Kordeln, Bauchtasche und dunklerem Saum
  box(16, 16, 8, 12, 4, (f, x, y) => {
    if (f === 'front') {
      if (y < 4 && (x === 2 || x === 5) && y > 0) return '#e5e7eb';
      if (y >= 7 && y <= 9 && x >= 1 && x <= 6) return shadeHex(T, 0.84);
      if (y === 11) return T2;
      return T;
    }
    if (f === 'back' && y < 3 && x > 0 && x < 7) return shadeHex(T, 0.82);
    if (f === 'bottom' || (f !== 'top' && y === 11)) return T2;
    return T;
  });
  // Arme: Ärmel mit Bündchen, darunter die Hand
  box(40, 16, 4, 12, 4, (f, x, y) => {
    if (f === 'top') return T;
    if (f === 'bottom') return S;
    if (y < 8) return T;
    if (y === 8) return T2;
    return S;
  });
  // Beine: Hose und Schuhe mit heller Sohle
  box(0, 16, 4, 12, 4, (f, x, y) => {
    if (f === 'top') return P;
    if (f === 'bottom') return shadeHex(B, 0.8);
    if (y < 9) return P;
    if (y === 11) return shadeHex(B, 1.08);
    return f === 'front' && y === 9 ? shadeHex(B, 0.9) : shadeHex(B, 0.82);
  });
  return c;
}

/** Spielerfigur wie die Rüstungspuppe, aber mit gezeichnetem Skin; hand_r/hand_l markieren die Handflächen. */
export function loadPlayer(look) {
  const mat = new THREE.MeshLambertMaterial({ map: pixelTex(new THREE.CanvasTexture(playerSkin(look))) });
  const parts = {};
  const inner3 = new THREE.Group();
  for (const [name, def] of Object.entries(BIPED)) {
    const g = new THREE.Group();
    g.position.set(...def.pivot);
    const out = { pos: [], uv: [] };
    addCuboid(out, [...def.box, 0, def.uv[0], def.uv[1]], 64, 64, !!def.mirror);
    const mesh = new THREE.Mesh(geometryOf(out), mat);
    mesh.castShadow = true;
    g.add(mesh);
    parts[name] = g;
    inner3.add(g);
  }
  for (const [side, x] of [['r', -1], ['l', 1]]) {
    const hand = new THREE.Object3D();
    hand.position.set(x, 10.5, 0);
    parts[`arm_${side}`].add(hand);
    parts[`hand_${side}`] = hand;
  }
  inner3.scale.set(-1 / 16, -1 / 16, 1 / 16);
  inner3.position.y = 24 / 16;
  const root = new THREE.Group();
  root.add(inner3);
  root.rotation.y = Math.PI;
  return { root, parts };
}

// ---------------------------------------------------------------- Items: extrudiert wie im Spiel, Animation wie .mcmeta

export async function loadItem(url, { frametime = 4, interpolate = true } = {}) {
  const img = await loadImage(url);
  const size = img.width;
  const frames = Math.max(1, Math.round(img.height / size));
  const src = document.createElement('canvas');
  src.width = size; src.height = img.height;
  const sg = src.getContext('2d');
  sg.drawImage(img, 0, 0);
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const cg = canvas.getContext('2d');
  cg.imageSmoothingEnabled = false;
  cg.drawImage(src, 0, 0, size, size, 0, 0, size, size);
  const tex = pixelTex(new THREE.CanvasTexture(canvas));

  // Umriss aus Frame 0
  const alpha = sg.getImageData(0, 0, size, size).data;
  const solid = (x, y) => x >= 0 && y >= 0 && x < size && y < size && alpha[(y * size + x) * 4 + 3] > 16;
  const out = { pos: [], uv: [] };
  const t = 0.5 / size; // halbe Dicke (1 Pixel)
  const P = (x, y, z) => [x / size - 0.5, 0.5 - y / size, z];
  const quad = (a, b, c, d, uv) => {
    for (const [pt, u] of [[a, uv[0]], [b, uv[1]], [c, uv[2]], [a, uv[0]], [c, uv[2]], [d, uv[3]]]) {
      out.pos.push(...pt); out.uv.push(u[0], u[1]);
    }
  };
  quad(P(0, 0, t), P(size, 0, t), P(size, size, t), P(0, size, t), [[0, 0], [1, 0], [1, 1], [0, 1]]);
  quad(P(size, 0, -t), P(0, 0, -t), P(0, size, -t), P(size, size, -t), [[1, 0], [0, 0], [0, 1], [1, 1]]);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!solid(x, y)) continue;
      const cu = [(x + 0.5) / size, (y + 0.5) / size];
      const U = [cu, cu, cu, cu];
      if (!solid(x, y - 1)) quad(P(x, y, t), P(x, y, -t), P(x + 1, y, -t), P(x + 1, y, t), U);
      if (!solid(x, y + 1)) quad(P(x, y + 1, -t), P(x, y + 1, t), P(x + 1, y + 1, t), P(x + 1, y + 1, -t), U);
      if (!solid(x - 1, y)) quad(P(x, y, -t), P(x, y, t), P(x, y + 1, t), P(x, y + 1, -t), U);
      if (!solid(x + 1, y)) quad(P(x + 1, y, t), P(x + 1, y, -t), P(x + 1, y + 1, -t), P(x + 1, y + 1, t), U);
    }
  }
  const mat = new THREE.MeshLambertMaterial({ map: tex, alphaTest: 0.1, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometryOf(out), mat);
  mesh.castShadow = true;
  const order = [];
  for (let i = 0; i < frames; i++) order.push(i);
  for (let i = frames - 2; i > 0; i--) order.push(i);
  const tick = (now) => {
    if (frames < 2) return;
    const f = (now / 50) / frametime;
    const i = Math.floor(f) % order.length;
    const k = interpolate ? f - Math.floor(f) : 0;
    const a = order[i], b = order[(i + 1) % order.length];
    cg.globalAlpha = 1;
    cg.clearRect(0, 0, size, size);
    cg.drawImage(src, 0, a * size, size, size, 0, 0, size, size);
    if (k > 0.02) {
      cg.globalAlpha = k;
      cg.drawImage(src, 0, b * size, size, size, 0, 0, size, size);
    }
    tex.needsUpdate = true;
  };
  return { mesh, tick };
}

// ---------------------------------------------------------------- 3D-Handmodelle (Minecraft-Blockmodell-JSON, *_3d.json)

/** Animierte Streifen-Textur (wie .mcmeta): Canvas mit einem Frame, tick(now) blendet weiter. */
async function stripTexture(url, frametime = 4, interpolate = true) {
  const img = await loadImage(url);
  const w = img.width, frames = Math.max(1, Math.round(img.height / w));
  const c = document.createElement('canvas');
  c.width = w; c.height = w;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.drawImage(img, 0, 0, w, w, 0, 0, w, w);
  const tex = pixelTex(new THREE.CanvasTexture(c));
  const tick = (now) => {
    if (frames < 2) return;
    const f = (now / 50) / frametime;
    const a = Math.floor(f) % frames, b = (a + 1) % frames, k = interpolate ? f - Math.floor(f) : 0;
    g.globalAlpha = 1;
    g.clearRect(0, 0, w, w);
    g.drawImage(img, 0, a * w, w, w, 0, 0, w, w);
    if (k > 0.02) { g.globalAlpha = k; g.drawImage(img, 0, b * w, w, w, 0, 0, w, w); }
    tex.needsUpdate = true;
  };
  return { tex, tick };
}

const FACE = {
  // Ecken in Reihenfolge (u1,v1) (u2,v1) (u2,v2) (u1,v2); Koordinaten aus from=a, to=b. Wie FaceBakery ohne Face-Rotation.
  north: (a, b) => [[b[0], b[1], a[2]], [a[0], b[1], a[2]], [a[0], a[1], a[2]], [b[0], a[1], a[2]]],
  south: (a, b) => [[a[0], b[1], b[2]], [b[0], b[1], b[2]], [b[0], a[1], b[2]], [a[0], a[1], b[2]]],
  east: (a, b) => [[b[0], b[1], b[2]], [b[0], b[1], a[2]], [b[0], a[1], a[2]], [b[0], a[1], b[2]]],
  west: (a, b) => [[a[0], b[1], a[2]], [a[0], b[1], b[2]], [a[0], a[1], b[2]], [a[0], a[1], a[2]]],
  up: (a, b) => [[a[0], b[1], a[2]], [b[0], b[1], a[2]], [b[0], b[1], b[2]], [a[0], b[1], b[2]]],
  down: (a, b) => [[a[0], a[1], b[2]], [b[0], a[1], b[2]], [b[0], a[1], a[2]], [a[0], a[1], a[2]]],
};

/**
 * Lädt ein Minecraft-Item-Modell aus Elementen (wie blood_sword_3d.json). Ergebnis in Blockeinheiten (0..1),
 * dazu die display-Transformationen des Modells, damit es genauso in der Hand liegt wie im Spiel.
 */
export async function loadBlockModel(jsonURL, texURL, frametime = 4, extra = {}) {
  // extra: weitere Texturen des Modells nach Schlüssel ('1' für "#1"), je { url, frametime }
  const keys = Object.keys(extra);
  const [data, strip, ...more] = await Promise.all([
    fetch(jsonURL).then((r) => { if (!r.ok) throw new Error(jsonURL); return r.json(); }),
    stripTexture(texURL, frametime),
    ...keys.map((k) => stripTexture(extra[k].url, extra[k].frametime || 4)),
  ]);
  const strips = { '': strip };
  keys.forEach((k, i) => { strips[k] = more[i]; });
  const buckets = new Map(); // Textur + leuchtend -> Geometrie
  const bucket = (key, lightEmit) => {
    const id = `${key}|${lightEmit ? 1 : 0}`;
    if (!buckets.has(id)) buckets.set(id, { key, glow: lightEmit, pos: [], uv: [] });
    return buckets.get(id);
  };
  const v3 = new THREE.Vector3();
  for (const el of data.elements || []) {
    const a = el.from, b = el.to;
    let m = null;
    if (el.rotation && el.rotation.angle) {
      const o = el.rotation.origin.map((x) => x / 16);
      const axis = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] }[el.rotation.axis];
      m = new THREE.Matrix4().makeTranslation(o[0], o[1], o[2])
        .multiply(new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(...axis), THREE.MathUtils.degToRad(el.rotation.angle)))
        .multiply(new THREE.Matrix4().makeTranslation(-o[0], -o[1], -o[2]));
    }
    for (const [dir, f] of Object.entries(el.faces || {})) {
      if (!FACE[dir] || !f.uv) continue;
      const tk = String(f.texture || '').replace('#', '');
      const out = bucket(strips[tk] && tk ? tk : '', !!el.light_emission);
      const corners = FACE[dir](a, b).map((p) => {
        v3.set(p[0] / 16, p[1] / 16, p[2] / 16);
        if (m) v3.applyMatrix4(m);
        return [v3.x, v3.y, v3.z];
      });
      const [u1, v1, u2, v2] = f.uv.map((x) => x / 16);
      let uvs = [[u1, v1], [u2, v1], [u2, v2], [u1, v2]];
      const rot = ((f.rotation || 0) / 90) & 3;
      for (let i = 0; i < rot; i++) uvs = [uvs[3], uvs[0], uvs[1], uvs[2]];
      for (const i of [0, 3, 2, 0, 2, 1]) { out.pos.push(...corners[i]); out.uv.push(...uvs[i]); }
    }
  }
  const group = new THREE.Group();
  for (const b of buckets.values()) {
    const map = strips[b.key].tex;
    const mesh = b.glow
      ? new THREE.Mesh(geometryOf(b), new THREE.MeshBasicMaterial({ map, alphaTest: 0.1, side: THREE.DoubleSide, toneMapped: false }))
      : new THREE.Mesh(geometryOf(b), new THREE.MeshLambertMaterial({ map, alphaTest: 0.1, side: THREE.DoubleSide }));
    mesh.castShadow = !b.glow;
    group.add(mesh);
  }
  const ticks = Object.values(strips).map((s) => s.tick);
  return { group, display: data.display || {}, tick: (now) => ticks.forEach((f) => f(now)) };
}

/** Kette der Spiel-Transformationen: ItemInHandLayer (rechte Hand) + display.thirdperson_righthand. Kind von arm_r (Pixeleinheiten). */
export function handTransform(object, display, centered = false) {
  const hand = new THREE.Group();
  hand.scale.setScalar(16); // Arm-Gruppe rechnet in Pixeln, das Item in Blöcken
  const r1 = new THREE.Group(); r1.rotation.x = -Math.PI / 2;
  const r2 = new THREE.Group(); r2.rotation.y = Math.PI;
  const t1 = new THREE.Group(); t1.position.set(1 / 16, 0.125, -0.625);
  const d = display || {};
  const dt = new THREE.Group();
  const tr = (d.translation || [0, 0, 0]).map((x) => Math.max(-80, Math.min(80, x)) / 16);
  dt.position.set(tr[0], tr[1], tr[2]);
  const dr = new THREE.Group();
  const rr = (d.rotation || [0, 0, 0]).map((x) => THREE.MathUtils.degToRad(x));
  dr.rotation.set(rr[0], rr[1], rr[2], 'XYZ');
  const ds = new THREE.Group();
  ds.scale.set(...(d.scale || [1, 1, 1]));
  const off = new THREE.Group();
  if (!centered) off.position.set(-0.5, -0.5, -0.5);
  hand.add(r1); r1.add(r2); r2.add(t1); t1.add(dt); dt.add(dr); dr.add(ds); ds.add(off); off.add(object);
  return hand;
}

/** display für flache Handheld-Items (minecraft:item/handheld). */
export const HANDHELD = { rotation: [0, -90, 55], translation: [0, 4, 0.5], scale: [0.85, 0.85, 0.85] };

// ---------------------------------------------------------------- Prozedurale Pixeltexturen (eigene, keine Vanilla-Grafiken)

export function noiseTexture(colors, size = 16, seed = 1, edge = null) {
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const g = c.getContext('2d');
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      g.fillStyle = colors[Math.floor(rnd() * colors.length)];
      g.fillRect(x, y, 1, 1);
    }
  }
  if (edge) {
    g.fillStyle = edge;
    g.fillRect(0, 0, size, 1); g.fillRect(0, 0, 1, size);
  }
  return pixelTex(new THREE.CanvasTexture(c));
}
