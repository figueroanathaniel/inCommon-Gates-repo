import * as THREE from "three";
import type { Phase } from "@contracts/bazi";

/*
  The world of the walk, drawn in three.js. Everything here is made from
  primitives at build time: no model, texture or sound is downloaded, and no
  figure, place or mark is taken from anybody else's game. It computes nothing
  about a chart. The story (src/game/story.ts) says which place to build and
  which figure stands in it.
*/

export type EnvKind = "garden" | Phase;
export type Tone = "dawn" | "day" | "dusk" | "night";
export type GodKind =
  | "companion" | "robwealth" | "eatinggod" | "hurtingofficer" | "indirectwealth"
  | "directwealth" | "sevenkillings" | "directofficer" | "indirectresource" | "directresource";
export type FigureKind = "keeper" | "animal" | GodKind;

export interface LegSpec {
  env: EnvKind;
  tone: Tone;
  figure: FigureKind;
  /** The phase the figure wears. The Keeper wears none. */
  phase?: Phase;
  /** Which of the twelve animals keeps this place, 0 for 子 to 11 for 亥. */
  animal?: number;
  /** The hour on the clock, 0 to 24, which places the sun, the moon and the stars. */
  hour?: number;
}

export interface WorldEvents {
  onNear: () => void;
  onGate: () => void;
  onLost: () => void;
  /** A footfall, for the sound. */
  onStep?: () => void;
}

const PHASE_HEX: Record<Phase, number> = {
  wood: 0x4fae6a, fire: 0xf07a3a, earth: 0xc9a25a, metal: 0xcfd6df, water: 0x3f7fd0,
};

const rng = (seed: number) => () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;

let GRAD: THREE.DataTexture | null = null;
function grad() {
  if (!GRAD) {
    GRAD = new THREE.DataTexture(new Uint8Array([110, 110, 110, 255, 185, 185, 185, 255, 255, 255, 255, 255]), 3, 1, THREE.RGBAFormat);
    GRAD.minFilter = GRAD.magFilter = THREE.NearestFilter;
    GRAD.needsUpdate = true;
  }
  return GRAD;
}
const toon = (color: number, extra: Partial<THREE.MeshToonMaterialParameters> = {}) =>
  new THREE.MeshToonMaterial({ color, gradientMap: grad(), ...extra });
const glow = (color: number, opacity = 1) =>
  new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, fog: false });

function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, repeat?: [number, number]) {
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
  return t;
}

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  return m;
}

function scatter(geo: THREE.BufferGeometry, mat: THREE.Material, count: number, place: (i: number, d: THREE.Object3D) => void) {
  const im = new THREE.InstancedMesh(geo, mat, count);
  const d = new THREE.Object3D();
  for (let i = 0; i < count; i++) {
    d.position.set(0, 0, 0); d.rotation.set(0, 0, 0); d.scale.set(1, 1, 1);
    place(i, d);
    d.updateMatrix();
    im.setMatrixAt(i, d.matrix);
  }
  im.instanceMatrix.needsUpdate = true;
  im.frustumCulled = false;
  return im;
}

/** A dark hull behind a shape, which is the drawn line round a character. */
function inked<T extends THREE.Mesh>(m: T, k = 1.07): T {
  const hull = new THREE.Mesh(m.geometry, new THREE.MeshBasicMaterial({ color: 0x1b1622, side: THREE.BackSide }));
  hull.scale.setScalar(k);
  m.add(hull);
  return m;
}

/* ───────────────────────── figures ───────────────────────── */

const SKIN = 0xf6d7b8;

function blob(r: number) {
  const m = mesh(new THREE.CircleGeometry(r, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22, depthWrite: false }), 0, 0.02, 0);
  m.rotation.x = -Math.PI / 2;
  return m;
}

function makeKeeper(): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Group();
  const shell = inked(mesh(new THREE.SphereGeometry(0.56, 24, 18), toon(0xbfc6d4)), 1.05);
  body.add(shell);
  const seam = mesh(new THREE.TorusGeometry(0.565, 0.018, 6, 40), toon(0x6d7486));
  seam.rotation.x = Math.PI / 2;
  body.add(seam);
  const hood = mesh(new THREE.CylinderGeometry(0.36, 0.4, 0.16, 28, 1, true), toon(0x8a91a3, { side: THREE.DoubleSide }), 0, 0, 0.47);
  hood.rotation.x = Math.PI / 2;
  body.add(hood);
  body.add(mesh(new THREE.CircleGeometry(0.33, 28), new THREE.MeshBasicMaterial({ color: 0x0b0d16 }), 0, 0, 0.5));
  const ring = mesh(new THREE.RingGeometry(0.17, 0.215, 40), glow(0x9d4edd), 0, 0, 0.512);
  const line = mesh(new THREE.RingGeometry(0.135, 0.15, 40, 1, 0, Math.PI * 1.6), glow(0x00f5d4), 0, 0, 0.514);
  const pupil = mesh(new THREE.CircleGeometry(0.06, 20), glow(0xeaf6ff), 0, 0, 0.516);
  body.add(ring, line, pupil);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(), color: 0x9d7bff, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }));
  halo.scale.setScalar(2.6);
  body.add(halo);
  body.position.y = 1.9;
  g.add(body, blob(0.5));
  g.userData = { body, ring, line, keeper: true, baseY: 1.9 };
  return g;
}

let DOT: THREE.Texture | null = null;
function softDot() {
  if (!DOT) {
    DOT = canvasTex(64, 64, (c) => {
      const gr = c.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, "rgba(255,255,255,1)");
      gr.addColorStop(0.4, "rgba(255,255,255,.45)");
      gr.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = gr;
      c.fillRect(0, 0, 64, 64);
    });
  }
  return DOT;
}

function makeFigure(kind: FigureKind, phase: Phase): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Group();
  const robe = PHASE_HEX[phase];
  const dark = new THREE.Color(robe).multiplyScalar(0.55).getHex();
  const torso = inked(mesh(new THREE.CylinderGeometry(0.3, 0.5, 0.95, 14), toon(robe), 0, 0.5, 0), 1.06);
  const sash = mesh(new THREE.TorusGeometry(0.36, 0.05, 6, 20), toon(dark), 0, 0.56, 0);
  sash.rotation.x = Math.PI / 2;
  const head = inked(mesh(new THREE.SphereGeometry(0.44, 20, 16), toon(SKIN), 0, 1.36, 0), 1.05);
  const eyeM = new THREE.MeshBasicMaterial({ color: 0x1b1622 });
  const eyes: THREE.Mesh[] = [];
  const hands: THREE.Mesh[] = [];
  for (const sx of [-1, 1]) {
    const e = mesh(new THREE.SphereGeometry(0.062, 10, 8), eyeM, sx * 0.16, 1.38, 0.39);
    e.scale.set(1, 1.45, 0.5);
    const hi = mesh(new THREE.SphereGeometry(0.022, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }), sx * 0.16 + 0.02, 1.42, 0.425);
    const cheek = mesh(new THREE.CircleGeometry(0.07, 12), new THREE.MeshBasicMaterial({ color: 0xff9aa2, transparent: true, opacity: 0.55 }), sx * 0.27, 1.26, 0.345);
    cheek.rotation.y = sx * 0.6;
    const hand = mesh(new THREE.SphereGeometry(0.1, 10, 8), toon(SKIN), sx * 0.42, 0.62, 0.12);
    eyes.push(e);
    hand.userData.y = hand.position.y;
    hands.push(hand);
    body.add(e, hi, cheek, hand);
  }
  body.add(torso, sash, head);
  const hairM = toon(0x2a2230);
  const add = (m: THREE.Object3D) => body.add(m);
  const hairCap = () => {
    const h = mesh(new THREE.SphereGeometry(0.46, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.52), hairM, 0, 1.4, -0.03);
    add(h);
  };
  switch (kind) {
    case "companion": {
      hairCap();
      const band = mesh(new THREE.TorusGeometry(0.44, 0.035, 6, 24), toon(0xf4f1e6), 0, 1.5, 0); band.rotation.x = Math.PI / 2; add(band);
      const scarf = mesh(new THREE.TorusGeometry(0.3, 0.08, 8, 20), toon(0xf4f1e6), 0, 1.0, 0); scarf.rotation.x = Math.PI / 2; add(scarf);
      break;
    }
    case "robwealth": {
      add(mesh(new THREE.SphereGeometry(0.5, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.62), toon(0x3a3348), 0, 1.4, -0.05));
      const scarf = mesh(new THREE.TorusGeometry(0.32, 0.1, 8, 20), toon(0x3a3348), 0, 1.02, 0); scarf.rotation.x = Math.PI / 2; add(scarf);
      add(mesh(new THREE.BoxGeometry(0.3, 0.22, 0.2), toon(0xe9dcc0), 0.42, 0.72, 0.2));
      break;
    }
    case "eatinggod": {
      hairCap();
      const cap = mesh(new THREE.SphereGeometry(0.34, 14, 10), toon(0xfaf7ef), 0, 1.86, 0); cap.scale.y = 0.7; add(cap);
      add(mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16), toon(0xfaf7ef), 0, 1.7, 0));
      const bowl = mesh(new THREE.SphereGeometry(0.2, 14, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), toon(0xc8553d), 0, 0.82, 0.42); add(bowl);
      add(mesh(new THREE.CircleGeometry(0.19, 14), toon(0xf5e6b8), 0, 0.82, 0.42).rotateX(-Math.PI / 2));
      break;
    }
    case "hurtingofficer": {
      hairCap();
      add(mesh(new THREE.SphereGeometry(0.14, 10, 8), hairM, 0, 1.88, -0.05));
      add(mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6), toon(0xc9a25a), 0, 1.9, -0.05).rotateZ(Math.PI / 2));
      const brush = mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.8, 6), toon(0x6b4a2e), 0.46, 0.95, 0.16); add(brush);
      add(mesh(new THREE.ConeGeometry(0.05, 0.16, 8), toon(0x1b1622), 0.46, 1.42, 0.16));
      break;
    }
    case "indirectwealth": {
      hairCap();
      add(inked(mesh(new THREE.ConeGeometry(0.72, 0.34, 20), toon(0xe2c98a), 0, 1.82, 0), 1.04));
      add(mesh(new THREE.BoxGeometry(0.5, 0.56, 0.3), toon(0x8a5a34), 0, 0.72, -0.42));
      add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.56, 10), toon(0xe9dcc0), 0, 1.06, -0.42).rotateZ(Math.PI / 2));
      break;
    }
    case "directwealth": {
      hairCap();
      add(mesh(new THREE.BoxGeometry(0.5, 0.2, 0.5), toon(0x2f3b52), 0, 1.84, 0));
      add(mesh(new THREE.BoxGeometry(0.4, 0.3, 0.06), toon(0xf4ecd6), 0, 0.78, 0.44));
      add(mesh(new THREE.BoxGeometry(0.42, 0.32, 0.03), toon(0x7b4b2a), 0, 0.78, 0.4));
      break;
    }
    case "sevenkillings": {
      add(inked(mesh(new THREE.SphereGeometry(0.49, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), toon(0x7d8697), 0, 1.4, 0), 1.04));
      add(mesh(new THREE.ConeGeometry(0.09, 0.42, 8), toon(0xf2b632), 0, 2.02, 0));
      add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.3, 6), toon(0x6b4a2e), 0.5, 1.15, 0.1));
      add(mesh(new THREE.ConeGeometry(0.09, 0.3, 6), toon(0xdfe5ee), 0.5, 2.44, 0.1));
      for (const sx of [-1, 1]) add(mesh(new THREE.SphereGeometry(0.17, 10, 8), toon(0x7d8697), sx * 0.36, 0.98, 0));
      break;
    }
    case "directofficer": {
      hairCap();
      add(mesh(new THREE.BoxGeometry(0.4, 0.3, 0.4), toon(0x23283a), 0, 1.92, 0));
      add(mesh(new THREE.BoxGeometry(1.2, 0.05, 0.14), toon(0x23283a), 0, 1.86, -0.16));
      add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.5, 10), toon(0xf4ecd6), 0.44, 0.8, 0.2).rotateZ(0.5));
      break;
    }
    case "indirectresource": {
      add(mesh(new THREE.SphereGeometry(0.52, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.66), toon(dark), 0, 1.4, -0.06));
      add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.9, 6), toon(0x6b4a2e), -0.5, 0.95, 0.1));
      add(mesh(new THREE.BoxGeometry(0.2, 0.26, 0.2), glow(0xffd98a), -0.5, 1.72, 0.26));
      const l = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(), color: 0xffc866, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending }));
      l.position.set(-0.5, 1.72, 0.26); l.scale.setScalar(1.6); add(l);
      break;
    }
    case "directresource": {
      const h = mesh(new THREE.SphereGeometry(0.46, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.52), toon(0xd9d9de), 0, 1.4, -0.03); add(h);
      add(mesh(new THREE.SphereGeometry(0.17, 10, 8), toon(0xd9d9de), 0, 1.88, -0.1));
      const shawl = mesh(new THREE.TorusGeometry(0.36, 0.12, 8, 20), toon(0xf1e3c6), 0, 0.98, 0); shawl.rotation.x = Math.PI / 2; add(shawl);
      add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 6), toon(0x6b4a2e), 0.5, 0.55, 0.16));
      break;
    }
    default: hairCap();
  }
  g.add(body, blob(0.55));
  g.userData = { body, eyes, hands, ears: [], tail: null, eyeY: 1.3, baseY: 0 };
  return g;
}

