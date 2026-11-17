// WebGL-Szenen: Verwaltung (nur sichtbare rendern, beim Seitenwechsel aufräumen) und wiederverwendbare 3D-Bausteine.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { loadBoss, loadArmorStand, loadPlayer, loadItem, loadBlockModel, handTransform, HANDHELD, noiseTexture } from './mc3d.js';
import { $, $$, t, tx, short, reduceMotion, onLang } from './core.js';

export { THREE };

// ------------------------------------------------------------ Verwaltung

const views = new Set();

export function makeView(canvas, { bloom = false, alpha = true, shadows = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  if (shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 200);
  const view = { canvas, renderer, scene, camera, visible: false, frame: null, composer: null, w: 0, h: 0, cleanup: [] };
  if (bloom) {
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(256, 256), 0.55, 0.45, 0.8));
    composer.addPass(new OutputPass());
    view.composer = composer;
  }
  const io = new IntersectionObserver((es) => { view.visible = es[0].isIntersecting; }, { rootMargin: '120px' });
  io.observe(canvas);
  view.cleanup.push(() => io.disconnect());
  views.add(view);
  return view;
}

/** Alle Szenen der Seite freigeben (WebGL-Kontexte sind begrenzt). */
export function disposeViews() {
  for (const v of views) {
    v.cleanup.forEach((f) => { try { f(); } catch (e) { /* egal */ } });
    v.scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
    });
    if (v.composer) v.composer.dispose?.();
    v.renderer.dispose();
    v.renderer.forceContextLoss();
  }
  views.clear();
}

