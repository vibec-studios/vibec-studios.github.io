// WebGL-Szenen: Verwaltung (nur sichtbare rendern, beim Seitenwechsel aufräumen) und wiederverwendbare 3D-Bausteine.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { loadBoss, loadArmorStand, loadItem, noiseTexture } from './mc3d.js';
import { $, $$, t, tx, reduceMotion, onLang } from './core.js';

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

/** Schwebende Insel; `zones` teilt die Breite in Abschnitte mit eigenen Block-Paletten. */
export function island(zones, { width = 8, depth = 4, seed = 3 } = {}) {
  const group = new THREE.Group();
  const r = rand(seed);
  const tex = zones.map((z, i) => ({
    side: noiseTexture(z.side, 16, 20 + i * 3),
    top: noiseTexture(z.top || z.side, 16, 21 + i * 3, z.edge || null),
  }));
  const layers = [[width, depth, 0], [width - 2, depth - 1, -1], [Math.max(2, width - 4), Math.max(1, depth - 2), -2], [Math.max(1, width - 6), 1, -3]];
  const box = new THREE.BoxGeometry(1, 1, 1);
  for (const [w, d, y] of layers) {
    for (let x = 0; x < w; x++) for (let z = 0; z < d; z++) {
      if (y < 0 && r() < 0.18) continue;
      const zi = Math.min(zones.length - 1, Math.floor(((x + 0.5) / w) * zones.length));
      const m = new THREE.Mesh(box, new THREE.MeshLambertMaterial({ map: y === 0 ? tex[zi].top : tex[zi].side }));
      m.position.set(x - w / 2 + 0.5, y - 0.5, z - d / 2 + 0.5);
      m.receiveShadow = true;
      m.castShadow = y === 0;
      group.add(m);
    }
  }
  return group;
}

/** Rüstungspuppe mit Schwert in der rechten Hand. */
export async function armorStand(base, armor, eye, swordURL) {
  const [stand, sword] = await Promise.all([
    loadArmorStand(base, armor, eye),
    swordURL ? loadItem(swordURL).catch(() => null) : null,
  ]);
  if (sword) {
    const hold = new THREE.Group();
    hold.position.set(-1, 10, -1);
    hold.scale.set(-16, -16, 16);
    const inner = new THREE.Group();
    inner.rotation.x = -0.9;
    const tilt = new THREE.Group();
    tilt.rotation.y = Math.PI / 2;
    sword.mesh.position.set(0.28, 0.28, 0);
    tilt.add(sword.mesh);
    inner.add(tilt);
    hold.add(inner);
    stand.parts.arm_r.add(hold);
  }
  const holder = new THREE.Group();
  holder.add(stand.root);
  return { holder, stand, sword };
}

export function poseStand(stand, s, ph) {
  const p = stand.parts;
  p.arm_r.rotation.set(-0.55 + Math.sin(s * 1.3 + ph) * 0.05, 0.05, 0.08, 'ZYX');
  p.arm_l.rotation.set(Math.sin(s * 1.1 + ph) * 0.06, 0, -0.08 - Math.sin(s * 1.1 + ph) * 0.04, 'ZYX');
  p.head.rotation.set(Math.sin(s * 0.7 + ph) * 0.06, Math.sin(s * 0.45 + ph) * 0.25, 0, 'ZYX');
  p.leg_r.rotation.x = 0.06; p.leg_l.rotation.x = -0.06;
}

/** Hero-Szene mit Puppen (und/oder einem Boss) auf einer Insel. figures: [{armor, eye, sword, base}] | boss: {base, model, texture} */
export async function heroScene(canvas, { figures = [], boss = null, zones, glow = [0xffd36a, 0x3fd8ff], wide = false, signal } = {}) {
  const view = makeView(canvas, { alpha: true, shadows: true });
  const { scene, camera } = view;
  camera.fov = 30;
  scene.add(new THREE.HemisphereLight(0xfff4e0, 0x241828, 1.1));
  const sun = new THREE.DirectionalLight(0xfff0d0, 1.6);
  sun.position.set(-3, 6, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 6, bottom: -3 });
  scene.add(sun);
  const lights = glow.map((c, i) => {
    const l = new THREE.PointLight(c, 7, 7, 1.6);
    l.position.set(glow.length === 1 ? 0 : -2.6 + (5.2 * i) / (glow.length - 1), 2.2, 1.6);
    scene.add(l);
    return l;
  });
  const n = Math.max(1, figures.length);
  const width = wide ? Math.max(8, n * 2.4 + 2) : 8;
  const isl = island(zones, { width: Math.round(width), depth: 4 });
  scene.add(isl);

  const stands = await Promise.all(figures.map((f) => armorStand(f.base, f.armor, f.eye, f.sword).catch(() => null)));
  const spacing = figures.length > 2 ? 2.2 : 2.4;
  stands.forEach((s, i) => {
    if (!s) return;
    const x = (i - (figures.length - 1) / 2) * spacing;
    s.holder.position.set(x, 0, 0.3);
    s.holder.rotation.y = figures.length === 1 ? 0.25 : -x * 0.18;
    scene.add(s.holder);
  });
  let bossModel = null;
  if (boss) {
    bossModel = await loadBoss(boss.base, boss.model, boss.texture).catch(() => null);
    if (bossModel) {
      const g = new THREE.Group();
      const k = Math.min(1, 2.6 / Math.max(bossModel.size.y, 0.1)) * (boss.scale || 1);
      g.scale.setScalar(k);
      g.add(bossModel.root);
      g.rotation.y = 0.35;
      scene.add(g);
      bossModel.holder = g;
    }
  }
  const pts = glow.map((c, i) => {
    const span = width / glow.length;
    const p = particles(60, c, { x: [-width / 2 - 1 + i * span, -width / 2 - 1 + (i + 1) * span + 1], y: [-1, 4.5], z: [-2, 2] }, 0.06);
    scene.add(p);
    return p;
  });

  let mx = 0, my = 0;
  addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true, signal });
  const target = new THREE.Vector3(0, wide ? 0.9 : 0.7, 0);
  view.frame = (now, dt) => {
    const s = reduceMotion ? 0 : now / 1000;
    const yaw = Math.sin(s * 0.18) * (wide ? 0.12 : 0.22) + mx * (wide ? 0.2 : 0.35);
    const base = wide ? width * 1.28 + 2.5 : 8.4;
    const dist = view.w < 560 ? base * 1.12 : base;
    camera.position.set(Math.sin(yaw) * dist, 2.3 - my * 0.6, Math.cos(yaw) * dist);
    camera.lookAt(target);
    isl.position.y = Math.sin(s * 0.8) * 0.04;
    stands.forEach((st, i) => {
      if (!st) return;
      st.holder.position.y = isl.position.y;
      poseStand(st.stand, s, i * 1.7);
      st.sword?.tick(now);
    });
    if (bossModel) {
      bossModel.holder.position.y = isl.position.y;
      bossModel.update(now);
    }
    pts.forEach((p) => p.userData.tick(dt, now));
    lights.forEach((l, i) => { l.intensity = 7 + Math.sin(s * (2 + i * 0.6) + i) * 1.4; });
  };
  return view;
}