/*
  The twelve who keep the hours. Each is our own small creature built from
  spheres, cones and rings, wearing a collar in the phase of its branch.
*/
const FUR: [number, number][] = [
  [0x9aa0ad, 0xe6e2dc], [0x8a5a3c, 0xe9d7b8], [0xf08a2c, 0xfff3e0], [0xf3ede4, 0xffffff],
  [0x2fa39a, 0xf2e2a0], [0x5aa845, 0xe8e6a0], [0x9c5a2e, 0xd9b48a], [0xeee6d2, 0xffffff],
  [0x8a5a34, 0xe8c9a0], [0xfdfbf5, 0xffffff], [0xd9a566, 0xf6e6c8], [0xf7b6bd, 0xfcd9dc],
];

function makeAnimal(i: number, phase: Phase): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Group();
  const [fur, belly] = FUR[((i % 12) + 12) % 12];
  const furM = toon(fur), bellyM = toon(belly), darkM = toon(0x2a2230), pinkM = toon(0xf59aa8);
  const add = <T extends THREE.Object3D>(m: T) => { body.add(m); return m; };
  const ears: THREE.Object3D[] = [];
  const hands: THREE.Mesh[] = [];
  let tail: THREE.Object3D | null = null;
  const snake = i === 5;
  const HY = snake ? 1.12 : 1.2;
  const sph = (r: number, m: THREE.Material, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1) => {
    const o = mesh(new THREE.SphereGeometry(r, 14, 10), m, x, y, z);
    o.scale.set(sx, sy, sz);
    return o;
  };
  const cone = (r: number, h: number, m: THREE.Material, x: number, y: number, z: number) => mesh(new THREE.ConeGeometry(r, h, 10), m, x, y, z);
  const ear = (o: THREE.Object3D, rz = 0) => { o.rotation.z = rz; o.userData.rz = rz; ears.push(o); return add(o); };

  if (snake) {
    [[0.5, 0.14], [0.4, 0.38], [0.3, 0.6]].forEach(([r, y]) => {
      const c = inked(mesh(new THREE.TorusGeometry(r, 0.14, 10, 28), furM, 0, y, 0), 1.03);
      c.rotation.x = Math.PI / 2;
      add(c);
    });
    add(mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.5, 12), furM, 0, 0.82, 0));
  } else {
    add(inked(sph(0.46, furM, 0, 0.5, 0, 1, 0.98, 0.9), 1.06));
    add(sph(0.33, bellyM, 0, 0.46, 0.2, 1, 1.05, 0.7));
    for (const sx of [-1, 1]) {
      add(sph(0.15, furM, sx * 0.22, 0.1, 0.12, 1, 0.7, 1.3));
      const hand = sph(0.11, furM, sx * 0.44, 0.6, 0.14);
      hands.push(hand);
      add(hand);
    }
  }
  add(inked(sph(snake ? 0.34 : 0.42, furM, 0, HY, 0, 1, snake ? 0.82 : 0.95, 1), 1.05));
  const eyeM = new THREE.MeshBasicMaterial({ color: 0x1b1622 });
  const eyes: THREE.Mesh[] = [];
  const ez = snake ? 0.29 : 0.37, ex = snake ? 0.14 : 0.17;
  for (const sx of [-1, 1]) {
    const e = mesh(new THREE.SphereGeometry(0.06, 10, 8), eyeM, sx * ex, HY + 0.06, ez);
    e.scale.set(1, 1.45, 0.5);
    eyes.push(e);
    add(e);
    add(mesh(new THREE.SphereGeometry(0.02, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }), sx * ex + 0.02, HY + 0.1, ez + 0.035));
    const cheek = mesh(new THREE.CircleGeometry(0.06, 12), new THREE.MeshBasicMaterial({ color: 0xff9aa2, transparent: true, opacity: 0.5 }), sx * (ex + 0.11), HY - 0.07, ez - 0.04);
    cheek.rotation.y = sx * 0.6;
    add(cheek);
  }
  // The collar of the branch's phase, and its bell.
  const collar = mesh(new THREE.TorusGeometry(snake ? 0.2 : 0.3, 0.045, 8, 22), toon(PHASE_HEX[phase]), 0, snake ? 0.9 : 0.88, 0);
  collar.rotation.x = Math.PI / 2;
  add(collar);
  add(sph(0.06, toon(0xf2c94c), 0, snake ? 0.86 : 0.82, snake ? 0.2 : 0.3));

  const arc = (r: number, tube: number, m: THREE.Material, len = Math.PI) => new THREE.Mesh(new THREE.TorusGeometry(r, tube, 6, 16, len), m);
  switch (i) {
    case 0: { // Rat
      for (const sx of [-1, 1]) {
        const e = sph(0.2, furM, sx * 0.34, HY + 0.34, -0.02, 1, 1, 0.3);
        e.add(sph(0.13, pinkM, 0, 0, 0.06, 1, 1, 0.3));
        ear(e);
      }
      add(cone(0.1, 0.2, bellyM, 0, HY - 0.06, 0.44).rotateX(Math.PI / 2));
      add(sph(0.04, pinkM, 0, HY - 0.06, 0.55));
      add(mesh(new THREE.BoxGeometry(0.07, 0.07, 0.02), new THREE.MeshBasicMaterial({ color: 0xffffff }), 0, HY - 0.17, 0.42));
      tail = add(arc(0.34, 0.025, pinkM)); tail.position.set(0, 0.2, -0.5); tail.rotation.set(0.4, Math.PI / 2, 0);
      break;
    }
    case 1: { // Ox
      for (const sx of [-1, 1]) {
        add(cone(0.08, 0.34, toon(0xf3ead2), sx * 0.34, HY + 0.42, 0).rotateZ(-sx * 0.7));
        ear(sph(0.12, furM, sx * 0.46, HY + 0.12, 0, 1.3, 0.7, 0.5), sx * 0.3);
        add(sph(0.025, darkM, sx * 0.08, HY - 0.1, 0.52));
      }
      add(sph(0.2, bellyM, 0, HY - 0.12, 0.33, 1.25, 0.8, 0.8));
      const ring = mesh(new THREE.TorusGeometry(0.07, 0.014, 6, 16), toon(0xf2c94c), 0, HY - 0.2, 0.5); add(ring);
      tail = add(cone(0.05, 0.4, furM, 0, 0.42, -0.46)); tail.rotation.x = -2.4;
      break;
    }
    case 2: { // Tiger
      for (const sx of [-1, 1]) {
        const e = sph(0.14, furM, sx * 0.3, HY + 0.36, 0, 1, 1, 0.45);
        e.add(sph(0.08, darkM, 0, 0, -0.04, 1, 1, 0.4));
        ear(e);
        add(mesh(new THREE.BoxGeometry(0.16, 0.035, 0.03), darkM, sx * 0.3, HY - 0.02, 0.3).rotateZ(sx * 0.3));
      }
      [-0.1, 0, 0.1].forEach((x) => add(mesh(new THREE.BoxGeometry(0.035, 0.14, 0.03), darkM, x, HY + 0.3, 0.3)));
      add(sph(0.17, bellyM, 0, HY - 0.12, 0.31, 1.2, 0.8, 0.7));
      add(sph(0.035, pinkM, 0, HY - 0.08, 0.44));
      for (const y of [0.4, 0.62]) { const st = arc(0.44, 0.03, darkM); st.position.set(0, y, 0); st.rotation.set(Math.PI / 2, 0, Math.PI); add(st); }
      tail = add(arc(0.3, 0.05, furM)); tail.position.set(0, 0.3, -0.48); tail.rotation.set(0.3, Math.PI / 2, 0);
      break;
    }
    case 3: { // Rabbit
      for (const sx of [-1, 1]) {
        const e = sph(0.1, furM, sx * 0.16, HY + 0.62, -0.04, 1, 3.2, 0.5);
        e.add(sph(0.06, pinkM, 0, 0, 0.05, 1, 1, 0.4));
        ear(e, -sx * 0.14);
      }
      add(sph(0.035, pinkM, 0, HY - 0.07, 0.41));
      tail = add(sph(0.14, bellyM, 0, 0.36, -0.44));
      break;
    }
    case 4: { // Dragon
      const gold = toon(0xf2c94c);
      for (const sx of [-1, 1]) {
        const a = mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.42, 6), gold, sx * 0.2, HY + 0.52, -0.05);
        a.add(mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.2, 6), gold, sx * 0.08, 0.06, 0).rotateZ(-sx * 0.9));
        ear(a, -sx * 0.3);
        const w = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 5), gold, sx * 0.3, HY - 0.1, 0.5);
        w.rotation.set(0.3, 0, sx * 1.1); add(w);
        add(sph(0.025, darkM, sx * 0.07, HY - 0.04, 0.66));
      }
      add(sph(0.2, furM, 0, HY - 0.1, 0.42, 0.95, 0.75, 1.4));
      add(sph(0.14, bellyM, 0, HY - 0.17, 0.42, 0.9, 0.5, 1.4));
      [0.95, 0.7, 0.45].forEach((y, k) => add(cone(0.07, 0.18, gold, 0, y + 0.02, -0.34 - k * 0.05).rotateX(-0.6)));
      add(cone(0.07, 0.18, gold, 0, HY + 0.36, -0.2).rotateX(-0.4));
      tail = add(cone(0.12, 0.6, furM, 0, 0.26, -0.6)); tail.rotation.x = -1.9;
      break;
    }
    case 5: { // Snake
      const t1 = mesh(new THREE.BoxGeometry(0.03, 0.012, 0.2), toon(0xd8343c), 0, HY - 0.1, 0.4); add(t1);
      for (const sx of [-1, 1]) add(mesh(new THREE.BoxGeometry(0.02, 0.012, 0.08), toon(0xd8343c), sx * 0.025, HY - 0.1, 0.52).rotateY(sx * 0.5));
      [[0, 0.2], [-0.14, 0.12], [0.14, 0.12]].forEach(([x, y]) => add(sph(0.05, bellyM, x, HY + y, 0.14, 1, 0.6, 1)));
      tail = add(cone(0.07, 0.4, furM, 0.5, 0.12, -0.3)); tail.rotation.set(-1.4, 0, -0.6);
      break;
    }
    case 6: { // Horse
      for (const sx of [-1, 1]) {
        ear(cone(0.08, 0.24, furM, sx * 0.2, HY + 0.44, -0.02), -sx * 0.2);
        add(sph(0.022, darkM, sx * 0.07, HY - 0.16, 0.66));
      }
      add(sph(0.2, bellyM, 0, HY - 0.14, 0.4, 0.9, 0.85, 1.5));
      [0.36, 0.2, 0.02, -0.16].forEach((y, k) => add(sph(0.13, darkM, 0, HY + y, -0.3 - (k > 1 ? 0.06 : 0))));
      add(sph(0.1, darkM, 0, HY + 0.4, 0.1));
      tail = add(cone(0.1, 0.6, darkM, 0, 0.3, -0.52)); tail.rotation.x = Math.PI - 0.5;
      break;
    }
    case 7: { // Goat
      const horn = toon(0x9a8f7c);
      for (const sx of [-1, 1]) {
        const h = arc(0.17, 0.045, horn, Math.PI * 1.1); h.position.set(sx * 0.22, HY + 0.34, -0.14); h.rotation.set(0, sx * (Math.PI / 2 - 0.35), 0.2); add(h);
        ear(sph(0.12, furM, sx * 0.48, HY + 0.02, 0, 1.4, 0.55, 0.5), sx * 0.5);
      }
      add(sph(0.15, bellyM, 0, HY - 0.14, 0.33, 1, 0.8, 0.9));
      add(sph(0.03, pinkM, 0, HY - 0.1, 0.46));
      add(cone(0.07, 0.24, bellyM, 0, HY - 0.44, 0.3).rotateX(Math.PI));
      tail = add(sph(0.09, furM, 0, 0.5, -0.44, 1, 1.4, 1));
      break;
    }
    case 8: { // Monkey
      for (const sx of [-1, 1]) {
        const e = sph(0.14, bellyM, sx * 0.44, HY + 0.02, 0, 0.5, 1, 1);
        ear(e);
      }
      add(sph(0.32, bellyM, 0, HY - 0.02, 0.17, 1, 0.92, 0.75));
      add(sph(0.14, bellyM, 0, HY - 0.16, 0.36, 1.2, 0.7, 0.7));
      add(sph(0.025, darkM, 0, HY - 0.1, 0.46));
      tail = add(new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 6, 18, Math.PI * 1.6), furM)); tail.position.set(0, 0.5, -0.56); tail.rotation.y = Math.PI / 2;
      break;
    }
    case 9: { // Rooster
      const red = toon(0xd8343c);
      [[-0.1, 0.4, 0.1], [0, 0.46, 0.13], [0.1, 0.4, 0.1]].forEach(([z, y, r]) => add(sph(r, red, 0, HY + y, z + 0.05)));
      add(cone(0.08, 0.2, toon(0xf2b632), 0, HY - 0.06, 0.48).rotateX(Math.PI / 2));
      add(sph(0.06, red, 0, HY - 0.22, 0.38, 0.8, 1.3, 0.8));
      const fan = new THREE.Group();
      [[-0.4, 0x2f6f7a], [0, 0xd8343c], [0.4, 0x2a2230]].forEach(([rz, c]) => {
        const f = sph(0.12, toon(c), 0, 0.3, 0, 0.5, 2.6, 1);
        const h = new THREE.Group(); h.rotation.z = rz as number; h.add(f); fan.add(h);
      });
      fan.position.set(0, 0.5, -0.4); fan.rotation.x = -0.7;
      tail = add(fan);
      break;
    }
    case 10: { // Dog
      const brown = toon(0x8a5a34);
      for (const sx of [-1, 1]) ear(sph(0.14, brown, sx * 0.4, HY + 0.08, 0, 0.5, 1.5, 0.9), sx * 0.25);
      add(sph(0.17, bellyM, 0, HY - 0.13, 0.33, 1.1, 0.8, 1));
      add(sph(0.05, darkM, 0, HY - 0.07, 0.5));
      add(sph(0.12, brown, -0.17, HY + 0.08, 0.3, 1, 1.1, 0.5));
      tail = add(cone(0.06, 0.36, furM, 0, 0.62, -0.46)); tail.rotation.x = -0.6;
      break;
    }
    default: { // Pig
      const snoutM = toon(0xe98a98);
      for (const sx of [-1, 1]) {
        ear(cone(0.13, 0.2, snoutM, sx * 0.26, HY + 0.38, 0.04), -sx * 0.5);
        add(sph(0.022, darkM, sx * 0.05, HY - 0.1, 0.5));
      }
      add(mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.12, 14), snoutM, 0, HY - 0.1, 0.42).rotateX(Math.PI / 2));
      tail = add(new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.025, 6, 14, Math.PI * 1.7), snoutM)); tail.position.set(0, 0.5, -0.46); tail.rotation.y = Math.PI / 2;
    }
  }
  if (tail) tail.userData.ry = tail.rotation.y;
  for (const h of hands) h.userData.y = h.position.y;
  g.add(body, blob(0.6));
  g.userData = { body, eyes, hands, ears, tail, animal: true, eyeY: HY, baseY: 0 };
  return g;
}