function fit(view) {
  const w = view.canvas.clientWidth, h = view.canvas.clientHeight;
  if (!w || !h || (w === view.w && h === view.h)) return;
  view.w = w; view.h = h;
  view.renderer.setSize(w, h, false);
  if (view.composer) view.composer.setSize(w, h);
  view.camera.aspect = w / h;
  view.camera.updateProjectionMatrix();
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  for (const v of views) {
    if (!v.visible || !v.frame) continue;
    fit(v);
    v.frame(now, dt);
    if (v.composer) v.composer.render(); else v.renderer.render(v.scene, v.camera);
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ------------------------------------------------------------ Bausteine

export function particles(count, color, area, size) {
  const g = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const speed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = area.x[0] + Math.random() * (area.x[1] - area.x[0]);
    pos[i * 3 + 1] = area.y[0] + Math.random() * (area.y[1] - area.y[0]);
    pos[i * 3 + 2] = area.z[0] + Math.random() * (area.z[1] - area.z[0]);
    speed[i] = 0.15 + Math.random() * 0.35;
  }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({ color, size, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
  const pts = new THREE.Points(g, m);
  pts.userData.tick = (dt, now) => {
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speed[i] * dt;
      pos[i * 3] += Math.sin(now * 0.001 + i) * 0.05 * dt;
      if (pos[i * 3 + 1] > area.y[1]) pos[i * 3 + 1] = area.y[0];
    }
    g.attributes.position.needsUpdate = true;
  };
  return pts;
}

function rand(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

/** Weiches Leuchten am Boden (radialer Verlauf). */
function glowDisc(color, radius) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,0.9)');
  grd.addColorStop(0.35, 'rgba(255,255,255,0.35)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2, radius * 2),
    new THREE.MeshBasicMaterial({ map: tex, color, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.002;
  return m;
}

/** Gegenstand für die Hand: { json, tex, frametime } = 3D-Handmodell der Mod, { url } = flaches Item (extrudiert). */
async function loadHeld(held) {
  if (!held) return null;
  if (held.json) {
    const m = await loadBlockModel(held.json, held.tex, held.frametime || 4).catch(() => null);
    if (m) return { object: handTransform(m.group, m.display.thirdperson_righthand), tick: m.tick };
    if (!held.url) return null;
  }
  const s = await loadItem(held.url).catch(() => null);
  return s ? { object: handTransform(s.mesh, HANDHELD, true), tick: s.tick } : null;
}

/** Rüstungspuppe mit Waffe in der rechten Hand (Haltung wie im Spiel). */
export async function armorStand(base, armor, eye, held) {
  const [stand, item] = await Promise.all([loadArmorStand(base, armor, eye), loadHeld(held)]);
  if (item) stand.parts.arm_r.add(item.object);
  const holder = new THREE.Group();
  holder.add(stand.root);
  return { holder, stand, item };
}

const STANCES = [
  // [arm_r pitch, arm_r roll, arm_l pitch, arm_l roll, head yaw]; Schwerthaltung wie im Spiel, Arm angehoben, damit die Klinge zu sehen ist
  [-0.85, 0.28, 0.1, -0.12, 0.1],
  [-1.1, 0.38, -0.2, -0.2, -0.1],
  [-0.7, 0.32, 0.15, -0.14, 0.2],
  [-0.95, 0.24, 0.2, -0.2, -0.15],
];

export function poseStand(stand, s, ph, stance = 0) {
  const p = stand.parts;
  const [ap, ar, lp, lr, hy] = STANCES[stance % STANCES.length];
  p.arm_r.rotation.set(ap + Math.sin(s * 1.3 + ph) * 0.04, 0.05, ar, 'ZYX');
  p.arm_l.rotation.set(lp + Math.sin(s * 1.1 + ph) * 0.05, 0, lr - Math.sin(s * 1.1 + ph) * 0.03, 'ZYX');
  p.head.rotation.set(Math.sin(s * 0.7 + ph) * 0.05, hy + Math.sin(s * 0.45 + ph) * 0.12, 0, 'ZYX');
  p.leg_r.rotation.set(0.1, 0, 0.03, 'ZYX');
  p.leg_l.rotation.set(-0.1, 0, -0.03, 'ZYX');
}

/** Spieler hält mit einer Hand das Kabel zum anderen, die andere Hand pendelt locker. reach: 'r' oder 'l'. */
export function posePlayer(stand, s, ph, reach) {
  const p = stand.parts;
  const side = reach === 'r' ? 1 : -1;
  const hold = reach === 'r' ? p.arm_r : p.arm_l;
  const free = reach === 'r' ? p.arm_l : p.arm_r;
  hold.rotation.set(-0.9 + Math.sin(s * 1.2 + ph) * 0.05, 0, side * 0.1, 'ZYX');
  free.rotation.set(Math.sin(s * 1.1 + ph) * 0.07, 0, -side * 0.06, 'ZYX');
  p.head.rotation.set(0.08 + Math.sin(s * 0.7 + ph) * 0.04, side * 0.22 + Math.sin(s * 0.45 + ph) * 0.08, 0, 'ZYX');
  p.leg_r.rotation.set(0.06, 0, 0.03, 'ZYX');
  p.leg_l.rotation.set(-0.06, 0, -0.03, 'ZYX');
}

/** Blaues Pixelkabel zwischen zwei Punkten: Voxel auf dem 1/16-Raster, durchhängend, mit hin- und herlaufenden Datenpaketen. */
function pixelCable(color) {
  const G = 1 / 16;
  const MAX = 320;
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(G * 2, G * 2, G * 2),
    new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }), MAX);
  mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX * 3), 3);
  mesh.frustumCulled = false;
  mesh.castShadow = true;
  const plugMat = new THREE.MeshLambertMaterial({ color: 0x1e2533 });
  const plugs = [0, 1].map(() => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(G * 3, G * 3, G * 3), plugMat);
    m.castShadow = true;
    return m;
  });
  const light = new THREE.PointLight(color, 1.6, 3.5, 2);
  const group = new THREE.Group();
  group.add(mesh, ...plugs, light);
  const base = new THREE.Color(color);
  const hi = new THREE.Color(0xe6f0ff);
  const col = new THREE.Color();
  const mat = new THREE.Matrix4();
  const seen = new Set();
  const update = (a, b, now) => {
    const len = a.distanceTo(b);
    const sag = 0.3 + len * 0.1;
    const steps = Math.ceil((len / G) * 1.8);
    const p1 = (now / 1600) % 1;
    const p2 = 1 - ((now / 1600 + 0.5) % 1);
    seen.clear();
    let n = 0;
    for (let k = 0; k <= steps && n < MAX; k++) {
      const t = k / steps;
      const x = Math.round((a.x + (b.x - a.x) * t) / G);
      const y = Math.round((a.y + (b.y - a.y) * t - sag * 4 * t * (1 - t)) / G);
      const z = Math.round((a.z + (b.z - a.z) * t) / G);
      const key = `${x},${y},${z}`;
      if (seen.has(key)) continue;
      seen.add(key);
      mat.makeTranslation(x * G, y * G, z * G);
      mesh.setMatrixAt(n, mat);
      const d = Math.min(Math.abs(t - p1), Math.abs(t - p2));
      mesh.setColorAt(n, col.copy(base).lerp(hi, Math.max(0, 1 - d * 16)));
      n++;
    }
    mesh.count = n;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;
    plugs[0].position.copy(a);
    plugs[1].position.copy(b);
    light.position.set((a.x + b.x) / 2, (a.y + b.y) / 2 - sag, (a.z + b.z) / 2);
  };
  return { group, update };
}

