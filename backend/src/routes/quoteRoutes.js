import { Router } from 'express';
import { getQuote, getQuickEstimate } from '../controllers/quoteController.js';

const router = Router();

// POST /api/quote  — full PCB quote with itemized breakdown
router.post('/', getQuote);

// GET  /api/quote/estimate — quick homepage widget estimate
router.get('/estimate', getQuickEstimate);

export default router;