/* ───────────────────────── places ───────────────────────── */

interface Palette { top: number; bot: number; fog: number; fogNear: number; fogFar: number; hemiSky: number; hemiGround: number; sun: number; sunI: number; hemiI: number }
interface Place {
  group: THREE.Group;
  heightAt: (x: number, z: number) => number;
  halfWidth: number;
  figureAt: THREE.Vector3;
  gateZ: number;
  palette: Palette;
  motes: { color: number; mode: "fall" | "rise" | "drift"; size: number };
  tick?: (t: number) => void;
}

const FIG_Z = -22;
const GATE_Z = -40;

function pathLights(group: THREE.Group, heightAt: Place["heightAt"], color: number, from = -3, to = GATE_Z + 2) {
  const n = Math.floor((from - to) / 3);
  for (const sx of [-1, 1]) {
    group.add(scatter(new THREE.SphereGeometry(0.07, 8, 6), glow(color, 0.9), n, (i, d) => {
      const z = from - i * 3;
      d.position.set(sx * 2.3, heightAt(sx * 2.3, z) + 0.12, z);
    }));
  }
}

function buildGarden(): Place {
  const g = new THREE.Group();
  const r = rng(11);
  const STEP0 = -7, STEPS = 12, RISE = 0.24, RUN = 0.9;
  const topZ = STEP0 - STEPS * RUN;
  const heightAt = (x: number, z: number) => {
    if (Math.abs(x) > 3.2) return z < topZ ? STEPS * RISE : 0;
    if (z > STEP0) return 0;
    if (z <= topZ) return STEPS * RISE;
    return Math.ceil((STEP0 - z) / RUN) * RISE;
  };
  // Raked sand, drawn once.
  const sand = canvasTex(512, 512, (c) => {
    c.fillStyle = "#efe6cf"; c.fillRect(0, 0, 512, 512);
    c.strokeStyle = "rgba(160,140,100,.35)"; c.lineWidth = 2;
    for (let y = 6; y < 512; y += 12) { c.beginPath(); c.moveTo(0, y); c.lineTo(512, y); c.stroke(); }
  }, [10, 10]);
  const ground = mesh(new THREE.PlaneGeometry(120, 120), toon(0xffffff, { map: sand }));
  ground.rotation.x = -Math.PI / 2;
  g.add(ground);
  // The stair.
  const stone = toon(0xb9b4a6);
  for (let i = 0; i < STEPS; i++) {
    g.add(mesh(new THREE.BoxGeometry(6.4, RISE * (i + 1), RUN), stone, 0, (RISE * (i + 1)) / 2, STEP0 - RUN * (i + 0.5)));
  }
  const terraceH = STEPS * RISE;
  g.add(mesh(new THREE.BoxGeometry(34, terraceH, 40), toon(0xc7c1b0), 0, terraceH / 2, topZ - 20));
  const moss = mesh(new THREE.CircleGeometry(5.2, 28), toon(0x7fae6a), 0, terraceH + 0.02, FIG_Z);
  moss.rotation.x = -Math.PI / 2;
  g.add(moss);
  // Stones with rings raked round them.
  const rock = toon(0x7c7a78);
  for (let i = 0; i < 9; i++) {
    const side = i % 2 ? 1 : -1;
    const x = side * (5 + r() * 9), z = 2 - r() * 16;
    const s = 0.5 + r() * 0.9;
    const m = inked(mesh(new THREE.DodecahedronGeometry(s, 0), rock, x, s * 0.45, z), 1.04);
    m.scale.y = 0.7; m.rotation.y = r() * 3;
    g.add(m);
    for (let k = 1; k <= 3; k++) {
      const ring = mesh(new THREE.RingGeometry(s + k * 0.32, s + k * 0.32 + 0.05, 36), new THREE.MeshBasicMaterial({ color: 0xbfae84, transparent: true, opacity: 0.6 }), x, 0.015, z);
      ring.rotation.x = -Math.PI / 2;
      g.add(ring);
    }
  }
  // Pines and a maple.
  const trunk = toon(0x6b4a2e), pine = toon(0x3f7d54), maple = toon(0xe0703c);
  const tree = (x: number, z: number, y: number, leaf: THREE.Material, round: boolean) => {
    const t = new THREE.Group();
    t.add(mesh(new THREE.CylinderGeometry(0.14, 0.22, 2.2, 8), trunk, 0, 1.1, 0));
    if (round) for (let k = 0; k < 4; k++) t.add(inked(mesh(new THREE.IcosahedronGeometry(0.9 + r() * 0.4, 0), leaf, (r() - 0.5) * 1.4, 2.4 + r() * 0.8, (r() - 0.5) * 1.4), 1.03));
    else for (let k = 0; k < 3; k++) t.add(inked(mesh(new THREE.ConeGeometry(1.3 - k * 0.3, 1.2, 8), leaf, 0, 2.2 + k * 0.8, 0), 1.03));
    t.position.set(x, y, z);
    g.add(t);
  };
  tree(-6, -3, 0, pine, false); tree(7, 0, 0, maple, true); tree(-9, -24, terraceH, maple, true); tree(8, -27, terraceH, pine, false); tree(5.5, -12, 0, pine, false); tree(-5.5, -13, 0, pine, false);
  // Lanterns beside the stair and on the terrace.
  const lantern = (x: number, y: number, z: number) => {
    const l = new THREE.Group();
    l.add(mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.9, 6), stone, 0, 0.45, 0));
    l.add(mesh(new THREE.BoxGeometry(0.44, 0.36, 0.44), glow(0xffd98a), 0, 1.08, 0));
    l.add(mesh(new THREE.ConeGeometry(0.46, 0.3, 4), stone, 0, 1.42, 0).rotateY(Math.PI / 4));
    l.position.set(x, y, z);
    g.add(l);
  };
  lantern(-3.8, 0, STEP0 + 0.6); lantern(3.8, 0, STEP0 + 0.6); lantern(-3.8, terraceH, topZ - 0.8); lantern(3.8, terraceH, topZ - 0.8);
  // A low bamboo fence far round.
  g.add(scatter(new THREE.CylinderGeometry(0.06, 0.06, 1.4, 6), toon(0xb99a5b), 120, (i, d) => {
    const a = (i / 120) * Math.PI * 2;
    d.position.set(Math.cos(a) * 26, 0.7, Math.sin(a) * 26 - 12);
    if (d.position.z < topZ) d.position.y += terraceH;
  }));
  pathLights(g, heightAt, 0xffe3a3, -2, STEP0 + 1);
  return {
    group: g, heightAt, halfWidth: 3, figureAt: new THREE.Vector3(0, terraceH, FIG_Z), gateZ: GATE_Z + 6,
    palette: { top: 0x8ec9f2, bot: 0xfdebd0, fog: 0xf4e9d6, fogNear: 30, fogFar: 95, hemiSky: 0xffffff, hemiGround: 0xcdbf9c, sun: 0xfff1d6, sunI: 1.5, hemiI: 1.25 },
    motes: { color: 0xffb7c5, mode: "fall", size: 0.16 },
  };
}

