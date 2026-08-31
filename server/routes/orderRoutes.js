import express from 'express';
import { createOrder, getOrders, updateOrder } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getOrders)
  .post(authorize('Shop', 'Super Admin'), createOrder);

router.route('/:id')
  .put(updateOrder);

export default router;