// Zwei eigene Figuren für Vibey Multiplayer (gezeichnet, keine Standard-Skins von Minecraft)
const VIBEY_PLAYERS = [
  { skin: '#e3b08a', hair: '#5a3a22', eyes: '#2f6fd6', shirt: '#3b82f6', pants: '#232a36', shoes: '#e7e9ee', fringe: [3, 4], seed: 11 },
  { skin: '#b97c55', hair: '#18181b', eyes: '#3b2a1c', shirt: '#8b5cf6', pants: '#2c3444', shoes: '#f5f5f5', fringe: [1, 5, 6], seed: 23 },
];

/** Hero von Vibey: zwei Spieler, verbunden mit einem blauen Pixelkabel. */
export function linkStage(canvas, { glow = 0x3b82f6, cable = 0x3b82f6, zoom = 1.25, signal } = {}) {
  return stageScene(canvas, {
    figures: [{ player: VIBEY_PLAYERS[0], reach: 'l', face: 0.55 }, { player: VIBEY_PLAYERS[1], reach: 'r', face: -0.55 }],
    cable, glow, zoom, lift: -0.08, signal,
  });
}

/**
 * Freigestellte Bühne wie auf Produktseiten: Figuren und/oder ein Boss auf unsichtbarem Boden mit Schatten und Leuchten.
 * figures: [{ base, armor, eye, held, glow, stance }], boss: { base, model, texture, yaw }, glow: Farbe von Licht und Boden.
 * spin: langsam drehen, yaw: Grundblick, zoom: Abstand (1 = passend), lift: Blickpunkt anheben (Anteil der Höhe).
 */
