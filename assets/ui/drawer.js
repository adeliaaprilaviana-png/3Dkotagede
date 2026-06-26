// ============================================================
// ui/drawer.js — Drawer open/close logic and overlay handling
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

/**
 * Opens the drawer with the given element id, closes any
 * currently open drawer, and shows the overlay.
 * Also updates the topnav active state.
 *
 * @param {string} id — element id of the drawer to open
 */
export function openDrawer(id) {
  // Close any open drawer first
  document.querySelectorAll(".drawer.open").forEach(d => d.classList.remove("open"));
  document.getElementById(id)?.classList.add("open");

  const overlay = document.getElementById("drawerOverlay");
  overlay.classList.add("open");

  // Update nav active state
  document.querySelectorAll(".topnav a").forEach(a =>
    a.classList.toggle("active", a.dataset.drawer === id)
  );
}

/**
 * Closes all open drawers and hides the overlay.
 * Resets topnav so only the "Peta & Model" link is active.
 */
export function closeDrawers() {
  document.querySelectorAll(".drawer.open").forEach(d => d.classList.remove("open"));

  const overlay = document.getElementById("drawerOverlay");
  overlay.classList.remove("open");

  document.querySelectorAll(".topnav a").forEach(a => {
    a.classList.toggle("active", !a.dataset.drawer);
  });
}
