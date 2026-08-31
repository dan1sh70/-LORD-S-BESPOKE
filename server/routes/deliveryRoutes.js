import express from 'express';
import { getAssignedOrders, updateOrderStatus } from '../controllers/deliveryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes in this file
router.use(protect);
router.use(authorize('Delivery Boy', 'Super Admin'));

router.route('/orders')
  .get(getAssignedOrders);

router.route('/orders/:id/status')
  .put(updateOrderStatus);

export default router;
