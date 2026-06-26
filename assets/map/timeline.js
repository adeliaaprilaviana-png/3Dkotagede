// ============================================================
// map/timeline.js — Timeline UI and era logic
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

import { on, EVENTS }     from "../core/eventManager.js";
import { setLayerState }  from "../core/state.js";
import { isModern }       from "../core/helpers.js";
import { switchBasemap }  from "./basemap.js";

/**
 * Initializes timeline listeners.
 */
export function initTimeline() {
  on(EVENTS.TIMELINE_CHANGE, onTimelineChange);
}

function onTimelineChange({ year }) {
  const modern = isModern();

  // Update Era Buttons Active State
  document.querySelectorAll(".era-btn").forEach(b =>
    b.classList.toggle("active", +b.dataset.era === (modern ? 2025 : 1600))
  );

  // Update Year Chip & Slider Value (in case it was changed via buttons instead of slider)
  document.getElementById("yrChip").textContent = year;
  document.getElementById("slider").value = year;

  // Toggle historic vs modern layers
  setLayerState("royal",      !modern);
  setLayerState("settlement", !modern);
  setLayerState("boundary",   !modern);

  setLayerState("heritage",   modern);
  setLayerState("buildings",  modern);
  setLayerState("rivers",     modern);

  // Basemap switch
  switchBasemap(modern);

  const lbl = document.getElementById("basemapLabel");
  if (lbl) lbl.textContent = modern
    ? "🗺 OpenStreetMap 2025"
    : "🗺 Peta Historis (Stamen Watercolor)";
}
