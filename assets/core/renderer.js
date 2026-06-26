// ============================================================
// core/renderer.js — UI refresh / re-render coordinator
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

import { on, EVENTS }          from "./eventManager.js";
import { getState }            from "./state.js";
import { isModern }            from "./helpers.js";
import { refreshSidebarItems } from "../ui/sidebar.js";
import { renderPanel }         from "../ui/rightPanel.js";
import { updateMarkerPopup }   from "../map/markers.js";

/**
 * Initializes the renderer by subscribing to relevant state events.
 */
export function initRenderer() {
  on(EVENTS.TIMELINE_CHANGE, onTimelineChange);
  on(EVENTS.LOCATION_SELECT, onLocationSelect);
  // DATA_LOADED handled to re-render things if needed
  on(EVENTS.DATA_LOADED, ({ type }) => {
    if (type === 'locations') {
       refreshSidebarItems(getState().active);
    }
  });
}

function onTimelineChange({ year }) {
  const state = getState();
  
  // Refresh sidebar active state and era labels
  refreshSidebarItems(state.active);

  // Re-render right panel if a location is active
  if (state.active) {
    const loc = state.locations.find(l => l.id === state.active);
    if (loc) {
      renderPanel(loc);
    }
  }

  // Update all marker popups
  state.locations.forEach(loc => updateMarkerPopup(loc));
}

function onLocationSelect({ id, loc, flyTo }) {
  // Highlight in sidebar + update era labels
  refreshSidebarItems(id);

  // Remove empty state placeholder if present
  const empty = document.getElementById("emptyState");
  if (empty) empty.remove();

  // Render right panel
  if (loc) {
    renderPanel(loc);
    updateMarkerPopup(loc);
  }
}
