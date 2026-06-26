// ============================================================
// core/app.js — Application initialisation
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

import { initData }            from "./dataManager.js";
import { initRenderer }        from "./renderer.js";
import { initSidebar }         from "../ui/sidebar.js";
import { initSearch }          from "../ui/search.js";
import { initTimeline }        from "../map/timeline.js";
import { initEventHandlers }   from "../ui/eventHandler.js";
import { initTopbar }          from "../ui/topbar.js";
import { setYear }             from "./state.js";
import "../map/markers.js"; // Import to register event listeners

/**
 * Bootstraps the entire application asynchronously.
 */
export async function initApp() {
  // 1. Initialize core renderer (subscribes to events)
  initRenderer();

  // 2. Load all asynchronous data (locations.json, geojson layers)
  await initData();

  // 3. Initialize UI Components
  initSidebar();
  initSearch();
  initTimeline();
  
  // 4. Initialize global event listeners (DOM events)
  initEventHandlers();
  
  // 5. Initialize topbar
  initTopbar();

  // 6. Trigger initial timeline sync
  setYear(1600);
}
