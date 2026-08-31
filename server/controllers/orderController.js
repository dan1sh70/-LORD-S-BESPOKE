import Order from '../models/Order.js';

// @desc    Create new alteration order
// @route   POST /api/orders
// @access  Private (Shop, Super Admin)
export const createOrder = async (req, res) => {
  try {
    const { customerId, garmentType, alterationDetails, price, priority, deliveryDate } = req.body;
    
    // Generate simple order number (in prod, use a sequence generator)
    const orderNumber = 'ORD-' + Math.floor(1000 + Math.random() * 9000);

    const order = await Order.create({
      orderNumber,
      customerId,
      shopId: req.user._id,
      garmentType,
      alterationDetails,
      price,
      priority,
      deliveryDate,
      status: 'Order Created',
      statusHistory: [{ status: 'Order Created', changedBy: req.user._id, reason: 'Initial Creation' }]
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating order' });
  }
};

// @desc    Get orders based on role scope
// @route   GET /api/orders
// @access  Private (All Roles)
export const getOrders = async (req, res) => {
  try {
    let query = {};
    const { role, _id } = req.user;

    if (role === 'Shop') query = { shopId: _id };
    else if (role === 'Master') query = { masterId: _id };
    else if (role === 'Tailor') query = { tailorId: _id };
    else if (role === 'Delivery Boy') query = { $or: [{ deliveryBoyPickupId: _id }, { deliveryBoyReturnId: _id }] };
    // Super Admin sees all (query remains {})

    const orders = await Order.find(query).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// @desc    Update order status or assign tailor
// @route   PUT /api/orders/:id
// @access  Private
export const updateOrder = async (req, res) => {
  try {
    const { status, tailorId, qcResult, reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status) {
      order.status = status;
      order.statusHistory.push({ status, changedBy: req.user._id, reason: reason || 'Status updated' });
    }
    if (tailorId) order.tailorId = tailorId;
    if (qcResult) order.qcResult = qcResult;

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating order' });
  }
};
