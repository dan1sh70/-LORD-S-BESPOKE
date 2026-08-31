import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

// @desc    Get user's wallet balances
// @route   GET /api/wallet/balance
// @access  Private (All Roles)
export const getWalletBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('wallet');
    res.json(user.wallet);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching wallet balance' });
  }
};

// @desc    Get user's transaction history
// @route   GET /api/wallet/transactions
// @access  Private (All Roles)
export const getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort('-createdAt')
      .limit(50);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching transactions' });
  }
};
