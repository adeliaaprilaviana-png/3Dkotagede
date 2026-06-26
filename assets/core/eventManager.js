// ============================================================
// core/eventManager.js — Global Event Bus (Pub/Sub)
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

const listeners = {};

export const EVENTS = {
  STATE_CHANGE: "STATE_CHANGE",
  TIMELINE_CHANGE: "TIMELINE_CHANGE",
  LOCATION_SELECT: "LOCATION_SELECT",
  LAYER_TOGGLE: "LAYER_TOGGLE",
  SEARCH: "SEARCH",
  DATA_LOADED: "DATA_LOADED"
};

/**
 * Subscribe to an event
 * @param {string} eventName 
 * @param {Function} callback 
 */
export function on(eventName, callback) {
  if (!listeners[eventName]) {
    listeners[eventName] = [];
  }
  listeners[eventName].push(callback);
}

/**
 * Unsubscribe from an event
 * @param {string} eventName 
 * @param {Function} callback 
 */
export function off(eventName, callback) {
  if (!listeners[eventName]) return;
  listeners[eventName] = listeners[eventName].filter(cb => cb !== callback);
}

/**
 * Emit an event
 * @param {string} eventName 
 * @param {any} data 
 */
export function emit(eventName, data) {
  if (!listeners[eventName]) return;
  listeners[eventName].forEach(callback => callback(data));
}
