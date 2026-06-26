// ============================================================
// ui/sidebar.js — Renders the location list in the sidebar
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

import { getState, setActiveLocation } from "../core/state.js";
import { isModern } from "../core/helpers.js";

/**
 * Populates the #locList element with one .loc-item div per location.
 */
export function initSidebar() {
  const locList = document.getElementById("locList");
  const state = getState();
  
  if (!locList) return;
  locList.innerHTML = '';
  
  state.locations.forEach(loc => {
    const el = document.createElement("div");
    el.className = "loc-item";
    el.dataset.id = loc.id;
    el.innerHTML = `
      <span class="loc-icon">${loc.icon}</span>
      <div class="loc-text">
        <span class="loc-name">${loc.name}</span>
        <span class="loc-era">${isModern() ? loc.era2025 : loc.era1600}</span>
      </div>`;
    el.addEventListener("click", () => setActiveLocation(loc.id, true));
    locList.appendChild(el);
  });

  updateLegend();
}

/**
 * Updates the active highlight and era-label text for every
 * .loc-item in the sidebar to match the current state.
 *
 * @param {string|null} activeId — currently selected location id
 */
export function refreshSidebarItems(activeId) {
  const state = getState();
  document.querySelectorAll(".loc-item").forEach(el => {
    el.classList.toggle("active", el.dataset.id === activeId);
    const l = state.locations.find(x => x.id === el.dataset.id);
    if (l) el.querySelector(".loc-era").textContent = isModern() ? l.era2025 : l.era1600;
  });

  updateLegend();
}

/**
 * Updates the layer legend visibility based on the current era.
 */
function updateLegend() {
  const modern = isModern();
  const group1600 = document.getElementById("group1600");
  const group2025 = document.getElementById("group2025");
  
  if (group1600) group1600.style.display = modern ? 'none' : 'block';
  if (group2025) group2025.style.display = modern ? 'block' : 'none';
}
