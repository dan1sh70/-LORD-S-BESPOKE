import express from 'express';
import { getMyTree } from './referralController.js';
import { requireAuth } from '../../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);
router.get('/me/tree', getMyTree);

export default router;
