import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['OrderUpdate', 'WalletCredit', 'System', 'HelpDesk'],
    required: true
  },
  message: { type: String, required: true },
  readStatus: { type: Boolean, default: false },
  actionLink: { type: String } // e.g. /orders/ORD-123
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
