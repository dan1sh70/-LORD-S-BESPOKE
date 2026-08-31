import { getOrCreateWallet, processTransaction } from '../../services/walletService.js';
import Withdrawal from '../../models/Withdrawal.js';

// @desc    Get current user's wallet
// @route   GET /api/wallet/me
// @access  Private
export const getMyWallet = async (req, res) => {
  try {
    const wallet = await getOrCreateWallet(req.user._id);
    res.json({ success: true, data: wallet });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching wallet', error: error.message });
  }
};

// @desc    Request a withdrawal (puts it in PENDING state)
// @route   POST /api/wallet/withdraw
// @access  Private
export const requestWithdrawal = async (req, res) => {
  try {
    const { amount, bucket } = req.body;
    const targetBucket = bucket || 'mainWallet';

    // 1. Immediately debit the wallet to prevent double-spending
    const wallet = await processTransaction({
      userId: req.user._id,
      type: 'DEBIT',
      bucket: targetBucket,
      amount,
      reason: 'Withdrawal Requested (Pending)'
    });

    // 2. Create the withdrawal request
    const withdrawal = await Withdrawal.create({
      userId: req.user._id,
      amount,
      bucket: targetBucket,
      status: 'PENDING'
    });

    res.json({ success: true, message: 'Withdrawal requested successfully', data: withdrawal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all pending withdrawals (Admin only)
// @route   GET /api/wallet/withdrawals
// @access  Private (SUPER_ADMIN)
export const getPendingWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ status: 'PENDING' }).populate('userId', 'name mobile role').sort('createdAt');
    res.json({ success: true, count: withdrawals.length, data: withdrawals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching withdrawals', error: error.message });
  }
};

// @desc    Approve or Reject a withdrawal (Admin only)
// @route   PATCH /api/wallet/withdrawals/:id
// @access  Private (SUPER_ADMIN)
export const processWithdrawalAdmin = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be APPROVED or REJECTED.' });
    }

    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal || withdrawal.status !== 'PENDING') {
      return res.status(404).json({ success: false, message: 'Pending withdrawal not found' });
    }

    withdrawal.status = status;
    withdrawal.processedAt = new Date();
    withdrawal.processedBy = req.user._id;

    if (status === 'REJECTED') {
      withdrawal.rejectionReason = rejectionReason;
      
      // Refund the user
      await processTransaction({
        userId: withdrawal.userId,
        type: 'CREDIT',
        bucket: withdrawal.bucket,
        amount: withdrawal.amount,
        reason: `Withdrawal Rejected: ${rejectionReason || 'No reason provided'}`
      });
    }

    await withdrawal.save();
    res.json({ success: true, message: `Withdrawal ${status}`, data: withdrawal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error processing withdrawal', error: error.message });
  }
};