export async function stageScene(canvas, { figures = [], boss = null, glow = 0xffffff, spin = false, yaw = 0, zoom = 1, lift = 0, cable = null, signal } = {}) {
  const view = makeView(canvas, { alpha: true, shadows: true });
  const { scene, camera } = view;
  camera.fov = 26;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x1a1622, 1.25));
  const key = new THREE.DirectionalLight(0xffffff, 1.9);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0004;
  scene.add(key);
  const rim = new THREE.DirectionalLight(glow, 2.2);
  rim.position.set(4, 3, -6);
  scene.add(rim);

  const content = new THREE.Group();
  scene.add(content);
  const tickers = [];
  const stands = [];
  const n = figures.length;
  const spacing = cable != null ? 2.6 : 1.3;
  const player = (look) => { const stand = loadPlayer(look); const holder = new THREE.Group(); holder.add(stand.root); return { holder, stand, item: null }; };
  const loaded = await Promise.all(figures.map((f) => (f.player ? Promise.resolve(player(f.player)) : armorStand(f.base, f.armor, f.eye, f.held)).catch(() => null)));
  loaded.forEach((s, i) => {
    if (!s) return;
    const x = (i - (n - 1) / 2) * spacing;
    s.holder.position.set(x, 0, cable != null ? 0 : -Math.abs(x) * 0.25);
    s.holder.rotation.y = figures[i].face ?? (n === 1 ? -0.45 : -0.3 - x * 0.12);
    content.add(s.holder);
    stands.push({ s, ph: i * 1.7, stance: figures[i].stance ?? i, reach: figures[i].reach });
    if (s.item) tickers.push(s.item.tick);
    if (figures[i].glow != null) {
      const d = glowDisc(figures[i].glow, 0.85);
      d.position.set(x, 0.002, s.holder.position.z);
      scene.add(d);
    }
  });
  let bossModel = null;
  if (boss) {
    bossModel = await loadBoss(boss.base, boss.model, boss.texture).catch(() => null);
    if (bossModel) {
      const g = new THREE.Group();
      g.add(bossModel.root);
      g.rotation.y = boss.yaw ?? 0.45;
      if (bossModel.restName) bossModel.setPose(bossModel.restName);
      content.add(g);
      bossModel.holder = g;
    }
  }
  if (signal?.aborted) return view;

  // Rahmen aus der echten Größe
  content.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(content);
  if (box.isEmpty()) box.set(new THREE.Vector3(-1, 0, -1), new THREE.Vector3(1, 2, 1));
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const span = Math.max(size.x, size.z * 0.6, size.y * 0.5, 0.5);
  const floorR = Math.max(size.x, size.z) * 0.55 + 0.4;
  if (!figures.some((f) => f.glow != null)) {
    const d = glowDisc(glow, floorR);
    d.position.set(center.x, 0.002, center.z);
    scene.add(d);
  }
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(floorR * 8, floorR * 8), new THREE.ShadowMaterial({ opacity: 0.5 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(center.x, 0, center.z);
  floor.receiveShadow = true;
  scene.add(floor);
  const reach = Math.max(size.x, size.y, size.z) * 0.9 + 1;
  Object.assign(key.shadow.camera, { left: -reach, right: reach, top: reach, bottom: -reach, near: 0.5, far: reach * 6 });
  key.position.set(center.x - reach * 0.7, center.y + reach * 2, center.z + reach * 1.4);
  key.target.position.copy(center);
  scene.add(key.target);
  key.shadow.camera.updateProjectionMatrix();

  const motes = particles(Math.round(26 + span * 4), glow,
    { x: [center.x - size.x * 0.7 - 0.5, center.x + size.x * 0.7 + 0.5], y: [0, size.y * 1.05], z: [center.z - size.z * 0.6 - 0.4, center.z + size.z * 0.6 + 0.4] },
    Math.max(0.03, Math.max(size.x, size.y) * 0.01));
  motes.material.opacity = 0.65;
  scene.add(motes);

  let wire = null;
  const handA = new THREE.Vector3(), handB = new THREE.Vector3();
  if (cable != null && stands.length === 2) {
    wire = pixelCable(cable);
    scene.add(wire.group);
  }

  let mx = 0, my = 0;
  addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true, signal });
  const target = new THREE.Vector3(center.x, size.y * (0.5 + lift), center.z);
  const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  view.frame = (now, dt) => {
    const s = reduceMotion ? 0 : now / 1000;
    const a = yaw + (spin ? s * 0.22 : Math.sin(s * 0.2) * 0.14) + mx * 0.16;
    const aspect = Math.max(0.3, view.w / Math.max(1, view.h));
    const wide = Math.max(size.x, size.z) * 1.04;
    const dist = Math.max((size.y * 1.12) / 2 / tan, wide / 2 / tan / aspect) * zoom + Math.min(size.x, size.z) * 0.5;
    camera.position.set(target.x + Math.sin(a) * dist, target.y + dist * 0.14 + my * dist * 0.04, target.z + Math.cos(a) * dist);
    camera.lookAt(target);
    stands.forEach(({ s: st, ph, stance, reach }) => (reach ? posePlayer(st.stand, s, ph, reach) : poseStand(st.stand, s, ph, stance)));
    if (wire) {
      content.updateMatrixWorld(true);
      const [A, B] = stands;
      A.s.stand.parts[`hand_${A.reach}`].getWorldPosition(handA);
      B.s.stand.parts[`hand_${B.reach}`].getWorldPosition(handB);
      wire.update(handA, handB, reduceMotion ? 0 : now);
    }
    tickers.forEach((f) => f(now));
    if (bossModel) bossModel.update(now);
    motes.userData.tick(dt, now);
  };
  view.bossModel = bossModel;
  return view;
}

/** Ein einzelnes Item (3D-Handmodell oder extrudiert), schwebend und drehend. */
export async function itemSpin(canvas, held) {
  const view = makeView(canvas, { alpha: true });
  const { scene, camera } = view;
  camera.fov = 30;
  camera.position.set(0, 0.1, 2.5);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x302030, 1.4));
  const k = new THREE.DirectionalLight(0xffffff, 1.6);
  k.position.set(1, 2, 3);
  scene.add(k);
  let obj = null, tick = () => {};
  if (held.json) {
    const m = await loadBlockModel(held.json, held.tex, held.frametime || 4).catch(() => null);
    if (m) {
      obj = new THREE.Group();
      m.group.position.set(-0.5, -0.5, -0.5);
      const box = new THREE.Box3().setFromObject(m.group);
      const sz = box.getSize(new THREE.Vector3());
      const c = box.getCenter(new THREE.Vector3());
      m.group.position.sub(c);
      const inner = new THREE.Group();
      inner.add(m.group);
      inner.scale.setScalar(1.15 / Math.max(sz.x, sz.y, sz.z, 0.2));
      obj.add(inner);
      tick = m.tick;
    }
  }
  if (!obj && held.url) {
    const s = await loadItem(held.url).catch(() => null);
    if (s) { obj = new THREE.Group(); obj.add(s.mesh); tick = s.tick; }
  }
  if (obj) scene.add(obj);
  view.frame = (now) => {
    const s = reduceMotion ? 0 : now / 1000;
    if (obj) { obj.rotation.y = s * 0.9; obj.position.y = Math.sin(s * 1.8) * 0.04; }
    tick(now);
  };
  return view;
}

