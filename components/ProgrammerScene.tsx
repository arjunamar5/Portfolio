"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

type V3 = [number, number, number];

const C = {
  platform: "#161d2f",
  rug: "#1e2944",
  desk: "#e6ebf3",
  deskLeg: "#c9d1de",
  laptop: "#a3acba",
  keys: "#2a3142",
  chair: "#2a3246",
  chairBase: "#3a4357",
  skin: "#cf9268",
  skinShade: "#b77a52",
  hair: "#17100c",
  fade: "#2a211c",
  beard: "#1d1511",
  lip: "#9f5e4a",
  sclera: "#f3eee8",
  iris: "#2a190f",
  hoodie: "#3a4256",
  tee: "#f2f4f8",
  pants: "#1b2030",
  shoe: "#e9edf5",
  sole: "#3B82F6",
  phones: "#111827",
  accent: "#3B82F6",
  neon: "#22D3EE",
  lamp: "#e6ebf3",
  pot: "#c28a62",
  leaf: "#58a77a",
  mug: "#f2f4f8",
};

const mat = (color: string, extra: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.78, metalness: 0.02, ...extra });

/** Text/graphic painted on a canvas, used for the screen, stickers, tee print and glyph sprites. */
function canvasTexture(w: number, h: number, paint: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  paint(g);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return { tex: t, canvas: c, ctx: g };
}

function sticker(text: string, bg: string, fg: string, round = true) {
  return canvasTexture(128, 128, (g) => {
    g.fillStyle = bg;
    if (round) {
      g.beginPath();
      g.arc(64, 64, 60, 0, Math.PI * 2);
      g.fill();
    } else {
      g.beginPath();
      g.roundRect(6, 20, 116, 88, 18);
      g.fill();
    }
    g.fillStyle = fg;
    g.font = "bold 44px ui-monospace, monospace";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text, 64, 66);
  }).tex;
}

const CODE_LINES = [
  ["const ", "fix", " = solve(problem);"],
  ["await ", "db", ".bookings.create(slot);"],
  ["if ", "(user.needs)", " ship();"],
  ["model", ".predict", "(scan);"],
  ["rag", ".ask", "(\"why?\");"],
  ["deploy", "(", "'aws');"],
];

/**
 * Clay-style 3D programmer at a desk, built from rounded primitives:
 * idle breathing, typing hands, a screen of scrolling code lighting his face,
 * steam off the coffee, orbiting code glyphs and a gentle camera sway.
 * The desk sits in a night-time studio room whose objects stand for the About facts.
 * Reports each fact-object's on-screen position (ANCHOR order) so the page can wire
 * its labels to them; `focusRef` lights an object up and turns his head toward it.
 * Drag to look around the room.
 */
export const ANCHOR_COUNT = 6; // diploma, laptop, trophy, AI orb, wall monitor, server rack

