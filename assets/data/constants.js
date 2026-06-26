// ============================================================
// data/constants.js — App-wide constants, colours, enums,
//                     and default values
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

// ── Era identifiers ──────────────────────────────────────────
export const ERA_HISTORIC = 1600;
export const ERA_MODERN   = 2025;

// ── Timeline slider bounds ───────────────────────────────────
export const YEAR_MIN  = 1600;
export const YEAR_MAX  = 2025;
export const YEAR_STEP = 5;

/** Year at/above which the "modern" era is active */
export const MODERN_THRESHOLD = 1900;

// ── Map defaults ─────────────────────────────────────────────
export const MAP_CENTER = [-7.8312, 110.4020];
export const MAP_ZOOM   = 16;

// ── Layer colours (matches sidebar swatches) ─────────────────
export const LAYER_COLORS = {
  heritage:   "#8a2a1a",
  buildings:  "#8a5c0a",
  rivers:     "#1a4a7a",
  royal:      "#5a2a0a",
  settlement: "#3d6614",
  boundary:   "#6b5a3a",
};

// ── Pin / marker colours ─────────────────────────────────────
export const PIN_GREEN = "#2d5a0e";
export const PIN_RED   = "#8a2a1a";

// ── Basemap tile URLs ─────────────────────────────────────────

/** Modern era — OpenStreetMap standard */
export const TILE_OSM =
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

/**
 * Historic era — CartoDB Voyager No Labels
 * Tampilan bersih, warna netral/sepia, gratis tanpa API key.
 * Alternatif terbaik pengganti Stamen Watercolor untuk GitHub Pages.
 */
export const TILE_STAMEN_WATERCOLOR =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png";

/**
 * Historic era label overlay — CartoDB Voyager Labels Only
 * Menambahkan label jalan/nama tempat di atas basemap sepia.
 */
export const TILE_STAMEN_TONER_LITE =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png";

// ── Basemap attributions ──────────────────────────────────────
export const ATTR_OSM =
  "© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors";

export const ATTR_STAMEN =
  "© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors © <a href='https://carto.com/attributions'>CARTO</a>";
