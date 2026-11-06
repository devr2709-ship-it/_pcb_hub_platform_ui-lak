import { Router } from 'express';
import {
  getProducts,
  getSurfaceFinishes,
  getTurnaroundOptions,
  subscribeNewsletter
} from '../controllers/catalogController.js';

const router = Router();

// GET  /api/catalog/products         — all PCB product types
router.get('/products', getProducts);

// GET  /api/catalog/surface-finishes — metallurgy / plating options
router.get('/surface-finishes', getSurfaceFinishes);

// GET  /api/catalog/turnaround       — turnaround speed tier options
router.get('/turnaround', getTurnaroundOptions);

// POST /api/catalog/newsletter       — Engineering Pulse newsletter subscribe
router.post('/newsletter', subscribeNewsletter);

export default router;

