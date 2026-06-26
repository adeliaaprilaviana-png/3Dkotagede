// ============================================================
// viewer3d/controls.js — Mouse, touch, wheel, and zoom/rotate
//                        controls for the 3D viewer canvas
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

/* global THREE */

/**
 * Attaches orbital-control event listeners to a canvas element.
 *
 * Returns:
 *   - `drag`         : getter — whether the user is currently dragging
 *   - `phi`/`theta`  : current spherical angles (read-write)
 *   - `radius`       : current orbit radius (read-write)
 *   - `updateCamera` : function to call after externally mutating angles
 *
 * @param {HTMLCanvasElement} canvas
 * @param {THREE.PerspectiveCamera} camera
 * @returns {{ isDragging: ()=>boolean, phi: number, theta: number, radius: number, updateCamera: Function }}
 */
export function attachControls(canvas, camera) {
  let drag = false;
  let lastX = 0, lastY = 0;
  let phi = 0.6, theta = 0.5, radius = 9;

  function updateCamera() {
    camera.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
    camera.lookAt(0, 0.5, 0);
  }

  // ── Mouse ────────────────────────────────────────────────────
  canvas.addEventListener("mousedown", e => {
    drag = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  canvas.addEventListener("mousemove", e => {
    if (!drag) return;
    theta -= (e.clientX - lastX) * 0.012;
    phi    = Math.max(0.15, Math.min(1.4, phi + (e.clientY - lastY) * 0.010));
    lastX = e.clientX;
    lastY = e.clientY;
    updateCamera();
  });

  canvas.addEventListener("mouseup",    () => { drag = false; });
  canvas.addEventListener("mouseleave", () => { drag = false; });

  // ── Wheel (zoom) ─────────────────────────────────────────────
  canvas.addEventListener("wheel", e => {
    radius = Math.max(4, Math.min(16, radius + e.deltaY * 0.01));
    updateCamera();
  });

  // ── Touch ────────────────────────────────────────────────────
  let lastTouchX = 0, lastTouchY = 0;

  canvas.addEventListener("touchstart", e => {
    lastTouchX = e.touches[0].clientX;
    lastTouchY = e.touches[0].clientY;
  });

  canvas.addEventListener("touchmove", e => {
    e.preventDefault();
    theta -= (e.touches[0].clientX - lastTouchX) * 0.012;
    phi    = Math.max(0.15, Math.min(1.4, phi + (e.touches[0].clientY - lastTouchY) * 0.010));
    lastTouchX = e.touches[0].clientX;
    lastTouchY = e.touches[0].clientY;
    updateCamera();
  }, { passive: false });

  // Expose state and updateCamera so initViewer can use them
  return {
    isDragging:   () => drag,
    get phi()     { return phi;    },
    set phi(v)    { phi = v;       },
    get theta()   { return theta;  },
    set theta(v)  { theta = v;     },
    get radius()  { return radius; },
    set radius(v) { radius = v;    },
    updateCamera,
  };
}
