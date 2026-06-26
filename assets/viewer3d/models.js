// ============================================================
// viewer3d/models.js — Procedural 3D model builders
//                      (box, pyramid, buildModel)
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

/* global THREE */

import { MAT } from "./materials.js";

// ── Primitive helpers ─────────────────────────────────────────

/**
 * Creates a BoxGeometry mesh with shadow and a given material.
 * @param {number} w   — width
 * @param {number} h   — height
 * @param {number} d   — depth
 * @param {THREE.Material} mat
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {number} [z=0]
 * @returns {THREE.Mesh}
 */
export function box(w, h, d, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/**
 * Creates a ConeGeometry mesh rotated 45° so its four sides
 * align with the cardinal directions (approximates a pyramid
 * or Javanese tajug roof).
 * @param {number} w   — footprint width (max of w/d used for radius)
 * @param {number} h   — height
 * @param {number} d   — footprint depth
 * @param {THREE.Material} mat
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {number} [z=0]
 * @returns {THREE.Mesh}
 */
export function pyramid(w, h, d, mat, x = 0, y = 0, z = 0) {
  const geo = new THREE.ConeGeometry(Math.max(w, d) * 0.72, h, 4);
  geo.rotateY(Math.PI / 4);
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}

// ── Model builder ─────────────────────────────────────────────

/**
 * Assembles a Three.js Group representing the specified building
 * type in either the historic (1600) or modern (2025) style.
 *
 * @param {string}  type   — "masjid" | "makam" | "benteng" | "rumah" | "pasar"
 * @param {boolean} modern — true = 2025 style, false = ca. 1600 style
 * @returns {THREE.Group}
 */
export function buildModel(type, modern) {
  const g = new THREE.Group();

  // ── Masjid Gedhe Mataram ────────────────────────────────────
  if (type === "masjid") {
    if (modern) {
      // Bangunan 2025 — masjid yang sudah dipugar
      g.add(box(3.6, 0.18, 3.6, MAT.stone,   0, 0.09,  0));   // plinth
      g.add(box(3.2, 2.0,  3.2, MAT.wall,    0, 1.18,  0));   // badan
      g.add(box(3.4, 0.14, 3.4, MAT.stone,   0, 2.25,  0));   // cornice
      g.add(pyramid(3.0, 1.2, 3.0, MAT.roof, 0, 2.95,  0));   // atap
      // menara
      g.add(box(0.55, 3.2, 0.55, MAT.wall,  -1.8, 1.6, -1.8));
      g.add(box(0.65, 0.16, 0.65, MAT.stone,-1.8, 3.28,-1.8));
      const minaretCone = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.6, 6), MAT.roof);
      minaretCone.position.set(-1.8, 3.65, -1.8);
      g.add(minaretCone);
      // serambi
      g.add(box(3.2, 1.5, 1.1, MAT.wallDark, 0, 0.83, 2.1));
      g.add(pyramid(3.0, 0.6, 1.0, MAT.roofAlt, 0, 1.65, 2.1));
    } else {
      // Rekonstruksi 1600 — massa lebih sederhana
      g.add(box(3.2, 0.14, 3.2, MAT.stone, 0, 0.07, 0));
      g.add(box(2.8, 1.8,  2.8, MAT.wall,  0, 1.04, 0));
      // atap tajug tumpang (disederhanakan)
      g.add(pyramid(2.6, 1.0, 2.6, MAT.roof,    0, 2.04, 0));
      g.add(pyramid(1.8, 0.8, 1.8, MAT.roofAlt, 0, 2.74, 0));
      g.add(pyramid(1.0, 0.6, 1.0, MAT.roof,    0, 3.34, 0));
      // serambi
      g.add(box(2.8, 1.4, 1.0, MAT.wallDark, 0, 0.77, 1.9));
      g.add(pyramid(2.6, 0.5, 0.9, MAT.roofAlt, 0, 1.52, 1.9));
    }
  }

  // ── Makam Kerajaan ──────────────────────────────────────────
  else if (type === "makam") {
    // Cungkup Prabayaksa (utama - limasan)
    g.add(box(4.0, 0.18, 4.0, MAT.stone,   0, 0.09, 0)); // platform/plinth
    g.add(box(3.2, 1.6,  3.2, MAT.wall,    0, 0.98, 0)); // badan
    g.add(pyramid(3.0, 1.0, 3.0, MAT.roof, 0, 1.98, 0)); // atap limasan
    // Cungkup Witana (kiri - sedikit lebih kecil)
    g.add(box(2.2, 0.12, 2.2, MAT.stone,  -3.2, 0.06, 0));
    g.add(box(1.8, 1.3,  1.8, MAT.wall,   -3.2, 0.77, 0));
    g.add(pyramid(1.7, 0.8, 1.7, MAT.roof,-3.2, 1.47, 0));
    // Cungkup Tajug (kanan - atap tajuk)
    g.add(box(2.0, 0.12, 2.0, MAT.stone,   3.2, 0.06, 0));
    g.add(box(1.6, 1.2,  1.6, MAT.wall,    3.2, 0.76, 0));
    g.add(pyramid(1.5, 1.0, 1.5, MAT.roofAlt, 3.2, 1.56, 0));  // lebih runcing = tajuk
    g.add(pyramid(0.9, 0.6, 0.9, MAT.roof, 3.2, 2.26, 0));    // puncak tajuk susun 2
    // Jirat (makam kecil di dalam Prabayaksa)
    for (let i = -1; i <= 1; i++) {
      g.add(box(0.45, 0.25, 1.0, MAT.stone, i * 0.75, 0.21, 0));
      g.add(box(0.07, 0.42, 0.07, MAT.stoneDark, i*0.75 - 0.42, 0.43, 0));
      g.add(box(0.07, 0.42, 0.07, MAT.stoneDark, i*0.75 + 0.42, 0.43, 0));
    }
    // Gapura Paduraksa menuju makam (sisi depan)
    g.add(box(0.28, 2.0, 0.22, MAT.stoneDark, -0.85, 1.18, 2.6));  // tiang kiri
    g.add(box(0.28, 2.0, 0.22, MAT.stoneDark,  0.85, 1.18, 2.6));  // tiang kanan
    g.add(box(2.0,  0.28, 0.22, MAT.stoneDark,  0,   2.28, 2.6));  // balok atas
    g.add(pyramid(1.8, 0.55, 0.3, MAT.roof,     0,   2.70, 2.6));  // atap gapura
    // Tembok kelir
    g.add(box(2.6, 1.4, 0.16, MAT.stoneDark, 0, 0.88, 3.4));
    // Sendang Seliran (kiri bawah - kolam)
    g.add(box(2.0, 0.18, 2.0, MAT.stone,  -3.2, 0.09, 2.8));  // platform sendang
    g.add(box(2.0, 0.10, 0.20, MAT.stoneDark, -3.2, 0.32, 1.85)); // tembok depan
    g.add(box(0.20, 0.32, 2.0, MAT.stoneDark, -4.15, 0.25, 2.8)); // tembok sisi
    g.add(box(0.20, 0.32, 2.0, MAT.stoneDark, -2.25, 0.25, 2.8)); // tembok sisi
    g.add(box(8.0, 0.12, 8.0, MAT.ground2, 0, 0.06, 0));           // halaman
  }

  // ── Benteng Cepuri ──────────────────────────────────────────
  else if (type === "benteng") {
    // Fragmen tembok
    const segments = [
      [4.5, 0, 0], [-2.5, 0, 1.8], [1.0, 0, -2.0]
    ];
    segments.forEach(([x, , z], i) => {
      const rot = i * 0.4;
      const w = box(2.8, 1.6, 0.45, MAT.stoneDark, x, 0.9, z);
      w.rotation.y = rot;
      g.add(w);
      // merlons (puncak tembok)
      for (let j = -1; j <= 1; j++) {
        const m2 = box(0.36, 0.4, 0.5, MAT.stone);
        m2.position.set(x + j * 0.9, 1.9, z);
        m2.rotation.y = rot;
        g.add(m2);
      }
    });
    g.add(box(8, 0.12, 8, MAT.ground2, 0, 0.06, 0));
  }

  // ── Rumah Tradisional ───────────────────────────────────────
  else if (type === "rumah") {
    if (modern) {
      // Rumah modern
      g.add(box(3.0, 1.8, 3.0, MAT.modern, 0, 0.9, 0));
      g.add(pyramid(3.0, 0.9, 3.0, MAT.modernRoof, 0, 1.98, 0));
    } else {
      // Joglo sederhana
      g.add(box(0.14, 1.4, 0.14, MAT.wood, -1.1, 0.7,  1.1));
      g.add(box(0.14, 1.4, 0.14, MAT.wood,  1.1, 0.7,  1.1));
      g.add(box(0.14, 1.4, 0.14, MAT.wood, -1.1, 0.7, -1.1));
      g.add(box(0.14, 1.4, 0.14, MAT.wood,  1.1, 0.7, -1.1));
      // atap limasan
      g.add(pyramid(2.8, 1.2, 2.8, MAT.roof,    0, 1.98, 0));
      g.add(pyramid(1.6, 0.7, 1.6, MAT.roofAlt, 0, 2.78, 0));
      g.add(box(3.0, 0.10, 3.0, MAT.wood, 0, 1.45, 0)); // floor beam
    }
  }

  // ── Pasar Kotagede ──────────────────────────────────────────
  else if (type === "pasar") {
    if (modern) {
      g.add(box(5.5, 0.14, 3.5, MAT.stone, 0, 0.07, 0));
      g.add(box(5.2, 1.6,  3.2, MAT.modern, 0, 0.94, 0));
      g.add(box(5.4, 0.18, 3.4, MAT.modernRoof, 0, 1.79, 0));
    } else {
      // Los pasar — struktur terbuka
      g.add(box(5.5, 0.14, 3.0, MAT.ground2, 0, 0.07, 0));
      // kolom
      [[-2.2,-1.1],[-2.2,0],[-2.2,1.1],[2.2,-1.1],[2.2,0],[2.2,1.1]].forEach(([x,z]) => {
        g.add(box(0.14, 1.8, 0.14, MAT.wood, x, 0.9, z));
      });
      // atap pelana
      g.add(box(5.2, 0.12, 3.0, MAT.roofAlt, 0, 1.82, 0));
      g.add(box(5.2, 0.12, 0.20, MAT.roof, 0, 1.98, -1.25));
      g.add(box(5.2, 0.12, 0.20, MAT.roof, 0, 1.98,  1.25));
    }
  }

  // ── Gapura Paduraksa ────────────────────────────────────────
  else if (type === "paduraksa") {
    // Pondasi / plinth memanjang
    g.add(box(5.0, 0.18, 1.0, MAT.stone, 0, 0.09, 0));
    // Tiang kiri & kanan (tebal, bata merah)
    g.add(box(1.2, 3.2, 0.9, MAT.stoneDark, -1.8, 1.78, 0));
    g.add(box(1.2, 3.2, 0.9, MAT.stoneDark,  1.8, 1.78, 0));
    // Balok ambang atas
    g.add(box(4.8, 0.45, 0.9, MAT.stoneDark, 0, 3.42, 0));
    // Atap gapura tumpang (lapis 1 - lebar)
    g.add(pyramid(4.4, 0.7, 1.0, MAT.roof,    0, 3.87, 0));
    // Lapis 2 - lebih kecil & runcing
    g.add(box(2.4, 0.28, 0.7, MAT.stoneDark,  0, 4.24, 0));
    g.add(pyramid(2.2, 0.9, 0.8, MAT.roofAlt, 0, 4.69, 0));
    // Puncak / mustaka
    g.add(box(0.3, 0.4, 0.3, MAT.stoneDark,   0, 5.33, 0));
    // Ornamen kala di atas ambang (disederhanakan sbg box tebal)
    g.add(box(0.6, 0.5, 0.4, MAT.wallDark,    0, 3.72, 0));
    // Pintu kayu (kupu tarung)
    g.add(box(0.55, 2.4, 0.08, MAT.wood, -0.3, 1.38, -0.42));
    g.add(box(0.55, 2.4, 0.08, MAT.wood,  0.3, 1.38, -0.42));
    // Tembok kelir di belakang gapura
    g.add(box(3.2, 1.6, 0.22, MAT.stoneDark, 0, 0.98, 1.8));
    // Halaman
    g.add(box(9.0, 0.10, 6.0, MAT.ground2, 0, 0.05, 1.5));
  }

  // ── Sendang Seliran ─────────────────────────────────────────
  else if (type === "sendang") {
    // Halaman batu
    g.add(box(7.0, 0.14, 5.5, MAT.stone, 0, 0.07, 0));

    // ── Sendang Kakung (kiri) ──
    g.add(box(2.5, 0.60, 2.5, MAT.stoneDark, -2.0, 0.44, 0));  // bak luar
    g.add(box(2.1, 0.50, 2.1, MAT.ground2,   -2.0, 0.53, 0));  // air (biru-hijau terang)
    // tembok tepi kolam kakung
    g.add(box(2.5, 0.30, 0.18, MAT.stoneDark, -2.0, 0.89,  1.16));
    g.add(box(2.5, 0.30, 0.18, MAT.stoneDark, -2.0, 0.89, -1.16));
    g.add(box(0.18, 0.30, 2.5, MAT.stoneDark, -3.16, 0.89, 0));
    g.add(box(0.18, 0.30, 2.5, MAT.stoneDark, -0.84, 0.89, 0));

    // ── Sendang Putri (kanan) ──
    g.add(box(2.5, 0.60, 2.5, MAT.stoneDark,  2.0, 0.44, 0));
    g.add(box(2.1, 0.50, 2.1, MAT.ground2,    2.0, 0.53, 0));
    g.add(box(2.5, 0.30, 0.18, MAT.stoneDark,  2.0, 0.89,  1.16));
    g.add(box(2.5, 0.30, 0.18, MAT.stoneDark,  2.0, 0.89, -1.16));
    g.add(box(0.18, 0.30, 2.5, MAT.stoneDark,  0.84, 0.89, 0));
    g.add(box(0.18, 0.30, 2.5, MAT.stoneDark,  3.16, 0.89, 0));

    // Divider tengah
    g.add(box(0.24, 1.1, 2.6, MAT.wall, 0, 0.69, 0));

    // Pohon beringin (batang + kanopi)
    [-3.4, 3.4].forEach(x => {
      g.add(box(0.22, 2.2, 0.22, MAT.wood, x, 1.24, -2.0));
      const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.9, 8, 6),
        new THREE.MeshLambertMaterial({ color: 0x2d5a1a }));
      canopy.position.set(x, 2.9, -2.0);
      canopy.castShadow = true;
      g.add(canopy);
    });
  }

  // ── Sumur Kuno ──────────────────────────────────────────────
  else if (type === "sumur") {
    // Halaman batu
    g.add(box(6.0, 0.14, 6.0, MAT.ground2, 0, 0.07, 0));

    // Dinding sumur melingkar (pakai CylinderGeometry)
    const wellOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(1.0, 1.05, 1.2, 12),
      MAT.stoneDark
    );
    wellOuter.position.set(0, 0.74, 0);
    wellOuter.castShadow = true;
    g.add(wellOuter);

    // Lubang sumur (silinder dalam hitam)
    const wellInner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.75, 0.75, 1.22, 12),
      new THREE.MeshLambertMaterial({ color: 0x111111 })
    );
    wellInner.position.set(0, 0.74, 0);
    g.add(wellInner);

    // Bibir sumur (ring atas)
    const lip = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.12, 6, 12),
      MAT.stone
    );
    lip.rotation.x = Math.PI / 2;
    lip.position.set(0, 1.38, 0);
    lip.castShadow = true;
    g.add(lip);

    // Tiang penyangga timba (kiri-kanan)
    g.add(box(0.14, 1.8, 0.14, MAT.wood, -0.7, 2.04, 0));
    g.add(box(0.14, 1.8, 0.14, MAT.wood,  0.7, 2.04, 0));
    // Palang horizontal
    g.add(box(1.5, 0.12, 0.12, MAT.wood, 0, 2.9, 0));

    // Tali + timba (disederhanakan)
    g.add(box(0.05, 0.8, 0.05, MAT.wood, 0.1, 2.4, 0));  // tali
    g.add(box(0.28, 0.24, 0.28, MAT.stoneDark, 0.1, 1.92, 0));  // ember

    // Lumut/tanaman di sekitar sumur
    [-1.8, 1.8].forEach(x => {
      const moss = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 6, 5),
        new THREE.MeshLambertMaterial({ color: 0x3a6b28 })
      );
      moss.scale.y = 0.5;
      moss.position.set(x, 0.2, 1.6);
      g.add(moss);
    });
  }

  // ── Kampung Pandai Perak ─────────────────────────────────────
  else if (type === "perak") {
    if (modern) {
      // Showroom / toko perak modern
      g.add(box(4.5, 0.14, 3.5, MAT.stone, 0, 0.07, 0));
      g.add(box(4.2, 2.4, 3.2, MAT.modern, 0, 1.34, 0));
      g.add(box(4.4, 0.16, 3.4, MAT.modernRoof, 0, 2.62, 0));
      // Etalase kaca depan
      g.add(box(3.5, 1.4, 0.08, MAT.wall, 0, 0.84, 1.56));
      // Meja display
      g.add(box(2.8, 0.6, 0.7, MAT.wallDark, 0, 0.44, 1.0));
      g.add(box(2.8, 0.06, 0.7, MAT.stoneDark, 0, 0.75, 1.0));
      // Produk perak (benda kecil bersinar)
      for (let i = -1; i <= 1; i++) {
        const silver = new THREE.Mesh(
          new THREE.SphereGeometry(0.10, 8, 6),
          new THREE.MeshLambertMaterial({ color: 0xe8e8e8 })
        );
        silver.position.set(i * 0.7, 0.88, 1.0);
        silver.castShadow = true;
        g.add(silver);
      }
      // Papan nama
      g.add(box(2.0, 0.5, 0.06, MAT.wood, 0, 2.1, 1.62));
    } else {
      // Workshop tradisional — bengkel pengrajin perak
      g.add(box(4.5, 0.14, 3.5, MAT.ground2, 0, 0.07, 0));
      // Kolom kayu jati
      [[-1.8,-1.5],[-1.8,1.5],[1.8,-1.5],[1.8,1.5]].forEach(([x,z]) => {
        g.add(box(0.16, 2.4, 0.16, MAT.wood, x, 1.34, z));
      });
      // Atap limasan kayu
      g.add(pyramid(4.2, 1.0, 3.4, MAT.roof, 0, 2.58, 0));
      // Meja kerja pengrajin
      g.add(box(3.0, 0.7, 0.8, MAT.wood, 0, 0.49, 0.8));
      g.add(box(3.0, 0.06, 0.8, MAT.stoneDark, 0, 0.84, 0.8));
      // Tungku perapian (untuk melebur perak)
      g.add(box(0.7, 0.9, 0.7, MAT.stoneDark, -1.5, 0.59, -1.0));
      g.add(box(0.5, 0.3, 0.5, MAT.roof, -1.5, 1.19, -1.0));  // api
      // Alat kerja kecil di meja
      for (let i = -1; i <= 1; i++) {
        g.add(box(0.08, 0.3, 0.08, MAT.wood, i * 0.7, 0.99, 0.8));  // pukul
        const product = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 6, 5),
          new THREE.MeshLambertMaterial({ color: 0xd4d4d4 })
        );
        product.position.set(i * 0.7 + 0.25, 0.92, 0.8);
        g.add(product);
      }
      // Rak simpan hasil kerajinan
      g.add(box(0.9, 1.6, 0.3, MAT.wood, 1.9, 0.94, -0.8));
      [0.4, 0.9, 1.4].forEach(y => {
        g.add(box(0.85, 0.06, 0.28, MAT.wallDark, 1.9, y, -0.8));
      });
    }
  }

  return g;
}

