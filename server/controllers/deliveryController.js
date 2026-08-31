import Order from '../models/Order.js';

// @desc    Get orders assigned to the logged-in delivery boy
// @route   GET /api/delivery/orders
// @access  Private (Delivery Boy only)
export const getAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { deliveryBoyPickupId: req.user._id, status: { $in: ['Pickup Assigned', 'Ready For Delivery', 'Delivery Boy Assigned'] } },
        { deliveryBoyReturnId: req.user._id, status: { $in: ['Ready For Delivery', 'Delivery Boy Assigned'] } }
      ]
    }).populate('shopId', 'name mobile address')
      .populate('masterId', 'workshopName address mobile');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching assigned orders' });
  }
};

// @desc    Update order status (Pickup or Deliver)
// @route   PUT /api/delivery/orders/:id/status
// @access  Private (Delivery Boy only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Picked Up', 'Workshop Delivered', 'Collected From Workshop', 'Delivered To Shop'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status update for Delivery Boy' });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      changedBy: req.user._id,
      reason: 'Status updated by Delivery Boy'
    });

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating order status' });
  }
};
