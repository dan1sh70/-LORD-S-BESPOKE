import express from 'express';
import { getPrices, updatePrice } from './priceMasterController.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getPrices);
router.patch('/', requireRole(['SUPER_ADMIN']), updatePrice);

export default router;
