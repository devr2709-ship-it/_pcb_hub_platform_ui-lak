import { Router } from 'express';
import {
  getAllOrders,
  getOrderById,
  placeOrder
} from '../controllers/ordersController.js';

const router = Router();

// GET  /api/orders          — all orders list (admin)
router.get('/', getAllOrders);

// GET  /api/orders/:orderId — live order tracking by ID
router.get('/:orderId', getOrderById);

// POST /api/orders          — place new PCB fabrication order
router.post('/', placeOrder);

export default router;

