import Order from '../../models/Order.js';
import { assertTransition } from '../../services/orderStateMachine.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (SHOP, SUPER_ADMIN)
export const createOrder = async (req, res) => {
  try {
    const { customerId, garmentType, alterationDetails, priority, deliveryDate } = req.body;
    
    // Generate simple order number
    const orderNumber = 'ORD-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const order = await Order.create({
      orderNumber,
      shopId: req.user._id,
      customerId,
      garmentType,
      alterationDetails,
      priority,
      deliveryDate,
      status: 'CREATED',
      statusHistory: [{ status: 'CREATED', changedBy: req.user._id, role: req.user.role, note: 'Initial Creation' }]
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating order', error: error.message });
  }
};

// @desc    Get orders (Scoped automatically by tenantScope middleware)
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    // req.tenantFilter is injected by middleware
    const orders = await Order.find(req.tenantFilter).sort('-createdAt');
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching orders', error: error.message });
  }
};

// @desc    Transition Order Status (The core state machine handler)
// @route   PATCH /api/orders/:id/transition
// @access  Private
export const transitionOrder = async (req, res) => {
  try {
    const { nextStatus, note, tailorId, deliveryBoyId, progressPercent, qcPassed, qcReason } = req.body;
    
    // Apply tenant filter so e.g. a Shop cannot transition another shop's order
    const order = await Order.findOne({ _id: req.params.id, ...req.tenantFilter });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found or access denied' });

    // 1. Guard check: Is this transition legal for this user?
    try {
      assertTransition(order.status, nextStatus, req.user.role);
    } catch (validationError) {
      return res.status(409).json({ success: false, message: validationError.message });
    }

    // 2. Apply additional state mutations based on the target state
    const updatePayload = {
      $set: { status: nextStatus },
      $push: {
        statusHistory: {
          status: nextStatus,
          changedBy: req.user._id,
          role: req.user.role,
          note: note || `Transitioned to ${nextStatus}`
        }
      }
    };

    if (nextStatus === 'TAILOR_ASSIGNED' && tailorId) {
      updatePayload.$set.tailorId = tailorId;
    }
    if (nextStatus === 'PICKUP_ASSIGNED' && deliveryBoyId) {
      updatePayload.$set.pickupDeliveryBoyId = deliveryBoyId;
    }
    if (nextStatus === 'WORK_IN_PROGRESS' && progressPercent !== undefined) {
      if (![0, 25, 50, 75, 90, 100].includes(Number(progressPercent))) {
        return res.status(400).json({ success: false, message: 'Invalid progress percent value' });
      }
      if (Number(progressPercent) < (order.progressPercent || 0)) {
        return res.status(400).json({ success: false, message: 'Progress cannot go backwards' });
      }
      updatePayload.$set.progressPercent = progressPercent;
    }
    if (nextStatus === 'QC_PASSED' || nextStatus === 'QC_FAILED') {
      updatePayload.$set.qcResult = {
        passed: nextStatus === 'QC_PASSED',
        reason: qcReason,
        checkedBy: req.user._id,
        checkedAt: new Date()
      };
    }

    // 3. Mutate State Atomically (Precondition: status has not changed since findOne)
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.params.id, status: order.status, ...req.tenantFilter },
      updatePayload,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(409).json({ success: false, message: 'Conflict: Order status was modified concurrently' });
    }

    res.json({ success: true, data: updatedOrder });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating order', error: error.message });
  }
};
