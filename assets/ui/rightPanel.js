// ============================================================
// ui/rightPanel.js — Renders the right info panel
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

import { isModern }    from "../core/helpers.js";
import { initViewer }  from "../viewer3d/viewer.js";
import { buildModel }  from "../viewer3d/models.js";
import { map }         from "../map/map.js";
import { setYear }     from "../core/state.js";

let threeCtx = null;

/**
 * Renders the full right-panel content for a given location.
 *
 * @param {Object} loc — location object from locations.json
 */
export function renderPanel(loc) {
  const modern = isModern();
  const panel  = document.getElementById("rightPanel");

  // Create photo placeholder if no photo is available (or use a colorful box)
  const photoHtml = loc.photo ? `<div class="rp-photo" style="background-image: url('assets/img/${loc.photo}'); background-color: var(--border); height: 180px; background-size: cover; background-position: center; border-radius: 8px; margin-bottom: 16px;"></div>` : '';

  const metaHtml = loc.meta ? Object.entries(loc.meta).map(([k,v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("") : "";
  const refHtml = loc.references ? `<div class="rp-refs"><strong>Referensi:</strong><ul>${loc.references.map(r => `<li>${r}</li>`).join('')}</ul></div>` : '';

  panel.innerHTML = `
    <div class="rp-head">
      <h2>${loc.name}</h2>
      <span class="era-tag ${modern ? "mod" : ""}">${modern ? loc.era2025 : loc.era1600}</span>
      <div style="font-size: 0.85rem; color: var(--text-dim); margin-top: 6px;">Kategori: ${loc.category || '-'}</div>
    </div>
    
    <div class="rp-body">
      ${photoHtml}
      
      <div class="viewer-wrap">
        <canvas id="viewer3d"></canvas>
        <div class="viewer-label">Model 3D · Putar: drag  ·  Zoom: scroll</div>
        <div class="viewer-controls">
          <button class="vc-btn" id="vcZoomIn"  title="Zoom in">＋</button>
          <button class="vc-btn" id="vcZoomOut" title="Zoom out">－</button>
          <button class="vc-btn" id="vcReset"   title="Reset tampilan">⌾</button>
        </div>
      </div>
      
      <p class="info-desc">${modern ? loc.desc2025 : loc.desc1600}</p>
      
      <hr class="divider" />
      <table class="meta-table">
        ${metaHtml}
        <tr><td>Era ditampilkan</td><td>${modern ? "2025" : "1600"}</td></tr>
      </table>
      
      <div class="accuracy-row">
        <span class="accuracy-label">Akurasi rekonstruksi</span>
        <div class="accuracy-bar"><div class="accuracy-fill" style="width:${loc.accuracy || 0}%"></div></div>
        <span class="accuracy-label">${loc.accuracy || 0}%</span>
      </div>
      
      ${refHtml}
    </div>
    
    <div class="rp-foot">
      <button class="btn primary" id="btnFocus">Fokus peta</button>
      <button class="btn" id="btnEra">Era ${modern ? "1600" : "2025"}</button>
    </div>
  `;

  // ── Initialise Three.js viewer ──────────────────────────────
  if (threeCtx) { threeCtx.dispose(); threeCtx = null; }
  const canvas = document.getElementById("viewer3d");
  threeCtx = initViewer(canvas);
  
  // Use placeholder model if loc.model is not recognized
  const modelType = loc.model || 'rumah';
  threeCtx.setModel(buildModel(modelType, modern));

  // ── Button events ───────────────────────────────────────────
  document.getElementById("vcZoomIn") .addEventListener("click", () => threeCtx?.zoomIn());
  document.getElementById("vcZoomOut").addEventListener("click", () => threeCtx?.zoomOut());
  document.getElementById("vcReset")  .addEventListener("click", () => threeCtx?.resetView());

  document.getElementById("btnFocus").addEventListener("click", () => {
    map.flyTo([loc.lat, loc.lng], 18, { duration: 1 });
  });

  document.getElementById("btnEra").addEventListener("click", () => {
    const year = modern ? 1600 : 2025;
    setYear(year);
  });
}