function buildWood(): Place {
  const g = new THREE.Group();
  const r = rng(23);
  const heightAt = () => 0;
  const floor = mesh(new THREE.PlaneGeometry(140, 140), toon(0x5c8f52));
  floor.rotation.x = -Math.PI / 2;
  g.add(floor);
  const path = mesh(new THREE.PlaneGeometry(5, 60), toon(0xb79a6a), 0, 0.01, -20);
  path.rotation.x = -Math.PI / 2;
  g.add(path);
  const N = 420;
  const spots: [number, number, number][] = [];
  for (let i = 0; i < N; i++) {
    const side = r() < 0.5 ? -1 : 1;
    spots.push([side * (3.6 + r() * r() * 26), 6 - r() * 62, 7 + r() * 7]);
  }
  g.add(scatter(new THREE.CylinderGeometry(0.11, 0.13, 1, 7), toon(0x7fbf5a), N, (i, d) => {
    const [x, z, h] = spots[i];
    d.position.set(x, h / 2, z); d.scale.set(1, h, 1); d.rotation.z = (r() - 0.5) * 0.08;
  }));
  // Joints, the rings on the canes nearest the path.
  g.add(scatter(new THREE.TorusGeometry(0.14, 0.02, 4, 10), toon(0x4f8a3c), 360, (i, d) => {
    const [x, z] = spots[i % 120];
    d.position.set(x, 0.9 + Math.floor(i / 120) * 1.3, z); d.rotation.x = Math.PI / 2;
  }));
  g.add(scatter(new THREE.ConeGeometry(1.1, 2.6, 6), toon(0x9fd46e), N, (i, d) => {
    const [x, z, h] = spots[i];
    d.position.set(x, h + 0.4, z); d.rotation.y = r() * 3; d.scale.setScalar(0.8 + r() * 0.7);
  }));
  g.add(scatter(new THREE.IcosahedronGeometry(0.5, 0), toon(0x4d7a48), 60, (_i, d) => {
    const side = r() < 0.5 ? -1 : 1;
    d.position.set(side * (3 + r() * 8), 0.2, 4 - r() * 50); d.scale.set(1 + r(), 0.5 + r() * 0.4, 1 + r());
  }));
  // Shafts of light through the canes.
  const shaft = new THREE.MeshBasicMaterial({ color: 0xfff6c9, transparent: true, opacity: 0.1, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false });
  for (let i = 0; i < 9; i++) {
    const s = mesh(new THREE.PlaneGeometry(2.4, 18), shaft, (r() - 0.5) * 12, 8, -4 - i * 4.4);
    s.rotation.set(0, r() * 3, 0.35);
    g.add(s);
  }
  pathLights(g, heightAt, 0xd8ffb0);
  return {
    group: g, heightAt, halfWidth: 2.6, figureAt: new THREE.Vector3(0, 0, FIG_Z), gateZ: GATE_Z,
    palette: { top: 0x9fe0c0, bot: 0xf2ffd6, fog: 0xcfeebd, fogNear: 12, fogFar: 62, hemiSky: 0xf2ffe0, hemiGround: 0x4f7d48, sun: 0xfff4c2, sunI: 1.3, hemiI: 1.3 },
    motes: { color: 0xb6e37a, mode: "fall", size: 0.18 },
  };
}

function buildFire(): Place {
  const g = new THREE.Group();
  const r = rng(37);
  const heightAt = () => 0;
  const road = mesh(new THREE.PlaneGeometry(140, 140), toon(0x3b3644));
  road.rotation.x = -Math.PI / 2;
  g.add(road);
  const walk = canvasTex(64, 64, (c) => {
    c.fillStyle = "#6d6573"; c.fillRect(0, 0, 64, 64);
    c.strokeStyle = "#57505e"; c.lineWidth = 2; c.strokeRect(1, 1, 62, 62);
  }, [4, 44]);
  const pave = mesh(new THREE.PlaneGeometry(6, 66), toon(0xffffff, { map: walk }), 0, 0.01, -20);
  pave.rotation.x = -Math.PI / 2;
  g.add(pave);
  const windows = (hue: string) => canvasTex(128, 256, (c) => {
    c.fillStyle = "#2a2536"; c.fillRect(0, 0, 128, 256);
    for (let y = 8; y < 250; y += 20) for (let x = 8; x < 120; x += 20) {
      c.fillStyle = Math.random() < 0.62 ? hue : "#3a3350";
      c.fillRect(x, y, 12, 13);
    }
  });
  const skins = [windows("#ffd27a"), windows("#ff9d6b"), windows("#ffe9b8")];
  for (let i = 0; i < 26; i++) {
    const side = i % 2 ? 1 : -1;
    const w = 5 + r() * 4, h = 9 + r() * 22, dd = 5 + r() * 3;
    const z = 6 - Math.floor(i / 2) * 5.2;
    const b = inked(mesh(new THREE.BoxGeometry(w, h, dd), new THREE.MeshBasicMaterial({ map: skins[i % 3] }), side * (5.2 + w / 2 + r() * 1.5), h / 2, z), 1.01);
    g.add(b);
    // An awning and a sign of plain light on the lower floor.
    const hues = [0xff5f8f, 0x3fd0ff, 0xffc93c, 0x8cff9b, 0xb48cff];
    const sign = mesh(new THREE.BoxGeometry(0.16, 1.2 + r() * 1.6, 0.9), glow(hues[i % 5]), side * 5.0, 3.2 + r() * 2.2, z + (r() - 0.5) * 2);
    g.add(sign);
    g.add(mesh(new THREE.BoxGeometry(1.4, 0.1, 3.2), toon(i % 3 ? 0xb8482f : 0xf2b632), side * 4.5, 2.5, z));
  }
  // Lantern strings across the street.
  for (let k = 0; k < 9; k++) {
    const z = -2 - k * 4.4;
    g.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 9.4, 4), new THREE.MeshBasicMaterial({ color: 0x1b1622 }), 0, 4.6, z).rotateZ(Math.PI / 2));
    for (let j = -3; j <= 3; j++) {
      const l = mesh(new THREE.SphereGeometry(0.2, 10, 8), glow(j % 2 ? 0xffb347 : 0xff7a59), j * 1.25, 4.38 - Math.cos(j * 0.5) * 0.12, z);
      l.scale.y = 1.2;
      g.add(l);
    }
  }
  // Street lamps and a food cart.
  for (let k = 0; k < 6; k++) for (const sx of [-1, 1]) {
    g.add(mesh(new THREE.CylinderGeometry(0.05, 0.07, 3.4, 6), toon(0x2a2536), sx * 3.2, 1.7, -4 - k * 7));
    g.add(mesh(new THREE.SphereGeometry(0.2, 10, 8), glow(0xfff0c0), sx * 3.2, 3.5, -4 - k * 7));
  }
  const cart = new THREE.Group();
  cart.add(inked(mesh(new THREE.BoxGeometry(1.6, 0.9, 0.9), toon(0xb5533c), 0, 0.75, 0), 1.03));
  cart.add(mesh(new THREE.BoxGeometry(1.9, 0.08, 1.2), toon(0xf4ecd6), 0, 2.0, 0));
  for (const sx of [-1, 1]) cart.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 5), toon(0x2a2536), sx * 0.75, 1.4, 0.4));
  cart.position.set(3.4, 0, -12);
  g.add(cart);
  pathLights(g, heightAt, 0xffc27a);
  return {
    group: g, heightAt, halfWidth: 2.8, figureAt: new THREE.Vector3(0, 0, FIG_Z), gateZ: GATE_Z,
    palette: { top: 0x35356e, bot: 0xff9a66, fog: 0xc4667a, fogNear: 16, fogFar: 78, hemiSky: 0xffd0b0, hemiGround: 0x4a3a55, sun: 0xffb27a, sunI: 1.1, hemiI: 1.25 },
    motes: { color: 0xffb347, mode: "rise", size: 0.13 },
  };
}

