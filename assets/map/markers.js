// ============================================================
// map/markers.js — Marker icons, popups, and main loc markers
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

import { map }      from "./map.js";
import { PIN_GREEN } from "../data/constants.js";
import { isModern } from "../core/helpers.js";
import { setActiveLocation } from "../core/state.js";
import { on, EVENTS } from "../core/eventManager.js";

// ── Plain SVG pin (used by heritage GeoJSON layer) ────────────

export function pinIcon(color) {
  return L.divIcon({
    className: "",
    html: `<svg width="22" height="30" viewBox="0 0 22 30" xmlns="http://www.w3.org/2000/svg">
      <filter id="ps" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="${color}" flood-opacity="0.45"/>
      </filter>
      <path d="M11 0C5 0 0 5 0 11c0 8 11 19 11 19S22 19 22 11C22 5 17 0 11 0z"
            fill="${color}" filter="url(#ps)"/>
      <circle cx="11" cy="11" r="5" fill="rgba(255,255,255,.92)"/>
    </svg>`,
    iconSize:    [22, 30],
    iconAnchor:  [11, 30],
    popupAnchor: [0, -32],
  });
}

// ── Emoji bubble pin (used for main location markers) ─────────

/**
 * Creates a circular emoji bubble marker with color ring and drop shadow.
 * @param {string} emoji  — e.g. "🏘", "⛩", "🪦"
 * @param {string} color  — hex accent colour for the ring
 * @param {boolean} active — if true, adds pulse ring
 */
export function emojiPinIcon(emoji, color, active = false) {
  const pulse = active
    ? `<span class="mpin-pulse" style="--pc:${color}"></span>`
    : '';
  return L.divIcon({
    className: "",
    html: `
      <div class="mpin-wrap ${active ? 'mpin-active' : ''}" style="--mc:${color}">
        ${pulse}
        <div class="mpin-bubble">
          <span class="mpin-emoji">${emoji}</span>
        </div>
        <div class="mpin-tail" style="border-top-color:${color}"></div>
      </div>`,
    iconSize:    [40, 50],
    iconAnchor:  [20, 50],
    popupAnchor: [0, -54],
  });
}

// ── Main location markers ─────────────────────────────────────

export const locMarkers = {};

/**
 * Creates one emoji marker for every entry in locations.
 * Called automatically when locations data is loaded.
 */
on(EVENTS.DATA_LOADED, ({ type, data }) => {
  if (type === 'locations') {
    data.forEach(loc => {
      const icon = emojiPinIcon(loc.icon || '📍', PIN_GREEN);
      const m = L.marker([loc.lat, loc.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div class="lp-wrap">
            <div class="lp-color-bar" style="background:${PIN_GREEN}"></div>
            <div class="lp-content">
              <div class="lp-icon-row">
                <span class="lp-dot" style="background:${PIN_GREEN};box-shadow:0 0 6px ${PIN_GREEN}88"></span>
                <span class="lp-icon-emoji">${loc.icon || ''}</span>
              </div>
              <div class="lp-title">${loc.name}</div>
              <div class="lp-sub">${isModern() ? loc.era2025 : loc.era1600}</div>
            </div>
          </div>`,
          { maxWidth: 240 }
        );
      m.on("click", () => setActiveLocation(loc.id, false));
      locMarkers[loc.id] = m;
    });
  }
});

/**
 * Updates a single marker's popup content to reflect the current era (year).
 * @param {Object} loc — location object
 */
export function updateMarkerPopup(loc) {
  const m = locMarkers[loc.id];
  if (m) {
    m.getPopup()?.setContent(
      `<div class="lp-wrap">
        <div class="lp-color-bar" style="background:${PIN_GREEN}"></div>
        <div class="lp-content">
          <div class="lp-icon-row">
            <span class="lp-dot" style="background:${PIN_GREEN};box-shadow:0 0 6px ${PIN_GREEN}88"></span>
            <span class="lp-icon-emoji">${loc.icon || ''}</span>
          </div>
          <div class="lp-title">${loc.name}</div>
          <div class="lp-sub">${isModern() ? loc.era2025 : loc.era1600}</div>
        </div>
      </div>`
    );
  }
}

/**
 * Switches a marker to "active" style (pulse ring) or back to normal.
 * @param {string}  locId
 * @param {Object}  loc
 * @param {boolean} active
 */
export function setMarkerActive(locId, loc, active) {
  const m = locMarkers[locId];
  if (!m) return;
  m.setIcon(emojiPinIcon(loc.icon || '📍', PIN_GREEN, active));
}
