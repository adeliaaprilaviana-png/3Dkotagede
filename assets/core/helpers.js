// ============================================================
// core/helpers.js — General utility functions
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

import { getState } from "./state.js";
import { MODERN_THRESHOLD } from "../data/constants.js";

/**
 * Returns true when the current timeline year is in the
 * "modern" era (≥ MODERN_THRESHOLD).
 * @returns {boolean}
 */
export function isModern() {
  return getState().year >= MODERN_THRESHOLD;
}

/**
 * Returns the era label for a given location based on the
 * current timeline year.
 * @param {Object} loc — location object from locations.json
 * @returns {string}
 */
export function getEraLabel(loc) {
  return isModern() ? loc.era2025 : loc.era1600;
}

/**
 * Returns the description for a given location based on the
 * current timeline year.
 * @param {Object} loc — location object from locations.json
 * @returns {string}
 */
export function getDescription(loc) {
  return isModern() ? loc.desc2025 : loc.desc1600;
}
