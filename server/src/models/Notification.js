import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g. "ORDER_UPDATE", "SYSTEM_ALERT"
  message: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  read: { type: Boolean, default: false }
}, { timestamps: true });

// Fast lookup for unread notifications per user
notificationSchema.index({ recipientId: 1, read: 1 });

export default mongoose.model('Notification', notificationSchema);
