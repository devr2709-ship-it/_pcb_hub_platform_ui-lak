/**
 * PCB Hub API Client
 * Centralised fetch wrapper for all backend REST endpoints.
 * Base URL reads from VITE_API_URL env var, falls back to localhost:5000.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiFetch = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `API error: ${response.status}`);
  }
  return data;
};

// ─── Quote & Pricing ─────────────────────────────────────────────────────────

/** Full itemized PCB fabrication quote */
export const fetchQuote = (pcbConfig) =>
  apiFetch('/api/quote', { method: 'POST', body: JSON.stringify(pcbConfig) });

/** Lightweight quick estimate for the homepage widget */
export const fetchQuickEstimate = ({ layers, length, width, quantity }) =>
  apiFetch(`/api/quote/estimate?layers=${layers}&length=${length}&width=${width}&quantity=${quantity}`);

// ─── Gerber / DFM ────────────────────────────────────────────────────────────

/** Upload a Gerber ZIP file for automated DFM rule-check analysis */
export const uploadGerberFile = (file) => {
  const formData = new FormData();
  formData.append('gerberFile', file);
  return apiFetch('/api/gerber/upload', {
    method: 'POST',
    headers: {}, // Let browser set multipart boundary
    body: formData
  });
};

/** Run DFM analysis on the built-in sample demo board (no file needed) */
export const runSampleDfm = () =>
  apiFetch('/api/gerber/sample-dfm', { method: 'POST' });

// ─── Orders ──────────────────────────────────────────────────────────────────

/** Place a new PCB fabrication order */
export const placeOrder = (payload) =>
  apiFetch('/api/orders', { method: 'POST', body: JSON.stringify(payload) });

/** Track an existing order by its ID (e.g. "PCB-84920") */
export const trackOrder = (orderId) =>
  apiFetch(`/api/orders/${orderId}`);

/** Fetch all orders (admin view) */
export const fetchAllOrders = () =>
  apiFetch('/api/orders');

// ─── Catalog ─────────────────────────────────────────────────────────────────

/** All available PCB product types */
export const fetchProducts = () =>
  apiFetch('/api/catalog/products');

/** Surface finish / metallurgy plating options */
export const fetchSurfaceFinishes = () =>
  apiFetch('/api/catalog/surface-finishes');

/** Turnaround speed tier options */
export const fetchTurnaroundOptions = () =>
  apiFetch('/api/catalog/turnaround');

// ─── Consultation & Newsletter ───────────────────────────────────────────────

/** Submit a hardware engineering consultation request */
export const submitConsultation = (payload) =>
  apiFetch('/api/consultations', { method: 'POST', body: JSON.stringify(payload) });

/** Subscribe to Engineering Pulse newsletter */
export const subscribeNewsletter = (email) =>
  apiFetch('/api/catalog/newsletter', { method: 'POST', body: JSON.stringify({ email }) });

// ─── Health ──────────────────────────────────────────────────────────────────

export const checkHealth = () =>
  apiFetch('/api/health');

