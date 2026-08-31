import express from 'express';
import { getWalletBalance, getTransactionHistory } from '../controllers/walletController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All wallet routes are protected (Any logged in user can see their own wallet)
router.use(protect);

router.get('/balance', getWalletBalance);
router.get('/transactions', getTransactionHistory);

export default router;