export default function ProgrammerScene({
  onAnchors,
  focusRef,
  variant = "room",
}: {
  onAnchors?: (pts: { x: number; y: number }[]) => void;
  focusRef?: React.MutableRefObject<number | null>;
  /** "portrait": just him, head and shoulders, looking at the viewer (no room, no dragging). */
  variant?: "room" | "portrait";
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL — the page still shows the thoughts
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(27, 1, 0.1, 60);
    const target = new THREE.Vector3(0.0, 1.05, 0.0);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x);

    const add = (parent: THREE.Object3D, geo: THREE.BufferGeometry, m: THREE.Material, pos: V3, rot: V3 = [0, 0, 0], shadow = true) => {
      const mesh = new THREE.Mesh(track(geo), m);
      mesh.position.set(...pos);
      mesh.rotation.set(...rot);
      mesh.castShadow = shadow;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };
    const rbox = (w: number, h: number, d: number, r = 0.03) => new RoundedBoxGeometry(w, h, d, 4, r);
    const up = new THREE.Vector3(0, 1, 0);
    /** A rounded "limb" spanning two points (cylinder + ball joints); returns an updater for animation. */
    const unitCyl = track(new THREE.CylinderGeometry(1, 1, 1, 14));
    const unitBall = track(new THREE.SphereGeometry(1, 14, 10));
    const limb = (parent: THREE.Object3D, r: number, m: THREE.Material) => {
      const mesh = new THREE.Mesh(unitCyl, m);
      const j1 = new THREE.Mesh(unitBall, m);
      const j2 = new THREE.Mesh(unitBall, m);
      for (const x of [mesh, j1, j2]) {
        x.castShadow = true;
        x.receiveShadow = true;
        parent.add(x);
      }
      j1.scale.setScalar(r);
      j2.scale.setScalar(r);
      const a = new THREE.Vector3();
      const b = new THREE.Vector3();
      const dir = new THREE.Vector3();
      return (p1: V3, p2: V3) => {
        a.set(...p1);
        b.set(...p2);
        dir.copy(b).sub(a);
        const len = Math.max(0.001, dir.length());
        mesh.position.copy(a).add(b).multiplyScalar(0.5);
        mesh.scale.set(r, len, r);
        mesh.quaternion.setFromUnitVectors(up, dir.normalize());
        j1.position.copy(a);
        j2.position.copy(b);
      };
    };

    // Materials
    const M = Object.fromEntries(Object.entries(C).map(([k, v]) => [k, track(mat(v))])) as Record<keyof typeof C, THREE.MeshStandardMaterial>;
    M.laptop.metalness = 0.35;
    M.laptop.roughness = 0.45;

    // ---------- Lights ----------
    scene.add(new THREE.HemisphereLight("#9fb2ff", "#0b1020", 0.6));
    const key = new THREE.DirectionalLight("#dfe6ff", 1.5);
    key.position.set(3.2, 5.5, 3.8);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -2.6;
    key.shadow.camera.right = 2.6;
    key.shadow.camera.top = 2.6;
    key.shadow.camera.bottom = -2.6;
    key.shadow.radius = 4;
    key.shadow.bias = -0.0008;
    scene.add(key);
    const rim = new THREE.DirectionalLight("#22D3EE", 1.0);
    rim.position.set(-3.5, 3, -3.5);
    scene.add(rim);
    const screenLight = new THREE.PointLight("#60A5FA", 2.2, 2.2, 1.6);
    screenLight.position.set(0, 1.32, 0.3);
    scene.add(screenLight);

    // ---------- Platform ----------
    add(scene, rbox(3.1, 0.14, 3.1, 0.07), M.platform, [0, -0.07, 0]);
    add(scene, rbox(2.6, 0.02, 2.5, 0.01), M.rug, [0.05, 0.01, 0.05]);
    const edge = new THREE.Mesh(
      track(rbox(3.2, 0.03, 3.2, 0.015)),
      track(new THREE.MeshBasicMaterial({ color: C.accent, transparent: true, opacity: 0.55 }))
    );
    edge.position.set(0, -0.15, 0);
    scene.add(edge);
    const glow = canvasTexture(256, 256, (g) => {
      const grd = g.createRadialGradient(128, 128, 10, 128, 128, 128);
      grd.addColorStop(0, "rgba(59,130,246,0.55)");
      grd.addColorStop(0.5, "rgba(34,211,238,0.15)");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, 256, 256);
    });
    track(glow.tex);
    const glowMesh = new THREE.Mesh(
      track(new THREE.PlaneGeometry(7, 7)),
      track(new THREE.MeshBasicMaterial({ map: glow.tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
    );
    glowMesh.rotation.x = -Math.PI / 2;
    glowMesh.position.y = -0.17;
    scene.add(glowMesh);

    // ---------- Desk ----------
    const deskY = 1.05;
    add(scene, rbox(1.8, 0.07, 0.85, 0.03), M.desk, [0.05, deskY, 0.55]);
    for (const [x, z] of [[-0.78, 0.2], [0.88, 0.2], [-0.78, 0.9], [0.88, 0.9]]) {
      add(scene, new THREE.CylinderGeometry(0.022, 0.022, deskY - 0.03, 10), M.deskLeg, [x, (deskY - 0.03) / 2, z]);
    }

    // ---------- Laptop (screen faces him, stickered lid faces us) ----------
    const baseTop = deskY + 0.035;
    add(scene, rbox(0.62, 0.028, 0.42, 0.012), M.laptop, [0, baseTop + 0.014, 0.42]);
    add(scene, new THREE.PlaneGeometry(0.52, 0.2), M.keys, [0, baseTop + 0.029, 0.38], [-Math.PI / 2, 0, 0], false);
    const lid = new THREE.Group();
    lid.position.set(0, baseTop + 0.028, 0.63);
    lid.rotation.x = 0.22;
    scene.add(lid);
    add(lid, rbox(0.62, 0.42, 0.02, 0.012), M.laptop, [0, 0.21, 0]);
    const screen = canvasTexture(512, 320, () => {});
    track(screen.tex);
    const drawScreen = (t: number) => {
      const g = screen.ctx;
      g.fillStyle = "#070b16";
      g.fillRect(0, 0, 512, 320);
      g.font = "22px ui-monospace, monospace";
      const off = Math.floor(t * 1.2) % CODE_LINES.length;
      for (let i = 0; i < 9; i++) {
        const [a, b, c] = CODE_LINES[(i + off) % CODE_LINES.length];
        const y = 36 + i * 32;
        g.fillStyle = "#3b4a6b";
        g.fillText(String(i + 1).padStart(2, " "), 14, y);
        g.fillStyle = "#60A5FA";
        g.fillText(a, 56, y);
        g.fillStyle = "#34D399";
        g.fillText(b, 56 + g.measureText(a).width, y);
        g.fillStyle = "#cbd5e1";
        g.fillText(c, 56 + g.measureText(a + b).width, y);
      }
      if (Math.floor(t * 2) % 2 === 0) {
        g.fillStyle = "#22D3EE";
        g.fillRect(56, 36 + 8 * 32 - 18, 12, 22);
      }
      screen.tex.needsUpdate = true;
    };
    drawScreen(0);
    const screenMat = track(new THREE.MeshBasicMaterial({ map: screen.tex, toneMapped: false }));
    add(lid, new THREE.PlaneGeometry(0.56, 0.36), screenMat, [0, 0.21, -0.0115], [0, Math.PI, 0], false);
    // Stickers on the back of the lid
    const stickers: [string, string, string, boolean, V3, number][] = [
      ["</>", "#3B82F6", "#ffffff", true, [-0.17, 0.3, 0.0115], 0.12],
      ["AI", "#E879F9", "#1a0b24", false, [0.13, 0.31, 0.0115], 0.13],
      ["{ }", "#FBBF24", "#1f1500", true, [0.16, 0.12, 0.0115], 0.1],
      ["λ", "#34D399", "#04140d", true, [-0.12, 0.12, 0.0115], 0.1],
    ];
    for (const [txt, bg, fg, round, pos, size] of stickers) {
      const tex = track(sticker(txt, bg, fg, round));
      add(lid, new THREE.PlaneGeometry(size, size), track(new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.5 })), pos, [0, 0, (pos[0] * 2) % 0.4], false);
    }

    // ---------- Mug with steam ----------
    const mug = new THREE.Group();
    mug.position.set(0.58, baseTop, 0.5);
    scene.add(mug);
    add(mug, new THREE.CylinderGeometry(0.055, 0.05, 0.12, 20), M.mug, [0, 0.06, 0]);
    add(mug, new THREE.TorusGeometry(0.032, 0.01, 8, 16), M.mug, [0.06, 0.065, 0], [0, 0, 0]);
    add(mug, new THREE.CylinderGeometry(0.05, 0.05, 0.005, 20), track(mat("#3b2416")), [0, 0.115, 0], [0, 0, 0], false);
    add(mug, new THREE.CylinderGeometry(0.0555, 0.0555, 0.025, 20), track(mat(C.accent)), [0, 0.07, 0], [0, 0, 0], false);
    const steamMat = track(new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.25, depthWrite: false }));
    const steam = Array.from({ length: 5 }, (_, i) => {
      const s = new THREE.Mesh(track(new THREE.SphereGeometry(0.025, 10, 8)), steamMat.clone());
      track(s.material as THREE.Material);
      mug.add(s);
      return { s, phase: i / 5 };
    });

    // ---------- Lamp ----------
    const lamp = new THREE.Group();
    lamp.position.set(-0.62, baseTop, 0.78);
    scene.add(lamp);
    add(lamp, new THREE.CylinderGeometry(0.09, 0.1, 0.03, 24), M.lamp, [0, 0.015, 0]);
    const arm1 = limb(lamp, 0.016, M.lamp);
    arm1([0, 0.03, 0], [0.05, 0.42, -0.12]);
    const arm2 = limb(lamp, 0.016, M.lamp);
    arm2([0.05, 0.42, -0.12], [0.3, 0.52, -0.2]);
    add(lamp, new THREE.SphereGeometry(0.03, 12, 10), M.lamp, [0.05, 0.42, -0.12]);
    const shade = add(lamp, new THREE.ConeGeometry(0.1, 0.16, 24, 1, true), track(mat(C.lamp, { side: THREE.DoubleSide })), [0.33, 0.47, -0.2], [0, 0, -0.5]);
    shade.castShadow = true;
    add(lamp, new THREE.SphereGeometry(0.035, 12, 10), track(new THREE.MeshBasicMaterial({ color: "#ffd9a0" })), [0.35, 0.42, -0.2], [0, 0, 0], false);
    const lampLight = new THREE.PointLight("#ffcf8a", 2.6, 2.8, 1.6);
    lampLight.position.set(-0.62 + 0.35, baseTop + 0.38, 0.78 - 0.2);
    scene.add(lampLight);

    // ---------- Plant ----------
    const plant = new THREE.Group();
    plant.position.set(-1.1, 0, 0.9);
    scene.add(plant);
    add(plant, new THREE.CylinderGeometry(0.17, 0.13, 0.3, 24), M.pot, [0, 0.15, 0]);
    add(plant, new THREE.CylinderGeometry(0.155, 0.155, 0.02, 24), track(mat("#3a2a1f")), [0, 0.29, 0], [0, 0, 0], false);
    const stem = limb(plant, 0.012, track(mat("#3f7a52")));
    stem([0, 0.28, 0], [0.02, 0.95, 0.02]);
    for (let i = 0; i < 9; i++) {
      const y = 0.42 + i * 0.065;
      const a = i * 2.4;
      const leaf = add(plant, new THREE.SphereGeometry(0.1, 12, 8), M.leaf, [Math.cos(a) * 0.09, y, Math.sin(a) * 0.09], [0.4, -a, 0.5]);
      leaf.scale.set(1.25, 0.18, 0.55);
    }

    // ---------- The room: two walls, LED wash, window, neon, shelf, diploma, wall screen, AI orb, rack ----------
    const glowTex = track(
      canvasTexture(128, 128, (g) => {
        const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
        grd.addColorStop(0, "rgba(255,255,255,1)");
        grd.addColorStop(0.35, "rgba(255,255,255,0.35)");
        grd.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = grd;
        g.fillRect(0, 0, 128, 128);
      }).tex
    );
    const halo = (color: string, size: number, pos: V3, opacity = 0.6) => {
      const sp = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending })));
      sp.scale.set(size, size, 1);
      sp.position.set(...pos);
      scene.add(sp);
      return sp;
    };
    const basic = (color: string) => track(new THREE.MeshBasicMaterial({ color, toneMapped: false }));
    const wallMat = track(mat("#141b31", { roughness: 0.95 }));
    add(scene, rbox(3.18, 2.5, 0.08, 0.02), wallMat, [0, 1.25, -1.51]);
    add(scene, rbox(0.08, 2.5, 3.1, 0.02), wallMat, [-1.51, 1.25, 0.04]);
    // LED strips along the top, washing the walls with colour
    const washTex = track(
      canvasTexture(16, 256, (g) => {
        const grd = g.createLinearGradient(0, 0, 0, 256);
        grd.addColorStop(0, "rgba(255,255,255,0.75)");
        grd.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = grd;
        g.fillRect(0, 0, 16, 256);
      }).tex
    );
    const washMat = (color: string) => track(new THREE.MeshBasicMaterial({ map: washTex, color, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }));
    add(scene, new THREE.BoxGeometry(3.1, 0.024, 0.024), basic("#c084fc"), [0, 2.47, -1.455], [0, 0, 0], false);
    add(scene, new THREE.BoxGeometry(0.024, 0.024, 3.1), basic("#22d3ee"), [-1.455, 2.47, 0.04], [0, 0, 0], false);
    add(scene, new THREE.PlaneGeometry(3.1, 1.1), washMat("#a855f7"), [0, 1.93, -1.465], [0, 0, 0], false);
    add(scene, new THREE.PlaneGeometry(3.1, 1.1), washMat("#22d3ee"), [-1.465, 1.93, 0.04], [0, Math.PI / 2, 0], false);
    const ledLight = new THREE.PointLight("#a855f7", 1.1, 3.2, 1.6);
    ledLight.position.set(-0.6, 2.3, -1.1);
    scene.add(ledLight);

    // Window on the back wall: night skyline, moon, rain
    const city = canvasTexture(512, 512, (g) => {
      const sky = g.createLinearGradient(0, 0, 0, 512);
      sky.addColorStop(0, "#070b24");
      sky.addColorStop(0.65, "#1b1646");
      sky.addColorStop(1, "#3a1f5c");
      g.fillStyle = sky;
      g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 70; i++) {
        g.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.6})`;
        g.fillRect(Math.random() * 512, Math.random() * 260, 1.6, 1.6);
      }
      g.shadowColor = "#dbe4ff";
      g.shadowBlur = 40;
      g.fillStyle = "#eef2ff";
      g.beginPath();
      g.arc(120, 105, 34, 0, Math.PI * 2);
      g.fill();
      g.shadowBlur = 0;
      let x = -10;
      while (x < 520) {
        const w = 34 + Math.random() * 46;
        const h = 150 + Math.random() * 190;
        g.fillStyle = ["#0b1024", "#0e1430", "#111838"][Math.floor(Math.random() * 3)];
        g.fillRect(x, 512 - h, w, h);
        for (let wy = 512 - h + 10; wy < 500; wy += 14) {
          for (let wx = x + 6; wx < x + w - 6; wx += 10) {
            if (Math.random() < 0.32) {
              g.fillStyle = Math.random() < 0.7 ? "rgba(252,211,77,0.85)" : "rgba(103,232,249,0.85)";
              g.fillRect(wx, wy, 5, 7);
            }
          }
        }
        x += w + 4;
      }
    });
    track(city.tex);
    const rain = canvasTexture(128, 256, (g) => {
      g.strokeStyle = "rgba(190,205,255,0.45)";
      g.lineWidth = 1.2;
      for (let i = 0; i < 46; i++) {
        const rx = Math.random() * 128;
        const ry = Math.random() * 256;
        const len = 10 + Math.random() * 16;
        g.beginPath();
        g.moveTo(rx, ry);
        g.lineTo(rx - 2, ry + len);
        g.stroke();
      }
    });
    track(rain.tex);
    rain.tex.wrapS = rain.tex.wrapT = THREE.RepeatWrapping;
    rain.tex.repeat.set(2, 1.6);
    const win = new THREE.Group();
    win.position.set(0.95, 1.42, -1.465);
    scene.add(win);
    add(win, new THREE.PlaneGeometry(0.9, 1.0), track(new THREE.MeshBasicMaterial({ map: city.tex, toneMapped: false })), [0, 0, 0], [0, 0, 0], false);
    add(win, new THREE.PlaneGeometry(0.9, 1.0), track(new THREE.MeshBasicMaterial({ map: rain.tex, transparent: true, depthWrite: false, toneMapped: false })), [0, 0, 0.004], [0, 0, 0], false);
    const frameMat = track(mat("#0c1222", { roughness: 0.6 }));
    for (const [w, h, x, y] of [[0.98, 0.05, 0, 0.52], [0.98, 0.05, 0, -0.52], [0.05, 1.08, -0.47, 0], [0.05, 1.08, 0.47, 0], [0.03, 1.0, 0, 0], [0.9, 0.03, 0, 0.08]] as [number, number, number, number][]) {
      add(win, new THREE.BoxGeometry(w, h, 0.05), frameMat, [x, y, 0.02]);
    }
    add(win, rbox(1.06, 0.04, 0.14, 0.01), frameMat, [0, -0.56, 0.06]);
    const moon = new THREE.PointLight("#7c9cff", 1.4, 2.8, 1.6);
    moon.position.set(0.95, 1.55, -1.05);
    scene.add(moon);

    // Neon sign on the left wall
    const neon = canvasTexture(512, 256, (g) => {
      g.font = "bold 150px ui-monospace, monospace";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.lineJoin = "round";
      g.shadowColor = "#ff3fd0";
      g.shadowBlur = 34;
      g.strokeStyle = "#ff5bd9";
      g.lineWidth = 12;
      g.strokeText("</>", 256, 128);
      g.shadowBlur = 10;
      g.strokeStyle = "#ffd3f6";
      g.lineWidth = 4;
      g.strokeText("</>", 256, 128);
    });
    track(neon.tex);
    add(scene, new THREE.PlaneGeometry(0.86, 0.43), track(new THREE.MeshBasicMaterial({ map: neon.tex, transparent: true, depthWrite: false, toneMapped: false })), [-1.462, 1.78, -0.72], [0, Math.PI / 2, 0], false);
    halo("#ff4fd8", 1.3, [-1.4, 1.78, -0.72], 0.32);
    const neonLight = new THREE.PointLight("#f472b6", 1.6, 2.4, 1.6);
    neonLight.position.set(-1.25, 1.8, -0.72);
    scene.add(neonLight);

    // Diploma (CS graduate) on the left wall
    const diploma = canvasTexture(256, 192, (g) => {
      g.fillStyle = "#f6efd9";
      g.fillRect(0, 0, 256, 192);
      g.strokeStyle = "#c9a227";
      g.lineWidth = 4;
      g.strokeRect(10, 10, 236, 172);
      g.fillStyle = "#1f2a44";
      g.beginPath();
      g.moveTo(128, 34);
      g.lineTo(168, 50);
      g.lineTo(128, 66);
      g.lineTo(88, 50);
      g.closePath();
      g.fill();
      g.fillRect(110, 56, 36, 14);
      g.font = "bold 18px Georgia, serif";
      g.textAlign = "center";
      g.fillText("B.Tech · CSE", 128, 100);
      g.fillStyle = "#94a3b8";
      g.fillRect(64, 116, 128, 4);
      g.fillRect(84, 128, 88, 4);
      g.fillStyle = "#d4a017";
      g.beginPath();
      g.arc(204, 150, 18, 0, Math.PI * 2);
      g.fill();
    });
    track(diploma.tex);
    const dipGroup = new THREE.Group();
    dipGroup.position.set(-1.462, 1.76, 0.62);
    dipGroup.rotation.y = Math.PI / 2;
    scene.add(dipGroup);
    add(dipGroup, rbox(0.44, 0.34, 0.03, 0.008), track(mat("#4a3322", { roughness: 0.5 })), [0, 0, 0.012]);
    add(dipGroup, new THREE.PlaneGeometry(0.38, 0.28), track(new THREE.MeshStandardMaterial({ map: diploma.tex, roughness: 0.7 })), [0, 0, 0.03], [0, 0, 0], false);

    // Floating shelf with books and the CSI trophy
    const shelfTop = 1.12;
    add(scene, rbox(0.28, 0.035, 0.82, 0.01), track(mat("#5b4330", { roughness: 0.6 })), [-1.4, shelfTop - 0.0175, 0.56]);
    const bookCols = ["#3B82F6", "#E879F9", "#34D399", "#FBBF24", "#F87171"];
    bookCols.forEach((c, i) => {
      const h = 0.18 + ((i * 37) % 9) / 100;
      const b = add(scene, rbox(0.16, h, 0.045, 0.006), track(mat(c, { roughness: 0.7 })), [-1.42, shelfTop + h / 2, 0.24 + i * 0.055], [i === 4 ? 0.22 : 0, 0, 0]);
      if (i === 4) b.position.z += 0.02;
    });
    const gold = track(mat("#f2c14e", { metalness: 0.55, roughness: 0.3, emissive: new THREE.Color("#3a2800") }));
    const trophy = new THREE.Group();
    trophy.position.set(-1.4, shelfTop, 0.84);
    scene.add(trophy);
    add(trophy, rbox(0.1, 0.035, 0.1, 0.01), track(mat("#2b1d14")), [0, 0.0175, 0]);
    add(trophy, new THREE.CylinderGeometry(0.012, 0.018, 0.06, 12), gold, [0, 0.065, 0]);
    const cupPts = [
      [0.0, 0.0],
      [0.03, 0.004],
      [0.048, 0.035],
      [0.056, 0.08],
      [0.05, 0.086],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    add(trophy, new THREE.LatheGeometry(cupPts, 24), track(mat("#f2c14e", { metalness: 0.55, roughness: 0.3, emissive: new THREE.Color("#3a2800"), side: THREE.DoubleSide })), [0, 0.095, 0]);
    for (const sx of [1, -1]) add(trophy, new THREE.TorusGeometry(0.022, 0.006, 8, 16, Math.PI), gold, [sx * 0.052, 0.14, 0], [0, 0, sx > 0 ? -Math.PI / 2 : Math.PI / 2]);

    // Wall screen on the back wall: code on the left, a running UI on the right (full-stack)
    const wallScreen = canvasTexture(512, 320, () => {});
    track(wallScreen.tex);
    const drawWall = (t: number) => {
      const g = wallScreen.ctx;
      g.fillStyle = "#060a16";
      g.fillRect(0, 0, 512, 320);
      const cols = ["#C084FC", "#60A5FA", "#34D399", "#94A3B8", "#FBBF24"];
      for (let i = 0; i < 9; i++) {
        let x = 24 + (i % 3 === 1 ? 18 : 0);
        for (let j = 0; j < 3; j++) {
          const w = 18 + ((i * 7 + j * 13) % 40);
          g.fillStyle = cols[(i + j) % cols.length];
          g.fillRect(x, 30 + i * 30, w, 9);
          x += w + 8;
        }
      }
      g.fillStyle = "#0f172a";
      g.fillRect(268, 20, 224, 280);
      g.fillStyle = "#1e293b";
      g.fillRect(284, 36, 192, 22);
      g.fillRect(284, 70, 90, 60);
      g.fillRect(386, 70, 90, 60);
      g.strokeStyle = "#34D399";
      g.lineWidth = 4;
      g.beginPath();
      for (let k = 0; k <= 12; k++) {
        const px = 288 + k * 15.5;
        const py = 250 - k * 6 - Math.sin(k * 0.9 + t * 2) * 10;
        k ? g.lineTo(px, py) : g.moveTo(px, py);
      }
      g.stroke();
      wallScreen.tex.needsUpdate = true;
    };
    drawWall(0);
    const monitor = new THREE.Group();
    monitor.position.set(0.0, 1.62, -1.462);
    scene.add(monitor);
    add(monitor, rbox(0.66, 0.42, 0.035, 0.012), track(mat("#0b0f1a", { roughness: 0.4 })), [0, 0, 0.018]);
    add(monitor, new THREE.PlaneGeometry(0.6, 0.36), track(new THREE.MeshBasicMaterial({ map: wallScreen.tex, toneMapped: false })), [0, 0, 0.037], [0, 0, 0], false);

    // AI orb hovering over the server (LLMs & RAG)
    const orb = new THREE.Group();
    orb.position.set(1.3, 1.52, 0.92);
    scene.add(orb);
    const orbWire = new THREE.LineSegments(
      track(new THREE.EdgesGeometry(track(new THREE.IcosahedronGeometry(0.17, 1)))),
      track(new THREE.LineBasicMaterial({ color: "#c4b5fd", transparent: true, opacity: 0.9 }))
    );
    orb.add(orbWire);
    add(orb, new THREE.SphereGeometry(0.07, 20, 16), basic("#d8b4fe"), [0, 0, 0], [0, 0, 0], false);
    const ring1 = add(orb, new THREE.TorusGeometry(0.25, 0.004, 6, 64), basic("#22d3ee"), [0, 0, 0], [1.2, 0, 0.3], false);
    const ring2 = add(orb, new THREE.TorusGeometry(0.21, 0.004, 6, 64), basic("#f0abfc"), [0, 0, 0], [0.4, 0.9, 0], false);
    const orbHalo = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: glowTex, color: "#a78bfa", transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending })));
    orbHalo.scale.set(0.9, 0.9, 1);
    orb.add(orbHalo);

    // Server rack on the floor (ships real products)
    const rack = new THREE.Group();
    rack.position.set(1.25, 0, 0.62);
    scene.add(rack);
    add(rack, rbox(0.34, 0.74, 0.34, 0.02), track(mat("#0f1523", { roughness: 0.5 })), [0, 0.37, 0]);
    const leds: { m: THREE.Mesh; phase: number }[] = [];
    for (let u = 0; u < 4; u++) {
      add(rack, rbox(0.3, 0.13, 0.012, 0.004), track(mat("#1a2236", { roughness: 0.6 })), [0, 0.12 + u * 0.165, 0.172]);
      for (let l = 0; l < 3; l++) {
        const m = add(rack, new THREE.SphereGeometry(0.011, 8, 6), basic(l === 2 ? "#60A5FA" : "#34D399"), [-0.1 + l * 0.03, 0.12 + u * 0.165, 0.18], [0, 0, 0], false);
        leds.push({ m, phase: u * 1.7 + l * 0.9 });
      }
      add(rack, new THREE.BoxGeometry(0.12, 0.008, 0.004), basic("#1f2a44"), [0.07, 0.12 + u * 0.165, 0.18], [0, 0, 0], false);
    }
    halo("#34D399", 0.55, [1.25, 0.4, 0.82], 0.22);

    // Highlight halos for each fact-object, in ANCHOR order
    const PINS: V3[] = [
      [-1.43, 1.76, 0.62], // diploma
      [0, baseTop + 0.26, 0.66], // laptop
      [-1.4, shelfTop + 0.12, 0.84], // trophy
      [1.3, 1.52, 0.92], // orb (follows the bob)
      [0.0, 1.62, -1.43], // wall screen
      [1.25, 0.5, 0.8], // rack
    ];
    const PIN_COLORS = ["#60A5FA", "#34D399", "#22D3EE", "#E879F9", "#38BDF8", "#FB923C"];
    const focusHalos = PINS.map((pp, i) => ({ sp: halo(PIN_COLORS[i], 0.75, pp, 0), k: 0 }));

    // ---------- Chair ----------
    const chair = new THREE.Group();
    chair.position.set(0, 0, -0.32);
    scene.add(chair);
    add(chair, rbox(0.64, 0.09, 0.6, 0.04), M.chair, [0, 0.62, 0]);
    add(chair, rbox(0.62, 0.72, 0.09, 0.04), M.chair, [0, 1.05, -0.3], [-0.12, 0, 0]);
    add(chair, new THREE.CylinderGeometry(0.03, 0.03, 0.46, 12), M.chairBase, [0, 0.35, 0]);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      add(chair, rbox(0.34, 0.035, 0.05, 0.015), M.chairBase, [Math.cos(a) * 0.17, 0.1, Math.sin(a) * 0.17], [0, -a, 0]);
      add(chair, new THREE.SphereGeometry(0.035, 10, 8), M.chairBase, [Math.cos(a) * 0.33, 0.04, Math.sin(a) * 0.33]);
    }

    // ---------- The programmer ----------
    const body = new THREE.Group();
    scene.add(body);
    // Hips + legs
    add(body, rbox(0.46, 0.2, 0.42, 0.08), M.pants, [0, 0.76, -0.28]);
    const thighL = limb(body, 0.1, M.pants);
    const thighR = limb(body, 0.1, M.pants);
    thighL([0.13, 0.77, -0.26], [0.14, 0.76, 0.22]);
    thighR([-0.13, 0.77, -0.26], [-0.14, 0.76, 0.22]);
    const shinL = limb(body, 0.085, M.pants);
    const shinR = limb(body, 0.085, M.pants);
    shinL([0.14, 0.76, 0.22], [0.15, 0.14, 0.3]);
    shinR([-0.14, 0.76, 0.22], [-0.15, 0.14, 0.3]);
    for (const x of [0.15, -0.15]) {
      add(body, rbox(0.17, 0.12, 0.32, 0.05), M.shoe, [x, 0.08, 0.38]);
      add(body, rbox(0.175, 0.03, 0.33, 0.012), M.sole, [x, 0.02, 0.38], [0, 0, 0], false);
    }

    // Torso (hoodie) with an open front showing the tee
    const torso = new THREE.Group();
    torso.position.set(0, 0.86, -0.3);
    torso.rotation.x = 0.13;
    body.add(torso);
    const chest = add(torso, new THREE.CapsuleGeometry(0.235, 0.36, 8, 20), M.hoodie, [0, 0.3, 0]);
    chest.scale.set(1.08, 1, 0.82);
    const teeTex = canvasTexture(128, 160, (g) => {
      g.fillStyle = C.tee;
      g.fillRect(0, 0, 128, 160);
      g.fillStyle = "#3B82F6";
      g.font = "bold 40px ui-monospace, monospace";
      g.textAlign = "center";
      g.fillText("</>", 64, 72);
      g.fillStyle = "#22D3EE";
      g.fillRect(34, 92, 60, 6);
    });
    track(teeTex.tex);
    add(torso, rbox(0.17, 0.36, 0.03, 0.012), track(new THREE.MeshStandardMaterial({ map: teeTex.tex, roughness: 0.8 })), [0, 0.32, 0.18], [0, 0, 0], false);
    // Zip edges of the hoodie
    add(torso, rbox(0.03, 0.4, 0.03, 0.01), M.hoodie, [0.1, 0.3, 0.18], [0, 0, 0], false);
    add(torso, rbox(0.03, 0.4, 0.03, 0.01), M.hoodie, [-0.1, 0.3, 0.18], [0, 0, 0], false);
    // Hood bunched behind the neck + drawstrings
    const hood = add(torso, new THREE.SphereGeometry(0.18, 18, 14), M.hoodie, [0, 0.63, -0.14]);
    hood.scale.set(1.25, 0.62, 0.8);
    add(torso, new THREE.CylinderGeometry(0.007, 0.007, 0.16, 6), M.tee, [0.05, 0.47, 0.19], [0.1, 0, 0], false);
    add(torso, new THREE.CylinderGeometry(0.007, 0.007, 0.16, 6), M.tee, [-0.05, 0.47, 0.19], [0.1, 0, 0], false);
    add(torso, new THREE.CylinderGeometry(0.07, 0.075, 0.12, 14), M.skin, [0, 0.66, 0.02]);

    // Headphones resting around the neck (so the hair stays visible)
    const ringMat = track(new THREE.MeshBasicMaterial({ color: C.neon, toneMapped: false }));
    add(torso, new THREE.TorusGeometry(0.17, 0.018, 10, 40, Math.PI), M.phones, [0, 0.6, 0.0], [-Math.PI / 2, 0, 0]);
    for (const x of [0.17, -0.17]) {
      const cup = new THREE.Group();
      cup.position.set(x, 0.57, 0.07);
      cup.rotation.set(-0.7, 0, x > 0 ? -0.35 : 0.35);
      torso.add(cup);
      add(cup, new THREE.CylinderGeometry(0.07, 0.07, 0.045, 24), M.phones, [0, 0, 0]);
      add(cup, new THREE.TorusGeometry(0.06, 0.008, 8, 28), ringMat, [0, 0.024, 0], [Math.PI / 2, 0, 0], false);
    }

    // Head — a stylised likeness: oval face, full groomed beard, thick brows, swept-up quiff
    const head = new THREE.Group();
    head.position.set(0, 1.7, -0.12);
    head.scale.setScalar(1.38);
    body.add(head);
    const skull = add(head, new THREE.SphereGeometry(0.2, 40, 30), M.skin, [0, 0, 0]);
    skull.scale.set(0.9, 1.12, 0.98);
    const jaw = add(head, new THREE.SphereGeometry(0.17, 28, 20), M.skin, [0, -0.07, 0.03]);
    jaw.scale.set(0.95, 0.85, 0.95);
    const white = track(new THREE.MeshBasicMaterial({ color: "#ffffff" }));
    for (const x of [0.066, -0.066]) {
      const side = x > 0 ? 1 : -1;
      // Almond eyes: sclera, dark iris, a catch-light and a soft lash line
      const eye = add(head, new THREE.SphereGeometry(0.032, 20, 14), M.sclera, [x, 0.02, 0.166], [0, side * 0.3, 0], false);
      eye.scale.set(1.25, 0.7, 0.55);
      add(head, new THREE.SphereGeometry(0.0195, 16, 12), M.iris, [x * 0.97, 0.018, 0.181], [0, 0, 0], false);
      add(head, new THREE.SphereGeometry(0.0055, 8, 6), white, [x * 0.92, 0.026, 0.198], [0, 0, 0], false);
      add(head, new THREE.CapsuleGeometry(0.005, 0.05, 4, 8), M.hair, [x, 0.037, 0.183], [0, side * 0.3, Math.PI / 2 - side * 0.1], false);
      // Thick, straight brows (a touch lower at the outer end — calm, not cross)
      add(head, rbox(0.084, 0.02, 0.026, 0.009), M.hair, [x * 1.02, 0.084, 0.179], [0.1, side * 0.35, -side * 0.16], false);
      // Ears
      const ear = add(head, new THREE.SphereGeometry(0.045, 14, 10), M.skin, [side * 0.184, 0.0, -0.01]);
      ear.scale.set(0.5, 1, 0.85);
      // Sideburns joining the faded sides to the beard
      add(head, rbox(0.022, 0.1, 0.055, 0.01), M.hair, [side * 0.179, 0.03, 0.03], [0, side * 0.3, 0]);
      // Nostril wings
      add(head, new THREE.SphereGeometry(0.015, 10, 8), M.skinShade, [side * 0.022, -0.033, 0.198], [0, 0, 0], false);
    }
    // Nose: bridge + rounded tip
    add(head, new THREE.CapsuleGeometry(0.016, 0.04, 4, 10), M.skin, [0, 0.005, 0.198], [-0.35, 0, 0], false);
    const tip = add(head, new THREE.SphereGeometry(0.026, 14, 12), M.skin, [0, -0.026, 0.21], [0, 0, 0], false);
    tip.scale.set(1.08, 0.9, 0.9);
    // Full beard: a shell covering cheeks and jaw up to the moustache line, plus a fuller chin
    const beard = add(head, new THREE.SphereGeometry(0.207, 40, 18, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5), M.beard, [0, -0.02, 0.012], [0.25, 0, 0]);
    beard.scale.set(0.97, 1.1, 1.0);
    const chin = add(head, new THREE.SphereGeometry(0.064, 18, 14), M.beard, [0, -0.19, 0.105]);
    chin.scale.set(1.35, 0.9, 1);
    // Moustache over the lip, lower lip sitting on the beard
    const stache = add(head, new THREE.CapsuleGeometry(0.014, 0.066, 4, 10), M.hair, [0, -0.063, 0.214], [0, 0, Math.PI / 2], false);
    stache.scale.set(1, 1, 0.7);
    add(head, new THREE.CapsuleGeometry(0.011, 0.032, 4, 8), M.lip, [0, -0.095, 0.214], [0, 0, Math.PI / 2], false);
    // Hair: short faded sides/back fitted to the skull, then a smooth quiff swept up and back
    const sides = add(head, new THREE.SphereGeometry(0.211, 40, 18, 0, Math.PI * 2, 0, Math.PI * 0.5), M.fade, [0, 0.05, -0.006], [-0.5, 0, 0]);
    sides.scale.set(0.95, 1.08, 1);
    sides.castShadow = true;
    const QUIFF: [V3, V3, V3][] = [
      // position, scale, rotation
      [[0.0, 0.2, -0.01], [0.176, 0.09, 0.19], [-0.15, 0, 0]],
      [[0.0, 0.232, 0.105], [0.152, 0.08, 0.095], [-0.5, 0, 0.05]],
      [[-0.018, 0.262, 0.095], [0.11, 0.046, 0.08], [-0.3, 0, 0.12]],
    ];
    for (const [pos, sc, rot] of QUIFF) {
      const q = add(head, new THREE.SphereGeometry(1, 32, 20), M.hair, pos, rot);
      q.scale.set(...sc);
    }

    // Arms: shoulders → elbows → hands on the keyboard
    const upperL = limb(body, 0.078, M.hoodie);
    const upperR = limb(body, 0.078, M.hoodie);
    const foreL = limb(body, 0.068, M.hoodie);
    const foreR = limb(body, 0.068, M.hoodie);
    const handL = add(body, new THREE.SphereGeometry(0.058, 16, 12), M.skin, [0.15, baseTop + 0.07, 0.35]);
    const handR = add(body, new THREE.SphereGeometry(0.058, 16, 12), M.skin, [-0.15, baseTop + 0.07, 0.35]);
    handL.scale.set(1, 0.7, 1.2);
    handR.scale.set(1, 0.7, 1.2);

    // ---------- Dust motes drifting through the light ----------
    const PCOUNT = 70;
    const pGeo = track(new THREE.BufferGeometry());
    const pPos = new Float32Array(PCOUNT * 3);
    const pSeed = Array.from({ length: PCOUNT }, () => [Math.random() * 2.8 - 1.4, Math.random() * 2.4, Math.random() * 2.8 - 1.4, 0.05 + Math.random() * 0.12]);
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const points = new THREE.Points(
      pGeo,
      track(new THREE.PointsMaterial({ color: "#c4b5fd", size: 0.028, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending }))
    );
    scene.add(points);

    // ---------- Portrait: hide the room and props, light the face from the front ----------
    const portrait = variant === "portrait";
    if (portrait) {
      scene.children.forEach((c) => {
        if (c !== body && !(c as THREE.Light).isLight) c.visible = false;
      });
      const faceLight = new THREE.PointLight("#ffe7d1", 1.8, 4.5, 1.4);
      faceLight.position.set(0.7, 1.95, 1.5);
      scene.add(faceLight);
      const backLight = new THREE.PointLight("#a855f7", 2.2, 3.2, 1.4);
      backLight.position.set(-0.7, 2.1, -1.0);
      scene.add(backLight);
    }

    // ---------- Interaction ----------
    let mouseX = 0;
    let mouseY = 0;
    const onPointer = (e: PointerEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reduce) window.addEventListener("pointermove", onPointer, { passive: true });
    // Drag to look around the room (horizontal drags; vertical swipes still scroll the page).
    let dragAz = 0;
    let dragEl = 0;
    let vel = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const canvas = renderer.domElement;
    canvas.style.touchAction = "pan-y";
    canvas.style.cursor = portrait ? "default" : "grab";
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      vel = -dx * 0.006;
      dragAz = Math.max(-0.32, Math.min(0.55, dragAz + vel));
      dragEl = Math.max(-0.16, Math.min(0.2, dragEl + dy * 0.003));
      if (reduce) requestAnimationFrame(frame);
    };
    const onUp = () => {
      dragging = false;
      canvas.style.cursor = "grab";
    };
    if (!portrait) {
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointercancel", onUp);
    }

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let yaw = 0;
    let pitch = 0;
    let raf = 0;
    let running = false;
    const pinWorld = new THREE.Vector3();
    const headPos = new THREE.Vector3();
    let lastScreen = 0;
    let lastDraw = 0;

    const frame = (now: number) => {
      const t = reduce ? 1.5 : now / 1000;

      // Camera: slow sway + pointer parallax around the desk.
      if (!dragging && Math.abs(vel) > 0.0001) {
        vel *= 0.92;
        dragAz = Math.max(-0.32, Math.min(0.55, dragAz + vel));
      }
      let az = 0.62 + (reduce ? 0 : Math.sin(t * 0.25) * 0.07) + mouseX * 0.08 + dragAz;
      let el = 0.36 + mouseY * 0.03 + dragEl;
      let R = 10.4;
      if (portrait) {
        // Head-and-shoulders framing, drifting gently with the pointer.
        az = 0.22 + (reduce ? 0 : Math.sin(t * 0.3) * 0.04) + mouseX * 0.1;
        el = 0.1 + mouseY * 0.04;
        R = 3.3;
        target.set(0, 1.6, -0.12);
      }
      camera.position.set(target.x + Math.sin(az) * Math.cos(el) * R, target.y + Math.sin(el) * R, target.z + Math.cos(az) * Math.cos(el) * R);
      camera.lookAt(target);

      // Breathing + a slight lean into the work.
      const breath = Math.sin(t * 1.6) * 0.012;
      torso.scale.set(1 + breath * 0.5, 1 + breath, 1 + breath * 0.5);
      // Head: look at the highlighted object, else follow the pointer; small nod while reading.
      const focus = focusRef?.current ?? null;
      // In the portrait he looks out at the viewer and follows the pointer.
      let wantYaw = portrait ? 0.2 + mouseX * 0.45 : mouseX * 0.35;
      let wantPitch = portrait ? -0.12 + mouseY * 0.1 : 0;
      if (focus !== null) {
        head.getWorldPosition(headPos);
        const pp = focus === 3 ? orb.position : new THREE.Vector3(...PINS[focus]);
        wantYaw = Math.max(-1.1, Math.min(1.1, Math.atan2(pp.x - headPos.x, Math.max(0.15, pp.z - headPos.z))));
        wantPitch = -Math.max(-0.35, Math.min(0.35, Math.atan2(pp.y - headPos.y, Math.hypot(pp.x - headPos.x, pp.z - headPos.z)))) * 0.7;
      }
      yaw += (wantYaw - yaw) * 0.07;
      pitch += (wantPitch - pitch) * 0.07;
      head.rotation.set(0.08 + pitch + Math.sin(t * 1.3) * 0.03, yaw, Math.sin(t * 0.7) * 0.02);

      const shL: V3 = [0.29, 1.34, -0.24];
      const shR: V3 = [-0.29, 1.34, -0.24];
      if (portrait) {
        // Arms crossed over the chest.
        const elL: V3 = [0.3, 1.02 + breath, -0.04];
        const elR: V3 = [-0.3, 1.0 + breath, -0.02];
        const hl: V3 = [-0.2, 1.16 + breath, 0.02];
        const hr: V3 = [0.2, 1.1 + breath, 0.06];
        upperL(shL, elL);
        upperR(shR, elR);
        foreL(elL, hl);
        foreR(elR, hr);
        handL.position.set(...hl);
        handR.position.set(...hr);
      } else {
        // Typing: hands tap alternately; elbows follow.
        const tapL = reduce ? 0 : Math.max(0, Math.sin(t * 13)) * 0.02;
        const tapR = reduce ? 0 : Math.max(0, Math.sin(t * 13 + 2.2)) * 0.02;
        const hl: V3 = [0.14 + Math.sin(t * 3.1) * 0.02, baseTop + 0.07 + tapL, 0.34];
        const hr: V3 = [-0.14 + Math.sin(t * 2.7) * 0.02, baseTop + 0.07 + tapR, 0.34];
        handL.position.set(...hl);
        handR.position.set(...hr);
        const elL: V3 = [0.33, 1.05 + breath, -0.02];
        const elR: V3 = [-0.33, 1.05 + breath, -0.02];
        upperL(shL, elL);
        upperR(shR, elR);
        foreL(elL, [hl[0], hl[1] + 0.01, hl[2] - 0.04]);
        foreR(elR, [hr[0], hr[1] + 0.01, hr[2] - 0.04]);
      }

      // Screen code (≈8 fps is plenty), lamp flicker, steam, glyphs, particles.
      if (!reduce && now - lastDraw > 120) {
        lastDraw = now;
        drawScreen(t);
        drawWall(t);
      }
      screenLight.intensity = 2 + Math.sin(t * 5) * 0.15;
      steam.forEach(({ s, phase }) => {
        const k = (t * 0.35 + phase) % 1;
        s.position.set(Math.sin(k * 9 + phase * 6) * 0.03, 0.14 + k * 0.4, 0);
        s.scale.setScalar(0.6 + k * 1.6);
        (s.material as THREE.MeshBasicMaterial).opacity = 0.28 * (1 - k);
      });
      // Room life: rain, the AI orb, rack LEDs, the wall screen, focus halos.
      rain.tex.offset.y = (t * 1.4) % 1;
      orb.position.y = 1.52 + Math.sin(t * 1.2) * 0.05;
      orbWire.rotation.set(t * 0.3, t * 0.45, 0);
      ring1.rotation.z = t * 0.8;
      ring2.rotation.x = 0.4 + t * 0.6;
      (orbHalo.material as THREE.SpriteMaterial).opacity = 0.45 + Math.sin(t * 2) * 0.12;
      leds.forEach(({ m, phase }) => (m.visible = Math.sin(t * 3 + phase * 2.3) > -0.35));
      focusHalos.forEach((h, i) => {
        h.k += ((focus === i ? 1 : 0) - h.k) * 0.12;
        const m = h.sp.material as THREE.SpriteMaterial;
        m.opacity = h.k * (0.75 + Math.sin(t * 5) * 0.1);
        const sc = 0.55 + h.k * 0.35;
        h.sp.scale.set(sc, sc, 1);
        if (i === 3) h.sp.position.copy(orb.position);
      });
      for (let i = 0; i < PCOUNT; i++) {
        const [x, y0, z, sp] = pSeed[i];
        pPos[i * 3] = x + Math.sin(t * 0.4 + i) * 0.08;
        pPos[i * 3 + 1] = 0.1 + ((y0 + t * sp) % 2.3);
        pPos[i * 3 + 2] = z + Math.cos(t * 0.3 + i) * 0.06;
      }
      pGeo.attributes.position.needsUpdate = true;
      (edge.material as THREE.MeshBasicMaterial).opacity = 0.45 + Math.sin(t * 1.4) * 0.15;

      renderer.render(scene, camera);

      // Report where each fact-object sits on screen (for the label connectors).
      if (onAnchors && now - lastScreen > 30) {
        lastScreen = now;
        onAnchors(
          PINS.map((pp, i) => {
            if (i === 3) pinWorld.copy(orb.position);
            else pinWorld.set(...pp);
            pinWorld.project(camera);
            return { x: ((pinWorld.x + 1) / 2) * mount.clientWidth, y: ((1 - pinWorld.y) / 2) * mount.clientHeight };
          })
        );
      }

      if (running && !reduce) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.05 });
    io.observe(mount);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      if (!portrait) canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onAnchors, focusRef, variant]);

  return <div ref={mountRef} className="absolute inset-0" aria-label={variant === "portrait" ? "3D portrait of Arjun" : "3D studio room — drag to look around"} />;
}
