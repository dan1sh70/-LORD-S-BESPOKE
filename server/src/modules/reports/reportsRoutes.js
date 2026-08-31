import express from 'express';
import { getOrderStats, getRevenueReport } from './reportsController.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { scopeToTenant } from '../../middleware/tenantScope.js';

const router = express.Router();

router.use(requireAuth);

router.get('/orders', scopeToTenant, getOrderStats);
router.get('/revenue', requireRole(['SUPER_ADMIN']), getRevenueReport);

export default router;
