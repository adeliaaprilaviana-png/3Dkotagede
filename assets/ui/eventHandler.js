// ============================================================
// ui/eventHandler.js — All global event listeners
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

import { setYear, toggleLayer } from "../core/state.js";
import { openDrawer, closeDrawers } from "./drawer.js";

/**
 * Registers all application-level event listeners.
 * Must be called after the DOM is fully ready and all modules
 * have been initialised.
 */
export function initEventHandlers() {
  // ── Timeline slider (live chip update + commit) ──────────────
  const slider = document.getElementById("slider");
  if (slider) {
    slider.addEventListener("input", e => {
      // Live chip update without committing full state change
      document.getElementById("yrChip").textContent = e.target.value;
    });

    slider.addEventListener("change", e => {
      // Commit state change when user releases slider
      setYear(+e.target.value);
    });
  }

  // ── Era buttons ──────────────────────────────────────────────
  document.querySelectorAll(".era-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setYear(+btn.dataset.era);
    });
  });

  // ── Layer toggles ─────────────────────────────────────────────
  document.querySelectorAll(".tog").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.layer;
      toggleLayer(id);
      
      // Update UI button state
      if (btn.hasAttribute("data-off")) {
        btn.removeAttribute("data-off");
      } else {
        btn.setAttribute("data-off", "");
      }
    });
  });

  // ── Drawer — nav links with data-drawer ──────────────────────
  document.querySelectorAll(".topnav a[data-drawer]").forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      const id = a.dataset.drawer;
      const alreadyOpen = document.getElementById(id)?.classList.contains("open");
      if (alreadyOpen) closeDrawers();
      else openDrawer(id);
    });
  });

  // ── Drawer — "Peta & Model" nav link (no data-drawer) ────────
  document.querySelectorAll(".topnav a:not([data-drawer])").forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      closeDrawers();
    });
  });

  // ── Drawer — close buttons (event delegation) ────────────────
  document.body.addEventListener("click", e => {
    const btn = e.target.closest("[data-close]");
    if (btn) closeDrawers();
  });

  // ── Drawer — overlay click ────────────────────────────────────
  const overlay = document.getElementById("drawerOverlay");
  if (overlay) {
    overlay.addEventListener("click", () => closeDrawers());
  }

  // ── Drawer — Escape key ───────────────────────────────────────
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeDrawers();
  });
}
