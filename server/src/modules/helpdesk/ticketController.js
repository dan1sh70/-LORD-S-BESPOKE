import Ticket from '../../models/Ticket.js';

// @desc    Create a new support ticket
// @route   POST /api/tickets
// @access  Private
export const createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const ticket = await Ticket.create({
      raisedBy: req.user._id,
      subject,
      thread: [{ author: req.user._id, message }]
    });
    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating ticket', error: error.message });
  }
};

// @desc    Get tickets (Scoped to user, Admin sees all)
// @route   GET /api/tickets
// @access  Private
export const getTickets = async (req, res) => {
  try {
    const query = req.user.role === 'SUPER_ADMIN' ? {} : { raisedBy: req.user._id };
    const tickets = await Ticket.find(query).sort('-createdAt');
    res.json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching tickets', error: error.message });
  }
};

// @desc    Reply to a ticket
// @route   POST /api/tickets/:id/reply
// @access  Private
export const replyTicket = async (req, res) => {
  try {
    const { message } = req.body;
    const query = req.user.role === 'SUPER_ADMIN' ? { _id: req.params.id } : { _id: req.params.id, raisedBy: req.user._id };
    
    const ticket = await Ticket.findOneAndUpdate(
      query,
      { $push: { thread: { author: req.user._id, message } } },
      { new: true }
    );
    
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error replying to ticket', error: error.message });
  }
};