function buildWater(): Place {
  const g = new THREE.Group();
  const r = rng(53);
  const heightAt = () => 0.25;
  const bank = mesh(new THREE.PlaneGeometry(140, 140), toon(0x7fb07a));
  bank.rotation.x = -Math.PI / 2;
  g.add(bank);
  // The pond lies to the left of the boardwalk and runs under it.
  const waterM = new THREE.ShaderMaterial({
    uniforms: { t: { value: 0 }, a: { value: new THREE.Color(0x58b7d8) }, b: { value: new THREE.Color(0xc8f3f0) } },
    vertexShader: "varying vec2 v; void main(){ v = position.xy; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
    fragmentShader: "uniform float t; uniform vec3 a; uniform vec3 b; varying vec2 v; void main(){ float w = sin(v.x*0.9+t*0.8)*sin(v.y*1.1-t*0.6); float s = step(0.86, sin(v.x*2.3+w*2.0+t*0.5)*sin(v.y*2.9-w*1.6)); gl_FragColor = vec4(mix(a,b,0.25+0.2*w+s*0.6),1.0); }",
  });
  const pond = mesh(new THREE.CircleGeometry(30, 48), waterM, -19, 0.04, -20);
  pond.rotation.x = -Math.PI / 2;
  g.add(pond);
  const planks = canvasTex(128, 64, (c) => {
    c.fillStyle = "#b98b5a"; c.fillRect(0, 0, 128, 64);
    c.strokeStyle = "#8a633c"; c.lineWidth = 3;
    for (let y = 0; y <= 64; y += 16) { c.beginPath(); c.moveTo(0, y); c.lineTo(128, y); c.stroke(); }
  }, [1, 30]);
  g.add(mesh(new THREE.BoxGeometry(5.4, 0.2, 60), toon(0xffffff, { map: planks }), 0, 0.15, -20));
  g.add(scatter(new THREE.CylinderGeometry(0.12, 0.12, 1.2, 6), toon(0x7a5633), 40, (i, d) => {
    d.position.set(i % 2 ? 2.6 : -2.6, 0.1, 8 - Math.floor(i / 2) * 3);
  }));
  g.add(scatter(new THREE.CylinderGeometry(0.55, 0.55, 0.04, 12), toon(0x4f9a58), 46, (_i, d) => {
    d.position.set(-5 - r() * 22, 0.08, 6 - r() * 52); d.scale.setScalar(0.6 + r() * 0.9);
  }));
  g.add(scatter(new THREE.SphereGeometry(0.18, 8, 6), toon(0xffc4d6), 14, (_i, d) => {
    d.position.set(-5 - r() * 18, 0.2, 4 - r() * 48);
  }));
  g.add(scatter(new THREE.CylinderGeometry(0.03, 0.04, 1, 4), toon(0x6fa35a), 260, (_i, d) => {
    const h = 1 + r() * 1.6;
    d.position.set(-3.2 - r() * 2.4 + (r() < 0.25 ? 7 + r() * 3 : 0), h / 2, 8 - r() * 58); d.scale.y = h; d.rotation.z = (r() - 0.5) * 0.25;
  }));
  // Willows on the dry side.
  const leaf = toon(0x8fc37a), trunk = toon(0x6b4a2e);
  for (let i = 0; i < 6; i++) {
    const t = new THREE.Group();
    t.add(mesh(new THREE.CylinderGeometry(0.2, 0.34, 4, 8), trunk, 0, 2, 0));
    t.add(inked(mesh(new THREE.IcosahedronGeometry(2, 0), leaf, 0, 4.6, 0), 1.03));
    for (let k = 0; k < 16; k++) {
      const a = (k / 16) * Math.PI * 2;
      t.add(mesh(new THREE.BoxGeometry(0.1, 2.8 + r() * 1.2, 0.1), leaf, Math.cos(a) * 1.9, 3.2, Math.sin(a) * 1.9));
    }
    t.position.set(6 + r() * 8, 0, 2 - i * 9 - r() * 3);
    g.add(t);
  }
  g.add(scatter(new THREE.DodecahedronGeometry(0.5, 0), toon(0x8b8f93), 18, (_i, d) => {
    d.position.set(3.4 + r() * 6, 0.2, 6 - r() * 54); d.scale.set(1 + r(), 0.6, 1 + r());
  }));
  pathLights(g, heightAt, 0xbfefff);
  return {
    group: g, heightAt, halfWidth: 2.3, figureAt: new THREE.Vector3(0, 0.25, FIG_Z), gateZ: GATE_Z,
    palette: { top: 0x6fb6ea, bot: 0xe6fbff, fog: 0xd3eef2, fogNear: 18, fogFar: 85, hemiSky: 0xeaffff, hemiGround: 0x5f8f7a, sun: 0xfff7e0, sunI: 1.3, hemiI: 1.3 },
    motes: { color: 0xeaffb0, mode: "rise", size: 0.12 },
    tick: (t) => { waterM.uniforms.t.value = t; },
  };
}

function buildEarth(): Place {
  const g = new THREE.Group();
  const heightAt = () => 0;
  const W = 7, L = 56;
  const boards = canvasTex(128, 128, (c) => {
    c.fillStyle = "#c79a5c"; c.fillRect(0, 0, 128, 128);
    c.strokeStyle = "#9c7440"; c.lineWidth = 2;
    for (let x = 0; x <= 128; x += 32) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 128); c.stroke(); }
    c.strokeStyle = "rgba(120,86,44,.5)";
    for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(i * 32 + 16, 40 + i * 13); c.lineTo(i * 32 + 16, 44 + i * 13); c.stroke(); }
  }, [4, 14]);
  const floor = mesh(new THREE.PlaneGeometry(W * 2, L), toon(0xffffff, { map: boards }), 0, 0, -L / 2 + 8);
  floor.rotation.x = -Math.PI / 2;
  g.add(floor);
  const outside = mesh(new THREE.PlaneGeometry(200, 200), toon(0xa9c08a), 0, -0.3, -20);
  outside.rotation.x = -Math.PI / 2;
  g.add(outside);
  const shoji = canvasTex(128, 128, (c) => {
    c.fillStyle = "#fbf4e2"; c.fillRect(0, 0, 128, 128);
    c.strokeStyle = "#5a3d24"; c.lineWidth = 5;
    for (let i = 0; i <= 128; i += 32) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, 128); c.moveTo(0, i); c.lineTo(128, i); c.stroke(); }
  }, [14, 1]);
  const wood = toon(0x5a3d24);
  for (const sx of [-1, 1]) {
    const wall = mesh(new THREE.PlaneGeometry(L, 3.2), new THREE.MeshBasicMaterial({ map: shoji }), sx * W, 2.1, -L / 2 + 8);
    wall.rotation.y = -sx * Math.PI / 2;
    g.add(wall);
    g.add(mesh(new THREE.BoxGeometry(0.2, 0.5, L), wood, sx * W, 0.25, -L / 2 + 8));
    g.add(mesh(new THREE.BoxGeometry(0.3, 0.3, L), wood, sx * W, 3.85, -L / 2 + 8));
    for (let k = 0; k < 8; k++) g.add(mesh(new THREE.BoxGeometry(0.34, 6, 0.34), wood, sx * (W - 0.1), 3, 6 - k * 7));
  }
  // Rafters, and the roof above them.
  for (let k = 0; k < 16; k++) g.add(mesh(new THREE.BoxGeometry(W * 2, 0.26, 0.26), wood, 0, 5.6, 6 - k * 3.5));
  const roof = mesh(new THREE.PlaneGeometry(W * 2, L), toon(0x7a5a3c, { side: THREE.DoubleSide }), 0, 6.1, -L / 2 + 8);
  roof.rotation.x = Math.PI / 2;
  g.add(roof);
  g.add(mesh(new THREE.BoxGeometry(W * 2, 6.2, 0.3), toon(0xe9dcc0), 0, 3.1, 8.2));
  // Mats, racks of staves, banners, posts to strike.
  for (let k = 0; k < 5; k++) for (const sx of [-1, 1]) {
    const mat = mesh(new THREE.PlaneGeometry(2.6, 4.6), toon(k % 2 ? 0x9bb37a : 0xb8c98f), sx * 4.6, 0.012, -4 - k * 8);
    mat.rotation.x = -Math.PI / 2;
    g.add(mat);
  }
  for (const [x, z] of [[-6.4, -8], [6.4, -16], [-6.4, -30]] as const) {
    g.add(mesh(new THREE.BoxGeometry(0.3, 1.6, 2.6), wood, x, 0.8, z));
    for (let k = 0; k < 5; k++) g.add(mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.6, 6), toon(0xd8b06a), x * 0.96, 1.4, z - 1 + k * 0.5).rotateZ(x > 0 ? 0.25 : -0.25));
  }
  for (let k = 0; k < 4; k++) for (const sx of [-1, 1]) {
    const b = mesh(new THREE.PlaneGeometry(1.1, 2.6), toon(k % 2 ? 0xc9a25a : 0x8a4b14, { side: THREE.DoubleSide }), sx * (W - 0.25), 3.3, -1 - k * 10.5);
    b.rotation.y = -sx * Math.PI / 2;
    g.add(b);
  }
  for (const [x, z] of [[4.2, -12], [-4.2, -26], [4.4, -33]] as const) {
    const p = new THREE.Group();
    p.add(inked(mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.7, 10), toon(0xa3774a), 0, 0.85, 0), 1.04));
    for (let k = 0; k < 3; k++) p.add(mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.7, 6), toon(0xa3774a), 0, 0.7 + k * 0.38, 0.3).rotateX(Math.PI / 2).rotateZ(k * 1.1));
    p.position.set(x, 0, z);
    g.add(p);
  }
  // The far end stands open to hills.
  for (let k = 0; k < 7; k++) {
    const hill = mesh(new THREE.ConeGeometry(14 + k * 2, 14 + (k % 3) * 6, 5), toon(k % 2 ? 0x8aa67a : 0xa7b98b), (k - 3) * 15, 5, -86 - (k % 2) * 10);
    g.add(hill);
  }
  pathLights(g, heightAt, 0xffe0a0);
  return {
    group: g, heightAt, halfWidth: 3, figureAt: new THREE.Vector3(0, 0, FIG_Z), gateZ: GATE_Z,
    palette: { top: 0xa9cdea, bot: 0xfdf2d8, fog: 0xefe2c4, fogNear: 22, fogFar: 110, hemiSky: 0xfff6e2, hemiGround: 0xb08a5a, sun: 0xfff0cf, sunI: 1.0, hemiI: 1.45 },
    motes: { color: 0xfff0c9, mode: "drift", size: 0.07 },
  };
}