// ------------------------------------------------------------ Boss-Betrachter

function timing(p) {
  if (/windup|raise|lift|charge|inhale|reach|_set|cast|coil|emerge|flip|scoop|ascend|vanish|step|prep|gather|rise/.test(p)) return { ms: 560, hold: 260 };
  if (/hit|throw|release|dash$|dive$|bite|spit|fire|pull|slash|thrust$|push|roll$|spokes$|grab|devour_bite|_3$|strike|slam|smash|burst|shot|swing/.test(p)) return { ms: 150, hold: 520, ease: 'snap' };
  return { ms: 430, hold: 420 };
}

const modelCache = new Map();
export function bossModel(base, b) {
  const key = base + '|' + b.model + '|' + (b.texture || '');
  if (!modelCache.has(key)) modelCache.set(key, loadBoss(base, b.model, b.texture));
  return modelCache.get(key);
}
export function clearModelCache() { modelCache.clear(); }

/** Viewer mit Hotbar, Bossleiste und Infotafel. root = Container mit .stage/.boss-info/.hotbar. */
export async function bossViewer(root, base, bosses, signal, accent = 0xffc94a) {
  const canvas = $('canvas', root);
  const view = makeView(canvas, { bloom: true, alpha: false, shadows: true });
  const { scene, camera } = view;
  scene.background = new THREE.Color(0x09090c);
  scene.fog = new THREE.Fog(0x09090c, 16, 40);
  camera.fov = 32;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x1a1820, 1.25));
  const key = new THREE.DirectionalLight(0xfff2e0, 1.9);
  key.position.set(-4, 9, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -8, right: 8, top: 10, bottom: -4, near: 1, far: 30 });
  key.shadow.bias = -0.0005;
  scene.add(key);
  const rim = new THREE.DirectionalLight(accent, 1.6);
  rim.position.set(3, 4, -8);
  scene.add(rim);
  const floorTex = noiseTexture(['#141418', '#17171c', '#121216', '#16161a', '#131317'], 16, 41, '#0e0e11');
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.repeat.set(40, 40);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshLambertMaterial({ map: floorTex }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  const rune = new THREE.Mesh(new THREE.RingGeometry(1.6, 1.75, 64), new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
  rune.rotation.x = -Math.PI / 2;
  rune.position.y = 0.01;
  scene.add(rune);
  const motes = particles(60, accent, { x: [-7, 7], y: [0, 9], z: [-7, 4] }, 0.05);
  scene.add(motes);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 1.1;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.enablePan = false;
  view.cleanup.push(() => controls.dispose());
  // Mausrad scrollt die Seite; gezoomt wird nur mit Strg/Cmd. Senkrechtes Wischen auf dem Handy scrollt ebenfalls.
  canvas.style.touchAction = 'pan-y';
  const stage = canvas.parentElement;
  const hint = $('.stage-hint', root);
  let hintTimer = 0;
  stage.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) return;
    e.stopPropagation();
    if (hint) {
      hint.classList.add('flash');
      clearTimeout(hintTimer);
      hintTimer = setTimeout(() => hint.classList.remove('flash'), 1400);
    }
  }, { capture: true, passive: true, signal });

  const holder = new THREE.Group();
  scene.add(holder);
  let current = null, entry = null, lastUser = performance.now(), frameTo = null, framed = false;

  const frameModel = (m, instant) => {
    const h = m.size.y, w = Math.max(m.size.x, m.size.z);
    const tgt = new THREE.Vector3(0, h * 0.48, 0);
    const span = Math.max(h, w * 0.85);
    const dist = (span * 0.68) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) + w * 0.3;
    controls.minDistance = dist * 0.35;
    controls.maxDistance = dist * 2.2;
    rune.scale.setScalar(Math.max(0.6, w * 0.45));
    const pos = tgt.clone().addScaledVector(new THREE.Vector3(0.45, 0.22, 1).normalize(), dist);
    if (instant) { controls.target.copy(tgt); camera.position.copy(pos); }
    else frameTo = { t0: performance.now(), fromT: controls.target.clone(), fromP: camera.position.clone(), tgt, pos };
  };

  const info = $('.boss-info', root);
  const bar = $('.bb-bar', root);
  const name = $('.bb-name', root);
  const loading = $('.stage-loading', root);

  function renderInfo() {
    const b = entry;
    info.innerHTML = `
      <p class="eyebrow" style="color:${b.color}">${t(b.sub)}</p>
      <h3 class="boss-name">${t(b.name)}</h3>
      <p class="desc">${t(short(b.desc, 2))}</p>
      ${b.trick ? `<p class="trick"><span class="trick-label">${t({ de: 'Der Trick', en: 'The trick' })}</span> ${t(short(b.trick, 1))}</p>` : ''}
      ${b.moves?.length ? `<p class="moves-label">${t({ de: 'Angriff ansehen', en: 'Watch an attack' })}</p>
      <div class="moves">${b.moves.slice(0, 8).map((mv, i) => `<button class="chip" data-move="${i}">${t(mv.n)}</button>`).join('')}</div>` : ''}`;
    $$('[data-move]', info).forEach((btn) => btn.addEventListener('click', () => {
      lastUser = performance.now();
      playMove(b.moves[+btn.dataset.move], btn);
    }));
    bar.innerHTML = '';
    bar.style.setProperty('--bb', b.color);
    const n = b.segments || 1;
    for (let i = 0; i < n; i++) {
      const seg = document.createElement('span');
      seg.className = 'bb-seg' + (n === 1 ? ' notched' : '');
      bar.appendChild(seg);
    }
    name.innerHTML = t(b.name);
  }

  function rest() {
    if (!current) return;
    if (entry.loop) current.play(entry.loop.map((p) => ({ pose: p, ms: 260, hold: 20 })), () => { if (!current.anim) rest(); });
    else current.play([{ pose: current.restName, ms: 650, hold: 0 }]);
  }
  let activeBtn = null;
  function playMove(mv, btn) {
    if (!current) return;
    const steps = mv.p.filter((p) => current.poses[p]).map((p) => ({ pose: p, ...timing(p) }));
    if (!steps.length) return;
    if (activeBtn) activeBtn.classList.remove('on');
    activeBtn = btn || null;
    if (activeBtn) activeBtn.classList.add('on');
    steps.push({ pose: current.restName, ms: 700, hold: 200 });
    const model = current;
    current.play(steps, () => {
      if (activeBtn) activeBtn.classList.remove('on');
      activeBtn = null;
      if (model === current) rest();
    });
  }

  let token = 0;
  async function select(i, user) {
    const b = bosses[i];
    entry = b;
    $$('.hb-slot', root).forEach((s, j) => { s.classList.toggle('sel', j === i); s.setAttribute('aria-selected', String(j === i)); });
    renderInfo();
    if (user) { try { history.replaceState(history.state, '', location.pathname + '#boss-' + b.id); } catch (e) { /* egal */ } }
    const my = ++token;
    if (!b.model) { loading.hidden = false; loading.innerHTML = t({ de: 'Kein 3D-Modell', en: 'No 3D model' }); if (current) { holder.remove(current.root); current = null; } return; }
    loading.hidden = false;
    loading.innerHTML = t({ de: 'Lade Modell …', en: 'Loading model …' });
    const m = await bossModel(base, b).catch(() => null);
    if (my !== token) return;
    if (!m) { loading.innerHTML = t({ de: 'Modell fehlt', en: 'Model missing' }); return; }
    loading.hidden = true;
    if (current) holder.remove(current.root);
    current = m;
    current.setPose(current.restName);
    holder.add(current.root);
    frameModel(current, !framed);
    framed = true;
    rest();
  }

  const hotbar = $('.hotbar', root);
  hotbar.hidden = bosses.length < 2;
  bosses.forEach((b, i) => {
    const slot = document.createElement('button');
    slot.className = 'hb-slot';
    slot.type = 'button';
    slot.setAttribute('role', 'tab');
    slot.setAttribute('aria-label', tx(b.name));
    slot.title = tx(b.name);
    slot.innerHTML = `<img alt="" hidden><span class="hb-num">${i < 9 ? i + 1 : ''}</span>`;
    slot.addEventListener('click', () => { lastUser = performance.now(); select(i, true); }, { signal });
    hotbar.appendChild(slot);
  });
  view.cleanup.push(onLang(() => $$('.hb-slot', root).forEach((s, i) => { s.title = tx(bosses[i].name); s.setAttribute('aria-label', tx(bosses[i].name)); })));
  if (bosses.length > 1) {
    document.addEventListener('keydown', (e) => {
      if (e.target.closest('input, textarea') || e.metaKey || e.ctrlKey || e.altKey) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 9 && n <= bosses.length) { lastUser = performance.now(); select(n - 1, true); }
    }, { signal });
  }
  $('.btn-rotate', root).addEventListener('click', (e) => {
    controls.autoRotate = !controls.autoRotate;
    e.currentTarget.setAttribute('aria-pressed', String(controls.autoRotate));
  }, { signal });
  $('.btn-reset', root).addEventListener('click', () => { if (current) frameModel(current, false); }, { signal });
  controls.addEventListener('start', () => { lastUser = performance.now(); });

  view.frame = (now, dt) => {
    if (frameTo) {
      const k = Math.min(1, (now - frameTo.t0) / 600);
      const e = k * k * (3 - 2 * k);
      controls.target.lerpVectors(frameTo.fromT, frameTo.tgt, e);
      camera.position.lerpVectors(frameTo.fromP, frameTo.pos, e);
      if (k >= 1) frameTo = null;
    }
    controls.update();
    if (current) {
      current.update(now);
      const s = reduceMotion ? 0 : now / 1000;
      holder.position.y = entry.hover ? (Math.sin(s * 1.6) * 0.5 + 0.5) * entry.hover * current.size.y : 0;
      if (!reduceMotion && entry.moves?.length && !activeBtn && now - lastUser > (entry.loop ? 9000 : 7000) && (!current.anim || entry.loop)) {
        lastUser = now;
        playMove(entry.moves[Math.floor(Math.random() * entry.moves.length)], null);
      }
    }
    rune.rotation.z += dt * 0.25;
    rune.material.opacity = 0.35 + Math.sin(now / 500) * 0.15;
    motes.userData.tick(dt, now);
  };

  const fromHash = bosses.findIndex((b) => location.hash === '#boss-' + b.id);
  await select(fromHash >= 0 ? fromHash : 0, false);
  if (bosses.length > 1) thumbnails(base, bosses, $$('.hb-slot img', root), () => view.disposed);
  view.cleanup.push(() => { view.disposed = true; });
  return view;
}

