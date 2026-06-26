// ============================================================
// viewer3d/viewer.js — Three.js scene, renderer, camera,
//                      lighting, and animation loop
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

/* global THREE */

import { attachControls } from "./controls.js";

/**
 * Initialises a Three.js scene on the given canvas element and
 * returns a controller object.
 *
 * @param {HTMLCanvasElement} canvas
 * @returns {{
 *   setModel:   (group: THREE.Group|null) => void,
 *   resetView:  () => void,
 *   dispose:    () => void,
 * }}
 */
export function initViewer(canvas) {
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;

  // ── Renderer ─────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ── Scene ─────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1e17);
  scene.fog = new THREE.Fog(0x1a1e17, 18, 32);

  // ── Camera ───────────────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
  camera.position.set(5, 5, 7);
  camera.lookAt(0, 0, 0);

  // ── Lighting ─────────────────────────────────────────────────
  const ambient = new THREE.AmbientLight(0xffeedd, 0.65);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xfff4e0, 1.1);
  sun.position.set(8, 14, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far  = 40;
  sun.shadow.camera.left   = -8;
  sun.shadow.camera.right  =  8;
  sun.shadow.camera.top    =  8;
  sun.shadow.camera.bottom = -8;
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0xc0d8ff, 0.28);
  fill.position.set(-6, 4, -4);
  scene.add(fill);

  // ── Ground plane ─────────────────────────────────────────────
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 24),
    new THREE.MeshLambertMaterial({ color: 0x2d3d28 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // ── Grid ─────────────────────────────────────────────────────
  const grid = new THREE.GridHelper(20, 20, 0x3d5030, 0x3d5030);
  grid.material.opacity = 0.3;
  grid.material.transparent = true;
  scene.add(grid);

  // ── Orbital controls ─────────────────────────────────────────
  const ctrl = attachControls(canvas, camera);
  ctrl.updateCamera();

  // ── Model management ─────────────────────────────────────────
  let modelGroup = null;

  function setModel(group) {
    if (modelGroup) scene.remove(modelGroup);
    modelGroup = group;
    if (group) scene.add(group);
  }

  // ── Animation loop ───────────────────────────────────────────
  let animId;

  function animate() {
    animId = requestAnimationFrame(animate);
    // Subtle auto-rotate when the user is not dragging
    if (!ctrl.isDragging()) {
      ctrl.theta += 0.003;
      ctrl.updateCamera();
    }
    renderer.render(scene, camera);
  }

  animate();

  // ── Public API ───────────────────────────────────────────────
  return {
    setModel,

    zoomIn() {
      ctrl.radius = Math.max(4, ctrl.radius - 1.2);
      ctrl.updateCamera();
    },

    zoomOut() {
      ctrl.radius = Math.min(16, ctrl.radius + 1.2);
      ctrl.updateCamera();
    },

    resetView() {
      ctrl.phi    = 0.6;
      ctrl.theta  = 0.5;
      ctrl.radius = 9;
      ctrl.updateCamera();
    },

    dispose() {
      cancelAnimationFrame(animId);
      renderer.dispose();
    },
  };
}