function buildMetal(): Place {
  const g = new THREE.Group();
  const r = rng(71);
  const heightAt = () => 0;
  const W = 8, L = 56, H = 4.2;
  const tiles = canvasTex(64, 64, (c) => {
    c.fillStyle = "#cfd5dd"; c.fillRect(0, 0, 64, 64);
    c.strokeStyle = "#b3bac4"; c.lineWidth = 2; c.strokeRect(0, 0, 64, 64);
  }, [8, 28]);
  const floor = mesh(new THREE.PlaneGeometry(W * 2, L), toon(0xffffff, { map: tiles }), 0, 0, -L / 2 + 8);
  floor.rotation.x = -Math.PI / 2;
  g.add(floor);
  const runner = mesh(new THREE.PlaneGeometry(4.6, L), toon(0x5c6f8f), 0, 0.012, -L / 2 + 8);
  runner.rotation.x = -Math.PI / 2;
  g.add(runner);
  const ceil = mesh(new THREE.PlaneGeometry(W * 2, L), toon(0xeef1f5), 0, H, -L / 2 + 8);
  ceil.rotation.x = Math.PI / 2;
  g.add(ceil);
  for (let k = 0; k < 9; k++) for (const sx of [-1, 1]) {
    const p = mesh(new THREE.PlaneGeometry(1.4, 3.6), glow(0xffffff), sx * 3.2, H - 0.01, 4 - k * 6);
    p.rotation.x = Math.PI / 2;
    g.add(p);
  }
  // Glass walls with a skyline beyond.
  const frame = toon(0x596273);
  const glass = new THREE.MeshBasicMaterial({ color: 0xbfe3ff, transparent: true, opacity: 0.18, depthWrite: false });
  for (const sx of [-1, 1]) {
    const pane = mesh(new THREE.PlaneGeometry(L, H), glass, sx * W, H / 2, -L / 2 + 8);
    pane.rotation.y = -sx * Math.PI / 2;
    g.add(pane);
    for (let k = 0; k < 15; k++) g.add(mesh(new THREE.BoxGeometry(0.14, H, 0.14), frame, sx * W, H / 2, 8 - k * 4));
    g.add(mesh(new THREE.BoxGeometry(0.16, 0.16, L), frame, sx * W, 1.0, -L / 2 + 8));
  }
  g.add(mesh(new THREE.BoxGeometry(W * 2, H, 0.3), toon(0xe3e7ed), 0, H / 2, 8.2));
  g.add(scatter(new THREE.BoxGeometry(1, 1, 1), toon(0x9aa7b8), 60, (_i, d) => {
    const side = r() < 0.5 ? -1 : 1;
    const h = 8 + r() * 30;
    d.position.set(side * (16 + r() * 40), h / 2 - 12, 10 - r() * 90); d.scale.set(5 + r() * 5, h, 5 + r() * 5);
  }));
  g.add(scatter(new THREE.BoxGeometry(1, 1, 1), toon(0xa9b5c5), 14, (i, d) => {
    const h = 10 + r() * 26;
    d.position.set((i - 7) * 9, h / 2 - 12, -70 - r() * 20); d.scale.set(6, h, 6);
  }));
  // Rows of desks.
  const deskM = toon(0xf1f3f6), legM = toon(0x596273), chairM = toon(0x3f4a5f);
  for (let k = 0; k < 7; k++) for (const sx of [-1, 1]) {
    const d = new THREE.Group();
    d.add(inked(mesh(new THREE.BoxGeometry(2.6, 0.08, 1.2), deskM, 0, 0.78, 0), 1.02));
    for (const a of [-1, 1]) d.add(mesh(new THREE.BoxGeometry(0.08, 0.78, 1.1), legM, a * 1.2, 0.39, 0));
    d.add(mesh(new THREE.BoxGeometry(0.9, 0.56, 0.05), toon(0x2b3140), -sx * 0.1, 1.2, -0.25));
    d.add(mesh(new THREE.PlaneGeometry(0.82, 0.48), glow([0x9be7ff, 0xc9ffd9, 0xfff0b3][k % 3]), -sx * 0.1, 1.2, -0.22));
    d.add(mesh(new THREE.BoxGeometry(0.1, 0.2, 0.1), legM, -sx * 0.1, 0.9, -0.25));
    d.add(mesh(new THREE.BoxGeometry(0.5, 0.02, 0.36), toon(0xffffff), sx * 0.8, 0.83, 0.1));
    d.add(mesh(new THREE.BoxGeometry(0.6, 0.08, 0.6), chairM, 0, 0.5, 0.95));
    d.add(mesh(new THREE.BoxGeometry(0.6, 0.7, 0.08), chairM, 0, 0.9, 1.25));
    d.add(mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 6), legM, 0, 0.25, 0.95));
    d.position.set(sx * 5.2, 0, -3 - k * 5.4);
    d.rotation.y = sx * Math.PI / 2;
    g.add(d);
  }
  for (const [x, z] of [[6.8, 3], [-6.8, -20], [6.8, -37]] as const) {
    g.add(mesh(new THREE.CylinderGeometry(0.3, 0.24, 0.5, 10), toon(0xe9dcc0), x, 0.25, z));
    g.add(inked(mesh(new THREE.IcosahedronGeometry(0.6, 0), toon(0x5fa869), x, 1.1, z), 1.04));
  }
  pathLights(g, heightAt, 0xdff2ff);
  return {
    group: g, heightAt, halfWidth: 2.1, figureAt: new THREE.Vector3(0, 0, FIG_Z), gateZ: GATE_Z,
    palette: { top: 0x7fb4e8, bot: 0xeaf3fb, fog: 0xe3ecf4, fogNear: 26, fogFar: 120, hemiSky: 0xffffff, hemiGround: 0xbcc6d2, sun: 0xffffff, sunI: 0.9, hemiI: 1.5 },
    motes: { color: 0xffffff, mode: "drift", size: 0.12 },
  };
}

const BUILD: Record<EnvKind, () => Place> = {
  garden: buildGarden, wood: buildWood, fire: buildFire, water: buildWater, earth: buildEarth, metal: buildMetal,
};

const TONE: Record<Tone, { mix: number; col: number; light: number }> = {
  dawn: { mix: 0.3, col: 0xffc2a6, light: 0.95 },
  day: { mix: 0, col: 0xffffff, light: 1 },
  dusk: { mix: 0.42, col: 0xff8f5e, light: 0.85 },
  night: { mix: 0.62, col: 0x232a66, light: 0.62 },
};

function disposeTree(o: THREE.Object3D) {
  const seen = new Set<unknown>();
  o.traverse((n) => {
    const m = n as THREE.Mesh;
    if (m.geometry && !seen.has(m.geometry)) { seen.add(m.geometry); m.geometry.dispose(); }
    const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
    for (const mat of mats) {
      if (seen.has(mat)) continue;
      seen.add(mat);
      const map = (mat as THREE.MeshBasicMaterial).map;
      if (map && map !== DOT && !seen.has(map)) { seen.add(map); map.dispose(); }
      mat.dispose();
    }
  });
}

/* ───────────────────────── the world ───────────────────────── */

export class World {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(62, 1, 0.1, 400);
  private sky: THREE.Mesh;
  private hemi = new THREE.HemisphereLight(0xffffff, 0x888888, 1.2);
  private sun = new THREE.DirectionalLight(0xffffff, 1.2);
  private place: Place | null = null;
  private leaving: THREE.Group | null = null;
  private figure: THREE.Group | null = null;
  private gate: THREE.Group;
  private motes: THREE.Points;
  private moteVel: Float32Array;
  private moteMode: "fall" | "rise" | "drift" = "fall";
  private pos = new THREE.Vector3(0, 0, 3);
  private yaw = 0;
  private pitch = 0;
  private bob = 0;
  private stride = 0;
  private moving = 0;
  private lean = 0;
  private baseFov = 62;
  private heaven = new THREE.Group();
  private sunDisc: THREE.Sprite;
  private moon: THREE.Sprite;
  private stars: THREE.Points;
  private clouds = new THREE.Group();
  private birds = new THREE.Group();
  private night = 0;
  private nightTo = 0;
  private grow = 1;
  private pal: Palette;
  private palTo: Palette;
  private raf = 0;
  private last = 0;
  private t = 0;
  private met = false;
  private gateOpen = false;
  private gateFired = false;
  private locked = false;
  private talking = false;
  private dead = false;
  private input = { x: 0, z: 0, turn: 0 };
  private auto = false;
  private ro: ResizeObserver;
  private onVis = () => { if (!document.hidden) { this.last = 0; this.loop(); } };

  private canvas: HTMLCanvasElement;
  private reduced: boolean;
  private ev: WorldEvents;

