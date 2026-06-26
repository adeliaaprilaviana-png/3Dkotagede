// ============================================================
// core/state.js — Global application state
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

import { emit, EVENTS } from "./eventManager.js";

/**
 * Central state object.
 */
const state = {
  year: 1600,
  active: null,
  searchQuery: "",
  locations: [],
  layers: {
    heritage:   { on: true, lf: null },
    buildings:  { on: true, lf: null },
    rivers:     { on: true, lf: null },
    royal:      { on: true, lf: null },
    settlement: { on: true, lf: null },
    boundary:   { on: true, lf: null },
  },
};

export const getState = () => state;

// ── State Setters (Actions) ──────────────────────────────────

export function setYear(y) {
  if (state.year === y) return;
  state.year = y;
  emit(EVENTS.TIMELINE_CHANGE, { year: y });
  emit(EVENTS.STATE_CHANGE, state);
}

export function setActiveLocation(id, flyTo = false) {
  if (state.active === id) return;
  state.active = id;
  const loc = state.locations.find(l => l.id === id);
  emit(EVENTS.LOCATION_SELECT, { id, loc, flyTo });
  emit(EVENTS.STATE_CHANGE, state);
}

export function toggleLayer(layerId) {
  const s = state.layers[layerId];
  if (!s) return;
  setLayerState(layerId, !s.on);
}

export function setLayerState(layerId, isOn) {
  const s = state.layers[layerId];
  if (!s || s.on === isOn) return;
  s.on = isOn;
  emit(EVENTS.LAYER_TOGGLE, { layerId, on: isOn });
  emit(EVENTS.STATE_CHANGE, state);
}

export function setLayerInstance(layerId, lfInstance) {
  if (state.layers[layerId]) {
    state.layers[layerId].lf = lfInstance;
  }
}

export function setLocations(data) {
  state.locations = data;
  emit(EVENTS.DATA_LOADED, { type: 'locations', data });
}
