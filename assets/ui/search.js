// ============================================================
// ui/search.js — Search bar functionality
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

import { getState, setActiveLocation } from "../core/state.js";

/**
 * Initializes the search bar functionality
 */
export function initSearch() {
  const input = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("searchResults");
  
  if (!input || !resultsContainer) return;

  input.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length === 0) {
      resultsContainer.classList.remove("active");
      return;
    }
    
    const state = getState();
    const results = state.locations.filter(loc => 
      loc.name.toLowerCase().includes(query) ||
      (loc.category && loc.category.toLowerCase().includes(query)) ||
      (loc.desc1600 && loc.desc1600.toLowerCase().includes(query)) ||
      (loc.desc2025 && loc.desc2025.toLowerCase().includes(query))
    );
    
    renderResults(results, resultsContainer);
  });
  
  // Close search results when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".sb-search")) {
      resultsContainer.classList.remove("active");
    }
  });
}

function renderResults(results, container) {
  if (results.length === 0) {
    container.innerHTML = `<div class="search-item"><div class="si-title">Tidak ada hasil</div></div>`;
    container.classList.add("active");
    return;
  }
  
  container.innerHTML = results.map(loc => `
    <div class="search-item" data-id="${loc.id}">
      <div class="si-title">${loc.icon} ${loc.name}</div>
      <div class="si-sub">${loc.category || ''}</div>
    </div>
  `).join("");
  
  container.classList.add("active");
  
  // Add click listeners to results
  container.querySelectorAll(".search-item[data-id]").forEach(item => {
    item.addEventListener("click", () => {
      const id = item.dataset.id;
      setActiveLocation(id, true); // true = flyTo
      container.classList.remove("active");
      document.getElementById("searchInput").value = "";
    });
  });
}