  constructor(canvas: HTMLCanvasElement, reduced: boolean, ev: WorldEvents) {
    this.canvas = canvas; this.reduced = reduced; this.ev = ev;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.scene.fog = new THREE.Fog(0xffffff, 20, 90);
    this.sky = new THREE.Mesh(
      new THREE.SphereGeometry(300, 24, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide, depthWrite: false, fog: false,
        uniforms: { top: { value: new THREE.Color() }, bot: { value: new THREE.Color() } },
        vertexShader: "varying float h; void main(){ h = normalize(position).y; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
        fragmentShader: "uniform vec3 top; uniform vec3 bot; varying float h; void main(){ float k = smoothstep(-0.05, 0.6, h); float band = floor(k*7.0)/7.0; gl_FragColor = vec4(mix(bot, top, mix(k, band, 0.35)), 1.0); }",
      }),
    );
    this.sun.position.set(14, 30, 10);
    this.scene.add(this.sky, this.hemi, this.sun, this.camera);
    // What hangs in the sky: a sun, a moon, stars, cloud and a few birds. They follow the walker, so they never draw near.
    this.sky.renderOrder = -2;
    const far = { transparent: true, depthWrite: false, fog: false } as const;
    this.sunDisc = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(), color: 0xfff0c4, blending: THREE.AdditiveBlending, ...far }));
    this.sunDisc.scale.setScalar(90);
    this.moon = new THREE.Sprite(new THREE.SpriteMaterial({
      map: canvasTex(128, 128, (c) => {
        const gl = c.createRadialGradient(64, 64, 20, 64, 64, 64);
        gl.addColorStop(0, "rgba(230,236,255,.55)"); gl.addColorStop(1, "rgba(230,236,255,0)");
        c.fillStyle = gl; c.fillRect(0, 0, 128, 128);
        c.fillStyle = "#f6f1de"; c.beginPath(); c.arc(64, 64, 30, 0, Math.PI * 2); c.fill();
        c.fillStyle = "rgba(170,170,190,.45)";
        for (const [x, y, r] of [[54, 56, 7], [74, 70, 5], [66, 48, 4], [56, 76, 3.5], [78, 54, 3]]) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); }
      }), ...far,
    }));
    this.moon.scale.setScalar(46);
    const SN = 420, sp = new Float32Array(SN * 3), sr = rng(77);
    for (let i = 0; i < SN; i++) {
      const a = sr() * Math.PI * 2, y = 0.06 + sr() * 0.94, r = Math.sqrt(1 - y * y);
      sp[i * 3] = Math.cos(a) * r * 280; sp[i * 3 + 1] = y * 280; sp[i * 3 + 2] = Math.sin(a) * r * 280;
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    this.stars = new THREE.Points(sg, new THREE.PointsMaterial({ map: softDot(), size: 3.2, sizeAttenuation: false, color: 0xffffff, opacity: 0, ...far }));
    this.stars.frustumCulled = false;
    const cloudTex = canvasTex(256, 128, (c) => {
      for (const [x, y, r] of [[70, 78, 40], [120, 62, 50], [170, 76, 42], [205, 86, 28], [45, 90, 24], [128, 92, 46]]) {
        const gr = c.createRadialGradient(x, y, 0, x, y, r);
        gr.addColorStop(0, "rgba(255,255,255,.95)"); gr.addColorStop(0.6, "rgba(255,255,255,.6)"); gr.addColorStop(1, "rgba(255,255,255,0)");
        c.fillStyle = gr; c.fillRect(0, 0, 256, 128);
      }
    });
    const cr = rng(5);
    for (let i = 0; i < 9; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex, opacity: 0.8, ...far }));
      const a = (i / 9) * Math.PI * 2 + cr() * 0.5, d = 170 + cr() * 50, w = 70 + cr() * 60;
      s.position.set(Math.cos(a) * d, 46 + cr() * 46, Math.sin(a) * d);
      s.scale.set(w, w * 0.42, 1);
      this.clouds.add(s);
    }
    const wingM = new THREE.MeshBasicMaterial({ color: 0x2a2230, side: THREE.DoubleSide, fog: false });
    const wingG = new THREE.PlaneGeometry(0.9, 0.26);
    wingG.translate(0.45, 0, 0);
    for (let i = 0; i < 6; i++) {
      const b = new THREE.Group();
      const l = new THREE.Mesh(wingG, wingM), r = new THREE.Mesh(wingG, wingM);
      l.rotation.x = r.rotation.x = -Math.PI / 2; r.scale.x = -1;
      const lw = new THREE.Group(), rw = new THREE.Group();
      lw.add(l); rw.add(r); b.add(lw, rw);
      b.userData = { lw, rw, a: cr() * 6.28, r: 38 + cr() * 30, y: 22 + cr() * 14, v: 0.12 + cr() * 0.08 };
      this.birds.add(b);
    }
    this.heaven.add(this.sunDisc, this.moon, this.stars, this.clouds, this.birds);
    this.scene.add(this.heaven);
    // The moon gate at the end of each road.
    this.gate = new THREE.Group();
    const ringM = glow(0xffe7a8);
    const disc = new THREE.MeshBasicMaterial({ color: 0xfff6d8, transparent: true, opacity: 0.0, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, fog: false });
    this.gate.add(mesh(new THREE.TorusGeometry(2.1, 0.12, 10, 56), ringM, 0, 2.1, 0));
    this.gate.add(mesh(new THREE.CircleGeometry(2.0, 48), disc, 0, 2.1, 0));
    for (const sx of [-1, 1]) this.gate.add(mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), toon(0x8d8778), sx * 2.2, 0.25, 0));
    this.gate.userData = { ringM, disc };
    this.scene.add(this.gate);
    // Motes in the air round the walker.
    const N = 160;
    const geo = new THREE.BufferGeometry();
    const p = new Float32Array(N * 3);
    this.moteVel = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      p[i * 3] = (Math.random() - 0.5) * 24; p[i * 3 + 1] = Math.random() * 9; p[i * 3 + 2] = (Math.random() - 0.5) * 24;
      this.moteVel[i] = 0.5 + Math.random();
    }
    geo.setAttribute("position", new THREE.BufferAttribute(p, 3));
    this.motes = new THREE.Points(geo, new THREE.PointsMaterial({ map: softDot(), size: 0.16, transparent: true, opacity: 0.9, depthWrite: false, color: 0xffffff }));
    this.motes.frustumCulled = false;
    this.scene.add(this.motes);
    this.pal = this.palTo = buildPaletteDefault();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.resize();
    canvas.addEventListener("webglcontextlost", this.lost);
    document.addEventListener("visibilitychange", this.onVis);
    this.loop();
  }

  private lost = (e: Event) => { e.preventDefault(); this.ev.onLost(); };

  private resize() {
    const w = this.canvas.clientWidth || 1, h = this.canvas.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.baseFov = w < h ? 74 : 62;
    this.camera.fov = this.baseFov - this.lean * 5;
    this.camera.updateProjectionMatrix();
  }

  /** Builds a leg. "grow" raises it out of the place before it, which sinks. */
  load(leg: LegSpec, how: "cut" | "grow") {
    const old = this.place;
    if (this.leaving) { this.scene.remove(this.leaving); disposeTree(this.leaving); this.leaving = null; }
    if (this.figure) { this.scene.remove(this.figure); disposeTree(this.figure); this.figure = null; }
    const place = BUILD[leg.env]();
    this.place = place;
    this.scene.add(place.group);
    if (old) {
      if (how === "grow" && !this.reduced) this.leaving = old.group;
      else { this.scene.remove(old.group); disposeTree(old.group); }
    }
    this.grow = how === "grow" && !this.reduced ? 0 : 1;
    place.group.scale.y = this.grow ? 1 : 0.001;
    // The colours of the hour.
    const tone = TONE[leg.tone];
    const tint = (hex: number) => new THREE.Color(hex).lerp(new THREE.Color(tone.col), tone.mix).getHex();
    const p = place.palette;
    this.palTo = { ...p, top: tint(p.top), bot: tint(p.bot), fog: tint(p.fog), hemiSky: tint(p.hemiSky), sun: tint(p.sun), sunI: p.sunI * tone.light, hemiI: p.hemiI * (0.55 + tone.light * 0.45) };
    if (how === "cut" || this.reduced) this.pal = { ...this.palTo };
    // The one who waits on this road.
    // The hour hangs the sun or the moon, and wakes the stars.
    const hour = leg.hour ?? { dawn: 6.5, day: 10.5, dusk: 18, night: 0 }[leg.tone];
    const a = ((hour - 6) / 12) * Math.PI, up = Math.sin(a), side = Math.cos(a);
    this.sunDisc.position.set(side * 0.8, up * 0.4, -0.6).normalize().multiplyScalar(250);
    this.moon.position.set(-side * 0.8, -up * 0.32, -0.6).normalize().multiplyScalar(250);
    this.sunDisc.visible = up > -0.12;
    this.moon.visible = up < 0.12;
    this.sun.position.set((up >= 0 ? side : -side) * 20, 14 + 16 * Math.abs(up), 10);
    this.nightTo = 1 - Math.max(0, Math.min(1, (up + 0.15) / 0.35));
    if (how === "cut" || this.reduced) this.night = this.nightTo;
    this.birds.visible = !this.reduced && up > 0.1;
    this.figure = leg.figure === "keeper" ? makeKeeper()
      : leg.figure === "animal" ? makeAnimal(leg.animal ?? 0, leg.phase ?? "earth")
      : makeFigure(leg.figure, leg.phase ?? "earth");
    this.figure.position.copy(place.figureAt);
    this.scene.add(this.figure);
    this.gate.position.set(0, place.heightAt(0, place.gateZ), place.gateZ);
    const mm = this.motes.material as THREE.PointsMaterial;
    mm.color.setHex(place.motes.color); mm.size = place.motes.size;
    this.moteMode = place.motes.mode;
    this.met = false; this.gateOpen = false; this.gateFired = false; this.talking = false; this.auto = false;
    this.pos.set(0, 0, 3); this.yaw = 0; this.pitch = 0;
  }

  setInput(x: number, z: number, turn: number) { this.input.x = x; this.input.z = z; this.input.turn = turn; if (x || z) this.auto = false; }
  look(dx: number, dy: number) {
    if (this.talking) return;
    this.yaw -= dx; this.pitch = Math.max(-0.7, Math.min(0.7, this.pitch - dy));
  }
  setAuto(on: boolean) { this.auto = on; }
  get walking() { return this.auto; }
  setLocked(on: boolean) { this.locked = on; }
  setTalking(on: boolean) { this.talking = on; }
  openGate() { this.gateOpen = true; }
  /** 0 to 1 along the road, for the HUD. */
  progress() {
    const p = this.place; if (!p) return 0;
    return Math.max(0, Math.min(1, (3 - this.pos.z) / (3 - p.gateZ)));
  }

  private step(dt: number) {
    const p = this.place; if (!p) return;
    this.t += dt;
    // Palette eases toward the leg's own.
    const k = Math.min(1, dt * 1.6);
    const mixHex = (a: number, b: number) => new THREE.Color(a).lerp(new THREE.Color(b), k).getHex();
    const pa = this.pal, pb = this.palTo;
    this.pal = {
      top: mixHex(pa.top, pb.top), bot: mixHex(pa.bot, pb.bot), fog: mixHex(pa.fog, pb.fog), hemiSky: mixHex(pa.hemiSky, pb.hemiSky),
      hemiGround: mixHex(pa.hemiGround, pb.hemiGround), sun: mixHex(pa.sun, pb.sun),
      fogNear: pa.fogNear + (pb.fogNear - pa.fogNear) * k, fogFar: pa.fogFar + (pb.fogFar - pa.fogFar) * k,
      sunI: pa.sunI + (pb.sunI - pa.sunI) * k, hemiI: pa.hemiI + (pb.hemiI - pa.hemiI) * k,
    };
    const sm = this.sky.material as THREE.ShaderMaterial;
    sm.uniforms.top.value.setHex(this.pal.top); sm.uniforms.bot.value.setHex(this.pal.bot);
    const fog = this.scene.fog as THREE.Fog;
    fog.color.setHex(this.pal.fog); fog.near = this.pal.fogNear; fog.far = this.pal.fogFar;
    this.renderer.setClearColor(this.pal.fog);
    this.hemi.color.setHex(this.pal.hemiSky); this.hemi.groundColor.setHex(this.pal.hemiGround); this.hemi.intensity = this.pal.hemiI;
    this.sun.color.setHex(this.pal.sun); this.sun.intensity = this.pal.sunI;

    // One place rises as the other sinks.
    if (this.grow < 1) {
      this.grow = Math.min(1, this.grow + dt / 2.6);
      const e = 1 - Math.pow(1 - this.grow, 3);
      p.group.scale.y = Math.max(0.001, e);
      if (this.leaving) {
        this.leaving.scale.y = Math.max(0.001, 1 - e);
        this.leaving.position.y = -e * 0.6;
        if (this.grow >= 1) { this.scene.remove(this.leaving); disposeTree(this.leaving); this.leaving = null; }
      }
    }
    p.tick?.(this.t);

    // Walking.
    let mx = this.input.x, mz = this.input.z;
    let walked = false;
    const fig = p.figureAt;
    if (this.auto && !this.locked) {
      // Once met, the walker steps round the one who spoke, then makes for the gate.
      const round = this.met && this.pos.z > fig.z - 2.4;
      const goalZ = round ? fig.z - 2.6 : this.met ? p.gateZ - 1.5 : fig.z + 3.4;
      const goalX = round ? fig.x + Math.min(2.6, p.halfWidth - 0.3) : 0;
      const want = Math.atan2(-(goalX - this.pos.x), -(goalZ - this.pos.z));
      let d = want - this.yaw; d = Math.atan2(Math.sin(d), Math.cos(d));
      this.yaw += d * Math.min(1, dt * 3);
      this.pitch += (0 - this.pitch) * Math.min(1, dt * 3);
      mx = 0; mz = 1;
    }
    if (!this.locked) {
      this.yaw -= this.input.turn * dt * 1.9;
      const len = Math.hypot(mx, mz);
      if (len > 0.01) {
        const sp = 4.4 * Math.min(1, len);
        const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw);
        const rx = Math.cos(this.yaw), rz = -Math.sin(this.yaw);
        this.pos.x += (fx * mz + rx * mx) / len * sp * dt;
        this.pos.z += (fz * mz + rz * mx) / len * sp * dt;
        if (!this.reduced) this.bob += dt * 9;
        this.stride += sp * dt;
        if (this.stride > 1.9) { this.stride = 0; this.ev.onStep?.(); }
        walked = true;
      }
    }
    this.moving += ((walked ? 1 : 0) - this.moving) * Math.min(1, dt * 6);
    // The road keeps the walker.
    this.pos.x = Math.max(-p.halfWidth, Math.min(p.halfWidth, this.pos.x));
    const far = this.gateOpen ? p.gateZ - 2.5 : this.met ? p.gateZ + 2 : fig.z + 2.2;
    this.pos.z = Math.max(far, Math.min(5, this.pos.z));
    const dxF = this.pos.x - fig.x, dzF = this.pos.z - fig.z;
    const dist = Math.hypot(dxF, dzF);
    if (dist < 1.7) { this.pos.x = fig.x + (dxF / (dist || 1)) * 1.7; this.pos.z = fig.z + (dzF / (dist || 1)) * 1.7; }
    if (!this.met && dist < 4.6 && this.grow >= 1) { this.met = true; this.auto = false; this.ev.onNear(); }
    if (this.gateOpen && !this.gateFired && this.pos.z < p.gateZ + 0.4) { this.gateFired = true; this.auto = false; this.ev.onGate(); }

    // In talk the eyes go to the one who speaks.
    if (this.talking && this.figure) {
      const want = Math.atan2(-(fig.x - this.pos.x), -(fig.z - this.pos.z));
      let d = want - this.yaw; d = Math.atan2(Math.sin(d), Math.cos(d));
      this.yaw += d * Math.min(1, dt * 4);
      const eyeY = (this.figure.userData.keeper ? 1.9 : (this.figure.userData.eyeY as number)) + fig.y;
      const wantP = Math.atan2(eyeY - (p.heightAt(this.pos.x, this.pos.z) + 1.5), dist);
      this.pitch += (wantP - this.pitch) * Math.min(1, dt * 4);
    }
    const gy = p.heightAt(this.pos.x, this.pos.z);
    this.pos.y += (gy - this.pos.y) * Math.min(1, dt * 12);
    // The walker breathes, sways a little in the stride, and leans in to listen.
    const live = this.reduced ? 0 : 1;
    const breath = Math.sin(this.t * 1.3) * 0.012 * live;
    this.camera.position.set(this.pos.x, this.pos.y + 1.5 + Math.sin(this.bob) * 0.04 * this.moving + breath, this.pos.z);
    this.camera.rotation.set(this.pitch, this.yaw, Math.sin(this.bob * 0.5) * 0.007 * this.moving * live, "YXZ");
    const leanTo = this.talking && live ? 1 : 0;
    if (Math.abs(leanTo - this.lean) > 0.002) {
      this.lean += (leanTo - this.lean) * Math.min(1, dt * 2.4);
      this.camera.fov = this.baseFov - this.lean * 5;
      this.camera.updateProjectionMatrix();
    }
    this.sky.position.copy(this.camera.position);
    this.heaven.position.copy(this.camera.position);
    this.night += (this.nightTo - this.night) * Math.min(1, dt * 1.2);
    (this.stars.material as THREE.PointsMaterial).opacity = this.night * (live ? 0.82 + Math.sin(this.t * 2.1) * 0.08 : 0.85);
    const cloudCol = new THREE.Color(this.pal.top).lerp(new THREE.Color(0xffffff), 0.75 - this.night * 0.45);
    for (const c of this.clouds.children) {
      const m = (c as THREE.Sprite).material;
      m.color.copy(cloudCol); m.opacity = 0.8 - this.night * 0.5;
    }
    if (live) {
      this.clouds.rotation.y = this.t * 0.004;
      this.stars.rotation.y = this.t * 0.002;
      for (const b of this.birds.children) {
        const u = b.userData as { lw: THREE.Group; rw: THREE.Group; a: number; r: number; y: number; v: number };
        const an = u.a + this.t * u.v;
        b.position.set(Math.cos(an) * u.r, u.y + Math.sin(this.t * 0.5 + u.a) * 1.5, Math.sin(an) * u.r - 20);
        b.rotation.y = -an;
        const flap = Math.sin(this.t * 7 + u.a * 3) * 0.6;
        u.lw.rotation.z = flap; u.rw.rotation.z = -flap;
      }
    }

    // The figure breathes, and turns to the walker.
    if (this.figure) {
      const body = this.figure.userData.body as THREE.Group;
      const face = Math.atan2(this.pos.x - fig.x, this.pos.z - fig.z);
      if (this.figure.userData.keeper) {
        body.position.y = 1.9 + Math.sin(this.t * 1.4) * 0.12;
        body.rotation.y = face;
        (this.figure.userData.ring as THREE.Mesh).rotation.z = this.t * 0.8;
        (this.figure.userData.line as THREE.Mesh).rotation.z = -this.t * 1.05;
      } else {
        const hop = this.talking ? Math.abs(Math.sin(this.t * 5)) * 0.07 : 0;
        body.position.y = Math.sin(this.t * 2.2) * 0.025 + hop;
        body.scale.y = 1 + Math.sin(this.t * 2.2) * 0.02;
        let d = face - body.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d));
        body.rotation.y += d * Math.min(1, dt * 3);
        const blink = Math.sin(this.t * 0.9 + 1) > 0.985 ? 0.15 : 1.45;
        for (const e of this.figure.userData.eyes as THREE.Mesh[]) e.scale.y = blink;
        if (!this.reduced) {
          // Hands that talk, ears that listen, a tail that cannot keep still.
          const ud = this.figure.userData as { hands: THREE.Mesh[]; ears: THREE.Object3D[]; tail: THREE.Object3D | null };
          ud.hands.forEach((h, n) => { h.position.y = (h.userData.y as number) + (this.talking ? Math.max(0, Math.sin(this.t * 4.2 + n * 2.2)) * 0.14 : Math.sin(this.t * 2.2 + n) * 0.012); });
          ud.ears.forEach((e, n) => { e.rotation.z = (e.userData.rz as number) + Math.sin(this.t * 2.6 + n * 1.7) * (this.talking ? 0.1 : 0.05); });
          if (ud.tail) ud.tail.rotation.y = (ud.tail.userData.ry as number) + Math.sin(this.t * 2.8) * 0.3;
        }
      }
    }
    // The gate wakes when the meeting is done.
    const gd = this.gate.userData as { ringM: THREE.MeshBasicMaterial; disc: THREE.MeshBasicMaterial };
    const on = this.gateOpen ? 1 : 0.25;
    gd.ringM.color.setHex(0xffe7a8).multiplyScalar(on + (this.gateOpen ? Math.sin(this.t * 3) * 0.12 : 0));
    gd.disc.opacity += ((this.gateOpen ? 0.5 + Math.sin(this.t * 2) * 0.12 : 0) - gd.disc.opacity) * Math.min(1, dt * 3);

    // Motes.
    const arr = (this.motes.geometry.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < this.moteVel.length; i++) {
      const v = this.moteVel[i];
      if (this.moteMode === "fall") { arr[i * 3 + 1] -= v * dt * 0.9; arr[i * 3] += Math.sin(this.t * v + i) * dt * 0.5; }
      else if (this.moteMode === "rise") { arr[i * 3 + 1] += v * dt * 0.45; arr[i * 3] += Math.sin(this.t * v * 0.7 + i) * dt * 0.35; }
      else { arr[i * 3] += Math.sin(this.t * 0.3 + i) * dt * 0.2; arr[i * 3 + 1] += Math.cos(this.t * 0.4 + i * 2) * dt * 0.12; }
      if (arr[i * 3 + 1] < 0) arr[i * 3 + 1] = 9; else if (arr[i * 3 + 1] > 9) arr[i * 3 + 1] = 0;
    }
    this.motes.geometry.getAttribute("position").needsUpdate = true;
    this.motes.position.set(this.pos.x, this.pos.y, this.pos.z - 6);
  }

  private loop = () => {
    if (this.dead || document.hidden) return;
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame((now) => {
      const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 0.016;
      this.last = now;
      this.step(dt);
      this.renderer.render(this.scene, this.camera);
      this.loop();
    });
  };

  dispose() {
    this.dead = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    document.removeEventListener("visibilitychange", this.onVis);
    this.canvas.removeEventListener("webglcontextlost", this.lost);
    disposeTree(this.scene);
    this.renderer.dispose();
  }
}

function buildPaletteDefault(): Palette {
  return { top: 0x8ec9f2, bot: 0xfdebd0, fog: 0xf4e9d6, fogNear: 30, fogFar: 95, hemiSky: 0xffffff, hemiGround: 0xcdbf9c, sun: 0xfff1d6, sunI: 1.5, hemiI: 1.25 };
}

export function webglOk(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
