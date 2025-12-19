import express from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { orderValidation } from '../middleware/validation.js';

const router = express.Router();

router.post('/', protect, orderValidation, createOrder);
router.get('/', protect, getOrders);
router.get('/admin/all', protect, authorize('admin'), getAllOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

export default router;