/** Drei schwebende, sich drehende Items. */
export async function itemShowcase(canvas, urls, color) {
  const view = makeView(canvas, { alpha: true });
  const { scene, camera } = view;
  camera.fov = 30;
  camera.position.set(0, 0.15, 3.3);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x302030, 1.3));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(1, 2, 3);
  scene.add(key);
  const items = (await Promise.all(urls.map((u) => loadItem(u).catch(() => null)))).filter(Boolean);
  const groups = items.map((it, i) => {
    const g = new THREE.Group();
    g.add(it.mesh);
    g.position.x = (i - (items.length - 1) / 2) * 1.05;
    g.scale.setScalar(items.length === 3 && i === 1 ? 0.62 : 0.9);
    scene.add(g);
    return g;
  });
  const pts = particles(40, color, { x: [-1.8, 1.8], y: [-0.9, 0.9], z: [-0.6, 0.4] }, 0.035);
  scene.add(pts);
  view.frame = (now, dt) => {
    const s = reduceMotion ? 0 : now / 1000;
    groups.forEach((g, i) => { g.rotation.y = s * 1.1 + i * 1.3; g.position.y = Math.sin(s * 2 + i * 1.7) * 0.07; });
    items.forEach((it) => it.tick(now));
    pts.userData.tick(dt, now);
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
export async function bossViewer(root, base, bosses, signal) {
  const canvas = $('canvas', root);
  const view = makeView(canvas, { bloom: true, alpha: false, shadows: true });
  const { scene, camera } = view;
  scene.background = new THREE.Color(0x150d12);
  scene.fog = new THREE.Fog(0x150d12, 14, 34);
  camera.fov = 32;
  scene.add(new THREE.HemisphereLight(0xffeedd, 0x2a1820, 1.25));
  const key = new THREE.DirectionalLight(0xfff2e0, 1.9);
  key.position.set(-4, 9, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -8, right: 8, top: 10, bottom: -4, near: 1, far: 30 });
  key.shadow.bias = -0.0005;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x8f6cff, 1.4);
  rim.position.set(3, 4, -8);
  scene.add(rim);
  const floorTex = noiseTexture(['#2a2228', '#30272e', '#241d22', '#2d252b', '#272026'], 16, 41, '#1d171c');
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.repeat.set(40, 40);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshLambertMaterial({ map: floorTex }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  const rune = new THREE.Mesh(new THREE.RingGeometry(1.6, 1.75, 64), new THREE.MeshBasicMaterial({ color: 0xffc94a, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
  rune.rotation.x = -Math.PI / 2;
  rune.position.y = 0.01;
  scene.add(rune);
  const motes = particles(60, 0xffb04a, { x: [-7, 7], y: [0, 9], z: [-7, 4] }, 0.05);
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
    const phases = (b.phases || []).map((p, i) => `<li><b>${t(p.name)}</b> ${t(p.desc)}</li>`).join('');
    info.innerHTML = `
      <h3 class="tt-name" style="color:${b.color}">${t(b.name)}</h3>
      <p class="mc-gray sub">${t(b.sub)}</p>
      <p class="desc">${t(b.desc)}</p>
      ${b.trick ? `<h4 class="mc-yellow">${t({ de: 'Der Trick', en: 'The trick' })}</h4><p class="desc">${t(b.trick)}</p>` : ''}
      ${phases ? `<h4 class="mc-yellow">${t({ de: 'Phasen', en: 'Phases' })}</h4><ol class="phases">${phases}</ol>` : ''}
      <dl class="facts">
        ${b.where ? `<dt class="mc-gray">${t({ de: 'Fundort', en: 'Found at' })}</dt><dd>${t(b.where)}</dd>` : ''}
        ${b.loot ? `<dt class="mc-gray">${t({ de: 'Beute', en: 'Loot' })}</dt><dd>${t(b.loot)}</dd>` : ''}
      </dl>
      ${b.moves?.length ? `<h4 class="mc-yellow">${t({ de: 'Angriffe abspielen', en: 'Play attacks' })}</h4>
      <div class="moves">${b.moves.map((mv, i) => `<button class="mc-btn small" data-move="${i}">${t(mv.n)}</button>`).join('')}</div>` : ''}`;
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
