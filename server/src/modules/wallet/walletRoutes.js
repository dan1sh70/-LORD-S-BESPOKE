import express from 'express';
import { getMyWallet, requestWithdrawal, getPendingWithdrawals, processWithdrawalAdmin } from './walletController.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';

const router = express.Router();

router.use(requireAuth);

router.get('/me', getMyWallet);
router.post('/withdraw', requestWithdrawal);

// Admin endpoints
router.get('/withdrawals', requireRole(['SUPER_ADMIN']), getPendingWithdrawals);
router.patch('/withdrawals/:id', requireRole(['SUPER_ADMIN']), processWithdrawalAdmin);

export default router;
