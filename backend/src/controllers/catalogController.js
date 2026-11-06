import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const NEWSLETTER_FILE = join(__dirname, '../../data/newsletter.json');

const readSubscribers = () => {
  try { return JSON.parse(readFileSync(NEWSLETTER_FILE, 'utf8')); }
  catch { return []; }
};

const PCB_PRODUCTS = [
  { id: 'single-sided', name: 'Single-Sided PCB', layers: 1, basePriceINR: 199, tag: '1-LAYER', desc: 'Simple analog power & LED indicator boards, FR-4 1.6mm standard core.' },
  { id: 'double-sided', name: 'Double-Sided PCB', layers: 2, basePriceINR: 299, tag: '2-LAYER', popular: true, desc: 'Most popular prototype standard, plated through-hole (PTH) vias, HASL/ENIG finish.' },
  { id: 'multilayer-4', name: 'Multilayer 4L', layers: 4, basePriceINR: 899, tag: '4-LAYER', desc: 'BGA breakout, power/ground planes, embedded controlled impedance transmission lines.' },
  { id: 'multilayer-6', name: 'Multilayer 6L', layers: 6, basePriceINR: 1899, tag: '6-LAYER', desc: 'High-speed PCIe/Ethernet interface, 90Ω/100Ω matched differential pairs.' },
  { id: 'flex-pcb', name: 'Flexible Polyimide', layers: 2, basePriceINR: 799, tag: 'FLEX/FPC', desc: 'Ultra-thin 0.1–0.15mm polyimide substrate for wearables and medical devices.' },
  { id: 'rigid-flex', name: 'Rigid-Flex Stack', layers: 4, basePriceINR: 1499, tag: 'RIGID-FLEX', desc: 'Hybrid FR-4 / polyimide zone combination for compact aerospace assemblies.' },
  { id: 'aluminum-pcb', name: 'Metal Core (MCPCB)', layers: 1, basePriceINR: 499, tag: 'AL-CORE', desc: 'Aluminum 1–3W/mK core for high-wattage LED drivers and thermal management.' },
  { id: 'dev-shields', name: 'Dev Board Shields', layers: 2, basePriceINR: 349, tag: 'ESP32/RP2040', desc: 'Standard headers, Arduino, Raspberry Pi, and ESP32 expansion pinouts.' },
  { id: 'power-supply', name: 'Power Supply PCB', layers: 2, basePriceINR: 599, tag: '2OZ-COPPER', desc: 'Heavy copper 2oz/3oz, wide track spacing, high-voltage isolation clearances.' },
  { id: 'sensor-pcb', name: 'Sensor PCB', layers: 2, basePriceINR: 449, tag: 'ULTRA-COMPACT', desc: 'Ultra-compact form factors with low-noise analog ground plane partitioning.' }
];

const SURFACE_FINISHES = [
  { id: 'hasl', name: 'Lead-Free HASL', desc: 'Sn/Cu/Ni Hot Air Solder Level', extraPriceINR: 0 },
  { id: 'enig', name: 'ENIG Gold', desc: 'Electroless Ni / Immersion Au (2µ")', extraPriceINR: 150 },
  { id: 'osp', name: 'OSP Organic', desc: 'Solderability Preservative', extraPriceINR: 80 },
  { id: 'silver', name: 'Immersion Silver', desc: 'High Frequency RF Grade', extraPriceINR: 210 }
];

const TURNAROUND_OPTIONS = [
  { id: 'standard', label: '3–4 Business Days', extraPriceINR: 0 },
  { id: 'express', label: '24–48 Hours (Express)', extraPriceINR: 199 }
];

/**
 * GET /api/catalog/products
 * Returns all PCB product types with pricing info
 */
export const getProducts = (_req, res) => {
  return res.json({ success: true, products: PCB_PRODUCTS });
};

/**
 * GET /api/catalog/surface-finishes
 */
export const getSurfaceFinishes = (_req, res) => {
  return res.json({ success: true, finishes: SURFACE_FINISHES });
};

/**
 * GET /api/catalog/turnaround
 */
export const getTurnaroundOptions = (_req, res) => {
  return res.json({ success: true, options: TURNAROUND_OPTIONS });
};

/**
 * POST /api/catalog/newsletter
 * Subscribe to Engineering Pulse newsletter
 */
export const subscribeNewsletter = (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Valid email address is required.' });
  }
  const subscribers = readSubscribers();
  if (subscribers.some((s) => s.email === email)) {
    return res.json({ success: true, message: 'You are already subscribed to Engineering Pulse.' });
  }
  subscribers.push({ email, subscribedAt: new Date().toISOString() });
  try {
    writeFileSync(NEWSLETTER_FILE, JSON.stringify(subscribers, null, 2), 'utf8');
  } catch {}
  return res.status(201).json({
    success: true,
    message: 'Successfully subscribed to PCB Hub Engineering Pulse. Watch your inbox for DFM updates and IPC whitepapers.'
  });
};

