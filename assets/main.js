// ============================================================
// main.js — Application entry point
// WebGIS Arkeologi Vertikal · Kotagede
// ============================================================

import { initApp } from "./core/app.js";

// Initialize the application
// As an ES module (type="module"), this script runs after the document is parsed.
initApp().catch(console.error);
