// ============================================================
// map/layers.js — GeoJSON layer initialization & styling
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

import { map } from "./map.js";
import { setLayerInstance, toggleLayer } from "../core/state.js";
import { on, EVENTS } from "../core/eventManager.js";
import { pinIcon } from "./markers.js";

// Keep references to Leaflet layers
const layerInstances = {};

/**
 * Creates a red pin for heritage locations.
 */
function redPin(color) {
  return pinIcon(color);
}

// ── Hover helpers ─────────────────────────────────────────────
function highlightFeature(e) {
  const layer = e.target;
  layer.setStyle({
    weight:      layer.options._hoverWeight ?? 4,
    fillOpacity: layer.options._hoverFill   ?? 0.45,
    opacity:     1,
  });
  layer.bringToFront();
}
function resetHighlight(e, originalStyle) {
  e.target.setStyle(originalStyle);
}

// ── Popup builder ─────────────────────────────────────────────
function makePopup(props, color, icon) {
  const name  = props.name  || props.id || '—';
  const sub   = props.keterangan || props.deskripsi || props.jenis || props.type || props.periode || '';
  const extra = props.tahun   ? `<span class="lp-badge" style="background:${color}22;color:${color}">📅 ${props.tahun}</span>` :
                props.kondisi ? `<span class="lp-badge" style="background:${color}22;color:${color}">${props.kondisi}</span>` :
                props.abad    ? `<span class="lp-badge" style="background:${color}22;color:${color}">Abad ${props.abad}</span>` :
                props.status  ? `<span class="lp-badge" style="background:${color}22;color:${color}">${props.status}</span>` : '';
  return `
    <div class="lp-wrap">
      <div class="lp-color-bar" style="background:${color}"></div>
      <div class="lp-content">
        <div class="lp-icon-row">
          <span class="lp-dot" style="background:${color};box-shadow:0 0 6px ${color}88"></span>
          <span class="lp-icon-emoji">${icon || ''}</span>
        </div>
        <div class="lp-title">${name}</div>
        ${sub  ? `<div class="lp-sub">${sub}</div>` : ''}
        ${extra}
      </div>
    </div>`;
}

/**
 * Initializes layers with fetched GeoJSON data.
 * @param {Object} layerData - Map of layerName -> GeoJSON object
 */
export function initLayers(layerData) {

  // ── Heritage (points) ──────────────────────────────────────
  if (layerData.heritage) {
    layerInstances.heritage = L.geoJSON(layerData.heritage, {
      // Sembunyikan Point agar tidak muncul sebagai marker biru default Leaflet
      pointToLayer: () => L.circleMarker([0, 0], { radius: 0, opacity: 0, fillOpacity: 0 }),
      onEachFeature: function (feature, layer) {
        if (feature.properties?.name) {
          layer.bindPopup(makePopup(feature.properties, "#e74c3c", "🏛"), { maxWidth: 240 });
        }
      }
    }).addTo(map);
    setLayerInstance('heritage', layerInstances.heritage);
  }


  if (layerData.buildings) {
    layerInstances.buildings = L.geoJSON(layerData.buildings, {
      style: { color: "#8a5c0a", weight: 1, fillColor: "#ba8030", fillOpacity: 0.2 }
    }).addTo(map);
    setLayerInstance('buildings', layerInstances.buildings);
  }

  if (layerData.rivers) {
    layerInstances.rivers = L.geoJSON(layerData.rivers, {
      style: { color: "#1a4a7a", weight: 3, opacity: 0.55 }
    }).addTo(map);
    setLayerInstance('rivers', layerInstances.rivers);
  }

  if (layerData.royal) {
    layerInstances.royal = L.geoJSON(layerData.royal, {
      style: { color: "#5a2a0a", weight: 2, fillColor: "#8b4513", fillOpacity: 0.18, dashArray: "5 4" }
    }).addTo(map);
    setLayerInstance('royal', layerInstances.royal);
  }

  if (layerData.settlement) {
    layerInstances.settlement = L.geoJSON(layerData.settlement, {
      style: { color: "#3d6614", weight: 1.5, fillColor: "#639922", fillOpacity: 0.14, dashArray: "4 4" }
    }).addTo(map);
    setLayerInstance('settlement', layerInstances.settlement);
  }

  if (layerData.boundary) {
    layerInstances.boundary = L.geoJSON(layerData.boundary, {
      style: { color: "#6b5a3a", weight: 2, fill: false, dashArray: "7 5", opacity: 0.55 }
    }).addTo(map);
    setLayerInstance('boundary', layerInstances.boundary);
  }

  // Listen to layer toggle events
  on(EVENTS.LAYER_TOGGLE, ({ layerId, on }) => {
    const lf = layerInstances[layerId];
    if (!lf) return;
    
    if (on) {
      if (!map.hasLayer(lf)) map.addLayer(lf);
    } else {
      if (map.hasLayer(lf)) map.removeLayer(lf);
    }
  });
}
