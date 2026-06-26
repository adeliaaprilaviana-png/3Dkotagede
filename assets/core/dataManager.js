// ============================================================
// core/dataManager.js — Asynchronous Data Loading
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

import { setLocations } from "./state.js";
import { initLayers } from "../map/layers.js";

/** Cache for GeoJSON data */
const geojsonCache = {};

/**
 * Fetch locations.json and populate state
 */
export async function loadLocations() {
  try {
    const response = await fetch("assets/data/locations.json");
    const data = await response.json();
    setLocations(data);
    return data;
  } catch (error) {
    console.error("Failed to load locations.json:", error);
    return [];
  }
}

/**
 * Fetch a GeoJSON file and cache it
 * @param {string} name 
 */
export async function loadGeoJSON(name) {
  if (geojsonCache[name]) return geojsonCache[name];
  
  try {
    const response = await fetch(`assets/data/geojson/${name}.geojson`);
    const data = await response.json();
    geojsonCache[name] = data;
    return data;
  } catch (error) {
    console.error(`Failed to load ${name}.geojson:`, error);
    return null;
  }
}

/**
 * Load all necessary map layers data
 */
export async function loadAllLayersData() {
  const layerNames = ["heritage", "buildings", "rivers", "royal", "settlement", "boundary"];
  const layerData = {};
  
  await Promise.all(layerNames.map(async (name) => {
    layerData[name] = await loadGeoJSON(name);
  }));
  
  // Initialize layers with fetched data
  initLayers(layerData);
}

/**
 * Bootstraps all external data
 */
export async function initData() {
  await loadLocations();
  await loadAllLayersData();
}
