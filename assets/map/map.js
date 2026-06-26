// ============================================================
// map/map.js — Leaflet map initialisation
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

import { MAP_CENTER, MAP_ZOOM } from "../data/constants.js";

/**
 * Creates and returns the Leaflet map instance.
 * The map is attached to the element with id="map".
 * @returns {L.Map}
 */
export const map = L.map("map", {
  center: MAP_CENTER,
  zoom: MAP_ZOOM,
  zoomControl: true,
});
