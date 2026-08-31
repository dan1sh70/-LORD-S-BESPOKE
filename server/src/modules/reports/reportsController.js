import Order from '../../models/Order.js';

// @desc    Get order statistics (Scoped automatically by tenantScope)
// @route   GET /api/reports/orders
// @access  Private
export const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $match: req.tenantFilter },
      { $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$price' }
      }}
    ]);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching report', error: error.message });
  }
};

// @desc    Get Revenue report (Admin only)
// @route   GET /api/reports/revenue
// @access  Private (SUPER_ADMIN)
export const getRevenueReport = async (req, res) => {
  try {
    // In a real app, this would aggregate across Wallet Transactions.
    // For MVP, we aggregate completed orders.
    const revenue = await Order.aggregate([
      { $match: { status: 'ORDER_CLOSED' } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          dailyRevenue: { $sum: '$price' },
          ordersCompleted: { $sum: 1 }
      }},
      { $sort: { _id: -1 } },
      { $limit: 30 } // Last 30 days
    ]);
    res.json({ success: true, data: revenue });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching revenue report', error: error.message });
  }
};
