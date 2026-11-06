import { Router } from 'express';
import {
  submitConsultation,
  getAllConsultations
} from '../controllers/consultationController.js';

const router = Router();

// POST /api/consultations   — submit engineering design help request
router.post('/', submitConsultation);

// GET  /api/consultations   — list all requests (admin view)
router.get('/', getAllConsultations);

export default router;

