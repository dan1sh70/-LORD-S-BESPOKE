import express from 'express';
import { createOrder, getOrders, transitionOrder } from './orderController.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { scopeToTenant } from '../../middleware/tenantScope.js';

const router = express.Router();

// Apply auth and tenant scoping to all order routes
router.use(requireAuth);
router.use(scopeToTenant);

router.route('/')
  .get(getOrders)
  .post(requireRole(['SHOP', 'SUPER_ADMIN']), createOrder);

// The universal transition endpoint that goes through the State Machine guard
router.patch('/:id/transition', transitionOrder);

export default router;