/** Vorschaubilder der Modelle (für Hotbar und Karten). */
export async function thumbnails(base, bosses, imgs, cancelled = () => false, size = 128) {
  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  r.setSize(size, size);
  r.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x302030, 1.6));
  const l = new THREE.DirectionalLight(0xffffff, 1.4); l.position.set(-2, 4, 5); scene.add(l);
  const cam = new THREE.PerspectiveCamera(30, 1, 0.05, 100);
  try {
    for (let i = 0; i < bosses.length; i++) {
      if (cancelled()) break;
      const b = bosses[i];
      if (!b.model || !imgs[i]) continue;
      const m = await bossModel(base, b).catch(() => null);
      if (!m) continue;
      imgs[i].src = renderThumb(r, scene, cam, m, b.thumbYaw ?? -0.55);
      imgs[i].hidden = false;
    }
  } finally {
    r.dispose();
    r.forceContextLoss();
  }
}

export function renderThumb(r, scene, cam, m, yaw) {
  const parent = m.root.parent;
  const prev = m.current;
  const g = new THREE.Group();
  g.add(m.root);
  g.rotation.y = yaw;
  scene.add(g);
  m._apply(m.target(m.restName));
  const h = m.size.y, w = Math.max(m.size.x, m.size.z);
  const span = Math.max(h, w);
  const d = (span * 0.56) / Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) + w * 0.2;
  cam.position.set(0, h * 0.5 + span * 0.08, d);
  cam.lookAt(0, h * 0.5, 0);
  r.render(scene, cam);
  const url = r.domElement.toDataURL();
  scene.remove(g);
  g.remove(m.root);
  if (parent) parent.add(m.root);
  m._apply(prev);
  return url;
}
