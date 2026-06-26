// ============================================================
// map/basemap.js — Basemap tile layers and switching logic
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

import { map } from "./map.js";
import {
  TILE_OSM,
  TILE_STAMEN_WATERCOLOR,
  TILE_STAMEN_TONER_LITE,
  ATTR_OSM,
  ATTR_STAMEN,
} from "../data/constants.js";

// ── Tile layers ───────────────────────────────────────────────

/** OSM — used for the modern (2025) era */
export const basemapModern = L.tileLayer(TILE_OSM, {
  attribution: ATTR_OSM,
  maxZoom: 19,
  opacity: 1,
});

/** Stamen Watercolor — parchment / antique look for historical era */
export const basemapHistoric = L.tileLayer(TILE_STAMEN_WATERCOLOR, {
  attribution: ATTR_STAMEN,
  maxZoom: 18,
  opacity: 0.92,
});

/** Stamen Toner Lite — label overlay for the historic view */
export const basemapHistoricLabels = L.tileLayer(TILE_STAMEN_TONER_LITE, {
  attribution: "",
  maxZoom: 18,
  opacity: 0.45,
});

// Start with the historic basemap
basemapHistoric.addTo(map);
basemapHistoricLabels.addTo(map);

// ── Switcher ──────────────────────────────────────────────────

/**
 * Switches between the modern (OSM) and historic (Stamen) basemaps.
 * @param {boolean} modern — true → OSM 2025, false → Stamen Historic
 */
export function switchBasemap(modern) {
  if (modern) {
    map.removeLayer(basemapHistoric);
    map.removeLayer(basemapHistoricLabels);
    if (!map.hasLayer(basemapModern)) basemapModern.addTo(map);
  } else {
    if (map.hasLayer(basemapModern)) map.removeLayer(basemapModern);
    if (!map.hasLayer(basemapHistoric))       basemapHistoric.addTo(map);
    if (!map.hasLayer(basemapHistoricLabels)) basemapHistoricLabels.addTo(map);
  }
}
