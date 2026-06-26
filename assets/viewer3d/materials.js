// ============================================================
// viewer3d/materials.js — All Three.js MeshLambertMaterial
//                         definitions used by the 3D models
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

/* global THREE */

/**
 * Shared material palette.
 * All materials use MeshLambertMaterial for lightweight
 * diffuse shading without specular highlights.
 */
export const MAT = {
  roof:       new THREE.MeshLambertMaterial({ color: 0x8b3a10 }),
  roofAlt:    new THREE.MeshLambertMaterial({ color: 0xa04018 }),
  wall:       new THREE.MeshLambertMaterial({ color: 0xdec898 }),
  wallDark:   new THREE.MeshLambertMaterial({ color: 0xc4a870 }),
  stone:      new THREE.MeshLambertMaterial({ color: 0xb0956a }),
  stoneDark:  new THREE.MeshLambertMaterial({ color: 0x8a6a40 }),
  wood:       new THREE.MeshLambertMaterial({ color: 0x7a4e28 }),
  ground2:    new THREE.MeshLambertMaterial({ color: 0xc8b070 }),
  modern:     new THREE.MeshLambertMaterial({ color: 0xc0bab0 }),
  modernRoof: new THREE.MeshLambertMaterial({ color: 0x888480 }),
};
